---
number: 11
title: 'CSS Animation and Accessibility Testing Contract'
status: accepted
date: '2026-08-16'
decision-makers: vanch3d
tags: ['accessibility', 'testing', 'animation', 'motion', 'cypress', 'axe-core']
---

# ADR 011 — CSS Animation and Accessibility Testing Contract

**Date:** 2026-08-16
**Status:** Decided

## Context

The D7 motion layer introduced CSS enter animations (`reveal-up`, `fade-in`) applied
to components via `animation-fill-mode: both`. This fill mode causes the element to
adopt its `from` keyframe values **at first paint**, before the animation has
progressed. For an opacity-based entrance animation, the element starts at
`opacity: 0`.

Cypress Component Tests and E2E smoke tests both run `cy.checkA11y()` (axe-core)
immediately after mounting or navigating. At that instant, animated elements are
at or near `opacity: 0`. axe correctly computes the colour contrast of text at
near-zero opacity blended against the background — and correctly flags a WCAG AA
violation, because the text would be invisible to a sighted user at that exact
moment.

The apparent choices were:

1. **Remove opacity from animations** — keep only transform. Preserves testability
   but removes a deliberate design feature. Rejected: this is a product compromise
   driven by a testing constraint, not a design decision.

2. **`cy.wait()` before every axe check** — pause for animation to complete.
   Rejected: `cy.wait()` with arbitrary timeouts is an anti-pattern; ESLint's
   `cypress/no-unnecessary-waiting` rule (and common project conventions) prohibit it.
   Tests become brittle and slow.

3. **Collapse animation durations in the test environment** — keep animations intact,
   but make them complete within one browser frame so axe always sees the final state.

## Decision

Option 3. A `window:before:load` hook in both `cypress/support/component.ts` and
`cypress/support/e2e.ts` injects a `<style>` block that sets:

```css
*,
*::before,
*::after {
  animation-duration: 0.001ms !important;
  animation-delay: 0ms !important;
}
```

At 0.001ms duration, every CSS animation completes within the same browser frame
it starts. By the time axe runs its asynchronous DOM traversal, all elements have
reached their `to` keyframe (resting state). The animation infrastructure — classes,
keyframes, stagger delays, `prefers-reduced-motion` guards — remains completely
intact and is exercised by the test environment.

## Principle

**Accessibility tests assert the final/resting state of a component, not
transient animation states.**

CSS animations are a progressive enhancement. The content they reveal is what
matters for accessibility. The animated journey from hidden to visible is a visual
concern, not an accessibility one — provided that:

1. The resting state meets WCAG AA requirements (verified by axe with this approach).
2. The animation is suppressed for users who prefer reduced motion (verified by
   Playwright `reducedMotion: "reduce"` tests in `tests/e2e/motion.spec.ts`).
3. The animation does not trap keyboard focus or hide interactive elements for
   longer than a perceptible moment (structural concern, not a duration concern).

Separating these concerns allows each to be tested correctly:

| Concern                   | Tool                       | How                                          |
| ------------------------- | -------------------------- | -------------------------------------------- |
| Resting a11y state        | Cypress axe                | Animations collapsed to 0ms in support hooks |
| Reduced-motion compliance | Playwright                 | `emulateMedia({ reducedMotion: "reduce" })`  |
| Animation visual fidelity | (future) visual regression | Storybook + Chromatic/Percy                  |

## Consequences

- All existing Cypress CT and E2E axe checks continue to test the final component
  state, as they did before the motion layer was introduced.
- New components that use `animation-fill-mode: both` do not require special test
  adaptations — the support hook handles them globally.
- The hook does not affect transition durations (hover states, theme toggle). If
  transitions cause similar axe timing issues in future, `transition-duration` can
  be added to the injected reset.
- This pattern is the community-standard approach used by Testing Library,
  Storybook's accessibility addon, and most large-scale React test suites.
