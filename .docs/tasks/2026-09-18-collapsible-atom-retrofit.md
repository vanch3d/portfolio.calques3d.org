---
date: 2026-09-18
tracker: .docs/tasks/TRACKER.md
epic: epic/design-compass-app
branch: feat/atom-interaction-system
status: ready-for-engineering
agent: nextjs-engineer
supersedes: .docs/tasks/2026-09-14-atom-interaction-system.md (Retrofit phase, "Apply the Construction Panel pattern to TagFilterDrawer's drawer panel" line only)
---

# Engineering handoff — Collapsible atom + ConstructionPanel/TagFilterDrawer retrofit

## Read this first

This is a **handoff document for an engineering agent** (`nextjs-engineer` or equivalent). API shape and refactor plan were shaped in a design conversation with Nicolas (2026-09-18) and are confirmed below. Nothing in `src/` has been touched for this specific plan yet — `ConstructionPanel.tsx` exists from PR 5 (see Track I in `TRACKER.md`), but its internals are being replaced, not its public API.

Before writing any code, read in this order:

1. This document, in full.
2. `.docs/tasks/2026-09-14-atom-interaction-system.md` — the original Track I handoff. This doc **supersedes only** its Retrofit-phase bullet "Apply the Construction Panel pattern to `TagFilterDrawer`'s drawer panel." The other two Retrofit bullets (apply `Button` atom to `TagFilterDrawer`'s five ad hoc buttons; fix `FilterInput`'s local `:focus-within` red-ring redefinition) are unaffected and still apply — check `TRACKER.md` for their current status before touching them.
3. `src/components/ui/ConstructionPanel.tsx` and `ConstructionPanel.spec.cy.tsx` — current implementation, to be rewritten internally.
4. `src/components/ui/TagFilterDrawer.tsx` and `TagFilterDrawer.spec.cy.tsx` — current implementation, disclosure logic to be migrated.
5. `src/components/ui/Field.tsx`, `Checkbox.tsx`, `Radio.tsx` — the established pattern for wrapping `@base-ui/react` primitives in this codebase. The new `Collapsible` atom must match this convention, not invent a new one.
6. `node_modules/@base-ui/react/collapsible/{root,trigger,panel}/*.d.ts` — the actual primitive API (`open`/`defaultOpen`/`onOpenChange`/`disabled` on Root; `data-open`/`data-closed`/`data-starting-style`/`data-ending-style` on all three parts; `keepMounted`/`hiddenUntilFound` on Panel; a `render` prop for element-swap composition on every part).

## Why this exists

`ConstructionPanel` (Track I PR 5) was built as a bespoke disclosure component: hand-rolled `useState`, a hardcoded `Button`-as-trigger, and a hard mount/unmount panel (`{open && <div>...}`). When asked to apply it to `TagFilterDrawer`'s drawer, two structural problems surfaced:

1. **The trigger is not composable.** `ConstructionPanel` owns the entire trigger row (fixed label + chevron via a `Button` atom). `TagFilterDrawer`'s toggle needs a badge with an active-tag count, and its panel header needs inline search/view-mode-tabs/NONE/CLOSE controls that have nothing to do with `ConstructionPanel`'s API. There's no prop-shaped way to inject this without turning `ConstructionPanel`'s props into an ad hoc superset of both components' needs.
2. **Only two states exist: mounted-open or unmounted-closed.** There's no way to keep the panel in the DOM while closed (needed for CSS height-transition, or to avoid losing `TagFilterDrawer`'s search-input state across toggles).

Root cause: `@base-ui/react` (already a dependency, `^1.8.0`, already the established pattern for `Checkbox`/`Radio`/`Field`/`Fieldset`) ships a `Collapsible` primitive that solves both problems, and it wasn't used. This doc replaces the hand-rolled implementation with one built on that primitive, matching the rest of `src/components/ui/`.

## What's already decided (do not re-litigate)

- **New atom, three flat exports**, mirroring the `RadioGroup`/`Radio` two-export precedent (one file, one export per Base UI part actually needed):
  ```ts
  // src/components/ui/Collapsible.tsx
  export function CollapsibleRoot(...)     // wraps Collapsible.Root — open/defaultOpen/onOpenChange/disabled pass through untouched
  export function CollapsibleTrigger(...)  // wraps Collapsible.Trigger — renders children as-is, no hardcoded label/chevron
  export function CollapsiblePanel(...)    // wraps Collapsible.Panel — renders children as-is, exposes keepMounted
  ```
  Props typing follows the existing convention exactly: `Omit<ComponentPropsWithoutRef<typeof BaseCollapsible.X>, 'children'> & { ...domain props }` where a domain prop is actually needed (there shouldn't be many — this atom is close to a pure passthrough).
- **No render-props, no children-as-function.** Base UI already provides what a render-prop would: `data-open`/`data-closed` on Root/Trigger/Panel for state-driven styling (style with `data-[open]:` Tailwind variants — same idiom as `Checkbox.tsx`'s `data-[checked]:`), and a `render` prop already typed via `BaseUIComponentProps` for the rare case where composition via children isn't enough. Do not build a custom render-prop API on top of this — it would duplicate what the primitive already exposes.
- **`role="region"` / `aria-label` on the panel stays caller-supplied**, not baked into `CollapsiblePanel`. Confirmed by Nicolas 2026-09-18. Matches current behavior in both `ConstructionPanel` and `TagFilterDrawer` (each supplies its own region label text) and the existing convention that `Field`/`Fieldset` don't inject labeling text either — that's always caller content.
- **`ConstructionPanel`'s public API does not change.** `toggleLabel`, `closedHint`, `defaultOpen`, `children`, `className` stay exactly as they are — two call sites (`design-system/page.tsx`, `molecules/page.tsx`) depend on this shape and must not need edits. Only the internals swap from `useState` + conditional mount to `CollapsibleRoot`/`Trigger`/`Panel`. `ConstructionPanel` becomes a **styled preset** of the new atom, not the atom itself.
- **`TagFilterDrawer` moves to controlled mode**, not uncontrolled. It needs direct `setOpen(false)` for the mobile CLOSE button (which must force-close, not toggle) — a plain `CollapsibleTrigger` can't express "always closes," only "toggles."

## PR sequence

One concern per PR, per the standing convention. This work stays on `feat/atom-interaction-system` — **per the existing Track I rule, no commit/stage/push/PR by any agent until Nicolas has reviewed the whole branch.** Get his go-ahead before starting, per the "stop between PRs" rule already in effect for this branch.

### PR A — `Collapsible` atom

- New files: `src/components/ui/Collapsible.tsx`, `Collapsible.spec.cy.tsx`.
- `CollapsibleRoot`/`CollapsibleTrigger`/`CollapsiblePanel` as specified above.
- No visual output of its own to speak of — this is a headless-ish wrapper. Test coverage should focus on: open/close via trigger click, controlled vs. uncontrolled modes both work, `keepMounted` actually keeps the panel in the DOM while `data-closed` is present, `disabled` prevents toggling, axe-clean in both open and closed states.
- Not surfaced on any `/lab/design-system` page directly — it's an internal building block, not a documented atom in its own right (unlike `Button`/`Checkbox`/`Radio`/`Field`). If Nicolas wants it documented on the atoms page too, that's a scope question to raise, not assume.

### PR B — `ConstructionPanel` internals refactor

- Rewrite `ConstructionPanel.tsx` to compose `CollapsibleRoot`/`Trigger`/`Panel` internally. Public props unchanged (see above).
- The existing `Button`-as-trigger content (`{toggleLabel} <span>{open ? '▴' : '▾'}</span>`) becomes the `children` passed to `CollapsibleTrigger` — same visual output, now Base UI owns the `aria-expanded`/`aria-controls`/click wiring instead of hand-rolled attributes on the `Button`.
- The panel's existing border/background styling (`border-t-heavy border-r-medium ...`) stays on `CollapsiblePanel`'s `className` — no visual change.
- `ConstructionPanel.spec.cy.tsx` should not need behavioral changes (same public contract) but re-run it fully — if `Collapsible`'s internal DOM structure differs from the old hand-rolled markup (e.g. `id`/`role` placement), any spec asserting on internals rather than behavior will need updating.
- `molecules/page.tsx`'s Props table documentation for `ConstructionPanel` does not need edits (API unchanged) — verify this is actually true once the refactor is done, don't just assume.

### PR C — `TagFilterDrawer` retrofit

- Replace `isOpen` state + manual `aria-expanded`/`aria-controls`/`handleToggleDrawer` wiring with `CollapsibleRoot` in **controlled mode** (`open={isOpen}` / `onOpenChange`), so the mobile CLOSE button can call `setIsOpen(false)` directly rather than needing a toggle.
- The existing toggle `<button>` (badge + chevron + label) becomes `CollapsibleTrigger`'s children, unchanged visually — `CollapsibleTrigger` supplies the `aria-expanded`/`aria-controls`/click handling that `handleToggleDrawer` currently hand-rolls (including its `if (!isOpen) setDrawerSearch('')` side effect — move that into `onOpenChange`).
- The `{isOpen && <div id="tag-drawer" role="region" ...>}` block becomes `CollapsiblePanel`, keeping its own `className` (mobile fixed-overlay classes, desktop static classes) and its own `role="region"`/`aria-label` exactly as today (caller-supplied, per the confirmed decision above).
- The mobile CLOSE button and desktop NONE button are **not** `CollapsibleTrigger`s — they're plain buttons that call `setIsOpen(false)` / `handleNone()` respectively, same as today.
- This is the part of the original Track I Retrofit phase that said "Apply the Construction Panel pattern to `TagFilterDrawer`'s drawer panel (`#tag-drawer`)" — this PR fulfills that intent via the `Collapsible` atom rather than via `ConstructionPanel` directly (`ConstructionPanel`'s fixed trigger/panel styling doesn't fit the drawer's visual requirements, only its underlying behavior does).
- Do not touch `TagFilterDrawer`'s five ad hoc `Button`-atom retrofit or `FilterInput`'s focus-visible fix in this PR — those are separate, already-scoped Retrofit-phase items from the original handoff doc, independent of this one.

## Done criteria

Standard `nextjs-engineer` done criteria apply to every PR above (`pnpm validate` green, co-located tests, axe-clean, all strings in `messages/en.json`, PR with Summary/Changes/Testing — though per the branch's standing rule, hold actual `git commit`/PR creation until Nicolas reviews). Additionally for this body of work:

- [ ] `Collapsible.tsx` has no hardcoded content in `CollapsibleTrigger`/`CollapsiblePanel` — both are pure children passthroughs
- [ ] No new render-prop or children-as-function API was invented — styling goes through `data-[open]:`/`data-[closed]:`, matching `Checkbox`/`Radio`
- [ ] `ConstructionPanel`'s public props are byte-for-byte unchanged; its two existing call sites need zero edits
- [ ] `TagFilterDrawer`'s visual output is unchanged (badge, chips, mobile overlay, search-clear-on-open) — this is an internals refactor, not a redesign
- [ ] `role="region"`/`aria-label` on panels remains caller-supplied in both components (not moved into `CollapsiblePanel`)
- [ ] `TRACKER.md` Track I updated to reflect this plan superseding the original Retrofit-phase Construction-Panel line
