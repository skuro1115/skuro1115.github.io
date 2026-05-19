# IMPLEMENTATION_PLAN.md

このチャットで設計した5つのタスクの詳細実装仕様。
優先順位順に記載。Claude Code での作業はここを参照しながら進める。

---

## P1 — 404リダイレクト対策 🔴

**背景**: GitHub Pages などの静的ホスティングでは、SPA のサブルートに直接アクセスすると
404が返される。`sessionStorage` を使ったリダイレクト手法で解決する。

### 変更ファイル

#### `public/404.html`（新規作成）

```html
<!DOCTYPE html>
<html>
  <head>
    <script>
      sessionStorage.setItem(
        'redirect',
        location.pathname + location.search + location.hash
      )
      location.replace('/')
    </script>
  </head>
</html>
```

#### `src/main.tsx`（先頭に追加）

```typescript
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// SPA用404リダイレクト（GitHub Pages等の静的ホスティング対策）
const redirect = sessionStorage.getItem('redirect')
if (redirect) {
  sessionStorage.removeItem('redirect')
  window.history.replaceState(null, '', redirect)
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

**検証方法**: ビルド後、`/works/mahjong-ai` に直接アクセスして正しくページが表示されることを確認。

---

## P2 — Work型の拡張 🟠

**背景**: 将来的にWorksとBlogを連携させたり、メディアURLを管理するための型拡張。
データ設計は後から変えると影響が大きいため早めに実施する。

### 変更ファイル: `src/data/works.ts`

型定義に以下を追加:

```typescript
export type Work = {
  // ... 既存フィールド（変更なし） ...

  // 追加フィールド
  mediaUrls?: string[]         // スクリーンショット・デモ動画のURL
  relatedPostSlugs?: string[]  // 関連するブログ記事の slug 配列
  showInBlog?: boolean         // Blog ページでの表示フラグ（将来の機能）
  techDetails?: string         // WorkDetail 拡張用の技術的詳細（Markdown可）
}
```

**既存データへの影響**: オプショナルフィールドのため既存データの変更は不要。
`mahjong-ai` と `honnemawolf` は将来の LP 実装（P5）に向けて
`mediaUrls` を先に追加しておくと良い。

---

## P3 — staggerChildren アニメーション 🟡

**背景**: 現状は各カードが一斉に出現するため単調。
`staggerChildren` で時間差出現させることで視覚的な奥行きが生まれる。

### 変更ファイル: `src/pages/Home.tsx`

追加するバリアント定義:

```typescript
const gridContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
}

const cardItem = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.2, 0.65, 0.3, 0.9] },
  },
}
```

グリッド部分の変更:

```typescript
// Before:
<div className="grid gap-4 sm:grid-cols-2">
  {works.map((work) => (
    <Link key={work.id} ...>

// After:
<motion.div
  className="grid gap-4 sm:grid-cols-2"
  variants={gridContainer}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, margin: '-60px' }}
>
  {works.map((work) => (
    <motion.div key={work.id} variants={cardItem}>
      <Link ...>
      </Link>
    </motion.div>
  ))}
</motion.div>
```

### 変更ファイル: `src/pages/Blog.tsx`

追加するバリアント定義:

```typescript
const listContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const listItem = {
  hidden: { opacity: 0, x: -12 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.35 },
  },
}
```

リスト部分の変更:

```typescript
// Before:
<ul className="divide-y divide-border">
  {blogPosts.map((post) => (
    <li key={post.slug}>

// After:
<motion.ul
  className="divide-y divide-border"
  variants={listContainer}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true }}
>
  {blogPosts.map((post) => (
    <motion.li key={post.slug} variants={listItem}>
```

---

## P4 — useGitHubStats カスタムフック 🟢

**背景**: 外部APIとのやりとりをコンポーネントから切り離し、再利用可能にする。
Kukurio Apps の `useAppIcon` フックと同じパターン。

### 新規作成: `src/hooks/useGitHubStats.ts`

```typescript
import { useState, useEffect } from 'react'

interface GitHubStats {
  stars: number
  forks: number
  isLoading: boolean
  error: Error | null
}

export function useGitHubStats(githubUrl?: string): GitHubStats {
  const [stars, setStars] = useState(0)
  const [forks, setForks] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!githubUrl) return

    const match = githubUrl.match(/github\.com\/([^/]+)\/([^/]+)/)
    if (!match) return

    const [, owner, repo] = match
    const cleanRepo = repo.replace(/\.git$/, '') // .git サフィックスを除去
    setIsLoading(true)

    fetch(`https://api.github.com/repos/${owner}/${cleanRepo}`)
      .then((res) => {
        if (!res.ok) throw new Error(`GitHub API error: ${res.status}`)
        return res.json()
      })
      .then((data) => {
        setStars(data.stargazers_count ?? 0)
        setForks(data.forks_count ?? 0)
        setIsLoading(false)
      })
      .catch((err) => {
        setError(err instanceof Error ? err : new Error('Fetch failed'))
        setIsLoading(false)
      })
  }, [githubUrl])

  return { stars, forks, isLoading, error }
}
```

### `src/pages/Home.tsx` での使用例

```typescript
import { useGitHubStats } from '../hooks/useGitHubStats'

// Works.map 内の Link コンポーネントを分離してフックを使用
function WorkCard({ work }: { work: Work }) {
  const { stars } = useGitHubStats(work.githubUrl)

  return (
    <Link to={`/works/${work.id}`} className="group block p-5 ...">
      {/* 既存のコンテンツ */}
      <div className="mt-3 flex flex-wrap gap-1 items-center">
        {work.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="font-mono text-xs ...">
            {tag}
          </span>
        ))}
        {stars > 0 && (
          <span className="font-mono text-xs text-subtle ml-auto">
            ★ {stars}
          </span>
        )}
      </div>
    </Link>
  )
}
```

**注意**: GitHub API は未認証で60req/h の制限あり。
本番環境では以下のいずれかで対処:
1. `localStorage` に24時間キャッシュ
2. 環境変数 `VITE_GITHUB_TOKEN` でトークン設定
3. ビルド時に静的データとして取得（GitHub Actions）

---

## P5 — アプリ専用ランディングページ 🔵

**背景**: 各アプリの詳細ページを独立したLPとして作成。
App Store 審査時のサポートURLとして使用でき、SEOにも有効。
Kukurio Apps の `ThemeJinroLanding` が参考実装。

### 新規作成: `src/pages/MahjongLanding.tsx`

構成（参考実装の `ThemeJinroLanding` に準拠）:

```
MahjongLanding
├── NavBar（固定ヘッダー、青系カラー）
├── HeroSection（タイトル + App Store ボタン + キャッチコピー）
├── FeaturesSection（4つの機能カード）
├── AlgorithmSection（シャンテン計算の説明）
├── CTASection（ダウンロード誘導）
├── LegalSection（プライバシーポリシー accordion）
└── LandingFooter（トップへ戻るリンク）
```

**定数:**
```typescript
const APP_STORE_URL = 'https://apps.apple.com/jp/app/麻雀ai-配牌チェッカー/id1637036872'
const CONTACT_EMAIL = 'yktsr1212@gmail.com'
```

### `src/App.tsx` のルート追加

```typescript
import MahjongLanding from './pages/MahjongLanding'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      // ... 既存ルート ...
      { path: 'apps/mahjong-ai', element: <MahjongLanding /> },
    ],
  },
])
```

**注意**: MahjongLanding は `<Layout>` の外側に置いても良い
（独自NavBarを持つため）。その場合は以下:

```typescript
const router = createBrowserRouter([
  { path: '/apps/mahjong-ai', element: <MahjongLanding /> },
  {
    path: '/',
    element: <Layout />,
    children: [ /* ... */ ],
  },
])
```

---

## 完了チェックリスト

- [ ] P1: `public/404.html` 作成
- [ ] P1: `src/main.tsx` にリダイレクト処理追加
- [ ] P2: `Work` 型に4フィールド追加
- [ ] P3: `Home.tsx` に gridContainer / cardItem バリアント追加
- [ ] P3: `Blog.tsx` に listContainer / listItem バリアント追加
- [ ] P4: `src/hooks/useGitHubStats.ts` 新規作成
- [ ] P4: `Home.tsx` で WorkCard コンポーネントを切り出してフック使用
- [ ] P5: `src/pages/MahjongLanding.tsx` 新規作成
- [ ] P5: `src/App.tsx` にルート追加
- [ ] CLAUDE.md の「未実装タスク」セクションを更新
