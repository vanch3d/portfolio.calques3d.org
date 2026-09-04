---
date: 2026-09-03
tracker: .docs/tasks/TRACKER.md
epic: epic/design-compass-app
---

# Implementation Plan — Homepage Surface

## Context

The visual world ("The Construction on Tracing Paper") has been established: DESIGN.md seed is complete, the surface brief is locked, and the direction contract df127769 is in place. Draft code for the design system infrastructure (globals.css, layout.tsx, messages/en.json) exists uncommitted on `main`. The homepage comp gate is still open (no comp approved yet).

This plan organises the remaining work into two parallel tracks that converge at PR 2.

---

## Branch strategy

All feature work branches off `epic/design-compass-app` and merges back into it. **The epic does not merge into `main` until the user is satisfied with the full feature set.**

```
main
  └── epic/design-compass-app
        ├── feat/design-system-foundation  →  epic
        ├── feat/homepage-first-viewport   →  epic
        └── feat/homepage-era-navigation   →  epic
```

---

## Commit / PR process

No code is committed, pushed, or PR'd without explicit user review and approval.

For every track, the agent stops after implementation and validation:

1. Implement and run validation (`pnpm validate`, `pnpm test`)
2. Stage the changes and present the diff
3. **Wait for user review and approval**
4. On approval: commit, push, open PR into `epic/design-compass-app`

---

## Current state

| Artifact | Status |
|---|---|
| Hooks (branch-guard, pre-commit-validate, ts-guard, test-file-check, eslint-guard) | ✅ Written and registered in `.claude/settings.json` |
| `src/app/globals.css` | ✅ Token layer drafted (uncommitted, modified on `main`) |
| `src/app/layout.tsx` | ✅ Fonts drafted (uncommitted, modified on `main`) |
| `messages/en.json` | ✅ Homepage namespace populated (uncommitted) |
| `src/app/page.tsx` | ✅ Scaffold in place (to be replaced in Track C) |
| Build-phase comps | ❌ Open — no comp generated or approved |
| Epic branch | ❌ Not created yet |

---

## Track A — Design system foundation

Does not require an approved comp — infrastructure only, no page composition.

**Branch:** `feat/design-system-foundation` (off `epic/design-compass-app`)

### Files to commit (already drafted)
- `src/app/globals.css` — full token layer: primitive → semantic → Tailwind `@theme`; Departure Mono `@font-face`
- `src/app/layout.tsx` — STIX Two + Spectral via `next/font/google`; `NextIntlClientProvider` wired

### Files to verify
- `messages/en.json` — already drafted; confirm all `HomePage.*` keys are present and correct

### File to create
- `src/lib/design-tokens.test.ts` — Vitest smoke test: reads `src/app/globals.css` and asserts the expected CSS custom properties exist (`--primitive-paper`, `--color-ground`, `--font-display`, `--text-display`, `--line-heavy`, `--page-margin`)

### Ready-for-review criteria
- `pnpm validate` green (schema, Mermaid, tsc)
- `pnpm test` — design-tokens.test.ts passes
- Dev server renders with correct fonts (STIX Two visible on `<h1>`, Spectral on `<body>`)
- Diff staged and presented to user

---

## Track B — Homepage comp (runs in parallel with Track A, GATES Track C)

Invoke the `design-director` agent.

1. Run `/comp-server start`
2. Agent generates three compositional comps at `.impeccable/mocks/` per `reference/visualize.md`:
   - Each comp: first viewport + era section, real fonts, real tokens, real i18n content from `messages/en.json`
   - Required elements per surface brief: SVG compass arc 1995→2026, era inflection markers, identity block ("Dr Nicolas Van Labeke" in STIX Two italic at display scale), positioning sentence, dimension lines
3. User reviews and approves one comp
4. Run `/comp-approve <filename>` — commits to `.docs/design/comps/`, updates surface brief `approved: true`, advances build-phase

**No page code in `src/app/page.tsx` before this gate closes.**

---

## Track C — Homepage first viewport (requires: Track A approved + Track B approved)

**Branch:** `feat/homepage-first-viewport` (off `epic/design-compass-app`)
**Spec:** the approved comp from Track B

### Component breakdown
Extract from `page.tsx` into co-located files (CLAUDE.md convention):

| Component | File | Description |
|---|---|---|
| `CareerArc` | `src/app/CareerArc.tsx` | Full-width SVG — compass arc 1995→2026, dimension line baseline, era inflection markers at 2018, endpoint annotations |
| `IdentityBlock` | `src/app/IdentityBlock.tsx` | "Dr Nicolas Van Labeke" in STIX Two italic at display scale, positioning sentence in Spectral |
| `SiteNav` | `src/app/SiteNav.tsx` | Hidden on load, scroll-reveals; links to Research / Engineering / Publications / Lab |
| `page.tsx` | `src/app/page.tsx` | Thin shell — fetches translations, assembles components |

### Labels interface pattern (i18n, per `.claude/rules/i18n.md`)
Page resolves `getTranslations("HomePage")` and passes typed `labels` prop to each sub-component. Components are synchronous for Cypress CT compatibility.

### Tests
- `src/app/CareerArc.cy.tsx` — renders SVG; axe clean; arc path present; both era markers visible
- `src/app/IdentityBlock.cy.tsx` — renders name at display scale; positioning sentence; axe clean
- `src/app/SiteNav.cy.tsx` — nav hidden by default; visible on scroll trigger; axe clean; all four nav links keyboard-reachable

### Ready-for-review criteria
- Renders at `localhost:3000` — recruiter reads timeline + name + positioning in 30 s
- WCAG 2.1 AA zero violations (axe-core via Cypress CT)
- `pnpm validate` green
- `tester` sub-agent confirms all CT specs pass
- Diff staged and presented to user

---

## Track D — Era navigation (requires: Track C approved and merged into epic)

**Branch:** `feat/homepage-era-navigation` (off `epic/design-compass-app`)

Below-the-fold era section — Research / Engineering cards with dimension-line styling and navigation. Mobile-responsive (stack vertically, construction metaphor holds, axis rotates).

Scope confirmed after Track C review and live mode iteration.

---

## Track E — Live mode iteration (requires: Track C rendering at localhost)

Run `/impeccable live` to click specific elements (arc, identity block, era cards) and generate variants. This is iterate-only — no new surface. Findings feed into Track D scope.

---

## Execution order

```
now ──► Track A (design-system-foundation)
        Track B (comp: design-director)
             │
             └──► both user-approved
                      │
                      ▼
                  Track C (homepage-first-viewport)
                      │
                      ├──► Track E (live mode → informs Track D scope)
                      │
                      ▼
                  Track D (era-navigation)
                      │
                      ▼
              epic merges into main (when user satisfied)
```

## Key files

| Purpose | Path |
|---|---|
| Token layer | `src/app/globals.css` |
| Font loading + layout | `src/app/layout.tsx` |
| i18n homepage strings | `messages/en.json` |
| Surface brief | `.impeccable/surfaces/src-app-page-tsx.md` |
| Design system seed | `DESIGN.md` |
| Existing Vitest pattern | `src/lib/content/positions.test.ts` (reference) |
