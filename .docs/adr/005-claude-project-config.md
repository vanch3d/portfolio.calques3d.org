---
number: 5
title: "Claude Code Project Configuration Structure"
status: decided
date: "2026-08-04"
tags: ["tooling", "claude-code", "workflow", "dx"]
supersedes: []
---

# ADR 005 — Claude Code Project Configuration Structure

**Date:** 2026-08-04
**Status:** Decided

## Context

As the project grows, CLAUDE.md risks becoming a monolithic file that is loaded into every
conversation regardless of relevance — causing context bloat and reducing signal quality.
At the same time, repetitive workflows (content validation, new ADR creation, new project
scaffolding) have emerged that would benefit from codified commands.

This ADR establishes the structure and principles for Claude Code configuration in this
project: CLAUDE.md, `.claude/`, and their relationship to `.docs/` and memory.

## Decision

### 1. CLAUDE.md — the project constitution

CLAUDE.md stays at the root, under 200 lines, structured as WHY / WHAT / HOW:

- **WHY:** Project purpose and learning goals — context that shapes every decision
- **WHAT:** Stack, directory map, key constraints
- **HOW:** Essential commands, critical conventions, links to deeper docs via `@path/to/file.md`

Task-specific knowledge (API patterns, content schema, testing strategy) lives in `.docs/`
and is `@`-included from CLAUDE.md only where a standing instruction is needed. Detailed
rationale stays in ADRs.

### 2. `.claude/` structure

```
.claude/
  settings.json       # permissions, hooks
  commands/           # slash commands for repetitive workflows
    validate.md       # /validate — run all validation scripts
    new-adr.md        # /new-adr — scaffold a new ADR file
    new-project.md    # /new-project — scaffold a new MDX project file
  rules/              # domain-specific rule files (loaded via @-include when relevant)
    content.md        # content schema, MDX conventions, Zotero tag format
    api.md            # Zotero/Piwigo fetch patterns, OpenAPI conventions
    testing.md        # Vitest/Cypress/Playwright/MSW conventions (when testing is set up)
```

`rules/` files are created when a domain grows large enough that its conventions
crowd CLAUDE.md. Currently deferred — CLAUDE.md is within limits.

### 3. Memory system

Session memory lives in `~/.claude/projects/<project>/memory/` and is loaded
automatically in future conversations. It stores:
- User preferences and feedback (not repeated in CLAUDE.md)
- Project decisions that change frequently
- Things learned during a session that should persist

Memory is the right place for volatile project state; CLAUDE.md is for stable conventions.
The two should not duplicate each other.

### 4. Hooks

`settings.json` registers shell hooks that Claude Code executes automatically:
- **Pre-tool-use hook on Write/Edit:** run `npm run validate` before committing content
  changes (planned — deferred until validate script is fast enough for interactive use)
- Further hooks added as workflows stabilise

### 5. What is NOT adopted

- **`src/features/`** — does not map cleanly to App Router. Domain logic lives in
  `src/lib/` (server-side) and co-located route files. Revisit if a complex client-side
  feature with shared state emerges.
- **"Named exports only"** — conflicts with Next.js page file requirements (default export
  mandatory). Convention is named function declarations for page exports, either style
  for utilities. See ADR 004.
- **`skills/`** — deferred until a workflow is complex enough to warrant a multi-step agent.

### 6. Relationship to `.docs/`

`.docs/` is a first-class engineering artefact that also renders on the site (ADRs section).
It is not a Claude-specific config — it belongs to the project. CLAUDE.md may `@`-include
docs files for standing instructions but should not duplicate their content.

## Consequences

**Positive:**
- CLAUDE.md stays concise and signal-rich
- Repetitive workflows codified as slash commands — no repeated prompting
- Clear separation: memory (volatile, personal), CLAUDE.md (stable conventions),
  `.docs/` (engineering record, public)
- Hooks provide passive quality gates without requiring manual reminders

**Negative / Trade-offs:**
- `.claude/commands/` requires maintenance as workflows evolve
- `rules/` domain split is a judgment call — splitting too early adds navigation overhead
- Memory is local and not version-controlled — onboarding a second collaborator requires
  manual context transfer

## Related

- ADR 004 — Component Structure and File Naming Conventions
- `.docs/engineering/toolkit.md` — scripts, validation, Mermaid conventions
