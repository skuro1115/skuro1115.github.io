# CLAUDE.md

このファイルはClaude Codeがリポジトリで作業する際のコンテキストを提供します。
このチャットセッションで議論・設計された内容を引き継いで作業を再開できます。

---

## プロジェクト概要

**skuro ポートフォリオサイト** — Vite + React + TypeScript + Tailwind CSS で構築された
個人ポートフォリオ兼技術ブログ。Apps / Works / Blog の3セクション構成。

- **URL**: GitHub Pages でホスティング（静的SPA）
- **関連リポジトリ**: `Kukurio Apps`（別プロジェクト）からアーキテクチャの知見を移植中

---

## リポジトリ構造

```
/
├── public/
│   └── 404.html              # ← 未作成（要実装 #1）
├── src/
│   ├── App.tsx               # ルーター定義（createBrowserRouter）
│   ├── main.tsx              # エントリーポイント（404リダイレクト処理を追加予定）
│   ├── index.css             # Tailwind base
│   ├── components/
│   │   ├── Nav.tsx           # スティッキーナビ（Apps / Works / Blog）
│   │   └── Footer.tsx        # GitHub / Email リンク
│   ├── data/
│   │   ├── works.ts          # Work型 + worksデータ（要型拡張 #2）
│   │   └── blog.ts           # BlogPost型 / LogEntry型 + データ
│   ├── hooks/                # ← ディレクトリ未作成（要実装 #4）
│   ├── pages/
│   │   ├── Apps.tsx          # アプリ一覧（ダークテーマ、グラデーション）
│   │   ├── Home.tsx          # Works一覧（Works = /works ルート）
│   │   ├── WorkDetail.tsx    # 作品詳細
│   │   ├── Blog.tsx          # ブログ一覧
│   │   ├── BlogPost.tsx      # ブログ記事
│   │   ├── Log.tsx           # 日記一覧
│   │   ├── LogPost.tsx       # 日記記事
│   │   └── Support.tsx       # 麻雀AIサポートページ
│   └── vite-env.d.ts
├── index.html                # DM Mono / DM Sans / Noto Sans JP フォント読込
├── CLAUDE.md                 # このファイル
└── docs/
    ├── ARCHITECTURE.md       # アーキテクチャ詳細
    ├── IMPLEMENTATION_PLAN.md # 未実装タスクの詳細仕様
    └── REFERENCE_PATTERNS.md # Kukurio Appsから学んだパターン集
```

---

## 技術スタック

| カテゴリ | 技術 |
|---|---|
| ビルド | Vite |
| UI | React 18 + TypeScript |
| スタイル | Tailwind CSS（カスタムカラー: `accent`, `muted`, `subtle`, `border`, `surface`） |
| アニメーション | Framer Motion（`AnimatePresence` によるページ遷移） |
| ルーティング | React Router v6（`createBrowserRouter`） |
| ホスティング | GitHub Pages（静的SPA） |

---

## 実装済みタスク

詳細仕様は `.claude/IMPLEMENTATION_PLAN.md` を参照。

### ✅ P1 — 404リダイレクト対策
- `public/404.html` を作成
- `src/main.tsx` に sessionStorage リダイレクト処理を追加
- 注: 本番 GitHub Pages 環境での実機確認は次回デプロイ時に実施予定

### ✅ P2 — Work型の拡張
`src/data/works.ts` の `Work` 型に以下を追加（既存データへの影響なし）:
- `mediaUrls?: string[]`
- `relatedPostSlugs?: string[]`
- `showInBlog?: boolean`
- `techDetails?: string`

### ✅ P3 — staggerChildren アニメーション
- `src/pages/Home.tsx` — `gridContainer` / `cardItem` バリアント追加、`whileInView` でトリガー
- `src/pages/Blog.tsx` — `listContainer` / `listItem` バリアント追加

### ✅ P4 — useGitHubStats カスタムフック
- `src/hooks/useGitHubStats.ts` 新規作成（無キャッシュ）
- `src/pages/Home.tsx` で `WorkCard` 関数コンポーネントを切り出してフック使用、`stars > 0` のとき ★バッジ表示
- ⚠️ 未認証API制限: 60req/h → 必要になったら `localStorage` キャッシュを追加

### ✅ P5 — アプリ専用ランディングページ（仮実装）
- `src/pages/MahjongLanding.tsx` 新規作成
- `src/App.tsx` に `/apps/mahjong-ai` ルート追加
- 注: 仮実装（works データから自動生成）。本番デザインが入る予定

### ✅ ホンネ人狼 — 共同開発のため外部LPへ集約
- 本家LPは kukurio リポジトリ（`kukurio218/kukurio218.github.io`）の `/apps/themejinro`
- skuro 側 `HonnemawolfLanding.tsx` は削除、`/apps/honnemawolf` ルートも撤去
- `Work` 型に `externalUrl?: string` を追加し、honnemawolf のみ `https://kukurio218.github.io/apps/themejinro` を設定
- `Apps.tsx` / `Home.tsx` の WorkCard は `externalUrl` があれば `<a target="_blank">`、なければ既存の内部 `<Link>` で分岐

---

## 重要な設計決定

### ルーティング構造
```
/           → Apps.tsx（アプリ紹介ページ、ダークテーマ）
/works      → Home.tsx（Works一覧、ライトテーマ）
/works/:id  → WorkDetail.tsx
/blog       → Blog.tsx
/blog/:slug → BlogPost.tsx
/log        → Log.tsx（非公開の日記、Footerから・でリンク）
/log/:slug  → LogPost.tsx
/support/mahjong-ai → Support.tsx
/apps/mahjong-ai    → MahjongLanding.tsx（未実装）
```

### データの流れ
- `src/data/works.ts` が単一のデータソース
- `showInApps: true` のものだけ Apps.tsx に表示（フィルタリング）
- `showInApps: false` または未設定は Works.tsx のみに表示
- Blog/Log データは `src/data/blog.ts` に集約（将来はMarkdown/CMSに移行想定）

### アニメーションパターン
全ページ共通の page variant:
```typescript
const page = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.2 } },
  exit: { opacity: 0, y: -4, transition: { duration: 0.15 } },
}
```
`<motion.main variants={page} initial="initial" animate="animate" exit="exit">` で使用。

### カラーシステム（Tailwindカスタム）
```
accent  → メインアクセントカラー（青系）
muted   → 補助テキスト
subtle  → さらに薄いテキスト
border  → ボーダー色
surface → 背景サーフェス
```

---

## Kukurio Appsから移植したパターン

参照元: 別プロジェクト（アプリ紹介サイト）のコードレビューから抽出。

| パターン | 移植先 | 状態 |
|---|---|---|
| `showInApps`フラグによるデータ絞り込み | works.ts の `showInApps` | ✅ 実装済み |
| `staggerChildren` アニメーション | Home.tsx / Blog.tsx | ✅ 実装済み |
| カスタムフックへのAPI処理分離 | hooks/useGitHubStats.ts | ✅ 実装済み |
| SPA 404リダイレクト | main.tsx + public/404.html | ✅ 実装済み |
| 専用ランディングページ | apps/mahjong-ai など | ✅ 仮実装（要デザイン） |
| フォールバック表示（頭文字バッジ） | WorkDetail など | 検討中 |

---

## よく使うコマンド

```bash
npm run dev      # 開発サーバー起動
npm run build    # プロダクションビルド
npm run preview  # ビルド結果のプレビュー
```

---

## 作業再開時の推奨手順

1. `docs/IMPLEMENTATION_PLAN.md` で各タスクの詳細仕様を確認
2. P1から順に実装（P1はファイル2つの変更のみで完了）
3. 各タスク完了後にこのファイルの「未実装タスク」セクションを更新
