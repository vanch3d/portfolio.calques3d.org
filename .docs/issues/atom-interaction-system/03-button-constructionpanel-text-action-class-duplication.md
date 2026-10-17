Status: open
Type: task

# `Button`'s `text-action` classes are duplicated in `ConstructionPanel`

Spec: `.docs/tasks/2026-09-18-collapsible-atom-retrofit.md` (scope B)

`ConstructionPanel`'s default trigger row used to render the `Button` atom (`variant="text-action"`). When scope B rebuilt `ConstructionPanel` on the `Collapsible` atom, `Button` had to be dropped from it entirely: `CollapsibleTrigger` renders its own `<button>`, and nesting `Button`'s `<button>` inside it would be invalid HTML (nested interactive elements, an axe violation). Composing `Button` via Base UI's `render` prop was considered, but `Button.tsx` is a plain function component, not `forwardRef`, and no component in the codebase uses the `render`-prop composition pattern yet.

The `text-action` variant's exact Tailwind classes are now hand-copied directly onto `CollapsibleTrigger`'s `className` in `ConstructionPanel.tsx`. Visual output is unchanged, but the class list is duplicated between `Button.tsx` and `ConstructionPanel.tsx` rather than shared — a maintenance hazard if `Button`'s `text-action` variant ever changes.

## Question

Should `Button.tsx` export its `buttonVariants` (the `cva()` object, ADR 024) so `ConstructionPanel` can consume the class list without instantiating `Button` itself? Or gain `forwardRef` so `render`-prop composition becomes viable? Or is the duplication acceptable given `text-action` is a narrow, rarely-changed variant?

## Answer

_pending_
