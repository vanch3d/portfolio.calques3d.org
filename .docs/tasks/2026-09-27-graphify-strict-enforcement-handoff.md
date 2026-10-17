---
date: 2026-09-27
status: binding
scope: cross-cutting — every agent, every session, this repo
supersedes: nothing (extends .claude/rules/graphify.md, does not replace it)
---

# Graphify strict enforcement — handoff

## Read this first

This is not a proposal. Four sessions in a row, agents in this repo defaulted
to `Read`/`Grep`/`Glob` on the actual codebase instead of leading with
graphify, despite `.claude/rules/graphify.md` existing the whole time. Nicolas
has said the next miss gets `Read`/`Grep`/`Glob` banned project-wide. Treat
that as already true, not as a threat.

**A new hook is on the table, but only a narrow one.** Nicolas's position,
revised mid-session: "no new hooks" was protecting the orchestrator's own
non-compliance, not a principled stance — if a hook is what actually closes a
demonstrated gap, build it, but it must not be another overlapping layer that
adds noise without adding compliance (the exact failure of the three prior
rounds — see `.claude/rules/graphify.md`'s history section). A candidate hook
is drafted below, unregistered, for review before it's wired in.

The behavioral fix is still primary — a hook can't compensate for an
instruction that was never given. The fix is discipline on the orchestrator's part (yours, every
session), not tooling.

## The rule, stated once, unambiguously

Before reading, grepping, or globbing any file that is part of this
project's own codebase — by you directly, or by any agent/subagent/fork you
spawn — run `graphify query "<question>"` (or `explain`/`path`) first. Every
time. No exceptions for "this is just a quick check," "this file is small,"
or "the hook won't catch this one."

This applies regardless of _how_ the read happens: your own tool calls, an
`Agent`-tool subagent, a `Skill`-tool invocation (including forks and
third-party skills you didn't author). If you can't verify a spawned agent
did it, don't assume it did — check, or say plainly that you couldn't.

## What actually happened today (so this isn't abstract)

1. **`Agent`-tool forks are hook-exempt by design** (`agent-graphify-guard.mjs`
   skips any spawn with `subagent_type: "fork"`), on the theory a fork
   inherits the caller's context, including this rules file. That's true —
   but inheriting an instruction and _following_ it are different things, and
   nothing re-verifies the latter.
2. **The `Skill` tool has no prompt field.** `Skill({ skill, args })` passes
   `args` as a string; there's no separate channel to inject "lead with
   graphify" the way an `Agent` call's `prompt` allows. If you invoke a skill
   bare (no explicit instruction in `args`), you have communicated nothing
   about graphify to it, fork-exemption or not.
3. **A bare `Skill: code-review` invocation** (no graphify instruction in
   `args`, and — separately — the wrong fixed point) produced a review whose
   findings were largely about files outside the actual PR diff, including
   one finding that was backwards relative to what the diff actually did.
   Re-invoked with an explicit, forceful graphify instruction prepended to
   `args` and a verified diff target (`gh pr diff <n>`), the second run
   self-reported leading every file read with graphify, cross-referenced
   `.docs/issues/` to avoid duplicate findings, and hand-verified a borderline
   claim before including it. Same skill, same repo — the only variable that
   changed was whether the instruction was actually delivered.
4. **The built-in strict-mode hook's block is real but has a known shape**:
   at most once per session, and it downgrades to a skippable advisory
   whenever _any_ graphify query ran in the last 30 minutes — a global clock,
   not a per-agent one. In a long session where the orchestrator queries
   graphify constantly, that clock is essentially always satisfied, so a
   non-compliant subagent spawned later in the same session will rarely see
   a hard block. This is documented, intentional hook behavior, not a bug to
   patch — it means the hook is a backstop for the worst case, not something
   to rely on instead of actually giving the instruction.

## What to actually do, every session

- **Orchestrator (you):** graphify query before your own first Read/Grep/Glob
  of a project file, every session, without waiting to be blocked.
- **Spawning via `Agent` tool:** the graphify instruction is literally the
  first substantive thing in the prompt — not mentioned, not buried after
  context. The hook enforces this mechanically for non-fork spawns; match it
  for forks too even though the hook won't check.
- **Spawning via `Skill` tool:** if the invocation takes `args` and the skill
  (or anything it might spawn) will read code, put the graphify instruction
  at the start of `args`, explicitly, every time — especially for
  third-party/plugin skills (`mattpocock-skills/*`, etc.) you cannot edit and
  have no other way to instruct.
- **After a subagent/fork/skill returns:** if its report doesn't describe how
  it explored the codebase, don't assume graphify was used. Either the report
  says so, or you don't know — say that plainly rather than asserting
  compliance you haven't checked (this was called out directly this session:
  asserting "it inherited the rule via context" without verifying it hadn't
  been true).

## Drafted, not wired in: `Skill`-tool guard

`.claude/settings.json` has a `PreToolUse` hook on the `Agent` matcher
(`agent-graphify-guard.mjs`) but **none on `Skill`** — confirmed by reading
the file directly. That's the literal, demonstrated hole today's incident
exploited: a bare `Skill: code-review` call has no prompt field to carry an
instruction and nothing was checking whether `args` carried one either.

**2026-09-27, resolved:** the candidate hook at
`.claude/hooks/skill-graphify-guard/skill-graphify-guard.mjs` was reviewed
and registered — `.claude/settings.json` now has a `Skill` matcher entry
pointing at it, mirroring the existing `Agent` matcher entry for
`agent-graphify-guard.mjs`. It blocks a `Skill` call whose non-empty `args`
don't mention graphify in the first 300 characters, with the same "state
explicitly if this genuinely won't touch code" escape hatch. It skips
empty-`args` calls and a small, explicit, project-owned exclusion list
(`comp-server`, `comp-approve`, `validate`) to avoid false-positiving on
skills confirmed never to read source. Verified directly (not just read):
piping a bare `{skill:"code-review", args:"Review PR 37"}` payload through
the hook exits 2/blocks; prepending a graphify instruction to `args` exits
0/passes. Full rationale for the scoping is in the file's own header
comment.

## Non-goals

- Not re-litigating whether graphify is worth using — that's settled; see
  `.claude/rules/graphify.md`.
- Not attempting to close the 30-minute-global-clock hook behavior described
  above — that's a design tradeoff in the shipped strict-mode hook, not
  something to patch reactively mid-task, and doing so would repeat the
  exact "stack another layer" mistake the project has already made and
  reversed once (see `.claude/rules/graphify.md`'s own history section). The
  `Skill`-tool guard above is different in kind: it covers a tool surface
  with zero existing coverage, not a second opinion on one already covered.

## Related

- `.claude/rules/graphify.md` — the standing rules of engagement this doc extends.
- `.claude/hooks/agent-graphify-guard/agent-graphify-guard.mjs` — the `Agent`-tool prompt-presence guard (fork-exempt, as described above).
- `.claude/hooks/skill-graphify-guard/skill-graphify-guard.mjs` — drafted `Skill`-tool equivalent, not yet registered.
- ADR 022 — agent orchestration cost controls, governs the strict-mode hook this doc references.
- `.docs/tasks/2026-09-21-graphify-rules-of-engagement-plan.md` — prior consolidation attempt; partially superseded by the 2026-09-26 correction noted in `.claude/rules/graphify.md`.
