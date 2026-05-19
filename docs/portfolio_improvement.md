# Portfolio Improvement Roadmap (v2)

> **Scope**: skuro（ポートフォリオサイト本体）
> **対象アプリ**: GuessRank · ホンネ人狼 · 麻雀AI（FocuLinkはまだコードベースに存在しない）

---

## v1 の振り返りと方針転換

[v1 (旧版)](#旧版-v1--per-project-roadmap-参考) は GuessRank / ホンネ人狼 / FocuLink を並列に置き、各アプリに対して
「決済導入」「リーダーボード」「multi-tab E2E」など SaaS プロダクト前提の施策を並べていた。
が、現実は次の通り：

| プロジェクト | 実体 | skuro 側で打てる手 |
|---|---|---|
| 麻雀AI | App Store 公開済（Swift） | LP の質・流入計測 |
| ホンネ人狼 | App Store 公開・LP は kukurio リポジトリへ集約済 | 外部LPへの導線確保（実装済） |
| GuessRank | iOS 申請中、専用LPあり（ThemeJinro 風刷新済） | LP磨き込み・他アプリ回遊導線 |
| FocuLink | **未着手・コードベースに存在しない** | 構想は v1 にメモ留めるのみ |

つまり「ポートフォリオから見て効くのはアプリ機能ではなく **ポートフォリオの伝達力** 」。
v1 が見落としていたレイヤーを埋めるのが v2 の主眼。

---

## 優先順位

### Tier 1 — 配信レバーが大きく実装軽い（このセッションで着手）

1. **Per-page SEO / OGP**
   index.html はタイトル `skuro — portfolio` のみ・description / OGP なし。
   X や LINE で `/apps/guess-rank` を貼ってもサムネが出ない。`useDocumentMeta` 1本で全ページに `<title>` / description / og:image を出し分ける。

2. **SPA NotFound ルート**
   現状は `*` 未定義。`/foo` を踏むと React Router が空を返す。`NotFound.tsx` を `*` にぶら下げる。

3. **重い LP のコード分割**
   `GuessRankLanding.tsx` は 29KB、`MahjongLanding.tsx` も今後大きくなる前提。`React.lazy` + `Suspense` でルート単位に分割。トップ初回読込が軽くなる。

4. **既存だが未利用の型を活かす**
   `Work.relatedPostSlugs` はすでに型に定義済みだが UI で参照されていない。`WorkDetail` で関連ブログを表示する。

### Tier 2 — 内容を埋める

5. **MahjongLanding の本実装**
   現状 `works.find()` で生成しただけのプレースホルダ。GuessRankLanding と同水準の構成（hero / features / CTA）に揃える。デザインは別途。

6. **Blog 補強**
   blog.ts は 2 件のみ。`relatedPostSlugs` を活かすには記事数を増やす必要があるが、
   ポートフォリオ目的なら「各 Work に対応する 1 本のメイキング記事」を最低ラインに置く。

### Tier 3 — 計測 / 運用

7. **Plausible or 自前イベント計測**
   v1 は「PostHog 入れる」と書いていたがポートフォリオでファネル分析は過剰。
   `View Product Page` クリック / App Store 遷移 / 外部 LP 遷移の3つだけで十分。

8. **Lighthouse CI**
   GitHub Actions で PR ごとにスコアを記録。ビルドサイズ閾値だけでもブロックすれば回帰防止になる。

### Tier 4 — 構想（コード化はしない）

- v1 の各アプリ向けアイデア（決済 scaffold / leaderboard / 役職パック等）は
  各アプリ本体（Swift / Flutter リポジトリ）側で扱う話題。skuro の roadmap からは除外する。

---

## このセッションで反映した変更

### 第1パス（Tier 1）

| 変更 | 場所 |
|---|---|
| `useDocumentMeta` フック追加 | `src/hooks/useDocumentMeta.ts` |
| 各ページで title / description / og:image を設定 | `Apps`, `Home`, `Blog`, `BlogPost`, `WorkDetail`, `MahjongLanding`, `GuessRankLanding` |
| `NotFound` ページ追加 + `*` ルート登録 | `src/pages/NotFound.tsx`, `src/App.tsx` |
| ランディングページの lazy import | `src/App.tsx` |
| `index.html` に description / OGP デフォルト追加 | `index.html` |
| `WorkDetail` に `relatedPostSlugs` の表示 | `src/pages/WorkDetail.tsx` |

### 第3パス（Tier 2 #6 — Blog 補強）

| 変更 | 場所 |
|---|---|
| `spa-per-page-seo` 記事追加（直近の SEO/OGP 実装メモ） | `src/data/blog.ts` |
| `guess-rank-pivot` 記事追加（三連単 → 友達Top3 へのピボット記） | `src/data/blog.ts` |
| guess-rank に `relatedPostSlugs: ['guess-rank-pivot']` を配線 | `src/data/works.ts` |

これで WorkDetail の「Related Posts」が mahjong-ai と guess-rank で動くようになり、
LP / WorkDetail / Blog の間で読み回せる導線が初めて成立した。

### 第4パス（HANDOFF Task 0〜6 + Donate機能）— 2026-05-07

| 変更 | 場所 |
|---|---|
| GuessRank App Store 公開反映（badge / appStoreUrl / iconUrl / LP の APP_STORE_URL） | `src/data/works.ts`, `src/pages/GuessRankLanding.tsx` |
| favicon を skuro 用に差し替え（青紫グラデ + "s"）+ apple-touch-icon | `public/favicon.svg`, `index.html`, `public/vite.svg` を削除 |
| robots.txt + 全公開ルートを列挙した sitemap.xml（`/log` は除外） | `public/robots.txt`, `public/sitemap.xml` |
| 共通 AppIcon コンポーネント（onError → 頭文字バッジへフォールバック） | `src/components/AppIcon.tsx` |
| Apps / MahjongLanding / GuessRankLanding のアイコン img を AppIcon に統一 | `src/pages/Apps.tsx`, `src/pages/MahjongLanding.tsx`, `src/pages/GuessRankLanding.tsx` |
| WorkDetail ページをリッチ化（hero グラデ + アイコン + キャッチ + Features カード + Tech Notes） | `src/pages/WorkDetail.tsx` |
| a11y: skip link / `:focus-visible` / Nav `aria-label` / Footer `·` の aria-label / モバイルメニュー aria-expanded・aria-controls | `src/App.tsx`, `src/index.css`, `src/components/{Nav,Footer}.tsx`, `src/pages/{MahjongLanding,GuessRankLanding}.tsx` |
| Lighthouse CI 導入 + warn ベースのしきい値（preset 'lighthouse:no-pwa' は外し、全カテゴリ warn）  | `.github/workflows/lighthouse.yml`, `.lighthouserc.json` |
| `/donate` ページ + `DonationAmounts` + モック API クライアント（`isPayPalConfigured` で本番/モック切替） | `src/pages/Donate.tsx`, `src/components/DonationAmounts.tsx`, `src/lib/donate.ts` |
| `/donate` の lazy ルート / Footer "☕ Support" / sitemap 反映 / `.env.example` | `src/App.tsx`, `src/components/Footer.tsx`, `public/sitemap.xml`, `.env.example` |
| 寄付 API（skuro-api）の実装計画を docs に保管 | `docs/donate_api_plan.md`（git untracked） |

### 第4パスで増えた計測イベント

| event | 発火元 | プロパティ |
|---|---|---|
| `donate-amount-select` | プリセット/カスタム入力で金額選択 | `amount`, `mode`(preset/custom), `path` |
| `donate-create-order` | createOrder 開始 | `amount`, `mode`(paypal/mock), `path` |
| `donate-mock-pay` | sandbox 接続前のモック決済ボタン | `amount`, `path` |
| `donate-capture-success` | capture 成功 | `amount`, `orderId`, `mode`, `path` |
| `donate-capture-error` | capture 失敗 | `amount`, `message`, `mode`, `path` |
| `donate-footer-click` | Footer の Support リンク | `path` |

### 第2パス（Tier 2 + Tier 3 の最小版）

| 変更 | 場所 |
|---|---|
| 麻雀AI 専用LPの本実装（hero / problem / how / tech / features / CTA / other-apps） | `src/pages/MahjongLanding.tsx` |
| 麻雀AI に技術解説記事を関連付け | `src/data/works.ts` の `relatedPostSlugs` |
| OG 画像の生成（SVG → 1200×1200 → 1200×630 JPG） | `public/og-default.{svg,jpg}` |
| デフォルト OG 画像参照を JPG へ切替 | `src/hooks/useDocumentMeta.ts`, `index.html` |
| イベント計測の最小実装（`data-track` デリゲートリスナ + Plausible 互換 sink） | `src/lib/track.ts`, `src/main.tsx` |
| 主要 CTA に `data-track` 配線 | `Apps`, `WorkDetail`, `GuessRankLanding`, `MahjongLanding` |

### 計測イベント定義（現状）

| event | 発火元 | プロパティ |
|---|---|---|
| `app-store` | App Store リンクのクリック | `app`, `source`, `path` |
| `external-lp` | 外部LP（ホンネ人狼など）のクリック | `app`, `source`, `path` |
| `view-product` | サイト内 LP / WorkDetail への遷移 | `app`, `source`, `path` |
| `github` | GitHub リンクのクリック | `app`, `source`, `path` |

`source` は `apps` / `work-detail` / `hero` / `cta` / `other-apps` のいずれか。
送信先：dev では `console.info`、本番で `window.plausible` が定義されていればそちらに流す。
スクリプトタグの追加は未実施（Plausible / 自前計測の決定待ち）。

### og-default 生成手順（再現用）

```bash
# 1. SVG を編集（1200x1200, 内容は y=285..915 の中央 630 帯に収める）
# 2. 以下で PNG → JPG 変換
qlmanage -t -s 1200 -o /tmp public/og-default.svg
sips -c 630 1200 /tmp/og-default.svg.png --out /tmp/og-cropped.png
sips -s format jpeg -s formatOptions 85 /tmp/og-cropped.png --out public/og-default.jpg
```

検証コマンド：

```bash
npm run build       # 型 + ビルドが通ること
npm run dev         # /foo で NotFound が出ること、各ページのタブタイトルが切り替わること
                    # devtools console で app-store / external-lp / view-product 等が出ること
```

---

## 旧版 (v1) — per-project roadmap 参考

> ここから下は v1 のオリジナル内容。各アプリ単位のアイデアは本体側 backlog として保存。

### GuessRank

- 自作ランキングお題（UGCループ）
- カテゴリ別リーダーボード（週次リセット）
- デイリーチャレンジ
- 結果カード生成（OGP）

### ホンネ人狼

- 安定したルーム/ロビー（共有可能なコード）
- 役職カードのリビールアニメ
- 投票履歴の閲覧
- モバイルファーストUI調整

### FocuLink（未着手）

- ゴール階層（長期 → マイルストーン → 今日のタスク）
- セッションタグと振り返りメモ
- 週次サマリー通知
- Notion / Google Calendar 連携

### 共通

| 関心事 | 推奨 |
|---|---|
| Auth | Supabase もしくは Clerk に統一 |
| Analytics | Plausible / PostHog で軽量計測 |
| CI | リポジトリごとに lint → unit → E2E の Actions |
| Docs | 各リポジトリに 1ページの `ARCHITECTURE.md` |
