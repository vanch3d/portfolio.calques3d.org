# Auditory Games — SVGMaker Prompt Record

Companion record to ADR 026. Auditory Games has no hand-authored `briefs.md` yet — this file is
currently the only design-record artifact for this project's cover art.

**Style parameters:** `style=line_art`, `color_mode=few_colors`, `background=opaque`,
`composition=full_scene`, `image_complexity=illustration`, `aspectRatio=square`.

**Source material read for this prompt:** `src/content/research/auditorygames.mdx` (this repo);
`nvl-research-overview/data/project-summaries/nvl.AuditoryGames.md` (external, read-only).

---

## Run — "Story-driven" (2026-10-06)

**Prompt:**

> Create an abstract technical/conceptual illustration inspired by the following true story about a clinical/educational research project called Auditory Games:
>
> The project asked whether a repetitive, clinical listening exercise — training someone with tinnitus to tell apart two very close sound frequencies — could be made more effective by disguising it as an actual game, rather than just adding points and badges on top of the same dull exercise. The guiding design idea was that the underlying listening task itself had to be inseparable from the game's core mechanic, not bolted on as decoration. Two different games were built to test this. One let the player control their own pace, continuously scanning along a single axis of pitch and picking out the one tone that was slightly higher than a fixed reference, with no time pressure. The other was paced by the system instead of the player, asking the player to continuously align their own position against a moving reference tone in order to pass safely through a narrow gap, under constant time pressure. Both games made the task progressively harder over time by narrowing the frequency gap that had to be told apart. Years later, a rigorous clinical trial compared both games against a conventional, non-game version of the same listening exercise in sixty real patients. The result was a genuinely honest, surprising split: patients overwhelmingly said they enjoyed the games far more than the conventional exercise, and strongly preferred them — but that strong preference did not translate into any real difference in actual outcomes. Clinical improvement and attention test performance came out statistically equivalent across all three versions, game or no game. The project's real contribution was this honest negative finding: making a therapeutic exercise more enjoyable does not automatically make it more effective.
>
> Interpret this concept visually and creatively as an abstract technical diagram or construction — invent your own composition and metaphor for these ideas: a fine discrimination task along a single continuous axis that narrows and gets harder over time; two different paced mechanisms (one self-paced, one externally-paced) built around the exact same underlying task; and a split or divergence between strong subjective preference on one hand and flat, unchanged objective outcome on the other. Do not draw literal game elements (game controllers, treasure, submarines, mining carts), literal sound waves, ears, or people. Do not draw a generic clipart icon of a game or a generic audio-waveform icon. Find a shape that genuinely embodies these specific ideas, not a stock "games" or "sound" icon.
>
> Style requirements — strict, non-negotiable:
>
> - Pure flat 2D vector line art, in the manner of a hand-drafted compass-and-ruler technical drawing, patent illustration, or engineering blueprint. Every curve that appears must read as a true geometric arc or circle, never a free-form organic curve.
> - Exactly two colors only: a solid flat cream/paper background color (#f8f4ed, warm off-white) and a single graphite ink color (#2a2a2a) for all linework. No third color anywhere, no tinted greys, no blues, no browns, no color gradients or color transitions of any kind.
> - Absolutely NO gradients, NO drop shadows, NO 3D shading, NO isometric/perspective rendering tricks, NO photographic texture, NO paper grain, NO vignette. The only way to suggest depth, mass, or density is through line weight variation (thin hairline vs. heavy stroke) and line density (hatching / repeated parallel strokes) — never through tone, blur, or color.
> - NO text, NO letters, NO numbers, NO logos, NO readable labels anywhere in the image.
> - The mood is precise, technical, and engineering-diagram-like — not decorative, not painterly, not whimsical, not photographic.

**Result:** `svgmaker-poc-story-driven.svg` — clean cream-to-graphite ramp (`rgb(248,243,227)` → `rgb(34,32,33)`), no stray hues, 9 distinct shades, 51 gradient-related matches, 186 traced bezier paths, 82.2KB — compact, similar order of magnitude to the ILP and demist runs. Darkest tone here (`rgb(34,32,33)`) sits slightly lighter than the near-black floor other runs reached (`rgb(6,8,9)`–`rgb(16,16,17)`), a minor variance worth noting if cross-project palette consistency ever gets re-tested.
