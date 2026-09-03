#!/usr/bin/env node
/**
 * eslint-guard.mjs
 *
 * @author  vanch3d
 * @version 1.0
 *
 * Claude Code PostToolUse hook — runs ESLint on the edited file after any
 * Write/Edit. Surfaces lint errors immediately so the agent corrects them.
 *
 * Input:  JSON on stdin  { tool_name, tool_input: { file_path } }
 * Output: JSON on stdout { systemMessage } when errors are found (advisory)
 * Exit:   0 always — lint errors are surfaced as context, not a hard block.
 *
 * Skips: non-JS/TS files, node_modules / .next / dist, test files.
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
  execSync(`pnpm run lint -- "${filePath}"`, {
    encoding: 'utf-8',
    stdio: ['pipe', 'pipe', 'pipe'],
    timeout: 30_000,
  });
  process.exit(0); // silent pass
} catch (err) {
  const output = (err.stdout || '') + (err.stderr || '');
  const lines = output.trim().split('\n').slice(0, 25);
  console.log(JSON.stringify({
    systemMessage: `ESLint errors after editing ${filePath}:\n${lines.join('\n')}`,
  }));
  process.exit(0); // advisory — agent sees and corrects
}
