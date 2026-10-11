# DEMIST — SVGMaker Prompt Record

Companion to `briefs.md` (the hand-authored candidate briefs) and to ADR 026. Records the exact
prompt fed to the `svgmaker` MCP (`mcp__svgmaker__svgmaker_generate`) for this project.

**Style parameters:** `style=line_art`, `color_mode=few_colors`, `background=opaque`,
`composition=full_scene`, `image_complexity=illustration`, `aspectRatio=square`.

---

## Run — "Story-driven" (2026-09-28)

**Approach:** story-driven prompting (see the HiveMQ Edge record for the A/B comparison this
approach came from) — the raw narrative of DEMIST's three key findings, made self-contained with
AIED/ITS domain context, handed to the model with an explicit instruction to invent its own
composition rather than follow a dictated diagram.

**Prompt:**

> Create an abstract technical/conceptual illustration inspired by the following true story about an academic research project called DEMIST, in the field of AI in Education (intelligent tutoring systems research):
>
> DEMIST studied how people learn when information is shown to them through several different visual representations at once — graphs, diagrams, tables, animations — especially representations of information that changes over time. One core finding was about how much information different time-based representation styles actually preserve: a representation that shows the full history of values over time preserves the most information; a representation that shows only a partial or windowed range preserves a moderate amount; a representation that shows only a single instant in time preserves the least, discarding almost everything about how the value changed. A second, more surprising finding came from watching real learners use a system that let them freely choose among many available representations (as many as eight to ten options): even though the environment was designed to be learner-directed and open, a strong statistical correlation showed that which representations the system happened to display automatically by default at the very start of a lesson was what actually predicted where learners spent most of their attention afterward — meaning the "free choice" environment was quietly steered by an initial default, not by learners' own independent judgment. A third finding concerned an organizing framework for these systems with three parts — Design, Functions, and Tasks — but the parts were not equally developed: the Design part alone contained many more distinct named sub-concepts than the other two parts combined, making the framework itself lopsided and asymmetric rather than a clean, balanced three-way split.
>
> Interpret this concept visually and creatively as an abstract technical diagram or construction — invent your own composition and metaphor for these ideas: information retained versus lost across different representation styles, a hidden default quietly steering apparent free choice, and a three-part framework that is asymmetric rather than balanced. Do not draw literal computer screens, graphs with axes and readable data, or people. Do not draw generic circuit-board, network-node, or brain/lightbulb clipart. Find a shape that genuinely embodies these specific ideas.
>
> Style requirements — strict, non-negotiable:
>
> - Pure flat 2D vector line art, in the manner of a hand-drafted compass-and-ruler technical drawing, patent illustration, or engineering blueprint. Every curve that appears must read as a true geometric arc or circle, never a free-form organic curve.
> - Exactly two colors only: a solid flat cream/paper background color (#f8f4ed, warm off-white) and a single graphite ink color (#2a2a2a) for all linework. No third color anywhere, no tinted greys, no blues, no browns, no color gradients or color transitions of any kind.
> - Absolutely NO gradients, NO drop shadows, NO 3D shading, NO isometric/perspective depth, NO photographic texture, NO paper grain, NO vignette. The only way to suggest depth, mass, density, or asymmetry is through line weight variation (thin hairline vs. heavy stroke) and line density (hatching / repeated parallel strokes) — never through tone, blur, or color.
> - NO text, NO letters, NO numbers, NO logos, NO readable labels anywhere in the image.
> - The mood is precise, technical, and engineering-diagram-like — not decorative, not painterly, not whimsical, not photographic.

**Result:** `svgmaker-poc-story-driven.svg` — same clean cream-to-graphite grey-ramp pattern as the HiveMQ story-driven run, no stray hues, 20 `linearGradient` defs, 234 traced bezier paths, 82.1KB.
