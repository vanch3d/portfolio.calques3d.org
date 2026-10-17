# Calques 3D — SVGMaker Prompt Record

Companion record to ADR 026. Calques 3D has no hand-authored `briefs.md` yet (it was out of scope
for the original 2026-09-27 hand-authored POC, which covered only hivemq-edge and demist) — this
file is currently the only design-record artifact for this project's cover art.

**Style parameters:** `style=line_art`, `color_mode=few_colors`, `background=opaque`,
`composition=full_scene`, `image_complexity=illustration`, `aspectRatio=square`.

**Source material read for this prompt:** `src/content/research/calques3d.mdx` (this repo);
`nvl-research-overview/data/project-summaries/nvl.calques3d.md` and
`nvl-research-overview/data/summaries/1999.Thesis.Calques3D.summary.md` (external, read-only).

---

## Run — "Story-driven" (2026-09-29)

**Prompt:**

> Create an abstract technical/conceptual illustration inspired by the following true story about a piece of educational software called Calques 3D:
>
> Calques 3D was a three-dimensional dynamic geometry microworld, built between 1995 and 2010, that let secondary-school students construct, observe, and explore three-dimensional geometric figures — points, lines, planes, polyhedra, spheres — by directly dragging and manipulating them on screen, with the whole figure recomputing live in real time as they moved a point. The central teaching problem it solved was that students struggle badly to read a three-dimensional figure once it has been flattened into a two-dimensional projection on a screen — depth and spatial intersections become ambiguous and hard to interpret. To solve this, the software surrounded every construction with a configurable spatial reference frame — a floor plane, dividing walls, and axes — that gave students fixed visual anchors to judge depth and intersection against. A second distinctive mechanism, called "tracings," let a student extract just one part of a larger three-dimensional construction — say, a single face cut from a cube — into its own separate, smaller view that stayed perfectly synchronized with the original as it changed. The software itself was built through years of close, structured collaboration directly with real mathematics teachers, who were treated as co-authors of the software's design rather than passive end users consulted only at the end — their classroom expertise was captured through a formal negotiation process and fed directly back into how the software represented geometric knowledge internally. More than a decade after the original research project ended, the software found a surprising second life: a later extension connected it to a symbolic computer-algebra system, letting three-dimensional geometric constructions be exported and used for automated, mechanical theorem-proving.
>
> Interpret this concept visually and creatively as an abstract technical diagram or construction — invent your own composition and metaphor for these ideas: giving depth and spatial orientation to an ambiguous three-dimensional form through a surrounding reference frame; extracting one living, synchronized fragment out of a larger construction; and a geometric construction from one era being picked up, years later, and extended by an entirely different symbolic system. Do not draw literal computer screens, UI chrome, or people. Do not draw a generic 3D coordinate-axes clipart icon or a generic wireframe cube. Find a shape that genuinely embodies these specific ideas, not a stock "3D geometry" icon.
>
> Style requirements — strict, non-negotiable:
>
> - Pure flat 2D vector line art, in the manner of a hand-drafted compass-and-ruler technical drawing, patent illustration, or engineering blueprint. Every curve that appears must read as a true geometric arc or circle, never a free-form organic curve.
> - Exactly two colors only: a solid flat cream/paper background color (#f8f4ed, warm off-white) and a single graphite ink color (#2a2a2a) for all linework. No third color anywhere, no tinted greys, no blues, no browns, no color gradients or color transitions of any kind.
> - Absolutely NO gradients, NO drop shadows, NO 3D shading, NO isometric/perspective rendering tricks, NO photographic texture, NO paper grain, NO vignette. The only way to suggest depth, mass, or density is through line weight variation (thin hairline vs. heavy stroke) and line density (hatching / repeated parallel strokes) — never through tone, blur, or color.
> - NO text, NO letters, NO numbers, NO logos, NO readable labels anywhere in the image.
> - The mood is precise, technical, and engineering-diagram-like — not decorative, not painterly, not whimsical, not photographic.

**Result:** `svgmaker-poc-story-driven.svg` — clean cream-to-graphite grey ramp (`rgb(250,249,247)` → `rgb(9,8,7)`), no stray hues, 20 `linearGradient` defs, 1608 traced bezier paths, 572.1KB — notably denser/more elaborate than the HiveMQ/DEMIST runs, plausibly because the source narrative had more distinct sub-concepts (reference frame, tracings mechanism, teacher co-design, the Maple bridge) for the model to work with.
