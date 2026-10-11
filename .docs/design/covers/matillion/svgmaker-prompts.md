# Matillion — SVGMaker Prompt Record

Companion record to ADR 026. Matillion has no hand-authored `briefs.md` yet — this file is
currently the only design-record artifact for this project's cover art.

**Style parameters:** `style=line_art`, `color_mode=few_colors`, `background=opaque`,
`composition=full_scene`, `image_complexity=illustration`, `aspectRatio=square`.

**Source material:** `src/content/engineering/matillion.mdx` (this repo) — proprietary/thin,
limited to a tags list and five one-line highlights, no narrative body. Complemented with public
domain context from Matillion's own engineering/product content on "push-down" ELT architecture
(transformation performed natively inside the destination warehouse rather than on a separate
external engine) — see [The role of pushdown architecture](https://www.matillion.com/blog/the-role-of-pushdown-architecture-unlock-speed-security-and-cost-savings-in-data-pipelines).
This is general public company context, not anything proprietary or project-specific.

---

## Run — "Story-driven" (2026-10-09)

**Status:** generated directly via the `svgmaker` MCP's `svgmaker_generate` (API path), same
pattern as the rest of this session's batch. Response included a direct, non-paywalled hosted
URL, fetched immediately via `curl` and saved as `svgmaker-poc-story-driven.svg`. Grounding
combines the public "push-down" architecture concept with two of Nicolas's own concrete
highlights (zero-to-covered Cypress CT adoption; OpenAPI-first single-source client generation)
rather than the generic tag list.

**Prompt:**

> Create an abstract technical/conceptual illustration inspired by the following true story about frontend engineering work on a cloud data-pipeline platform called Matillion:
>
> Matillion's own core technical idea is "push-down" processing: instead of moving data out to a separate external engine to transform it before loading it into its final destination, the transformation work is pushed directly into the destination itself, which does the work using its own native power. On the frontend engineering team, a parallel instinct was applied at the UI layer: automated testing was introduced directly into a legacy codebase that had zero prior coverage, verifying components at their own source rather than bolting checks on after the fact; and API client code moved onto a single declared contract that automatically generated every client, replacing several separately hand-written copies that had drifted out of sync with each other.
>
> Interpret this concept visually and creatively as an abstract technical diagram or construction — invent your own composition and metaphor for these ideas: work being pushed into, and performed directly at, a destination itself rather than through a separate external intermediary stage; and one single authoritative source automatically generating several consistent copies, replacing several separate hand-made copies that had drifted apart from each other. Do not draw literal databases, cloud icons, pipelines or pipes, or people. Do not draw a generic gear/cog or generic flowchart-with-boxes-and-arrows icon. Find a shape that genuinely embodies this specific idea, not a stock icon.
>
> Style requirements — strict, non-negotiable:
>
> - Pure flat 2D vector line art, in the manner of a hand-drafted compass-and-ruler technical drawing, patent illustration, or engineering blueprint. Every curve that appears must read as a true geometric arc or circle, never a free-form organic curve.
> - Exactly two colors only: a solid flat cream/paper background color (#f8f4ed, warm off-white) and a single graphite ink color (#2a2a2a) for all linework. No third color anywhere, no tinted greys, no blues, no browns, no color gradients or color transitions of any kind.
> - Absolutely NO gradients, NO drop shadows, NO 3D shading, NO isometric/perspective rendering tricks, NO photographic texture, NO paper grain, NO vignette. The only way to suggest depth, mass, or density is through line weight variation (thin hairline vs. heavy stroke) and line density (hatching / repeated parallel strokes) — never through tone, blur, or color.
> - NO text, NO letters, NO numbers, NO logos, NO readable labels anywhere in the image.
> - The mood is precise, technical, and engineering-diagram-like — not decorative, not painterly, not whimsical, not photographic.

**Result:** `svgmaker-poc-story-driven.svg` — 164.2KB, 4 `linearGradient` defs, 516 traced bezier
paths. Not yet visually reviewed in this session — open directly in a browser/editor before
treating as a promotion candidate.
