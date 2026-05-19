#!/usr/bin/env bash
# PostToolUse hook: src/* または build に影響するファイルを編集したとき npm run build を走らせる。
# 失敗時のみ末尾を吐き出してブロックしない（exit 0）。
# .claude/ は git untracked なのでこのファイルもローカル限定。
# UX が辛ければ .claude/settings.local.json の "hooks" ブロックごと削除すれば無効化できる。

set -u

input="$(cat)"
file="$(printf '%s' "$input" | jq -r '.tool_input.file_path // empty' 2>/dev/null)"

proj="${CLAUDE_PROJECT_DIR:-$(pwd)}"

# 当該プロジェクト配下のビルド影響ファイルだけ拾う
case "$file" in
  "$proj"/src/*|"$proj"/index.html|"$proj"/vite.config.*|"$proj"/tailwind.config.*|"$proj"/tsconfig*.json|"$proj"/postcss.config.*)
    ;;
  *)
    exit 0
    ;;
esac

cd "$proj" || exit 0

out="$(npm run build --silent 2>&1)"
status=$?
if [ "$status" -ne 0 ]; then
  echo "[build-on-edit] npm run build failed (exit $status):"
  printf '%s\n' "$out" | tail -15
fi
exit 0
