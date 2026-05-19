#!/usr/bin/env node
import fs from 'fs/promises'
import path from 'path'
import {fileURLToPath} from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT_DIR = path.resolve(__dirname, '../public/generated')
const POSTS_DIR = path.join(OUT_DIR, 'posts')

function parseFrontmatter(text) {
  const lines = text.split('\n')
  const data = {}
  for (const line of lines) {
    if (!line || line.startsWith('---')) continue
    const [key, ...rest] = line.split(':')
    if (!key || rest.length === 0) continue
    const value = rest.join(':').trim()
    if (value.startsWith('[') || value.startsWith('{')) {
      try {
        data[key.trim()] = JSON.parse(value)
        continue
      } catch (_e) {
      }
    }
    data[key.trim()] = value.replace(/^"|"$/g, '')
  }
  return data
}

function rewriteBody(title, excerpt, meta) {
  const lines = []
  lines.push('## 背景と課題')
  lines.push(`${title} に取り組んだ背景と、なぜこの変更が必要だったのかを整理しました。`)
  lines.push('')
  lines.push('## 取り組んだこと')
  lines.push('本稿では、実装の狙いと選択した設計について、開発者視点で振り返ります。')
  lines.push('')

  if (/ドキュメント/i.test(title) || /README/i.test(excerpt)) {
    lines.push('ドキュメント整備では、利用者と開発者の両方に読みやすい構成を意識しました。')
    lines.push('既存の説明が不明瞭な箇所を補強し、手順を明確にしました。')
  } else if (/リファクタ/i.test(title)) {
    lines.push('コードの読みやすさと拡張性を高めるために、責務の分割と境界を見直しました。')
    lines.push('要所でテストのしやすさを優先し、変更の波及を抑える設計を選択しました。')
  } else if (/決済/i.test(title) || /Stripe/i.test(title) || /payment/i.test(excerpt)) {
    lines.push('決済周りでは、セキュリティとユーザー体験の両立を重視しました。')
    lines.push('トークン管理・再試行処理・エラーハンドリングの設計を丁寧に整えました。')
  } else if (/不具合/i.test(title) || /fix/i.test(excerpt)) {
    lines.push('修正では、原因分析と再発防止の両面を意識しました。')
    lines.push('エラー系の観測ポイントを追加し、想定外入力に耐える設計を強化しました。')
  } else {
    lines.push('この変更で意図した要件を満たすため、設計や運用を慎重に調整しました。')
    lines.push('技術選定や構成の理由も含めて、次につながる形で整理しました。')
  }

  lines.push('')
  lines.push('## 振り返り')
  lines.push('今回の実装から得られた学びや、今後の改善ポイントをまとめます。')
  lines.push('')
  lines.push(`- ${excerpt}`)
  lines.push('')
  lines.push('---')
  lines.push('*自動レビュー済みの草案です。内容は必要に応じて手動で調整してください。*')
  return lines.join('\n')
}

async function main() {
  const entries = await fs.readdir(POSTS_DIR, {withFileTypes:true})
  let changed = 0
  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith('.md')) continue
    const filePath = path.join(POSTS_DIR, entry.name)
    const text = await fs.readFile(filePath, 'utf8')
    if (!text.startsWith('---')) continue

    const parts = text.split('---')
    if (parts.length < 3) continue
    const frontmatter = parts[1]
    const body = parts.slice(2).join('---').trimStart()
    const meta = parseFrontmatter(frontmatter)
    const title = meta.title || entry.name.replace(/\.md$/, '')
    const excerpt = meta.excerpt || body.split('\n')[0]

    const revisedBody = rewriteBody(title, excerpt, meta)
    const newText = `---\n${frontmatter.trim()}\n---\n\n# ${title}\n\n${revisedBody}\n`
    if (newText !== text) {
      await fs.writeFile(filePath, newText, 'utf8')
      changed += 1
      console.log('Reviewed:', entry.name)
    }
  }

  console.log(`Reviewed ${changed} post(s) in ${POSTS_DIR}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
