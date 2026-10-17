---
title: Critique — Ghost Line contrast misuse & atom/molecule affordance
date: 2026-09-14
status: findings — no code changed
scope: color-ink-ghost text usage; Button/Checkbox/Radio/Field atom system; TagFilterDrawer container feedback
reviewed_against: CONTEXT.md, PRODUCT.md, DESIGN.md, ADR 004, ADR 007, ADR 009, .claude/rules/tailwind.md, .claude/rules/accessibility.md
inputs: src/styles/tokens/colors.css, src/components/ui/TagFilterDrawer.tsx, src/components/ui/FilterInput.tsx, src/app/lab/design-system/** (atoms, molecules, colors pages), .docs/design/comps/lab-design-system-comp-v1.html
---

# Critique session — 2026-09-14

Planning document only. No source files were modified as part of this review; no commits or branches were created. Findings below are for a follow-up implementation pass.

---

## Finding 1 — `--color-ink-ghost` is misused as a text colour, and the misuse is systemic

### Confirmed: the design system already says this is wrong

DESIGN.md defines the neutral ramp explicitly:

> **Ghost Line** (`#c8c4bc`): Tertiary grid lines, dividers, construction guides.

Not text. `.claude/rules/tailwind.md` reinforces that the palette is a closed set of five colours (`ground · ink · ink-secondary · ink-ghost · active`) — the fix here must reassign existing tokens correctly, not invent a sixth.

### The numbers

Computed per WCAG 2.1 relative-luminance formula, against the page ground (`#f8f4ed`):

| Foreground              | Hex       | Contrast vs. `ground` | AA normal text (4.5:1)    | AA large text / UI boundary (3:1) |
| ----------------------- | --------- | --------------------- | ------------------------- | --------------------------------- |
| `--color-ink`           | `#2a2a2a` | 16.4:1                | ✅                        | ✅                                |
| `--color-ink-secondary` | `#6b6b6b` | **4.86:1**            | ✅ (barely — no headroom) | ✅                                |
| `--color-ink-ghost`     | `#c8c4bc` | **1.58:1**            | ❌ fails by 2.8×          | ❌ fails                          |

The 1.58:1 figure already exists as a code comment in `src/styles/tokens/colors.css:14` (`/* WCGAG 1.58, failed. proposed alternative #6e6e6e */`), misplaced directly above the `--primitive-graphite-low` (ink-ghost) declaration — so this was already known and never resolved. Two problems with leaving it as-is:

1. It's an inline TODO left in source, which this project's own convention forbids (deferred work belongs in `.local/content-issues.md`, not a code comment) — remove it once the real fix lands below.
2. The "proposed alternative #6e6e6e" is a red herring: that value is almost identical to `ink-secondary` (`#6b6b6b`). Reassigning ink-ghost to `#6e6e6e` doesn't fix a third tier — it just duplicates the second tier under a different name. The palette is deliberately five colours; the fix is disciplined reassignment of misused call sites to the _existing_ `ink-secondary` (or `ink` where the content matters more), not a new primitive.

### Important nuance: contrast is a foreground/background pair, not a token property

`ink-ghost` isn't universally illegal — it depends what it's composited against:

- **On `ground`/`ground-warm`/`ground-alt`** (the common case — 1.58:1) → fails.
- **On `ink`** (`#2a2a2a`, dark) → `TagFilterDrawer.tsx:81` puts the badge count in `text-ink-ghost` on a selected chip's `bg-ink` background → **8.25:1, passes easily.** This one usage is correct and should stay as-is.

So the rule to write down is not "never use ink-ghost for text" — it's **"ink-ghost text is only legal on the `ink` background; never on `ground`/`ground-warm`/`ground-alt`."**

### This is not confined to TagFilterDrawer — it's used as text in ~20 files

A repo-wide scan for `text-ink-ghost` (excluding spec files) found 60+ call sites across 20 files. Breaking them down:

**A — Decorative, `aria-hidden="true"`, no informative content (exempt, no action):**
`engineering/page.tsx:26`, `lab/adr/page.tsx:41,45`, `design-system/layout.tsx:19,23`, `lab/page.tsx:18`, `research/page.tsx:26`, `Breadcrumb.tsx:37`, `atoms/page.tsx:46,50`, `design-system/page.tsx:156,160`, `TagFilterDrawer.tsx:247,263` (the "·" separators between view-mode tabs), `FilterInput.tsx:46` (search glyph).

**B — Real, informative text on `ground` — WCAG 1.4.3 violations, needs promotion (to `ink-secondary`, or `ink` where it's primary content):**

- `not-found.tsx:8` — the **404** page number itself
- `RestrictedBlock.tsx:18` — the "restricted" heading text
- `ProjectNav.tsx:63` — the position name under project nav
- `design-system/page.tsx:82` — swatch **hex values** (the one thing that page exists to show legibly)
- `design-system/page.tsx:104,110,116,122,128,153,167,175,197,209` — type-role and component-name labels
- `atoms/page.tsx:41,61,73,110,114,118,122,142,154,167,208,217,225` — every specimen caption and state label on the atoms page (ironic: the design-system documentation page is itself the worst offender)
- `molecules/_components/PropsTable.tsx:47` — default-value cells in the props table
- `typography/page.tsx:106,112`; `lab/page.tsx:50,57,60,78` (incl. link text on `NavLink` for Colors/Typography); `AdrIndexClient.tsx:130` (a real link label); `AdrRegisterHeader.tsx:76,82`; `InsightCalloutStrip.tsx:58`; `page.tsx:61,74` (homepage timeline span); `projects/[slug]/page.tsx:210`; `ClassificationHeader.tsx:46,58`; `SpecimenIllustration.tsx:54,57`; `TaxonomyPanel.tsx:49,119,131,147`; `EraColumn.tsx:138` (tabular year labels); `engineering/page.tsx:36`, `research/page.tsx:36`.

**C — Disabled controls** (`TagFilterDrawer.tsx:254,270`, the "By category"/"By status" placeholder tabs): WCAG 1.4.3 formally exempts inactive UI components, but `.claude/rules/accessibility.md`'s own hard rule requires any axe exclusion to carry "a code comment citing the specific reason." Currently there's no such comment — this needs one either way, whether or not the colour changes.

**D — Placeholder text** (`FilterInput.tsx:56`, `placeholder:text-ink-ghost`): placeholder text is visible instructional content and should be held to the same bar as label B — promote to `ink-secondary`.

**E — Safe as-is** (`TagFilterDrawer.tsx:81` — ghost-on-`ink`, 8.25:1).

### Cross-cutting: the same failure also breaks non-text (border) contrast, and that's half of Finding 2

`ink-ghost` is also the default **border** colour for interactive elements — not just decoration:

- `FilterInput`'s `filter-input` utility: `border-color: var(--color-ink-ghost)` at rest — this is the _entire_ visual boundary of a text input.
- `TagFilterDrawer` unselected tag chips: `border-ghost border-ink-ghost` — the _entire_ rest-state boundary of a clickable chip.

WCAG 1.4.11 (Non-text Contrast) requires 3:1 for a border that is the sole way of identifying a UI component's boundary. At 1.58:1, these fail that too. This is not a separate bug from Finding 2 below — it's the same token failure showing up as "the input and the chips look flat," because the border meant to give them shape is nearly invisible against the cream ground. Fixing the token misuse and fixing the affordance problem are the same fix at the border level.

(Static, non-interactive documentation framing — `NamedRuleCard`'s `border-medium border-ink-ghost`, `MoleculeFrame`'s `border-b-medium border-ink-ghost` — is lower risk: 1.4.11 targets UI components and meaningful graphical objects, not decorative content dividers, so these read as acceptable "construction guide" framing per DESIGN.md's own definition. Not a required fix, but worth a second look once the interactive cases are settled.)

### Recommendation

1. Amend the `ink-ghost` documentation (DESIGN.md colour entry + the `colors.css` comment) to state the rule precisely: _ink-ghost is for borders/dividers/decorative aria-hidden marks on any ground, and for text only when composited on the `ink` background. It is never a text or meaningful-border colour on `ground`/`ground-warm`/`ground-alt`._
2. Reclassify every location in bucket **B** and **D** above to `ink-secondary` (default) or `ink` (where the content is primary, e.g. the 404 number, hex values, the swatch page).
3. Give bucket **C** (disabled tabs) a documented axe-exception comment per `accessibility.md`, independent of the colour question.
4. Promote the two interactive borders (`filter-input` utility, tag-chip rest state) to `ink-secondary` at minimum — this doubles as the first concrete step of Finding 2, since it's what currently makes both controls look inert.
5. Remove the stale inline comment in `colors.css:14` once resolved; do not leave a new one in its place.
6. Re-run `/lab/design-system/colors` and `/lab/design-system/atoms` through axe after the change — the atoms page currently would not catch this today because none of its own specimens are exercised by `cy.checkA11y()` beyond default component state (see Finding 2 test-coverage note).

No new token is needed. This is a reassignment problem, not a palette problem.

---

## Finding 2 — There is no atom-level interaction system, and the binding architecture decision to build one hasn't started

### The scope is bigger than "TagFilterDrawer needs better buttons"

PRODUCT.md's Component architecture section is **binding**, not aspirational:

> **Base UI** — headless, unstyled component primitives for all interactive elements (Button, Menu, Dialog, Select, etc.); ensures accessibility compliance without fighting a pre-styled system... **Strong component model** — variants defined via CVA or equivalent; never hard-coded Tailwind classnames inline; every interactive element is a named component with explicit variant props.

Checked against the actual repo:

- `@base-ui/react@^1.8.0` **is installed** (`package.json`) — but a repo-wide search finds **zero imports of it anywhere in `src/`**. It has been a dependency with no adoption.
- No `class-variance-authority` (or equivalent variant library) is installed. `clsx` + `tailwind-merge` back the `cn()` helper, but variants today are hand-written `isSelected ? 'a' : 'b'` ternaries repeated per component (`TagFilterDrawer.tsx:70-73`, `:142-143`, etc.) — exactly the "hard-coded Tailwind classnames inline" pattern the decision says to avoid.
- Every interactive primitive that exists (`FilterInput`, the buttons inside `TagFilterDrawer`) is a raw `<input>`/`<button>` with local, one-off state styling. There is no shared `Button`, `Checkbox`, `Radio`, `Field`, or `Fieldset` component anywhere in `src/components/ui/`.
- ADR 009 (Three-Layer Design Token Architecture, status `proposed`/Open, dated 2026-09-01) still lists _"Whether to adopt `@base-ui/react` or another headless component library"_ as an **unresolved constraint** — this directly contradicts PRODUCT.md's later, binding language. The ADR needs to be reconciled (updated to reference the PRODUCT.md decision and marked accepted, or formally superseded) as part of — or just before — this work, otherwise the two documents keep disagreeing with each other.

So this finding isn't "polish the drawer's buttons." It's: **a load-bearing architectural decision was made, the dependency was installed, and then the actual component layer was built by hand anyway, bypassing it.** Every hand-rolled interactive element built since (TagFilterDrawer's five different button treatments, FilterInput) is now debt against that decision.

### What "no affordance" looks like concretely, in TagFilterDrawer

Walking the file against DESIGN.md's own vocabulary:

| Element                             | Current treatment                                                                 | Problem                                                                                                                                                                                                                                                   |
| ----------------------------------- | --------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `TAGS` toggle (`:133-160`)          | Text + `label` colour + bottom border that only appears when open                 | No boundary at rest at all — reads as a text label, not a control, until you've already activated it                                                                                                                                                      |
| Tag chips (`:61-88`)                | `border-ghost border-ink-ghost` at rest, border/bg-fill only on select or hover   | Rest-state border is the failing 1.58:1 token (Finding 1) — functionally invisible; only feedback is hover, nothing communicates "this is clickable" beforehand                                                                                           |
| View-mode tabs (`:237-277`)         | No border, no fill, ever — not even the `aria-current="true"` active tab          | Weakest case in the file: a 3-way segmented control with zero visual grouping or selected-state distinction; "By category"/"By status" being disabled is only conveyed by `cursor-not-allowed` and opacity, not a state pattern shared with anything else |
| NONE / CLOSE actions (`:283-309`)   | Plain text, hover-underline only                                                  | Acceptable _if_ "text action" is a named, deliberate tertiary-button convention — right now it isn't named anywhere, so it can't be told apart from an oversight                                                                                          |
| Drawer panel container (`:210-219`) | `border-b-medium border-ink` on desktop; no left/right/top edge; `bg-transparent` | On desktop, the "container" is a single ruled line under the header — the expanded region has no visual boundary distinguishing it from ordinary page flow. This is exactly the "no visual feedback for the container" complaint.                         |

### The constraint that shapes the fix: no shadows, ever

DESIGN.md's Flat-by-Construction Rule is explicit and absolute:

> No shadows. Depth is conveyed by line weight... and by the single Compass-Arc Red marking the foreground element. A shadow here would be a smudge on the drawing.

So the drawer-container fix cannot reach for `box-shadow` / elevation layers — the only legal tools are: border-weight escalation (`border-ghost` → `border-medium` → `border-heavy`), tonal fill (`bg-ground-warm` / `bg-ground-alt` against `bg-ground`), and the existing line-weight token scale (`--line-ghost/medium/heavy`). There's already an internal precedent to build from: `MoleculeFrame.tsx` frames a content block with `border-t-heavy border-ink` + `border-b-medium border-ink-ghost`, and `NamedRuleCard.tsx` gives a static card a full `border-medium` edge. Neither is a shadow. The drawer panel needs the same treatment applied to a _dynamic, interactive_ container, at proper (non-failing) contrast.

### There's no named rule for interaction state at all

DESIGN.md has three named rules (One Red, No-Decoration, Flat-by-Construction) governing colour, decoration, and depth. It has **no equivalent rule for interactive state** — rest / hover / focus / active / selected / disabled. Every component that has states today (`FilterInput`'s `filter-input` utility, `NavLink`'s hover/current logic, `TagFilterDrawer`'s five different button treatments) invented its own answer independently. That's why the drawer's controls all feel different from each other as well as under-specified individually. A fourth named rule is the actual fix that prevents this from recurring on the next component — the Button/Checkbox/Radio/Field system is the first place to define it, not TagFilterDrawer in isolation.

### Recommendation — this is a surface, not a patch

Given the scope (a genuine architectural gap: unused binding dependency + no variant system + no state vocabulary + five specimen atoms requested: Button, Checkbox, Radio, RadioGroup, Field/Fieldset), this should go through `/impeccable` as its own surface rather than being fixed inline inside TagFilterDrawer or bolted onto the existing `/lab/design-system/atoms` page in passing.

Note also that `/lab/design-system/atoms` and `/lab/design-system/molecules` currently have **no surface brief** in `.impeccable/surfaces/` at all (only the top-level `/lab/design-system` index page does, and its `related_targets` list doesn't include them) — they were built without going through the direction-contract step. That's consistent with what we're seeing: components assembled ad hoc, page by page, with no governing decision about state or containment. Bringing this under `/impeccable` fixes the process gap, not just the visual one.

Proposed surface would need to resolve, in order:

1. **ADR 009 reconciliation** — accept/update it to match PRODUCT.md's binding Base UI decision (adr-skill, separately from this doc).
2. **A fourth named DESIGN.md rule** for interaction state (rest/hover/focus/active/selected/disabled), expressed in the existing token vocabulary (ink / ink-secondary / active, border-ghost/medium/heavy) — no shadows, no new colours.
3. **A container/containment vocabulary** for dynamic surfaces (drawers, panels) built from border-weight + tonal fill, generalising the `MoleculeFrame`/`NamedRuleCard` precedent to an _interactive_ region.
4. **The atom set itself**, in this order (matches where Base UI's headless primitives earn their keep — a plain `<button>` has no hidden state machine, so it doesn't need wrapping; checkbox/radio/field genuinely do):
   - `Button` (native `<button>` + a variant contract — primary/secondary/text-action, matching the NONE/CLOSE precedent named properly this time)
   - `Checkbox`, `Radio` / `RadioGroup` (via `@base-ui/react`)
   - `Field` / `Fieldset` (via `@base-ui/react`) — label/description/error wiring, used to group the above
   - A variant mechanism decision (adopt `class-variance-authority`, or formally document the `cn()`-ternary pattern as the accepted "or equivalent") — open question to settle at surface-brief time, not here.
5. **Retrofit** `TagFilterDrawer` and `FilterInput` onto the new atoms once they exist, including the container fix for the drawer panel.

Per the existing approval-gate convention on this project: once that surface's direction contract and comp are ready, stop and get explicit go-ahead before any engineering starts.

---

## Summary

| #   | Finding                                                                                                                                                                                                 | Fix category                                                                              | New surface needed?                                                             |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| 1   | `ink-ghost` used as text/interactive-border colour on `ground` — fails WCAG 1.4.3 (1.58:1 vs 4.5:1) and 1.4.11 in ~20 files, confirmed by the codebase's own dormant contrast comment                   | Token-usage cleanup + one doc clarification; no new token                                 | No — direct fix, scoped to existing files                                       |
| 2   | No Button/Checkbox/Radio/Field atom system; `@base-ui/react` installed but unused; no CVA/variant contract; no named interaction-state rule; TagFilterDrawer's drawer panel has no container definition | Architectural — reconcile ADR 009, add a 4th DESIGN.md rule, build the atom set, retrofit | **Yes** — recommend a dedicated `/impeccable` surface before any implementation |

Both findings share a root cause worth naming: `ink-ghost` is currently the _only_ tool being reached for whenever something needs to look "quiet" or "secondary," for text, for borders, and for state — and it is contrast-illegal for nearly all of those jobs. Finding 2's new state rule should make `ink-secondary` (not `ink-ghost`) the default answer for "quiet but legible," reserving `ink-ghost` strictly for what DESIGN.md already says it's for: grid lines, dividers, construction guides.
