Status: open
Type: research

# Icon-scale cover illustrations are unreadable when naively shrunk — investigate a small-form-factor summary mark

No dedicated spec exists for this yet — it surfaced as a live design observation (mockup, not a
shipped bug) during the ADR 027 cover-illustration work, not from pre-existing planning. Related:
ADR 027 (`.docs/adr/027-cover-illustration-content-layer-ai-generated-specimens-hand-authored-infrastructure-boundary.md`,
the Content Layer decision these covers are generated under), `.docs/tasks/2026-09-27-project-image-generation.md`
(the original generation pipeline).

## Context

The 13 promoted cover illustrations (`public/images/covers/<slug>.svg`) are dense, traced
constructions — 135 to 1,608 paths each, designed to read at the `/projects/[slug]` page's own
sizes (120×100 `md`, 200×168 `lg`; see `SpecimenIllustration.tsx`). Nicolas mocked up a smaller
form factor — a project-list row on the homepage era blocks (`EraColumn.tsx` / `app/page.tsx`),
roughly icon-sized — and found that simply scaling the existing illustrations down to that size
makes them unreadable: the linework collapses into visual noise at a scale this dense geometry was
never composed for. **This is not a live bug** — the homepage does not currently render any cover
imagery at all (`EraColumn.tsx` has no cover/`SpecimenIllustration` reference today), so nothing is
broken. This ticket is prep work ahead of that feature actually being built, not a fix for a
regression.

The ask is two-fold:

1. **Investigate** whether a small, unique, legible "signature" mark could be derived per project —
   something that captures one distinctive feature of that project's full illustration, rather than
   the whole composition shrunk down — the way a favicon is a simplified mark, not a shrunk logo.
2. **Check whether this is even worth the effort** before committing to building it. A cheap
   fallback (e.g. a generic dot/mark, or simply omitting illustration at icon scale) may be the
   right call if the investigation shows no efficient path to a good result.

## Candidate approaches to evaluate (not a prescribed plan — compare and recommend)

- **Manual curation per project.** Hand-pick a representative crop/sub-region from each of the 14
  existing SVGs (or re-view at high zoom and select one legible fragment). Cheap at this count (14
  files), full quality control, zero new generation cost — but doesn't scale if the project catalogue
  grows much further, and is pure manual labour with no reusable mechanism.
- **Automated heuristic extraction.** Programmatically find a bounding region of each SVG (e.g.
  highest path-density cluster, or a fixed central crop) and render that sub-region alone at icon
  size. Scales automatically to new projects, but fragile — no guarantee the extracted region is
  actually the illustration's most legible or representative feature; needs real testing against
  the existing 14 files before trusting it.
- **A dedicated small-form-factor generation pass.** Prompt `svgmaker` separately, per project, for
  an icon-scale mark from the start (not derived from the existing illustration) — most control over
  the result, but doubles the generation cost/credit spend per project and reopens the whole
  genericness-check discipline ADR 027 already established, for a second asset class.
- **Fallback: no per-project mark at icon scale.** A generic, non-illustrative treatment (a plain
  dot, the existing ghost-placeholder pattern, or simply no image) at the smallest form factor,
  reserving the real illustrations for `md`/`lg` sizes where they already work. The honest "maybe
  this isn't worth it" answer — record as a real option, not just a non-outcome.

"Progressive rendering" in the sense Nicolas raised it: the small-form-factor mark and the full
illustration don't have to be the same asset — a cheap, simple summary could load/render at icon
scale, with the full detailed SVG only loading where there's room to actually read it (`md`/`lg`).
Worth scoping whether this is a meaningfully different technical approach from just "pick a smaller
asset per breakpoint" or if it collapses to the same thing.

## Acceptance

This is a `research` ticket — the deliverable is a recommendation, not a shipped feature.

- A clear recommendation: worth pursuing (and which approach), or not worth it (and why, with the
  fallback treatment named).
- If recommended: a rough cost/effort estimate per approach above, grounded in the actual existing
  14-file set (not hypothetical).
- No code changes to `EraColumn.tsx` or any homepage component required to close this ticket —
  wiring an approved approach into the homepage is separate, future scope.
