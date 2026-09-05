# Tailwind CSS & Token Architecture

Applies to all styled components in `src/`. See`.docs/engineering/2026-09-05-tailwind-agent-guidelines.md` for extended rationale.

---

## The hard rule

**Every style value must trace back to a design token. There is no "hardcode it for now".**

---

## Resolution hierarchy

Before writing any style, stop at the first match in this chain:

```
1. Tailwind semantic class exists?   → className="text-ink"
2. Custom @utility class exists?     → className="label"
3. Design token exists (--space-md)? → style={{ padding: "var(--space-md)" }}
4. Truly dynamic / computed value?   → style={{ width: `${x}px` }}
5. None of the above?               → Add the token to globals.css first, then style.
```

Read `globals.css` before writing any style — 30 seconds to identify which tokens and classes already exist.

---

## Never use `var()` inside `className`

All five design-system colours are in `@theme` and usable as plain classes.

```tsx
// ❌ arbitrary-value wrapper — never needed for system colours
className="hover:text-[var(--color-ink)]"
className="focus-visible:outline-[var(--color-active)]"
className="hover:decoration-[var(--color-ink-ghost)]"

// ✅ use the semantic class directly
className="hover:text-ink"
className="focus-visible:outline-active"
className="hover:decoration-ink-ghost"
```

---

## Never hardcode a raw colour value

The design system has exactly five colours. If the value isn't one of them, add a token first.

```tsx
// ❌ raw hex — not in the system
style={{ background: "#f4ede0" }}

// ✅ semantic token
style={{ background: "var(--color-ground)" }}
```

Colour tokens: `--color-ground`, `--color-ink`, `--color-ink-secondary`, `--color-ink-ghost`, `--color-active`.

---

## Always use line-weight tokens for border widths

```tsx
// ❌ raw widths bypass the graphite-weight hierarchy
border: "1px solid var(--color-ink)"
borderTop: "0.5px solid var(--color-ink-ghost)"

// ✅ semantic line weights
border: "var(--line-medium) solid var(--color-ink)"    // 1px
borderTop: "var(--line-ghost) solid var(--color-ink-ghost)"  // 0.5px
```

| Token | Value | Meaning |
|---|---|---|
| `--line-heavy` | 1.5px | Primary structure, title blocks |
| `--line-medium` | 1px | Secondary, standard borders |
| `--line-ghost` | 0.5px | Grid lines, row dividers |

---

## Stay within the type scale

There are five levels. Do not interpolate.

| Token | Usage |
|---|---|
| `var(--text-display)` | Name / era headings — once per surface |
| `var(--text-headline)` | Section titles |
| `var(--text-title)` | Position names, chapter titles |
| `var(--text-body)` | Narrative prose |
| `var(--text-label)` | Dates, tags, ticks, annotations |

```tsx
// ❌ off-scale sizes
style={{ fontSize: "0.58rem" }}
style={{ fontSize: "1.35rem" }}

// ✅ scale tokens
style={{ fontSize: "var(--text-label)" }}
style={{ fontSize: "var(--text-title)" }}
```

If a genuinely new level is needed, add `--text-sub-label` to `globals.css` and document why.

---

## Stay within the leading and spacing systems

**Leading (line-height):** use `--leading-display`, `--leading-headline`, `--leading-body`, `--leading-label` only. Do not use raw numbers (`1.3`, `1.35`, `1.55`).

**Spacing:** use `--space-xs` (0.25rem) through `--space-3xl` (8rem). Do not use micro-values (`0.35rem`, `0.65rem`, `0.85rem`). Choose the nearest step or add a named step to `globals.css`.

---

## Resolve default state in `className`, not `style`

When a Tailwind class exists for a property, use it for the default state too — not just variants.

```tsx
// ❌ default in style, hover in class — specificity hazard
style={{ color: "var(--color-ink-secondary)" }}
className="hover:text-ink"

// ✅ both in className — consistent specificity
className="text-ink-secondary hover:text-ink"
```

Inline styles always win over classes. A `hover:` class on an element whose default is set via `style` will silently fail if the style value is ever changed.

---

## Do not restate a custom utility's own properties in `style`

Custom utilities define a semantic contract. Do not partially apply them and then override or restate their values.

```tsx
// ❌ .label already sets color, font-family, letter-spacing, text-transform
<span className="label" style={{ color: "var(--color-ink)", letterSpacing: "0.06em" }} />

// ✅ if you need different properties, don't use .label — compose classes instead
<span className="font-label text-ink" style={{ fontSize: "var(--text-label)" }} />
```

---

## Custom utilities: use `@utility` with plain CSS — never `@apply`

```css
/* ❌ plain class selector — outside Tailwind's layer system */
.my-utility {
  font-family: var(--font-label);
}

/* ❌ @apply inside @utility — compile-order issue in v4 */
@utility text-gradient {
  @apply bg-linear-to-r from-primary to-accent;
}

/* ✅ @utility with plain CSS properties */
@utility my-utility {
  font-family: var(--font-label);
  font-size: var(--text-label);
}
```

Use `@utility` for patterns that recur across three or more components and carry a semantic role. One-off visual combinations belong in `className` directly.

---

## Do not re-declare the global focus ring per-component

`globals.css` sets a project-wide focus ring:

```css
:focus-visible {
  outline: var(--line-medium) solid var(--color-active);
  outline-offset: 3px;
}
```

Do not add per-component `focus-visible:outline-*` classes. They override colour only — not width or offset — creating an inconsistent ring. If a component genuinely needs a different focus treatment, define a `@utility` that overrides all three properties.

---

## Three-tier token architecture — how it works

```
Primitive (:root)   → raw values, never used in components
    ↓
Semantic (:root)    → named meaning, used in style props
    ↓
@theme inline       → bridges semantic tokens to Tailwind class generation
```

**`@theme inline` is the correct modifier for this project.** It defers variable resolution to the use site, so `:root` overrides are respected. Do not move token definitions into `@theme` directly — keep `:root` as the source of truth.

### Adding a new token (all three steps required)

```css
/* 1. Primitive (only if raw value is new) */
:root { --primitive-warm-mid: #e8e0d4; }

/* 2. Semantic alias */
:root { --color-surface-raised: var(--primitive-warm-mid); }

/* 3. Tailwind bridge (only if a className is needed) */
@theme inline { --color-surface-raised: var(--color-surface-raised); }
```

Omitting step 3 means the token is only reachable via `style` — that is intentional for spacing, type scale, and line weights in this project.

### Semi-transparent colour variants

When a component needs a semi-transparent version of a token, define it as a named token — do not reach for an arbitrary opacity modifier.

```css
/* ✅ named token */
:root { --color-ink-wash: color-mix(in oklab, var(--color-ink) 8%, transparent); }
@theme inline { --color-ink-wash: var(--color-ink-wash); }
```

```tsx
/* ✅ semantic class */
className="bg-ink-wash"

/* ❌ not this — opacity modifier on a non-alpha token */
className="bg-ink/8"
```

---

## What NOT to do (v4 anti-patterns)

| Anti-pattern | Correct v4 form |
|---|---|
| `@tailwind base/components/utilities` | `@import "tailwindcss"` |
| `tailwind.config.js` | `@theme` in CSS |
| `bg-opacity-50` / `text-opacity-75` | `bg-ink/50` / `text-ink/75` |
| `bg-gradient-to-r` | `bg-linear-to-r` |
| `shadow-sm` (smallest shadow) | `shadow-xs` |
| `@layer utilities { .x { } }` | `@utility x { }` |
| `@apply` inside `@utility` | plain CSS properties |
| `var()` inside `className` | semantic Tailwind class |
