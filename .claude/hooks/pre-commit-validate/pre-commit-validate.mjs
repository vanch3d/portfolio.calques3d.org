#!/usr/bin/env node
/**
 * pre-commit-validate.mjs
 *
 * @author  vanch3d
 * @version 1.0
 *
 * Claude Code PreToolUse hook — runs `pnpm validate` before any `git commit`.
 * Blocks the commit if validation fails.
 *
 * Validates: content schema · Mermaid diagram syntax · TypeScript (tsc --noEmit)
 * See: npm run validate in package.json
 *
 * Input:  JSON on stdin  { tool_name, tool_input: { command } }
 * Output: JSON on stdout { decision: "block", reason } when validation fails
 * Exit:   2              to block the commit
 *         0              to allow through silently
 *
 * Works alongside branch-guard: branch-guard checks the branch name,
 * this hook checks the code quality. Both must pass for a commit to proceed.
 */

import { execSync } from 'node:child_process';

const COMMIT_RE = /^git commit\b/;

async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString('utf-8');
}

const raw = await readStdin();
let data;
try { data = JSON.parse(raw); } catch { process.exit(0); }

const command = data?.tool_input?.command ?? '';

if (!COMMIT_RE.test(command)) {
  process.exit(0);
}

try {
  execSync('pnpm validate', {
    encoding: 'utf-8',
    stdio: ['pipe', 'pipe', 'pipe'],
    timeout: 60_000,
  });
  // Validation passed — allow commit
  process.exit(0);
} catch (err) {
  const output = ((err.stdout || '') + (err.stderr || '')).trim();
  const lines = output.split('\n').slice(0, 30); // cap output
  console.log(JSON.stringify({
    decision: 'block',
    reason: `Commit blocked: pnpm validate failed.\n\n${lines.join('\n')}\n\nFix validation errors before committing.`,
  }));
  process.exit(2);
}
