---
number: 22
title: 'Constrain Agent Orchestration Cost via Model Tiering and Strict Tool Guards'
status: decided
date: '2026-09-14'
decision-makers: vanch3d
tags: ['agents', 'claude-code', 'dx', 'workflow', 'process']
---

# ADR 022 — Constrain Agent Orchestration Cost via Model Tiering and Strict Tool Guards

**Date:** 2026-09-14
**Status:** Decided

## Context

The multi-agent workflow established by ADR 005 and ADR 010 (`nextjs-engineer` →
`tester`, the `impeccable-*` design pipeline, `pr-flow`) had grown to seven
project agents plus a handful of skills, all spawned by a single Sonnet
orchestrator session. Two devx tools were added to cut token cost further:
**graphify** (knowledge-graph-backed code lookup, replacing raw grep/read) and
**RTK** (a Rust CLI proxy that filters verbose command output before it reaches
context).

Anthropic's weekly usage cap — not the 5-hour cap — was the binding constraint:
continuous planning-and-execution work was being interrupted by hitting it. That
reframes the problem from "make individual responses better" to "reduce total
token burn across the whole session, including subagent spawns and devx tooling
overhead."

Three latent problems surfaced on inspection:

1. Every `.claude/agents/*.md` had `model: inherit` — no agent had ever been
   assigned an explicit model. `inherit` means a spawned subagent silently
   rides whatever model the orchestrator session happens to be running. If the
   orchestrator were ever switched to Opus for a hard planning task, every
   subsequent subagent spawn — including trivial, mechanical ones — would
   inherit Opus's cost for the rest of that session.
2. `pr-flow`, `pr-snapshots`, and the `/validate` command are plain skills/
   commands, not agents — skills have no `model:` field at all. They ran
   `tsc --noEmit`, ESLint, and full Cypress screenshot-run output **inline in
   the main orchestrator's context**, at whatever model the orchestrator was
   running, regardless of any model-tiering decision made elsewhere.
3. The graphify `PreToolUse` hook (`.claude/settings.json`, matchers on
   `Bash|Grep` and `Read|Glob`, calling `graphify.EXE hook-guard {search|read}`)
   was firing on every matching tool call, but only ever injected a soft
   `additionalContext` reminder — it never blocked the raw Read/Grep/Glob call
   it was nudging away from. There was no data on whether it, or RTK, were
   actually reducing cost; both tools' value was assumed, not measured.

## Decision

### 1. Pin explicit `model:` on every agent — never `inherit`

All seven `.claude/agents/*.md` files now set an explicit model instead of
`inherit`, decoupling subagent cost from whatever the orchestrator happens to
be:

| Tier     | Agents                                                                                                                   | Rationale                                                                                                                                                                                                                                                        |
| -------- | ------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `haiku`  | `tester`, `impeccable-manual-edit-applier`, `validate-runner`, `pr-snapshot-runner`                                      | Bounded, rule-driven, mechanical — no architectural judgment required.                                                                                                                                                                                           |
| `sonnet` | `nextjs-engineer`, `design-director`, `impeccable-asset-producer`, `impeccable-documenter`, `impeccable-finish-reviewer` | Creative, synthesis, or last-gate-before-ship judgment work.                                                                                                                                                                                                     |
| `opus`   | none, as a standing default                                                                                              | Reserved for an explicit one-off `Agent({model: "opus"})` override on a specific hard-planning spawn — never a config default anywhere, because with `inherit` still present elsewhere an Opus orchestrator would cascade Opus cost onto every spawned subagent. |

Opus as the **main orchestrator** was evaluated and rejected for the same
cascade reason: the model that reasons best at planning is also the one whose
standing use most directly threatens the weekly cap, and quality gain there
did not outweigh quota risk.

### 2. New agents to remove noisy tool output from orchestrator context

Two new Haiku-tier agents were added specifically to solve problem #2 above —
not just to run existing work on a cheaper model, but to keep large mechanical
tool output (compiler errors, lint output, Cypress console logs) out of the
orchestrator's context window entirely, which also reduces compaction pressure
(a secondary, easy-to-miss quota cost):

- **`validate-runner`** (`.claude/agents/validate-runner.md`) — runs
  `validate:content`, `validate:diagrams`, and `tsc --noEmit`; returns a
  condensed pass/fail report. Wired into `.claude/commands/validate.md`.
- **`pr-snapshot-runner`** (`.claude/agents/pr-snapshot-runner.md`) — runs the
  Cypress `pr-snapshots` capture script; returns only the resulting
  `[{route, url}]` JSON. Wired into `.claude/skills/pr-snapshots/SKILL.md` and
  `.claude/skills/pr-flow/SKILL.md` step 4a.

A dedicated commit-message-writer agent and a Haiku "router" subagent (to pick
which skill/agent to invoke) were both considered and rejected — see
Alternatives.

### 3. Measure devx tooling impact instead of assuming it

`.claude/skills/efficiency-report/` (`SKILL.md` + `scripts/analyze.mjs`) parses
this project's own Claude Code session transcripts
(`~/.claude/projects/<encoded-cwd>/*.jsonl` — real `tool_use`/`tool_result`
pairs with actual content sizes) as ground truth, rather than trusting each
tool's self-reported numbers.

- **RTK** already ships a real tracker (`rtk gain`, `rtk gain --history`) that
  diffs actual output against an estimate of the raw-command equivalent — no
  need to duplicate it. At last check: 58 commands tracked, 27.9% average
  token savings.
- **graphify** had no equivalent — `graphify-out/cost.json` only records the
  cost of _building/updating_ the graph, not savings from `graphify query`
  replacing a raw read. `efficiency-report` fills that gap with a `chars / 4`
  proxy (not the real Anthropic tokenizer, but sufficient for relative,
  before/after, category-level comparison), bucketed by tool category and
  normalized per elapsed day.

**First run (2026-09-14, after-window only ~2.3 days — low confidence):**
total tool-result token volume dropped from ~251K/day to ~115K/day
(normalized) after the graphify hook's install date, but graphify adoption was
only **2.5%** of source-lookup calls (7 `graphify query`/`explain`/`path` calls
vs. 269 raw Read/Grep/Glob/Bash-search calls in the after period). The volume
drop is therefore not attributable to graphify specifically; RTK showed real
adoption (0 → 15 calls) and plausibly explains more of it. Conclusion: the
hook was firing but not changing behavior, because a soft nudge does not
compete with the model's default instinct to just read the file.

### 4. Enable graphify's existing strict (blocking) mode

Investigation of the installed `graphify` package (`cli.py`, function
`_run_hook_guard`) found it already ships a `--strict` flag, previously unused
in this project:

- `graphify hook-guard read --strict` blocks — via Claude Code's
  `hookSpecificOutput.permissionDecision: "deny"`, not a process exit code —
  the **first** raw `Read` per session of a file that is in-project, indexed
  by the graph, and not stale, with a message redirecting to
  `graphify query` first.
- It downgrades to the existing soft nudge immediately after that one block,
  or if a `query`/`explain`/`path` ran within the last 30 minutes
  (`GRAPHIFY_HOOK_STRICT_TTL`, default 1800s).
- It fires **at most once per session** (tracked via an atomic session-marker
  file) — it can never strand the agent in a loop of denied reads.
- `Bash`, `Grep`, and `Glob` deliberately stay nudge-only always — a compound
  shell command has no single parseable target, so blocking there risks
  stranding navigation.
- Can be forced on or off globally via the `GRAPHIFY_HOOK_STRICT` env var
  without reinstalling.

Enabled by adding `--strict` to the `Read|Glob` matcher's hook-guard command in
`.claude/settings.json`. This targets the adoption gap found in #3 directly,
using a mechanism the upstream tool already engineered to be self-limiting.

## Verification

- [x] `grep -L "model: inherit" .claude/agents/*.md` matches all seven agent files (none left on `inherit`)
- [x] `.claude/agents/tester.md` and `.claude/agents/impeccable-manual-edit-applier.md` set `model: haiku`
- [x] `.claude/agents/nextjs-engineer.md`, `design-director.md`, `impeccable-asset-producer.md`, `impeccable-documenter.md`, `impeccable-finish-reviewer.md` set `model: sonnet`
- [x] `.claude/agents/validate-runner.md` and `.claude/agents/pr-snapshot-runner.md` exist, set `model: haiku`
- [x] `.claude/commands/validate.md` spawns `validate-runner` instead of running `tsc`/schema checks inline
- [x] `.claude/skills/pr-snapshots/SKILL.md` and `.claude/skills/pr-flow/SKILL.md` step 4a spawn `pr-snapshot-runner` instead of invoking `take-snapshots.mjs` inline
- [x] `.claude/skills/efficiency-report/scripts/analyze.mjs` runs against `~/.claude/projects/<encoded-cwd>/*.jsonl` and prints category/period token buckets plus an adoption ratio
- [x] `.claude/settings.json`'s `Read|Glob` matcher hook-guard command includes `--strict`
- [ ] `/efficiency-report` re-run with an after-window of at least 7 days shows the graphify adoption ratio has increased from the 2.5% baseline recorded here
- [x] `pr-flow`'s remaining inline steps (description writing, code review) evaluated for the same agent-extraction treatment — see More Information, 2026-09-14

## Consequences

**Positive:**

- Subagent cost is now explicit and independent of whatever the orchestrator
  session happens to be running — a future switch to Opus for planning cannot
  silently inflate `tester` or `impeccable-manual-edit-applier` cost.
- Mechanical, high-volume tool output (`tsc`, ESLint, Cypress) no longer lands
  in the orchestrator's context at all, not just on a cheaper model.
- Devx tooling claims (graphify, RTK) are now falsifiable against real
  transcript data instead of assumed.
- The graphify adoption gap has a concrete, low-blast-radius fix (self-limiting
  strict mode) rather than another prose reminder in CLAUDE.md.

**Negative / Trade-offs:**

- Two more agents to maintain (`validate-runner`, `pr-snapshot-runner`); each
  is a small, single-purpose file, but it is more moving parts.
- `efficiency-report`'s token counts are a `chars / 4` proxy, not the real
  tokenizer — good for relative comparison, not for reconciling against a
  bill.
- The first `efficiency-report` run has a ~2.3-day after-window; the 54%
  volume-drop figure is not yet reliable and must not be read as graphify's
  effect (see Context — adoption was only 2.5%).
- Strict mode can, in principle, deny a legitimate first read if the graph is
  fresh and the file is indexed; the once-per-session limit and the TTL-based
  downgrade bound the cost of this to a single redirect per session.
- `pr-flow`'s PR-description step ran inline in orchestrator context (via the
  `meriley-claude-code-skills-pr-description-writer` skill) at the time this
  ADR was written — resolved by `pr-description-writer`, see More
  Information, 2026-09-14. Code review only looked inline in the sense that
  the orchestrator called the skill directly, not in the sense that mattered
  here — it already delegates the expensive diff-reading work to its own
  parallel subagents.

## Alternatives considered

**Opus as the main orchestrator**
Better planning judgment, but with any remaining `model: inherit` it cascades
Opus cost onto every spawned subagent, and the weekly-cap risk this ADR exists
to reduce outweighs the planning-quality gain. Rejected as a standing default;
still available as a one-off override.

**A Haiku "router" subagent to pick which skill/agent to invoke**
Would offload dispatch decisions to a cheap model. Rejected: misrouting is
expensive to debug, and it does not save a hop — the orchestrator already has
to read and understand the request to decide whether to route at all.

**A dedicated commit-message-writer agent**
Considered alongside `validate-runner`/`pr-snapshot-runner`. Rejected: a commit
message is a couple lines of output; the fixed overhead of an `Agent()`
dispatch (system prompt, tool setup) costs more than the model-tier savings on
output this small.

**Blocking Bash/Grep/Glob in strict mode, not just Read**
graphify's own strict-mode design already rejects this (see Decision #4) — a
compound shell command has no single parseable target, so a blanket block
risks stranding navigation entirely. Deferred to the upstream tool's judgment
rather than re-litigated here.

## Related

- ADR 005 — Claude Code Project Configuration Structure (`.claude/` layout,
  skills-lock, settings split)
- ADR 010 — Agentic Code Review Workflow (prior art for hook + rule dual-layer
  enforcement, and for token-efficiency-by-scope-discipline reasoning)
- ADR 016 — Agentic PR Snapshot and Review Workflow (`pr-flow`; its remaining
  inline step was resolved in this ADR — see More Information, 2026-09-14)
- Follow-up: re-run `/efficiency-report` weekly until the after-window is long
  enough for the volume comparison to be reliable; revisit strict-mode
  adoption numbers at that point.

## More Information

- **2026-09-14:** Evaluated `pr-flow`'s two remaining inline steps (the open
  Verification item above). Code review (step 7, via
  `mattpocock-skills/code-review`) was found already well-architected — it
  internally spawns two parallel subagents (Standards axis, Spec axis), each
  capped under 400 words, so the expensive diff-reading work never lands in
  the orchestrator's context; no change made. PR description generation
  (step 4b, via `meriley-claude-code-skills-pr-description-writer`) was not —
  that skill has no subagent dispatch of its own, so its full
  `git diff [base]...HEAD` analysis ran entirely inline, the same problem
  `validate`/`pr-snapshots` had before this ADR. Added
  `.claude/agents/pr-description-writer.md` (`model: sonnet` — judgment/
  verification work, not mechanical enough for the haiku tier used by
  `validate-runner`/`pr-snapshot-runner`) wrapping the meriley skill's
  Create-mode workflow, and wired it into `pr-flow` step 4b in place of the
  inline skill invocation. The meriley skill itself is left in place,
  unmodified, for its Manual Creation and Verify-mode use cases, which the
  new agent does not cover.
