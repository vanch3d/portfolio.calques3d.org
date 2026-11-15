Status: resolved

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

## Proposed solution for the images PR (simple version)

Scope: option B, kept minimal. The presentation mode (`.local/planning/case-study-presentation-mode/`) is the
better long-term answer to "read the plates at a useful size" and does not depend on this ticket; the dialog
below is small, stays useful on the plain page, and its component can be reused by the presentation mode's
scene overview.

### Decisions (answers to the design questions)

| Question                                                      | Decision                                                                                                                     | Why                                                                                                                                             |
| ------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Trigger                                                       | The whole image is one `<button>`; a small corner glyph is a visual hint only (`aria-hidden`), so there is a single tab stop | Large target, no second control to tab to; `cursor-zoom-in`                                                                                     |
| Size in the expanded view                                     | Scale to fit the viewport, **never above natural size** (`max-w-full max-h-full`, `w-auto h-auto`)                           | The local PNGs range from about 500 to 1400 px wide; upscaling the small ones only blurs them. No zoom/pan: that is the presentation mode's job |
| Previous / next                                               | No, one figure at a time                                                                                                     | Keeps the component stateless                                                                                                                   |
| Below `lg`                                                    | Same trigger                                                                                                                 | The plate is full column width but still small on a phone; a full-screen view helps most there                                                  |
| Pending and unavailable plates                                | No trigger                                                                                                                   | Nothing to expand                                                                                                                               |
| Wide-viewport mitigation (`--margin-plate-w` growing at `xl`) | Out of scope                                                                                                                 | Separate, cosmetic                                                                                                                              |

### Technical considerations (checked against the repo)

- **Base UI `Dialog` is installed** (`@base-ui/react`, parts: Root, Trigger, Portal, Backdrop, Popup, Title,
  Description, Close, Viewport). Nothing in `src/` uses it yet: `TagFilterDrawer` is built on `Collapsible`, so
  this is the first dialog. Modal by default: focus trap, Esc, outside press, scroll lock and return of focus to
  the trigger come from the primitive. Do not hand-roll any of them.
- **No new data.** `CaseFigure` (client) already holds the resolved `{src, width, height, comment}`. For Piwigo
  images `src` is the original `element_url`, so the expanded view is already full resolution. The same URL is
  already cached by the inline `<img>`.
- **Stacking.** The nav is `z-nav` (100). The popup must sit above it, so a new `--z-index-overlay` token
  (for example 200) and a `z-overlay` `@utility` are needed, following the `z-nav` / `z-rail` precedent
  (Tailwind v4 generates no z-index utilities). `TagFilterDrawer` uses a raw `max-sm:z-50`, which is not a
  precedent to copy. Render through `Dialog.Portal` so no `overflow` or `sticky` ancestor clips it.
- **Backdrop colour.** A dark scrim is not in the five-colour palette. Proposal: an opaque `bg-ground` sheet
  (the drafting paper) with the plate on it, like a full-page version of the existing frame. Flat, no shadow, no
  new colour token. This is the one visual decision to confirm.
- **Accessibility.** `Dialog.Title` = "Fig. n" plus the caption; the expanded `<img>` repeats the inline `alt`.
  The trigger's accessible name is "Enlarge figure n". The close control is a visible text button (`label`
  style), reachable first. Visible focus comes from the global focus ring (do not re-declare it).
- **Progressive enhancement.** The image stays server-rendered inside the trigger button; the dialog content is
  mounted only when open. No JS means a plain image, as today.
- **Motion.** None. The project has no motion tokens and no `prefers-reduced-motion` handling yet, so the
  dialog appears and disappears without a transition.
- **i18n.** The new component owns a `FigureLightbox` namespace (`expand`, `close`, `title`); `CaseFigure`
  does not pass labels.
- **Layout shift.** Scroll lock removes the scrollbar; check that Base UI's lock compensates (visual check on
  Windows, where scrollbars take space).
- **Tests have a live-network trap.** The calques3d images come from Piwigo, fetched at render time, and the
  Cypress E2E runs against an MSW server with no Piwigo mock. The E2E must use a case whose images are local
  (for example the mapping-editor or theme-and-identity case).

### Wireframe

```
+------------------------------------------------------------------+
|  Fig. 2                                                  [ Close ] |
|                                                                    |
|            +-------------------------------------+                 |
|            |                                     |                 |
|            |   image, scaled to fit, never       |                 |
|            |   larger than its natural size      |                 |
|            |                                     |                 |
|            +-------------------------------------+                 |
|            Fig. 2   The wireframe, the view the classroom uses     |
+------------------------------------------------------------------+
```

### Implementation plan

1. **Token and utility.** Add `--z-index-overlay` in `src/styles/tokens/spacing.css` and `@utility z-overlay`
   in `src/styles/utilities/index.css`.
2. **`FigureLightbox.tsx`** in `src/app/case-studies/_components/` (client, `FigureLightbox` namespace). Props:
   `no`, `src`, `alt`, `width?`, `height?`, `caption?`, `children` (the inline image, which becomes the trigger
   content). Built on `Dialog.Root / Trigger / Portal / Popup / Title / Close`. It is kept generic on purpose so
   the presentation mode can reuse it; promote it to `src/components/ui/` at that point, not before.
3. **`CaseFigure.tsx`.** Wrap the resolved `<img>` in `FigureLightbox`. The pending and unavailable branches are
   untouched.
4. **Strings** in `messages/en.json`.
5. **Tests**
   - Cypress CT `FigureLightbox.spec.cy.tsx`: renders trigger, opens, shows image and caption, Esc closes, focus
     returns to the trigger, Tab stays inside, axe closed and open.
   - `CaseFigure.spec.cy.tsx`: resolved plate has a trigger; pending and unavailable plates do not; axe.
   - Cypress E2E on a local-image case: click the image, dialog visible, Esc, focus back. Add to the existing
     case-study E2E spec.
6. **Docs.** Resolve this ticket, tick the TRACKER (required when `src/` is staged), mention the dialog in the
   case-study authoring guide only if authors need to know (they do not).
7. **Verification.** `tsc`, Vitest, the CT specs above, `validate`, one visual pass on a Piwigo image and on a
   small local image (no upscaling) at desktop and phone widths.

Estimate: half a day. Risks: the stacking token (small), scroll-lock layout shift (check), first use of
Base UI `Dialog` in the repo (the CT portal and focus assertions are the unknowns).

### Not in this PR

Zoom and pan, previous/next, a native Fullscreen button (option C), animations, widening the margin column,
changes to the pending-plate handling.
