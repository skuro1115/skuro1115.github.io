# 開発引き継ぎメモ — 2026-05-07

> このドキュメントは、別の Claude Code セッションが skuro リポジトリの作業を完全に引き継げるように
> 必要な状態・前提・タスクを self-contained に書き下したもの。
> 始める前にまず本ファイルを最初から最後まで読むこと。
>
> 関連する既存ドキュメント:
> - [`docs/portfolio_improvement.md`](portfolio_improvement.md) — v2 ロードマップ。本セッションまでの実装ログ
> - `.claude/CLAUDE.md` — リポジトリ概要（一部記述が古い、後述）
> - `.claude/ARCHITECTURE.md` / `.claude/IMPLEMENTATION_PLAN.md` / `.claude/REFERENCE_PATTERNS.md` — 旧 Kukurio Apps から移植したパターン集と過去の計画

---

## 0. 開始前のチェック

```bash
git status -sb
git log --oneline -5
```

期待される状態（2026-05-07 14:08 時点で停止）:

- ブランチ: `feature/guess-rank-release`
- 直前の HEAD: `4823ce4 feat(blog): SPA SEO実装メモとGuessRankピボット記事を追加`
- main も同じ `4823ce4` を指している（origin/main は不明、要 `git fetch` で確認）
- 未ステージの変更:
  - `src/data/works.ts`（GuessRank を `live` バッジ + App Store URL + 公式アイコンに更新）
  - `src/pages/GuessRankLanding.tsx`（`APP_STORE_URL` 定数の実 URL 設定 + CTA 文言調整）

これらは **Task 0 でそのままコミットする差分**。捨てない。

未トラックのままにしておくもの（コミット禁止）:
- `.claude/`（ARCHITECTURE.md, CLAUDE.md, IMPLEMENTATION_PLAN.md, REFERENCE_PATTERNS.md, skills/, worktrees/, settings.local.json 等）
- `docs/`（このファイル含めワークスペースローカル）

---

## 1. 制約と運用ルール

### Git
- **main への直接 commit / push は permission で禁止** されている。プロジェクトの permission rule で `git commit` / `git push origin main` が拒否される構成になっている。
- 作業は必ず feature branch（命名: `feature/<short-kebab>` または既存パターン `claude/<...>`）。
- リモートへ反映するには **PR を作成してマージ** する。`gh pr create` を使う。
- コミットメッセージは Conventional Commits 風 prefix（`feat:` / `fix:` / `docs:` / `chore:` / `refactor:`）+ 日本語。末尾に `Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>` を付ける。
- HEREDOC で改行を含むメッセージを渡すこと。
- `--no-verify` / `--amend` / `git add -A` / `git push --force` は使用禁止。

### 検証コマンド
- `npm run build` — `tsc -b && vite build`（型 + ビルド）
- `npm run dev` — 開発サーバー
- `npm run lint` — ESLint

PR 提出前には最低限 `npm run build` が緑であること。

### コード規範
- TypeScript strict、React 18、React Router v7、framer-motion、Tailwind CSS。
- ページ遷移アニメは全ページ共通の `page` variant を使う（既存ページ参照）。
- `useDocumentMeta` は早期 return より前に呼ぶ（React Hooks のルール）。
- 全ページに per-page meta を書くこと（既存パターン踏襲）。

### MCP / ツール
- `claude mcp list` で `github` / `notion` が ✓ Connected であること。
- GitHub MCP（`mcp__github__*`）は `GITHUB_PERSONAL_ACCESS_TOKEN` が無いと API 失敗する場合あり。`gh` CLI が安定。
- `/pr` カスタムスキル（`.claude/skills/pr/SKILL.md`）が利用可能。

---

## 2. 直近のリポジトリ構造（CLAUDE.md より新しい現状）

```
public/
├── 404.html                  # SPA リダイレクト
├── favicon.svg               # ← Task 1 で追加予定（現状なし）
├── og-default.jpg            # OG デフォルト 1200×630 JPG（83KB）
├── og-default.svg            # OG ソース SVG
├── robots.txt                # ← Task 2 で追加予定（現状なし）
├── sitemap.xml               # ← Task 2 で追加予定（現状なし）
├── vite.svg                  # 旧デフォルト（favicon 差し替え後に削除可）
└── guess-rank/
    ├── icon.png              # 旧アイコン（works.ts では App Store CDN を使うように変更済）
    └── screenshots/          # GuessRank LP のスクリーンショット
src/
├── App.tsx                   # ルーター + Layout + Suspense
├── main.tsx                  # エントリー + tracking listener install
├── index.css                 # Tailwind base
├── components/
│   ├── Footer.tsx
│   └── Nav.tsx
├── data/
│   ├── blog.ts               # blogPosts (4件) + logEntries
│   └── works.ts              # works 定義 + Work 型
├── hooks/
│   ├── useDocumentMeta.ts    # per-page SEO/OGP
│   └── useGitHubStats.ts     # GitHub stars 取得
├── lib/
│   └── track.ts              # data-track デリゲートリスナ
└── pages/
    ├── Apps.tsx              # ダーク Apps 一覧（/）
    ├── Blog.tsx, BlogPost.tsx
    ├── GuessRankLanding.tsx  # /apps/guess-rank（リッチLP）
    ├── Home.tsx              # Works 一覧（/works）
    ├── Log.tsx, LogPost.tsx
    ├── MahjongLanding.tsx    # /apps/mahjong-ai（リッチLP・牌タイル装飾）
    ├── NotFound.tsx          # *
    ├── Support.tsx           # /support/mahjong-ai
    └── WorkDetail.tsx        # /works/:id（地味 → Task 4 でリッチ化）
```

### ルーティング
| パス | ページ | テーマ |
|---|---|---|
| `/` | Apps | dark |
| `/works` | Home | light |
| `/works/:id` | WorkDetail | light |
| `/blog` | Blog | light |
| `/blog/:slug` | BlogPost | light |
| `/log` | Log | light |
| `/log/:slug` | LogPost | light |
| `/support/mahjong-ai` | Support | light |
| `/apps/mahjong-ai` | MahjongLanding (lazy) | LP 独自 |
| `/apps/guess-rank` | GuessRankLanding (lazy) | LP 独自 |
| `*` | NotFound | light |

`/` のみダークテーマ（Layout の `pathname === '/'` 判定）。

---

## 3. タスク一覧

### Task 0 — GuessRank App Store 公開反映（最優先 / すでに編集済み）

ステータス: 編集済み・unstaged。

操作:
```bash
git checkout feature/guess-rank-release   # 既に居る場合はスキップ
git status                                 # works.ts と GuessRankLanding.tsx だけ M になっていることを確認
git add src/data/works.ts src/pages/GuessRankLanding.tsx
git commit -m "$(cat <<'EOF'
feat(guess-rank): App Store公開を反映

- works.ts: badge を wip→live、badgeLabel を 'App Store'
- works.ts: appStoreUrl を https://apps.apple.com/jp/app/guessrank/id6763001964 に設定
- works.ts: iconUrl をローカル /guess-rank/icon.png から App Store CDN の512×512に差し替え
- GuessRankLanding.tsx: APP_STORE_URL 定数を実URLに設定（hero/CTA の '準備中' 表示が自動で実リンクへ切替）
- CTA文言 '無料予定' → '無料'

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
git push origin feature/guess-rank-release
gh pr create --title "feat(guess-rank): App Store公開を反映" --body "$(cat <<'EOF'
## Summary
- GuessRank が App Store でリリース ( https://apps.apple.com/jp/app/guessrank/id6763001964 ) されたので Apps 一覧 / 詳細 / LP に反映
- アイコンを App Store の 512×512 公式アートに差し替え

## Test plan
- [ ] /(Apps) で GuessRank カードに 'App Store' バッジが出ること
- [ ] App Store ボタンから実 URL に遷移すること
- [ ] /apps/guess-rank 内の Hero / CTA が '準備中' でなく実リンクになっていること
- [ ] tab title / OG プレビューが GuessRank の内容になること
EOF
)"
```

### Task 1 — favicon を skuro 用に差し替え

現状: `index.html` が `/vite.svg`（Vite デフォルトのカミナリアイコン）を参照。

やること:
1. `public/favicon.svg` を新規作成。`public/og-default.svg` と同じ青紫グラデ + "s" モチーフでミニマルに。viewBox 32×32 推奨、線幅は太め（小さい表示でも視認性高く）。
2. `index.html` の `<link rel="icon" type="image/svg+xml" href="/vite.svg" />` を `/favicon.svg` に変更。
3. （任意）`<link rel="apple-touch-icon" href="/favicon.svg" />` を追加。
4. `public/vite.svg` は削除可。

参考の "s" デザイン: og-default.svg のロゴ部分（円 + s 文字）を 32×32 に縮約。

### Task 2 — robots.txt + sitemap.xml

GitHub Pages 配信のため静的ファイルで配置。

`public/robots.txt`:
```
User-agent: *
Allow: /

Sitemap: https://skuro1115.github.io/sitemap.xml
```

（GitHub Pages の URL を確認して差し替えること。custom domain なら更新）

`public/sitemap.xml`: 全ルートを列挙。`<lastmod>` は 2026-05-07 で固定して OK。
- `/`
- `/works`
- `/works/{各 work.id}` — works.ts から列挙
- `/blog`
- `/blog/{各 blogPost.slug}` — blog.ts から列挙
- `/apps/mahjong-ai`
- `/apps/guess-rank`
- `/support/mahjong-ai`

`/log` は非公開扱い（Footer から `·` で隠しリンク）なので sitemap に含めない方針。

実装はベタ書きでよい。後で動的生成したくなったら build script (Vite plugin) を検討。

### Task 3 — 画像 onError フォールバック

App Store CDN（`is1-ssl.mzstatic.com`）が落ちたとき、頭文字バッジ等にフォールバック。

対象:
- `src/pages/Apps.tsx` の `AppIcon` コンポーネント — 既にロゴなし時のフォールバックはあるが、`<img>` の `onError` が未対応
- `src/pages/MahjongLanding.tsx` の Hero のアイコン img
- `src/pages/GuessRankLanding.tsx` の NavBar / Hero のアイコン img（ただし現状はローカル `/guess-rank/icon.png`、404 リスクは低い）
- `src/pages/Home.tsx` の `WorkCard`（アイコン未表示なのでスキップ）

実装パターン（推奨）:
```tsx
const [imgError, setImgError] = useState(false)
return (work.iconUrl && !imgError) ? (
  <img src={work.iconUrl} alt={...} onError={() => setImgError(true)} ... />
) : (
  <FallbackBadge title={work.title} />
)
```

複数箇所で再利用するため、`src/components/AppIcon.tsx` に切り出すのも検討（現状は Apps.tsx 内のローカル）。

### Task 4 — WorkDetail のリッチ化

現状 `src/pages/WorkDetail.tsx` は 116 行で素朴（タイトル + tags + longDesc + buttons + Related Posts のみ）。Apps の見栄えとギャップが大きい。

リッチ化方針（**LP とは差別化**: LP は「アプリそのものを売る」、WorkDetail は「ポートフォリオ作品としての文脈・なぜ作ったか・技術メモ」）:

1. **アイコンヒーロー**: アイコン画像 + タイトル + キャッチフレーズ + 年 + バッジ。light テーマだが control 取れた gradient（`work.color` を活用）。
2. **Long description** を whitespace-pre-line で見やすく（既存）。改行が `\n\n` で章区切りになっているので段落 spacing を効かせる。
3. **Features セクション** — `work.features` があれば箇条書き。アイコン bullet。
4. **Tech tags** — 既に表示しているが、もう少し目立たせる（チップを大きく、技術カテゴリで色分け）。
5. **CTA セクション** — App Store / GitHub / 外部 LP / プロダクトページ（既存）。
6. **Related Posts** — 既存（Task 0 後は guess-rank / mahjong-ai で動く）。

UI 参考: `src/pages/MahjongLanding.tsx` の `TechSection` 風の落ち着いた light テーマカード。

注意:
- `useDocumentMeta` は既存で動いているので変えない。`work?.iconUrl` を image に渡しているのを維持。
- Work 型に新フィールドを足したくなったら検討（`techDetails?: string` は既に型に存在）。

### Task 5 — a11y 基本対応

1. **Skip-to-content link** — `src/App.tsx` の `Layout` に追加。Tailwind の `sr-only focus:not-sr-only` パターン:
   ```tsx
   <a
     href="#main-content"
     className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[60] focus:px-3 focus:py-2 focus:bg-white focus:text-gray-900 focus:rounded focus:shadow-lg"
   >
     コンテンツへスキップ
   </a>
   ```
   各ページの `<motion.main>` に `id="main-content"` を付与（または Layout の Outlet 直前のラッパに付ける方が漏れない）。

2. **focus-visible グローバルスタイル** — `src/index.css` に:
   ```css
   :focus-visible {
     outline: 2px solid theme('colors.accent');
     outline-offset: 2px;
   }
   ```
   ダーク Apps ページではコントラスト確認が要る。

3. **aria-label の補完**:
   - `src/components/Nav.tsx` のメニューボタン（mobile） — 現状なければ
   - `src/components/Footer.tsx` の `·` リンク（log への隠し導線）に `aria-label="開発ログ"` 等
   - 各 LP の `<button>` メニュートグル（既に `aria-label="メニュー"` あり）

4. **landmark の確認** — 既に `<header>` / `<main>` / `<footer>` は揃っているので OK。

### Task 6 — Lighthouse CI

`.github/workflows/lighthouse.yml` を新規作成。

```yaml
name: Lighthouse CI
on:
  pull_request:
    branches: [main]

jobs:
  lhci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run build
      - name: Run Lighthouse CI
        uses: treosh/lighthouse-ci-action@v11
        with:
          configPath: ./.lighthouserc.json
          uploadArtifacts: true
          temporaryPublicStorage: true
```

`.lighthouserc.json`:
```json
{
  "ci": {
    "collect": {
      "staticDistDir": "./dist",
      "url": ["http://localhost/index.html"],
      "numberOfRuns": 1
    },
    "assert": {
      "preset": "lighthouse:no-pwa",
      "assertions": {
        "categories:performance": ["warn", {"minScore": 0.85}],
        "categories:accessibility": ["error", {"minScore": 0.9}],
        "categories:best-practices": ["warn", {"minScore": 0.9}],
        "categories:seo": ["error", {"minScore": 0.9}]
      }
    }
  }
}
```

注意:
- SPA なのでサブパス（`/works` 等）は直接 file:// で開けない。`index.html` のみで取れるスコアでも portfolio 用途には十分。
- 動かなければ閾値を warn に落として様子見。

### Task 7 — PostToolUse build hook（要判断）

`.claude/settings.json` に edit 後の自動 build を仕込むか。

提案する内容（**デフォルトはコメントアウト相当でとどめる、必要に応じて有効化**）:
```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "cd \"$CLAUDE_PROJECT_DIR\" && npm run build --silent 2>&1 | tail -5 || true"
          }
        ]
      }
    ]
  }
}
```

実害:
- 編集毎に build が走る → tokens 増、UX うるさい
- src/* 以外（docs/、.claude/）の編集でも走るので無駄が多い

代替案: 「commit 直前」「PR 作成直前」だけ走らせる仕組みにする方が体験よい。
matcher を `Bash` にして `command_pattern: "git commit"` で絞るとか、
PreToolUse で commit を検知してビルド先行 → 失敗ならブロック、なども検討余地あり。

**結論**: このタスクはユーザーと一度すり合わせた方が良い。雑に有効化しない。

---

## 4. PR 粒度の提案

レビューしやすさ重視の単純化:

| PR | 内容 | 行数感 |
|---|---|---|
| PR 1 | Task 0（GuessRank公開反映）| ~10 行 |
| PR 2 | Task 1 + Task 2（favicon + robots/sitemap）| ~80 行 |
| PR 3 | Task 3（onError フォールバック）| ~50 行 |
| PR 4 | Task 4（WorkDetail リッチ化）| ~150 行 |
| PR 5 | Task 5（a11y 基本対応）| ~50 行 |
| PR 6 | Task 6（Lighthouse CI）| ~50 行 |
| PR 7 | Task 7（build hook）| 5 行（要相談） |

PR 1 → 6 までは並列に着手しても衝突しにくい（Task 4 の WorkDetail 改修と Task 5 の a11y は同ファイル触る可能性があるので順次でもよい）。

すべて 1 つの大型 PR にしてもよいが、レビューしにくい。Task 0 だけは独立 PR にしておくと user の app.store リンクが先に main に乗るので体験的に得。

---

## 5. 落とし穴メモ

- **`useDocumentMeta` は条件分岐の前に呼ぶ**。WorkDetail の `if (!work) return ...` より前に呼ぶ既存パターンを真似ること。
- **TypeScript の verbatimModuleSyntax 互換**: `type` 限定 import が必要かは tsconfig で要確認。既存ファイルは `import { type Work }` 形式あり。
- **App Store CDN icon は CORS-safe**: `<img>` タグ表示なら問題なし（`fetch()` するなら対策が要る）。
- **GitHub Pages の SPA 404**: `public/404.html` と `main.tsx` の sessionStorage redirect で対応済み。新ルート追加時に何か壊さないように。
- **framer-motion の AnimatePresence と Suspense**: `App.tsx` でネストしているが現状動作確認済み。
- **`docs/` と `.claude/` は git untracked**: 本ファイルもそのうち。手元の作業メモだけだから OK。コミットしないこと。

---

## 6. 既存ドキュメントとの関係

- [`docs/portfolio_improvement.md`](portfolio_improvement.md) は **v2 ロードマップ + 実装ログ**。本セッションで「第1パス」「第2パス」「第3パス」と段階を残してある。
  Task 0〜7 完了時に「第4パス」を追記すること（追記場所は `### 第3パス` の後ろ）。
- `.claude/CLAUDE.md` の冒頭の「リポジトリ構造」と「実装済みタスク」記述は古い（MahjongLanding が「仮実装」のままなど）。
  本セッションの作業を反映するアップデートをいずれ入れたいが、Task 0〜6 とは独立タスクとして分離。

---

## 7. 開発再開の最初の 1 コマンド

```bash
cat docs/HANDOFF.md
git status -sb
git log --oneline -5
```

これで全てのコンテキストが揃う。Task 0 から順に着手。
