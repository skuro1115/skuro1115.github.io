#!/usr/bin/env node
import {execSync} from 'child_process'
import path from 'path'
import fs from 'fs'

const OUT_DIR = path.join(process.cwd(), 'public', 'generated')
const BRANCH_PREFIX = 'auto/articles'
const AUTO_PUSH = process.env.AUTO_PUSH === '1' || process.env.AUTO_PUSH === 'true'
const AUTO_PR = process.env.AUTO_PR === '1' || process.env.AUTO_PR === 'true'
const AUTO_MERGE = process.env.AUTO_MERGE === '1' || process.env.AUTO_MERGE === 'true'

function run(cmd) {
  return execSync(cmd, {stdio:'pipe', encoding:'utf8'}).trim()
}

function gitAvailable() {
  try { run('git --version'); return true } catch(e){ return false }
}

async function main(){
  if (!gitAvailable()) { console.error('git not available'); process.exit(1) }

  const currentBranch = run('git branch --show-current')
  if (currentBranch !== 'main') {
    console.log(`Switching from ${currentBranch} to main for a clean article branch base`)
    run('git checkout main')
  }

  const status = run('git status --porcelain')
  if (status) {
    console.error('Uncommitted changes detected. Please stash or commit before running the workflow.')
    process.exit(1)
  }

  console.log('Generating articles...')
  run('node scripts/generate-articles.js')

  console.log('Reviewing generated posts...')
  run('node scripts/review-generated-posts.js')

  const timestamp = new Date().toISOString().replace(/[:.]/g,'-')
  const branch = `${BRANCH_PREFIX}/${timestamp}`
  console.log('Creating branch', branch)
  run(`git checkout -b ${branch}`)

  console.log('Staging generated files...')
  run(`git add ${OUT_DIR}`)

  const msg = `chore: generate and review article drafts ${timestamp}`
  try { run(`git commit -m "${msg}"`) } catch(e) { console.log('Nothing to commit or commit failed:', e.message) }

  if (AUTO_PUSH) {
    console.log('Pushing branch to origin...')
    try { run(`git push -u origin ${branch}`); console.log('Pushed') } catch(e){ console.error('push failed', e.message) }
  } else {
    console.log('AUTO_PUSH not enabled — branch created locally')
  }

  if (AUTO_PR) {
    try {
      run(`gh pr create --fill --head ${branch} --base main`)
      console.log('PR created (gh CLI)')
      if (AUTO_MERGE) {
        try { run(`gh pr merge --auto --merge`); console.log('PR merge attempted') } catch(e){ console.error('auto merge failed', e.message) }
      }
    } catch(e) {
      console.error('gh pr create failed (is gh CLI installed and authenticated?)', e.message)
    }
  } else {
    console.log('AUTO_PR not enabled — no PR created')
  }

  const stats = fs.existsSync(OUT_DIR) ? fs.readdirSync(OUT_DIR) : []
  console.log('Done. Generated items in', OUT_DIR, 'entries:', stats.length)
  console.log('Branch:', branch)
  console.log('Run with AUTO_PUSH=1 AUTO_PR=1 to push and create a PR.')
}

main()
