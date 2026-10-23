---
plans:
  - .docs/tasks/2026-09-03-homepage-surface-plan.md
  - .docs/tasks/2026-09-03-lab-design-system.md
  - .docs/tasks/2026-09-04-lab-adr-surface.md
  - .docs/tasks/2026-09-08-project-surface.md
  - .docs/tasks/2026-09-27-project-image-generation.md
  - .docs/tasks/2026-10-23-career-arc-fixes.md
epic: epic/design-compass-app
status: in-progress
---

# Homepage Surface + Lab Design System — Progress Tracker

> Plan: `.docs/tasks/2026-09-03-homepage-surface-plan.md`
> Epic branch: `epic/design-compass-app` → merges into `main` when user satisfied
> Started: 2026-09-03
> Status: In progress
> Last updated: 2026-10-11

---

## Track B — Homepage comp

Agent: `design-director`

- [x] `/comp-server start` (running at http://localhost:5001, serving `.impeccable/mocks/`)
- [x] Generate 3 compositional comps → `.impeccable/mocks/` (v1 Arc Dominates, v2 Arc as Background, v3 Arc as Baseline)
- [ ] User confirms which comp was approved (v1 / v2 / v3) — verbal approval in prior session not recorded
- [ ] `/comp-approve <filename>` — update surface brief + sidecar `approved: true`

**This gate must close before Track C begins.**

---

## Track H — Design System Atomic Refactor

> Methodology: every styled primitive is defined once — in `globals.css` or as a shared component — before a second usage. Pages consume primitives; they don't define them. Deferred issues below require design + implementation + test loops before they're actionable.

> **⚠️ FLAGGED 2026-09-17 — H0 below does not match `src/`.** Verified via graphify + direct file lookups: `LabButton.tsx`, `LabTag.tsx`, and `RegisterTable/` do **not exist**. Only `AdrRegisterTable.tsx` (undecomposed) exists. This section describes a prior implementation that predates the "reset to clean slate" (2026-08-13) — it is stale, not current. Flagged per `.docs/tasks/2026-09-14-atom-interaction-system.md`'s explicit instruction; left here for Nicolas to correct/archive rather than silently rewritten. **Track I below is the real, current atom-system work.**

### H0 — Immediate refactor ✓ COMPLETE (STALE — see flag above)

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

## Track I — Atom / Interaction System (Engineering)

Spec: `.docs/tasks/2026-09-14-atom-interaction-system.md`
Tickets: `.docs/issues/atom-interaction-system/`
Branch: `feat/atom-interaction-system` (off `epic/design-compass-app`)
Model: ADR 025 (spec/ticket/index — this section is an index, not a store; detail lives on the ticket or in the spec doc)

- [x] `DESIGN.md`/`ADR 009` reconciliation — `c90e746`
- [x] Sitewide `ink-ghost` → `ink-secondary` contrast fix — `6e4fb2b`
- [x] `Button` atom (CVA variants) — `082d555`. Open: `.docs/issues/atom-interaction-system/01-button-pressed-state-focus-ring-conflict.md`
- [x] `Checkbox` + `Radio`/`RadioGroup` — `3563cd1`
- [x] `Field` + `Fieldset` — `cda8e26`. Open: `.docs/issues/atom-interaction-system/02-adr-024-pr3-pr4-checklist-line-ambiguous.md`
- [x] `ConstructionPanel` on `Collapsible`, `trigger`/controlled-mode API, shared box styling — `0fbde32`. Open: `.docs/issues/atom-interaction-system/03-button-constructionpanel-text-action-class-duplication.md`
- [x] `Collapsible` atom — `ebe54d4`. Open: `.docs/issues/atom-interaction-system/04-should-collapsible-be-documented-on-design-system-page.md`
- [x] `border-w-r` tailwind-merge fix — `203188d`
- [x] `TagFilterDrawer` retrofit onto `ConstructionPanel` + mobile toolbar fix — `e03d844`
- [ ] Retrofit phase — `Button` atom on `TagFilterDrawer`'s 5 ad hoc buttons; `FilterInput` `:focus-within` fix. Not started.
- [x] Graphify strict enforcement — `Skill`-tool guard reviewed + registered in `.claude/settings.json` (`.docs/tasks/2026-09-27-graphify-strict-enforcement-handoff.md`)
- [x] PR #37 review fixes — 9 of 10 findings fixed. Open: `.docs/issues/atom-interaction-system/05-pr37-review-ink-ghost-border-contrast-scope-disputed.md`

---

## Track P — Project surface `/projects/[slug]`

Plan: `.docs/tasks/2026-09-08-project-surface.md`
Architecture plan (Pass 1 pre-implementation): `starry-marinating-locket.md`
Decisions record: ADR 020 (page-level rendering) · ADR 021 (component rendering
classification + unified timeline molecule)
Last updated: 2026-10-11

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
- [x] Track P4 — Image generation: superseded the `imagegen-frontend-web`/`brandkit` plan with
      a hand-authored-vs-AI fork (ADR 026) resolved to a Content/Infrastructure Layer split
      (ADR 027); all 14 projects' covers generated and promoted to `public/images/covers/`. Spec:
      `.docs/tasks/2026-09-27-project-image-generation.md`. Follow-up ticket:
      `.docs/issues/cover-illustrations/01-progressive-rendering-small-form-factor-summary.md`.
- [x] Specimen Mount frame for `SpecimenIllustration` (`/projects/[slug]`) — resolved via
      `/impeccable shape`, recorded as an amendment to `.impeccable/surfaces/src-app-projects-slug-page-tsx.md`.
- [x] `pnpm lint` / `pnpm lint:prettier` run against the branch — both clean; two pre-existing
      findings fixed (`TaxonomyPanel.tsx` class order, `eslint.config.mjs` `.next-e2e/**` ignore).
- [x] PR #38 agentic Standards review fix: `SpecimenPlaceholder` now calls `useTranslations`
      itself instead of receiving resolved `label`/`hint` strings as props (`.claude/rules/i18n.md`
      "no labels props" rule).
- [x] PR #38 agentic Spec review fixes: mat-band separator bumped `border-t-ghost` → `border-t-medium`
      to match the amendment's "thicker" mat-band language; added a real viewport-based CT test for
      the placeholder wrap-bug fix (the prior test would've passed even without the fix — confirmed
      by temporarily reverting the fix and watching the new test fail, then restoring it).

---

## P-FIX-3. TypeSpecimen — spec annotation text fails WCAG AA contrast

> **Superseded 2026-09-17** by critique Finding 1 (`.docs/design/2026-09-14-critique-ink-ghost-contrast-and-atom-affordance.md`), a full site-wide `ink-ghost` audit (~35+ locations, ~20 files) that covers this case. Closed by reference — fix lands as part of Track I PR 1, not as a standalone item.

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

## Track Q — CareerArc hero canvas fixes

Plan: `.docs/tasks/2026-10-23-career-arc-fixes.md` (see "Implementation record" — Fix A took
3 attempts; first two were real but regressed on review and got replaced, not just tuned)
Started: 2026-10-23

- [x] Unrelated pre-existing fix folded into this branch at Nicolas's request: `<body
  suppressHydrationWarning>` — `6d9198f`
- [x] Investigation: root-caused viewport crop, label-position mismatches (SAFeSEA ~127px off,
      HiveMQ Edge ~46px off), confirmed `featured` flag already exists and is already set correctly
      on Calques3D/SAFeSEA/HiveMQ Edge (no schema/content change needed)
- [x] Fix C: `src/app/_utils/arc-geometry.ts` — new, tested (`arc-geometry.test.ts`, 36 tests),
      documented pure Bézier-point/sprinkle-geometry utilities (`pointOnCubicBezier`/`yearToArcPoint`/
      `sprinkleSlot`/`splitBezier`/`trimBezier`), replacing hand-placed `RESEARCH_SLOTS`/
      `ENGINEERING_SLOTS` constants. Committed standalone (no CareerArc.tsx dependents yet in this
      commit) as a reusable, independently reviewable unit — `cef7b0a`.
- [x] Fix A/B, hand-picked improvements, and the `twMerge` fix below all land in one commit —
      `CareerArc.tsx`, both CT specs, `IdentityBlock.tsx`+spec, `arc-sprinkles.ts`+test, `page.tsx`,
      `utils.ts`, `messages/en.json`, `cypress/e2e/homepage.cy.ts`. Kept as one commit rather than
      split further: these all changed together to fix one interlocking set of bugs, and splitting
      would leave intermediate commits that don't type-check against each other's contracts (e.g.
      `ArcSprinkleContent`'s new fields are depended on by both `CareerArc.tsx` and
      `arc-sprinkles.ts` in the same change) — `760f5e7`.
- [x] Fix A (final, rev. 3): hero frame is `h-screen` + `w-full` (fixed to viewport at load); SVG uses
      `preserveAspectRatio="none"` (non-uniform stretch, fills the frame exactly — no crop, no
      letterbox); `IdentityBlock` reverted to absolute+clamp overlay. Superseded two earlier attempts
      (`xMidYMid meet` letterbox-drift; an aspect-locked flex-sized inner wrapper that shrank the
      canvas on windowed/non-fullscreen sizes) — see plan doc for why both were replaced outright.
- [x] Fix B: responsive breakpoint density rules via `hidden <bp>:block` (mirrors
      ClassificationHeader/ResourceAnnotationBar pattern). An `ultra` (1920px) breakpoint token and an
      `ASPECT_SAFE_CLASS` (`min-aspect-ratio`) axis hiding ERA II/the engineering sprinkle on
      narrow-aspect frames were both added, then **removed again same day** per Nicolas's explicit
      correction — ERA I/II must always be visible, not hidden to dodge a theoretical IdentityBlock
      collision; replaced with a positional nudge instead (see hand-picked improvements below). The
      `ultra` token ended up with zero remaining references once that axis was removed — deleted as
      dead config before the PR rather than carried in unused (confirmed zero repo-wide hits first).
- [x] Hand-picked improvements (same day, post-review): ERA I/II always visible (no more
      aspect-ratio hiding); sprinkle subtitle breakpoint `lg`→`md`; Calques3D label nudged clear of
      the arc (`labelOffset` param on `sprinkleSlot`); new duration overlay — exact Bézier sub-curve
      (`splitBezier`/`trimBezier`, De Casteljau) for each sprinkle's real project period, not just its
      single `idealYear` dot. Built as two A/B options picked via one constant
      (`DURATION_INDICATOR` in `CareerArc.tsx`): Option A "band" (bolder stroke on the main line,
      reviewed and parked — didn't read well) vs Option B "echo" (**live** — secondary line offset
      above the arc, matching `PeriodRuler`'s `ruler-span-bar` convention from the project-page
      timeline, gap tightened to a named `DURATION_ECHO_GAP` constant matching that convention's
      actual 3px margin). Both kept in code for a later design review.
- [x] `src/lib/utils.ts` `twMerge` fix: `text-label` was missing from the custom `font-size` class
      group, so `cn('text-label', 'text-ink-secondary')` silently dropped `text-label` (treated as
      conflicting with the color utility) — same failure mode already documented there for
      `text-tag-w*`/`text-badge`/`text-micro`, just not yet hit for this token
- [x] Verification: live `pnpm dev` + Playwright screenshots/DOM overlap checks across a ~60-point
      width×height sweep; final round: Cypress CT (55 tests) + E2E `homepage.cy.ts` (45 tests,
      including a real page-composition label-vs-IdentityBlock overlap check CT specs structurally
      can't do); Vitest (84 tests); `tsc --noEmit`; ESLint; Prettier; `pnpm validate` — all green
- [x] PR #41 opened (`fix/career-arc-hero-canvas` → `main`); agentic code review posted as a PR
      comment (Standards: inline-prop-type finding across 6 new `CareerArc.tsx` sub-components;
      Spec: `preserveAspectRatio="none"` flagged as a deviation from the approved comp's
      `xMidYMid slice`)
- [x] Review follow-up: named `*Props` types added for `ArcLabel`/`SprinkleDot`/
      `DurationIndicator`/`SprinkleLabels`/`ResearchArcGeometry`/`EngineeringArcGeometry`
      (`ArcGeometryProps` shared by the latter two). Scale/slice Spec finding discussed with
      Nicolas against the plan doc's "Implementation record" — `none` was his own explicit,
      empirically-tested call after two rejected attempts (`xMidYMid meet` letterbox-drift;
      aspect-locked flex wrapper shrinking on windowed sizes); confirmed to stand as-is, no code
      change
- [ ] PR ready-for-review (`gh pr ready 41`) once Nicolas is satisfied

---

## Epic → main merge

- [ ] All tracks complete and user satisfied
- [ ] Final `pnpm validate` + full test run on epic
- [ ] **User approval** → epic merges into `main`
