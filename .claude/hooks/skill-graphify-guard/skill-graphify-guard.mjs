#!/usr/bin/env node
/**
 * skill-graphify-guard.mjs
 *
 * Claude Code PreToolUse hook — blocks a `Skill` tool call carrying non-empty
 * `args` whose args do not mention graphify within roughly the first 300
 * characters, mirroring agent-graphify-guard.mjs's exact rule for the `Agent`
 * tool. Closes a real, demonstrated gap: the `Skill` tool has no separate
 * prompt field, so a bare invocation (e.g. `code-review epic/...`) carries no
 * channel at all for a graphify instruction unless one is written into
 * `args` explicitly — and nothing was checking that anyone did.
 *
 * Confirmed incident, 2026-09-27: a bare `Skill: code-review` call (no
 * graphify mention in args) produced a review scoped to the wrong diff, with
 * findings largely about files outside the actual PR and one claim that was
 * backwards. Re-invoked with an explicit graphify instruction prepended to
 * `args`, the run self-reported leading every file read with graphify. See
 * .docs/tasks/2026-09-27-graphify-strict-enforcement-handoff.md.
 *
 * Skipped, not blocked:
 * - Empty/missing `args` — a skill invoked with no direction is very rarely
 *   being pointed at this project's own code (validate, mermaid, comp-server
 *   with no target, etc.); requiring graphify there is pure friction with no
 *   payoff.
 * - Skill names in LOCAL_NON_EXPLORATORY — small, project-owned commands
 *   confirmed to never read source: process/asset management, not code
 *   search. Kept intentionally short; add to it only when a specific skill
 *   is confirmed not to read project files, not speculatively.
 *
 * Input:  JSON on stdin  { tool_name, tool_input: { skill, args, ... } }
 * Output: JSON on stdout { decision, reason }  when blocking
 * Exit:   2              to signal Claude Code to block the tool call
 *         0              to pass through silently
 */

const LOCAL_NON_EXPLORATORY = new Set(['comp-server', 'comp-approve', 'validate']);
const LEAD_WINDOW = 300;

const data = JSON.parse(await readStdin());
const skill = data?.tool_input?.skill ?? '';
const args = (data?.tool_input?.args ?? '').trim();

if (!args) {
  process.exit(0);
}

if (LOCAL_NON_EXPLORATORY.has(skill)) {
  process.exit(0);
}

if (/graphify/i.test(args.slice(0, LEAD_WINDOW))) {
  process.exit(0);
}

console.log(JSON.stringify({
  decision: 'block',
  reason:
    `This Skill call ("${skill}") has non-empty args that don't mention graphify within the ` +
    `first ${LEAD_WINDOW} characters. The Skill tool has no separate prompt field — args is the ` +
    "only channel to tell it (or any sub-agent it spawns) to lead with `graphify query \"<question>\"` " +
    "before reading source files, per .claude/rules/graphify.md. Prepend that instruction to args " +
    "and retry. If this specific skill call genuinely won't read this project's code, state that " +
    "explicitly at the start of args instead.",
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
