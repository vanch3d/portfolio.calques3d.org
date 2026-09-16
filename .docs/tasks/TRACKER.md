---
plans:
  - .docs/tasks/2026-09-03-homepage-surface-plan.md
  - .docs/tasks/2026-09-03-lab-design-system.md
  - .docs/tasks/2026-09-04-lab-adr-surface.md
  - .docs/tasks/2026-09-08-project-surface.md
epic: epic/design-compass-app
status: in-progress
---

# Homepage Surface + Lab Design System — Progress Tracker

> Plan: `.docs/tasks/2026-09-03-homepage-surface-plan.md`
> Epic branch: `epic/design-compass-app` → merges into `main` when user satisfied
> Started: 2026-09-03
> Status: In progress
> Last updated:

---

## Track B — Homepage comp

Agent: `design-director`

- [x] `/comp-server start` (running at http://localhost:5001, serving `.impeccable/mocks/`)
- [x] Generate 3 compositional comps → `.impeccable/mocks/` (v1 Arc Dominates, v2 Arc as Background, v3 Arc as Baseline)
- [ ] User confirms which comp was approved (v1 / v2 / v3) — verbal approval in prior session not recorded
- [ ] `/comp-approve <filename>` — update surface brief + sidecar `approved: true`

**This gate must close before Track C begins.**

---

## Track E — Live mode iteration

Prerequisite: Track L in epic

- [ ] `/impeccable live` — arc, identity block, era timeline
- [ ] Variants reviewed and selected
- [ ] Findings folded into deferred issues (D-01 arc fine-tuning, D-08 mobile hero)

---

## Track H — Design System Atomic Refactor

> Methodology: every styled primitive is defined once — in `globals.css` or as a shared component — before a second usage. Pages consume primitives; they don't define them. Deferred issues below require design + implementation + test loops before they're actionable.

### H0 — Immediate refactor ✓ COMPLETE

- [x] `NavLink` atom — `../../src/components/ui/NavLink.tsx` — canonical link primitive (`href: string`, casts to `Route` internally); replaces `LabLink`
- [x] `LabLink` shims — `lab/_components/LabLink.tsx` + `lab/design-system/_components/LabLink.tsx` both re-export `AppLink as LabLink` for backward compat
- [x] `LabTag` atom — `src/components/ui/LabTag.tsx` (read-only metadata chip)
- [x] `LabButton` atom — `src/components/ui/LabButton.tsx` (interactive, Base UI `Button`, `pressed` for toggle semantics)
- [x] `LabLink` visual update — underline always present, `text-decoration-color` trick for hover state
- [x] `RegisterTable` decomposition — `RegisterTable`, `RegisterTableHead`, `RegisterTableBody`, `RegisterTableRow` in `src/app/lab/_components/RegisterTable/`
- [x] `AdrRegisterTable` refactored — uses `RegisterTable/*` + `LabTag`
- [x] `InsightsRegisterTable` refactored — uses `RegisterTable/*`
- [x] `AdrFilterBar` refactored — uses `LabButton` for tag toggle chips
- [x] `LabRegisterHeader` — consistent bottom margin `var(--space-xl)`
- [x] `@base-ui/react` 1.8.0 installed
- [x] CSS utilities added to `globals.css`: `.rule-heavy-x`, `.register-row`, `.register-row-active`, `.title-italic`, `.register-body`

### H1 — Tag filter UX (design + implementation loop)

- [ ] Too many tag chips; no progressive disclosure, duplicates and synonyms in the data
- [ ] Proposed direction: multi-select autocomplete (combobox pattern) — Base UI has `./combobox`
- [ ] Requires: tag normalisation/curation pass on ADR frontmatter first

### H2 — Table filter paradigm (design decision required)

- [ ] Current: ghost opacity on non-matching rows — action result can be outside viewport
- [ ] Proposed alternative: active removal (hide non-matching rows entirely) + row count indicator
- [ ] Decision: which paradigm; transition animation; empty-state design

### H3 — Active row indicator (design + a11y loop)

- [ ] Thin red left border is not self-explanatory — meaning unclear without reading code
- [ ] Proposed: explicit text label or icon within the row itself (e.g. "CURRENT" chip in `LabTag` style using `--color-active`)
- [ ] Must not break the one-red-mark rule — needs `/impeccable` review

### H4 — Lab navigation and cross-linking (IA decision)

- [ ] /lab/adr ↔ /lab/insights navigation: browsing loses context quickly
- [ ] Breadcrumb doesn't support back-to-ADR from an insight that was reached via ADR detail
- [ ] Proposed: contextual back-link ("← Back to ADR 016") supplementing breadcrumb — already partially implemented in `InsightDocument`; needs generalisation

### H5 — Callout normalisation (component design)

- [ ] `InsightCalloutStrip` (index page) and `InsightCalloutBlock` (detail page) are visually similar but different components with inconsistent link placement
- [ ] Proposed: single `InsightCallout` with `variant="strip" | "block"`, shared header/body/CTA structure
- [ ] Links must follow `LabLink` hover+underline contract

### H6 — Design system catalogue page (gradual)

- [ ] `/lab/design-system` page should grow to show `LabTag`, `LabButton`, `RegisterTable`, `InsightCallout` with visual specs and usage guidance
- [ ] Each atom promoted to the system gets a section on the page
- [ ] Process: atom is created → design system page updated in same PR

### H7 — ADR: atomic design process convention

- [ ] Write ADR documenting the rule: "check design system before creating a styled element; promote to component before second use"
- [ ] Reference this TRACKER entry and the `src/components/ui/` + `src/app/lab/_components/` directory conventions

---

## Track P — Project surface `/projects/[slug]`

Plan: `.docs/tasks/2026-09-08-project-surface.md`
Architecture plan (Pass 1 pre-implementation): `starry-marinating-locket.md`
Decisions record: ADR 020 (page-level rendering) · ADR 021 (component rendering
classification + unified timeline molecule)
Last updated: 2026-09-12

### Design phase — COMPLETE

- [x] Design brief written, Q&A with user
- [x] Concept seed run (key: `f36157c0`, mode: experience, dealt 5-2-4)
- [x] Four high-fi HTML comps built (specimen · elevation · dossier · datasheet)
- [x] Comp A (Natural history specimen record) selected by user
- [x] Direction contract written — `.impeccable/surfaces/src-app-projects-slug-page-tsx.md`
- [x] Responsive layout decisions locked in direction contract (3 breakpoints, all zones)
- [x] Specimen illustration amendment: `media.cover` placeholder in ProjectTitle zone
- [x] Rejected comps removed from `.docs/design/comps/` (approved only: specimen)
- [x] Implementation plan written in task doc (7 steps with context for new sessions)
- [x] Pre-implementation architecture plan: rendering-strategy rule (Decision 1) +
      unified timeline molecule (Decision 2) — recorded in ADR 021

### Implementation phase — Pass 1 (foundations) COMPLETE

- [x] `primary: boolean` added to project schema (`src/schemas/project.schema.json`,
      `src/types/content.ts` — hand-maintained until `generate:types` pipeline exists)
- [x] `src/lib/content/projects.ts` — unified `getProjectBySlug` + `getAllProjectSlugs`
      (+ `projects.test.ts`, 10 Vitest cases against real `calques3d`/`hivemq-edge` content)
- [x] `src/app/projects/[slug]/page.tsx` — route skeleton: `generateStaticParams`,
      `generateMetadata`, SSG + `unstable_cache` for Zotero publications per ADR 020.
      Now renders the full Pass 2 component tree (see below) — no longer a placeholder
      body. Confirmed via `pnpm build`: prerenders statically for every slug returned by
      `getAllProjectSlugs()`, including
      the two reference projects `calques3d` and `hivemq-edge`.
- [x] ADR 020 — rendering strategy for `/projects/[slug]` (page-level); addendum points
      to ADR 021 for the component-level classification rule
- [x] ADR 021 — component rendering classification rule + unified timeline molecule
      decision record
- [x] `src/lib/period.ts` extended — `CAREER_START`, `ERA_TRANSITION`,
      `MIN_RULER_GAP_PCT`, `PeriodDatum`, `isActiveDatum`, `deduplicateDatums`,
      `assignLabelPositions` (+ 19 ported Vitest cases in `period.test.ts`)
- [x] `src/components/ui/PeriodRuler.tsx` + `PeriodStrip.tsx` — Client Components, own
      i18n (`PeriodRuler`/`PeriodStrip` namespaces), `contextLabel` data prop (no
      `rulerAriaLabel`-style string prop) + CT specs, axe-clean on every state
- [x] `--line-tick-short/tall/project`, `--space-tick-label` tokens; `ruler-label-above/
below`, `ruler-span-bar`, `period-tick`, `period-span` utilities added
      (`--tracking-stamp` and the `--text-micro` value bump from the scrapped branch are
      deferred to Pass 2 — `ClassificationHeader` status-stamp concern, not needed yet)
- [x] `src/app/_components/EraColumn.tsx` migrated to `PeriodRuler` — removed
      `RulerTick`/`RulerYear` helpers and hardcoded `1995`/`2018`/`2026` literals; stale
      engineering end-year now `new Date().getFullYear()`
- [x] `/lab/design-system/molecules` — new `PeriodRuler`/`PeriodStrip` sections
      (archived/ongoing+span/stagger states, `PropsTable` per component)

#### Verification — unified timeline molecule

- [x] `period.test.ts` — 19 ported cases + existing suite green
- [x] `PeriodRuler.spec.cy.tsx` (13 cases) / `PeriodStrip.spec.cy.tsx` (10 cases) — green,
      axe-clean on every state (tester sub-agent: green on first pass, no fixes needed)
- [x] `EraColumn.spec.cy.tsx` (17 cases) / `EraTimeline.spec.cy.tsx` (6 cases) — green
      after migration
- [x] `pnpm test` (Vitest, full suite) — 173/173 passing
- [x] `npx cypress run --component` (full suite) — 278/278 passing

### Implementation phase — Pass 2 (surface components) IN PROGRESS

- [x] All 15 components built in `_components/` (Client-with-own-i18n or plain sync
      Server per ADR 021 — Decision 1)
- [x] `src/lib/routes.ts` — typed route builders (`caseStudyHref`, `projectHref`, `eraHref`)
- [x] `src/lib/content/project-resources.ts` — `ResourceCounts` type + `buildResourceCounts`
- [x] `src/app/projects/[slug]/_utils/project-utils.ts` — co-located pure helpers
      (`sliceTags`, `pickChronologicalNeighbours`) + Vitest tests
- [x] `src/lib/content/projects.ts` — `getProjectsByPosition` + `getAllProjectsChronological`
      (career-wide ordering, `primary`-flag tie-break) added
- [x] `src/components/ui/Breadcrumb.tsx` — shared generic breadcrumb
- [ ] `--tracking-stamp` token added for `ClassificationHeader` status stamps
- [ ] `style={}` violations removed (only legitimate exceptions remain)
- [x] Cypress CT specs for all Pass 2 components, axe on every variant
- [x] i18n: `ProjectDetail` namespace in `messages/en.json`
- [x] `SiblingNav` replaced by `ProjectNav` — career-wide chronological prev/next
      (not position-scoped — design correction, see ADR/surface-brief amendment),
      3-col grid, short arrow-link + separate title text
- [x] `TaxonomyPanel` simplified — single aside, internal tag slicing, no
      column/band duplication, no `moreLabel` callback prop (7 CT cases, axe-clean
      on research/engineering variants)
- [x] Homepage era columns now list projects (not positions), each row linking to
      `/projects/[slug]` — interim IA fix, see P-FIX-5/6 below. Verified via
      `pnpm build`: every project (including redacted-visibility `intrica`) appears;
      `EraColumn`/`EraTimeline` CT specs (23 cases) green
- [ ] `pb-2xl` bottom margin added to `<main>`
- [ ] `page.tsx` E2E (Cypress) + Playwright a11y coverage for both reference slugs
      (`calques3d`, `hivemq-edge`)

### Known defects — needs a fresh session

- [ ] **P-FIX-1: ProjectFooter timeline broken** — tick positioning uses `right: undefined` / `left: undefined` React pattern that fails silently; `1995` label overlaps with project-start tick when project began in 1995; "Present" tick not rendering correctly. Must be rewritten with explicit conditional classNames, not conditional `style` object keys. Reference the comp CSS (`.period-footer__tick`, absolute positioning with `%` left values). **Pass 1 note:** the underlying fix now exists as tested pure functions (`deduplicateDatums`/`assignLabelPositions` in `src/lib/period.ts`) consumed by `PeriodRuler` — `ProjectFooter` (Pass 2) should render `<PeriodRuler span={{ from: projectStart, to: projectEnd }} ... />` directly rather than hand-rolling tick math again.
- [x] **P-FIX-2: SiblingNav hides when only one project in position** — SUPERSEDED: `SiblingNav` was replaced entirely by `ProjectNav` (career-wide chronological prev/next, not position-scoped), which structurally can't hit this bug — the middle "{position} · N projects" zone always renders regardless of prev/next presence.
- [ ] **P-FIX-3: --color-ink-secondary (#c8c4bc) at small sizes yields ~1.58:1 against --color-ground (#f8f4ed), below the 4.5:1 AA threshold. Known design-system token issue. See below
- [ ] **P-FIX-4: month-precision project periods render as a single tick, not a tracked range** — `extractYear()` truncates `period.start`/`period.end` to year-only before it reaches `PeriodRuler`/`PeriodStrip`. A project whose start and end fall in the same year (e.g. Intrica: `2018-10` → `2018-12`) ends up with `span.from === span.to`, so the span bar has zero width — it reads as a single bar/point, not a tracked range. Needs either month-precision positioning in `PeriodRuler`'s `toPercent()` (fractional-year domain support) or a minimum-width guarantee on the span bar when start and end round to the same year.
- [ ] **P-FIX-5: top navbar is not unified across the app** (cross-cutting, not Track-P-scoped) — the homepage has its own fixed nav (`SiteNav` + `HomepageScrollHandler`, scroll-driven show/hide) that isn't reused by `/projects/[slug]`, `/lab/*`, or any other route. Needs a single shared nav component applied app-wide (likely in the root layout), reconciling the homepage's scroll behaviour with a simpler static treatment for inner pages.
- [ ] **P-FIX-6: growing page/component structure divergence across routes** (cross-cutting, not Track-P-scoped) — as `/projects/[slug]`, `/lab/*`, the homepage, etc. accumulate independently-built page shells and components, repeated patterns (breadcrumbs, section headers, resource lists) are being reimplemented per-route instead of shared. Needs an audit pass to identify and extract common primitives before divergence compounds further — likely an extension of the Track H atomic-refactor methodology (currently `/lab`-scoped) applied app-wide.
- [ ] **P-FIX-7: Playwright E2E doesn't cover real end-user scenarios against live data** (cross-cutting, not Track-P-scoped; surfaced auditing `/publications` on `feat/publications-audit`) — per ADR 002, Cypress E2E (`cypress/e2e/*.cy.ts`) is correctly scoped: short, focused specs covering server pages CT can't reach, complementing the CT suite. Playwright (`tests/e2e/*.spec.ts`) is supposed to be the "Full E2E" layer exercising real end-user scenarios against live data, but currently it only checks route availability, a visible `h1`, and axe violations per page — duplicating page-level smoke coverage rather than testing real flows (e.g. browsing to a project, viewing real publications, following a real citation/PDF link). Needs a design pass on what real scenarios this layer should cover. Separately, `tests/e2e/smoke.spec.ts`'s name/self-description ("Smoke tests") collides with ADR 002's terminology, which reserves "Smoke E2E" for the Cypress/MSW layer and calls this one "Full E2E" — rename once scope is settled.

### Deferred surfaces (separate tracks)

- Track P2 — `/case-studies/[slug]` (scrolling + chapter navigation; design investigation needed)
  - [x] Housekeeping: `Aside`/`ChapterList` relocated from `src/components/ui/` to
        `src/components/case-studies/` (domain-folder convention); the two case-study
        MDX files updated to import from the new path
- Track P3 — `/research` and `/engineering` era landing pages (after project surface stable)
- Track P4 — Image generation: per-project `media.cover` illustrations using `imagegen-frontend-web` or `brandkit`; two generic fallbacks (`cover-research-generic.png`, `cover-engineering-generic.png`); generation brief: flat geometric, cream/graphite/red palette only

---

## Track PUB — Publications surface (`/publications`)

Zotero-backed publications index, audited and hardened on branch `feat/publications-audit` (not originally tracked here — added retroactively).

- [x] `feat(publications)`: SSG index page, client-side tag filtering, PDF proxy route
- [x] `docs(adr)`: ADR 023 — rendering strategy for `/publications`
- [x] `test(publications)`: unit (Vitest) + component (Cypress CT) coverage
- [x] `test(e2e)`: MSW wired into the dev server, `publications.cy.ts` added, `pdf-route.spec.ts` un-suspended, `smoke.spec.ts` updated
- [x] `docs(tracker)`: P-FIX-7 — Playwright E2E scope gap logged (see Known defects, Track P, above)

---

## P-FIX-3. TypeSpecimen — spec annotation text fails WCAG AA contrast

**File:** `src/app/lab/design-system/_components/TypeSpecimen.tsx` line 51

```tsx
className =
  'font-label text-[0.625rem] leading-label tracking-label uppercase text-ink-ghost tabular'
```

`text-ink-ghost` (#c8c4bc) on `bg-ground` (#f8f4ed) = ~1.6:1. Fails WCAG AA at any size.
The `color-contrast` axe rule is currently disabled in the 3 axe CT tests with a documented comment.

**Recommendation:** Replace `text-ink-ghost` with `text-ink-secondary` (#6b6b6b, ~4.6:1) for spec
annotations, or increase the font size to ≥18.67px (bold) / ≥24px (normal) to qualify as large text.

---

## Epic → main merge

- [ ] All tracks complete and user satisfied
- [ ] Final `pnpm validate` + full test run on epic
- [ ] **User approval** → epic merges into `main`
