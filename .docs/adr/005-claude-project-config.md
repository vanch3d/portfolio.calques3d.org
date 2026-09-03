---
number: 5
title: "Claude Code Project Configuration Structure"
status: accepted
date: "2026-08-04"
decision-makers: vanch3d
tags: ["tooling", "claude-code", "workflow", "dx", "skills", "agents"]
---

# ADR 005 — Claude Code Project Configuration Structure

**Date:** 2026-08-04 · **Amended:** 2026-09-02
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

### 2. Domain context documents (amended 2026-09-02)

Three documents at the repo root serve the agent skills ecosystem:

- **`CONTEXT.md`** — domain vocabulary (ubiquitous language). Defines terms agents must use
  consistently. Kept short — under 60 lines. Deep model detail stays in ADR 014.
- **`PRODUCT.md`** — product context: audience, site sections, content strategy, success
  criteria. Populated as the design phase progresses.
- **`DESIGN.md`** — design system context: visual language, component patterns, design tokens,
  Figma file references. Populated during the design phase.

These are distinct from CLAUDE.md (Claude-specific) — they are agent-agnostic and read by
any tool that follows the mattpocock-skills convention.

### 3. `.claude/` structure (amended 2026-09-02)

```
.claude/
  settings.json         # project-level config (committed) — enabledPlugins
  settings.local.json   # machine-specific config (gitignored) — permissions, MCP servers
  skills/               # gitignored (reproduced from skills-lock.json)
    mermaid/            # EXCEPTION: custom project skill — committed
      SKILL.md
      scripts/
        validate-diagrams.mjs
  commands/             # slash commands for repetitive workflows (committed when created)
    validate.md         # /validate — run all validation scripts
  rules/                # domain-specific rule files (committed when created)
```

**settings.json / settings.local.json split:**
- `settings.json` (committed): project requirements that every contributor needs — `enabledPlugins`
- `settings.local.json` (gitignored): machine-specific — `permissions.allow`, MCP server selection

**Skills gitignore convention:**
- `/.claude/skills/*` is gitignored (marketplace skills are reproducible from `skills-lock.json`)
- Custom project-owned skills are un-ignored via explicit `.gitignore` negation:
  `!/.claude/skills/mermaid` — one exception line per custom skill

### 4. Agent skill configuration (amended 2026-09-02)

Agent skill configuration lives in `.docs/agents/` (consistent with the project's `.docs/`
convention rather than the mattpocock default `docs/agents/`):

- **`.docs/agents/issue-tracker.md`** — GitHub Issues, `gh` CLI, PRs as request surface
- **`.docs/agents/domain.md`** — single-context layout, `.docs/adr/` path, ADR conventions

The `## Agent skills` section in CLAUDE.md provides one-line summaries and pointers to these
files, making them discoverable without loading the full configuration.

### 5. Skills

Skills follow the `node_modules` pattern:

- **`skills-lock.json`** (committed) — reproducibility lock for installed marketplace skills
- **`.claude/skills/`** (gitignored) — installed skills directory, reproduced from lock file
- **Custom skills** (committed via gitignore negation) — project-owned, not marketplace-installed

Current custom skills:
- `mermaid` — Mermaid diagram authoring rules and bundled validator for this repo

Plugins (which provide skills via the marketplace mechanism) are declared in
`settings.json` as `enabledPlugins` so they are version-controlled alongside the project.

### 6. Memory system

Session memory lives in `~/.claude/projects/<project>/memory/` and is loaded
automatically in future conversations. It stores:
- User preferences and feedback (not repeated in CLAUDE.md)
- Project decisions that change frequently
- Things learned during a session that should persist

Memory is the right place for volatile project state; CLAUDE.md is for stable conventions.
The two should not duplicate each other.

### 7. Hooks

`settings.json` registers shell hooks that Claude Code executes automatically.
Further hooks added as workflows stabilise (see ADR 010 for the code-review hook design).

### 8. What is NOT adopted

- **`src/features/`** — does not map cleanly to App Router. Domain logic lives in
  `src/lib/` (server-side) and co-located route files.
- **"Named exports only"** — conflicts with Next.js page file requirements. See ADR 004.

### 9. Relationship to `.docs/`

`.docs/` is a first-class engineering artefact that also renders on the site (ADRs section).
It is not a Claude-specific config — it belongs to the project. CLAUDE.md may `@`-include
docs files for standing instructions but should not duplicate their content.

## Consequences

**Positive:**
- CLAUDE.md stays concise and signal-rich
- `settings.json` / `settings.local.json` split makes plugin requirements explicit and
  version-controlled without exposing machine-specific permissions
- Custom skills are co-located with their validation scripts — the mermaid skill owns its
  own validator, decoupled from `package.json` scripts
- Agent skill config in `.docs/agents/` is consistent with project conventions and
  discoverable by any agent tool

**Negative / Trade-offs:**
- `.claude/commands/` and `.claude/rules/` referenced in CLAUDE.md but not yet created —
  stub to be filled as workflows are codified
- gitignore negation pattern for custom skills requires a manual exception line per skill
- Memory is local and not version-controlled — onboarding a second collaborator requires
  manual context transfer

## Related

- ADR 004 — Component Structure and File Naming Conventions
- ADR 010 — Agentic Code Review Workflow
- ADR 014 — Content Model
- `CONTEXT.md`, `PRODUCT.md`, `DESIGN.md` — domain context documents
- `.docs/agents/` — agent skill configuration
