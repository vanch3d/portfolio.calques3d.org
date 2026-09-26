---
number: 25
title: 'Adopt spec/ticket/index model for engineering progress tracking'
status: accepted
date: '2026-09-26'
decision-makers: vanch3d
tags: ['process', 'documentation', 'agents']
---

# ADR 025 — Adopt spec/ticket/index model for engineering progress tracking

**Date:** 2026-09-26
**Status:** Decided

## Context

`TRACKER.md`'s Track I section reached 120 lines / 44.5KB — 79% of the entire file's bytes — almost entirely duplicating content that already existed in dated task docs (`.docs/tasks/2026-09-14-...`, `2026-09-18-...`, `2026-09-26-...` ×2) and in git commit messages. Root cause traced to `.claude/agents/nextjs-engineer.md` line 79, which explicitly instructed subagents to write decision narrative, judgment calls, and verification detail into `TRACKER.md`/"the task's report file" as the destination for anything that didn't belong in source comments. Every subagent that produced a wall of prose was following that instruction correctly; the instruction itself was wrong.

Investigating the fix surfaced a second, unrelated problem: `.docs/agents/issue-tracker.md` documents a GitHub Issues workflow (`gh issue create`, wayfinder maps, PRs as a request surface), and `CLAUDE.md`'s "Agent skills" section points to it. Both were added in a single commit (`70d275e`, 2026-09-02) as boilerplate from the `mattpocock-skills` plugin's `/setup-matt-pocock-skills` command, which defaults to GitHub whenever the repo's git remote points at GitHub (it does here). Neither file has been touched since, and there is no `gh issue` call anywhere in this repo's history. `TRACKER.md` first appeared two days later (`4f6e299`, 2026-09-04), in the same PR that introduced the `tracker-commit-guard`/`tracker-reminder` hooks, and has been the actual, continuously-used practice since — without anyone ever going back to reconcile or retire the GitHub-Issues config it silently superseded.

Inspecting the `mattpocock-skills` plugin (`~/.claude/plugins/cache/mattpocock/mattpocock-skills/1.2.3/`) directly showed it ships three tracker backends out of the box — GitHub, GitLab, and local markdown (`.scratch/<feature>/`) — and that its own model has no separate hand-maintained rollup file: ticket status lives on the ticket itself (a `Status:` line, closeable), which is the structural piece `TRACKER.md` never had. It tried to be both the index and the store, which is how it hit 44.5KB.

**Constraints:**

- This is a solo, private repository — no external contributors, no inbound issue triage (`triage` skill's use case doesn't apply).
- The review workflow requires durable, git-committed artifacts: Nicolas reviews the whole branch before anything merges to `epic/*`/`main`, so nothing load-bearing for that review can live in a gitignored or ephemeral location (`.local/tmp/track-i-pr-reports.md`, referenced as "where the detail lives" in the old `TRACKER.md`, was never actually durable — a second instance of the same underlying mistake).
- `tracker-commit-guard` already blocks any `git commit` touching `src/` unless `TRACKER.md` is also staged, and this must stay cheap to satisfy per commit, not become the reason `TRACKER.md` balloons again.

## Decision

**Adopt a three-tier model — spec / ticket / index — replacing the two-tier model (task docs + an overloaded `TRACKER.md`) and retiring the unused GitHub-Issues configuration.**

| Tier       | Location                                                | Role                                                                                                                                                                                                                                                                |
| ---------- | ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **ADR**    | `.docs/adr/` (unchanged)                                | Durable architecture decisions. Already working; not touched by this ADR.                                                                                                                                                                                           |
| **Spec**   | `.docs/tasks/*.md` (unchanged file shape, renamed role) | What/why/decisions/done-criteria for a bounded body of work — this is what the existing dated task docs already are.                                                                                                                                                |
| **Ticket** | **new:** `.docs/issues/<feature-slug>/NN-<slug>.md`     | One committed file per demoable unit of work. Carries a `Status:` line (`open`/`claimed`/`resolved`/`wontfix`) and a `Blocked by:` line where relevant. Judgment calls, verification results, and decision narrative live and close out here — not in `TRACKER.md`. |
| **Index**  | `TRACKER.md`, gutted                                    | One line per active spec: checkbox, one-line summary, pointer to its task doc and/or a commit SHA. No narrative.                                                                                                                                                    |

**Terminology fix:** "PR" stops being used as a synonym for a unit of work ("PR 5", "Scope D") — a PR is an actual GitHub pull request, which per this branch's standing rule doesn't exist until final review. Units of work are **tickets**. "Epic" is reserved for the git branch grouping (`epic/design-compass-app`) only, since that's a distinct, real concept this project already uses and is not a `mattpocock-skills` term.

**Persistence:** tickets are committed, same as specs and ADRs — not gitignored, unlike the `mattpocock-skills` default `.scratch/` convention. This is a deliberate deviation from the plugin's own guidance (see Alternatives Considered), required by this project's branch-wide review workflow. Tickets are lifecycle-bound to their feature rather than permanent: once a spec's work ships and its branch merges, its `.docs/issues/<feature-slug>/` directory may be deleted in a cleanup commit — git history retains it if ever needed, so nothing is actually lost.

**Non-goals:**

- Not adopting `wayfinder` as a default planning step — reserved for genuinely foggy, multi-session-unknown efforts. Work like the Collapsible/ConstructionPanel retrofit was decided in one sitting and fits `to-spec`→`to-tickets` directly.
- Not adopting `triage` — it's for externally-filed issues; this repo has no external contributors.
- Not extending `tracker-commit-guard` to also require a ticket file staged. `TRACKER.md`'s one-line pointer is the enforcement surface; confirmed sufficient.

## Consequences

- Good, because `TRACKER.md` becomes cheap to touch on every commit (one line, not a paragraph), which resolves the friction recorded in `project_tracker_hook_friction` (the hook's original intent — never land code without updating the ledger — was being defeated by the cost of updating a bloated ledger).
- Good, because detail (judgment calls, verification counts, API discrepancies found mid-implementation) gets one durable, committed, closeable home instead of either bloating `TRACKER.md` or vanishing into a gitignored scratch file.
- Good, because "PR"/"Scope"/"ticket" terminology collision — the thing that started this whole investigation — is resolved by picking one word (ticket) and reserving "PR" for its real meaning.
- Bad, because it's a new directory and a new file-per-ticket habit to establish; the first few tickets will be where the convention actually gets tested.
- Bad, because unlike GitHub Issues there's no native UI, search, or cross-linking — `.docs/issues/` is grep-and-read, which is acceptable for a solo repo but would not scale to a team.

## Implementation Plan

- **Affected paths**: `.docs/agents/issue-tracker.md` (rewritten), `.claude/agents/nextjs-engineer.md` (line 79 redirect), `CLAUDE.md` (Agent skills → Issue tracker line), `.docs/tasks/TRACKER.md` (Track I section trim — tracked as its own follow-up work, not part of this ADR's diff), new directory `.docs/issues/`.
- **Dependencies**: none.
- **Patterns to follow**:
  - `.docs/agents/issue-tracker.md` rewritten from the `mattpocock-skills` local-markdown template (`skills/engineering/setup-matt-pocock-skills/issue-tracker-local.md`), substituting `.docs/issues/` for the plugin's default `.scratch/` — downstream skills (`to-tickets`, `implement`, `wayfinder`) resolve the tracker location through this doc rather than a hardcoded path, so the substitution is safe.
  - Ticket file shape: `Status:` and `Blocked by:` lines near the top, question/work item in the body, `## Answer` or `## Resolution` heading appended when closed — matching the plugin's own local-tracker convention closely enough that `to-tickets`/`implement` still work if ever invoked against this repo.
  - `.claude/agents/nextjs-engineer.md` line 79: replace "that belongs in the PR description and in `TRACKER.md`/the task's report file" with a pointer to the relevant ticket file under `.docs/issues/`.
- **Patterns to avoid**: do not let `TRACKER.md` accumulate a second paragraph of narrative per item — if a line needs more than one sentence, it belongs in the ticket file, not the index. Do not create a ticket for routine sub-steps of a single-session change — tickets are for demoable, separately-trackable units, not a task-list substitute.

### Verification

- [ ] `.docs/agents/issue-tracker.md` documents the `.docs/issues/` local-markdown convention, not GitHub Issues.
- [ ] `CLAUDE.md`'s Agent skills → Issue tracker line points at the rewritten doc.
- [ ] `.claude/agents/nextjs-engineer.md` no longer instructs writing decision narrative into `TRACKER.md`.
- [ ] The four Track I open items flagged during this investigation (Button pressed-state outline/`:focus-visible` conflict; ADR 024's ambiguous "PR 3/4" checklist line; `Button`/`ConstructionPanel` `text-action` class duplication; whether `Collapsible` should be documented on `/lab/design-system`) exist as real ticket files under `.docs/issues/`.
- [ ] `TRACKER.md`'s Track I section is reduced to an index (checkbox + one line + pointer per entry).

## Alternatives Considered

- **GitHub Issues** (the pre-existing, unused config): rejected — zero actual usage since setup, and public-repo visibility is the wrong model for a private, review-gated solo workflow.
- **`mattpocock-skills` default local markdown at `.scratch/`**: closest fit, but rejected as-is. The plugin's own docs warn that storing tracker artifacts in-repo "tends to lead to accidental persistence," a caveat written for its default assumption that tickets are gitignored/throwaway scaffolding for a single agent session. That assumption doesn't hold here — this project's review workflow requires tickets to be committed and reviewable, which inverts the plugin's risk calculus. `.docs/issues/` keeps the plugin's file shape but treats persistence as the point, not the accident, with lifecycle-bound pruning (see Decision) as the actual answer to "don't let this accumulate forever."
- **Status quo** (`TRACKER.md` as both index and detail store): rejected — this is the practice that produced the 44.5KB bloat this ADR exists to fix.
- **Extend `tracker-commit-guard` to require a staged ticket file**: considered, not adopted — Nicolas confirmed the `TRACKER.md` one-liner enforcement is sufficient; revisit if tickets start landing without a corresponding index update in practice.

## Related

- `.claude/hooks/tracker-commit-guard/tracker-commit-guard.mjs` — the enforcement mechanism this model must stay cheap against.
- `.claude/agents/nextjs-engineer.md` — line 79, the instruction being corrected.
- `.docs/agents/issue-tracker.md` — rewritten by this ADR.
- `.docs/tasks/TRACKER.md` — the artifact whose bloat triggered this investigation; Track I trim tracked as follow-up.
- `~/.claude/plugins/cache/mattpocock/mattpocock-skills/` — source of the spec/ticket vocabulary and the local-markdown tracker template this ADR adapts.

## More Information

- **2026-09-26:** Decision reached via a live investigation into `TRACKER.md`'s bloat, prompted by direct user feedback ("I'm getting completely lost with your verbosity"). Git archaeology (commit `70d275e` for the GitHub-Issues boilerplate, `4f6e299` for `TRACKER.md`/the commit-guard hooks) confirmed the GitHub-Issues config was unexamined default output, not a deliberate, later-reversed decision.
- Revisit this ADR if the project ever gains external contributors (GitHub Issues' visibility/collaboration features would then earn their cost), or if `.docs/issues/` in practice fails to stay small via the lifecycle-pruning described above.
