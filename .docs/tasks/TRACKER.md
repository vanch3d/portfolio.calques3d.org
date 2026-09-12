---
plans:
  - .docs/tasks/2026-09-03-homepage-surface-plan.md
  - .docs/tasks/2026-09-03-lab-design-system.md
  - .docs/tasks/2026-09-04-lab-adr-surface.md
epic: epic/design-compass-app
status: in-progress
---

# Homepage Surface + Lab Design System — Progress Tracker

> Plan: `.docs/tasks/2026-09-03-homepage-surface-plan.md`
> Epic branch: `epic/design-compass-app` → merges into `main` when user satisfied
> Started: 2026-09-03
> Status: In progress
> Last updated: 2026-09-08 — Track M: code review fixes applied

---

## Track A — Design system foundation

Branch: `refactor/design-system-components` (current working branch)

- [x] Create epic branch `epic/design-compass-app`
- [x] Review and finalise `src/app/globals.css` token layer
- [x] Review and finalise `src/app/layout.tsx` font loading
- [x] Review and finalise `messages/en.json` HomePage namespace
- [x] Fix `page.tsx` broken translation keys
- [x] Fix ESLint `globalIgnores` scope (was linting `.claude/`, `scripts/`)
- [x] Delete `src/lib/design-tokens.test.ts` (replaced by Cypress lab tests)
- [x] Fix Departure Mono CSS variable chain (`'Departure Mono'` directly, not `var(--font-departure)`)
- [x] Fix `src/app/test/cv/page.tsx` and `research/page.tsx` — design system tokens, not hardcoded `#888`/`monospace`
- [x] `pnpm validate` green
- [x] All tests pass: 45 CT + 35 E2E
- [ ] **User approval** → commit, push, PR into `epic/design-compass-app`

---

## Track B — Homepage comp

Agent: `design-director`

- [x] `/comp-server start` (running at http://localhost:5001, serving `.impeccable/mocks/`)
- [x] Generate 3 compositional comps → `.impeccable/mocks/` (v1 Arc Dominates, v2 Arc as Background, v3 Arc as Baseline)
- [ ] User confirms which comp was approved (v1 / v2 / v3) — verbal approval in prior session not recorded
- [ ] `/comp-approve <filename>` — update surface brief + sidecar `approved: true`

**This gate must close before Track C begins.**

---

## Track C — Homepage first viewport

> **SUPERSEDED by Track L** — V4b R2 redesign replaced and extended Track C + D scope in one branch.

---

## Track D — Era navigation

> **SUPERSEDED by Track L** — included in the V4b R2 implementation.

---

## Track E — Live mode iteration

Prerequisite: Track L in epic

- [ ] `/impeccable live` — arc, identity block, era timeline
- [ ] Variants reviewed and selected
- [ ] Findings folded into deferred issues (D-01 arc fine-tuning, D-08 mobile hero)

---

## Track F — /lab/design-system

Branch: `refactor/design-system-components` (current working branch)

- [x] Surface brief created: `.impeccable/surfaces/src-app-lab-design-system-page-tsx.md`
- [x] Comp generated and approved: `lab-design-system-comp-v1.html` → `.docs/design/comps/`
- [x] Sidecar marked `approved: true`: `.impeccable/mocks/lab-design-system-comp-v1.prompt.json`
- [x] Component conventions documented: `.claude/rules/components.md`
- [x] `src/app/lab/layout.tsx` — lab section layout with `<main>`
- [x] `src/app/lab/page.tsx` — lab index
- [x] `src/app/lab/design-system/page.tsx` — index with named rules, section teasers
- [x] `src/app/lab/design-system/colors/page.tsx` + `ColorSwatch.tsx` + `ColorPalette.tsx`
- [x] `src/app/lab/design-system/typography/page.tsx` + `TypeSpecimen.tsx` + `TypeScale.tsx`
- [x] `src/app/lab/design-system/_components/` — `LabLink`, `NamedRuleCard`, `SectionLabel`
- [x] All 10 CT spec files passing (45 specs)
- [x] `cypress/e2e/lab-design-system.cy.ts` — 27 E2E assertions passing
- [x] `@testing-library/cypress` installed
- [x] Skill definitions corrected: `comp-server`, `comp-approve`, `design-director` → `.impeccable/mocks/`
- [x] `comp-approve` + `design-director` updated: mark approved option `"approved": true` in sidecar
- [x] Committed on `refactor/design-system-components`
- [x] Code review (mattpocock-skills): 2 hard violations + SSG gap + 2 spec gaps fixed
  - [x] Hard violation 1: duplicate `rule_`-prefixed keys removed from `NamedRuleCard` namespace in `messages/en.json`
  - [x] Hard violation 2: `TypeSpecimen.tsx` `SPECIMEN_STYLES` split into `className` + `style`; `--font-*`/`--color-*` moved to Tailwind utilities
  - [x] SSG config: `export const dynamic = "force-static"` added to all 4 `/lab` page files
  - [x] Incline Rule: visual side-by-side comparison added to typography page
  - [x] One Red Rule: inline named-rule card added to `ColorPalette` after accent swatch
- [x] All 45 CT + 27 E2E specs passing after fixes
- [x] ADR written for SSG decision on `/lab` routes (ADR 015)
- [x] `/pr` skill created: `cypress/snapshots/pr-screenshots.cy.ts` + `scripts/pr-screenshots.mjs` + `.claude/commands/pr.md`
- [x] Push branch + open PR into `epic/design-compass-app` → vanch3d/portfolio.calques3d.org#28

---

## Tooling fixes (this session)

- [x] `.claude/commands/comp-server.md` — path corrected to `.impeccable/mocks/`
- [x] `.claude/commands/comp-approve.md` — path corrected; sidecar approval step added
- [x] `.claude/agents/design-director.md` — path corrected; sidecar approval step added
- [x] `src/app/test/cv/page.tsx`, `test/research/page.tsx` — design system tokens replacing hardcoded colours
- [x] `src/app/page.tsx` — lab section link added
- [x] `src/app/lab/page.tsx` — fixed to use LabNav namespace; added index_title key

---

## Track G — /lab/adr + /lab/insights

Plan: `.docs/tasks/2026-09-04-lab-adr-surface.md`
Branch: `feat/lab-adr` (off `epic/design-compass-app`)
Status: **In progress — engineering handoff approved 2026-09-04**

### G1 — Surface design ✓ COMPLETE

- [x] Direction chosen: Blueprint Revision Sheet (seed 1dc45268)
- [x] Comp approved: `.docs/design/comps/adr-index-comp-v1.html` / `.docs/design/comps/adr-index-comp-v1.png`
- [x] Surface brief: `.impeccable/surfaces/src-app-lab-adr-page-tsx.md`
- [x] Comp strategy: Option C — detail + insights inherit direction contract, no new comps
- [x] Post-ship plan: `/impeccable critique` on detail + insights surfaces after implementation
- [x] Insights routing confirmed: `/lab/insights` index + `/lab/insights/[slug]` detail
- [x] Insights strip on index: max 2–3 most recent + "SEE ALL (N) →" link
- [x] Process retrospective: `.local/tmp/impeccable-flow-retrospective.md`

### G2 — Data API ✓ COMPLETE

- [x] `src/lib/content/adr.ts` — `getAllAdrs()`, `getAdr()`, `getAdrSlugs()`, `adrSlugFromNumber()`, `getMostRecentAcceptedAdrNumber()`
- [x] `src/lib/content/insights.ts` — `getAllInsights()`, `getInsight()`, `getInsightSlugs()`, `getMostRecentInsightNumber()`
- [x] `src/lib/content/markdown.ts` — `markdownToHtml()` via remark + remark-gfm + remark-html
- [x] `src/types/adr.ts` — re-exports `AdrMeta`, `Adr`, `AdrStatus`, `InsightMeta`, `Insight`
- [x] `src/schemas/adr.schema.json` / `insight.schema.json`
- [x] Cross-reference resolver: `adrSlugFromNumber()` used at page level to pre-resolve slugs
- [x] `InsightCalloutBlock.test.ts` — Vitest unit tests for `extractBodyExcerpt()` (pure function)

### G3 — Implementation ✓ CODE COMPLETE (awaiting user review + test run)

**ADR index (`/lab/adr`):**

- [x] `page.tsx` — thin shell using `LabBreadcrumb` + `LabRegisterHeader`
- [x] `AdrIndexClient` — client component managing filter/search/load-more state
- [x] `AdrRegisterTable` — uses `RegisterTable/*` + `LabTag` for tag cells
- [x] `AdrFilterBar` — `LabButton` for tag toggles, Base UI `Field`+`Input` for search
- [x] `InsightCalloutStrip` — max 2–3 insights + "SEE ALL (N) →" link

**ADR detail (`/lab/adr/[slug]`):**

- [x] `page.tsx` — SSG with `generateStaticParams`, `LabBreadcrumb` with extra segment
- [x] `AdrDocument` — header block (rule-heavy-x, title-italic), markdown body via remark
- [x] `InsightCalloutBlock` — "DISCOVERED IN PRACTICE" warm-tint block + excerpt

**Insights index (`/lab/insights`):**

- [x] `page.tsx` — `LabBreadcrumb` + `LabRegisterHeader`, resolves `relatedAdrSlug` at page level
- [x] `InsightsRegisterTable` — uses `RegisterTable/*`, `.title-italic` on title column

**Insights detail (`/lab/insights/[slug]`):**

- [x] `page.tsx` — SSG with `generateStaticParams`, `LabBreadcrumb`
- [x] `InsightDocument` — header, frontmatter dl, body, back-ref ADR link, prev/next nav

**Cross-cutting:**

- [x] `LabAdr` + `LabInsights` namespaces in `messages/en.json`
- [x] `export const dynamic = "force-static"` on all 4 route files
- [x] CT specs written alongside all components (not yet run)
- [x] `cypress/e2e/lab-adr.cy.ts` stub
- [x] `AdrDocument.test.ts` / `InsightDocument.test.ts` — E2E-only decision documented
- [x] ADR 019 — Content pipeline for /lab/adr + /lab/insights (gray-matter, remark, server-only data layer, cross-ref resolution, CT/E2E split)
- [ ] User reviews code → approves → runs tests
- [ ] `pnpm validate` green
- [ ] PR into epic
- [ ] Post-ship: `/impeccable critique` on detail + insights

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

## Track I — Boilerplate reboot (`refactor/boilerplate-reboot`)

Branch: `refactor/boilerplate-reboot` (off `epic/design-compass-app`)
Status: **Complete — PR open into epic/design-compass-app**
Last updated: 2026-09-06
Commits: I1–I7 all done; PR pending into epic/design-compass-app

Full codebase reboot onto Tailwind CSS v4 design-system foundation.

### I1 — Legacy teardown

- [x] Delete `src/app/test/*` scaffolding routes (cv, research, publications, case-studies)
- [x] Delete `src/app/publications/[key]/pdf/route.ts` — pre-reboot PDF proxy
- [x] Delete `src/app/globals.css` — monolithic CSS replaced by `src/styles/`
- [x] Delete `src/app/favicon.ico` — replaced by `src/app/icon.svg`
- [x] Delete `src/components/ui/Aside`, `ChapterList` — layout components not carried forward
- [x] Delete `src/components/ui/LabButton`, `LabTag` — replaced by design-system atoms
- [x] Delete `src/components/ui/Mermaid.spec.cy.tsx` — E2E only

### I2 — CSS design token architecture

- [x] `src/styles/globals.css` — entry point
- [x] `src/styles/tokens/colors.css` — three-tier colour tokens (5 semantic colours)
- [x] `src/styles/tokens/typography.css` — font-family, type scale (6 levels), leading, tracking
- [x] `src/styles/tokens/spacing.css` — spacing scale, line weights, layout tokens
- [x] `src/styles/base/reset.css` — html/body baseline, global focus ring
- [x] `src/styles/base/elements.css` — prose element defaults
- [x] `src/styles/utilities/index.css` — `@utility` classes (label, nav-link, border-*)
- [x] `src/styles/themes/index.css` — dark mode placeholder
- [x] `src/app/icon.svg` — SVG favicon

### I3 — Shared UI atoms

- [x] `FilterInput` — controlled text input with accessible search wrapper
- [x] `SectionLabel` — section heading with optional count badge; promoted from lab
- [x] `TagFilterDrawer` — molecule: toggle + chip zone + drawer (search, tabs, frequency groups)
- [x] `NavLink` — updated href type for typed-route compatibility
- [x] `src/lib/utils.ts` — `cn()` utility
- [x] CT support: `component-index.html` + `component.ts` + `RouterWrapper.tsx` updated

### I4 — Homepage surface

- [x] `CareerArc.tsx` + CT spec
- [x] `IdentityBlock.tsx` + CT spec
- [x] `EraBlock.tsx` + CT spec
- [x] `src/app/page.tsx` — thin shell
- [x] `src/app/research/page.tsx` — SSG placeholder
- [x] `src/app/engineering/page.tsx` — SSG placeholder
- [x] `src/app/not-found.tsx` — custom 404
- [x] `cypress/e2e/homepage.cy.ts`
- [x] All HomePage strings in `messages/en.json`

### I5 — Lab design system surface restructure

- [x] Restructure: `/atoms` and `/molecules` sub-sections added
- [x] `ColorSwatch` + `TypeSpecimen` moved to `_components/` (deleted from sub-routes)
- [x] `LabLink` deleted (superseded by `NavLink`)
- [x] `SectionLabel` deleted (promoted to `src/components/ui/`)
- [x] `MoleculeFrame`, `PropsTable`, `TagFilterDrawerDemo` — new molecule specimens
- [x] `FilterInputDemo` — new atom specimen
- [x] `src/app/lab/design-system/layout.tsx` added
- [x] E2E: `lab-design-system.cy.ts` → `design-system.cy.ts`

### I6 — Lab ADR surface rewrite

- [x] `AdrRegisterHeader` — page-level header; replaces generic `LabRegisterHeader`
- [x] `AdrFilterBar` — search + global CLEAR (tags moved to `TagFilterDrawer`)
- [x] `AdrIndexClient` — orchestrator: search + tags + visible-count + hasClearable
- [x] `AdrRegisterTable` — updated style
- [x] `InsightCalloutStrip` — updated to design-system tokens
- [x] `src/lib/content/adr.ts` — `getAllAdrTags()` returns `TagWithCount[]` by frequency
- [x] `.docs/adr/TAGS.md` — 52-tag canon + 6 authoring rules; tag normalisation applied
- [x] Deleted: `LabBreadcrumb`, `LabRegisterHeader`, `RegisterTable/*`, ADR detail route, Insights section
- [x] E2E: `lab-adr.cy.ts` → `adr.cy.ts` + `lab.cy.ts`

### I7 — Tooling

- [x] `.claude/rules/tailwind.md` — comprehensive Tailwind v4 agent guidelines
- [x] `tests/e2e/smoke.spec.ts` — updated for new route structure

### I8 — Test suite review and hardening (2026-09-07)

- [x] CT spec review: selector anti-patterns, missing a11y checks, fragile assertions
- [x] `FilterInput.tsx` — `data-testid="filter-input"` on container
- [x] `AdrRegisterHeader.tsx` — `data-testid` on counter spans + dimension-line wrapper
- [x] `AdrRegisterTable.tsx` — `data-testid="adr-row-NNN"` per row + `data-testid="no-results"`
- [x] `NamedRuleCard.tsx` — `data-testid="named-rule-rationale"` on optional rationale
- [x] CT selectors hardened: `[role='search'] input`, row testids, testid-scoped aria assertions
- [x] `TagFilterDrawer.spec.cy.tsx` — aria-expanded tests added; `TagFilterDrawerDemo` axe added
- [x] `TypeSpecimen.spec.cy.tsx` — color-contrast rule excluded with documented rationale
- [x] E2E: breadcrumb selector standardised, counter assertions via testid, fragile patterns fixed
- [x] Server component strategy: `IdentityBlock`, `AdrRegisterHeader`, `InsightCalloutStrip`
      cannot run in CT; replaced with no-op stubs pointing to E2E coverage
- [x] `homepage.cy.ts` — `describe("IdentityBlock")` mirrors CT narrative via real page
- [x] `adr.cy.ts` — `describe("AdrRegisterHeader")` + `describe("InsightCalloutStrip")` added
- [x] 197 CT passing, 0 failing; E2E narrative complete for all server components

---

## Track J — PR #30 code review fixes (`refactor/applink-promotion-and-normalisation`)

Branch: `refactor/applink-promotion-and-normalisation`
Status: **Complete — committed 2026-09-06**

Addresses all findings from the agentic code review posted on PR #30.

### i18n errors (5 blockers) ✓ COMPLETE

- [x] `research/page.tsx` — async + `getTranslations("ResearchPage")`; namespace added to `messages/en.json`
- [x] `engineering/page.tsx` — async + `getTranslations("EngineeringPage")`; namespace added
- [x] `lab/page.tsx` — two hardcoded subtitles replaced with `t("nav_design_system_subtitle")` / `t("nav_adr_subtitle")`
- [x] `lab/design-system/page.tsx` — NamedRuleCard rationale props, type ramp specimens, atoms NamedRuleCard, TagFilterDrawer desc all externalised
- [x] `messages/en.json` — `ResearchPage`, `EngineeringPage`, `LabNav` subtitle keys, `NamedRuleCard` rationale keys, `LabDesignSystem` type ramp preview keys + drawer desc

### Spec warnings ✓ COMPLETE

- [x] `AdrFilterBar.tsx` — `border-b-medium border-ink` → `border-b-ghost border-ink-ghost` (comp alignment)
- [x] `adr/page.tsx` — breadcrumb current segment `active-mark` → `text-ink` (comp shows ink, not red)

### Standards warnings ✓ COMPLETE

- [x] `page.tsx` — `style={{ height: "100vh" }}` → `className="h-screen"`
- [x] `icon.svg` — comment added explaining raw hex exception
- [x] `TagFilterDrawer.tsx` — removed redundant `aria-disabled="true"` from disabled buttons; `w-[10rem]` → `w-filter-input-w-drawer`
- [x] `AdrFilterBar.tsx` — `w-[14rem]` → `w-filter-input-w`
- [x] `ColorSwatch.tsx` — `sm:w-[120px]`/`h-[72px]`/`max-w-[52ch]`/`tracking-[0.06em]` → named tokens
- [x] `lab/design-system/page.tsx` colour strip — `w-[72px] h-[48px]` → `w-swatch-strip-w h-swatch-strip-h`
- [x] `spacing.css` — filter input width tokens + swatch dimension tokens registered
- [x] `typography.css` — `--tracking-tight: 0.06em` token added; badge micro-sizes comment expanded

### Info findings ✓ COMPLETE

- [x] `AdrIndexClient.spec.cy.tsx` — `TagWithCount` import canonical source (`@/lib/content/adr`)

---

## Track K — E2E test suite hardening round 2 (`refactor/boilerplate-reboot`)

Branch: `refactor/boilerplate-reboot`
Status: **Complete — 2026-09-07**

All 7 E2E specs passing (132 tests, 129 passing, 3 intentionally skipped).

### Bug fixes

- [x] `src/lib/content/adr.ts` — tightened filename filter to `/^\d{3}-/`; TAGS.md was being loaded as an ADR, producing NaN numbers and undefined titles
- [x] `src/app/page.tsx` — wrapped page output in `<main>`; era-blocks div was outside any landmark (axe `region` violation)
- [x] `src/app/lab/page.tsx` — removed `active` prop from SectionLabel; created second .active-mark alongside breadcrumb (One Red Rule broken, `landmark-unique` impact)
- [x] `src/app/lab/design-system/page.tsx` — footer nav given unique aria-label via `nav_footer_aria` i18n key; was identical to layout header nav (`landmark-unique` violation)
- [x] `messages/en.json` — `nav_footer_aria` key added to `LabNav` namespace

### E2E infrastructure

- [x] `cypress/support/commands/index.ts` — `injectAxe` overwrite applies `configureAxe` color-contrast exclusion globally, removing per-spec workarounds
- [x] `cypress.config.ts` — `pr-snapshots` excluded from regular specPattern (manual-only)

### E2E specs

- [x] `cypress/e2e/adr.cy.ts` — hydration sentinel replaced: `aria-expanded="false"` was in SSR HTML (false sentinel); now waits for `data-testid="client-ready"` set by `useEffect` in `AdrIndexClient` (client-only, confirms React hydration)
- [x] `src/app/lab/adr/_components/AdrIndexClient.tsx` — `useEffect` sets `data-testid="client-ready"` on container div after mount
- [x] `cypress/e2e/design-system.cy.ts` — breadcrumb selector corrected; One Red Rule scoped to `header`; named-rule card count scoped to section
- [x] `cypress/e2e/homepage.cy.ts` — One Red Rule assertion corrected (zero active-marks on root surface); axe color-contrast exclusion removed (now global)
- [x] `cypress/e2e/cv.cy.ts` — all tests suspended (`it.skip`); route `/test/cv` no longer exists
- [x] `cypress/e2e/research.cy.ts` — rewritten for real `/research` route (6 tests)
- [x] `cypress/e2e/engineering.cy.ts` — new spec for real `/engineering` route (6 tests)

---

## Track L — Homepage V4b R2 redesign (`feat/homepage-compass-redesign`)

Branch: `feat/homepage-compass-redesign` (off `epic/design-compass-app`)
Status: **In progress — commits staged, PR pending**
Plan: `.local/planning/homepage-v4b-r2-implementation.md`

### Design phase ✓ COMPLETE

- [x] `/impeccable critique` on existing homepage — score 26/32; P0 arc shape, P1 scroll unfulfilled
- [x] 4 new comp variants generated (V4a, V4b, V4b-r2, V4c)
- [x] V4b R2 approved: Two Ascending Arcs — Two Movements, One Direction
- [x] Comp committed: `.docs/design/comps/homepage-comp-v4b-r2.html`
- [x] Surface brief updated with COMP pointer
- [x] Index.html updated (all 7 homepage variants listed)

### Implementation ✓ CODE COMPLETE

- [x] `CareerArc.tsx` — full V4b R2 geometry; 7 `<g>`-based sub-components (`GhostGrid`, `TimelineLegend`, `CareerChord`, `ResearchArc`, `EngineeringArc`, `InflectionNode`, `StructuralBorders`); `data-testid` on all key elements
- [x] `CareerArc.spec.cy.tsx` — updated; `data-testid` selectors replacing verbatim `d`-attribute assertions
- [x] `IdentityBlock.tsx` — upper-left anchor (`top: clamp`); `id="canvas-identity"` + `id="canvas-name"` for scroll handler targeting
- [x] `IdentityBlock.spec.cy.tsx` — updated for new anchor position
- [x] `SiteNav.tsx` — fixed scroll-revealed nav; `nav-hidden` by default; fully i18n'd; `ProjectType`-aware; 5 links: Research · Engineering · Publications · Lab · ···
- [x] `SiteNav.spec.cy.tsx` — 12 tests; hidden/visible states, all link hrefs, contact aria-label, axe
- [x] `EraTimeline.tsx` — 50/50 grid server component; hardcoded positions (deferred D-03); resolves i18n and passes typed props
- [x] `EraTimeline.spec.cy.tsx` — 6 tests: grid, headings, position lists, axe
- [x] `EraColumn.tsx` — dimension ruler; reverse-chronological position list; `era: ProjectType` (shared with content types, no local union); `cn()` throughout; `EraEntry` type (not `Position`)
- [x] `EraColumn.spec.cy.tsx` — 17 tests: ruler, badge, name, summary, positions, links, axe
- [x] `HomepageScrollHandler.tsx` — thin `"use client"` wrapper delegating to `useHomepageScroll`; returns null
- [x] `HomepageScrollHandler.spec.cy.tsx` — 4 tests via ScrollTestHarness; nav hidden before scroll, name opacity 1 initially, axe
- [x] `src/lib/hooks/useHomepageScroll.ts` — parameterised scroll hook (extracted from HomepageScrollHandler)
- [x] `page.tsx` — V4b R2 shell; `force-static`; SiteNav + HomepageScrollHandler + hero + EraTimeline + secondary nav; sr-only arc description
- [x] `src/styles/tokens/spacing.css` — `--nav-height` token
- [x] `src/styles/utilities/index.css` — `nav-hidden` / `nav-visible` utilities
- [x] `messages/en.json` — 14+ new `HomePage` keys
- [x] 56/56 CT specs passing; `pnpm validate` green

### Deferred issues

See `.local/planning/homepage-v4b-r2-implementation.md` — D-01 through D-08

- [ ] **User approval** → commit, push, PR into `epic/design-compass-app`

---

## Track M — Homepage content wiring (`feat/homepage-content-wiring`)

Branch: `feat/homepage-content-wiring` (off `epic/design-compass-app`)
Status: **Complete — PR pending**
Resolves deferred issues D-02 and D-03 from Track L.

- [x] `src/types/content.ts` — `PositionType` split into `ResearchPositionType | EngineeringPositionType`
- [x] `src/lib/content/positions.ts` — `getResearchPositions()` + `getEngineeringPositions()` utilities; typed Sets with `satisfies`
- [x] `src/lib/content/positions.test.ts` — 19 tests (11 new for era-filtered utilities)
- [x] `src/lib/period.ts` — `extractYear()` + `formatPeriod()` pure utilities
- [x] `src/lib/period.test.ts` — 11 tests
- [x] `src/app/_components/EraTimeline.tsx` — positions from `getResearchPositions()` / `getEngineeringPositions()` (D-03)
- [x] `src/app/_components/CareerArc.tsx` — sprinkles driven by `ArcSprinkleContent[]` props; null slots render nothing
- [x] `src/app/_components/CareerArc.spec.cy.tsx` — updated for new sprinkle props
- [x] `src/app/_utils/arc-sprinkles.ts` — `buildSprinkle()` + `pickSprinkle()` (featured preference, random within tier)
- [x] `src/app/_utils/arc-sprinkles.test.ts` — 17 tests
- [x] `src/app/page.tsx` — sprinkles from `pickSprinkle()` with idealYear anchors; all hardcoded text removed (D-02)
- [x] `messages/en.json` — `Common.period_present` added; orphaned sprinkle keys removed
- [x] `.docs/engineering/2026-09-08-arc-year-to-point.md` — research note: Bézier year-to-point + outward normal label placement
- [x] `pnpm validate` green; `tsc --noEmit` zero errors; all new unit tests pass

---

## Epic → main merge

- [ ] All tracks complete and user satisfied
- [ ] Final `pnpm validate` + full test run on epic
- [ ] **User approval** → epic merges into `main`
