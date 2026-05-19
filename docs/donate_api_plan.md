# 寄付 API（skuro-api）実装計画 — 2026-05-07

> 本ファイルは `docs/`（git untracked）に置く作業メモ。
> フロント側（このリポジトリ）の Donate ページがモック決済で動いている前提で、
> 後続セッションが skuro-api リポジトリを新規作成して PayPal Orders v2 を繋ぎに行くための実装ガイド。

---

## 0. 前提

- 親プラン: `~/.claude/plans/effervescent-riding-lovelace.md`
- フロント実装は `feature/donate` ブランチ ＋ PR で main にマージ済み（または進行中）
- skuro 側の `src/lib/donate.ts` が `isPayPalConfigured` (= `VITE_PAYPAL_CLIENT_ID` と `VITE_DONATE_API_BASE` の両方が設定されているか) で本番 API / モックを切り替える設計
- バックエンドのリポジトリ: 未作成。ローカルパス `/Users/kurodashion/dev/skuro-api`、GitHub に新規 `skuro1115/skuro-api` を作る想定

---

## 1. ユーザー（オーナー）が事前に用意するもの

実装を始める前に skuro リポジトリのオーナーが手配する必要があるもの。コードでは肩代わりできない。

### 必須

1. **PayPal Business アカウント**（個人 → Business アップグレード可、無料）
   - JPY 受取、銀行口座連携。
2. **PayPal Developer Dashboard でアプリ作成**（https://developer.paypal.com/）
   - Sandbox 用 / Live 用、それぞれ App を作成し `Client ID` と `Secret` を控える（4 値）。
3. **Vercel アカウント**（GitHub 連携、無料 Hobby プラン）
4. **新規リポジトリ `skuro1115/skuro-api`**（public/private 任意）→ Vercel に接続
5. **本人確認**（受取上限解除、PayPal 側）

### 推奨

6. プライバシーポリシーページ（PayPal への個人情報提供を明示）
7. 「リターンや対価は提供されません。任意のサポートです」の文言は Donate ページに既に実装済み

### 任意

8. 独自ドメイン（最初は `*.vercel.app` で十分）
9. レート制限（攻撃が出始めたら Vercel KV / Upstash Redis）

---

## 2. リポジトリ構成（skuro-api 側）

```
skuro-api/
├── api/
│   └── donate/
│       ├── create.ts        # POST /api/donate/create
│       └── capture.ts       # POST /api/donate/capture
├── lib/
│   ├── paypal.ts            # access_token 取得 + 環境ごとの base URL
│   ├── cors.ts              # Origin allowlist + preflight
│   └── validation.ts        # Zod スキーマ（amount 検証）
├── vercel.json              # runtime: nodejs20.x、CORS ヘッダ等
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

最小構成の `package.json`:
```json
{
  "name": "skuro-api",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vercel dev",
    "deploy": "vercel deploy --prod",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "zod": "^3.23.8"
  },
  "devDependencies": {
    "@types/node": "^20.12.0",
    "@vercel/node": "^3.2.0",
    "typescript": "^5.5.0",
    "vercel": "^37.0.0"
  }
}
```

---

## 3. 環境変数

### Vercel ダッシュボードで設定

| 変数 | 例 |
|---|---|
| `PAYPAL_CLIENT_ID` | `AYxxxx...`（sandbox or live） |
| `PAYPAL_CLIENT_SECRET` | `EHxxxx...`（sandbox or live） |
| `PAYPAL_ENV` | `sandbox` / `production` |
| `ALLOWED_ORIGINS` | `https://skuro1115.github.io,http://localhost:5173` |

Preview 環境（PR ごと）には sandbox 値、Production 環境には live 値を入れる。Preview 用 GH Pages は無いので、preview デプロイのテストはローカルから叩く形でよい。

### skuro 側

| 変数 | 例 |
|---|---|
| `VITE_PAYPAL_CLIENT_ID` | sandbox なら sandbox app の Client ID、本番なら live |
| `VITE_DONATE_API_BASE` | `https://skuro-api.vercel.app`（or `http://localhost:3000` for `vercel dev`） |

CI 用に GitHub Secrets としても登録し、`.github/workflows/deploy.yml` の `env:` で `npm run build` に注入。

---

## 4. 各ファイルの実装

### `lib/paypal.ts`

```ts
const SANDBOX = 'https://api-m.sandbox.paypal.com'
const LIVE = 'https://api-m.paypal.com'

export const PAYPAL_BASE = process.env.PAYPAL_ENV === 'production' ? LIVE : SANDBOX

let cachedToken: { token: string; expiresAt: number } | null = null

export async function getAccessToken(): Promise<string> {
  const now = Date.now()
  if (cachedToken && cachedToken.expiresAt - 60_000 > now) return cachedToken.token

  const id = process.env.PAYPAL_CLIENT_ID!
  const secret = process.env.PAYPAL_CLIENT_SECRET!
  if (!id || !secret) throw new Error('PayPal credentials not configured')

  const auth = Buffer.from(`${id}:${secret}`).toString('base64')
  const res = await fetch(`${PAYPAL_BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  })
  if (!res.ok) throw new Error(`PayPal token failed: ${res.status}`)
  const data = (await res.json()) as { access_token: string; expires_in: number }
  cachedToken = {
    token: data.access_token,
    expiresAt: now + data.expires_in * 1000,
  }
  return data.access_token
}
```

Vercel Functions は呼び出しごとにコールドスタートする可能性があるが、Warm 状態が保てる時間帯はキャッシュが効く。アクセス頻度が低ければ毎回 token 取得でも問題ない（PayPal の rate limit 内）。

### `lib/validation.ts`

```ts
import { z } from 'zod'

export const createSchema = z.object({
  amount: z.number().int().min(100).max(3000),
})

export const captureSchema = z.object({
  orderId: z.string().min(1).max(64).regex(/^[A-Z0-9-]+$/i),
})
```

下限 100 / 上限 3000 はフロント `src/lib/donate.ts` の `DONATION_MIN` / `DONATION_MAX` と一致させる。後で変えるならフロント側と合わせて変更。

### `lib/cors.ts`

```ts
import type { VercelRequest, VercelResponse } from '@vercel/node'

const allowed = (process.env.ALLOWED_ORIGINS ?? '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)

export function applyCors(req: VercelRequest, res: VercelResponse): boolean {
  const origin = req.headers.origin
  if (origin && allowed.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
    res.setHeader('Vary', 'Origin')
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  }
  if (req.method === 'OPTIONS') {
    res.status(204).end()
    return false
  }
  if (!origin || !allowed.includes(origin)) {
    res.status(403).json({ error: 'origin not allowed' })
    return false
  }
  return true
}
```

### `api/donate/create.ts`

```ts
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { applyCors } from '../../lib/cors'
import { getAccessToken, PAYPAL_BASE } from '../../lib/paypal'
import { createSchema } from '../../lib/validation'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!applyCors(req, res)) return
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method not allowed' })
    return
  }

  const parsed = createSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: 'invalid amount', issues: parsed.error.issues })
    return
  }

  try {
    const token = await getAccessToken()
    const ppRes = await fetch(`${PAYPAL_BASE}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: { currency_code: 'JPY', value: String(parsed.data.amount) },
            description: 'skuro 開発支援（任意のサポート）',
          },
        ],
        application_context: {
          shipping_preference: 'NO_SHIPPING',
          user_action: 'PAY_NOW',
        },
      }),
    })
    const data = (await ppRes.json()) as { id?: string; details?: unknown }
    if (!ppRes.ok || !data.id) {
      res.status(502).json({ error: 'paypal create failed', detail: data })
      return
    }
    res.status(200).json({ id: data.id })
  } catch (e) {
    res.status(500).json({ error: 'server error', message: String(e) })
  }
}
```

### `api/donate/capture.ts`

```ts
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { applyCors } from '../../lib/cors'
import { getAccessToken, PAYPAL_BASE } from '../../lib/paypal'
import { captureSchema } from '../../lib/validation'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!applyCors(req, res)) return
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method not allowed' })
    return
  }

  const parsed = captureSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: 'invalid orderId' })
    return
  }

  try {
    const token = await getAccessToken()
    const ppRes = await fetch(
      `${PAYPAL_BASE}/v2/checkout/orders/${parsed.data.orderId}/capture`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    )
    const data = (await ppRes.json()) as { id?: string; status?: string }
    if (!ppRes.ok) {
      res.status(502).json({ error: 'paypal capture failed', detail: data })
      return
    }
    res.status(200).json({ id: data.id ?? parsed.data.orderId, status: data.status ?? 'UNKNOWN' })
  } catch (e) {
    res.status(500).json({ error: 'server error', message: String(e) })
  }
}
```

### `vercel.json`

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "functions": {
    "api/**/*.ts": { "runtime": "nodejs20.x" }
  }
}
```

---

## 5. ローカル動作確認

### A. skuro-api 側

```bash
cd /Users/kurodashion/dev/skuro-api
npm install
cp .env.example .env.local   # PayPal sandbox client id/secret 等を埋める
vercel dev                   # → http://localhost:3000
```

- `vercel dev` 初回は Vercel CLI のログイン要求が来る → GitHub 連携でログイン

### B. skuro 側

```bash
cd /Users/kurodashion/dev/skuro
echo 'VITE_DONATE_API_BASE=http://localhost:3000' > .env.local
echo 'VITE_PAYPAL_CLIENT_ID=A...sandbox client id...' >> .env.local
npm run dev                  # → http://localhost:5173/donate
```

`isPayPalConfigured` が true になるので `/donate` が PayPal Buttons モードに切り替わる。100 円選択 → PayPal Buttons クリック → sandbox の buyer test account でログイン → CAPTURED まで通る。

### C. PayPal sandbox の buyer test account

PayPal Developer Dashboard → Sandbox → Accounts に Personal/Business のテストアカウントが自動作成されているので、Personal の方でログインして決済する。

---

## 6. デプロイ

### A. skuro-api

1. `gh repo create skuro1115/skuro-api --public --source=. --remote=origin --push`
2. Vercel ダッシュボード → New Project → GitHub の `skuro-api` をインポート
3. 環境変数 4 つ（`PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`, `PAYPAL_ENV=sandbox`, `ALLOWED_ORIGINS`）を Production / Preview / Development に設定
4. Deploy → `skuro-api.vercel.app` 完成

### B. skuro

1. GitHub Secrets に `VITE_PAYPAL_CLIENT_ID` と `VITE_DONATE_API_BASE` を追加
2. `.github/workflows/deploy.yml` の `npm run build` ステップに `env:` ブロックを追加して上記 Secrets を注入
3. main にマージ → GH Pages 自動デプロイ → `https://skuro1115.github.io/donate` でモック解除

### C. sandbox → production 切替

- skuro-api 側の `PAYPAL_CLIENT_ID/SECRET/ENV` を live のものに差し替え
- skuro 側 `VITE_PAYPAL_CLIENT_ID` Secret を live の Client ID に差し替え
- 100 円実決済テスト 1 回（手数料約 44 円が引かれる点を承知の上で）
- PayPal Live ダッシュボードで CAPTURED を確認

---

## 7. E2E チェックリスト

- [ ] `/donate` で hero と金額プリセットが表示される
- [ ] 100 / 300 / 500 / 1000 / カスタム入力 が選べる
- [ ] sandbox 環境で PayPal Buttons が出る、PayPal アカウント未保有でもクレカで支払える（`funding-sources` でデバッグ可能）
- [ ] 完了後 thanks 画面 + 取引 ID 表示
- [ ] Plausible に `donate-capture-success` イベントが記録される
- [ ] 不正な amount (`-1`, `9999999`, `"abc"`) を Postman 等で送ると 400 が返る
- [ ] Origin が許可外（curl 等）だと 403 が返る
- [ ] PayPal ダッシュボードで CAPTURED として記録される
- [ ] Footer から `/donate` へ遷移できる
- [ ] sitemap.xml に `/donate` が含まれる
- [ ] OG カードに「skuro 開発支援」のメタが出る

---

## 8. スコープ外（後続）

- 月額継続サブスク（PayPal Subscriptions API）
- Webhook 受信（決済完了通知の冪等処理）— 初版は `onApprove` の capture 結果を信用
- 大規模な負荷対策（Vercel KV / Upstash Redis）

---

## 9. 落とし穴メモ

- **Personal アカウントで Smart Buttons を使うと funding sources の挙動が違う**: 必ず Business アップグレード後に Live App を作る
- **JPY の小数点**: PayPal API は `value: "100"` を文字列で渡す。フロント側で `String(amount)` にしているのを忘れない
- **CORS の Vary: Origin**: 単一 origin でも `Vary: Origin` を付けないと CDN キャッシュが壊れることがある（applyCors で対応済み）
- **`vercel dev` の env load 順**: `.env.local` が `.env` を上書き。`.env.local` は gitignore 必須
- **TypeScript 5.5 + `verbatimModuleSyntax`**: skuro 側は `import { type X }` で書く規約。skuro-api は別 tsconfig なのでそれぞれの規約に従う
- **Lighthouse CI**: skuro 側の deploy.yml はそのままでよい。skuro-api 側に CI を入れるかは別判断
