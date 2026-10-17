Status: open
Type: task

# Button pressed-state outline conflicts with the `:focus-visible` ring

Spec: `.docs/tasks/2026-09-14-atom-interaction-system.md` (Track I, PR 2)

`Button.tsx`'s pressed state is drawn with an outward-facing `outline` (`live-line-pressed` utility, `src/styles/utilities/index.css`) instead of growing `border-width`, to avoid a box-model layout shift bug found during PR 2's live testing. That fix introduced a real WCAG 2.4.7 concern: the pressed-state `outline` and the project-wide `:focus-visible` ring (`src/styles/base/reset.css`) share the same CSS property, so pressing a keyboard-focused button (Space/Enter) overwrites the focus ring for the press duration.

A `::after` pseudo-element fix was tried and reverted — it verified correct in isolation but rendered asymmetrically in the real page layout, cause undiagnosed. Needs a dedicated a11y pass, not a blind retry of the same approach.

## Acceptance

- Keyboard-focused + pressed state is visually distinguishable from both plain-pressed and plain-focused states, without either indicator disappearing.
- No regression to the box-model layout-shift issue the outline mechanism was introduced to fix.
