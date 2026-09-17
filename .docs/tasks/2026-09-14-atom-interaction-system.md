---
date: 2026-09-14
tracker: .docs/tasks/TRACKER.md
epic: epic/design-compass-app
status: ready-for-engineering
agent: nextjs-engineer
---

# Engineering handoff — Atom/interaction design system

## Read this first

This is a **handoff document for an engineering agent** (`nextjs-engineer` or equivalent). Design work is finished and approved. Nothing in `src/` has been touched yet. Your job starts at "Step 0" below.

Before writing any code, read in this order:

1. This document, in full.
2. `.docs/design/2026-09-14-critique-ink-ghost-contrast-and-atom-affordance.md` — the critique that started this work (Findings 1 and 2).
3. `.impeccable/surfaces/src-app-lab-design-system-page-tsx.md` (v2) — the direction contract, including its addendum with the full state-token ladder.
4. The three approved comps (paths below) — these are the visual specification. Layout, spacing, and colour decisions come from the comps, not from prose in this document.
5. `ADR 009` (`.docs/adr/009-design-token-architecture.md`) — just reconciled, records the Base UI decision this work implements.
6. `DESIGN.md` — just updated with `## Interaction` (The Live Line Rule) and a Shapes clarification. Read the whole file, not just the diff, so the new rule reads in context.

## Why this exists

A critique session (2026-09-14) found that this portfolio's interactive elements — buttons, the tag-filter drawer, the search input — have no real affordance: flat rest states, no shared component, no design-system rule governing interaction state, and a load-bearing architecture decision (Base UI, `PRODUCT.md`'s binding "headless primitives for all interactive elements") sitting installed and unused. A design-director session then shaped, iterated, and got approval for a proper atom system addressing this. See the critique doc for full reasoning — do not re-derive it, it's already been done.

## What's already decided (do not re-litigate)

- **Visual spec**: three approved, immutable comps:
  - `.docs/design/comps/lab-design-system-comp-v2.html` — governs `/lab/design-system` (index): the fourth Named Rule card (Live Line Rule) plus new preview rows in the existing Atoms and Molecules preview strips.
  - `.docs/design/comps/lab-design-system-atoms-comp-v1.html` — governs `/lab/design-system/atoms`: Button (Primary/Secondary/Text-action), Checkbox, Radio/RadioGroup (circular), Field/Fieldset, each across every state.
  - `.docs/design/comps/lab-design-system-molecules-comp-v1.html` — governs `/lab/design-system/molecules`: the "Construction Panel" containment pattern for dynamic/interactive regions.
  - `lab-design-system-comp-v1.html` is superseded by v2 — do not use it as a reference for the index page.
- **The Live Line Rule** (now in `DESIGN.md` under `## Interaction`) is the state-token ladder for every interactive element:
  - Rest → `ink-secondary`, `border-medium` (never `ink-ghost` — it fails contrast as a resting boundary)
  - Hover → `ink`, `border-medium`
  - Active/pressed → `border-heavy`
  - Selected → solid `ink` fill
  - Disabled → `ink-ghost` (the one legitimate resting use of it)
  - Focus → the existing global `:focus-visible` ring only (`src/styles/base/reset.css`) — **never redefine focus-visible per component**, that's an existing hard rule in `.claude/rules/tailwind.md` and `FilterInput`'s current `filter-input` utility already violates it (see Known Issue below).
- **Radio is circular**, not square — this was tried both ways during shaping; square read as counter-intuitive. `DESIGN.md`'s Compass Grammar now has an explicit, narrow exception for this (circular radio dots only, nothing else).
- **Field error state does not use red.** The One Red Rule budget on this surface is already spent by the active breadcrumb segment. Errors are signalled by `border-heavy` + a small ink-filled, sharp-cornered badge containing an **inline SVG** glyph (not a text character — must not be selectable/copyable), glyph colour `ground` on an `ink` fill. This is very likely the **first inline-SVG icon in this design system** — everything else so far (`→`, `▾`, `▴`, `·`, `/`) is a plain monospace text glyph. Flagged as an open convention question in the surface brief: decide now (inline SVG per component vs. a shared icon component/sprite) since the next icon needed will otherwise repeat whatever gets chosen here ad hoc.
- **Component split**: Base UI (`@base-ui/react`, already installed, `^1.8.0`) for `Checkbox`, `Radio`/`RadioGroup`, `Field`/`Fieldset` — these have real hidden ARIA state machines, which is where a headless primitive earns its keep. **Button does not wrap Base UI** — a plain `<button>` plus a variant contract is sufficient; there's no hidden state to manage. This split is now recorded in ADR 009's Verification checklist — treat a `Button` that imports `@base-ui/react` as a review flag.

## Open decision — resolve before or during PR 2

**Variant mechanism.** `PRODUCT.md` requires "variants defined via CVA or equivalent." No variant library is installed today (`clsx` + `tailwind-merge` back `cn()`; variants are currently hand-written ternaries per component). You need to decide: add `class-variance-authority` as a new dependency, or formally adopt the existing `cn()`-ternary pattern as the accepted "or equivalent" and document it somewhere durable (e.g. `.claude/rules/components.md`).

**This is an ADR trigger** per `adr-skill`'s own rules ("introducing a new dependency that doesn't already exist in the project"). If you choose to add CVA, stop and propose an ADR before writing the Button variant code — don't silently add the dependency. If you choose to keep `cn()`-ternaries, that's a smaller decision but still worth a one-paragraph note in the PR description explaining the choice, since the next atom (and the next engineer) will copy whatever pattern you set here.

## Known discrepancy — read before trusting `TRACKER.md`

`.docs/tasks/TRACKER.md`'s "Track H — Design System Atomic Refactor" lists `H0 — Immediate refactor ✓ COMPLETE`, claiming `src/components/ui/LabButton.tsx` (a Base UI–backed Button), `LabTag.tsx`, and a decomposed `RegisterTable/` directory already exist. **They do not** — verified via the graphify index and direct file lookups on 2026-09-14: none of `LabButton.tsx`, `LabTag.tsx`, or `RegisterTable/` exist anywhere in `src/`. Only `AdrRegisterTable.tsx` (a single undecomposed file) exists. This tracker section describes a prior implementation that predates the "reset to clean slate" this project went through — it's stale, not current.

**Do not build on the assumption that `LabButton` exists.** You are building the first real `Button` atom, not extending one. Flag `TRACKER.md`'s Track H section to Nicolas for correction/archival — don't silently rewrite someone else's tracker, just don't trust it either.

Separately, `TRACKER.md` already has a tracked item **P-FIX-3** describing the exact same `ink-ghost` contrast bug as Finding 1 of the critique doc, but scoped to a single file (`TypeSpecimen.tsx`). The critique doc's Finding 1 supersedes it with a full site-wide audit (~35+ locations across ~20 files, with a verdict per location). When you do the Finding 1 sweep (PR 1 below), close out P-FIX-3 by reference rather than treating it as a separate task.

## PR sequence

One concern per PR, per your own standing convention. Suggested order — adjust if you find a dependency I didn't account for, but don't collapse PRs together just for convenience.

### PR 0 — commit the already-approved doc changes (no code)

`DESIGN.md` and `.docs/adr/009-design-token-architecture.md` were already edited directly in the working tree during the design/reconciliation session (not on a branch, not committed). Branch, commit, and PR these as a standalone `docs/` change before any code PR — they're the spec the rest of this work implements, and should land first and independently.

- Branch: `docs/live-line-rule-and-adr-009`
- Files: `DESIGN.md`, `.docs/adr/009-design-token-architecture.md`
- No tests needed (docs-only), but run `pnpm validate` anyway since it's cheap and catches accidental Markdown/Mermaid breakage.

### PR 1 — sitewide `ink-ghost` contrast fix (Finding 1)

Independent of the atom system — purely a token-usage correction, can land in either order relative to PR 2+, but doing it first means new atoms aren't the only correct thing on the page.

- Follow the critique doc's bucketed location list exactly (buckets B, C, D — decorative bucket A is exempt, bucket E is already correct).
- Reassign real/informative text (bucket B) and placeholder text (bucket D) from `text-ink-ghost` to `text-ink-secondary` (or `text-ink` where the content is primary — the critique doc calls out specific cases like the 404 page number and swatch hex values).
- Add the required axe-exception code comment for the two disabled tabs in `TagFilterDrawer.tsx` (bucket C), per `.claude/rules/accessibility.md`'s own rule that exclusions need a cited reason.
- Also fix the two interactive rest-state borders called out in the critique's cross-cutting section: `FilterInput`'s `filter-input` utility (`src/styles/utilities/index.css`) and `TagFilterDrawer`'s unselected tag-chip border — promote both from `border-color: var(--color-ink-ghost)` to `var(--color-ink-secondary)`, since these are non-text (1.4.11) failures, not just text failures.
- Remove the stale inline comment at `src/styles/tokens/colors.css:14` once resolved.
- Re-run axe on `/lab/design-system/colors` and `/lab/design-system/atoms` afterward.
- Close `TRACKER.md` P-FIX-3 by reference (see Known Discrepancy above) — either in the PR description or as a tracker edit, your call.

### PR 2 — `Button` atom

- New file: `src/components/ui/Button.tsx` + `Button.spec.cy.tsx`.
- Plain `<button>`, not wrapped in Base UI (see Component split above).
- Three variants per the approved atoms comp: Primary (solid `ink` fill), Secondary (`border-medium` `ink-secondary`), Text-action (no border — this formally names the pattern `TagFilterDrawer`'s NONE/CLOSE buttons already use ad hoc).
- Resolve the CVA-vs-`cn()` open decision here (see above) before or as part of this PR.
- Update `/lab/design-system/atoms/page.tsx` with the Button section per the atoms comp (state matrix: rest/hover/focus-visible/active/disabled × 3 variants).
- Update `/lab/design-system/page.tsx` (index) Atoms preview strip per the v2 comp (one new row, Primary variant at rest).
- i18n: new strings under whatever namespace `atoms/page.tsx` already uses (`LabAtoms`) — check `messages/en.json` first.
- **Do not retrofit `TagFilterDrawer`'s existing buttons onto this yet** — that's a later PR (see Retrofit phase below), keep this PR to the new atom + its documentation page only.

### PR 3 — `Checkbox` and `Radio`/`RadioGroup` atoms

- New files: `src/components/ui/Checkbox.tsx`, `Radio.tsx` (or `RadioGroup.tsx` exporting both `Radio` and `RadioGroup`) + specs.
- Built on `@base-ui/react`'s `Checkbox` and `Radio`/`RadioGroup` primitives.
- Circular radio marker (confirmed decision — do not reintroduce the square option).
- State ladder per Live Line Rule; selected = solid `ink` fill (matches the existing selected-tag-chip precedent in `TagFilterDrawer.tsx:71`).
- Update `/lab/design-system/atoms/page.tsx` and the index preview strip per the comps.

### PR 4 — `Field`/`Fieldset` atoms

- New files: `src/components/ui/Field.tsx`, `Fieldset.tsx` + specs. Built on `@base-ui/react`'s `Field`/`Fieldset` (label/description/error wiring).
- Error state: `border-heavy` + the inline-SVG ink-filled badge described above. Resolve the icon-convention question here (inline SVG per component is the precedent set by this comp — decide whether to keep authoring it inline per component or extract a small shared icon component now, before a second icon shows up and the question gets answered by accretion instead of decision).
- Update atoms page + index preview strip.

### PR 5 — Construction Panel containment pattern

- Generalises `MoleculeFrame.tsx`/`NamedRuleCard.tsx`'s static border+fill framing (no shadows — `Flat-by-Construction` is absolute) into a treatment for a region that opens/closes.
- Add to `/lab/design-system/molecules/page.tsx` per the molecules comp, plus the index preview strip row.
- This PR delivers the _pattern_, documented and demonstrated on its own — not yet applied to `TagFilterDrawer`.

### Retrofit phase (separate PR(s), after PR 2–5 land)

- Apply the new `Button` atom to `TagFilterDrawer.tsx`'s five ad hoc button treatments (toggle, tag chips, view-mode tabs, NONE, CLOSE) and to `FilterInput`'s implicit button-like affordances where relevant.
- Apply the Construction Panel pattern to `TagFilterDrawer`'s drawer panel (`#tag-drawer`), which currently has no container definition beyond a single bottom rule on desktop — this is the concrete complaint that started Finding 2.
- Fix `FilterInput`'s `filter-input` utility redefining focus-visible locally (shifts to `active` red on `:focus-within` instead of relying on the global ring) — flagged during comp review, not fixed yet.
- This is deliberately its own phase/PR(s), not bundled into PR 2–5, so the new atoms ship and get reviewed on their own merits before the existing molecule is rewired onto them.

## Done criteria

Standard `nextjs-engineer` done criteria apply to every PR above (`pnpm validate` green, co-located tests, axe-clean, all strings in `messages/en.json`, PR with Summary/Changes/Testing). Additionally for this body of work specifically:

- [ ] No new component imports `@base-ui/react` for `Button` (review flag if it does)
- [ ] No new component redefines `:focus-visible` locally
- [ ] No new component introduces a colour outside the five-token palette, or a border-radius other than 0 (except the circular radio-dot exception)
- [ ] `ADR 009`'s Verification checklist items are checked off as each applicable PR lands
- [ ] `TRACKER.md`'s Track H section has been flagged to Nicolas (not silently corrected)
