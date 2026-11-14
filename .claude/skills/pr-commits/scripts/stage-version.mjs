#!/usr/bin/env node
/**
 * stage-version.mjs
 *
 * Stages a specific VERSION of a file in the git index without touching the working tree.
 * Used when one file (messages/en.json, TRACKER.md, ...) must carry different content in
 * several consecutive commits.
 *
 * Usage:
 *   node .claude/skills/pr-commits/scripts/stage-version.mjs <repo-path> <version-file> [--final]
 *
 *   <repo-path>     path of the file in the repo, e.g. messages/en.json
 *   <version-file>  file holding the content to stage, e.g. .local/tmp/stages/en.step2.json
 *   --final         assert the version equals the working-tree file (use for the LAST version
 *                   of a series, so the series cannot drift from the reviewed result)
 *
 * The index entry keeps the file's existing mode (default 100644).
 * Prints the blob sha. Exits non-zero on any error.
 */

import { spawnSync } from 'node:child_process'
import { readFileSync } from 'node:fs'

const args = process.argv.slice(2)
const final = args.includes('--final')
const [repoPath, versionFile] = args.filter((a) => !a.startsWith('--'))

if (!repoPath || !versionFile) {
  console.error('Usage: stage-version.mjs <repo-path> <version-file> [--final]')
  process.exit(2)
}

function git(...gitArgs) {
  const r = spawnSync('git', gitArgs, { encoding: 'utf8' })
  if (r.status !== 0) {
    console.error(`git ${gitArgs.join(' ')} failed:\n${r.stderr}`)
    process.exit(r.status ?? 1)
  }
  return r.stdout.trim()
}

if (final) {
  const version = readFileSync(versionFile, 'utf8')
  const worktree = readFileSync(repoPath, 'utf8')
  if (version !== worktree) {
    console.error(`--final: ${versionFile} differs from the working-tree ${repoPath}`)
    process.exit(1)
  }
}

// Existing mode in the index (e.g. 100644), or 100644 for a new file.
const ls = spawnSync('git', ['ls-files', '--stage', '--', repoPath], { encoding: 'utf8' }).stdout.trim()
const mode = ls ? ls.split(/\s+/)[0] : '100644'

const sha = git('hash-object', '-w', versionFile)
git('update-index', '--add', '--cacheinfo', `${mode},${sha},${repoPath}`)
console.log(`${repoPath} <- ${versionFile} (${sha.slice(0, 7)}${final ? ', matches working tree' : ''})`)
