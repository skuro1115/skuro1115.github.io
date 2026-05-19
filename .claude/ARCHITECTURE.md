# ARCHITECTURE.md

skuro ポートフォリオサイトのアーキテクチャ詳細。

---

## コンポーネント構成

```
App.tsx
└── createBrowserRouter
    └── Layout（Nav + AnimatePresence + Footer）
        ├── /           → Apps
        ├── /works      → Home（Works一覧）
        ├── /works/:id  → WorkDetail
        ├── /blog       → Blog
        ├── /blog/:slug → BlogPost
        ├── /log        → Log
        ├── /log/:slug  → LogPost
        └── /support/mahjong-ai → Support
```

### Nav.tsx
- `sticky top-0 z-50`、高さ `h-14`
- `NavLink` でアクティブ状態を `text-accent` で表示
- リンク: Apps（`/`）、Works（`/works`）、Blog（`/blog`）
- Log（`/log`）は非公開扱い — Footer の `·` からのみアクセス可能

### Footer.tsx
- GitHub / Email リンク
- `/log` へのドットリンク（`text-border` で目立たない）

---

## データモデル

### Work型（`src/data/works.ts`）

```typescript
type Work = {
  id: string
  title: string
  shortDesc: string        // Works一覧カードに表示
  longDesc: string         // WorkDetail に表示（\n\n で段落分割）
  tags: string[]           // 最大3つをカードに表示
  year: string
  badge?: 'live' | 'research' | 'wip'
  badgeLabel?: string      // badgeの表示テキスト上書き
  appStoreUrl?: string
  githubUrl?: string
  color: string            // 'blue' | 'green' | 'violet' | 'amber'
  category?: 'game' | 'research' | 'tool' | 'other'
  catchphrase?: string     // Apps.tsx でグラデーションテキスト表示
  features?: string[]      // Apps.tsx でチェックリスト表示
  showInApps?: boolean     // true のみ Apps.tsx に表示
  // 追加予定（P2）:
  // mediaUrls?: string[]
  // relatedPostSlugs?: string[]
  // showInBlog?: boolean
  // techDetails?: string
}
```

### BlogPost型（`src/data/blog.ts`）

```typescript
type BlogPost = {
  slug: string
  title: string
  date: string             // 'YYYY-MM-DD'
  tags: string[]
  excerpt: string          // 一覧に表示する要約
  body: string             // Markdown記法（whitespace-pre-lineでレンダリング）
}
```

### LogEntry型（`src/data/blog.ts`）

```typescript
type LogEntry = {
  slug: string
  title: string
  date: string
  body: string
}
```

---

## Apps.tsx のカラーシステム

4色のグラデーション定義。`works.ts` の `color` フィールドと対応。

```typescript
const gradients = {
  blue:   { bg: 'from-[#0a0f1e]...', accent: 'from-blue-500 to-indigo-600',   glow: 'shadow-blue-500/30' },
  green:  { bg: 'from-[#021a0a]...', accent: 'from-emerald-500 to-green-600', glow: 'shadow-emerald-500/30' },
  violet: { bg: 'from-[#0f0a1e]...', accent: 'from-violet-500 to-purple-600', glow: 'shadow-violet-500/30' },
  amber:  { bg: 'from-[#1a1000]...', accent: 'from-amber-500 to-orange-600',  glow: 'shadow-amber-500/30' },
}
```

セクションは交互レイアウト（`isEven` で `flex-row` / `flex-row-reverse` 切替）。

---

## ページ遷移アニメーション

`AnimatePresence mode="wait"` でページ間のフェードを制御。
全ページ共通の `page` variant を使用（詳細は CLAUDE.md 参照）。

各ページで `<motion.main variants={page} initial="initial" animate="animate" exit="exit">` をルート要素にする。

---

## Tailwindカスタムカラー

`tailwind.config.js`（または `tailwind.config.ts`）で定義済み:

```
text-accent  → アクセントカラー（青系）
text-muted   → 補助テキスト
text-subtle  → さらに薄いテキスト
border-border → ボーダー
bg-surface   → サーフェス背景
```

実際のカラー値は `tailwind.config.*` を参照。

---

## フォント

`index.html` で Google Fonts から読み込み:

| フォント | 用途 |
|---|---|
| DM Mono | `font-mono`（日付、タグ、ラベル） |
| DM Sans | `font-sans`（英語テキスト） |
| Noto Sans JP | 日本語テキスト |
