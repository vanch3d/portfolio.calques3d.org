# ExpLabS — SVGMaker Prompt Record

Companion record to ADR 026. ExpLabS has no hand-authored `briefs.md` yet — this file is
currently the only design-record artifact for this project's cover art.

**Style parameters:** `style=line_art`, `color_mode=few_colors`, `background=opaque`,
`composition=full_scene`, `image_complexity=illustration`, `aspectRatio=square`.

**Source material read for this prompt:** `src/content/research/explabs.mdx` (this repo, covers
four Experience Labs projects); `nvl-research-overview/data/project-summaries/nvl.explabs.md`
(external, read-only — covers only the Backpack lab specifically, the richest-grounded of the
four). Prompt is grounded in Backpack, the one lab with its own paper and summary.

---

## Run — "Story-driven" (2026-10-09)

**Status:** generated directly via the `svgmaker` MCP's `svgmaker_generate` (API path), same as
SAFeSEA's Run B. Response included a direct, non-paywalled hosted URL, fetched immediately via
`curl` and saved as `svgmaker-poc-story-driven.svg`. Shorter narrative than prior runs (SAFeSEA,
hivemq-edge, demist) by design — same strict style block, more compact story paragraph.

**Prompt:**

> Create an abstract technical/conceptual illustration inspired by the following true story about a co-design research project called Backpack (part of the Experience Labs programme):
>
> A 2015 co-design research project proposed "Backpack" — a single, citizen-owned personal data store letting a patient selectively share their own medical and personal records with the NHS, local authorities, employers and other services, instead of those records sitting locked away in many separate, disconnected silos. To explore this with real citizens, the team designed a board game shaped like Snakes & Ladders, where "snakes" marked real obstacles a newly diagnosed person hits while navigating services, and "ladders" marked moments where having one shared, portable data store would let them skip straight past that obstacle.
>
> Interpret this concept visually and creatively as an abstract technical diagram or construction — invent your own composition and metaphor for these ideas: many separate, disconnected repositories converging into one single shared, portable store; and a journey containing obstacles that can be bypassed once that one store exists. Do not draw literal board games, dice, snakes-and-ladders boards, medical crosses, folders, or people. Do not draw a generic cloud-storage or database icon. Find a shape that genuinely embodies this specific idea, not a stock icon.
>
> Style requirements — strict, non-negotiable:
>
> - Pure flat 2D vector line art, in the manner of a hand-drafted compass-and-ruler technical drawing, patent illustration, or engineering blueprint. Every curve that appears must read as a true geometric arc or circle, never a free-form organic curve.
> - Exactly two colors only: a solid flat cream/paper background color (#f8f4ed, warm off-white) and a single graphite ink color (#2a2a2a) for all linework. No third color anywhere, no tinted greys, no blues, no browns, no color gradients or color transitions of any kind.
> - Absolutely NO gradients, NO drop shadows, NO 3D shading, NO isometric/perspective rendering tricks, NO photographic texture, NO paper grain, NO vignette. The only way to suggest depth, mass, or density is through line weight variation (thin hairline vs. heavy stroke) and line density (hatching / repeated parallel strokes) — never through tone, blur, or color.
> - NO text, NO letters, NO numbers, NO logos, NO readable labels anywhere in the image.
> - The mood is precise, technical, and engineering-diagram-like — not decorative, not painterly, not whimsical, not photographic.

**Result:** `svgmaker-poc-story-driven.svg` — 145.2KB, **0 gradients**, 483 traced bezier paths.
Rare clean run — joins ILP as one of the only story-driven generations on record with zero
`linearGradient` defs (see ADR 026's note that subject abstraction level may correlate with how
close output lands to the flat-construction target). Not yet visually reviewed in this session —
open directly in a browser/editor before treating as a promotion candidate.
