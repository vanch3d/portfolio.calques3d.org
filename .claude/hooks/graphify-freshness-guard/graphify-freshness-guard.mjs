#!/usr/bin/env node
/**
 * graphify-freshness-guard.mjs
 *
 * Claude Code PreToolUse hook — blocks Read, Glob, and search-like Bash
 * commands (grep/rg/find/cat/head/tail/ls) unless a `graphify query/explain/
 * path` call has already run THIS TURN. The built-in graphify hook-guard
 * (graphify.EXE hook-guard read/search) only blocks once per SESSION, which
 * left every later turn free to grep/read raw files with nothing enforcing
 * a fresh query per new question — this closes that gap.
 *
 * State is reset to "stale" by reset-on-prompt.mjs on every UserPromptSubmit
 * and SessionStart, so each new user turn requires its own graphify query
 * before the first exploration call — but does not require re-querying for
 * every individual file read within the same turn (multiple Read calls
 * answering the same oriented question are fine once the turn's gate is open).
 *
 * Input:  JSON on stdin  { tool_name, tool_input: { command } }
 * Output: JSON on stdout { decision, reason }  when blocking
 * Exit:   2              to signal Claude Code to block the tool call
 *         0              to pass through silently
 *
 * Covers not just the built-in Read/Glob/Bash but every WebStorm MCP tool
 * that duplicates search/read functionality under a different tool name
 * (search_text, search_regex, search_symbol, search_file, read_file, etc.) —
 * a prior version of this hook only matched Read|Glob|Bash and a spawned
 * agent used mcp__webstorm__search_text to bypass it entirely undetected.
 * If a new MCP server is added later that exposes more read/search tools,
 * extend ALWAYS_GATE (or the settings.json matcher) the same way — don't
 * assume Read/Glob/Bash coverage is complete.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';

const STATE_PATH = join(process.cwd(), '.local', 'graphify-freshness-state.json');

// Pure search/read primitives — no command string to parse, always gated.
const ALWAYS_GATE = new Set([
  'Read',
  'Glob',
  'mcp__webstorm__read_file',
  'mcp__webstorm__search_regex',
  'mcp__webstorm__search_symbol',
  'mcp__webstorm__search_file',
  'mcp__webstorm__search_text',
  'mcp__webstorm__get_symbol_info',
  'mcp__webstorm__list_directory_tree',
  'mcp__webstorm__generate_psi_tree',
  'mcp__webstorm__analyze_calls',
  'mcp__webstorm__get_all_open_file_paths',
  'mcp__webstorm__execute_terminal_command',
]);

const data = JSON.parse(await readStdin());
const toolName = data?.tool_name ?? '';
const command = data?.tool_input?.command ?? '';

if (toolName === 'Bash') {
  if (/\bgraphify\s+(query|explain|path)\b/i.test(command)) {
    setFresh(true);
    process.exit(0);
  }
  const searchLike = /(^|[;&|]\s*)(grep|rg|find|cat|head|tail|ls)\b/i.test(command);
  if (!searchLike) {
    // Not an exploration command (git, npm, pnpm, node, mkdir, etc.) — let it through.
    process.exit(0);
  }
} else if (!ALWAYS_GATE.has(toolName)) {
  process.exit(0);
}

if (isFresh()) {
  process.exit(0);
}

console.log(JSON.stringify({
  decision: 'block',
  reason:
    "No graphify query has run yet this turn. Run `graphify query \"<question>\"` (or explain/path) " +
    "first to orient yourself, then retry this Read/Glob/grep — per CLAUDE.md's graphify rule and " +
    "the project's repeated 'skipped graphify mid-conversation' incidents. One query opens the gate " +
    "for the rest of this turn; it resets on your next message.",
}));
process.exit(2);

// ── helpers ──────────────────────────────────────────────────────────────────

function readState() {
  try {
    return JSON.parse(readFileSync(STATE_PATH, 'utf8'));
  } catch {
    return { fresh: false };
  }
}

function isFresh() {
  return readState().fresh === true;
}

function setFresh(value) {
  const dir = dirname(STATE_PATH);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  writeFileSync(STATE_PATH, JSON.stringify({ fresh: value }), 'utf8');
}

function readStdin() {
  return new Promise((resolve, reject) => {
    let buf = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', chunk => { buf += chunk; });
    process.stdin.on('end', () => resolve(buf));
    process.stdin.on('error', reject);
  });
}
