---
number: 10
title: 'Agentic Code Review Workflow'
status: proposed
date: '2026-08-15'
decision-makers: vanch3d
tags: ['claude-code', 'agents', 'workflow', 'code-review', 'dx']
---

# ADR 010 — Agentic Code Review Workflow

**Date:** 2026-08-15
**Status:** Proposed (evolving — updated as the workflow matures)

## Context

Claude Code is used as the primary development agent for this project.
As the codebase grows across multiple technology layers (Next.js App Router,
TypeScript, Tailwind v4, Cypress CT/E2E, Playwright), code quality checks
risk being skipped under time pressure or forgotten as context grows.

Several specialist review skills are available:

- `/typescript` — TypeScript strict patterns
- `/masanao-ohba-claude-manifests-code-reviewer` — Next.js 15/16 App Router
- `/tailwind-4` — Tailwind CSS v4 patterns
- `/playwright` — Playwright E2E patterns

The question is: when and how should these be applied, and who is responsible
for invoking them — the developer, the main agent, or an automated gate?

## Decision

Introduce a **`vanch-code-reviewer` sub-agent** that runs independently of
the main coding agent and produces a structured verdict before any commit
or PR. The main agent spawns it; it never edits files.

### Two review modes

**Commit mode** (`mode: commit`)

- Scope: staged files only (`git diff --cached --name-only`)
- Triggered: before every `git commit`
- Depth: file-level correctness — is this change safe and well-formed?
- Output: inline verdict (PASS / PASS WITH SUGGESTIONS / NEEDS CHANGES)
- Artifact: none (`.local/.review-done` flag consumed by hook)

**PR mode** (`mode: pr`)

- Scope: full branch delta (`git diff main...HEAD`)
- Triggered: before `gh pr create`
- Depth: feature-level coherence — does the whole branch hang together?
- Output: written report at `/tmp/pr-review.md`
- Artifact: report feeds directly into the PR description

### Skill dispatch

The reviewer classifies changed files and invokes the appropriate skill:

| File pattern                                    | Skill                                          |
| ----------------------------------------------- | ---------------------------------------------- |
| `*.ts`, `*.tsx`                                 | `/typescript`                                  |
| `src/app/**`, `src/components/**`, `src/lib/**` | `/masanao-ohba-claude-manifests-code-reviewer` |
| Tailwind utility classes present                | `/tailwind-4`                                  |
| `playwright/**/*.spec.ts`                       | `/playwright`                                  |

### Enforcement: hook + rule file (dual-layer)

**Mechanical layer** — `.claude/settings.json` `PreToolUse` hook:

- Intercepts every `git commit` Bash call
- Checks for `.local/.review-done` flag written by the reviewer
- Blocks commit and instructs the agent to run the reviewer first if flag absent
- Flag is consumed on success (one review per commit)

**Instruction layer** — `.claude/rules/code-review.md`:

- Tells the main agent to always spawn the reviewer before committing or PRing
- Documents the protocol in natural language
- Remains in force even if the hook is disabled

The dual layer means either can be removed independently:

- Hook disabled → rule file still instructs the agent
- Rule file relaxed → hook still blocks mechanically

### Token efficiency

Commit review cost is controlled by scope discipline on commits:
one coherent concern per commit, semantic commit types, small focused diffs.
A 4-file commit costs the reviewer far less than a 20-file sprawl.
The review discipline and commit discipline reinforce each other.

PR review cost is accepted as a one-time overhead per feature branch.
It earns its cost by eliminating the manual PR description writing step.

### Escape hatch

```bash
VANCH_SKIP_REVIEW_GATE=1 git commit ...
```

Or remove the `PreToolUse` hook from `.claude/settings.json`.
Both bypass mechanisms must be documented when used.

## Consequences

**Positive:**

- Code quality checks are never silently skipped
- Specialist skills are applied consistently without manual invocation
- PR descriptions are grounded in an actual review rather than generated independently
- The reviewer sub-agent has read-only tool access — it cannot accidentally edit code

**Negative / trade-offs:**

- Every commit requires a sub-agent invocation (token cost)
- Commit granularity must be maintained — large commits are expensive to review
- The flag-file mechanism is simple but relies on the filesystem; parallel commits could race (not a concern in this single-developer project)

**Open questions (to resolve as workflow matures):**

- Should Cypress CT specs have a dedicated review skill?
- Should the reviewer have access to the TypeScript compiler output (`tsc --noEmit`) as additional signal?
- At what commit volume does PR-level review become redundant with the accumulated commit reviews?

## Alternatives considered

**Rule file only (no hook)**
The main agent follows the rule by instruction. Lower mechanical reliability —
the agent could skip review if context is compressed or under pressure.
Still available as fallback (see Enforcement section).

**Git pre-commit hook (`.git/hooks/pre-commit`)**
A shell script in `.git/hooks/` would intercept commits at the git level,
independent of Claude Code. Rejected because `.git/hooks/` is not committed
to the repository and would need manual setup on each clone. The
`settings.json` hook is committed and version-controlled.

**Inline review by the main agent**
The main agent applies review skills itself without delegating to a sub-agent.
Rejected because it bloats the main agent's context window with review output,
competing with the coding context it needs to fix issues found.

**Automatic review on every file save (`PostToolUse` on `Write`/`Edit`)**
Too frequent — generates excessive token spend for incremental edits.
Commit-level granularity is the right boundary.
