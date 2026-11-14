Status: open

# Expand a case-study figure and its caption to the full screen, on demand

Spec: `.docs/tasks/2026-11-13-case-studies-surface.md`.

## Problem

On large viewports the margin plates sit in a narrow column (`--margin-plate-w`, 280px). The screenshots are dense application UI (around 800px wide), so they are scaled down until their text cannot be read. The layout itself works, and below `lg` the plates are inline at full column width. There is no way to see a figure at a readable size.

## Wanted

An on-demand expansion of one figure, with its caption and "Fig. n" number, across the whole viewport, closed with Esc, a close control or a click outside.

## Options

- **A. Native Fullscreen API on the `<figure>`** (`requestFullscreen`). No new component, and the browser handles Esc. Caveats: iPhone Safari does not support it for non-video elements, the caption needs `:fullscreen` styling, and the user leaves the page chrome entirely.
- **B. A dialog lightbox built on Base UI `Dialog`** (`@base-ui/react`, already used by `Collapsible`, `Checkbox`, `Radio`, `Field`). Works on every device, and gives focus trapping, Esc, scroll lock and ARIA for free. Needs a design: backdrop, close control, caption placement, how the image is sized. Recommended by the project convention (reuse the Base UI primitive, per the earlier overlay guidance).
- **C. B first, with a native fullscreen button inside the dialog later**, if images ever need to go beyond the viewport.

A cheaper complementary mitigation: let `--margin-plate-w` grow on very wide viewports (for example `xl` and above). It does not replace the expansion.

## Design questions (to settle with an inventory of existing elements, before any comp)

- Trigger: a small control on the plate corner, the whole image, or both. It must be keyboard reachable and visibly focusable.
- Does the expanded view show the image at natural size, scaled to fit, or allow zoom and pan for the densest screenshots?
- Previous / next plate inside the expanded view, or one figure at a time?
- Below `lg` the plate is already full column width: show the trigger there too?
- Pending plates (`[!NOTE]` placeholders) and the "image unavailable" frame have nothing to expand.

## Implementation notes

- `CaseFigure.tsx` is a client component and already receives the resolved `{src, width, height, comment}`, so the dialog can render the same data without new fetching (ADR 021 holds).
- New strings go in a `CaseFigure` or dedicated namespace (open, close, expanded label).
- Tests: a Cypress CT spec per new component, with axe, covering open, Esc, focus return to the trigger and focus trap.
