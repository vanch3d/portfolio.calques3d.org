# Claude configuration: spec for review

The agent configuration is code: `.claude/` (skills, agents, hooks, rules, commands, settings), `CLAUDE.md`,
`.docs/agents/`, `skills-lock.json`. It has no feature spec, but it has an intent: a constrained, cheap,
approval-gated agentic workflow. This file writes that intent down as checkable statements, so a review of
a diff that touches this configuration has something to hold it against.

**How to use it.** When a diff touches `.claude/**`, `CLAUDE.md`, `.docs/agents/**` or `skills-lock.json`,
pass this file as the **Spec source** of the `mattpocock-skills/code-review` skill (there is no design
comp or issue to use). The Standards axis keeps its usual sources (`CLAUDE.md`, `.claude/rules/`).

Each rule has an id, the statement, where it comes from, and how to verify it. "Convention" means the rule
is established practice but not yet written in an ADR: reviewing against it is fair, and promoting it
into an ADR is a good outcome of a review.

## A. Structure and placement

| Id  | Statement                                                                                                                                                                                     | Source                                                        | Verify                                                                                |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| A1  | `CLAUDE.md` stays under 200 lines (WHY / WHAT / HOW). Task-specific knowledge lives in `.docs/` or `.claude/rules/` and is not duplicated in it.                                              | ADR 005 §1, §9                                                | `wc -l CLAUDE.md`; look for content copied from a rule or ADR                         |
| A2  | A custom skill is committed through an explicit `!/.claude/skills/<name>` line in `.gitignore`; everything else under `.claude/skills/` is ignored (installed from the lock manifests).       | ADR 005 §3, §5                                                | the skill folder is not ignored: `git check-ignore -v .claude/skills/<name>/SKILL.md` |
| A3  | A custom skill has frontmatter `name`, `description`, `license`, `metadata.author: vanch3d`, `metadata.version`. A skill without `author: vanch3d` is third-party and is never edited.        | convention (the existing custom skills; `.gitignore` comment) | frontmatter of the changed `SKILL.md` against `pr-flow` and `pr-snapshots`            |
| A4  | A skill that needs scripts keeps them in `.claude/skills/<name>/scripts/`, not in the repo's `scripts/`; commands are flat `.md` files in `.claude/commands/`.                                | ADR 005 §3, §5                                                | file locations in the diff                                                            |
| A5  | `settings.json` is committed and holds what every contributor needs (plugins, hook registration); `settings.local.json` is gitignored and holds machine-specific permissions and MCP servers. | ADR 005 §3, §7                                                | no permissions or machine paths added to `settings.json`                              |

## B. Agents and cost

| Id  | Statement                                                                                                                                                                                            | Source                                             | Verify                                                                 |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- | ---------------------------------------------------------------------- |
| B1  | Every agent pins an explicit `model:`; `inherit` is never used. `haiku` for bounded mechanical work, `sonnet` for judgement. `opus` is never a standing default, only a one-off override on a spawn. | ADR 022 §1                                         | `grep '^model:' .claude/agents/*.md` (today: 4 haiku, 6 sonnet)        |
| B2  | Noisy mechanical output (tsc, lint, Cypress logs, large diffs) is run by an agent so it stays out of the orchestrator context; a skill does not run it inline.                                       | ADR 022 §2                                         | a new skill or command that runs such tools inline is a finding        |
| B3  | Any agent or spawn that may explore code starts with the graphify instruction as its first substantive line.                                                                                         | `.claude/rules/graphify.md` ("Spawning subagents") | `graphify` appears early in each agent definition and in spawn prompts |

## C. Graphify-first

| Id  | Statement                                                                                                                                                                                                     | Source                                                             | Verify                                                                    |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------- |
| C1  | Code exploration starts with `graphify query/explain/path`; raw Read/Grep/Glob/Bash search comes after, or for specific lines already known. The graph is refreshed (`graphify update .`) after code changes. | `.claude/rules/graphify.md`, ADR 022 §4                            | instructions in changed skills/agents do not tell the agent to grep first |
| C2  | A concern has one enforcement mechanism. A new hook layered over an existing one to fix the same behaviour is a finding; the hooks are a backstop, the rule is the mechanism.                                 | `.claude/rules/graphify.md`, ADR 022 More Information (2026-09-26) | the diff adds a second hook for a concern an existing one covers          |

## D. Hooks

| Id  | Statement                                                                                                                                                                                          | Source                            | Verify                                                                 |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- | ---------------------------------------------------------------------- |
| D1  | A hook lives in `.claude/hooks/<name>/<name>.mjs`, is registered in `.claude/settings.json`, and states in its header its input, its output and its exit code; advisory and blocking are explicit. | ADR 005 §7; existing hook headers | registration, matcher and header present for every new or changed hook |
| D2  | PostToolUse hooks are advisory (exit 0, message surfaced); only PreToolUse hooks block.                                                                                                            | existing hook headers             | exit codes in the changed hook                                         |
| D3  | Documentation of a hook (skills, ADRs, `.claude/hooks/branch-guard/README.md`) matches its real behaviour: name, matcher, regex anchoring, what it blocks.                                         | convention                        | read the hook next to every sentence that describes it                 |

## E. Approval and git workflow

| Id  | Statement                                                                                                                                                                        | Source                                                            | Verify                                                                       |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| E1  | Nothing is staged, committed or pushed without explicit approval; nothing is committed to `main`; `gh pr ready` and merging are never run by an agent; PRs are opened as drafts. | `.claude/skills/pr-flow`, `.claude/skills/pr-commits` §1          | a changed skill or agent that commits, pushes or marks ready states its gate |
| E2  | No coding on a new surface without an approved comp; the design-to-engineering handoff waits for an explicit go-ahead.                                                           | `CLAUDE.md`, `.claude/rules/feedback_impeccable_approval_gate.md` | a changed design or engineering agent keeps the gate                         |
| E3  | Temp files go to `.local/tmp/`, never `/tmp/` (Windows). Exploratory scripts are files (`scripts/*.mjs` or a skill's `scripts/`), never inline `node -e`.                        | `CLAUDE.md` ("Scripts", "Temp files")                             | grep the diff for `/tmp/` and `node -e`                                      |

## F. Skills and documents

| Id  | Statement                                                                                                                                                                                                                                             | Source                                                             | Verify                                                                        |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ | ----------------------------------------------------------------------------- |
| F1  | A skill's `description` says when to use it and what it is not for; no two skills answer the same request (no name collision, no near-identical descriptions).                                                                                        | convention                                                         | compare with the neighbouring skills (`pr-flow`, `pr-snapshots`, `github-pr`) |
| F2  | A script bundled with a skill has a usage header and defined exit codes, and is exercised by hand or by a test before the PR.                                                                                                                         | convention                                                         | the PR description says how it was exercised                                  |
| F3  | A document that describes behaviour (skill, ADR, README) matches the code it describes: hook names and regexes, script options, section cross-references, counts.                                                                                     | convention                                                         | check every checkable claim against the file it names                         |
| F4  | An ADR is named `NNN-short-title.md` and carries frontmatter `title`, `status` (`proposed`, `accepted`, `deprecated`, `superseded`) and `date`. Tickets are committed markdown under `.docs/issues/<feature>/NN-<slug>.md`; `TRACKER.md` is an index. | `.docs/agents/domain.md`, `.docs/agents/issue-tracker.md`, ADR 025 | filename and frontmatter of a changed ADR; a ticket outside `.docs/issues/`   |
| F5  | An ADR records the durable decision only, never "currently buggy" or "being fixed now".                                                                                                                                                               | convention                                                         | an ADR hunk that talks about implementation status                            |

## Known drift (as of 2026-11-14)

Existing mismatches between these sources. A review should not report them as new findings; each one is
a candidate for an ADR amendment or a ticket.

- **ADR 005** lists only `mermaid` under "Current custom skills"; the `.gitignore` exemptions are the real list.
- **ADR 005** names `skills-lock.json` as the lock for installed skills; `.claude/skills.json` also exists and is the file `.gitignore` refers to.
- **ADR 022** counts seven agents; there are now ten (`pr-description-writer`, `validate-runner` and `pr-snapshot-runner` joined, and all ten pin a model).
- **ADR 010** (status `proposed`) describes a `vanch-code-reviewer` agent, a `.local/.review-done` flag and `.claude/rules/code-review.md`, none of which exist; it also writes its report to `/tmp/pr-review.md`, against E3. `pr-flow` and ADR 016 replaced that design.
- **ADR 022** has `status: decided`, which is not in the vocabulary of `.docs/agents/domain.md` (`proposed`, `accepted`, `deprecated`, `superseded`).

## Maintenance

Add a rule when a review finds a recurring problem that no rule covers; mark it "convention" until an ADR
records it. Remove a rule when its source is superseded. Keep ids stable so review comments can cite them.
