# ILP (Inductive Logic Programming and Student Modelling) — SVGMaker Prompt Record

Companion record to ADR 026. ILP has no hand-authored `briefs.md` yet — this file is currently the
only design-record artifact for this project's cover art.

**Style parameters:** `style=line_art`, `color_mode=few_colors`, `background=opaque`,
`composition=full_scene`, `image_complexity=illustration`, `aspectRatio=square`.

**Source material read for this prompt:** `src/content/research/ilp.mdx` (this repo);
`nvl-research-overview/data/project-summaries/nvl.ILP.md` (external, read-only).

---

## Run — "Story-driven" (2026-09-30)

**Prompt:**

> Create an abstract technical/conceptual illustration inspired by the following true story about an early academic AI-in-education research project:
>
> The project asked whether a machine-learning technique could automatically explain WHY a student's geometry construction was wrong, not merely flag THAT it was wrong. It worked with a computer tutoring system that checked a student's constructed geometric figure against a teacher's correct specification. The central idea was that a student's incorrect construction, however wrong, is usually internally consistent with the student's own flawed mental model of geometry — so if you could infer that hidden, flawed model directly from the student's mistaken work, you could generate a genuinely explanatory diagnosis instead of a generic "that's wrong" message. The chosen technique for this, Inductive Logic Programming, works by inducing a coherent set of logical rules from a set of examples, similar to how a detective infers a general theory from individual pieces of evidence. But this project ran into a deep structural obstacle: the technique's standard assumption is that you have both positive examples (things that fit the pattern) AND negative counter-examples (things that clearly don't), used together to sharpen the boundary of the inferred rule. In this setting, negative examples essentially did not exist — a student never voluntarily submits a construction they themselves believe is wrong, so all you ever get is one-sided, asymmetric evidence: lots of the student's own flawed attempts, and nothing to contrast them against. The researcher tested four different existing inference systems against this asymmetric-evidence problem: one approach turned out to be theoretically the most elegant and properly interactive, but was too slow and fragile to actually use in practice; a different, cruder approach that had to artificially manufacture its own synthetic counter-examples out of thin air actually worked better in practice, despite being the theoretically weaker method. The overall finding was that no off-the-shelf inference system was fully adequate for this one-sided, evidence-starved diagnostic problem — the underlying idea, inferring a hidden explanatory theory from asymmetric evidence, remained promising but unresolved.
>
> Interpret this concept visually and creatively as an abstract technical diagram or construction — invent your own composition and metaphor for these ideas: inferring a hidden, coherent internal structure from a one-sided pile of flawed evidence with nothing to contrast it against; the tension between a theoretically elegant but fragile approach and a cruder but more practical one that had to manufacture the missing counter-evidence itself; and a diagnostic process that reasons backward from failure to explanation rather than forward from rule to correctness. Do not draw literal computer screens, magnifying glasses, detectives, brains, or people. Do not draw a generic geometry-textbook diagram (protractor, compass-and-paper icon) or generic network/node clipart. Find a shape that genuinely embodies these specific ideas, not a stock "logic" or "AI" icon.
>
> Style requirements — strict, non-negotiable:
>
> - Pure flat 2D vector line art, in the manner of a hand-drafted compass-and-ruler technical drawing, patent illustration, or engineering blueprint. Every curve that appears must read as a true geometric arc or circle, never a free-form organic curve.
> - Exactly two colors only: a solid flat cream/paper background color (#f8f4ed, warm off-white) and a single graphite ink color (#2a2a2a) for all linework. No third color anywhere, no tinted greys, no blues, no browns, no color gradients or color transitions of any kind.
> - Absolutely NO gradients, NO drop shadows, NO 3D shading, NO isometric/perspective rendering tricks, NO photographic texture, NO paper grain, NO vignette. The only way to suggest depth, mass, or density is through line weight variation (thin hairline vs. heavy stroke) and line density (hatching / repeated parallel strokes) — never through tone, blur, or color.
> - NO text, NO letters, NO numbers, NO logos, NO readable labels anywhere in the image.
> - The mood is precise, technical, and engineering-diagram-like — not decorative, not painterly, not whimsical, not photographic.

**Result:** `svgmaker-poc-story-driven.svg` — **best palette discipline of any run so far**: only 7 distinct colors, dominated by an even 58/58 split between cream (`rgb(246,241,225)`) and near-black (`rgb(6,8,9)`); **zero `linearGradient`/`radialGradient` defs, no `<defs>` block at all**; 135 traced bezier paths, 55.9KB — smallest and simplest output of any run. Plausibly because the source concept (asymmetric evidence, hidden structure, no physical objects) gave the model less to render photorealistically, pushing it toward a flatter, more diagram-like result. Worth flagging in ADR 026 / the `/impeccable` session as a data point that subject abstraction level may correlate with how close the output lands to the flat-construction target.
