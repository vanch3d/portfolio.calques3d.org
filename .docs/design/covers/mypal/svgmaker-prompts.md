# myPAL — SVGMaker Prompt Record

Companion record to ADR 026. myPAL has no hand-authored `briefs.md` yet — this file is currently
the only design-record artifact for this project's cover art.

**Style parameters:** `style=line_art`, `color_mode=few_colors`, `background=opaque`,
`composition=full_scene`, `image_complexity=illustration`, `aspectRatio=square`.

**Source material read for this prompt:** `src/content/research/mypal.mdx` (this repo);
`nvl-research-overview/data/project-summaries/nvl.myPAL.md` (external, read-only — a founding
position paper, not a shipped-system report; the project was at its starting line when these
papers were written).

---

## Run — "Story-driven" (2026-10-09)

**Status:** generated directly via the `svgmaker` MCP's `svgmaker_generate` (API path), same as
the other four runs in this batch (SAFeSEA, ExpLabS, Making Stuff, MyPlan). Response included a
direct, non-paywalled hosted URL, fetched immediately via `curl` and saved as
`svgmaker-poc-story-driven.svg`. Short narrative by design, grounded specifically in the
reflection-vs-reflexivity distinction the source summary calls out as myPAL's conceptual
foundation, rather than its four-strand roadmap (co-design, OSCE feedback, predictive analytics,
xAPI infrastructure) — the roadmap read as closer to a generic "parallel-strands-converging"
diagram, so the sharper, more specific idea was chosen as the grounding instead.

**Prompt:**

> Create an abstract technical/conceptual illustration inspired by the following true story about a learning-technology research project called myPAL:
>
> myPAL set out to build a learning mentor — not a subject tutor — for medical students navigating messy real-world workplace experience rather than a fixed curriculum. Its foundation rested on one specific distinction: "reflection" means examining what happened, but "reflexivity" — the harder, deeper goal — means understanding how one's own perspective shaped what happened in the first place, turning the act of observing back onto the observer itself. The plan combined several strands of work — direct co-design with students, feedback for a specific clinical skill, mining years of historical data, and new data infrastructure — but all aimed at that one underlying move: not just recording an experience, but folding the observer's own viewpoint back into what gets understood from it.
>
> Interpret this concept visually and creatively as an abstract technical diagram or construction — invent your own composition and metaphor for these ideas: an act of observation that loops back and includes the observer itself, turning a simple one-way "looking at" into something self-referential; and several distinct strands of activity converging toward that one underlying idea. Do not draw literal eyes, mirrors, brains, magnifying glasses, or people. Do not draw a generic feedback-loop-with-arrows icon. Find a shape that genuinely embodies this specific idea, not a stock icon.
>
> Style requirements — strict, non-negotiable:
>
> - Pure flat 2D vector line art, in the manner of a hand-drafted compass-and-ruler technical drawing, patent illustration, or engineering blueprint. Every curve that appears must read as a true geometric arc or circle, never a free-form organic curve.
> - Exactly two colors only: a solid flat cream/paper background color (#f8f4ed, warm off-white) and a single graphite ink color (#2a2a2a) for all linework. No third color anywhere, no tinted greys, no blues, no browns, no color gradients or color transitions of any kind.
> - Absolutely NO gradients, NO drop shadows, NO 3D shading, NO isometric/perspective rendering tricks, NO photographic texture, NO paper grain, NO vignette. The only way to suggest depth, mass, or density is through line weight variation (thin hairline vs. heavy stroke) and line density (hatching / repeated parallel strokes) — never through tone, blur, or color.
> - NO text, NO letters, NO numbers, NO logos, NO readable labels anywhere in the image.
> - The mood is precise, technical, and engineering-diagram-like — not decorative, not painterly, not whimsical, not photographic.

**Result:** `svgmaker-poc-story-driven.svg` — 162.1KB, **0 gradients**, 552 traced bezier paths.
Second zero-gradient run in this batch (after ExpLabS) — again a conceptually abstract source
idea (self-referential observation) rather than a concrete physical scene. Not yet visually
reviewed in this session — open directly in a browser/editor before treating as a promotion
candidate.
