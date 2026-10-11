# LeActiveMath — SVGMaker Prompt Record

Companion record to ADR 026. LeActiveMath has no hand-authored `briefs.md` yet — this file is
currently the only design-record artifact for this project's cover art.

**Style parameters:** `style=line_art`, `color_mode=few_colors`, `background=opaque`,
`composition=full_scene`, `image_complexity=illustration`, `aspectRatio=square`.

**Source material read for this prompt:** `src/content/research/leactivemath.mdx` (this repo);
`nvl-research-overview/data/project-summaries/nvl.LeActiveMath.md` (external, read-only).

---

## Run — "Story-driven" (2026-10-01)

**Prompt:**

> Create an abstract technical/conceptual illustration inspired by the following true story about an academic research project called LeActiveMath, in the field of AI in Education, building an adaptive online learning system for mathematics:
>
> The project built a system that had to reason about what a student knew, felt, and understood — but almost always from sparse, incomplete, and sometimes contradictory evidence, since a system can only ever observe a few clicks and answers, never a student's actual mind. Most systems in this situation force themselves to produce a single confident number anyway, which quietly lies about how much is really known. This project deliberately did the opposite: it used a mathematical framework for representing belief that could honestly express "I don't know" and "the evidence conflicts" as first-class outcomes, rather than forcing false confidence from thin data. The system judged a student's understanding across several different layered dimensions at once — not just raw topic knowledge, but also the student's competency, motivation, emotional state, and self-awareness of their own learning — each layer built from its own separate, partial trail of evidence. The project's most distinctive idea was refusing to keep this internal judgment hidden as a black box: instead, a student could inspect the system's reasoning directly, starting from a single top-level claim about their understanding and drilling down, step by step, through the structure of the argument — claim, supporting data, the underlying reasoning connecting them, and the backing justification for that reasoning — all the way down to the actual raw evidence at the bottom, and could challenge any step of it. An early version of this drill-down view turned out to be too complex and confusing for real students, so it was later simplified and given plain natural-language explanations at each step.
>
> Interpret this concept visually and creatively as an abstract technical diagram or construction — invent your own composition and metaphor for these ideas: honestly representing uncertainty and conflicting evidence instead of false confidence; several separate layered judgments built from their own partial evidence; and a reasoning structure that can be drilled down through, step by step, from a top-level claim all the way to its raw supporting evidence, openly rather than hidden. Do not draw literal computer screens, UI chrome, magnifying glasses, or people. Do not draw a generic brain, lightbulb, or network-node clipart. Find a shape that genuinely embodies these specific ideas, not a stock "AI" or "data" icon.
>
> Style requirements — strict, non-negotiable:
>
> - Pure flat 2D vector line art, in the manner of a hand-drafted compass-and-ruler technical drawing, patent illustration, or engineering blueprint. Every curve that appears must read as a true geometric arc or circle, never a free-form organic curve.
> - Exactly two colors only: a solid flat cream/paper background color (#f8f4ed, warm off-white) and a single graphite ink color (#2a2a2a) for all linework. No third color anywhere, no tinted greys, no blues, no browns, no color gradients or color transitions of any kind.
> - Absolutely NO gradients, NO drop shadows, NO 3D shading, NO isometric/perspective rendering tricks, NO photographic texture, NO paper grain, NO vignette. The only way to suggest depth, mass, or density is through line weight variation (thin hairline vs. heavy stroke) and line density (hatching / repeated parallel strokes) — never through tone, blur, or color.
> - NO text, NO letters, NO numbers, NO logos, NO readable labels anywhere in the image.
> - The mood is precise, technical, and engineering-diagram-like — not decorative, not painterly, not whimsical, not photographic.

**Result:** `svgmaker-poc-story-driven.svg` — clean cream-to-graphite grey ramp (`rgb(250,244,236)` / `rgb(253,243,227)` → `rgb(16,16,17)`), no stray hues, 9 distinct shades, 39 gradient-related matches, 423 traced bezier paths, 201.2KB — middling density between ILP's sparse result and calques3d's dense one, consistent with the emerging pattern that richer/more-structural source narratives (here: layered model + drill-down argument structure) produce more elaborate compositions.
