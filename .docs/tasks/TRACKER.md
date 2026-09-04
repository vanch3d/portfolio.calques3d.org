---
plans:
  - .docs/tasks/2026-09-03-homepage-surface-plan.md
  - .docs/tasks/2026-09-03-lab-design-system.md
epic: epic/design-compass-app
status: in-progress
---

# Homepage Surface + Lab Design System — Progress Tracker

> Plan: `.docs/tasks/2026-09-03-homepage-surface-plan.md`
> Epic branch: `epic/design-compass-app` → merges into `main` when user satisfied
> Started: 2026-09-03
> Status: In progress
> Last updated: 2026-09-04

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

Branch: `feat/homepage-first-viewport` (off epic)
Prerequisite: Track A approved + Track B approved

- [ ] Create branch off epic
- [ ] `CareerArc.tsx` — SVG compass arc, dimension lines, era markers
- [ ] `CareerArc.spec.cy.tsx` — CT spec + axe pass
- [ ] `IdentityBlock.tsx` — name at display scale, positioning sentence
- [ ] `IdentityBlock.spec.cy.tsx` — CT spec + axe pass
- [ ] `SiteNav.tsx` — scroll-reveal nav, 4 links
- [ ] `SiteNav.spec.cy.tsx` — CT spec + axe pass + keyboard
- [ ] `page.tsx` — thin shell, translations wired
- [ ] Renders at `localhost:3000`; 30-second scan readable
- [ ] WCAG 2.1 AA zero violations
- [ ] `pnpm validate` green
- [ ] **User approval** → commit, push, PR into `epic/design-compass-app`

---

## Track D — Era navigation

Branch: `feat/homepage-era-navigation` (off epic)
Prerequisite: Track C approved and in epic

- [ ] Scope confirmed after Track C review + live mode
- [ ] Research / Engineering era cards
- [ ] Mobile-responsive layout
- [ ] CT specs + axe pass
- [ ] **User approval** → commit, push, PR into `epic/design-compass-app`

---

## Track E — Live mode iteration

Prerequisite: Track C rendering at `localhost:3000`

- [ ] `/impeccable live` — arc, identity block, era cards
- [ ] Variants reviewed and selected
- [ ] Findings folded into Track D scope

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
- [ ] ADR written for SSG decision on `/lab` routes
- [ ] Push branch + open PR into `epic/design-compass-app`

---

## Tooling fixes (this session)

- [x] `.claude/commands/comp-server.md` — path corrected to `.impeccable/mocks/`
- [x] `.claude/commands/comp-approve.md` — path corrected; sidecar approval step added
- [x] `.claude/agents/design-director.md` — path corrected; sidecar approval step added
- [x] `src/app/test/cv/page.tsx`, `test/research/page.tsx` — design system tokens replacing hardcoded colours
- [x] `src/app/page.tsx` — lab section link added
- [x] `src/app/lab/page.tsx` — fixed to use LabNav namespace; added index_title key

---

## Epic → main merge

- [ ] All tracks complete and user satisfied
- [ ] Final `pnpm validate` + full test run on epic
- [ ] **User approval** → epic merges into `main`
