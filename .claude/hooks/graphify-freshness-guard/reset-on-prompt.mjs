#!/usr/bin/env node
/**
 * reset-on-prompt.mjs
 *
 * Claude Code UserPromptSubmit + SessionStart hook — marks the graphify
 * freshness gate (see graphify-freshness-guard.mjs) stale at the start of
 * every new user turn and every new session, so a graphify query from three
 * turns ago can't keep satisfying the gate indefinitely.
 *
 * Input:  JSON on stdin (ignored — just a trigger)
 * Output: none
 * Exit:   0 always (never blocks)
 */

import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';

const STATE_PATH = join(process.cwd(), '.local', 'graphify-freshness-state.json');

await readStdin();

const dir = dirname(STATE_PATH);
if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
writeFileSync(STATE_PATH, JSON.stringify({ fresh: false }), 'utf8');

process.exit(0);

function readStdin() {
  return new Promise((resolve) => {
    let buf = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', chunk => { buf += chunk; });
    process.stdin.on('end', () => resolve(buf));
    process.stdin.on('error', () => resolve(buf));
  });
}
