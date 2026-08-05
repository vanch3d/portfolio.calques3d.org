---
number: 11
title: "/lab — Portfolio Meta-Layer Route"
status: proposed
date: 2026-08-05
tags: [architecture, design-system, adr, lab, routing]
---

## Context

The portfolio needs a place to expose its own engineering and design artefacts — the design system, its decision history, and its architecture decisions. This serves two purposes:

1. **During development:** A live workspace for iterating on design decisions, comparing A/B variants, and verifying token correctness — without needing Figma or Storybook.
2. **As a portfolio artefact:** A public transparency layer showing how the portfolio itself was built. Demonstrates design system thinking, accessibility-first component development, and structured architectural decision-making.

Stage 11 previously planned a `/docs/adr` route for rendering Architecture Decision Records. This ADR supersedes that plan.

## Decision

**Add `/lab` as a top-level route and primary nav item.** It absorbs the previously planned `/docs/adr` route and expands it into a four-section meta-layer.

### Information Architecture

```
/lab                ← Overview: purpose, links to all sections
  /lab/adr          ← Architecture Decision Records (SSG from .docs/adr/)
  /lab/tokens       ← Live design token explorer (CSR)
  /lab/components   ← Component gallery with a11y notes (SSG from MDX)
  /lab/decisions    ← Design decision log with A/B artefacts (SSG from MDX)
```

### `/lab/adr`

- Reads `.docs/adr/*.md` at build time via `fs`
- Lists all ADRs with status (proposed / accepted / superseded)
- Individual pages render the markdown body with frontmatter metadata
- SSG — no revalidation needed (ADRs change only on commit)

### `/lab/tokens`

- CSR page that reads all active CSS custom properties via `getComputedStyle(document.documentElement)`
- Groups tokens by layer (primitive / semantic / component) based on naming convention
- Shows color swatches with WCAG contrast ratios against configured backgrounds
- Always reflects the live `@theme` — cannot be stale

### `/lab/components`

- MDX files in `src/content/lab/components/` — one per component
- Each page: live rendered component examples, keyboard/ARIA documentation, token usage, design rationale
- SSG — rebuilds when MDX content changes

### `/lab/decisions`

- MDX files in `src/content/lab/decisions/` — one per design decision
- Documents the question, options considered, decision made, A/B experiment results if any
- Status metadata: `active | superseded | experimental`
- Historical artefacts kept when superseded (linked to replacement decision)
- SSG — rebuilds when MDX content changes

### Token Validation in CI

`scripts/validate-tokens.mjs` added to `npm run validate`:
- Parses `src/design-system/tokens.css` for all declared `--*` tokens
- Verifies each semantic token references an existing primitive token
- Verifies each color token intended for text meets 4.5:1 contrast ratio against its paired background
- Reports declared-but-unreferenced tokens (dead code)
- Fails CI on any violation

### A/B Variant System

Design variants (accent color, dark mode default) controlled by `data-*` attributes on `<html>`:

```html
<html data-accent="teal" data-color-scheme="system">
```

CSS:
```css
:root { --color-accent: #0d9488; }
[data-accent="amber"] { --color-accent: #b45309; }
```

Variant state stored in `localStorage`, applied before first paint via inline script in `<head>`. Controls are surfaced in `/lab/decisions` and `/lab/tokens`, not on the main portfolio nav.

## Rationale

- **No Storybook:** Storybook requires a separate build, separate deployment, and is designed for team collaboration. For a solo portfolio, the overhead is unjustified. The `/lab` MDX approach achieves the same goals (component showcase + design documentation) as part of the portfolio site itself.
- **No Figma (during iteration):** Figma is excellent for handoff but poor for evolutionary design documentation. The `/lab/decisions` MDX pages serve as the living design journal during development. Figma will be used at end of Phase C to export a finalised token set for validation.
- **Lab as portfolio value:** Exposing the design process publicly demonstrates product engineering thinking — not just that decisions were made, but *why* they were made, what was rejected, and how the system evolved. This differentiates the portfolio from a typical developer portfolio.

## Consequences

- The primary nav grows to: **Research · Engineering · Publications · CV · Lab**
- `/lab` has its own layout with a sidebar listing the four sections (not the main site nav)
- `src/content/lab/` is a new content directory alongside `src/content/research/` and `src/content/engineering/`
- `npm run validate` gains a token validation step
- The ADR content reader (`getAllADRs`, `getADRBySlug`) joins `src/lib/content/` alongside `positions.ts` and `research.ts`
- Stage 11 `/docs/adr` is removed from the route plan, replaced by `/lab/adr`

## Alternatives Rejected

- **`/docs/adr` only (Stage 11 original plan):** Too narrow — only ADRs, no design system, no decisions log.
- **`/design-system` top-level:** Less evocative, implies a completed artifact rather than an ongoing process.
- **Storybook:** Separate build, not part of the portfolio, designed for team workflows.
- **Figma for iteration:** Poor for evolutionary documentation; good for final handoff.
