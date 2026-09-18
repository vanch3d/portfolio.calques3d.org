# Component Conventions

Applies to all React components in `src/`. See ADR 004 for the broader component strategy.

---

## Directory naming in App Router

Co-located component directories inside `app/` must be prefixed with `_` to prevent
Next.js from treating them as route segments.

```
src/app/lab/design-system/
  _components/       ✅ not a route
  components/        ❌ treated as /lab/design-system/components route
  page.tsx
```

---

## Props typing

Always declare a named type with the `Props` suffix. Never inline the props shape
in the function signature.

```tsx
// ✅ correct
type ColorSwatchProps = {
  token: ColorToken;
};

export function ColorSwatch({ token }: ColorSwatchProps) { ... }

// ❌ wrong
export function ColorSwatch({ token }: { token: ColorToken }) { ... }
```

---

## Type exports

Only export a type if it is imported by another file. Internal types (used only
within the same file) must not be exported.

```tsx
// ✅ export — ColorToken is imported by ColorPalette.tsx
export type ColorToken = "color-ground" | "color-ink" | ...;

// ✅ do not export — RuleVariant is only used within NamedRuleCard.tsx
type RuleVariant = "one_red" | "no_decoration" | "flat_by_construction";
```

---

## Variant mechanism

`PRODUCT.md` requires component variants to be "defined via CVA or equivalent." This
project's accepted mechanism is `class-variance-authority` (ADR 024 — supersedes an
earlier same-day `cn()`-class-map convention, rejected on review: single 180–250
character unstructured strings per variant, no reuse, no grouping, no Tailwind CSS
IntelliSense).

**The structural requirement, not just the library, is binding.** A `cva()` call whose
variant values are single long strings reproduces the exact defect this convention
exists to prevent. Every `cva()`-based component must have:

- `base`: classes shared by every variant, written once — not repeated per variant.
- `variants.<axis>.<value>`: **an array of strings**, one element per concern-group
  (structure/fill, hover, active, disabled, …), each with a short inline comment
  naming the group. Never a single long string mixing every state.
- `VariantProps<typeof xVariants>` for the component's variant prop type — never a
  hand-rolled union duplicating the variant keys.
- `cva()`'s output still passed through `cn()` (`clsx` + `tailwind-merge`) when
  merging with a caller-supplied `className`, so overrides keep working.

```tsx
// ✅ correct — cva() with grouped, multi-line variant arrays
const buttonVariants = cva(
  ["label", "appearance-none", "cursor-pointer", "py-sm", "transition-colors", "duration-150"],
  {
    variants: {
      variant: {
        primary: [
          "border-medium border-ink bg-ink px-md text-ground", // structure / fill
          "active:border-heavy active:border-ink", // pressed
          "disabled:border-ink-ghost disabled:bg-transparent disabled:text-ink-ghost", // disabled
        ],
        secondary: [
          "border-medium border-ink-secondary bg-transparent px-md text-ink", // structure / fill
          "hover:border-ink", // hover
          "active:border-heavy active:border-ink active:bg-ink-wash", // pressed
          "disabled:border-ink-ghost disabled:bg-transparent disabled:text-ink-ghost", // disabled
        ],
      },
    },
    defaultVariants: { variant: "primary" },
  }
);

type ButtonProps = VariantProps<typeof buttonVariants> & ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({ variant, className, ...rest }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant }), className)} {...rest} />;
}

// ❌ wrong — one long string per variant, no grouping, no IntelliSense
const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: "border-medium border-ink bg-ink px-md text-ground active:border-heavy active:border-ink disabled:border-ink-ghost disabled:bg-transparent disabled:text-ink-ghost",
};
```

Do not hand-write a ternary chain per class (`variant === "primary" ? "bg-ink" : "..."`)
inline in the JSX. Do not reach for `cva()` on a component with only one variant value
(no real choice to make) — plain `cn()` conditionals remain fine for that case. See
`src/components/ui/Button.tsx` for the reference implementation and ADR 024 for the
full decision record.

---

## Styling: className vs style

Use `className` for values that exist in the Tailwind theme (`@theme` in `globals.css`)
or as named utility classes. Use `style` only for dynamic values or CSS token values
not yet registered in `@theme`.

### Currently in `@theme` (use className)

| Token | Tailwind class examples |
|---|---|
| `--color-*` | `text-ink`, `text-ink-secondary`, `text-active`, `bg-ground` |
| `--font-*` | `font-display`, `font-body`, `font-label` |

### Utility classes in globals.css (use className)

| Class | Covers |
|---|---|
| `.label` | font-label, text-label, tracking-label, uppercase, text-ink-secondary, tabular-nums |
| `.active-mark` | color-active |
| `.tabular` | font-variant-numeric: tabular-nums |

### Not in `@theme` yet (use style)

Type scale (`--text-*`), spacing (`--space-*`), leading (`--leading-*`),
line weights (`--line-*`), measure (`--measure-body`), tracking (`--tracking-label`),
layout (`--page-margin`) — these must use `style={{ ... }}`.

To reduce `style` usage, add these to the `@theme` block in `globals.css`.

### Examples

```tsx
// ✅ font and color from @theme via className; spacing stays in style
<p className="font-label text-ink-secondary" style={{ marginBottom: "var(--space-sm)" }}>

// ✅ .label utility covers the full label pattern
<p className="label" style={{ marginBottom: "var(--space-sm)" }}>

// ✅ dynamic value must be style (computed at runtime)
<div style={{ backgroundColor: `var(--${token})` }} />

// ❌ static theme value should not be inline style
<p style={{ fontFamily: "var(--font-label)", color: "var(--color-ink-secondary)" }}>
```

---

## Test file naming

Co-located Cypress CT specs must use the `.spec.cy.tsx` extension.
The Cypress config (`specPattern`) only picks up `src/**/*.spec.cy.{ts,tsx}`.

```
ColorSwatch.tsx
ColorSwatch.spec.cy.tsx   ✅
ColorSwatch.cy.tsx        ❌ not discovered by Cypress
```
