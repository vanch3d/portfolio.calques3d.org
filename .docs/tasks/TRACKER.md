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

**Comment-quality pass (2026-09-18):** file-header comments across the PR1–4 atom spec files (Button/Checkbox/Radio/FilterInput/Field/Fieldset) narrated decision history already captured in this tracker — trimmed to load-bearing invariants only, per CLAUDE.md's comment rule. `// ── Section ──` banner comments replaced with real nested `describe()` blocks. `.claude/agents/nextjs-engineer.md` updated to make this explicit for future PRs.

> **No git during this phase.** Per Nicolas 2026-09-17: no commit, stage, push, or PR creation by any agent (orchestrator or spawned) until all work is done and reviewed, including by Nicolas. "PR 0"–"PR 5" below are scope boundaries for the work, not literal git branches/PRs — everything lands as working-tree changes on the one branch above.

> ## 🔴 HANDOFF STATE (2026-09-26, updated live — read this first if resuming a new session)
>
> **Where we are right now:** PR 0–5 are all functionally done (see below). `ConstructionPanel` (PR 5) is now built directly on the `Collapsible` atom (scope B) and carries the scope D API extension (`trigger`/`open`/`onOpenChange`, shared box-styling base) — see `.docs/tasks/2026-09-18-collapsible-atom-retrofit.md` and `.docs/tasks/2026-09-26-construction-panel-reuse-retrofit.md`.
>
> **⏸️ Still open, deliberately parked, not blocking:**
>
> - The `outline`-vs-`:focus-visible`-ring conflict in Button's pressed state (real WCAG 2.4.7 concern, documented in `Button.tsx`'s doc comment and the PR 2 entry below). A `::after` pseudo-element fix was tried and reverted (rendered asymmetrically, cause undiagnosed) — needs a dedicated a11y pass, not a blind retry.
> - The process-quality concern Nicolas raised about the whole pressed-state bug hunt itself ("engineering hubris... reinventing the wheel") — explicitly parked by him, not scheduled.
> - ADR 024's "PR 3/4 follow this same pattern" checklist line is ambiguous (see PR 4 entry below) — needs Nicolas to tick/resolve.
> - PR 3's judgment call (plain `active:border-heavy` instead of Button's outline mechanism for Checkbox/Radio pressed state) and PR 4's judgment call (Fieldset→RadioGroup disabled does not cascade) are both flagged as "not independently re-verified by the orchestrator" — worth a visual check.
>
> **Next action:** get Nicolas's go-ahead before starting the `TagFilterDrawer` retrofit onto `ConstructionPanel` (scope E), per the standing "stop between PRs" rule.
>
> **No commits exist for anything past PR 4 in Track I yet.** Everything above is uncommitted working-tree state on `feat/atom-interaction-system`.

One concern per PR, per standing convention. Do not collapse PRs together.

- [x] **PR 0** — `DESIGN.md` + `ADR 009` edits already made in working tree (design/reconciliation session). **Commit deferred** — per Nicolas 2026-09-17, no git commit/stage/PR during this engineering phase; all work lands on `feat/atom-interaction-system` (branched off `epic/design-compass-app`) and is committed only after full review.
- [x] **PR 1** (done 2026-09-17, `nextjs-engineer`) — sitewide `ink-ghost` → `ink-secondary`/`ink` contrast fix. 28 source files + `DESIGN.md` (Ghost Line rule tightened) + 2 spec files updated. `FilterInput`/`TagFilterDrawer` borders promoted (1.4.11). Axe-exception comment added for disabled view-mode tabs (WCAG 1.4.3). `colors.css:14` stale comment was already gone. **Bonus:** the project-wide `color-contrast` axe exclusion in `tests/e2e/smoke.spec.ts` (whose own comment cited this exact bug) was removed — 38/38 Playwright E2E pass with it re-enabled. `pnpm validate` green, `tsc --noEmit` clean, all touched CT specs green (15 spec files). P-FIX-3 confirmed fully resolved (only remaining `ink-ghost` in `TypeSpecimen.tsx` is a non-text border, out of scope). **Not yet committed — awaiting review.**
- [x] **PR 2** (done 2026-09-17) — `Button` atom: `src/components/ui/Button.tsx` (3 variants, no Base UI, no local focus-visible) + `Button.spec.cy.tsx` (19/19 CT specs incl. axe). Atoms page + index preview strip updated, i18n strings added, ADR 009 Button checkbox ticked. Variant mechanism: **Option B** (`cn()`-backed `Record<Variant,string>` class-map) was implemented, then **rejected by Nicolas** on engineering grounds (unstructured 180–250 char strings, no reuse, no Tailwind IntelliSense) — **superseded by ADR 024** (adopted `class-variance-authority`, status `accepted`). `Button.tsx` now uses `cva()` with a `base` array and grouped multi-line `variants.variant` arrays; `.claude/rules/components.md`'s Variant mechanism section rewritten to document this as the binding pattern for PR 3/4.
  - **Post-review bug hunt (same day):** live testing found the pressed state flickering/shrinking. Root causes: (1) `tailwind-merge` misclassified `border-heavy`/`border-medium` as border-_color_ classes, silently dropping them — fixed in `src/lib/utils.ts` (kept, real fix, same failure mode as the existing `text-tag-w*` fix); (2) sub-pixel `border-width` (1.5px) doesn't render distinctly from 1px at 1x DPI — pressed escalation now drawn via an **outward-facing `outline`** (`live-line-pressed` utility, `src/styles/utilities/index.css`) instead of growing `border-width`, avoiding box-model layout shift entirely. `--line-heavy` bumped to `2px` in `src/styles/tokens/spacing.css` per Nicolas's request for visibility during testing — **⚠️ Button no longer uses this token at all (outline uses `--line-medium` doubled); the 2px value now only affects other, unreviewed consumers (`NamedRuleCard`, `MoleculeFrame`) — needs a decision before commit.** Also fixed: disabled buttons showed the pressed effect (`disabled:pointer-events-none` added).
  - **⚠️ KNOWN UNRESOLVED ISSUE, flagged for a11y review:** the pressed-state `outline` and the global `:focus-visible` ring share the same CSS property — pressing while keyboard-focused (e.g. Space/Enter) overwrites the focus ring for the press duration. A `::after` pseudo-element fix was built and verified correct in isolation but rendered asymmetrically in the real page layout (cause undiagnosed) — reverted per Nicolas's pre-authorization. **Needs a dedicated pass before this ships**, not a blind retry.
  - Full investigation narrative: `.local/tmp/track-i-pr-reports.md`. `pnpm validate` + `tsc --noEmit` green. **Not yet committed — awaiting review.**
- [x] **PR 3** (done 2026-09-17, `nextjs-engineer`) — `Checkbox` (`src/components/ui/Checkbox.tsx`) + `Radio`/`RadioGroup` (`src/components/ui/Radio.tsx`, single file — a radio without a group is meaningless), both built on `@base-ui/react` (`@base-ui/react/checkbox`, `/radio`, `/radio-group` — correct non-deprecated package). Circular radio marker (confirmed exception). Selected = solid `ink` fill.
  - **Neither uses CVA.** Both have exactly one visual treatment (no `variant` prop, no real caller choice) — all state comes from Base UI's own `data-checked`/`data-disabled` attributes via Tailwind's `data-[checked]:`/`data-[disabled]:` syntax in a single `cn()` call, matching ADR 024's explicit carve-out for single-variant components. No hand-rolled ARIA/state tracking.
  - **Judgment call, flagged:** the approved comp's checkbox/radio pressed state uses literal `border-width` escalation (medium→heavy), the same mechanism Button's _pre-fix_ implementation used and that caused the whole bug hunt. The agent deliberately used a plain `active:border-heavy active:border-ink` (real `:active`, no `outline`) rather than reusing Button's `live-line-pressed` outline utility, specifically to avoid reintroducing the outline/focus-ring conflict — reasoning: checkbox/radio boxes have fixed dimensions (no padding to desync), so the layout-shift risk doesn't apply here the way it did for Button's auto-sized box. **Not independently re-verified by the orchestrator — worth a visual check** given how much Button's border-width assumptions turned out to be wrong.
  - New component tokens: `--control-size` (20px, checkbox/radio box), `--control-dot-size` (8px, radio selected dot) in `src/styles/tokens/spacing.css`.
  - Atoms page + index preview strip updated, i18n strings added (`checkbox_*`/`radio_*` under `LabAtoms`).
  - ADR 009's Checkbox/Radio/Field verification item left **unchecked** (annotated "partially verified" — Field/Fieldset from PR 4 still pending, item covers all three). ADR 024's "PR 3/4" item also left unchecked for the orchestrator, per instruction.
  - `pnpm validate` + `tsc --noEmit` green. Both CT specs 23/23 passing (Checkbox 12, Radio 11) — includes real Base UI keyboard-interaction coverage, not just class-presence checks. **Not yet committed — awaiting review.**
- [x] **PR 4** (done 2026-09-18, `nextjs-engineer`, spawned two `tester` agents + `validate-runner`) — `Field.tsx`/`Fieldset.tsx` (`src/components/ui/`), built on `@base-ui/react`'s `Field`/`Fieldset` primitives. Error state: `border-heavy` + `FieldErrorIcon` (private inline-SVG badge, `ground`-on-`ink` fill, reuses the existing `--control-dot-size` token). **Icon-convention decision:** inline SVG stays per-component (not extracted to a shared icon component) — exactly one icon exists in the system, no reuse to justify an abstraction yet; revisit the moment a second icon is needed. **CVA decision:** neither component uses `cva()` — both single-treatment, per ADR 024's own exception clause (same precedent as PR 3's Checkbox/Radio).
  - Atoms page: new 4-up specimen grid (Default/Filled/Error/Disabled) + a `Fieldset`-wrapping-`RadioGroup` composition specimen. Index preview strip: new Field row. i18n under `LabAtoms`/`LabDesignSystem`. ADR 009's Base-UI verification checkbox fully ticked (Checkbox/Radio + Field/Fieldset combined).
  - **Judgment call worth a visual check:** traced Base UI's actual source rather than assuming API behaviour, and found `Fieldset` → `RadioGroup` disabled state does **not** cascade automatically (only the legend/`aria-labelledby` does) — corrected before it shipped as a wrong doc comment/test. Not independently re-verified by the orchestrator.
  - **Flagged, unresolved:** ADR 024's Verification checklist still has an unchecked "PR 3/4 follow this same pattern" line — ambiguous whether it means literal `cva()` adoption (which PR 3/4 both correctly skipped, per the exception clause) or the ADR's full structural reasoning (which they do follow). Left for Nicolas to tick/resolve.
  - Both CT specs 20/20 passing (Field 12, Fieldset 8) — 0 fixes needed by `tester` on first run. `pnpm validate` + `tsc --noEmit` green. No git commands run. Full report: `.local/tmp/track-i-pr-reports.md`. **Not yet committed — awaiting review.**
  - **Post-landing bug fix (2026-09-18):** Nicolas found Field/Fieldset and the pre-existing FilterInput specimens rendering collapsed (~24-40px) on `/lab/design-system/atoms`. Root cause: Tailwind v4's `max-w-*`/`w-*` utilities key off the shared `--spacing-*` namespace, so `max-w-xs` (used by `Field.tsx` and the FilterInput demo wrapper) silently resolved to this project's own `--spacing-xs` (4px) instead of Tailwind's built-in 20rem — a token-namespace collision, not a flex/grid layout bug. Fixed with dedicated tokens instead of the shadowed default-scale name: `--field-max-width: 20rem` → `max-w-field` (own `--max-width-*` namespace, comp-sourced, `lab-design-system-atoms-comp-v1.html:477`) for `Field.tsx`; reused the existing `--filter-input-w: 14rem` token → `max-w-filter-input-w` for the FilterInput demo wrapper in `atoms/page.tsx`. Hazard documented inline in `spacing.css`. Added a width-regression CT assertion to `Field.spec.cy.tsx` (13/13 passing). 34/34 CT specs green across Field/Fieldset/FilterInput, `pnpm validate` + `tsc --noEmit` clean. No git commands run.
- [x] **PR 5** (done 2026-09-18, `nextjs-engineer`, spawned `tester` + `validate-runner`) — `ConstructionPanel.tsx`/`ConstructionPanel.spec.cy.tsx` (`src/components/ui/`): containment pattern for a region that opens/closes (drawer, disclosure), now composing the `Collapsible` atom (scope B) with a `trigger`/`open`/`onOpenChange` API extension (scope D) and a shared box-styling base. `role="region" aria-label"` on the panel, matching `TagFilterDrawer`'s `#tag-drawer` precedent. New `border-r-heavy/medium/ghost` utilities added (`src/styles/utilities/index.css`) — only `t`/`b`/`l` existed before. Molecules page: new section with closed+open specimens, decisions list, Props table. Index preview strip: new row per `lab-design-system-comp-v2.html:612-655`. i18n under `LabMolecules`/`LabDesignSystem`. No `cva()` — single treatment, ADR 024 exception clause (same precedent as PR 3/4).
  - **Judgment calls, not independently re-verified by the orchestrator:** (1) `ConstructionPanel` placed in shared `src/components/ui/` rather than a route-private `_components/`, matching the `Button`/`Checkbox`/`Radio`/`Field` precedent since it's consumed from two route levels; (2) added a `closedHint` prop beyond the comp's literal recipe table — flagged as possibly better left as page-local markup instead of part of the component's API; (3) sample chips (`Testing`, `A11y`, etc.) are hardcoded non-i18n decorative content, consistent with existing `SAMPLE_TAGS`-style precedent, and are duplicated (not shared) between the molecules page's private `SampleChips()` helper and the index preview row, to avoid a cross-route `_components/` import.
  - `pnpm validate` + `tsc --noEmit` clean. No git commands run — **not yet committed, awaiting review.**
- [ ] **Retrofit phase** (separate PR(s) after PR 2–5 land) — apply `Button` to `TagFilterDrawer`'s five ad hoc treatments + `FilterInput`; fix `FilterInput`'s local `:focus-within` red-ring redefinition. **The "apply Construction Panel to the drawer panel" item is superseded** — see below.

**2026-09-18 — Construction Panel retrofit re-planned.** Attempting to apply `ConstructionPanel` as-is to `TagFilterDrawer` surfaced two structural gaps: its trigger is hardcoded (can't fit the drawer's badge/chip-cloud/mobile-overlay trigger), and it only supports hard mount/unmount, not a genuine collapsed-but-rendered state. Root cause: `@base-ui/react` (already a dependency, already the pattern for `Checkbox`/`Radio`/`Field`/`Fieldset`) ships a `Collapsible` primitive that wasn't used when `ConstructionPanel` was built. New plan — a shared `Collapsible` atom (`CollapsibleRoot`/`Trigger`/`Panel`, thin Base UI wrappers, `data-[open]:` styling, no custom render-props) that `ConstructionPanel` is refactored onto (public API unchanged) and that `TagFilterDrawer` adopts directly (controlled mode, custom trigger/panel content). Full API shape + scope sequence: `.docs/tasks/2026-09-18-collapsible-atom-retrofit.md`. That doc's "PR A/B/C" labels are scope boundaries within this one working branch, not literal PRs — same convention as "PR 0"–"PR 5" above (per Nicolas 2026-09-21).

**2026-09-21 — Go-ahead given, scope A (`Collapsible` atom) starting.** `nextjs-engineer` spawned for scope A only; stop-between-scopes rule still applies before B and before C.

**2026-09-21 — Scope A complete.** `src/components/ui/Collapsible.tsx` + spec (`CollapsibleRoot`/`Trigger`/`Panel`, pure passthrough, no `cva()`). `tester`: 11/11 CT specs green on first pass incl. 2 axe checks, 0 fixes needed; full CT suite 467/467, no regressions. `pnpm validate` + `tsc --noEmit` clean. Not surfaced on `/lab/design-system` (per scope, flagged as an open question for Nicolas). **API discrepancy found, relevant to scope B/C:** verified against the actual `@base-ui/react` `.d.ts`/compiled source — `data-open`/`data-closed` land on `CollapsibleRoot` and `CollapsiblePanel`, but **not** on `CollapsibleTrigger`, which instead gets `data-panel-open` (present only when open, no `data-panel-closed` counterpart) plus `aria-expanded`/`aria-controls`. Any trigger styling (e.g. `ConstructionPanel`'s chevron) that assumed `data-[open]:`/`data-[closed]:` on the trigger needs `data-[panel-open]:` instead, or a different mechanism. No git commands run.

- [x] **Scope A** (done 2026-09-21, `nextjs-engineer`, spawned `tester`) — `Collapsible.tsx`/`Collapsible.spec.cy.tsx` (`src/components/ui/`): three flat exports (`CollapsibleRoot`/`CollapsibleTrigger`/`CollapsiblePanel`), each a near-pure passthrough around `@base-ui/react/collapsible`'s `Root`/`Trigger`/`Panel` — no default className, no hardcoded trigger/panel content, no domain props (props typed as plain `ComponentPropsWithoutRef<typeof BaseCollapsible.X>`, no `Omit<..., 'children'>` needed since nothing replaces `children`). No `cva()` — zero variant axis, more minimal even than PR 3/4/5's single-treatment exception. No i18n strings — component owns no user-facing copy of its own.
  - **Real-API fact worth flagging, differs from the handoff doc's wording:** verified against `node_modules/@base-ui/react/collapsible/{root,trigger,panel}/*.d.ts` and the compiled `.js` sources — `data-open`/`data-closed` land on `CollapsibleRoot` and `CollapsiblePanel`, but **not** on `CollapsibleTrigger`. The trigger instead gets `data-panel-open` (empty-string, open only, nothing when closed); its reliable state signals are `aria-expanded`/`aria-controls`. Scope B/C's trigger styling (`ConstructionPanel`'s toggle, `TagFilterDrawer`'s toggle) will need `data-[panel-open]:` rather than `data-[open]:` if styling the trigger element itself off Collapsible's own state attributes — worth confirming with Nicolas before scope B lands.
  - **Not surfaced on `/lab/design-system` in this scope**, per the handoff doc — internal building block only. Flagging per the doc's own instruction: if Nicolas wants it documented as an atom in its own right (alongside `Button`/`Checkbox`/`Radio`/`Field`), that's a follow-up scope decision, not assumed here.
  - `tester`: green on first pass, 0 fixes, 11/11 CT specs incl. 2 axe checks (closed + open). Full CT suite re-run by `tester` alongside it: 467/467 passing, no regressions. `pnpm exec tsc --noEmit` clean. `pnpm validate` (content schema + Mermaid) green. `graphify query` run before reading `Checkbox.tsx`/`Radio.tsx`/`Field.tsx`; `graphify update .` run after writing both files. No git commands run — **not yet committed, awaiting review.** Does not touch `ConstructionPanel.tsx`/`TagFilterDrawer.tsx` — scope B/C unaffected, stop-between-scopes rule applies before either starts.

**2026-09-21 — Go-ahead given, scope B (`ConstructionPanel` internals refactor) starting.** Nicolas confirmed to proceed and investigate the `data-open`/`data-panel-open` discrepancy's actual impact during this scope.

**2026-09-21 — Scope B complete, awaiting review.** Investigated the `data-panel-open` discrepancy's impact: none — `ConstructionPanel`'s chevron never relied on trigger CSS data-attributes (plain JS-state ternary), so it was a non-issue for this scope. See the full scope B entry below for the `render`-prop-vs-direct-className judgment call. **Stop-between-scopes rule applies — do not start scope C (`TagFilterDrawer` retrofit) without a fresh explicit go-ahead from Nicolas.**

**2026-09-21 — Scope B (`ConstructionPanel` internals refactor) complete.** `src/components/ui/ConstructionPanel.tsx` rewritten to compose `CollapsibleRoot`/`CollapsibleTrigger`/`CollapsiblePanel` internally; `useId()` dropped (Base UI generates and links the panel id itself). Public props (`toggleLabel`, `closedHint`, `defaultOpen`, `children`, `className`) and every `data-testid` are byte-for-byte unchanged — verified both call sites (`design-system/page.tsx` L253, `molecules/page.tsx` L358/372) needed zero edits via `tsc --noEmit` passing clean with no changes to either file, and confirmed `molecules/page.tsx`'s `CONSTRUCTION_PANEL_PROPS` doc table (L122) needed no edit since the API surface didn't move.

- **Scope A's `data-panel-open`-not-`data-open` discrepancy on `CollapsibleTrigger` did not block this scope**, as scope A already anticipated: `ConstructionPanel`'s chevron (`{open ? '▴' : '▾'}`) stays a plain JS-state ternary rendered as `CollapsibleTrigger`'s children, not a `data-[open]:`/`data-[panel-open]:` CSS selector, so the attribute's absence is irrelevant here. `open` is tracked via a local `useState` fed by `CollapsibleRoot`'s `onOpenChange` (Root stays uncontrolled — only `defaultOpen` is passed in, `open` is never passed back — so this is observation, not control).
- **Judgment call, flagged:** the old trigger was the `Button` atom (`variant="text-action"`) with manually-set `aria-expanded`/`aria-controls`. `CollapsibleTrigger` renders its own `<button>`, so nesting `Button`'s `<button>` inside it would be invalid HTML (nested interactive elements, an axe violation). Composing `Button` via Base UI's `render` prop was considered instead, but `Button` (`src/components/ui/Button.tsx`) is a plain function component, not `forwardRef` — Base UI's prop-merge machinery expects a ref-forwarding target, and a `graphify query` confirmed no component in this codebase uses the `render`-prop composition pattern yet, so there was no in-repo precedent to follow either way. Chose instead to drop `Button` entirely from `ConstructionPanel` and apply the `text-action` variant's exact Tailwind classes directly to `CollapsibleTrigger`'s `className`, matching the codebase's established convention of styling Base UI parts directly (`Checkbox`/`Radio`/`Field` all do this rather than wrapping another atom). Visual output is unchanged but the class list is now duplicated between `Button.tsx` and `ConstructionPanel.tsx` rather than shared — flagged as a maintenance hazard if `Button`'s `text-action` variant changes in the future; worth deciding whether `Button.tsx` should export `buttonVariants` (or gain `forwardRef`) so this can be de-duplicated, but that's a change to `Button.tsx` itself, out of this scope's remit.
- Panel stays hard mount/unmount (`keepMounted` not passed) — matches the pre-refactor behaviour and the scope's explicit instruction not to assume `keepMounted` is wanted here (that's scope C's requirement for the drawer's state-preservation need, not this one).
- `role="region"`/`aria-label={toggleLabel}` stayed caller-supplied directly on `CollapsiblePanel` in `ConstructionPanel.tsx`, not moved into the `Collapsible` atom, per the confirmed decision in the handoff doc.
- `ConstructionPanel.spec.cy.tsx` needed **zero changes** — all 11 assertions (rendering, interaction, prop forwarding, 2 axe checks) target behaviour (`aria-expanded` values, panel presence/absence, click interactions, `aria-controls` linking to whatever id the panel ends up with) rather than internals, so they passed unmodified against the new DOM structure.
- `tester`: green on first pass, 0 fixes needed, 11/11 CT specs incl. 2 axe checks (closed + open). Full Cypress CT suite re-run: **467/467 passing, 0 regressions.** `pnpm exec tsc --noEmit` clean (no changes needed to either call-site file). `pnpm validate` (content schema + Mermaid) green. `graphify query` run before reading `ConstructionPanel.tsx`/`Collapsible.tsx`/`Checkbox.tsx` and before reading the Base UI `.d.ts` internals; `graphify update .` run after the edit landed. No git commands run — **not yet committed, awaiting review.** Does not touch `Collapsible.tsx`/`Collapsible.spec.cy.tsx` (scope A) or `TagFilterDrawer.tsx` (scope C) — stop-between-scopes rule applies before scope C starts.

**2026-09-26 — Scope D (`ConstructionPanel` API extension) go-ahead given and complete.** Full detail in `.docs/tasks/2026-09-26-construction-panel-reuse-retrofit.md` — Nicolas reviewed the branch and required (1) `ConstructionPanel`/`TagFilterDrawer` to share the same Base-UI-driven collapse component, (2) the same expand-box styling, (3) `ConstructionPanel` to be the reusable molecule with `TagFilterDrawer` consuming it, which needs a custom-trigger extension.

- [x] **Scope D** (done 2026-09-26, `nextjs-engineer`, spawned `tester`) — `ConstructionPanel` API extension. `ConstructionPanelProps` gains three optional fields: `trigger?: (state: { open: boolean }) => ReactNode`, `open?: boolean`, `onOpenChange?: (open: boolean) => void`. Existing `toggleLabel`/`closedHint`/`defaultOpen`/`children`/`className` stay valid; both real call sites (`design-system/page.tsx`, `molecules/page.tsx`) needed **zero edits**, verified via `tsc --noEmit` clean with no changes to either file.
  - **Trigger composition judgment call** (flagged as relevant to scope E, per the handoff doc's own instruction): read `node_modules/@base-ui/react/collapsible/trigger/CollapsibleTrigger.d.ts` — confirmed `CollapsibleTrigger` renders a real `<button>` with `aria-expanded`/`aria-controls` wiring baked in, nothing that composes with a plain wrapper `<div>`. Chose the **"trigger replaces the entire toggle-row `<div>`" composition**, not "trigger becomes `CollapsibleTrigger`'s children": `ConstructionPanel` renders `trigger({ open })` directly as `CollapsibleRoot`'s child when supplied, with no wrapping element of its own. The caller's returned JSX is responsible for including its own `CollapsibleTrigger` (imported from `./Collapsible`) as the actual clickable/keyboard-reachable element, alongside any sibling content (e.g. `TagFilterDrawer`'s active-chips zone) outside it. This was necessary because the alternative (`trigger`'s return becoming `CollapsibleTrigger`'s children) cannot express sibling content living outside the clickable trigger — exactly `TagFilterDrawer`'s shape. New CT cases cover both: a custom trigger fully replacing the default row, and sibling content (a `data-testid="sibling-zone"` span) rendered alongside the trigger but outside it.
  - **`open`/`onOpenChange` composition:** Base UI's `CollapsibleRoot` natively supports controlled (`open`) _and_ uncontrolled (`defaultOpen`) modes — verified via `CollapsibleRoot.d.ts`/`useCollapsibleRoot.d.ts`. `ConstructionPanel` now computes `open = openProp ?? internalOpen` (internal `useState` seeded by `defaultOpen`, exactly as before) and forwards `open={openProp}` (undefined when uncontrolled, identical behaviour to the prior code which never passed `open` at all) plus a `handleOpenChange` that updates `internalOpen` and calls the caller's `onOpenChange` unconditionally — harmless when controlled since `internalOpen` is then dead state.
  - **className target changed, intentionally — flagged as a real behavior change, not a bug:** the doc's instruction ("`CollapsiblePanel`'s className changes from a single hardcoded string to `cn(baseBoxClasses, className)`... Callers extend or override at specific breakpoints via their own className") only makes sense if the caller's `className` now targets the **panel body/box**, not the root wrapper — confirmed against scope E's own stated need (`TagFilterDrawer`'s mobile `max-sm:fixed max-sm:inset-0 …` overrides must hit the box, not the whole row including the trigger/chips, which must stay in normal flow on mobile). Since neither real call site passes `className` today, this needed zero call-site edits, but it did require rewriting the pre-existing CT case "merges additional className onto the root element" (now targets `construction-panel-body`, opened via `defaultOpen` first since the panel is hard mount/unmount) — flagged here since it's a deliberate spec change, not drift. `molecules/page.tsx`'s `CONSTRUCTION_PANEL_PROPS` `className` row's `notes` updated to match ("Merged onto the panel body via cn(), alongside the shared box styling").
  - `baseBoxClasses` extracted as a module-level constant (`mt-md border-t-heavy border-r-medium …` — byte-identical to the prior hardcoded string).
  - `ConstructionPanel.spec.cy.tsx`: 6 new cases added (custom trigger replaces default row, custom trigger stays keyboard-reachable and toggles the panel, sibling content outside the clickable trigger, controlled `open` reflects an externally-owned prop into the DOM, `onOpenChange` fires on trigger click while the `open` prop stays authoritative, axe-clean with a custom trigger supplied and the panel open) plus the 1 rewritten case above. 17/17 passing.
  - `tester`: green on first pass, 0 fixes needed, 17/17 CT specs incl. 3 axe checks. Full CT suite re-run: **473/473 passing, 0 regressions** (467 prior + 6 new ConstructionPanel cases). `pnpm exec tsc --noEmit` clean, no changes to either call-site file. `pnpm validate` (content schema + Mermaid) green. `graphify query` run before reading `ConstructionPanel.tsx`/`Collapsible.tsx`/`TagFilterDrawer.tsx`/the two call sites and before reading the Base UI `.d.ts` internals; `graphify update .` run after edits landed (1862 nodes, 2745 edges). No git commands run — **not yet committed, awaiting review.** Does not touch `TagFilterDrawer.tsx` — stop-between-scopes rule applies before scope E starts.

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
