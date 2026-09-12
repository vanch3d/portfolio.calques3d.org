---
number: 21
title: 'Component Rendering Strategy and Unified Timeline Molecule for Project Surface'
status: accepted
date: '2026-09-12'
decision-makers: vanch3d
tags: ['rendering', 'testing', 'i18n', 'components', 'design-system', 'projects']
---

# ADR 021 — Component Rendering Strategy and Unified Timeline Molecule for Project Surface

**Date:** 2026-09-12
**Status:** Accepted

## Context

Track P (`/projects/[slug]`, see `.docs/tasks/2026-09-08-project-surface.md`) is the
first surface in this codebase to combine a large number of new leaf components (~15)
with a design that repeats a "period timeline" visual in three places. A first
implementation attempt on the branch `feat/project-surface-OLD` was scrapped because it
hit two structural problems, discovered only after code was written:

1. **No explicit rendering-strategy rule.** Components mixed async Server Component
   data-fetching with the assumption that they could still be mounted in Cypress
   Component Testing (CT). They cannot: `cy.mountAccessible()` mounts real React DOM in a
   browser, and React DOM (client) cannot render an async Server Component at all —
   mounting throws "Only Server Components can be async." This repo already hit this
   exact wall once, for `IdentityBlock` (`src/app/_components/IdentityBlock.tsx`), and
   worked around it with a no-op CT stub that defers to an E2E spec instead
   (`src/app/_components/IdentityBlock.spec.cy.tsx`). Nothing generalised that lesson
   into a rule, so the next surface repeated the mistake at a much larger scale — CT
   coverage broke across most of the new components, violating ADR 007's per-component
   axe-check requirement.

2. **Duplicated timeline logic.** Four separate "local timeline" UIs exist or were about
   to exist, each with its own tick/label positioning code:
   - Homepage hero legend — `src/app/_components/CareerArc.tsx` (`TimelineLegend`, raw
     SVG `<text>`/`<line>` at fixed pixel coordinates tied to the hero's Bézier arc paths)
   - Homepage era-column ruler — `src/app/_components/EraColumn.tsx` (`RulerTick`/
     `RulerYear` helpers, with the years `"1995"`, `"2018"`, `"2026"` hardcoded as JSX
     literals, including a **stale** end year that silently goes wrong every year)
   - Project header period strip (not yet built — `ClassificationHeader.tsx`)
   - Project footer period ruler (not yet built — `ProjectFooter.tsx`)

   The scrapped branch built the header/footer versions independently, with their own
   tick-collision handling. The result was **P-FIX-1**: on the footer ruler, a project's
   start year could land on the same pixel as a fixed career-boundary tick (e.g. a
   project starting in 1995, coinciding with the career-start tick), and the naive
   positioning logic silently mis-rendered both labels. This was a symptom of building
   the same kind of component four times with no shared, tested collision-handling logic
   — not a one-off bug to patch in place.

Both problems needed a decision **before** writing any of the ~15 project-detail
components, not a post-hoc fix. This ADR records that decision. Full design derivation
is in the working plan `starry-marinating-locket.md` (superseded as a durable record by
this ADR); this document is the source of truth going forward.

## Decision

### Part 1 — Rendering-strategy rule

**Only `src/app/projects/[slug]/page.tsx` is an async Server Component. Every component
under `src/app/projects/[slug]/_components/` (and any new shared UI atom it depends on,
e.g. `src/components/ui/Breadcrumb.tsx`) is either:**

- **a Client Component** (`'use client'`) calling its own `useTranslations(<Namespace>)`
  for UI copy, receiving only **data** as props (project fields, resolved arrays,
  already-rendered MDX passed as `children: ReactNode`) — the default choice for any
  component with its own UI copy; or
- **a plain synchronous Server Component** — for the rare component with no i18n strings
  of its own and no data to fetch.

`page.tsx` resolves everything upfront per ADR 020 (project record + type via
`getProjectBySlug`, position, case studies, `unstable_cache`-wrapped publications, and
the MDX narrative via `importResearchMDX`/`importEngineeringMDX`) and passes fully
resolved data down. No component below `page.tsx` fetches its own data or calls
`getTranslations()` (the async, server-only i18n API) — that would make it an async
Server Component and remove it from CT coverage.

**Consequence for testing:** every `_components/` file gets full Cypress CT coverage
(`cy.mountAccessible()` + `cy.checkA11y()` per distinct state, per ADR 007) instead of
falling back to an `IdentityBlock`-style E2E-only stub. `page.tsx` itself is covered by
Cypress E2E and Playwright a11y tests, same as any other route.

**Trade-off, accepted explicitly:** this ships more client-side hydration JS on an
otherwise fully static (SSG) page than a Server-Component-first design would. This is a
deliberate choice: this repo treats per-component CT+axe coverage as a hard requirement
(ADR 007), and the `IdentityBlock` E2E-only pattern is a documented workaround for a
single unavoidable case, not a template to reuse by default.

**Required doc comment:** every new `_components/` file states its classification in a
one-line comment (`// Client — needs ProjectDetail.<x> strings` /
`// Server, sync — no i18n, no data-fetching`), mirroring the precedent set by
`IdentityBlock.spec.cy.tsx`'s own exception comment.

### Part 2 — Unified timeline molecule

Two new Client Components in `src/components/ui/`, sharing one utilities module:

- **`PeriodRuler.tsx`** — full-width proportional ruler, N ticks over a `domain`. Used by
  the project footer and the homepage `EraColumn`.
- **`PeriodStrip.tsx`** — compact 2-tick inline strip. Used by the project header
  (`ClassificationHeader`).

These stay as **two** components, not one, because the approved comp
(`.docs/design/comps/project-detail-comp-specimen.html`) specifies genuinely different
visual grammar for each (`.period-strip__*`: label · tick · span · tick · label, inline;
`.period-footer__*`: full-width rule with multiple ticks and stacked year labels) — only
the underlying tick math is shared.

**Shared logic lives in `src/lib/period.ts`** (the existing period-utilities module —
extended, not forked into a new file/directory): `CAREER_START = 1995`,
`ERA_TRANSITION = 2018`, `MIN_RULER_GAP_PCT = 4`, the `PeriodDatum` type, and the pure
functions `isActiveDatum`, `deduplicateDatums` (merges same-year datums by role priority
— this is the direct fix for P-FIX-1's tick-collision bug), and `assignLabelPositions`
(staggers near-colliding labels above/below the baseline). Colocated `period.test.ts`
covers these with Vitest.

**Each molecule owns its own i18n namespace** (`PeriodRuler`, `PeriodStrip` in
`messages/en.json`) per ADR 006 — it calls `useTranslations()` itself for its aria-label
template and "present" label text, taking only a `contextLabel?: string` **data** prop
for interpolation (e.g. `t('aria_label', { context: contextLabel, start, end })` — the
same pattern ADR 006 already documents for `ColorSwatch`'s `t('swatch_label', { token })`).
Consumers pass `domain`, `datums`, `span?`, `ongoing?`, and `contextLabel?` — never a
pre-rendered string. (The scrapped branch's version violated this — see Alternatives.)

**`CareerArc`'s homepage hero SVG legend is explicitly exempted from this unification.**
It is an illustrative element embedded in one bespoke SVG canvas with hand-placed pixel
coordinates matched to specific Bézier arc paths (`viewBox 0 0 1440 900`). An HTML/CSS
ruler component cannot render inside it, and forking the molecule into SVG and HTML
variants for one caller is worse than the current single bespoke instance. This is a
permanent, documented exception (one code comment in `CareerArc.tsx` cross-referencing
this ADR), not a gap to close later.

## Consequences

- Good, because every new project-detail component gets full CT + axe coverage — no
  growth in the `IdentityBlock`-style untested-in-CT component count.
- Good, because P-FIX-1-class bugs (tick/label collisions) are fixed once, in tested pure
  functions, instead of being re-solved ad hoc per timeline instance.
- Good, because `EraColumn`'s stale hardcoded end-year (`"2026"`) is fixed as a side
  effect of migrating it onto `PeriodRuler`, which computes `new Date().getFullYear()`.
- Good, because the molecule's aria-label ownership follows ADR 006 correctly, removing
  the need for a bespoke `rulerAriaLabel` prop threaded through every consumer.
- Bad, because the project-detail page ships more hydration JS than a pure-Server design
  would — accepted as a deliberate trade-off for CT/axe coverage (see Part 1).
- Bad, because `src/lib/period.ts` grows beyond pure date-string parsing into ruler
  layout math — acceptable since it stays the single source of truth rather than forking
  a second module (which is exactly what the scrapped branch did wrong).
- Watch: if a future surface needs a _third_ timeline visual grammar (not strip, not
  full ruler), extend `period.ts`'s shared functions rather than hand-rolling a fifth
  implementation.

## Implementation Plan

- **Affected paths:** `src/app/projects/[slug]/page.tsx` and `_components/` (new),
  `src/components/ui/PeriodRuler.tsx` + `PeriodStrip.tsx` (new), `src/lib/period.ts` +
  `period.test.ts` (extended), `src/app/_components/EraColumn.tsx` +
  `EraColumn.spec.cy.tsx` (migrated), `src/styles/tokens/spacing.css` +
  `src/styles/utilities/index.css` (tick-height tokens, `ruler-label-*`/`ruler-span-bar`
  utilities), `src/app/lab/design-system/molecules/page.tsx` (new documentation entries),
  `messages/en.json` (`PeriodRuler`, `PeriodStrip`, `ProjectDetail` namespaces).
- **Patterns to follow:** `IdentityBlock.spec.cy.tsx`'s async-component doc-comment
  convention; `ColorSwatch`'s `t(key, { dataValue })` interpolation pattern (ADR 006);
  `MoleculeFrame` + `PropsTable` composition for Lab design-system documentation
  (`TagFilterDrawerDemo` is the current reference example).
- **Patterns to avoid:** creating a new `src/lib/constants/` (or similar) module for
  timeline constants instead of extending `period.ts`; passing pre-rendered strings or a
  component-specific `aria-label` string as a prop instead of letting the molecule own
  its translation call; adding any `getTranslations()` call inside a `_components/` file.

### Verification

- [ ] No file under `src/app/projects/[slug]/_components/` is an async function
      component (grep for `export async function` in that directory should return
      nothing)
- [ ] `PeriodRuler.spec.cy.tsx` / `PeriodStrip.spec.cy.tsx` / `EraColumn.spec.cy.tsx` pass
      with `cy.checkA11y()` asserted per distinct state
- [ ] `period.test.ts` Vitest suite passes, covering dedup, stagger, and active-role logic
- [ ] `EraColumn.tsx` contains no hardcoded year literals
- [ ] `/lab/design-system/molecules` renders `PeriodRuler`/`PeriodStrip` entries with
      zero axe violations
- [ ] `pnpm validate` passes

## Alternatives Considered

- **Classify each component's rendering mode ad hoc, case by case:** rejected — this is
  exactly what the scrapped branch did, and it produced an inconsistent mix that broke CT
  wholesale. A single blanket rule with one named exception (`page.tsx`) is easier to
  apply correctly than a per-component judgment call.
- **Keep components as async Server Components and accept E2E-only testing
  (`IdentityBlock` pattern) as the default for i18n-bearing leaf components:** rejected —
  this would mean ~15 new components with no CT/axe coverage, in direct tension with
  ADR 007's hard rule. `IdentityBlock` is a documented one-off exception, not a template.
- **One single `Timeline` component covering both the strip and full-ruler grammars:**
  rejected — the approved comp specifies genuinely different markup/CSS for the header
  strip vs. the footer ruler; forcing one component to branch internally on a `variant`
  prop would recreate the multi-purpose-god-component problem this ADR is trying to
  avoid. Sharing logic (not markup) via `period.ts` gets the DRY benefit without it.
- **Unify `CareerArc`'s SVG legend into the same molecule:** rejected for this pass — see
  Part 2. Would require rebuilding the homepage hero illustration, out of scope for
  Track P.
- **Port the scrapped branch's `PeriodRuler`/`PeriodStrip` verbatim (including their
  `startYear`/`endYear`/`aria-label`-as-string-prop API):** rejected — that API is exactly
  what violates ADR 006's namespace-ownership rule and is what forced the scrapped
  branch's `EraColumn` migration to grow an ad hoc `rulerAriaLabel` prop. The dedup/stagger
  _logic_ and CSS tokens are reused; the component prop API is corrected.

## Related

- ADR 006 — i18n (namespace ownership, `t(key, { dataValue })` interpolation pattern)
- ADR 007 — Accessibility Testing (per-component axe requirement this decision protects)
- ADR 004 — Component Conventions (Props suffix, `_components/` prefix, file layout)
- ADR 020 — Rendering Strategy for `/projects/[slug]` (page-level SSG/`unstable_cache`;
  this ADR governs the component layer beneath it)
- `.docs/tasks/2026-09-08-project-surface.md` — Track P task doc and component table
- `.docs/tasks/TRACKER.md` — Track P checklist
- `src/app/_components/IdentityBlock.spec.cy.tsx` — precedent for the async/CT conflict
  and its documented workaround
