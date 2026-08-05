---
number: 9
title: Design System Framework
status: proposed
date: 2026-08-05
tags: [design-system, tailwind, accessibility, components]
---

## Context

Stage 10 (Layout + Tailwind design) requires a decision on the component framework and design token architecture. The portfolio has strict constraints: WCAG 2.1 AA mandatory (axe-core enforced in CI), Tailwind CSS v4, Next.js App Router, and Cypress Component Testing with `cy.mountAccessible()`.

The portfolio is also an engineering artefact. The component approach must be defensible as a demonstration of design system thinking, not just a library installation.

Options evaluated: Radix UI (headless), Ark UI / Park UI (token-first), shadcn/ui (Radix + pre-styled), Catalyst (Tailwind Labs), DaisyUI, Flowbite. Full survey in `.local/planning/2026-08-05-design-system-survey.md`.

## Decision

**Use Radix UI headless primitives + custom Tailwind CSS v4 styling + a three-layer CSS variable design token architecture.**

For complex patterns not covered by Radix (e.g. data tables, command palette), selectively adopt shadcn/ui component code as a starting point — copying and modifying it rather than taking it as a dependency.

### Design Token Architecture

Three layers, all implemented as CSS custom properties in `src/design-system/tokens.css`:

1. **Primitive tokens** — raw values (`--primitive-teal-600: #0d9488`)
2. **Semantic tokens** — intent mapping (`--color-accent: var(--primitive-teal-600)`)
3. **Component tokens** — usage mapping (`--button-bg: var(--color-accent)`)

Tailwind v4's `@theme inline` directive in `globals.css` exposes semantic tokens as Tailwind utility classes.

### Component Structure

```
src/components/ui/        ← Radix-based primitives (Dialog, Tabs, Dropdown, etc.)
src/design-system/        ← Token definitions + showcase components
```

Every component in `src/components/ui/` must:
- Have a co-located `.spec.cy.tsx` test
- Pass `cy.mountAccessible()` + `cy.checkA11y()` for all variants
- Accept a typed `labels` prop for all user-facing strings (i18n rule — ADR 006)

## Rationale

- **Radix over shadcn/ui:** Radix gives maximum control for distinctive design. shadcn/ui's pre-styled defaults fight the custom aesthetic.
- **Radix over Ark UI:** Radix is more mature (4+ years, battle-tested). Ark UI's token architecture is admirable but the library is newer and less proven.
- **Custom tokens over a token generation tool:** CSS variables in `@theme` are sufficient for a portfolio site and require no additional build tooling.
- **Accessibility:** Radix primitives are built by accessibility specialists; keyboard nav, focus management, and ARIA attributes are guaranteed. This removes the accessibility implementation burden from individual developers.

## Consequences

- More initial styling work than shadcn/ui (no pre-styled defaults).
- Radix covers ~15 interactive primitives (Dialog, Dropdown, Tabs, Select, etc.). Non-interactive layout components (Card, Badge, Button) are custom-built.
- The design system becomes a first-class concern — every component is authored and owned.
- A `/design-system` showcase route (Stage 11) documents the token architecture and components as a living portfolio artefact.

## Alternatives Rejected

- **DaisyUI / Flowbite:** Generic appearance, WCAG A only, not appropriate for a distinctive portfolio.
- **Catalyst:** Opinionated structure, ~25 components, fights custom design goals.
- **Tremor:** Data visualisation focus, WCAG A, not applicable to this portfolio's needs.
