# Making Stuff — SVGMaker Prompt Record

Companion record to ADR 026. Making Stuff has no hand-authored `briefs.md` yet — this file is
currently the only design-record artifact for this project's cover art.

**Style parameters:** `style=line_art`, `color_mode=few_colors`, `background=opaque`,
`composition=full_scene`, `image_complexity=illustration`, `aspectRatio=square`.

**Source material read for this prompt:** `src/content/research/makingstuff.mdx` (this repo);
`nvl-research-overview/data/project-summaries/nvl.MakingStuff.md` (external, read-only — covers
the LKL "DODO on the Sphere" / spherical-geometry devices specifically, the one strand with its
own paper).

---

## Run — "Story-driven" (2026-10-09)

**Status:** generated directly via the `svgmaker` MCP's `svgmaker_generate` (API path), same as
SAFeSEA's Run B and ExpLabS above. Response included a direct, non-paywalled hosted URL, fetched
immediately via `curl` and saved as `svgmaker-poc-story-driven.svg`. Shorter narrative than prior
runs (SAFeSEA, hivemq-edge, demist) by design — same strict style block, more compact story
paragraph.

**Prompt:**

> Create an abstract technical/conceptual illustration inspired by the following true story about an exploratory educational-technology research project called Making Stuff:
>
> A 2008 exploratory project questioned whether teenagers had really outgrown physical, hands-on learning for abstract subjects like geometry. The team built low-cost tangible devices from simple hardware — microcontrollers, game-console motion sensors, webcams — that let small groups of students physically and collaboratively explore geometry on the surface of a sphere: tracing great circles, building spherical triangles together, and discovering that the triangle's angles summed to more than 180 degrees, something that can't be found just by looking at a flat page. The point was always shared, hands-on discovery done together in physical space, not a solitary screen exercise.
>
> Interpret this concept visually and creatively as an abstract technical diagram or construction — invent your own composition and metaphor for these ideas: abstract geometric reasoning made physical and tangible; a triangle constructed on a curved surface rather than a flat plane, whose angles exceed what flat geometry allows; and several people exploring and constructing it together rather than alone. Do not draw literal classroom objects, tablets, screens, hands, or people. Do not draw a generic globe-with-latitude-lines icon or generic circuit-board clipart. Find a shape that genuinely embodies this specific idea, not a stock icon.
>
> Style requirements — strict, non-negotiable:
>
> - Pure flat 2D vector line art, in the manner of a hand-drafted compass-and-ruler technical drawing, patent illustration, or engineering blueprint. Every curve that appears must read as a true geometric arc or circle, never a free-form organic curve.
> - Exactly two colors only: a solid flat cream/paper background color (#f8f4ed, warm off-white) and a single graphite ink color (#2a2a2a) for all linework. No third color anywhere, no tinted greys, no blues, no browns, no color gradients or color transitions of any kind.
> - Absolutely NO gradients, NO drop shadows, NO 3D shading, NO isometric/perspective rendering tricks, NO photographic texture, NO paper grain, NO vignette. The only way to suggest depth, mass, or density is through line weight variation (thin hairline vs. heavy stroke) and line density (hatching / repeated parallel strokes) — never through tone, blur, or color.
> - NO text, NO letters, NO numbers, NO logos, NO readable labels anywhere in the image.
> - The mood is precise, technical, and engineering-diagram-like — not decorative, not painterly, not whimsical, not photographic.

**Result:** `svgmaker-poc-story-driven.svg` — 355.3KB, 1 `linearGradient` def, 1226 traced bezier
paths — the densest/largest file of the batch so far, consistent with a more geometrically
elaborate prompt (sphere + triangle + multiple participants) than ExpLabS's sparser one. Not yet
visually reviewed in this session — open directly in a browser/editor before treating as a
promotion candidate.
