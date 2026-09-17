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

Handoff: `.docs/tasks/2026-09-14-atom-interaction-system.md` (design finished, approved 2026-09-14)
Surface brief: `.impeccable/surfaces/src-app-lab-design-system-page-tsx.md` (v2, addendum)
Critique: `.docs/design/2026-09-14-critique-ink-ghost-contrast-and-atom-affordance.md`
Agent: `nextjs-engineer` (per-PR, spawns `tester`)
Started: 2026-09-17
Branch: `feat/atom-interaction-system` (off `epic/design-compass-app`) — **single working branch for all of PR 0–5 + retrofit.**
Per-PR reports (files changed, verification results — for commit/PR-description writing later without re-diffing): `.local/tmp/track-i-pr-reports.md`

> **No git during this phase.** Per Nicolas 2026-09-17: no commit, stage, push, or PR creation by any agent (orchestrator or spawned) until all work is done and reviewed, including by Nicolas. "PR 0"–"PR 5" below are scope boundaries for the work, not literal git branches/PRs — everything lands as working-tree changes on the one branch above.

One concern per PR, per standing convention. Do not collapse PRs together.

- [x] **PR 0** — `DESIGN.md` + `ADR 009` edits already made in working tree (design/reconciliation session). **Commit deferred** — per Nicolas 2026-09-17, no git commit/stage/PR during this engineering phase; all work lands on `feat/atom-interaction-system` (branched off `epic/design-compass-app`) and is committed only after full review.
- [x] **PR 1** (done 2026-09-17, `nextjs-engineer`) — sitewide `ink-ghost` → `ink-secondary`/`ink` contrast fix. 28 source files + `DESIGN.md` (Ghost Line rule tightened) + 2 spec files updated. `FilterInput`/`TagFilterDrawer` borders promoted (1.4.11). Axe-exception comment added for disabled view-mode tabs (WCAG 1.4.3). `colors.css:14` stale comment was already gone. **Bonus:** the project-wide `color-contrast` axe exclusion in `tests/e2e/smoke.spec.ts` (whose own comment cited this exact bug) was removed — 38/38 Playwright E2E pass with it re-enabled. `pnpm validate` green, `tsc --noEmit` clean, all touched CT specs green (15 spec files). P-FIX-3 confirmed fully resolved (only remaining `ink-ghost` in `TypeSpecimen.tsx` is a non-text border, out of scope). **Not yet committed — awaiting review.**
- [ ] **PR 2** — `Button` atom (`src/components/ui/Button.tsx` + spec). Plain `<button>`, 3 variants (Primary/Secondary/Text-action). Resolves the open CVA-vs-`cn()` variant-mechanism decision (ADR trigger if CVA is chosen — stop and propose before writing variant code). Updates `/lab/design-system/atoms` + index preview strip.
- [ ] **PR 3** — `Checkbox` + `Radio`/`RadioGroup` atoms, built on `@base-ui/react`. Circular radio marker (confirmed). Selected = solid `ink` fill.
- [ ] **PR 4** — `Field`/`Fieldset` atoms, built on `@base-ui/react`. Error state: `border-heavy` + inline-SVG ink-filled badge (not text glyph). Resolve icon-convention question (inline-per-component vs. shared icon component).
- [ ] **PR 5** — Construction Panel containment pattern (generalises `MoleculeFrame`/`NamedRuleCard` framing for a dynamic/open-close region). `/lab/design-system/molecules` + index preview strip. Pattern only — not yet applied to `TagFilterDrawer`.
- [ ] **Retrofit phase** (separate PR(s) after PR 2–5 land) — apply `Button` to `TagFilterDrawer`'s five ad hoc treatments + `FilterInput`; apply Construction Panel to the drawer panel (`#tag-drawer`); fix `FilterInput`'s local `:focus-within` red-ring redefinition.

**Guardrails (done criteria, every PR):** no new component imports `@base-ui/react` for `Button`; no new component redefines `:focus-visible` locally; no colour outside the five-token palette; no border-radius other than 0 except the circular radio-dot exception; ADR 009 Verification checklist items checked off as each applicable PR lands.

---

## Track P — Project surface `/projects/[slug]`

Plan: `.docs/tasks/2026-09-08-project-surface.md`
Architecture plan (Pass 1 pre-implementation): `starry-marinating-locket.md`
Decisions record: ADR 020 (page-level rendering) · ADR 021 (component rendering
classification + unified timeline molecule)
Last updated: 2026-09-12

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

## Epic → main merge

- [ ] All tracks complete and user satisfied
- [ ] Final `pnpm validate` + full test run on epic
- [ ] **User approval** → epic merges into `main`
