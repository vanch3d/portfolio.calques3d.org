# Tailwind CSS & Token Architecture Review
**Date:** 2026-09-05
**Branch:** `refactor/applink-promotion-and-normalisation`
**Scope:** All new and modified components — exhaustive audit against DESIGN.md and Tailwind v4 semantics

---

## Executive Summary

The project states a three-tier token architecture (primitive → semantic → `@theme`) and Tailwind v4 as the delivery mechanism. In practice, only **two of ~seven token categories** are exposed to Tailwind. The remaining categories (type scale, spacing, leading, line weights, measure) are raw CSS custom properties inaccessible as Tailwind utilities. This forces every component to use `style` props for layout and typography, while using Tailwind classes for colour — an inconsistency that has compounded across every new surface.

On top of the structural gap, there are 12 specific anti-patterns in the live code. Several are pervasive across 8+ files.

**The code is not wrong, but it is incoherent.** DESIGN.md describes one system; the implementation implements two parallel systems with a third layer of magic numbers leaking from the seams.

---

## What the Architecture Claims

```
globals.css token hierarchy:
  Primitive tokens (:root)          → raw values, never used directly
  Semantic tokens (:root)           → meaning-bearing aliases
  @theme inline                     → exposes to Tailwind class generation
```

**What `@theme inline` actually exposes:**
- `--color-*` → `text-ink`, `bg-ground`, `text-ink-secondary`, `text-active`, etc. ✓
- `--font-*` → `font-display`, `font-body`, `font-label` ✓

**What is NOT in `@theme` (and therefore not usable as Tailwind utilities):**
- `--text-*` (type scale) — `var(--text-body)` cannot be `text-body` class
- `--leading-*` (line heights) — must be inline style
- `--space-*` (spacing scale) — `p-md`, `m-lg`, `gap-xl` don't exist
- `--line-*` (border weights) — must be inline style
- `--tracking-label` (letter spacing) — must be inline style
- `--measure-body` (measure/max-width) — must be inline style
- `--page-margin` (layout) — must be inline style

This architectural gap is the root cause of most problems below.

---

## Issue 1 — `var()` in `className` [CRITICAL — 8+ files]

**Rule:** Tailwind classes resolve to named utilities, not arbitrary CSS values. Using `var()` inside a class produces an arbitrary value (`[var(--x)]`) which is ineligible for tree-shaking, bypasses the design system, and cannot be merged by `cn()`.

**Occurrences:**

| File | Anti-pattern | Should be |
|---|---|---|
| `NavLink.tsx` | `hover:decoration-[var(--color-ink)]` | `hover:decoration-ink` |
| `LabButton.tsx` | `focus-visible:outline-[var(--color-active)]` | `focus-visible:outline-active` |
| `AdrRegisterTable.tsx` | `hover:decoration-[var(--color-ink)]`, `focus-visible:outline-[var(--color-active)]` | `hover:decoration-ink`, `focus-visible:outline-active` |
| `AdrDocument.tsx` | `hover:text-[var(--color-ink-secondary)]`, `focus-visible:outline-[var(--color-active)]` (×3) | `hover:text-ink-secondary`, `focus-visible:outline-active` |
| `InsightCalloutStrip.tsx` | `hover:text-[var(--color-ink-secondary)]`, `hover:text-[var(--color-ink)]`, `focus-visible:outline-[var(--color-active)]` | semantic classes |
| `InsightCalloutBlock.tsx` | `hover:text-[var(--color-ink)]`, `focus-visible:outline-[var(--color-active)]` | `hover:text-ink`, `focus-visible:outline-active` |
| `InsightDocument.tsx` | `hover:text-[var(--color-ink-secondary)]`, `hover:text-[var(--color-ink)]`, `focus-visible:outline-[var(--color-active)]` (×4) | semantic classes |
| `InsightsRegisterTable.tsx` | `hover:text-[var(--color-ink)]`, `hover:decoration-[var(--color-ink)]`, `focus-visible:outline-[var(--color-active)]` | semantic classes |

All four colours involved (`--color-ink`, `--color-ink-secondary`, `--color-active`, `--color-ink-ghost`) ARE in `@theme`. The arbitrary-value wrapper `[var(...)]` is unnecessary in every single case.

---

## Issue 2 — Custom Utilities Not Using `@utility` [HIGH — globals.css]

**Rule (Tailwind v4):** Custom utilities must be declared with `@utility`, not plain CSS class selectors. `@layer utilities { .x { } }` was removed in v4.

`globals.css` declares ten custom classes as plain CSS selectors:

```css
.label { ... }
.tabular { ... }
.active-mark { ... }
.rule-heavy-x { ... }
.register-row { ... }
.register-row-active { ... }
.title-italic { ... }
.register-table-container { ... }
.register-table { ... }
.register-body { ... }
```

These should all be `@utility label { ... }`, `@utility tabular { ... }`, etc.

**Impact:** Plain class selectors in `globals.css` work in practice (CSS still loads) but they are outside Tailwind's cascade layer, meaning specificity is unpredictable, they don't compose with variant modifiers (`hover:label`, `md:label`), and they won't be purged correctly by Tailwind's engine.

---

## Issue 3 — Hardcoded Off-Token Color [CRITICAL — design system violation]

Two components share an identical hardcoded background colour that does **not** exist in the token system:

```tsx
// InsightCalloutStrip.tsx:26 and InsightCalloutBlock.tsx:22
style={{ background: "#f4ede0" }}
```

The design system paper primitive is `#f8f4ed`. The value `#f4ede0` is a slightly darker warm cream that appears nowhere in `../../DESIGN.md`, nowhere in `:root`, nowhere in `@theme`. It is a raw colour value violating the "no raw colour in components" rule.

This is The No-Decoration Rule's structural cousin: **no colour that is not in the token system**.

---

## Issue 4 — Raw Border Widths [HIGH — line-weight system bypassed]

`globals.css` defines a line-weight hierarchy: `--line-heavy: 1.5px`, `--line-medium: 1px`, `--line-ghost: 0.5px`. These encode the graphite weight system from DESIGN.md.

In practice, components frequently bypass this:

```tsx
// InsightCalloutStrip.tsx, InsightCalloutBlock.tsx
border: "1px solid var(--color-ink-secondary)"
// → should be: "var(--line-medium) solid var(--color-ink-secondary)"

// InsightDocument.tsx, AdrDocument.tsx
border: "0.5px solid var(--color-ink-ghost)"
// → should be: "var(--line-ghost) solid var(--color-ink-ghost)"

borderTop: "0.5px solid var(--color-ink-ghost)"
// → should be: "var(--line-ghost) solid var(--color-ink-ghost)"
```

The line-weight system exists precisely so that changing `--line-ghost` from 0.5px to 0.75px propagates everywhere. Hardcoded `0.5px` breaks that contract.

Correct usage exists (e.g., `LabButton`, `LabTag`, some table cells, `RegisterTableHead`) — making the inconsistency more jarring, not less.

---

## Issue 5 — Type Scale Fragmentation [HIGH — 10 rogue font sizes]

DESIGN.md defines 5 type levels; `globals.css` exposes 5 `--text-*` tokens. The implementation uses approximately 10 additional hardcoded font sizes not in the scale:

| Found in components | Relation to token |
|---|---|
| `0.58rem` | Sub-label (label = 0.6875rem) |
| `0.6rem` | Sub-label |
| `0.62rem` | Sub-label |
| `0.65rem` | Sub-label |
| `0.875rem` | Between label and body |
| `0.9rem` | Between label and body |
| `1.35rem` | Between title (1.125–1.25rem) and headline (1.5–2rem) |
| `1.75rem` | Between title and headline |
| `2rem` | At headline floor |

The label utility (`--text-label: 0.6875rem`) is then immediately overridden with `fontSize: "0.58rem"` in at least 6 places — making it a font-family shorthand rather than a semantic token. A utility whose primary value is immediately overridden is not being used as a utility.

---

## Issue 6 — Leading Fragmentation [MEDIUM]

The token system defines four leading values. Components use three additional hardcoded ones:

- `lineHeight: 1.3` — not in system
- `lineHeight: 1.35` — not in system
- `lineHeight: 1.55` — not in system

---

## Issue 7 — Spacing Outside the Scale [MEDIUM — pervasive]

The token system defines `--space-xs` through `--space-3xl`. The implementation introduces extensive micro-spacing as raw values:

```
0.35rem, 0.4rem, 0.45rem, 0.65rem, 0.85rem, 1.25rem, 1.5rem, 2rem, 3rem
```

Some of these recur across many components (e.g. `gap: "0.35rem"` for tag clusters appears in AdrDocument, InsightCalloutStrip, InsightDocument). This creates an undocumented "tag cluster" spacing that exists as muscle memory but not as a token.

---

## Issue 8 — Redundant / Conflicting `style` + `className` on the Same Property [HIGH]

### AppLink — double colour declaration

```tsx
className="label hover:text-ink ..."
style={{ color: "var(--color-ink-secondary)", ... }}
```

The `.label` utility already sets `color: var(--color-ink-secondary)`. The `style` prop restates the same value. Because inline styles have higher specificity than class selectors, the style prop wins — and if the order of application ever changes (e.g. the utility is refactored), the component's default state silently breaks.

### AdrFilterBar — utility override

```tsx
<Field.Label className="label" style={{ textTransform: "none" }}>
```

The `.label` utility enforces `text-transform: uppercase`. This is immediately negated by inline style — the component needs a different semantic role, not a patched utility.

```tsx
<Input className="label" style={{ textTransform: "uppercase", letterSpacing: "0.06em" }}>
```

`.label` already has `text-transform: uppercase`. Restating it in style is redundant. `letterSpacing: "0.06em"` contradicts `--tracking-label: 0.10em` from the utility — the same element has two competing tracking values, with the inline style winning.

---

## Issue 9 — `focus-visible` Global vs Per-Component Conflict [MEDIUM]

`globals.css` defines a global baseline:

```css
:focus-visible {
  outline: var(--line-medium) solid var(--color-active);
  outline-offset: 3px;
}
```

Components then redundantly declare their own:

```tsx
className="... focus-visible:outline-[var(--color-active)]"
```

The per-component class sets `outline-color` only (via the resolved value) — it does not set `outline-width` or `outline-offset`. This creates a situation where:
1. The global rule fires with `var(--line-medium)` width
2. The per-component class may or may not fire with different specificity

The per-component declarations are fragmented overrides of a global rule. Either the global should be removed and every interactive element styled individually, or the global handles it and per-component declarations are removed.

---

## Issue 10 — `font-label` Used as `style` Despite Being in `@theme` [MEDIUM]

`--font-label` is exposed in `@theme` and usable as `font-label` class. But several components use it as an inline style:

```tsx
// AdrDocument.tsx:55, InsightDocument.tsx:42, RegisterTableHead.tsx (implicit via .label)
style={{ fontFamily: "var(--font-label)" }}
```

When `className="font-label"` or `className="label"` (which already includes it) would suffice.

---

## Issue 11 — `NavLink` Architecture: Mixed Hover State Across `className` and `style` [MEDIUM]

```tsx
className="label hover:text-ink hover:decoration-[var(--color-ink)]"
style={{
  color: "var(--color-ink-secondary)",
  textDecoration: "underline",
  textDecorationColor: "var(--color-ink-ghost)",
  textUnderlineOffset: "3px",
  transition: "color 0.15s, text-decoration-color 0.15s",
}}
```

Default state: set in `style` (wins over class due to specificity).
Hover state: set in `className` (Tailwind generates `.hover\:text-ink:hover { }`).

This pattern is fragile. The `transition` CSS is in `style`, but `transition-property` doesn't know about the class-driven hover change without explicit property listing. `text-decoration-color` is transitioning correctly because it's set in both style and class. `color` transitions correctly for the same reason. But the architecture relies on coincidental specificity resolution and will break silently if the style or class system changes.

---

## Issue 12 — `LabButton` Pressed State Not Reflected in Visual Styling [LOW]

```tsx
aria-pressed={pressed !== undefined ? pressed : undefined}
```

`aria-pressed` is set correctly for semantics, but there is no visual difference between pressed and unpressed states. Keyboard users and screen reader users get the correct semantics; sighted users cannot discern which tag/filter is active. The design system has the right tool: `--color-active` for the selected element. This is a design-fidelity gap, not just a code issue.

---

## Architecture Diagnosis

The tension collapses to one root cause:

> **Spacing, type scale, leading, and line-weight tokens are defined in `:root` but not exposed in `@theme`.**

This forces two competing patterns into every component:

```tsx
// Colour (in @theme) → uses Tailwind class
className="text-ink bg-ground"

// Spacing (not in @theme) → forced to style prop
style={{ padding: "var(--space-md)", marginBottom: "var(--space-lg)" }}
```

The inconsistency is then compounded by magic numbers that belong in neither system.

The fix is architectural, not cosmetic: either expand `@theme` to the full token set, or accept the CSS-custom-property-only approach and stop mixing systems. The current state — partial Tailwind exposure with heavy style-prop fallback and magic-number leakage — is the worst of both worlds.

---

## What Is Working Well

These patterns are correct and should be preserved:

1. `@import "tailwindcss"` — correct v4 entry point, no `@tailwind` directives
2. No `tailwind.config.js` — CSS-first configuration ✓
3. Three-tier naming convention (primitive / semantic / @theme) is clearly documented
4. Colour tokens used consistently as classes: `text-ink`, `text-ink-secondary`, `bg-ground`, `text-active` — widely adopted
5. Font tokens exposed and used: `font-display`, `font-body`, `font-label` ✓
6. No `bg-opacity-*` or `text-opacity-*` — correct slash modifier not needed in this palette
7. No `shadow-*` — The Flat-by-Construction Rule is honoured absolutely
8. Structural CSS classes (`.register-table`, `.register-row`, `.rule-heavy-x`) as page-pattern utilities — correct layer for compound structural rules
9. No arbitrary hex colours in className — colour usage goes through `style` at minimum
10. Semantic tag components (`LabTag`, `LabButton`, `NavLink`) exist and are used — the primitive is right, the implementation has rough edges

---

## Proposed Agent Guidelines

_(See separate section below — this document ends here for review findings)_

---

## Appendix: File-by-File Violations Summary

| File | Issues |
|---|---|
| `globals.css` | Custom utilities not `@utility`; spacing/type/leading/line not in `@theme` |
| `NavLink.tsx` | `var()` in className; redundant colour in style; mixed hover pattern |
| `LabButton.tsx` | `var()` in className; no pressed visual state |
| `InsightCalloutStrip.tsx` | Off-token colour `#f4ede0`; raw `1px` border; multiple `var()` in className; magic spacing; sub-label font size override |
| `InsightCalloutBlock.tsx` | Off-token colour `#f4ede0`; raw `1px` border; `var()` in className; magic spacing |
| `AdrDocument.tsx` | Multiple `var()` in className (×3 links); magic font sizes (0.58rem, 0.65rem, 1.75rem, 2rem); raw spacing (2rem, 1.5rem, 3rem); raw border (0.5px); `font-label` as style |
| `InsightDocument.tsx` | Same pattern as AdrDocument; 4× `var()` in className; magic font sizes; raw border widths |
| `AdrRegisterTable.tsx` | `var()` in className; magic font size (0.875rem); padding as raw values |
| `InsightsRegisterTable.tsx` | `var()` in className; magic font size (0.9rem, 1.35rem); raw padding |
| `AdrFilterBar.tsx` | Conflicting `textTransform`; competing `letterSpacing`; raw gap values |
| `RegisterTableHead.tsx` | Raw padding values; `fontWeight: 400` could be a token |
| `LabRegisterHeader.tsx` | Raw font sizes via `var(--text-title)` in style (title token exists but not in @theme) |
| `LabBreadcrumb.tsx` | `.label` colour overridden in style; raw `margin` values |
