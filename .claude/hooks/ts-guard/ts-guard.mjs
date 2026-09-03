#!/usr/bin/env node
/**
 * ts-guard.mjs
 *
 * @author  vanch3d
 * @version 1.0
 *
 * Claude Code PostToolUse hook — runs `tsc --noEmit` after any TypeScript
 * file is written or edited. Surfaces type errors immediately so the agent
 * corrects them before moving on.
 *
 * Input:  JSON on stdin  { tool_name, tool_input: { file_path } }
 * Output: JSON on stdout { systemMessage } when errors are found (advisory)
 * Exit:   0 always — type errors are surfaced as context, not a hard block,
 *         because a partial implementation may be intentionally incomplete.
 *
 * Skips: non-.ts/.tsx files, files in node_modules / .next / dist.
 */

import { execSync } from 'node:child_process';

const TS_EXTENSIONS = /\.(ts|tsx)$/;
const SKIP_DIRS = /[\\/](node_modules|\.next|dist|build|coverage)[\\/]/;

async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString('utf-8');
}

const raw = await readStdin();
let data;
try { data = JSON.parse(raw); } catch { process.exit(0); }

const filePath = data?.tool_input?.file_path ?? data?.tool_response?.filePath ?? '';

if (!TS_EXTENSIONS.test(filePath) || SKIP_DIRS.test(filePath)) {
  process.exit(0);
}

try {
  execSync('pnpm exec tsc --noEmit --skipLibCheck', {
    encoding: 'utf-8',
    stdio: ['pipe', 'pipe', 'pipe'],
    timeout: 30_000,
  });
  // No output on success — silent pass
  process.exit(0);
} catch (err) {
  const output = (err.stdout || '') + (err.stderr || '');
  const lines = output.trim().split('\n').slice(0, 20); // cap output
  console.log(JSON.stringify({
    systemMessage: `TypeScript errors after editing ${filePath}:\n${lines.join('\n')}`,
  }));
  process.exit(0); // advisory only — agent sees the message, decides how to respond
}
