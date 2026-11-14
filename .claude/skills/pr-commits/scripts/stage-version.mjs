#!/usr/bin/env node
/**
 * stage-version.mjs
 *
 * Stages a specific VERSION of a file in the git index without touching the working tree.
 * Used when one file (messages/en.json, TRACKER.md, ...) must carry different content in
 * several consecutive commits.
 *
 * Usage:
 *   node .claude/skills/pr-commits/scripts/stage-version.mjs <repo-path> <version-file> [--final] [--no-format-check]
 *
 *   <repo-path>     path of the file, RELATIVE TO THE REPO ROOT (forward or back slashes),
 *                   e.g. messages/en.json. Works from any subdirectory.
 *   <version-file>  file holding the content to stage, relative to the current directory,
 *                   e.g. .local/tmp/stages/en.step2.json
 *   --final         assert the version equals the working-tree file (use for the LAST
 *                   version of a series, so the series cannot drift from the reviewed
 *                   result). Line endings are normalised before comparing.
 *   --no-format-check
 *                   skip the Prettier check (see below)
 *
 * Checks, in order (each failure exits non-zero and stages nothing):
 *   1. arguments: exactly two paths, only the flags above (exit 2 otherwise);
 *   2. <repo-path> is in the index or in HEAD, or is a new file present in the working tree;
 *   3. with --final, the version matches the working-tree file;
 *   4. the version is Prettier-formatted for <repo-path> (files matched by .prettierignore
 *      pass untouched; skipped with a warning if Prettier cannot be resolved).
 *
 * File mode: the existing mode from the index, else from HEAD; a brand-new file gets 100644
 * (mode bits are not inferred from the working tree).
 *
 * Paths: a path starting with "--" cannot be passed (it would be read as a flag).
 * Exit codes: 0 staged, 1 check or git failure, 2 usage error. Prints the blob sha on success.
 */

import { spawnSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { isAbsolute, join, resolve } from 'node:path'

const USAGE =
  'Usage: stage-version.mjs <repo-path> <version-file> [--final] [--no-format-check]'
const KNOWN_FLAGS = new Set(['--final', '--no-format-check'])

function fail(message, code = 1) {
  console.error(message)
  process.exit(code)
}

// ── Arguments ────────────────────────────────────────────────────────────────

const args = process.argv.slice(2)
const flags = args.filter((a) => a.startsWith('--'))
const positional = args.filter((a) => !a.startsWith('--'))
const unknownFlags = flags.filter((f) => !KNOWN_FLAGS.has(f))

if (unknownFlags.length > 0) fail(`Unknown flag: ${unknownFlags.join(', ')}\n${USAGE}`, 2)
if (positional.length !== 2) fail(USAGE, 2)

const final = flags.includes('--final')
const formatCheck = !flags.includes('--no-format-check')
const repoPath = positional[0].replace(/\\/g, '/').replace(/^\.\//, '')
const versionFile = resolve(positional[1]) // relative to the caller's directory

if (isAbsolute(repoPath) || repoPath.split('/').includes('..')) {
  fail(`<repo-path> must be relative to the repo root, got: ${positional[0]}`, 2)
}
if (!existsSync(versionFile)) fail(`Version file not found: ${positional[1]}`, 2)

// ── git helpers (always run from the repo root) ──────────────────────────────

function run(command, commandArgs, options = {}) {
  const r = spawnSync(command, commandArgs, { encoding: 'utf8', ...options })
  if (r.error) fail(`Could not run ${command}: ${r.error.message}`)
  return r
}

const top = run('git', ['rev-parse', '--show-toplevel'])
if (top.status !== 0) fail('Not inside a git repository.')
const root = top.stdout.trim()

function git(...gitArgs) {
  const r = run('git', gitArgs, { cwd: root })
  if (r.status !== 0) fail(`git ${gitArgs.join(' ')} failed:\n${r.stderr}`, r.status ?? 1)
  return r.stdout.trim()
}

const normalise = (text) => text.replace(/\r\n/g, '\n')

// ── Which path, which mode ───────────────────────────────────────────────────

const indexEntry = git('ls-files', '--stage', '--', repoPath)
let mode = indexEntry ? indexEntry.split(/\s+/)[0] : null

if (!mode) {
  // Not in the index: a tracked file removed from it keeps its HEAD mode. ls-tree fails on a
  // repository without commits, which only means "no HEAD entry".
  const headEntry = run('git', ['ls-tree', 'HEAD', '--', repoPath], { cwd: root })
  const line = headEntry.status === 0 ? headEntry.stdout.trim() : ''
  mode = line ? line.split(/\s+/)[0] : null
}
if (!mode && !existsSync(join(root, repoPath))) {
  fail(`${repoPath} is not in the index or HEAD and does not exist in the working tree.`)
}
mode = mode ?? '100644'

// ── Content checks ───────────────────────────────────────────────────────────

const content = readFileSync(versionFile, 'utf8')

if (final) {
  const worktree = readFileSync(join(root, repoPath), 'utf8')
  if (normalise(content) !== normalise(worktree)) {
    fail(`--final: ${positional[1]} differs from the working-tree ${repoPath}`)
  }
}

if (formatCheck) {
  let prettierBin = null
  try {
    prettierBin = createRequire(join(root, 'package.json')).resolve('prettier/bin/prettier.cjs')
  } catch {
    console.error('warning: prettier not found, skipping the format check')
  }
  if (prettierBin) {
    const r = spawnSync(process.execPath, [prettierBin, '--stdin-filepath', repoPath], {
      cwd: root,
      encoding: 'utf8',
      input: content,
    })
    if (r.status !== 0) fail(`Prettier could not parse ${positional[1]} as ${repoPath}:\n${r.stderr}`)
    if (normalise(r.stdout) !== normalise(content)) {
      fail(
        `${positional[1]} is not Prettier-formatted for ${repoPath}.\n` +
          `Format it with: pnpm exec prettier --stdin-filepath ${repoPath} < ${positional[1]}`
      )
    }
  }
}

// ── Stage ────────────────────────────────────────────────────────────────────

// --path makes git apply the filters (e.g. autocrlf) of the real file, not of the version file.
const sha = git('hash-object', '-w', `--path=${repoPath}`, versionFile)
git('update-index', '--add', '--cacheinfo', `${mode},${sha},${repoPath}`)
console.log(`${repoPath} <- ${positional[1]} (${sha.slice(0, 7)}${final ? ', matches working tree' : ''})`)
