---
number: 9
title: 'Three-Layer Design Token Architecture and Headless Component Primitives'
status: accepted
date: '2026-09-01'
decision-makers: vanch3d
tags: ['design-system', 'tailwind', 'css', 'tokens', 'theming', 'dark-mode']
---

# ADR 009 — Three-Layer Design Token Architecture and Headless Component Primitives

**Date:** 2026-09-01
**Status:** Decided (reconciled 2026-09-14 — see More Information)

## Context

The portfolio requires a coherent visual identity across its sections with support for light/dark mode and WCAG 2.1 AA colour contrast. Tailwind CSS v4 adopts a CSS-first `@theme` block rather than `tailwind.config.ts`, which changes how custom tokens integrate with the utility system.

A previous design epic explored a three-layer token architecture (primitive → semantic → Tailwind `@theme inline`). That work is preserved in `main-legacy-app-v2` for reference.

This ADR was originally recorded with status `proposed` and a decision of "Deferred," on the basis that the design system would be defined once the content layer was complete. By 2026-09-01 that was no longer accurate: the three-layer architecture was already implemented, and by 2026-09-14 `PRODUCT.md` had separately recorded a binding decision on headless component primitives that this ADR's open constraints failed to reflect. Both are reconciled below rather than left to drift further out of sync with the codebase.

## Decision

**Three-layer token architecture — implemented as proposed.** Tokens follow primitive → semantic → `@theme inline`, applied consistently across `src/styles/tokens/colors.css`, `spacing.css`, and `typography.css`:

- **Tier 1 (primitives):** raw values in `:root` (e.g. `--primitive-cream`, `--primitive-graphite`), never referenced directly by components.
- **Tier 2 (semantic aliases):** named-meaning tokens built from primitives (e.g. `--color-ground`, `--color-ink`, `--color-ink-secondary`, `--color-ink-ghost`, `--color-active`), used in `style` props only where a Tailwind class doesn't yet exist.
- **Tier 3 (`@theme inline`):** bridges semantic tokens to Tailwind utility generation (`text-ink`, `bg-ground`, `border-ghost`, etc.).

**Headless component primitives — Base UI, adopted.** `PRODUCT.md`'s Component architecture section already records this as binding: _"Base UI — headless, unstyled component primitives for all interactive elements (Button, Menu, Dialog, Select, etc.); ensures accessibility compliance without fighting a pre-styled system."_ `@base-ui/react` (the current, non-deprecated package — not `@base-ui-components/react`) is installed at `^1.8.0`. This ADR adopts that decision rather than re-deciding it, and adds the implementation split that follows from it:

- **Use Base UI** for components with genuine hidden ARIA state machines: `Checkbox`, `Radio`/`RadioGroup`, `Field`/`Fieldset`. These are exactly where a headless primitive earns its keep — correct ARIA wiring without fighting a pre-styled system.
- **Do not wrap Base UI** for `Button`. A plain `<button>` has no hidden state to manage; it needs a variant contract (primary / secondary / text-action), not a headless primitive.
- This split was confirmed in practice by the approved atom-system comp set (`.docs/design/comps/lab-design-system-atoms-comp-v1.html`, approved 2026-09-14), which specifies Button, Checkbox, Radio, and Field/Fieldset on exactly these terms.

**Token naming — resolved by existing convention.** All semantic tokens are namespaced by domain (`--color-*`, `--spacing-*`, `--line-*`, `--text-*`, `--tracking-*`) and bridged into `@theme inline` under Tailwind's own prefixes. No collision with Tailwind v4's internal `--color-*` namespace has occurred in practice — semantic tokens shadow the default scale intentionally (see `.claude/rules/tailwind.md`), which is the documented, working convention going forward.

## Open constraints (not resolved by this ADR)

- **Dark mode strategy** (`.dark` class vs. `prefers-color-scheme`) remains unresolved. `src/styles/themes/index.css` exists only as a placeholder. This does not block accepting the rest of this ADR — dark mode is deferred to its own future decision when that work actually begins.

## Consequences

**Positive:**

- The token architecture already in the codebase now has an accepted ADR behind it, instead of an open one that contradicted observed reality.
- The Base UI decision is no longer split between an "already binding" note in `PRODUCT.md` and an "unresolved constraint" in this ADR — one accepted decision, one place to update if it changes.
- Future atom components (Checkbox, Radio, Field, Fieldset) have a clear, agent-readable rule for when to reach for Base UI and when a plain element is sufficient, preventing both under-use (accessibility bugs re-implementing ARIA by hand) and over-use (wrapping trivial elements that don't need it).

**Negative / Trade-offs:**

- Dark mode remains explicitly unplanned; any component work that assumes `.dark`-class theming will need a follow-up ADR first.
- Retrofitting existing hand-rolled interactive elements (`FilterInput`, `TagFilterDrawer`) onto this decision is not covered here — it is implementation work tracked against the `/lab/design-system/atoms` and `/molecules` surface brief, not this ADR.

## Verification

- [x] `src/styles/tokens/{colors,spacing,typography}.css` implement primitive → semantic → `@theme inline` for every token category (already true; verified against current file contents 2026-09-14).
- [x] `@base-ui/react` is present in `package.json` `dependencies` at a non-deprecated version (`^1.8.0`, confirmed 2026-09-14).
- [x] Any new `Checkbox`, `Radio`/`RadioGroup`, or `Field`/`Fieldset` component added under `src/components/ui/` imports from `@base-ui/react` rather than hand-rolling ARIA state. (Verified 2026-09-18: `src/components/ui/Checkbox.tsx` and `src/components/ui/Radio.tsx` (PR 3), plus `src/components/ui/Field.tsx` and `src/components/ui/Fieldset.tsx` (PR 4) of the atom/interaction-system track — all import from `@base-ui/react/checkbox`, `@base-ui/react/radio(-group)`, `@base-ui/react/field`, and `@base-ui/react/fieldset` respectively, no hand-rolled ARIA state.)
- [x] Any new `Button` component does **not** import `@base-ui/react` — a plain `<button>` plus a variant contract is sufficient; importing Base UI here should be treated as a review flag, not a default. (Verified 2026-09-17: `src/components/ui/Button.tsx`, PR 2 of the atom/interaction-system track — plain `<button>`, `cn()`-backed variant class-map, no Base UI import.)
- [ ] No component introduces `.dark`-class or `prefers-color-scheme` logic without first opening a new ADR — this ADR explicitly leaves dark mode strategy open.

## Related

- `PRODUCT.md` — Component architecture section (source of the binding Base UI decision this ADR adopts)
- `DESIGN.md` — `## Interaction` section, The Live Line Rule (interaction-state rules for components built on this token layer)
- ADR 004 — Component Structure and File Naming Conventions
- `.docs/design/comps/lab-design-system-atoms-comp-v1.html`, `lab-design-system-molecules-comp-v1.html`, `lab-design-system-comp-v2.html` — approved comps demonstrating this decision in practice
- `.docs/design/2026-09-14-critique-ink-ghost-contrast-and-atom-affordance.md` — critique that surfaced the drift between this ADR and `PRODUCT.md`

## More Information

- **2026-09-14:** Status changed from `proposed`/"Deferred" to `accepted`. Reconciled during a design-director session that produced and approved an atom-component comp set (Button, Checkbox, Radio, Field/Fieldset) built on Base UI. Two of the three original open constraints (Base UI adoption, token naming) are resolved above; dark mode strategy remains genuinely open and is carried forward, not silently dropped.
