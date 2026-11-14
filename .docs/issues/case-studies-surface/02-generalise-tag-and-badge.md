Status: open

# Generalise Tag and Badge, and use them in TagFilterDrawer

Spec: `.docs/tasks/2026-11-13-case-studies-surface.md`.

## Context

The case-studies work added two small components in `src/components/ui/`:

- `Tag`: a framed, passive micro-label (project tags in `TaxonomyPanel`, the "Case studies" marker on home rows). It replaced three copies of the same markup in `TaxonomyPanel`.
- `Badge`: a small filled count chip (`bg-ink-secondary`, `h-badge-sm`, `text-badge-sm`), used inside the marker.

`TagFilterDrawer.tsx` (the tag chips around line 146) already has the same two shapes inline: an interactive tag button with a count chip inside. They exist in the Design System but were never extracted as components. The TagFilterDrawer was deliberately not refactored in this work.

## Scope

- Refactor `TagFilterDrawer` to build its chips from `Tag` and `Badge`, keeping its behaviour (toggle, pressed state, frequency-sized text). The chip is interactive and its border is `border-ink-secondary`, so `Tag` needs an interactive variant or a separate wrapper.
- Give `Tag` and `Badge` proper variants (cva, per `.claude/rules/components.md`): selected / unselected, size.
- Document both on the design-system lab page.
- Move the remaining tag-like elements onto `Tag`: the project status stamp in `ClassificationHeader` (medium frame, red when ongoing, needs an active variant), the status line in `TaxonomyPanel`, and the insight tags in `InsightCalloutStrip`. The case-study Draft mark and case tags already use `Tag`.
