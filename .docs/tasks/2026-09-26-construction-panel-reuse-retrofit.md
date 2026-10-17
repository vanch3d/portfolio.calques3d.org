---
date: 2026-09-26
tracker: .docs/tasks/TRACKER.md
epic: epic/design-compass-app
branch: feat/atom-interaction-system
status: ready-for-engineering
agent: nextjs-engineer
supersedes: .docs/tasks/2026-09-18-collapsible-atom-retrofit.md (PR C only — TagFilterDrawer bypassing ConstructionPanel is reversed; PR A/Collapsible atom and PR B/ConstructionPanel-on-Collapsible stand as shipped)
---

# Engineering handoff — ConstructionPanel becomes the reusable molecule; TagFilterDrawer consumes it

## Read this first

This is a **handoff document for an engineering agent** (`nextjs-engineer` or equivalent).
Scope C of `.docs/tasks/2026-09-18-collapsible-atom-retrofit.md` already landed in the working
tree: `TagFilterDrawer.tsx` composes `CollapsibleRoot`/`CollapsibleTrigger`/`CollapsiblePanel`
directly, in parallel with `ConstructionPanel.tsx` doing the same. That was the _documented_
decision at the time (2026-09-18 doc: "`ConstructionPanel`'s fixed trigger/panel styling doesn't
fit the drawer's visual requirements, only its underlying behavior does"). Nicolas reviewed the
result on 2026-09-26 and reversed that call: two components independently composing the same
primitive, with two different panel visuals, is the exact "don't reinvent the wheel" anti-pattern
the branch is supposed to be closing out, not an acceptable outcome of "one surface at a time."

Before writing any code, read in this order:

1. This document, in full.
2. `src/components/ui/Collapsible.tsx` — unchanged, still the shared primitive. Not touched by this doc.
3. `src/components/ui/ConstructionPanel.tsx` + `ConstructionPanel.spec.cy.tsx` — current implementation (scope B), to be extended, not rewritten.
4. `src/components/ui/TagFilterDrawer.tsx` + `TagFilterDrawer.spec.cy.tsx` — current implementation (scope C), to be refactored to consume `ConstructionPanel`.
5. `src/app/lab/design-system/page.tsx` and `molecules/page.tsx` — the two existing `ConstructionPanel` call sites; their usage must need zero edits.

## Why this exists

Three explicit criteria from Nicolas, 2026-09-26 review:

1. `ConstructionPanel` and `TagFilterDrawer` **must use the same Base-UI-driven component for collapse.** (Already true at the `Collapsible`-atom level — not true at the molecule level, since `TagFilterDrawer` bypasses `ConstructionPanel` entirely.)
2. They **must use the same expand-box styling.** Two different border/background treatments existing side by side is not acceptable.
3. **`ConstructionPanel` is the reusable molecule; `TagFilterDrawer` must consume it**, not reimplement its composition. This requires `ConstructionPanel` to accept a custom trigger.

Clarifying decisions made with Nicolas before this doc was written (do not re-litigate):

- **Mobile overlay**: the shared box styling (border treatment, `bg-ground-warm`) applies **desktop-only**. `TagFilterDrawer`'s mobile full-screen overlay (`max-sm:fixed max-sm:inset-0 …`) stays full-bleed, overriding the box treatment at that breakpoint via its own `className`.
- **Trigger API shape**: a render-prop that **fully replaces the trigger row** when supplied — not a structured multi-slot API. Caller owns the entire row's markup in that case, same idiom as `children` owning the panel body today.

## What's already decided (do not re-litigate)

- **`ConstructionPanel`'s existing public contract stays valid as a default path.** `toggleLabel`, `closedHint`, `defaultOpen`, `children`, `className` keep working exactly as today when the new `trigger` prop is omitted — the two existing call sites (`design-system/page.tsx`, `molecules/page.tsx`) need **zero edits**.
- **New optional props on `ConstructionPanelProps`:**
  ```ts
  trigger?: (state: { open: boolean }) => ReactNode   // fully replaces the built-in toggleLabel/chevron/closedHint row when supplied
  open?: boolean                                        // controlled mode
  onOpenChange?: (open: boolean) => void
  ```
  `open`/`onOpenChange` follow the same uncontrolled-by-default pattern as Base UI's own `Collapsible.Root` — when `open` is omitted, `ConstructionPanel` stays uncontrolled via its existing internal `useState`/`defaultOpen`, exactly as today.
- **The panel's box styling becomes the shared base**, not an opt-in. `CollapsiblePanel`'s className changes from a single hardcoded string to `cn(baseBoxClasses, className)`, where `baseBoxClasses` is today's existing border/background/padding classes. Callers extend or override at specific breakpoints via their own `className` — they don't get a clean slate.
- **No render-props or children-as-function beyond the one `trigger` prop above.** Do not invent a second slot (e.g. a separate "closed-state aside") — per the confirmed decision, a caller needing custom closed-state content (like `TagFilterDrawer`'s active-chips zone) puts it inside the `trigger` render-prop's own returned JSX, since that prop owns the whole row once supplied.
- **`role="region"`/`aria-label` stays caller-supplied** on `ConstructionPanel`'s usage sites — unchanged from the existing convention.

## Scope sequence

One concern per scope, per the branch's standing convention — **stop between scopes, get Nicolas's explicit go-ahead before starting the next one**, same rule that governed scopes A/B/C.

### Scope D — `ConstructionPanel` API extension

- Add `trigger`, `open`, `onOpenChange` to `ConstructionPanelProps` as specified above.
- Extract the existing panel className string into a `baseBoxClasses` constant (or inline array) and merge with caller `className` via `cn()`.
- When `trigger` is supplied, the built-in `<CollapsibleTrigger>{toggleLabel} <chevron/></CollapsibleTrigger>` row (and the adjacent `closedHint` span) does not render — `trigger(state)`'s return value becomes `CollapsibleTrigger`'s children instead, OR — if that reads more naturally against Base UI's API — `trigger` output replaces the entire toggle-row `<div>`, including the `CollapsibleTrigger` wrapper itself, so the caller can decide what within their row is actually clickable/keyboard-reachable. Read `CollapsibleTrigger`'s Base UI typing (`node_modules/@base-ui/react/collapsible/trigger/*.d.ts`) before deciding which — the trigger element itself (the thing with `aria-expanded`/`aria-controls`/click handling) must still be a real `CollapsibleTrigger`, not a plain `<div>`, or the a11y wiring breaks. `TagFilterDrawer`'s badge/chevron/label content goes inside that `CollapsibleTrigger`; its active-chips zone (a _sibling_ of the trigger button, not inside it, in the current code) needs to be part of the same row markup the `trigger` render-prop returns, just not inside the clickable trigger element.
- `ConstructionPanel.spec.cy.tsx` gets new cases: custom `trigger` renders instead of the default row, controlled `open`/`onOpenChange` works, axe-clean with a custom trigger too.
- Verify (don't assume) that `design-system/page.tsx` and `molecules/page.tsx` need zero edits — run `tsc --noEmit` with no changes to either file as proof, same verification method scope B used.
- `molecules/page.tsx`'s `ConstructionPanel` Props table needs new rows for `trigger`/`open`/`onOpenChange`.

### Scope E — `TagFilterDrawer` retrofit onto `ConstructionPanel`

- Replace `TagFilterDrawer`'s direct `CollapsibleRoot`/`CollapsibleTrigger`/`CollapsiblePanel` usage with `<ConstructionPanel open={isOpen} onOpenChange={handleDrawerOpenChange} trigger={...} className={mobileOverlayOverrides}>`.
- `trigger` render-prop returns the existing badge/chevron/label markup plus the active-chips zone (both currently siblings of the trigger inside the outer `<div className="flex flex-wrap items-center gap-sm">` row) — same visual output, now composed through `ConstructionPanel` instead of duplicating its internal structure.
- `className` passed to `ConstructionPanel` carries **only** the mobile-specific overrides (`max-sm:fixed max-sm:inset-0 max-sm:z-50 max-sm:overflow-y-auto max-sm:bg-ground max-sm:px-page max-sm:py-xl` plus whatever is needed to neutralize the desktop box styling under `max-sm:`) — desktop inherits `ConstructionPanel`'s shared box styling unmodified.
- Panel body (`drawer-header` block: search/view-tabs/NONE/CLOSE, plus the three `TagGroup`s) becomes `ConstructionPanel`'s `children`, effectively unchanged.
- `role="region"`/`aria-label={t('drawer_region_aria')}` move to wherever `ConstructionPanel` exposes them for a caller-supplied override (check scope D's implementation — if `ConstructionPanel` still applies these as fixed props on its internal `CollapsiblePanel`, `TagFilterDrawer` needs a way to override the `aria-label` text; if `ConstructionPanel` needs a new prop for this, that's part of scope D's API surface, not a scope E addition — flag it back if scope D didn't account for it).
- The mobile CLOSE button and desktop NONE button stay plain `<button>`s calling `setIsOpen(false)` / `handleNone()` — unchanged.
- `TagFilterDrawer.spec.cy.tsx` re-run in full. DOM structure will change (nested inside `ConstructionPanel`'s own wrapper `<CollapsibleRoot>` — same primitive, different owning component) — specs asserting on behavior (badge count, chip removal, search-clear-on-open, mobile CLOSE, axe) should hold; specs asserting on raw DOM shape may need updates.
- Do not touch `TagFilterDrawer`'s five ad hoc `Button`-atom retrofit or `FilterInput`'s focus-visible fix — those remain separate, already-scoped Retrofit-phase items.

## Done criteria

Standard `nextjs-engineer` done criteria apply to both scopes (`pnpm validate` green, co-located tests, axe-clean, all strings in `messages/en.json`, hold `git commit`/PR creation per the branch's standing no-git-until-reviewed rule). Additionally:

- [ ] `ConstructionPanel`'s existing public props are byte-for-byte backward compatible; both existing call sites need zero edits.
- [ ] Both components render the same box-styling classes on desktop; only mobile-breakpoint overrides differ, and those live entirely in `TagFilterDrawer`'s own `className`, not a fork of `ConstructionPanel`'s internals.
- [ ] `TagFilterDrawer` renders `<ConstructionPanel>` — no direct `CollapsibleRoot`/`CollapsibleTrigger`/`CollapsiblePanel` usage remains in `TagFilterDrawer.tsx`.
- [ ] No second render-prop/slot was invented beyond `trigger`.
- [ ] `TagFilterDrawer`'s badge count, active-chip removal, search-clear-on-open, and mobile CLOSE/desktop NONE behavior are all unchanged.
- [ ] `TRACKER.md` Track I updated to record scope D/E superseding scope C's original approach.
