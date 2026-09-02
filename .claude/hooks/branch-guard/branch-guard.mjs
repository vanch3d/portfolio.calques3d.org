#!/usr/bin/env node
/**
 * branch-guard.mjs
 *
 * Claude Code PreToolUse hook — blocks `git commit` and `git push` when the
 * working branch is `main`, enforcing the feature-branch workflow.
 *
 * Input:  JSON on stdin  { tool_name, tool_input: { command } }
 * Output: JSON on stdout { decision, reason }  when blocking
 * Exit:   2              to signal Claude Code to block the tool call
 *         0              to pass through silently
 *
 * See README.md for convention, connection to CI, and branch protection rules.
 */

import { execSync } from 'node:child_process';

const PROTECTED_BRANCH = 'main';
const BLOCKED_SUBCOMMANDS = /^git (commit|push)\b/;

const data = JSON.parse(await readStdin());
const command = data?.tool_input?.command ?? '';

if (!BLOCKED_SUBCOMMANDS.test(command)) {
  process.exit(0);
}

let branch = '';
try {
  branch = execSync('git symbolic-ref --short HEAD', { encoding: 'utf8' }).trim();
} catch {
  // Detached HEAD or not a git repo — let git handle the error itself
  process.exit(0);
}

if (branch === PROTECTED_BRANCH) {
  console.log(JSON.stringify({
    decision: 'block',
    reason: `On '${PROTECTED_BRANCH}' branch. Create a feature branch first:\n  git checkout -b <type>/<slug>\nTypes: feat/ fix/ chore/ docs/ refactor/ test/`,
  }));
  process.exit(2);
}

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
