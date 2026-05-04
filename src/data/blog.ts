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
