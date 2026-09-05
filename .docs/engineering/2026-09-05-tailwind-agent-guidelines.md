# Agent Guidelines: Tailwind & Token Architecture
**Companion to:** `2026-09-05-tailwind-token-review.md`
**Applies to:** All agents implementing styled components in this codebase

These rules are stronger than CLAUDE.md defaults. When in conflict, these win for any styling work.

---

## The Hierarchy

Before writing a single style, resolve it through this chain. Stop at the first match.

```
1. Does a Tailwind semantic class exist?     → className="text-ink"
2. Does a custom @utility class exist?       → className="label"
3. Does a design token exist (--space-md)?   → style={{ padding: "var(--space-md)" }}
4. Is this a truly one-off dynamic value?    → style={{ width: `${x}px` }}
5. None of the above?                        → STOP. Add the token first, then style.
```

**There is no step 6.** Raw values that belong in the system (`#f4ede0`, `0.58rem`, `1.5rem`) are never acceptable. Add the token to `globals.css`, then use it.

---

## Rule 1: Never use `var()` inside a `className`

```tsx
// FORBIDDEN — always
className="hover:text-[var(--color-ink)]"
className="focus-visible:outline-[var(--color-active)]"
className="hover:decoration-[var(--color-ink-ghost)]"

// CORRECT — use the semantic class
className="hover:text-ink"
className="focus-visible:outline-active"
className="hover:decoration-ink-ghost"
```

All five colours in the design system (`--color-ground`, `--color-ink`, `--color-ink-secondary`, `--color-ink-ghost`, `--color-active`) are exposed in `@theme`. There is no valid reason to use `var()` wrappers for them in className.

**Check before writing:** If you are about to write `[var(--color-*)]` in a class, stop. Use the direct class name instead.

---

## Rule 2: Never override a custom utility's own properties in `style`

Custom utilities (`.label`, `.tabular`, `.title-italic`, etc.) define a complete semantic contract. Do not partially apply them and then override their values.

```tsx
// FORBIDDEN — using .label then overriding what .label defines
<span className="label" style={{ textTransform: "none" }} />
<span className="label" style={{ letterSpacing: "0.06em" }} />
<span className="label" style={{ color: "var(--color-ink)" }} />

// CORRECT — if you need different properties, don't use .label
// Create a new @utility or compose a different class combination
<span className="font-label text-sm text-ink" />
```

If you find yourself needing to override a utility's properties, that is a signal to either:
a) create a variant utility (`@utility label-ghost { ... }`)
b) use raw Tailwind classes instead of the compound utility

---

## Rule 3: Never hardcode a raw colour value

```tsx
// FORBIDDEN
style={{ background: "#f4ede0" }}
style={{ color: "#c0392b" }}
style={{ borderColor: "#c8c4bc" }}

// CORRECT — use a named token
style={{ background: "var(--color-ground)" }}
style={{ color: "var(--color-active)" }}
style={{ borderColor: "var(--color-ink-ghost)" }}
```

The design system has exactly five colours. If the colour you need is not one of them, it either:
a) Already maps to one of the five (check DESIGN.md)
b) Requires a new primitive + semantic token — add it to `globals.css` first

**The off-token `#f4ede0` pattern in InsightCalloutStrip and InsightCalloutBlock is an example of what never to repeat.**

---

## Rule 4: Always use line-weight tokens for border widths

The line-weight hierarchy encodes the graphite weight system. Hardcoding bypasses it.

```tsx
// FORBIDDEN
border: "1px solid var(--color-ink-secondary)"
borderTop: "0.5px solid var(--color-ink-ghost)"

// CORRECT
border: `var(--line-medium) solid var(--color-ink-secondary)`
borderTop: `var(--line-ghost) solid var(--color-ink-ghost)`
```

| Value | Token |
|---|---|
| 1.5px | `var(--line-heavy)` |
| 1px | `var(--line-medium)` |
| 0.5px | `var(--line-ghost)` |

---

## Rule 5: Stay within the type scale

There are **five** type levels. Use them. Do not interpolate.

| Level | Token | Usage |
|---|---|---|
| Display | `var(--text-display)` | Name/era headings — once per surface |
| Headline | `var(--text-headline)` | Section titles, project headings |
| Title | `var(--text-title)` | Position names, chapter titles |
| Body | `var(--text-body)` | Narrative prose |
| Label | `var(--text-label)` | Dates, tags, ticks, annotations |

```tsx
// FORBIDDEN — interpolated sizes not in the scale
style={{ fontSize: "0.58rem" }}
style={{ fontSize: "1.35rem" }}
style={{ fontSize: "2rem" }}

// CORRECT — use the nearest scale token
style={{ fontSize: "var(--text-label)" }}
style={{ fontSize: "var(--text-title)" }}
style={{ fontSize: "var(--text-headline)" }}
```

If the design genuinely requires an intermediate size, add it to the token system (`--text-sub-label`) and document the reason. Do not silently introduce it.

---

## Rule 6: Stay within the leading (line-height) system

```tsx
// FORBIDDEN
style={{ lineHeight: 1.3 }}
style={{ lineHeight: 1.35 }}
style={{ lineHeight: 1.55 }}

// CORRECT
style={{ lineHeight: "var(--leading-label)" }}    // 1.4
style={{ lineHeight: "var(--leading-headline)" }}  // 1.25
style={{ lineHeight: "var(--leading-body)" }}      // 1.70
```

---

## Rule 7: Use the spacing scale — no micro-spacing magic numbers

```tsx
// FORBIDDEN
style={{ gap: "0.35rem" }}
style={{ marginBottom: "0.65rem" }}
style={{ padding: "0.85rem 0" }}

// CORRECT
style={{ gap: "var(--space-xs)" }}       // 0.25rem — closest below
style={{ marginBottom: "var(--space-sm)" }}  // 0.5rem
style={{ padding: "var(--space-md) 0" }}     // 1rem
```

The spacing scale: `xs=0.25`, `sm=0.5`, `md=1`, `lg=2`, `xl=3`, `2xl=5`, `3xl=8` (all in rem).

If you need a value between scale steps, **choose the nearest step**. If the design genuinely requires a new step (e.g. `--space-2xs: 0.125rem`), add it to `globals.css`.

---

## Rule 8: Do not add new custom CSS classes — use `@utility`

Any new utility that needs to be referenced from JSX must be declared as `@utility` in `globals.css`, not as a plain CSS selector.

```css
/* FORBIDDEN — plain class selector */
.my-utility {
  font-family: var(--font-label);
}

/* FORBIDDEN — @apply inside @utility (v4 compile-order issue) */
@utility text-gradient {
  @apply bg-linear-to-r from-primary to-accent;
}

/* CORRECT — plain CSS properties inside @utility */
@utility my-utility {
  font-family: var(--font-label);
  font-size: var(--text-label);
  letter-spacing: var(--tracking-label);
}
```

**Do not use `@apply` inside `@utility`.** In Tailwind v4, `@apply` inside `@utility` creates a compile-order dependency that v4 doesn't guarantee. Write the CSS properties directly.

This integrates the utility with Tailwind's layer system, enables variant composition (`hover:my-utility`), and ensures correct purging.

### `@utility` vs compound `className`

Use `@utility` when the same combination of properties recurs across three or more components and represents a semantic role (not just visual convenience). For a one-off or two-component pattern, compose Tailwind classes in `className` directly.

```css
/* CORRECT — semantic role, used everywhere: label text */
@utility label {
  font-family: var(--font-label);
  font-size: var(--text-label);
  letter-spacing: var(--tracking-label);
  text-transform: uppercase;
  color: var(--color-ink-secondary);
  font-variant-numeric: tabular-nums;
}

/* AVOID — one-off visual convenience */
@utility card-padding {
  padding: var(--space-md) var(--space-lg);
}
```

---

## Rule 9: Do not re-declare the global focus-visible style per-component

`globals.css` defines the focus ring globally:

```css
:focus-visible {
  outline: var(--line-medium) solid var(--color-active);
  outline-offset: 3px;
}
```

Do **not** add per-component `focus-visible:outline-*` classes. They override a subset of the global rule's properties (colour only, not width or offset), creating inconsistent focus rings. If a component needs a different focus treatment, override the full rule via a `@utility` class that sets all three properties.

---

## Rule 10: Resolve default state in `className`, not `style`

If a colour, font, or other property has a named Tailwind class, use it for the default state too — not just for hover/focus variants.

```tsx
// FORBIDDEN — default in style, hover in class
style={{ color: "var(--color-ink-secondary)" }}
className="hover:text-ink"

// CORRECT — both in className
className="text-ink-secondary hover:text-ink"
```

Mixing default state in `style` with variants in `className` is a specificity hazard. Inline styles always win over classes, which means `hover:text-ink` may appear to work but will silently fail if the style prop value is ever changed.

---

## Rule 11: Do not restate a custom utility's own properties in `style`

If you use `className="label"`, do NOT also write `style={{ fontFamily: "var(--font-label)" }}` or `style={{ color: "var(--color-ink-secondary)" }}`. The utility already sets those. The inline style creates a conflicting declaration and a false impression that the utility isn't working.

---

## Rule 12: Before building a component, check which tokens exist

Before writing any style, read `globals.css` and identify:
- Which semantic tokens exist for your concern (colour, font, size, spacing, leading, line weight)
- Which of those are exposed in `@theme` (i.e. usable as Tailwind classes)
- Which are only available as `var()` references

This 30-second step eliminates most of the issues in this review.

---

## Rule 13: Understand the three-tier token architecture before touching `globals.css`

This project uses a strict three-tier model. Every value in the design system lives at exactly one tier and flows downward — it never skips a tier.

```
Tier 1 — Primitive tokens (:root)
    Raw values. Never referenced in components.
    --primitive-paper: #f8f4ed;
    --primitive-graphite: #2a2a2a;

Tier 2 — Semantic tokens (:root)
    Named meaning. Referenced in style props when no Tailwind class exists.
    --color-ground: var(--primitive-paper);
    --color-ink:    var(--primitive-graphite);

Tier 3 — Tailwind @theme (inline)
    Semantic tokens bridged to Tailwind class generation.
    Generates: text-ink, bg-ground, font-display, etc.
    @theme inline {
      --color-ink: var(--color-ink);
    }
```

### `@theme` vs `@theme inline`

| Mode | When to use |
|---|---|
| `@theme { --x: #value; }` | Defining raw values directly in the theme — resolves at build time |
| `@theme inline { --x: var(--x); }` | Bridging a `:root` semantic token into Tailwind — defers resolution to use site |
| `@theme static { --x: #value; }` | Forces the CSS variable to be output even if never used — rarely needed |

**This project uses `@theme inline`** because semantic tokens are first defined in `:root` and then bridged. This is intentional: `:root` is the source of truth; `@theme` is the Tailwind delivery mechanism. Do not move token definitions into `@theme` directly — keep `:root` as the authoritative layer.

### How to add a new token correctly

Adding a new design token requires three steps, in order:

```css
/* Step 1 — Primitive in :root (only if raw value is new) */
:root {
  --primitive-warm-mid: #e8e0d4;
}

/* Step 2 — Semantic alias in :root */
:root {
  --color-surface-raised: var(--primitive-warm-mid);
}

/* Step 3 — Expose to Tailwind in @theme inline (only if Tailwind class is needed) */
@theme inline {
  --color-surface-raised: var(--color-surface-raised);
}
```

If step 3 is omitted, the token is only usable via `style={{ ... }}`, not as a Tailwind class. That is acceptable for tokens like `--space-md` that are intentionally not Tailwind utilities. If you want `bg-surface-raised` to work as a class, step 3 is required.

### Clearing Tailwind's default colour scale (namespace override)

Tailwind v4 ships a large default colour scale (slate, gray, red, blue, etc.). This project's design system does not use them. If a future agent accidentally reaches for `text-blue-500` or `bg-gray-100`, those classes exist and will not error — they will simply violate the design system silently.

To remove that risk for a given category, use a namespace reset in `@theme`:

```css
@theme {
  /* Clear the entire default color scale */
  --color-*: initial;

  /* Then re-declare only the design system colours */
  --color-ground:        var(--color-ground);
  --color-ink:           var(--color-ink);
  --color-ink-secondary: var(--color-ink-secondary);
  --color-ink-ghost:     var(--color-ink-ghost);
  --color-active:        var(--color-active);
}
```

This is an architectural decision for the team — not something an agent should do unilaterally. Document it as an ADR if it is added.

### Semi-transparent token variants with `color-mix()`

When a component genuinely needs a semi-transparent version of a semantic colour (e.g. an overlay, a hover wash), define it as a named token — do not use the Tailwind slash modifier with arbitrary opacity.

```css
/* CORRECT — named token for a specific semantic need */
:root {
  --color-ink-wash: color-mix(in oklab, var(--color-ink) 8%, transparent);
}

@theme inline {
  --color-ink-wash: var(--color-ink-wash);
}
```

```tsx
/* Then use as a class */
className="bg-ink-wash"

/* NOT this — slash modifier with semantic token is fine but only for @theme-registered colours */
className="bg-ink/8"
```

---

## Checklist — Before Submitting a Styled Component

```
[ ] No var() inside className (Rule 1)
[ ] No utility properties overridden in style (Rule 2)
[ ] No raw hex colour values (Rule 3)
[ ] Border widths use --line-heavy / --line-medium / --line-ghost (Rule 4)
[ ] Font sizes use --text-display/headline/title/body/label only (Rule 5)
[ ] Line heights use --leading-* tokens only (Rule 6)
[ ] Spacing uses --space-xs through --space-3xl (Rule 7)
[ ] New CSS utilities declared with @utility + plain CSS (no @apply) (Rule 8)
[ ] No per-component focus-visible override (Rule 9)
[ ] Default state in className where a class exists (Rule 10)
[ ] Style prop does not duplicate what the applied utility already sets (Rule 11)
[ ] globals.css reviewed before first style line written (Rule 12)
[ ] New token added at all three tiers (:root primitive → :root semantic → @theme inline) (Rule 13)
[ ] @theme inline used for bridging, not for raw values (Rule 13)
[ ] Semi-transparent colour needs defined as a named token, not inline opacity (Rule 13)
```

---

## The One Question to Ask About Every Value

> "Does a token exist for this?"

If yes: use it.
If no: either it maps to an existing token (look harder) or it needs a new one (add it first).

The third answer — "just hardcode it for now" — does not exist in this codebase.
