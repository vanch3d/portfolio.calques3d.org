#!/usr/bin/env node
/**
 * tracker-reminder.mjs
 *
 * Claude Code PostToolUse hook — fires after Bash commands that run tests or
 * validation, reminding Claude to update TRACKER.md before moving on.
 *
 * Triggers on: pnpm test, pnpm validate, cypress run
 *
 * Input:  JSON on stdin  { tool_name, tool_input: { command }, tool_response }
 * Output: JSON on stdout { systemMessage } — advisory only, never blocks
 * Exit:   0 always
 */

const data = JSON.parse(await readStdin());
const command = data?.tool_input?.command ?? '';

const isTestOrValidate = /\b(pnpm\s+(test|validate)|cypress\s+run)\b/.test(command);

if (isTestOrValidate) {
  console.log(JSON.stringify({
    systemMessage: 'Tests/validation ran — update .docs/tasks/TRACKER.md before moving on.',
  }));
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
