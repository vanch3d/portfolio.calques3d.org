# Tailwind CSS & Token Architecture

Applies to all styled components in `src/`. See `.docs/engineering/2026-09-05-tailwind-agent-guidelines.md` for extended rationale.

---

## The hard rules

**Every style value must trace back to a design token. There is no "hardcode it for now".**

**Use Tailwind CSS v4 exclusively. No inline `style` props. No CSS modules.**

The only legitimate use of `style={}` is a truly dynamic/computed value that cannot be known at build time (e.g. a canvas width derived from a ResizeObserver measurement). A static design token is never dynamic.

---

## Setup

**Entry point:** `src/styles/globals.css` — `@import "tailwindcss"` + imports for all sub-files.

**Style architecture:**
```
src/styles/
  globals.css          ← entry point
  tokens/
    colors.css         ← :root color tokens + @theme inline bridge
    typography.css     ← font-family, type scale, leading, tracking tokens
    spacing.css        ← spacing scale, line weights, layout tokens
  base/
    reset.css          ← html/body baseline, focus ring
    elements.css       ← prose element defaults (h*, p, a, code, hr)
  utilities/
    index.css          ← @utility classes (label, active-mark, border-heavy, …)
  themes/
    index.css          ← theme overrides (dark mode placeholder)
```

**`cn()` utility:** always use `cn()` from `src/lib/utils.ts` for conditional or composed class strings.

```tsx
import { cn } from "@/lib/utils";

<div className={cn("label", isActive && "active-mark", className)} />
```

---

## Resolution hierarchy

Before writing any style, stop at the first match in this chain:

```
1. Tailwind semantic class exists?      → className="text-ink"
2. Custom @utility class exists?        → className="label"
3. Design token exists (--spacing-md)?  → className="p-md"
4. Truly dynamic / computed value?      → style={{ width: `${x}px` }}
5. None of the above?                   → Add token to src/styles/tokens/ first, then className.
```

Read `src/styles/tokens/` before writing any style — identify which tokens and classes already exist.

---

## Three-tier token system

Tokens are organised in three tiers. All tiers live in `src/styles/tokens/`.

```
Tier 1 — Global (primitives)    raw values in :root, never used in components directly
Tier 2 — Semantic (aliases)     named meaning, used to bridge to @theme
Tier 3 — @theme inline          produces Tailwind utility classes
```

**Token categories:**

| Category | Files | Produces |
|---|---|---|
| **Global** | `colors.css`, `spacing.css`, `typography.css` | `text-ink`, `p-md`, `font-display`, … |
| **Component** | add to the relevant token file under a component namespace | component-scoped derived tokens |
| **Utility** | `utilities/index.css` | `@utility label`, `@utility border-heavy`, … |

### Tailwind v4 namespace → class mapping

| CSS variable prefix | Tailwind utilities produced |
|---|---|
| `--color-*` | `text-*`, `bg-*`, `border-*`, `ring-*`, `decoration-*`, … |
| `--font-*` | `font-*` (font-family) |
| `--text-*` | `text-*` (font-size) |
| `--leading-*` | `leading-*` |
| `--tracking-*` | `tracking-*` |
| `--spacing-*` | `p-*`, `m-*`, `gap-*`, `w-*`, `h-*`, `inset-*`, … |
| `--max-width-*` | `max-w-*` |

### Adding a new token (all three steps required)

```css
/* 1. Primitive (only if the raw value is new) */
:root { --primitive-warm-mid: #e8e0d4; }

/* 2. Semantic alias */
:root { --color-surface-raised: var(--primitive-warm-mid); }

/* 3. Tailwind bridge — produces bg-surface-raised, text-surface-raised, etc. */
@theme inline { --color-surface-raised: var(--color-surface-raised); }
```

All three steps are required for a token that will be used via a Tailwind class. If step 3 is omitted, there is no className for that token — add it.

---

## Never use `var()` inside `className`

All system tokens are in `@theme` and usable as plain classes.

```tsx
// ❌ arbitrary-value wrapper — never needed for system tokens
className="hover:text-[var(--color-ink)]"
className="focus-visible:outline-[var(--color-active)]"
className="p-[var(--spacing-md)]"

// ✅ semantic class directly
className="hover:text-ink"
className="focus-visible:outline-active"
className="p-md"
```

---

## Never hardcode a raw value

**Colours:** the design system has exactly five colours. Use the class, not the hex.

```tsx
// ❌ raw hex
className="bg-[#f8f4ed]"

// ✅ semantic class
className="bg-ground"
```

Colour tokens: `ground` · `ink` · `ink-secondary` · `ink-ghost` · `active`

**Sizes:** use the token scale. Do not invent values between steps.

```tsx
// ❌ off-scale sizes
className="text-[0.58rem]"
className="text-[1.35rem]"

// ✅ scale tokens
className="text-label"
className="text-title"
```

---

## Always use line-weight utilities for borders

The graphite line-weight hierarchy is expressed via `@utility` classes in `utilities/index.css`.
Use them via `className`, not `style`.

```tsx
// ❌ bypasses the weight hierarchy
style={{ borderTop: "1px solid var(--color-ink-ghost)" }}

// ✅ semantic utility classes
className="border-t-medium border-ink-ghost"
className="border-b-ghost border-ink-ghost"
className="border-l-heavy border-ink-ghost"
```

| Utility | Value | Meaning |
|---|---|---|
| `border-heavy` / `border-*-heavy` | 1.5px | Primary structure, title blocks |
| `border-medium` / `border-*-medium` | 1px | Secondary, standard borders |
| `border-ghost` / `border-*-ghost` | 0.5px | Grid lines, row dividers |

---

## Stay within the type and leading scales

**Type scale** — six levels, do not interpolate:

| Class           | Token             | Usage                                  |
|-----------------|-------------------|----------------------------------------|
| `text-display`  | `--text-display`  | Name / era headings — once per surface |
| `text-headline` | `--text-headline` | Section titles                         |
| `text-title`    | `--text-title`    | Position names, chapter titles         |
| `text-body`     | `--text-body`     | Narrative prose                        |
| `text-caption`  | `--text-caption`  | Supporting description text            |
| `text-label`    | `--text-label`    | Dates, tags, ticks, annotations        |

**Leading scale** — five levels, do not use raw numbers:

| Class              | Value | Usage                           |
|--------------------|-------|---------------------------------|
| `leading-display`  | 1.10  | Display headings                |
| `leading-headline` | 1.25  | Headline headings               |
| `leading-title`    | 1.35  | Title specimens, position names |
| `leading-body`     | 1.70  | Body prose                      |
| `leading-label`    | 1.40  | Label / dense annotations       |

**Spacing scale** — use named steps:

| Class    | Value                    |
|----------|--------------------------|
| `*-xs`   | 0.25rem                  |
| `*-sm`   | 0.5rem                   |
| `*-md`   | 1rem                     |
| `*-lg`   | 2rem                     |
| `*-xl`   | 3rem                     |
| `*-2xl`  | 5rem                     |
| `*-3xl`  | 8rem                     |
| `*-page` | clamp(1.5rem, 5vw, 3rem) |

Do not use micro-values like `0.35rem`, `0.65rem`, `0.85rem`. Choose the nearest step or add a named one to `src/styles/tokens/spacing.css`.

---

## Resolve default state in `className`, not `style`

Inline styles always win over classes. A `hover:` modifier on an element whose base is set via `style` will silently fail.

```tsx
// ❌ default in style, hover in class — specificity hazard
style={{ color: "var(--color-ink-secondary)" }}
className="hover:text-ink"

// ✅ both in className
className="text-ink-secondary hover:text-ink"
```

---

## Do not restate a custom utility's own properties

Custom utilities define a semantic contract. Do not partially apply them and then override their values.

```tsx
// ❌ .label already sets font-family, font-size, letter-spacing, text-transform, color
<span className="label" className="text-ink tracking-[0.06em]" />

// ✅ if you need different values, compose classes directly instead
<span className="font-label text-label tracking-[0.06em] uppercase text-ink" />
```

---

## Custom utilities: `@utility` with plain CSS — never `@apply`

```css
/* ❌ plain class selector — outside Tailwind's layer system */
.my-utility { font-family: var(--font-label); }

/* ❌ @apply inside @utility — compile-order issue in v4 */
@utility label { @apply font-mono uppercase; }

/* ✅ @utility with plain CSS properties */
@utility label {
  font-family: var(--font-label);
  font-size: var(--text-label);
  letter-spacing: var(--tracking-label);
  text-transform: uppercase;
  color: var(--color-ink-secondary);
  font-variant-numeric: tabular-nums;
  line-height: var(--leading-label);
}
```

Use `@utility` for patterns that recur across three or more components with a semantic role. One-off combinations belong in `className` directly.

---

## Do not re-declare the global focus ring per-component

`src/styles/base/reset.css` sets the project-wide focus ring:

```css
:focus-visible {
  outline: var(--line-medium) solid var(--color-active);
  outline-offset: 3px;
}
```

Do not add per-component `focus-visible:outline-*` classes. If a component genuinely needs a different treatment, define a `@utility` that overrides all three properties (width, color, offset).

---

## Semi-transparent colour variants

Define as a named token — do not reach for arbitrary opacity modifiers.

```css
/* ✅ named token — three-step process */
:root { --color-ink-wash: color-mix(in oklab, var(--color-ink) 8%, transparent); }
@theme inline { --color-ink-wash: var(--color-ink-wash); }
```

```tsx
className="bg-ink-wash"   /* ✅ */
className="bg-ink/8"      /* ❌ opacity modifier on a non-alpha token */
```

---

## What NOT to do (v4 anti-patterns)

| Anti-pattern                                | Correct v4 form                          |
|---------------------------------------------|------------------------------------------|
| `@tailwind base/components/utilities`       | `@import "tailwindcss"`                  |
| `tailwind.config.js`                        | `@theme` blocks in CSS                   |
| `bg-opacity-50` / `text-opacity-75`         | `bg-ink/50` / `text-ink/75`              |
| `bg-gradient-to-r`                          | `bg-linear-to-r`                         |
| `shadow-sm` (smallest shadow)               | `shadow-xs`                              |
| `@layer utilities { .x { } }`               | `@utility x { }`                         |
| `@apply` inside `@utility`                  | plain CSS properties                     |
| `var()` inside `className`                  | semantic Tailwind class                  |
| `style={{ fontSize: "var(--text-label)" }}` | `className="text-label"`                 |
| `style={{ padding: "var(--space-md)" }}`    | `className="p-md"`                       |
| `style={{ borderTop: "1px solid ..." }}`    | `className="border-t-medium border-ink"` |
