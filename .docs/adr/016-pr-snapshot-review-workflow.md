---
number: 16
title: "Agentic PR Snapshot and Review Workflow"
status: proposed
date: "2026-09-04"
decision-makers: vanch3d
tags: ["claude-code", "agents", "workflow", "pr", "cypress", "code-review", "dx"]
---

# ADR 016 — Agentic PR Snapshot and Review Workflow

**Date:** 2026-09-04
**Status:** Proposed

## Context

ADR 010 established the broad agentic code-review workflow: a
`vanch-code-reviewer` sub-agent, a commit-mode gate, and a PR-mode report.
As the tooling has matured, three additional concerns have emerged that
ADR 010 did not address:

1. **Visual evidence in PRs.** The portfolio is design-led. PRs that touch
   UI surfaces need screenshots to make review meaningful, not just a diff.

2. **PR description quality.** Handwritten PR bodies are inconsistent and
   often omit the "why". An automated description grounded in the actual
   diff is more reliable.

3. **Skill fragmentation.** A `pr-snapshots` skill was added to handle
   screenshots, but it grew to own the entire PR creation flow — including
   prescriptive body templates that were wrong for general engineering PRs.
   Meanwhile, better-suited skills (`github-pr`, `mattpocock/code-review`,
   a LobeHub description writer) existed but were bypassed.

This ADR documents the redesign of the PR creation flow into a composed,
skill-based pipeline with clearly separated responsibilities.

## Decision

Introduce a **`pr-flow` orchestrator skill** that wires four narrowly-scoped
concerns together. Each concern is owned by a distinct skill or script; the
orchestrator sequences them and manages the PR lifecycle.

### Responsibility split

| Concern | Owner | Output |
|---|---|---|
| Screenshot capture + upload | `pr-snapshots` script (`take-snapshots.mjs`) | `[{ route, url }]` JSON |
| PR body generation | `pr-description-writer` (LobeHub, meriley) | Body markdown |
| Code review | `mattpocock-skills/code-review` | Standards + Spec report |
| PR lifecycle | `pr-flow` skill (new) | Draft PR → review comment → ready |

### `pr-flow` sequence

```
1. Detect branch type (feat/fix/refactor) and base branch
2. Check dev server (http://localhost:3000)
3. Take screenshots → upload to GitHub CDN → get URLs
4. Run pr-description-writer → get body markdown
5. Inject snapshot table into body (append after generated content)
6. gh pr create --draft --body-file /tmp/pr-body.md
7. Run mattpocock/code-review (base branch as fixed point)
8. Post review as gh pr review <number> --comment (see Review identity below)
9. Inform user: PR is draft pending their review of the findings
   User runs `gh pr ready <number>` once satisfied
```

Steps 3 and 4 can run in parallel (screenshots and description generation
are independent).

### Screenshot capture

The `take-snapshots.mjs` script is responsible only for capture and upload.
It accepts:

- `--routes` — comma-separated app routes
- `--label before|after` — for fix/refactor before-and-after pairs
- `--capture viewport|fullPage` — default `viewport`; use `fullPage` for
  long pages where scroll height is needed

Viewport is fixed at **1280px wide** — the Tailwind `xl` breakpoint. If the
theme's `xl` breakpoint changes, this value must be updated to match.

Screenshots are uploaded to the GitHub CDN (`uploads.github.com`) and local
PNG files are deleted. No binary assets are committed to git.

### PR description

`pr-description-writer` analyses `git diff <base>...HEAD` and commit history,
discovers any PR templates in `.github/`, and generates a body with Summary,
Changes, Testing, and Checklist sections. The snapshot table is appended
after the generated content by the orchestrator (not by the writer).

### Code review and spec source

`mattpocock/code-review` runs a two-axis review:

- **Standards axis** — documented coding conventions (CLAUDE.md, component
  rules, i18n rules, a11y rules) plus Fowler smell baseline
- **Spec axis** — fidelity to the originating spec

For this repo the spec is the **surface brief or approved comp** in
`.docs/design/` that the branch implements — the same source `impeccable`
uses. If no surface doc exists, the skill asks. ADRs inform the Standards
axis (they document constraints the code must conform to), but are not
themselves the spec.

### Review identity

The review is posted via `gh pr review <number> --comment`, which creates a
formal GitHub review event (distinct from a thread comment; appears in the
Reviewers sidebar) without blocking merge.

Since `gh` authenticates as the repo owner, the review appears under the
owner's identity. The review body opens with an attribution header to make
the machine origin unambiguous:

```
🤖 Claude Code Review — mattpocock/code-review skill

## Standards
...

## Spec
...
```

A dedicated bot account (`vanch3d-bot` or similar) would give a genuinely
independent reviewer identity in GitHub's UI, but is not required for a
solo portfolio and is deferred until it becomes part of the portfolio story.

### Draft → ready lifecycle

PRs are always created as drafts. The code review is posted as a comment
immediately after creation. The owner reviews the findings and runs
`gh pr ready <number>` manually when satisfied.

The review skill deliberately avoids hard pass/fail verdicts (smells are
always judgement calls). Automated promotion based on review output would
misrepresent the skill's intent.

## Consequences

**Positive:**
- Each skill has one job; the orchestrator is the only place that changes
  when the PR flow changes.
- Screenshots, description, and review findings are always present on every PR.
- The draft gate ensures no PR is merged before the owner has seen the review.
- `pr-description-writer`'s verify mode can be used post-hoc to audit
  description accuracy if the branch evolves after PR creation.

**Negative / Trade-offs:**
- Requires installing `pr-description-writer` from LobeHub before the flow
  is complete.
- The snapshot table is appended rather than woven into the description —
  acceptable for now; revisit if `pr-description-writer` gains a context-
  passing API that allows the writer to place screenshots inline.
- Review posts as the owner's identity. Anyone reading the PR must interpret
  the attribution header correctly.

## Alternatives considered

**Keep `pr-snapshots` as the single PR skill**
Rejected. The skill had grown too broad and its body templates were wrong
for general engineering PRs. Separation of concerns is cleaner.

**Inline review in the PR body (before `gh pr create`)**
Run the review first, append findings to the body, then create the PR.
Rejected: the body grows large and conflates description with review;
GitHub's review mechanism exists precisely to separate these.

**`gh pr review --request-changes`**
Would block merge until resolved. Rejected for solo repos — `--approve`
would need to come from a second account, creating friction with no gain.

**Automated draft → ready promotion**
Promote the PR automatically if the review reports zero hard violations.
Rejected: the code-review skill's findings are always judgement calls.
Automated promotion would overstate their precision.

## Related

- ADR 010 — Agentic Code Review Workflow (parent decision)
- ADR 005 — Claude Code Project Configuration (skills, hooks)
- `.claude/skills/pr-snapshots/` — screenshot capture skill
- `.claude/skills/pr-description-writer/` — PR body generation (to install)
- `.claude/skills/mattpocock-skills/code-review/` — two-axis review
