#!/usr/bin/env node
/**
 * tracker-commit-guard.mjs
 *
 * Claude Code PreToolUse hook — blocks `git commit` when TRACKER.md has not
 * been staged, enforcing the rule that the tracker is updated with every commit.
 *
 * Input:  JSON on stdin  { tool_name, tool_input: { command } }
 * Output: JSON on stdout { decision, reason }  when blocking
 * Exit:   2              to signal Claude Code to block the tool call
 *         0              to pass through silently
 */

import { execSync } from 'node:child_process';

const data = JSON.parse(await readStdin());
const command = data?.tool_input?.command ?? '';

// Only intercept git commit commands
if (!/\bgit\b.*\bcommit\b/.test(command)) {
  process.exit(0);
}

let stagedFiles = '';
try {
  stagedFiles = execSync('git diff --cached --name-only', { encoding: 'utf8' });
} catch {
  // Cannot determine staged files — don't block
  process.exit(0);
}

const files = stagedFiles.split('\n').filter(Boolean);
const hasSrcChanges = files.some(f => f.startsWith('src/'));
const trackerStaged = files.some(f => f.includes('TRACKER.md'));

if (hasSrcChanges && !trackerStaged) {
  console.log(JSON.stringify({
    decision: 'block',
    reason: 'src/ files are staged but TRACKER.md is not. Update .docs/tasks/TRACKER.md to reflect completed work, then stage it before committing.',
  }));
  process.exit(2);
}

process.exit(0);

// ── helpers ──────────────────────────────────────────────────────────────────

function readStdin() {
  return new Promise((resolve, reject) => {
    let buf = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', chunk => { buf += chunk; });
    process.stdin.on('end', () => resolve(buf));
    process.stdin.on('error', reject);
  });
}
