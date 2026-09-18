#!/usr/bin/env node
/**
 * agent-graphify-guard.mjs
 *
 * Claude Code PreToolUse hook — blocks any `Agent` tool call whose prompt does
 * not explicitly mention graphify, enforcing that every spawned subagent that
 * might explore code is told to use graphify before it starts (see
 * .claude/rules and CLAUDE.md's graphify rule, and the project's repeated
 * "subagents skipped graphify" incidents).
 *
 * This does not verify the subagent actually calls graphify during its run —
 * only that the instruction is present in the spawn prompt. Actual usage
 * during the run is separately enforced by the existing Read|Glob and
 * Bash|Grep PreToolUse hooks, which fire on the subagent's own tool calls too.
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

if (/graphify/i.test(prompt)) {
  process.exit(0);
}

console.log(JSON.stringify({
  decision: 'block',
  reason:
    "This Agent prompt does not mention graphify. Any subagent that may explore code (Read/Glob/Grep/Bash) " +
    "must be told, as the first instruction in its prompt, to run `graphify query \"<question>\"` (or " +
    "explain/path) before reading source files — see CLAUDE.md's graphify rule. Add an explicit graphify " +
    "instruction to the prompt and retry. If this agent genuinely does no code exploration (e.g. pure " +
    "writing/formatting task), state that explicitly in the prompt so this isn't a silent omission.",
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
