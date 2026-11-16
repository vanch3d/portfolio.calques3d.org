Status: open

# Investigate a responsive layout for the project tag list that does not hide tags

Spec: `.docs/tasks/2026-11-16-project-page-semantics.md`. Raised while reviewing `TaxonomyPanel` on branch `refactor/project-page-semantics`.

## Problem

`TaxonomyPanel` hides tags by viewport, not by importance:

- `TAG_LIMITS = { sm: 3, md: 5 }`, and `lg` shows all. The cut-off is arbitrary: a project with 7 tags loses 4 on mobile and 2 on tablet, whichever tags they are.
- The hidden tags are replaced by a "+N more" label that is not interactive, so the rest cannot be reached at all below `lg`.
- Per the review, the "+N more" label sits off-centre relative to the chips. **Check:** not reproduced yet.
- The truncation is done with three duplicated `<ul>`s, one per breakpoint, toggled with `hidden`/`md:flex`/`lg:hidden`. The component header says this is because the route is SSG and the limit cannot be chosen at render time without JS breakpoint detection.

This is the same pattern as the visibility, location and client fields, which were `hidden lg:block` until this branch. The limit there was removed. The tags are what remains. Content is chosen by viewport, not by importance.

## Constraints

- The route is SSG: no JS breakpoint detection, no layout-dependent render. CSS only, or a progressive-enhancement control.
- Tailwind v4 tokens only (`.claude/rules/tailwind.md`): no raw values, no `var()` in `className`, no inline `style` for static values.
- Must stay one semantic list (`dd > ul > li`, see "Semantic fitness" in `.claude/rules/accessibility.md`), not three copies.
- axe-clean at every width.

## Options to investigate

1. **Show every tag at every width, wrapping.** The simplest option, and it removes the triple DOM. Check how tall the panel gets with the longest tag list in `src/content/`.
2. **Variable-width flow or masonry.** CSS multi-column (`columns-*`) or a grid with `auto-fill`/`minmax` so chips of different lengths pack without gaps. Native `grid-template-rows: masonry` is not yet broadly supported, so check support before relying on it.
3. **CSS-only collapse for density.** If a long list is a real problem on mobile, collapse by height instead of count: a clamped container with a real disclosure control (`<details>`, or a `Collapsible` atom from `src/components/ui/`) so every tag stays reachable. This keeps the `ConstructionPanel` and `Collapsible` conventions.
4. **Prioritise instead of truncate.** If some tags matter more, that is a content fact (an ordered or `primary` flag in the schema), not a viewport rule.

## Questions

- What is the longest tag list in `src/content/`, and what does the panel look like with it at 375, 768 and 1280px?
- Is "stack" (engineering) vs "tags" (research) a different density problem?
- Should `sliceTags` in `src/app/projects/[slug]/_utils/project-utils.ts` survive? If tags are never cut, it and its tests go.

## Acceptance

- No tag is hidden at any viewport without a way to reach it.
- One `<ul>`, not three.
- Visual check at 375, 768 and 1280px, with the longest real tag list.
- CT spec covers the chosen behaviour at a narrow and a wide viewport, with an axe check.
- `TAG_LIMITS` is removed, or justified in the ticket.

## Comments
