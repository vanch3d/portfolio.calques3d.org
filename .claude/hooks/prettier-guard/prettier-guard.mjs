#!/usr/bin/env node
/**
 * prettier-guard.mjs
 *
 * @author  vanch3d
 * @version 1.0
 *
 * Claude Code PostToolUse hook — formats the edited file with Prettier
 * after any Write/Edit. Scoped to the single file so unrelated formatting
 * drift elsewhere in the repo never blocks or noises up an edit.
 *
 * Input:  JSON on stdin  { tool_name, tool_input: { file_path } }
 * Output: JSON on stdout { systemMessage } when Prettier fails to parse (advisory)
 * Exit:   0 always — Prettier writes in place; parse failures are surfaced, not blocking.
 *
 * Skips: files with no matching Prettier parser, files covered by .prettierignore
 * (handled by Prettier itself since it honors .prettierignore for explicit paths too).
 */

import { execSync } from 'node:child_process';

async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString('utf-8');
}

const raw = await readStdin();
let data;
try { data = JSON.parse(raw); } catch { process.exit(0); }

const filePath = data?.tool_input?.file_path ?? '';

if (!filePath) process.exit(0);

try {
  execSync(`pnpm exec prettier --write "${filePath}"`, {
    encoding: 'utf-8',
    stdio: ['pipe', 'pipe', 'pipe'],
    timeout: 30_000,
  });
  process.exit(0); // silent pass — file formatted in place (or skipped via .prettierignore)
} catch (err) {
  const output = (err.stdout || '') + (err.stderr || '');
  const lines = output.trim().split('\n').slice(0, 25);
  console.log(JSON.stringify({
    systemMessage: `Prettier could not format ${filePath}:\n${lines.join('\n')}`,
  }));
  process.exit(0); // advisory — agent sees and corrects
}
