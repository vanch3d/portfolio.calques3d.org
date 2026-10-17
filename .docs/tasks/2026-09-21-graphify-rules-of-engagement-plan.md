# Graphify Rules of Engagement — clean consolidation

## Context

Graphify enforcement in this project grew by incremental patching across three separate sessions, each one bolted on in reaction to a specific complaint rather than designed as one system. The result, as of today, is three overlapping mechanisms that don't share a model of "session," produce different (sometimes contradictory) block messages, and still don't cover most agents:

1. **Built-in `graphify.EXE hook-guard read/search --strict`** (`.claude/settings.json`, `Read|Glob` and `Bash|Grep` matchers) — blocks once per session, ever. First exploration call in a session is blocked; every later one in that same session is free, permanently.
2. **Custom `graphify-freshness-guard.mjs`** (`Read|Glob|Bash|mcp__webstorm__*` matcher, + `reset-on-prompt.mjs` on `UserPromptSubmit`/`SessionStart`) — built specifically because (1) was too permissive after turn 1. Blocks unless a graphify query has run _this turn_. Fixed today to key state by `session_id` (was previously one shared flag file, which let the orchestrator's own query silently unlock every subagent it spawned for the rest of that turn — confirmed and reproduced earlier this session).
3. **Custom `agent-graphify-guard.mjs`** (`Agent` matcher) — blocks spawning a subagent unless the word "graphify" appears anywhere in its prompt. Satisfied today by the word appearing anywhere, including buried after unrelated sections — which the project's own memory log already flagged as insufficient ("whatever is first gets treated as the actual top priority by the agent").

On top of the hook layer, only **3 of the 10 agent definitions** (`nextjs-engineer.md`, `tester.md`, `validate-runner.md`) mention graphify at all — `design-director.md` and all four `impeccable-*.md` agents, plus `pr-snapshot-runner.md` and `pr-description-writer.md`, have Read/Glob/Grep/Bash tools and zero instruction. They rely entirely on hook (1)/(2) catching them reactively.

The user's diagnosis, twice today: patching guards one bug at a time is producing "layers of overhead on layers of overhead," and the deeper problem — leading with `Read`/`Grep` and letting a hook block you, instead of leading with `graphify query` — isn't a hook bug at all, it's a design that never made the instruction the obvious, unmissable, singular thing to do. This plan replaces the three-mechanism patchwork with one coherent system, in a single pass, not another reactive fix.

## Design

**One gate per concern, not overlapping gates for the same concern:**

- Drop the built-in `graphify.EXE hook-guard` entirely (remove both its `settings.json` entries). It's strictly weaker than and redundant with the freshness guard, and its different block-message wording is part of the noise.
- Keep `graphify-freshness-guard.mjs` (now session-scoped, already fixed) as the **single** authority for "have you queried graphify recently enough to read/grep/search raw files." No second opinion, no second message.
- Keep `agent-graphify-guard.mjs` as the **single** authority for "does this subagent's spawn prompt carry the instruction" — but tighten it so a buried mention doesn't satisfy it: require the match within roughly the first 300 characters of the prompt, so it structurally enforces "first thing said," not "said somewhere."

**One canonical instruction, not N copies that drift:**

- New `.claude/rules/graphify.md`, written once, matching the existing convention already used for `accessibility.md`/`i18n.md`/`components.md`/`tailwind.md` (referenced from `CLAUDE.md` via `@path`, and — this is the part currently missing — referenced from every agent definition that touches code). Content: the mandatory-first-action rule, the "lead with it, don't wait to be blocked" framing (this session's actual failure mode), and the requirement that any agent which itself spawns subagents puts the instruction as literally the first thing in that subagent's prompt.
- Every agent `.md` with Read/Glob/Grep/Bash tools gets one line — `@.claude/rules/graphify.md` — instead of bespoke prose. `nextjs-engineer.md`/`tester.md`/`validate-runner.md`'s existing sections collapse down to that reference plus only what's genuinely agent-specific (e.g. `nextjs-engineer`'s own duty to write a real instruction into `tester`'s spawn prompt). The 7 currently-silent agents (`design-director`, the four `impeccable-*`, `pr-snapshot-runner`, `pr-description-writer`) each get the same one line added.
- `CLAUDE.md`'s existing `### graphify` section stays as the short what/why summary, but its "Rules" bullets get replaced with a pointer to `.claude/rules/graphify.md` for the actual rules of engagement — mirrors how the other rule areas are split.

**My own behaviour (orchestrator) is not a hook problem.** No file changes can fix "I called Read before I called graphify query" — that's a habit fix, not a code fix. It's already logged in memory today. This plan's job is to remove the noise (three inconsistent hooks) and make the one remaining instruction unmissable everywhere it needs to appear; verifying it actually took hold is a measurement problem, addressed below.

## Files touched

- `.claude/settings.json` — remove the two `graphify.EXE hook-guard` hook entries (`Bash|Grep` and `Read|Glob` matchers). Leave every other entry (branch-guard, pre-commit-validate, tracker-commit-guard, freshness-guard, agent-graphify-guard, ts-guard, eslint-guard, prettier-guard, tracker-reminder) untouched.
- `.claude/hooks/agent-graphify-guard/agent-graphify-guard.mjs` — change the match from "graphify anywhere in prompt" to "graphify within the first ~300 chars," update the block reason message to say so explicitly.
- `.claude/rules/graphify.md` — new file, canonical rules of engagement.
- `CLAUDE.md` — trim the `### graphify` section's "Rules" bullets to a pointer at the new rules file.
- `.claude/agents/design-director.md`, `impeccable-asset-producer.md`, `impeccable-documenter.md`, `impeccable-finish-reviewer.md`, `impeccable-manual-edit-applier.md`, `pr-snapshot-runner.md`, `pr-description-writer.md` — add one `@.claude/rules/graphify.md` line each, placed as the first substantive line under whatever heading precedes their existing instructions.
- `.claude/agents/nextjs-engineer.md`, `tester.md`, `validate-runner.md` — replace their existing bespoke "Graphify" sections with the one-line reference + only the genuinely agent-specific residue (nextjs-engineer's "write a real instruction into tester's prompt" duty).

`graphify-freshness-guard.mjs` and `reset-on-prompt.mjs` are **not** touched further — today's session-scoping fix stands as-is; this plan builds on it, doesn't redo it.

## Out of scope

Nothing about `Explore`/`general-purpose`/`Plan` agent types, `Skill`-tool-invoked flows (`code-review`, `pr-flow`, etc.), or any non-graphify hook (branch-guard, tracker-commit-guard, ts-guard, eslint-guard, prettier-guard, tracker-reminder) changes here. The currently-paused Track I scope B work is untouched and resumes independently once this is done.

## Verification

1. Re-run the same manual hook-simulation check used earlier this session (`echo '{"session_id":...}' | node graphify-freshness-guard.mjs`) against a couple of tool/session combinations to confirm no regression after removing the built-in hook-guard entries.
2. Spawn one real, cheap subagent after the change and confirm from its own final report that it ran `graphify query` before its first `Read` — not inferred, actually stated.
3. Run the existing `efficiency-report` skill after a handful of real agent runs to get a measured adoption number against real transcripts, compared to the ~2.5% baseline already on record in memory — this replaces "I promise I'll do better" with an actual number.
