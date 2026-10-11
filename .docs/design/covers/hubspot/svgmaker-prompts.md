# HubSpot — SVGMaker Prompt Record

Companion record to ADR 026. HubSpot has no hand-authored `briefs.md` yet — this file is
currently the only design-record artifact for this project's cover art.

**Style parameters:** `style=line_art`, `color_mode=few_colors`, `background=opaque`,
`composition=full_scene`, `image_complexity=illustration`, `aspectRatio=square`.

**Source material:** `src/content/engineering/hubspot.mdx` (this repo) — proprietary/thin,
limited to a tags list and three one-line highlights, no narrative body. Complemented with public
domain context from HubSpot's own Product/Engineering blog on their deliberate polyrepo
philosophy — hundreds of small, independently-owned apps and libraries coordinated by a thin
shared-tooling layer rather than one fused monolith — see
[Making Hundreds of Developers More Efficient by Creating a Frontend Platform Team](https://product.hubspot.com/blog/frontend-platform).
Note this public description (current-era HubSpot, many small polyrepo apps) is somewhat in
tension with the project's own `.mdx` wording ("large-scale React/Redux monorepo," describing
2019); both read as broadly consistent — a large, many-part frontend surface either way — and
the prompt below leans on the public "many small coordinated parts" framing as the sharper visual
idea.

---

## Run — "Story-driven" (2026-10-09)

**Status:** generated directly via the `svgmaker` MCP's `svgmaker_generate` (API path), same
pattern as the rest of this session's batch. Response included a direct, non-paywalled hosted
URL, fetched immediately via `curl` and saved as `svgmaker-poc-story-driven.svg`.

**Prompt:**

> Create an abstract technical/conceptual illustration inspired by the following true story about frontend engineering at HubSpot's CRM product:
>
> HubSpot's own engineering philosophy deliberately avoids one single, fused codebase: the product is built as many separate, independently-owned applications, each small enough for an autonomous team to change on its own schedule, coordinated only by a thin layer of shared tooling and shared practice rather than by a single central structure holding everything together — the team's own reasoning was that a single fused monolith would only slow every team down. Joining as a new engineer, the work was to step directly into that model: contributing customer-facing CRM features inside that large, many-part codebase, working inside the shared testing discipline (unit and end-to-end) that every autonomous piece was expected to uphold on its own.
>
> Interpret this concept visually and creatively as an abstract technical diagram or construction — invent your own composition and metaphor for these ideas: many small, separate, self-contained units arranged together, each independently complete rather than fused into one solid mass; held together by one thin shared connecting structure or standard running across all of them, rather than merged into a single block. Do not draw literal gears, puzzle pieces, building blocks, or people. Do not draw a generic org-chart or generic network-of-nodes icon. Find a shape that genuinely embodies this specific idea, not a stock icon.
>
> Style requirements — strict, non-negotiable:
>
> - Pure flat 2D vector line art, in the manner of a hand-drafted compass-and-ruler technical drawing, patent illustration, or engineering blueprint. Every curve that appears must read as a true geometric arc or circle, never a free-form organic curve.
> - Exactly two colors only: a solid flat cream/paper background color (#f8f4ed, warm off-white) and a single graphite ink color (#2a2a2a) for all linework. No third color anywhere, no tinted greys, no blues, no browns, no color gradients or color transitions of any kind.
> - Absolutely NO gradients, NO drop shadows, NO 3D shading, NO isometric/perspective rendering tricks, NO photographic texture, NO paper grain, NO vignette. The only way to suggest depth, mass, or density is through line weight variation (thin hairline vs. heavy stroke) and line density (hatching / repeated parallel strokes) — never through tone, blur, or color.
> - NO text, NO letters, NO numbers, NO logos, NO readable labels anywhere in the image.
> - The mood is precise, technical, and engineering-diagram-like — not decorative, not painterly, not whimsical, not photographic.

**Result:** `svgmaker-poc-story-driven.svg` — 348.6KB, 4 `linearGradient` defs, 976 traced bezier
paths — the largest file in this session's batch. Not yet visually reviewed in this session —
open directly in a browser/editor before treating as a promotion candidate.
