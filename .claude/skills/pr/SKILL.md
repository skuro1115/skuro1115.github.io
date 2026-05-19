---
name: pr
description: Create a feature branch from main, commit current changes with a conventional commit message, push to origin, and open a PR via gh pr create. Use when the user says "/pr" or asks to ship current work as a pull request.
---

# Create PR

現在の作業ブランチの差分を feature branch + コンベンショナルコミット + PR まで一気通貫で仕上げるスキル。

## 手順

1. **状態確認**: `git status` / `git diff` / `git log --oneline -5` を並列で実行し、未コミットの差分・ブランチ・スタイルを把握する。
2. **ブランチ作成**: `main` ブランチ上にいる場合は `feature/<short-kebab-desc>` を切る。既に feature ブランチ上ならそのまま使う。
3. **コミット**: 変更内容に応じてコンベンショナル prefix（`feat:` / `fix:` / `chore:` / `docs:` / `refactor:`）を選び、なぜその変更が必要かを 1〜2 行で書く。HEREDOC で改行を含むメッセージを渡し、末尾に Co-Authored-By を付ける。
4. **テスト/ビルド**: `package.json` に `test` か `build` スクリプトがあれば実行し、緑であることを確認してから push する。失敗したら commit を作り直す（never `--amend`）。
5. **push**: `git push -u origin <branch>` で upstream を設定。
6. **PR 作成**: `gh pr create` を `--title`（70字以内）と `--body`（HEREDOC）で実行。body は以下のテンプレを使用:

```markdown
## Summary
- <変更点 1>
- <変更点 2>

## Test plan
- [ ] <検証項目 1>
- [ ] <検証項目 2>
```

7. **報告**: PR URL をユーザーに返す。

## ガードレール

- `main` への直接 push は禁止。常に feature branch 経由。
- `--no-verify` などフックスキップは使用禁止。
- secrets を含むファイル（`.env`, credentials.json 等）はコミットしない。検出した場合はユーザーに警告。
- `git add -A` ではなく具体的なファイル指定を優先。
