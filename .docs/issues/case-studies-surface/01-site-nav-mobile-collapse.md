Status: open

# Site nav has no mobile pattern; needs a collapse

Spec: `.docs/tasks/2026-11-13-case-studies-surface.md` (Stage 3).

## Problem

`SiteNav.tsx` has no mobile pattern. At 375px, five links plus gaps already exceed about 327px of available width. Adding "Case studies" (about 92px) makes it worse. Found by the design-director while drawing the Stage 3 comp.

## Scope

- Design a mobile collapse for the main nav. The design-director's proposal in `.docs/design/comps/case-studies-entry-points-comp-v1.html` is a starting point only: a "Menu" button, a panel below the bar with flat 44px rows, ghost dividers and a heavy bottom rule.
- Own comp, own PR. Not part of the case-studies build.
- The case-studies PR adds the "Case studies" link to the desktop nav only.

## Related, not in scope

- The nav's contact link is red, and the home page's 2018 ticks are red. The nav is scroll-revealed over the home page, so two reds can show together. The era NavLinks also turn red on hover.
- The real nav has no current-page state.
