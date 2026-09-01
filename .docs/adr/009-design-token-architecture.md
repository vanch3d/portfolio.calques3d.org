---
number: 9
title: "Three-Layer Design Token Architecture"
status: decided
date: "2026-08-13"
tags: ["design-system", "tailwind", "css", "tokens", "theming", "dark-mode"]
supersedes: []
---

# ADR 009 — Three-Layer Design Token Architecture

**Date:** 2026-08-13
**Status:** Decided

## Context

The portfolio requires a coherent visual identity across five distinct sections (Home, CV, Research, Engineering, Lab) with support for:
- Light and dark mode (user-controlled toggle, not `prefers-color-scheme`)
- A Lab A/B accent experiment (teal default, amber override)
- WCAG 2.1 AA colour contrast in both modes
- Tailwind CSS v4 utility classes driven by the token system
- Storybook documentation and a future Lab token explorer component

Tailwind v4 abandons `tailwind.config.ts` in favour of a CSS-first `@theme` block, which changes how custom tokens integrate with the utility system.

## Decision

Adopt a three-layer token architecture, implemented entirely in `src/app/globals.css`:

### Layer 1 — Primitive Tokens (`--p-*`)
Raw colour values keyed by palette and step (e.g. `--p-teal-600: #0d9488`). These are the only place hex codes appear. They are **never referenced directly in components** — they exist only to be aliased by Layer 2.

```css
--p-neutral-0:   #ffffff;
--p-teal-600:    #0d9488;
--p-amber-400:   #fbbf24;
```

### Layer 2 — Semantic Tokens
Named by intent, not by visual appearance (e.g. `--color-accent`, not `--color-teal`). Declared on `:root` for light mode and overridden in `.dark` for dark mode. A `[data-accent="amber"]` override swaps the accent palette for the Lab experiment.

```css
:root          { --color-accent: var(--p-teal-600); }
.dark          { --color-accent: var(--p-teal-400); }
[data-accent="amber"]      { --color-accent: var(--p-amber-600); }
[data-accent="amber"].dark { --color-accent: var(--p-amber-400); }
```

Semantic tokens cover: surface hierarchy, text, border, accent, state, glass morphism, shadows, radius, spacing, and layout constants.

### Layer 3 — Tailwind `@theme inline` Mapping
An `@theme inline` block bridges semantic CSS custom properties into Tailwind utility classes:

```css
@theme inline {
  --color-accent: var(--color-accent);
  --shadow-md:    var(--shadow-md);
}
```

This produces utilities such as `bg-accent`, `text-accent`, `shadow-md` that automatically respond to `.dark` and `[data-accent]` at runtime without any JS class toggling.

## Dark Mode Strategy

Dark mode is toggled via a `.dark` class on `<html>` (not `prefers-color-scheme` media query). This allows:
1. User-controlled toggle that persists across sessions
2. System preference as the default (read once at mount; stored in `localStorage`)
3. A single CSS mechanism that works for both SSR and client hydration without mismatch

`html.theme-ready` enables smooth `150ms` colour transitions after the first paint, preventing the flash of unstyled content.

## TypeScript Mirror

`src/design-system/tokens.ts` exports typed arrays of all token names. This is used by:
- `scripts/validate-tokens.mjs` for integrity checks
- Future Lab token explorer for runtime enumeration
- Storybook controls

The TypeScript file is documentation only — `globals.css` is the authoritative source.

## Token Validation

`scripts/validate-tokens.mjs` (run via `pnpm run validate:tokens`, included in `pnpm run validate`) checks:
1. All token names in `tokens.ts` exist as declarations in `globals.css`
2. Semantic tokens do not contain bare hex codes (must reference `--p-*`)
3. Semantic tokens in `globals.css` not listed in `tokens.ts` are reported as warnings

## Consequences

**Good:**
- Single source of truth for all colour decisions
- Dark mode and accent swaps are pure CSS; zero JavaScript involved
- Tailwind utilities (`bg-accent`, `text-text-muted`, etc.) auto-respond to theme
- WCAG contrast can be audited at the semantic token level without touching components
- Primitives can be swapped (e.g. from Teal to Indigo) by updating Layer 1 only

**Trade-offs:**
- Tailwind v4 `@theme inline` syntax is less familiar than v3 `tailwind.config.ts`
- `--color-bg` (semantic) clashes with Tailwind's internal `--color-*` namespace — careful naming avoids collisions, but the overlap requires attention when upgrading Tailwind
- The `tokens.ts` mirror requires manual updates when globals.css changes; the validation script catches drift but does not auto-generate the TS file

## Alternatives Considered

**CSS Modules per component** — rejected: no shared token system, themes become fragile.

**JS-in-CSS (Emotion/styled-components)** — rejected: incompatible with App Router Server Components and Tailwind v4 direction.

**Single flat token set without layers** — rejected: flat `--color-teal-600` names break when switching accents; semantic naming is required for the A/B experiment.

**Tailwind plugin for dark mode** — rejected: `.dark` class strategy is already the Tailwind v4 recommended approach; no plugin needed.
