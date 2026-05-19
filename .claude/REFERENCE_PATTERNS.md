# REFERENCE_PATTERNS.md

Kukurio Apps（別プロジェクト）のコードレビューから抽出した
再利用可能なパターン集。skuro への移植時の参考として使用する。

---

## 1. SPA 404リダイレクト

GitHub Pages などの静的ホスティングで SPA を動かす際の必須パターン。

**仕組み:**
1. 存在しないパスへのアクセス → `404.html` が返される
2. `404.html` が現在のパスを `sessionStorage` に保存 → `/` にリダイレクト
3. `main.tsx` が起動時に `sessionStorage` を確認 → 元のパスに `replaceState`

```html
<!-- public/404.html -->
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

```typescript
// src/main.tsx の先頭
const redirect = sessionStorage.getItem('redirect')
if (redirect) {
  sessionStorage.removeItem('redirect')
  window.history.replaceState(null, '', redirect)
}
```

---

## 2. データフィルタリングフラグ

同じデータソースから複数のビューを生成するパターン。
`showInApps` のように `boolean` フラグを型に持たせ、各ページでフィルタリング。

```typescript
// データ定義側
export type Work = {
  showInApps?: boolean   // Apps.tsx に表示するか
  // 将来的に追加:
  // showInBlog?: boolean
  // featured?: boolean
}

// 使用側
const appWorks = works.filter((w) => w.showInApps)
const featuredWorks = works.filter((w) => w.featured)
```

**メリット:**
- データの追加/削除が `works.ts` 一箇所で完結
- 各ページのコードがシンプルに保たれる

---

## 3. カスタムフックによるAPI処理の分離

外部APIとのやりとりをフックに切り出し、ローディング・エラー状態を返すパターン。
Kukurio Apps の `useAppIcon` が参考実装。

```typescript
// src/hooks/useSomethingFromApi.ts
interface Result {
  data: SomeType | null
  isLoading: boolean
  error: Error | null
}

export function useSomethingFromApi(input?: string): Result {
  const [data, setData] = useState<SomeType | null>(null)
  const [isLoading, setIsLoading] = useState(() => !!input) // inputがあれば初期ローディング
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!input) {
      setData(null)
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    fetchSomething(input)
      .then((result) => {
        setData(result)
        setIsLoading(false)
      })
      .catch((err) => {
        setError(err instanceof Error ? err : new Error('Failed'))
        setIsLoading(false)
      })
  }, [input])

  return { data, isLoading, error }
}
```

---

## 4. staggerChildren アニメーションパターン

リスト・グリッドのカードを時間差で出現させるパターン。

```typescript
// コンテナ（親）
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,   // 子要素の間隔（秒）
      delayChildren: 0.05,    // 最初の子要素までの遅延（秒）
    },
  },
}

// アイテム（子）
const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.2, 0.65, 0.3, 0.9], // ease-out-quart に近い
    },
  },
}

// 使用例（グリッド）
<motion.div
  className="grid grid-cols-2 gap-4"
  variants={containerVariants}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, margin: '-60px' }}
>
  {items.map((item) => (
    <motion.div key={item.id} variants={itemVariants}>
      <Card item={item} />
    </motion.div>
  ))}
</motion.div>

// 使用例（リスト、横スライドイン）
const listItemVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.35 } },
}
```

---

## 5. フォールバック表示（頭文字バッジ）

画像の読み込み失敗時に頭文字を表示するフォールバックパターン。

```typescript
function FallbackBadge({ name, colorClass }: { name: string; colorClass: string }) {
  return (
    <div className={`w-12 h-12 rounded-xl ${colorClass} flex items-center justify-center`}>
      <span className="text-white text-xl font-bold">
        {name.charAt(0).toUpperCase()}
      </span>
    </div>
  )
}

// 使用例
{isLoading ? (
  <div className="w-12 h-12 rounded-xl bg-gray-200 animate-pulse" />
) : imageUrl ? (
  <img src={imageUrl} className="w-12 h-12 rounded-xl" />
) : (
  <FallbackBadge name={work.title} colorClass="bg-blue-500" />
)}
```

---

## 6. 専用ランディングページのパターン

アプリごとに独立したLPを作るパターン。
Kukurio Apps の `ThemeJinroLanding` が参考実装（650行以上の完全実装）。

**構成の定石:**

```
AppLanding
├── NavBar（固定ヘッダー、アプリカラー）
│   ├── ロゴ・アプリ名
│   ├── セクションリンク（スムーズスクロール）
│   └── CTAボタン（ダウンロード）
├── HeroSection（フルスクリーン）
│   ├── キャッチコピー（大見出し）
│   ├── サブコピー
│   ├── ダウンロードボタン群
│   └── バッジ（特徴の一言ラベル）
├── ProblemSection（課題提起）
├── FeatureSection（機能説明）
├── HowToPlaySection（使い方）
├── CTASection（再度ダウンロード誘導）
├── LegalSection（プライバシーポリシー、accordion）
└── LandingFooter
    └── 「← トップへ戻る」リンク（Routerの Link を使用）
```

**ポイント:**
- `Layout`（Nav + Footer）の外側に配置して独立させる
- アプリカラーで全体を統一（例: ホンネ人狼は `#e8461e`）
- プライバシーポリシーは accordion で折りたたむ
- フッターに必ず `<Link to="/">` でトップへ戻るリンクを設置

---

## 7. データ型のオプショナルフィールド活用

コンテンツの充実度に応じて表示を出し分けるパターン。

```typescript
// 型定義でオプショナルにしておく
type Work = {
  shortDesc: string              // 必須: 常に表示
  catchphrase?: string           // 任意: あれば大きく表示
  features?: string[]            // 任意: あればリスト表示
  detailedDescription?: string[] // 任意: なければ shortDesc を使用
}

// 使用側でフォールバックを書く
{work.detailedDescription ? (
  work.detailedDescription.map((p, i) => <p key={i}>{p}</p>)
) : (
  <p>{work.shortDesc}</p>
)}
```

**メリット:**
- データが少なくてもUIが壊れない
- コンテンツを段階的に充実させられる
- 型システムで「任意」であることを明示できる
