# MyPlan — SVGMaker Prompt Record

Companion record to ADR 026. MyPlan has no hand-authored `briefs.md` yet — this file is
currently the only design-record artifact for this project's cover art.

**Style parameters:** `style=line_art`, `color_mode=few_colors`, `background=opaque`,
`composition=full_scene`, `image_complexity=illustration`, `aspectRatio=square`.

**Source material read for this prompt:** `src/content/research/myplan.mdx` (this repo);
`nvl-research-overview/data/project-summaries/nvl.MyPlan.md` (external, read-only — 8 papers,
richest-grounded of this batch).

---

## Run — "Story-driven" (2026-10-09)

**Status:** generated directly via the `svgmaker` MCP's `svgmaker_generate` (API path), same as
SAFeSEA's Run B / ExpLabS / Making Stuff above. Response included a direct, non-paywalled hosted
URL, fetched immediately via `curl` and saved as `svgmaker-poc-story-driven.svg`. Short narrative
by design, grounded in the Needleman-Wunsch sequence-alignment method and the "what next" feature
specifically ([2008.ITS.Similarity], [2008.MyPlan.Enginev2]) rather than the full 8-paper corpus.

**Prompt:**

> Create an abstract technical/conceptual illustration inspired by the following true story about a lifelong-learning research project called MyPlan:
>
> MyPlan let independent lifelong learners record their own education and life history as a sequence of discrete episodes, then compared one learner's sequence against many others' using a string/sequence-alignment technique — the same kind of algorithm used to align DNA sequences — to find whose history most closely matched their own. The point was never to give authoritative advice: instead of a "recommendation," the matched peer's episodes that lay beyond the current learner's own history were surfaced quietly, as inspiration drawn from a real similar life rather than a prescription.
>
> Interpret this concept visually and creatively as an abstract technical diagram or construction — invent your own composition and metaphor for these ideas: two parallel sequences of discrete episodes being aligned against each other to find where they match; and one sequence being extended using the portion of a matched sequence that lies beyond the other's own current endpoint. Do not draw literal timelines, calendars, DNA double helixes, graduation caps, or people. Do not draw a generic roadmap-with-milestones icon. Find a shape that genuinely embodies this specific idea, not a stock icon.
>
> Style requirements — strict, non-negotiable:
>
> - Pure flat 2D vector line art, in the manner of a hand-drafted compass-and-ruler technical drawing, patent illustration, or engineering blueprint. Every curve that appears must read as a true geometric arc or circle, never a free-form organic curve.
> - Exactly two colors only: a solid flat cream/paper background color (#f8f4ed, warm off-white) and a single graphite ink color (#2a2a2a) for all linework. No third color anywhere, no tinted greys, no blues, no browns, no color gradients or color transitions of any kind.
> - Absolutely NO gradients, NO drop shadows, NO 3D shading, NO isometric/perspective rendering tricks, NO photographic texture, NO paper grain, NO vignette. The only way to suggest depth, mass, or density is through line weight variation (thin hairline vs. heavy stroke) and line density (hatching / repeated parallel strokes) — never through tone, blur, or color.
> - NO text, NO letters, NO numbers, NO logos, NO readable labels anywhere in the image.
> - The mood is precise, technical, and engineering-diagram-like — not decorative, not painterly, not whimsical, not photographic.

**Result:** `svgmaker-poc-story-driven.svg` — 234.2KB, 1 `linearGradient` def, 726 traced bezier
paths. Not yet visually reviewed in this session — open directly in a browser/editor before
treating as a promotion candidate.
