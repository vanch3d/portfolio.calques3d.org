---
number: 24
title: 'Adopt class-variance-authority for atom component variants'
status: accepted
date: '2026-09-17'
decision-makers: vanch3d
tags: ['design-system', 'tailwind', 'components', 'dx']
---

# ADR 024 — Adopt class-variance-authority for atom component variants

**Date:** 2026-09-17
**Status:** Decided

## Context

`PRODUCT.md`'s Component architecture section requires component variants to be "defined via CVA or equivalent; never hard-coded Tailwind classnames inline." When `Button.tsx` (the first atom in Track I — see `.docs/tasks/2026-09-14-atom-interaction-system.md`) was built, this was resolved as "Option B": a `cn()`-backed `Record<ButtonVariant, string>` class-map, with no new dependency, documented in `.claude/rules/components.md`'s "Variant mechanism" section. `clsx` and `tailwind-merge` (already installed, backing the existing `cn()` helper in `src/lib/utils.ts`) were judged sufficient.

In practice, this produced three ~180–250 character single-line strings — one per variant — mixing rest, hover, active, and disabled classes with no grouping, no shared base-class reuse, and no ordering. Reviewed live, this was assessed as unacceptable engineering on its own terms (not just as an argument for or against CVA specifically): no code reuse across variants that share structure, no line-level grouping by concern, and no Tailwind CSS IntelliSense — the official extension has default support for recognizing class strings inside `cva()`/`cx()`/`clsx()` calls, but not inside an arbitrary `Record` object literal, so editor autocomplete for every class name was lost.

This pattern was about to become the template for `Checkbox`, `Radio`/`RadioGroup`, and `Field`/`Fieldset` (PR 3/4 of the same track), which would have multiplied the problem across every remaining atom before it could be caught structurally.

## Decision

**Adopt `class-variance-authority` (CVA) as the project's variant mechanism**, superseding the `cn()`-class-map convention. `.claude/rules/components.md`'s "Variant mechanism" section is rewritten accordingly.

Scope: this ADR governs component **variant** definitions (a discrete prop like `variant`, `size`) for the atom/interaction-system component set built under Track I — `Button`, `Checkbox`, `Radio`/`RadioGroup`, `Field`/`Fieldset` — and any future component with more than one variant axis. It does not retroactively require every existing component in the codebase to migrate; existing hand-written ternaries elsewhere (e.g. `TagFilterDrawer.tsx`) are out of scope here and tracked separately under the Retrofit phase in `.docs/tasks/TRACKER.md`.

**The structural requirement, not just the library choice:** adopting CVA does not by itself fix the reviewed problem — a single unstructured string passed as one `cva()` variant value would reproduce the exact same defect. The binding pattern is:

- `base`: shared classes common to every variant, written once, not repeated per variant.
- `variants.<axis>.<value>`: each variant's classes as a multi-line array of strings (not one long string), one array element per concern-group (e.g. structure/fill, hover, active, disabled), each with an inline comment naming the group.
- `cva()`'s own output is still passed through the project's existing `cn()` (`clsx` + `tailwind-merge`) when merging with a caller-supplied `className`, preserving override-safety for consumers.
- Variant prop types are derived via `VariantProps<typeof xVariants>`, not hand-rolled unions duplicating the variant keys.

See Implementation Plan below for the concrete Button.tsx shape.

## Consequences

**Positive:**

- Restores Tailwind CSS IntelliSense (autocomplete, hover-preview, class sorting) for every variant's class list, since `cva()` is a pattern the official extension recognizes by default.
- Removes hand-rolled `ButtonVariant` type + `Record<Variant, string>` boilerplate — `VariantProps<T>` derives prop types directly from the variants object, so the type and the implementation can't drift apart.
- Native support for `compoundVariants`, needed once an atom has two independent variance axes (e.g. a future `Checkbox`'s `checked` × `disabled`, or a `size` prop added to `Button` later) — the `cn()`-class-map approach had no equivalent without hand-written ternary chains, which was the same anti-pattern PRODUCT.md's binding language already prohibits.
- Establishes one documented, reviewed pattern before three more atoms (Checkbox, Radio/RadioGroup, Field/Fieldset) are built on it in PR 3/4.

**Negative / Trade-offs:**

- New dependency (`class-variance-authority`) — small, purpose-built, zero runtime deps of its own, but it is one more package to keep current.
- `.claude/rules/components.md`'s Option B section (written 2026-09-17, same day) is being superseded within hours of being written — a visible reversal, recorded here rather than silently edited out, so a future reader isn't confused by git history alone.

## Implementation Plan

- **Affected paths**: `package.json` (add `class-variance-authority`), `.claude/rules/components.md` (rewrite "Variant mechanism" section), `src/components/ui/Button.tsx` (rewrite using `cva()`), `src/components/ui/Button.spec.cy.tsx` (adjust assertions if the rendered class strings change shape).
- **Dependencies**: add `class-variance-authority` (latest stable at implementation time) via `pnpm add class-variance-authority`.
- **Patterns to follow**:
  ```tsx
  import { cva, type VariantProps } from 'class-variance-authority'
  import { cn } from '@/lib/utils'

  const buttonVariants = cva(
    // base — shared by every variant
    ['label', 'appearance-none', 'cursor-pointer', 'py-sm', 'transition-colors', 'duration-150'],
    {
      variants: {
        variant: {
          primary: [
            'border-medium border-ink bg-ink px-md text-ground', // structure / fill
            'active:live-line-pressed active:outline-ink', // pressed
            'disabled:border-ink-ghost disabled:bg-transparent disabled:text-ink-ghost', // disabled
          ],
          secondary: [
            'border-medium border-ink-secondary bg-transparent px-md text-ink', // structure / fill
            'hover:border-ink', // hover
            'active:live-line-pressed active:outline-ink active:border-ink active:bg-ink-wash', // pressed
            'disabled:border-ink-ghost disabled:bg-transparent disabled:text-ink-ghost', // disabled
          ],
          'text-action': [
            'border-none bg-transparent px-0 text-ink-secondary underline decoration-transparent underline-offset-2', // structure
            'hover:text-ink hover:decoration-ink', // hover
            'active:text-ink active:font-medium', // pressed
            'disabled:text-ink-ghost disabled:no-underline disabled:decoration-transparent', // disabled
          ],
        },
      },
      defaultVariants: { variant: 'primary' },
    }
  )

  type ButtonProps = VariantProps<typeof buttonVariants> &
    ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }

  export function Button({ variant, className, children, ...rest }: ButtonProps) {
    return (
      <button className={cn(buttonVariants({ variant }), className)} {...rest}>
        {children}
      </button>
    )
  }
  ```
  Disabled/base classes shared across every variant (e.g. `disabled:cursor-not-allowed disabled:pointer-events-none`) belong in `base`, not repeated per variant.
- **Patterns to avoid**: a `variants.variant.<value>` entry that is a single string over ~80 characters mixing multiple concerns (structure + all states) with no grouping — this reproduces the defect this ADR exists to fix, regardless of which library wraps it. Do not add `class-variance-authority` usage for a component with only one variant value (no real choice to make) — plain conditional classes via `cn()` remain fine for that case.

### Verification

- [x] `class-variance-authority` present in `package.json` dependencies (`0.7.1`).
- [x] `Button.tsx` uses `cva()` with a `base` array and a `variants.variant` object; no single-line string over ~80 characters mixing multiple state concerns.
- [x] `.claude/rules/components.md`'s "Variant mechanism" section documents the `cva()` pattern (base/variants, grouped multi-line arrays) with a real example, replacing the superseded `cn()`-class-map section.
- [x] `ButtonProps` derives its variant prop from `VariantProps<typeof buttonVariants>` rather than a hand-written union duplicating the variant keys.
- [x] `Button.spec.cy.tsx` passes against the rewritten component (19/19).
- [ ] PR 3/4 (`Checkbox`, `Radio`/`RadioGroup`, `Field`/`Fieldset`) follow this same pattern — checked off when those PRs land.

## Alternatives Considered

- **Keep the `cn()`-class-map convention ("Option B")**: rejected same-day after live review — the reviewed defect (unstructured, unreadable, non-reusable class strings with no editor support) is inherent to the pattern regardless of variant-mechanism choice, and CVA directly addresses every specific complaint (structure, reuse, IntelliSense, typed props).
- **Do nothing / leave Button as shipped**: rejected — PRODUCT.md's binding language already requires "CVA or equivalent," and three more atoms were about to copy the same defect forward.

## Related

- `PRODUCT.md` — Component architecture section (source of the binding "CVA or equivalent" requirement)
- `.claude/rules/components.md` — "Variant mechanism" section, rewritten by this ADR
- ADR 009 — Three-Layer Design Token Architecture and Headless Component Primitives (the token layer `cva()`'s class strings compose from)
- `.docs/tasks/2026-09-14-atom-interaction-system.md` — the handoff that originally left the variant-mechanism decision open, resolved first as Option B, now superseded by this ADR
- `.docs/tasks/TRACKER.md` — Track I, PR 2 entry records the same-day reversal

## More Information

- **2026-09-17:** Superseded the Option B decision recorded in `.claude/rules/components.md` the same day it was written, following live review of the shipped `Button.tsx` variant strings. Revisit this ADR if `class-variance-authority` is ever abandoned upstream or if a materially simpler pattern emerges that still satisfies the structural requirements above (base/variants separation, grouped multi-line class lists, typed variant props, editor support) — the structural requirements are the actual point, CVA is the current best-fit implementation of them.
