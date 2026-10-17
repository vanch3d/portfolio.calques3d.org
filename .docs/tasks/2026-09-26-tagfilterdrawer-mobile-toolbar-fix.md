---
date: 2026-09-26
tracker: .docs/tasks/TRACKER.md
epic: epic/design-compass-app
branch: feat/atom-interaction-system
status: ready-for-engineering
agent: nextjs-engineer
supersedes: none (fix on top of scope E, .docs/tasks/2026-09-26-construction-panel-reuse-retrofit.md)
---

# Engineering handoff — TagFilterDrawer mobile toolbar fix

## Read this first

Scope E (`ConstructionPanel`/`TagFilterDrawer` reuse retrofit) landed and is visually correct on
desktop, but Nicolas found the mobile full-screen overlay regressed against the pre-retrofit
behavior, from screenshots comparing desktop vs. mobile:

1. **`NONE` disappears on mobile.** `TagFilterDrawer.tsx`'s `none-button` currently carries
   `max-sm:hidden`, hiding it whenever the drawer is a mobile overlay — there is then no way to
   clear all selected tags without closing the drawer and using something else. It must be visible
   in both modes.
2. **`CLOSE` is in the wrong place.** It currently lives inline inside the `drawer-header` toolbar
   row (`flex flex-wrap items-center gap-lg`, alongside the search input and the view-mode tabs),
   `ml-auto`, replacing `NONE` at that breakpoint (`hidden max-sm:flex`). Nicolas wants it moved to
   a **dedicated modal header**, at the very top of the mobile overlay, visually separated from the
   toolbar/content below it by a border — not mixed into the same row as the search/filter
   controls.
3. **The toolbar's responsive layout is fragile.** With the search input forced full-width on
   mobile (`max-sm:w-full`) and two different `ml-auto` elements swapping via `hidden`/`max-sm:flex`
   depending on breakpoint, the wrapped result doesn't read as a clean, deliberate layout.
4. **Core requirement, explicit from Nicolas:** _switching between the mobile (full-screen modal)
   and desktop (inline embedded) presentation must not change the container's content._ The toolbar
   (search, view-mode tabs, `NONE`) and the tag groups below it must be identical markup/behavior in
   both modes. Only the outer chrome differs: mobile gets a full-screen overlay with its own header
   bar; desktop stays the inline bordered box `ConstructionPanel` already provides.

Read `src/components/ui/TagFilterDrawer.tsx` in full before editing — this doc references exact
current structure (trigger render-prop at the top, `ConstructionPanel` `children` starting at the
`drawer-header` div) that you should confirm still matches before changing it.

## What's decided

- **New mobile-only header bar**, rendered as the _first_ element inside `ConstructionPanel`'s
  `children` (i.e. above the existing `drawer-header` toolbar div, inside the same JSX fragment
  `TagFilterDrawer` currently returns as children). Visible only in the mobile overlay
  (`hidden max-sm:flex`, same idiom as the current mobile-only `CLOSE` button), containing:
  - A title matching the trigger's label (`t('toggle_label')`, i.e. "TAGS") plus the active-tag
    count badge, reusing the exact badge visual from `renderTrigger`'s `toggle-badge` (same classes:
    `inline-flex items-center justify-center bg-active font-label text-ground tabular-nums h-badge
min-w-badge px-badge-pad py-0 text-badge`) — so the modal header echoes what the trigger showed
    before the drawer opened.
  - The `CLOSE` button, moved here verbatim (same `onClick={() => setIsOpen(false)}`,
    `aria-label={t('toggle_close_aria')}`, `data-testid="drawer-close-mobile"`,
    `{t('drawer_close_mobile')}` label).
  - A `border-b-medium border-ink` (or equivalent line-weight token — check
    `.claude/rules/tailwind.md` for the right utility) separating this header from the toolbar/body
    below it, with appropriate bottom margin/padding so the separation reads clearly, not just as a
    thin rule touching the search input.
- **`CLOSE` is removed entirely from the `drawer-header` toolbar row.** That row keeps only: search
  `FilterInput`, view-mode tabs, `NONE`.
- **`NONE`'s `max-sm:hidden` is removed.** It renders identically (when `activeCount > 0`) in both
  mobile and desktop — this is the concrete fix for "switching modes must not change the container's
  content."
- **Toolbar (`drawer-header`) layout**: keep `FilterInput` at `max-sm:w-full` (forces its own line
  on narrow viewports, as today) — but re-verify wrapping behavior now that only one `ml-auto`
  element (`NONE`) remains instead of two swapping via `hidden`/`max-sm:flex`. If `view-mode-tabs`
  still doesn't fit comfortably next to `NONE` on narrow phone widths once `CLOSE` is out of this
  row, consider stacking view-mode-tabs and `NONE` are already same flex-wrap group and should
  settle naturally — check visually (start dev server, resize) rather than assuming; adjust with
  `flex-wrap`/`gap` tuning only if actually broken, don't restructure the row's DOM order without a
  visual reason to.
- **No new component or `ConstructionPanel` API change needed** for this — this is entirely inside
  `TagFilterDrawer`'s own `children` content. `ConstructionPanel`'s `trigger`/`open`/`onOpenChange`
  contract from scope D/E is untouched.
- **i18n**: reuse existing `messages/en.json` keys under the `TagFilterDrawer` namespace
  (`toggle_label`, `toggle_close_aria`, `drawer_close_mobile`, `none_aria`, `none_button`) — no new
  strings should be needed. If the header title needs distinct copy from the trigger's `toggle_label`
  (e.g. a longer "Filter by tags" vs. the trigger's short "TAGS"), that's a judgment call — default
  to reusing `toggle_label` unless it reads badly in context, and flag the decision in your report
  if you deviate.

## Done criteria

- [ ] `NONE` is visible in both mobile and desktop presentations whenever `activeCount > 0` — no
      `max-sm:hidden` on it.
- [ ] `CLOSE` only appears in the new mobile-only header bar, not in the toolbar row.
- [ ] The mobile header bar has a visible border/separation from the content below it.
- [ ] Toolbar (search/tabs/`NONE`) and tag-groups markup is identical between mobile and desktop —
      only the mobile-only header bar and the existing `ConstructionPanel`-level `className`
      overrides (full-screen positioning) differ.
- [ ] `TagFilterDrawer.spec.cy.tsx` updated for the new header (a `drawer-close-mobile` testid moves
      location; add assertions that `NONE` is present/clickable in the mobile-simulated viewport if
      the existing spec has a mobile-viewport test block, or add one if it doesn't already exist —
      check first).
- [ ] `pnpm validate` green, axe-clean (the new header bar needs a visible focus order — `CLOSE`
      should be reachable and make sense as the first/near-first focusable element when the mobile
      overlay opens), `tester` spawned per normal process.
- [ ] No git commands — stays as uncommitted working-tree state on `feat/atom-interaction-system`
      per the branch's standing rule.
- [ ] `TRACKER.md` Track I updated with a completion entry for this fix.
