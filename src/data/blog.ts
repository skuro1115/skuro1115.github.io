export type BlogPost = {
  slug: string
  title: string
  date: string
  tags: string[]
  excerpt: string
  body: string
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'spa-per-page-seo',
    title: 'SPA で per-page SEO/OGP を最小コストで実装する',
    date: '2026-05-07',
    tags: ['React', 'SEO', 'OGP', 'Vite'],
    excerpt:
      'GitHub Pages にホストした React Router の SPA に、ルート毎の title / description / og:image を仕込んだメモ。react-helmet を使わず 50 行のフックで完結させた。',
    body: `## 課題

Vite + React Router の素の構成だと、index.html に書いた \`<title>\` が全ルート共通になる。
SNS で \`/apps/guess-rank\` を共有しても「skuro — portfolio」しか出ず、
LINE / X のサムネにも何も載らない。要するに **ルート毎にメタ情報を出し分けたい**。

## 選択肢

1. \`react-helmet-async\` を入れる
2. SSR / SSG（vike, react-router の SSR モード）に切り替える
3. \`useEffect\` で \`document.title\` と \`<meta>\` を直接書き換える

ポートフォリオ規模で SSR は overkill、helmet も依存を増やすのが惜しい。
クローラの大半は JavaScript を実行してから OGP を読みに来る（X, LINE, Slack, Discord）ため、
**動的に書き換えるだけで実用上は十分** という判断で 3 を選んだ。

## 実装

\`\`\`ts
// src/hooks/useDocumentMeta.ts
import { useEffect } from 'react'

type Meta = {
  title: string
  description?: string
  image?: string
  type?: 'website' | 'article'
}

const SITE_NAME = 'skuro'
const DEFAULT_IMAGE = '/og-default.jpg'

function setMeta(selector: string, attr: 'name' | 'property', key: string, value: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', value)
}

export function useDocumentMeta({ title, description, image, type = 'website' }: Meta) {
  useEffect(() => {
    const fullTitle = title === SITE_NAME ? title : \`\${title} — \${SITE_NAME}\`
    document.title = fullTitle

    if (description) {
      setMeta('meta[name="description"]', 'name', 'description', description)
      setMeta('meta[property="og:description"]', 'property', 'og:description', description)
    }

    setMeta('meta[property="og:title"]', 'property', 'og:title', fullTitle)
    setMeta('meta[property="og:type"]', 'property', 'og:type', type)
    setMeta('meta[property="og:image"]', 'property', 'og:image', image ?? DEFAULT_IMAGE)
    setMeta('meta[property="og:url"]', 'property', 'og:url', window.location.href)
  }, [title, description, image, type])
}
\`\`\`

各ページでは 1 行だけ：

\`\`\`tsx
useDocumentMeta({
  title: 'GuessRank — 友達のTop3を当てるパーティーゲーム',
  description: '友達の好みのTop3を予想するパーティーゲーム。1台のスマホで遊べる、ルール30秒、登録不要。',
  image: work?.iconUrl,
})
\`\`\`

## 落とし穴

- **初回 HTML には反映されない**。クローラが JS を実行しないと拾えない。X (Twitter) の Card validator は実行するが、Slack の unfurl は時々失敗する。気になるなら \`index.html\` 側にも妥当なデフォルトを置いておくべき。
- **絶対 URL 推奨**。\`og:image\` を相対パスで書くと、一部のクローラ（特に古い LINE）で解決できない。\`window.location.origin\` を結合して絶対 URL にすると安全。
- **og:url は変えること**。\`window.location.href\` を毎回入れるのを忘れて全ルート共通にすると、X 側で Card がキャッシュされる。

## OG 画像をどう作るか

ローカルの macOS だけで完結させたかったので、SVG を書いて \`qlmanage\` で PNG 化、\`sips\` で
JPEG にするフローを採用した。

\`\`\`bash
qlmanage -t -s 1200 -o /tmp public/og-default.svg
sips -c 630 1200 /tmp/og-default.svg.png --out /tmp/og.png
sips -s format jpeg -s formatOptions 85 /tmp/og.png --out public/og-default.jpg
\`\`\`

\`qlmanage\` は SVG をいったん 1200×1200 のサムネイルにするので、SVG の viewBox を
\`0 0 1200 1200\` にして、内容は \`y=285..915\` の中央 630 帯に詰める。
中央 crop した結果が綺麗に 1200×630 になる。

## 効果

- 共有時のサムネが各 LP のアイコンになり、リンクの説得力が上がった
- 実装は 50 行のフック + index.html のデフォルトメタ追加だけ。依存ゼロ
- 同等の helmet ベース実装と比較して、バンドルが ~5KB 軽い`,
  },
  {
    slug: 'guess-rank-pivot',
    title: 'GuessRank: 「三連単」から「友達のTop3」へピボットした話',
    date: '2026-04-28',
    tags: ['Product', 'Game Design', 'iOS'],
    excerpt:
      '当初は競馬の三連単に着想したスコアリングゲームだったが、何度かプレイテストして「ルールが重い」と気づいてピボット。最終的に friend-knowledge ゲームに着地するまでのメモ。',
    body: `## 最初の構想

GuessRank は元々「3つの選択肢の順位を当てる」抽象的なスコアゲームだった。
3つすべて当てれば 100 点、1 個合えば 20 点といった配点はそのままだが、
**お題は完全にランダム**で、誰の好みでもない「客観的な正解」を当てに行く形だった。

## 何が問題だったか

プレイテストで2つの摩擦が出た：

1. **「正解」が無い／曖昧**: 「人気の高いカフェチェーンTop3」のようなお題で、
   出典が曖昧だと「これ本当に1位なの？」という議論で空気が止まる。
2. **会話のフックが弱い**: スコア発表後の「お、当たった」止まりで、その後の話が続かない。

最初は「正解データの精度を上げる」方向で考えたが、データを充実させても
2 番目の問題（会話が続かない）は解消しないと判断した。

## ピボット

正解の出典を「世間の統計」から「**目の前の友達の好み**」に変えた。

- ターゲット役のプレイヤーが「自分の好みのTop3」を入力
- 他の人が予想 → ターゲットのTop3と照合してスコア
- 同点の場合は会話が伸びる：「え、そっちが1位なの！？」が自然に出る

これで2つの問題が同時に解消した：

| 旧 | 新 |
|---|---|
| 客観的正解 → 出典でモメる | ターゲットの主観 → モメようがない |
| 会話のフックが弱い | 「なんで！？」が毎回出る |

## ルール削減

ピボットに合わせて、複雑なルール（時間制限・ボーナスポイント・お題カテゴリ縛り）を削った。
**説明 30 秒で始まる** ことを優先したら、結果的にコアの面白さが浮き上がった。

## 学び

- 「正解の精度を上げる」という方向に走ると、根本問題は解決せず工数だけ増える
- ゲームの面白さは「結果」ではなく「結果の後の会話」で決まることが多い
- ピボットの判断は、プレイテストの **空気が止まる瞬間** をメモするだけで十分つく

LP・実装は ThemeJinro 風に刷新済み。次は App Store 申請の通過待ち。`,
  },
  {
    slug: 'mahjong-ai-algorithm',
    title: '麻雀AIの探索アルゴリズムを自作した話',
    date: '2023-08-15',
    tags: ['Swift', 'Algorithm', 'AI'],
    excerpt: '配牌チェッカーアプリで使用している探索アルゴリズムの設計と実装について解説します。',
    body: `## はじめに

麻雀AIの核心は「シャンテン数計算」と「有効牌列挙」です。
既存ライブラリに頼らず Swift で自作したときの設計メモをまとめます。

## シャンテン数の計算

シャンテン数とは、あと何枚で聴牌になるかを示す数です。
通常手・七対子・国士無双の3パターンを個別に計算し、最小値を取ります。

\`\`\`swift
func calculateShanten(tiles: [Tile]) -> Int {
    let normal = calcNormalShanten(tiles)
    let chiitoi = calcChiitoiShanten(tiles)
    let kokushi = calcKokushiShanten(tiles)
    return min(normal, chiitoi, kokushi)
}
\`\`\`

## 有効牌の列挙

全34種の牌について「引いたときにシャンテン数が減るか」を判定し、有効牌リストを生成します。

## パフォーマンス

Swift の value type を活かし、牌のセットを整数配列で表現することで計算を高速化しました。
14枚の手牌全探索でも数ミリ秒以内に収まっています。`,
  },
  {
    slug: 'vite-react-setup',
    title: 'Vite + React + Tailwind のセットアップ備忘録',
    date: '2024-01-10',
    tags: ['Vite', 'React', 'Tailwind'],
    excerpt: 'Vite + React + TypeScript + Tailwind CSS の構成を素早く立ち上げる手順まとめ。',
    body: `## 環境構築

\`\`\`bash
npm create vite@latest my-app -- --template react-ts
cd my-app
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
\`\`\`

## tailwind.config.js の設定

\`content\` に \`./src/**/*.{ts,tsx}\` を追加するのを忘れずに。

## index.css

\`\`\`css
@tailwind base;
@tailwind components;
@tailwind utilities;
\`\`\`

これだけで動きます。`,
  },
]

export type LogEntry = {
  slug: string
  title: string
  date: string
  body: string
}

export const logEntries: LogEntry[] = [
  {
    slug: '2024-spring',
    title: '2024年春のメモ',
    date: '2024-03-20',
    body: '春になった。桜が咲いている。コードを書いていた。',
  },
]
