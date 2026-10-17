#!/usr/bin/env node
/**
 * agent-graphify-guard.mjs
 *
 * Claude Code PreToolUse hook — blocks any `Agent` tool call whose prompt does
 * not mention graphify within roughly its first 300 characters, enforcing
 * that every spawned subagent that might explore code is told, as literally
 * the first thing in its prompt, to use graphify before it starts (see
 * .claude/rules/graphify.md and the project's repeated "subagents skipped
 * graphify" incidents — a mention buried later in the prompt was previously
 * accepted and did not hold up in practice).
 *
 * This does not verify the subagent actually calls graphify during its run —
 * only that the instruction is present, and positioned first, in the spawn
 * prompt. Actual usage during the run is separately enforced by the built-in
 * `graphify.EXE hook-guard read --strict` (see ADR 022, .claude/settings.json
 * Read|Glob matcher), which fires on the subagent's own Read/Glob/WebStorm-MCP
 * tool calls too, keyed by its own session_id.
 *
 * Input:  JSON on stdin  { tool_name, tool_input: { prompt, subagent_type, ... } }
 * Output: JSON on stdout { decision, reason }  when blocking
 * Exit:   2              to signal Claude Code to block the tool call
 *         0              to pass through silently
 */

const data = JSON.parse(await readStdin());
const prompt = data?.tool_input?.prompt ?? '';
const subagentType = data?.tool_input?.subagent_type ?? '';

// Forks inherit the caller's full conversation context (including whatever
// graphify usage/instructions already exist there) — they aren't a fresh
// agent that needs the instruction re-stated.
if (subagentType === 'fork') {
  process.exit(0);
}

const LEAD_WINDOW = 300;

if (/graphify/i.test(prompt.slice(0, LEAD_WINDOW))) {
  process.exit(0);
}

console.log(JSON.stringify({
  decision: 'block',
  reason:
    `This Agent prompt does not mention graphify within its first ${LEAD_WINDOW} characters. Any subagent ` +
    "that may explore code (Read/Glob/Grep/Bash) must be told, as literally the first thing in its prompt, " +
    "to run `graphify query \"<question>\"` (or explain/path) before reading source files — see " +
    ".claude/rules/graphify.md. A mention buried later in the prompt does not count: this hook checks " +
    "position, not presence, because a buried mention gets treated as background, not the actual top " +
    "priority, by the agent that receives it. Move the graphify instruction to the front and retry. If this " +
    "agent genuinely does no code exploration (e.g. pure writing/formatting task), state that explicitly as " +
    "the first line instead.",
}));
process.exit(2);

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
