#!/usr/bin/env node
import fs from 'fs/promises'
import {existsSync} from 'fs'
import path from 'path'
import {execSync} from 'child_process'
import {fileURLToPath} from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '../..') // /Users/kurodashion/dev/personal
const OUT_DIR = path.resolve(__dirname, '../public/generated')
const MAX_COMMITS = 10

function safeHtml(s) {
  if (!s) return ''
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function parseGithubRemote(url) {
  if (!url) return null
  // supports git@github.com:owner/repo.git and https
  let m = url.match(/github.com[:/](.+?)\/?(\.git)?$/)
  if (!m) return null
  const parts = m[1].split('/')
  if (parts.length < 2) return null
  return {owner: parts[0], repo: parts[1].replace(/\.git$/, '')}
}

async function isRepoPublic(remoteUrl) {
  const gh = parseGithubRemote(remoteUrl)
  if (!gh) return false
  const api = `https://api.github.com/repos/${gh.owner}/${gh.repo}`
  try {
    const headers = { 'User-Agent': 'repo-scraper' }
    const res = await fetch(api, {headers})
    if (res.status === 200) {
      const j = await res.json()
      return j.private === false
    }
    return false
  } catch (e) {
    return false
  }
}

function commitToArticleLine(msg) {
  if (!msg) return ''
  const l = msg.toLowerCase()
  if (l.includes('refactor')) return `リファクタをする上で考えたこと: ${msg}`
  if (l.includes('stripe') || l.includes('payment') || l.includes('pay')) return `決済を導入した理由と設計上の工夫: ${msg}`
  if (l.includes('add') || l.includes('implement') || l.includes('feat')) return `新機能を実装した背景と設計: ${msg}`
  if (l.includes('fix') || l.includes('bug')) return `不具合修正の背景と学んだこと: ${msg}`
  if (l.includes('docs') || l.includes('readme')) return `ドキュメント更新の狙い: ${msg}`
  if (l.includes('deploy') || l.includes('infra') || l.includes('ci') || l.includes('cd')) return `インフラ・デプロイの選定理由: ${msg}`
  if (l.includes('test') || l.includes('spec')) return `テスト戦略と品質改善: ${msg}`
  if (l.includes('perf') || l.includes('optim') || l.includes('speed')) return `パフォーマンス改善の工夫: ${msg}`
  // fallback
  return `作業の概要と学び: ${msg}`
}

function stripCommitPrefix(msg) {
  return msg.replace(/^(feat|fix|docs|chore|refactor|perf|test)(\(.*?\))?:\s*/i, '')
}

function humanizeCommitTitle(msg) {
  let title = stripCommitPrefix(msg)
  title = title
    .replace(/\band\b/gi, 'と')
    .replace(/\bfor\b/gi, 'の')
    .replace(/\bin\b/gi, 'における')
    .replace(/manual setup/gi, 'マニュアルセットアップ')
    .replace(/firebase sdk/gi, 'Firebase SDK')
    .replace(/multiplayer/gi, 'マルチプレイヤー')
    .replace(/document/gi, 'ドキュメント化')
    .replace(/add(?:itions)?/gi, '追加')
    .replace(/fix(?:es)?/gi, '修正')
    .replace(/refactor/i, 'リファクタ')
    .replace(/performance/gi, 'パフォーマンス')
    .replace(/speed/gi, '速度')
    .replace(/ci/gi, 'CI')
    .replace(/cd/gi, 'CD')
    .replace(/firebase/gi, 'Firebase')
    .replace(/sdk/gi, 'SDK')
    .replace(/readme/gi, 'README')
    .replace(/\s+\//g, ' / ')
  title = title.replace(/\s+/g, ' ').trim()
  if (!title) return '技術的な取り組みの記録'
  return title.charAt(0).toUpperCase() + title.slice(1)
}

function commitArticleSummary(msg) {
  const line = commitToArticleLine(msg)
  return line.replace(/^(.{1,100})(.*)$/, '$1').trim()
}

function expandCommitToBody(msg, author, date) {
  const lines = []
  const title = humanizeCommitTitle(msg)
  lines.push(`## 背景と目的`)
  lines.push(`このコミットでは、${title} を中心に手を入れました。`)
  lines.push('')

  if (/refactor/i.test(msg)) {
    lines.push('## 取り組み')
    lines.push('既存コードの構造を整理し、保守性と読みやすさを高めるためのリファクタを実施しました。')
    lines.push('')
    lines.push('## 学び')
    lines.push('設計の境界を明確にし、テストしやすい責務分割を意識することで、今後の機能追加がしやすくなりました。')
  } else if (/stripe|payment|pay/i.test(msg)) {
    lines.push('## 取り組み')
    lines.push('決済フローを組み込み、ユーザー体験とセキュリティのバランスを意識しながら実装しました。')
    lines.push('')
    lines.push('## 学び')
    lines.push('決済処理はエラーケースが多いため、成功/失敗を含むフローの観測とリトライの考え方が重要でした。')
  } else if (/fix|bug/i.test(msg)) {
    lines.push('## 取り組み')
    lines.push('不具合の原因を掘り下げ、影響範囲を考慮して修正を行いました。')
    lines.push('')
    lines.push('## 学び')
    lines.push('再発防止のためには入力の想定範囲とエラー状態を明確にすることが大切です。')
  } else if (/docs|readme/i.test(msg)) {
    lines.push('## 取り組み')
    lines.push('技術情報や導入手順をわかりやすく整理し、ドキュメントを整備しました。')
    lines.push('')
    lines.push('## 学び')
    lines.push('説明の粒度や用語の統一感が、チームや将来の自分の理解を左右します。')
  } else if (/deploy|infra|ci|cd/i.test(msg)) {
    lines.push('## 取り組み')
    lines.push('デプロイやCIの安定性を高めるための構成を整えました。')
    lines.push('')
    lines.push('## 学び')
    lines.push('運用観点を考慮すると、失敗時のログと再デプロイの手順を明確にしておくことが重要です。')
  } else if (/test|spec/i.test(msg)) {
    lines.push('## 取り組み')
    lines.push('テストカバレッジを広げ、品質を担保する体制を強化しました。')
    lines.push('')
    lines.push('## 学び')
    lines.push('テストは実装の意図を言語化し、設計の曖昧さを取り除く手段になります。')
  } else if (/perf|optim|speed/i.test(msg)) {
    lines.push('## 取り組み')
    lines.push('パフォーマンス改善のためにボトルネックを特定し、処理の見直しを行いました。')
    lines.push('')
    lines.push('## 学び')
    lines.push('実測データをもとに改善点を優先し、不要な最適化を避けることが大切です。')
  } else {
    lines.push('## 取り組み')
    lines.push(`このコミットでは、${title} に関わる作業を行いました。`)
    lines.push('')
    lines.push('## 学び')
    lines.push('次に同じような変更をする際の設計やテストについて考えました。')
  }

  lines.push('')
  lines.push('---')
  lines.push(`*コミット日時:* ${date} | *著者:* ${author}`)

  return lines.join('\n')
}

function getReadmeExcerpt(readme) {
  if (!readme) return ''
  const firstParagraph = readme.split(/\n\s*\n/)[0].replace(/\n/g, ' ')
  return firstParagraph.slice(0, 240).trim()
}

async function extractWorksFromTS(filePath) {
  try {
    const txt = await fs.readFile(filePath, 'utf8')
    // crude extraction: find title: '...'
    const titles = []
    const re = /title:\s*'([^']+)'/g
    let m
    while ((m = re.exec(txt))) titles.push(m[1])
    return titles
  } catch (e) {
    return []
  }
}

async function processRepo(name) {
  const repoPath = path.join(ROOT, name)
  const stat = await fs.stat(repoPath).catch(()=>null)
  if (!stat || !stat.isDirectory()) return null

  // quick heuristics: consider repo if .git or README/package.json exists
  const hasGit = existsSync(path.join(repoPath, '.git'))
  const hasReadme = existsSync(path.join(repoPath, 'README.md'))
  const hasPkg = existsSync(path.join(repoPath, 'package.json'))
  const hasWorksTs = existsSync(path.join(repoPath, 'src', 'data', 'works.ts'))
  if (!hasGit && !hasReadme && !hasPkg && !hasWorksTs) return null

  // read files
  const readme = hasReadme ? await fs.readFile(path.join(repoPath, 'README.md'), 'utf8') : ''
  const pkg = hasPkg ? JSON.parse(await fs.readFile(path.join(repoPath, 'package.json'), 'utf8')) : null
  const works = hasWorksTs ? await extractWorksFromTS(path.join(repoPath, 'src', 'data', 'works.ts')) : []

  // git remote
  let remote = ''
  try { remote = execSync(`git -C ${JSON.stringify(repoPath)} config --get remote.origin.url`, {encoding:'utf8'}).trim() } catch(e) { remote = '' }

  // commits
  let commits = []
  try {
    const out = execSync(`git -C ${JSON.stringify(repoPath)} log -n ${MAX_COMMITS} --pretty=format:%H%x1f%an%x1f%ad%x1f%s --date=short`, {encoding:'utf8'})
    commits = out.split('\n').map(l=>{ const parts = l.split('\x1f'); return {hash:parts[0], author:parts[1], date:parts[2], message:parts[3]}})
  } catch(e) {
    commits = []
  }

  const isPublic = await isRepoPublic(remote)

  // build HTML
  const title = pkg?.name || name
  const html = []
  html.push(`<html><head><meta charset="utf-8"><title>${safeHtml(title)}</title><style>body{font-family:system-ui,poppins,ui-sans-serif,system-ui,sans-serif;padding:24px;max-width:840px;margin:auto;color:#111;background:#fff}a{color:#2563eb;text-decoration:none}a:hover{text-decoration:underline}h1{font-size:32px;line-height:1.1;margin-bottom:8px}h2{font-size:20px;margin-top:32px;margin-bottom:12px}p.meta{color:#4b5563;font-size:0.95rem;margin:5px 0}pre.readme{background:#f3f4f6;padding:16px;white-space:pre-wrap;border-radius:12px;overflow:auto;border:1px solid #e5e7eb}ul{margin:0;padding-left:1.2rem}li{margin:0.35rem 0}hr{border:none;border-top:1px solid #e5e7eb;margin:32px 0}</style></head><body>`)
  html.push(`<h1>${safeHtml(title)}</h1>`)
  html.push(`<p><strong>ローカル名:</strong> ${safeHtml(name)} &nbsp; <strong>公開判定:</strong> ${isPublic? 'public':'private/local'}</p>`)
  if (pkg) html.push(`<p class="meta"><strong>説明:</strong> ${safeHtml(pkg.description||'')} ${pkg.version? ' v'+safeHtml(pkg.version):''}</p>`)
  if (remote) html.push(`<p class="meta"><strong>リモート:</strong> <a href="${safeHtml(remote)}" target="_blank" rel="noreferrer noopener">${safeHtml(remote)}</a></p>`)
  if (works.length) {
    html.push('<h2>Works</h2>')
    html.push('<ul>')
    for (const w of works) html.push(`<li>${safeHtml(w)}</li>`)
    html.push('</ul>')
  }
  if (readme) html.push(`<h2>README（抜粋）</h2><pre class="readme">${safeHtml(getReadmeExcerpt(readme))}${readme.length>240? '...':''}</pre>`)

  if (commits.length) {
    html.push('<h2>最近の変更（自動生成されたブログ風要約）</h2>')
    for (const c of commits) {
      const line = commitToArticleLine(c.message)
      html.push(`<h3>${safeHtml(c.message)}</h3><p>${safeHtml(line)}</p><p style="color:#666;font-size:13px">${safeHtml(c.author)} — ${safeHtml(c.date)}</p>`)
    }
  }

  html.push(`<hr><p>自動生成日時: ${new Date().toISOString()}</p>`)
  html.push('</body></html>')

  // ensure out dir
  await fs.mkdir(OUT_DIR, {recursive:true})
  const outFile = path.join(OUT_DIR, `${name}.html`)
  await fs.writeFile(outFile, html.join('\n'), 'utf8')

  // produce markdown posts per commit
  const postsDir = path.join(OUT_DIR, 'posts')
  await fs.mkdir(postsDir, {recursive:true})
  let idx = 1
  const allPosts = []
  for (const c of commits) {
    const slug = `${name}-${c.hash.slice(0,7)}-${idx}`
    const titleLine = humanizeCommitTitle(c.message)
    const body = expandCommitToBody(c.message, c.author, c.date)
    const excerpt = commitArticleSummary(c.message)

    const md = [
      `---`,
      `title: "${titleLine.replace(/"/g, '\\"')}"`,
      `date: "${c.date}"`,
      `tags: ["${name}", "repo-sync", "tech-blog"]`,
      `slug: "${slug}"`,
      `excerpt: "${excerpt.replace(/"/g, '\\"')}"`,
      `repo: "${name}"`,
      `commit: "${c.hash}"`,
      `---`,
      '',
      `# ${titleLine}`,
      '',
      body,
    ].join('\n')

    const postFile = path.join(postsDir, `${slug}.md`)
    await fs.writeFile(postFile, md, 'utf8')

    // track for data export
    allPosts.push({
      slug,
      title: titleLine,
      date: c.date,
      tags: [name, 'repo-sync', 'tech-blog'],
      excerpt,
      body,
    })

    idx++
  }
  
  // export posts as JSON for potential React import
  const postsJson = path.join(OUT_DIR, 'posts.json')
  await fs.writeFile(postsJson, JSON.stringify({repo: name, posts: allPosts}, null, 2), 'utf8')

  // docs json
  const docsDir = path.join(OUT_DIR, 'docs')
  await fs.mkdir(docsDir, {recursive:true})
  const meta = {name, title, remote, isPublic, commits:commits.length, works:works.length, generatedAt: new Date().toISOString()}
  await fs.writeFile(path.join(docsDir, `${name}.json`), JSON.stringify(meta, null, 2), 'utf8')

  return {name, outFile, meta}
}

async function main(){
  console.log('Scanning', ROOT)
  const entries = await fs.readdir(ROOT, {withFileTypes:true})
  const names = entries.filter(e=>e.isDirectory()).map(e=>e.name)
  const results = []
  for (const n of names) {
    try {
      const r = await processRepo(n)
      if (r) results.push(r)
    } catch (e) {
      console.error('error processing', n, e.message)
    }
  }
  const allMeta = results.map((r) => ({
    name: r.meta.name,
    title: r.meta.title,
    remote: r.meta.remote,
    isPublic: r.meta.isPublic,
    commits: r.meta.commits,
    works: r.meta.works,
    generatedAt: r.meta.generatedAt,
  }))
  await fs.writeFile(path.join(OUT_DIR, 'repos.json'), JSON.stringify(allMeta, null, 2), 'utf8')
  console.log('Generated', results.length, 'files in', OUT_DIR)
  console.log(`- wrote ${results.length} repo meta entries to repos.json`)
  for (const r of results) console.log(' -', r.outFile)
}

main().catch(e=>{ console.error(e); process.exit(1) })
