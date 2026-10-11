# DEMIST — Cover Illustration Candidates (Round 2)

**Project:** `src/content/research/demist.mdx` (type: research, status: completed)
**One Red Rule:** archived/completed project → pure graphite, no red accent (also page-scoped — see the equivalent note in `hivemq-edge/briefs.md`).
**Source corpus:** `src/content/research/demist.mdx`; `nvl-research-overview/data/summaries/2002.ITS.Decisions.summary.md`; `nvl-research-overview/data/summaries/2004.LI.Multiple.summary.md` (external project, read-only per task scope — see `.docs/tasks/2026-09-27-project-image-generation.md`).

---

## Round 2 (2026-09-27): why these three candidates replace Round 1's

Round 1's DEMIST "DeFT Framework" candidate — three vectors at 120° from a shared centre — is the concrete example that triggered this whole revision: it is geometrically indistinguishable from an unrelated project's 3D coordinate axes. A symmetric radial "three things" glyph carries no DEMIST-specific information; it's a generic icon a label was attached to. See `.docs/tasks/2026-09-27-project-image-generation.md`'s "Round 2" section for the full diagnosis.

All three candidates below are rebuilt against the new **Genericness check** field. Candidate 1 keeps its original idea but rebuilds the execution around hatching-as-information-density instead of a bare line/arc/dot. Candidate 2 replaces "three pairs with varying connectors" (itself genericness-risky) with DEMIST's single most specific, most surprising empirical finding. Candidate 3 replaces the symmetric DeFT vectors with an asymmetric, internally-detailed construction that could only be DeFT.

---

## Candidate 1 — "Three Ways to Show Time"

_(Same underlying taxonomy as Round 1 — rebuilt execution using hatching density instead of a bare line/arc/point.)_

**Source grounding:**

> "Time-persistent representations show a range of values over time. Time-implicit representations also show a range of values but not the specific times when the values occur. Time-singular representations show only a single point of time." — `2004.LI.Multiple.summary.md`, Abstract

> "T-S representations differ most from their static equivalents (highest cost when dynamic); T-I representations differ moderately; T-P representations differ least..." — same file, Findings & Results

**Concept statement:** The mark models the taxonomy's own information-content ranking (T-P > T-I > T-S) through hatching density itself, not through three unrelated mark-types standing in for a ranking. How much of a lane is filled with texture directly _is_ how much time-information that representation form retains — the diagram doesn't illustrate the finding, it performs the same measurement the finding describes.

**Composition:**

- Three horizontal construction lanes, stacked vertically, equal width, separated by ghost-weight divider lines (unchanged from Round 1).
- Lane 1 (time-persistent): a dense hatched band — closely spaced vertical strokes, medium weight — spanning the full lane width. Full history retained, full density.
- Lane 2 (time-implicit): a visibly sparser hatched band — fewer strokes, wider gaps, ghost weight — confined to roughly the lane's centre half. Partial information, reduced density, reduced extent.
- Lane 3 (time-singular): a single filled graphite point, centred, no hatching at all. One instant; zero retained texture.
- No accent colour — the reduction from dense to sparse to none is the entire argument; a red accent on any lane would misdirect attention to it as "the important one," which the paper explicitly does not claim.

**Genericness check:** Three lanes of decreasing "fullness" could risk reading as a generic progress/comparison bar chart. What ties it to this specific finding is that the density _is_ the information-content axis the paper itself measures (T-P retains the most information, T-S the least) — not an arbitrary visual metaphor for "more vs. less," but the paper's own dependent variable made visible.

**Rule variants:**

- Rule A (Construction Visible): add ghost-weight registration ticks at the left and right edges of each lane — ruled-paper-style ticks framing the timeline each lane shows more or less of.
- Rule B (Resolved Only): no ticks — just the divider lines and the three hatching/mark treatments inside their lanes.

**Rule self-check:**

- One Red Rule: PASS by omission — archived project.
- No-Decoration Rule: PASS — all three lanes are required; two would lose the three-way structure. Hatching density in each lane is load-bearing (it's the measured variable), not ornamental fill.
- Compass Grammar: PASS — straight lane dividers and hatch strokes, one compass-dot primitive (lane 3); hatching strokes are straight lines, no new primitive type.
- Flat-by-Construction: PASS — the reduction (dense → sparse → none) carries the entire concept through line density alone, no fill regions, no gradient.

---

## Candidate 2 — "The Pop-Up Bias"

_(Replaces Round 1's "Degrees of Connection" — that candidate had the same genericness risk as the original DeFT triangle: "three pairs with varying connectors" is a common design trope on its own. This candidate uses DEMIST's single most specific, most surprising empirical result instead.)_

**Source grounding:**

> "...a strong correlation (r=0.85, n=10, p<.02) was found between which representations the system auto-displayed at unit start and which representations learners spent the most time with — indicating the nominally learner-directed environment was substantially steered by default representation selection." — `2002.ITS.Decisions.summary.md`, Findings & Results

> "Number: up to five representations can be co-present; two or three are auto-displayed ('popped up') at the start of each unit, with the rest available on request." — same file, System/Design

**Concept statement:** The mark models a specific, surprising finding — that a "free discovery" environment was actually steered by which representations the system chose to show first — by making the correlation itself visible as a structural echo between two rows, rather than depicting DEMIST's interface literally.

**Composition:**

- An upper, loosely-scattered field of 9 small ghost-weight open marks (circles, irregular spacing, not gridded) — the 8–10 external representations DEMIST could show per Learning Unit, texture rather than an exact enumerated count.
- A frame — an open dashed bracket, not a closed box — isolating 2–3 of the upper marks (the ones auto-displayed, or "popped up," at unit start). This is a genuine `frame`-as-device, per the vocabulary DESIGN.md and the designwithintent.ai reference both name and Round 1 never used.
- A lower row, vertically aligned beneath the _entire_ upper field, where the marks positioned beneath the bracketed subset are rendered heavier/filled (where learners' attention concentrated) and the marks beneath the un-bracketed remainder stay faint/ghost (where it didn't) — the vertical alignment between the bracket above and the heavy marks below is the visual proof of the r=0.85 correlation: what got framed is what got attention.
- No accent colour.

**Genericness check:** A field of marks with a subset called out is a common enough device in the abstract — but the _specific structural claim_ being diagrammed (a frame placed above predicts a heavier echo below, at the same horizontal positions) is not a generic composition choice, it's a direct encoding of a named statistic (r=0.85) from a specific study. Nothing about it would make sense applied to an unrelated project's content — there's no "frame predicts echo" fact to borrow.

**Rule variants:**

- Rule A (Construction Visible): add a faint ghost-weight vertical guide line connecting each bracketed mark in the upper field to its corresponding heavy mark below — making the correlation's alignment explicit rather than left for the eye to find.
- Rule B (Resolved Only): no guide lines — the alignment is implied by position alone, not drawn.

**Rule self-check:**

- One Red Rule: PASS by omission.
- No-Decoration Rule: PASS — every element encodes part of the finding (the field = available representations, the bracket = the system's default, the heavy echo = measured attention); nothing is decorative.
- Compass Grammar: PASS — circles and straight lines only; the bracket frame is straight-line construction (an open rectangle missing one side), not a new shape family.
- Flat-by-Construction: PASS — weight contrast (ghost vs. filled/heavy) carries the finding; no colour, no fill regions beyond simple filled circles.

---

## Candidate 3 — "The DeFT Framework, Unevenly"

_(Replaces Round 1's symmetric three-vector DeFT candidate — the exact motif that triggered this revision. Same underlying framework, deliberately asymmetric execution so it can't be swapped onto an unrelated project's "three things.")_

**Source grounding:**

> "This flexibility made it possible to test the DeFT framework (Design, Functions, Tasks) — developed with Dr Ainsworth — in controlled lab experiments with students." — `src/content/research/demist.mdx`, body

> "...the DeFT framework (Ainsworth; Van Labeke & Ainsworth, see 2001.AIED.Applying) had characterised the pedagogical functions of MERs (complement, constrain, construct) and the design dimensions unique to multi-representational systems (redundancy, form, translation, sequence, number)." — `2002.ITS.Decisions.summary.md`, Research Context

**Concept statement:** The mark models DeFT as the paper itself actually elaborates it — unevenly, with Design carrying five named sub-dimensions (redundancy, form, translation, sequence, number) against Functions' three (complement, constrain, construct) and Tasks left comparatively unelaborated in this source material — rather than as three symmetric, interchangeable peers. The asymmetry itself is the DEMIST-specific fact; a symmetric three-way split is what any framework acronym could use.

**Composition:**

- One outer frame (a rectangle, sharp corners), subdivided by two straight internal dividers into three _unequal_ zones, proportioned roughly 5:3:1 left to right — Design (widest), Functions (narrower), Tasks (narrowest) — reflecting the actual count of named sub-dimensions this source material elaborates for each, not an even three-way split.
- Inside the Design zone: five short evenly-spaced tick marks along its base — one per named sub-dimension (redundancy, form, translation, sequence, number), unlabelled (no text in the SVG), read as a count.
- Inside the Functions zone: three tick marks (complement, constrain, construct).
- Inside the Tasks zone: no internal tick marks — a deliberately empty zone, its narrowness and emptiness both part of the claim: this source elaborates Tasks the least.
- No accent colour.

**Genericness check:** This is the one candidate in either project's set built specifically to fail the genericness test the old version failed — the 5:3:1 asymmetric proportion and the specific tick counts inside each zone are drawn directly from the paper's own named sub-dimension lists. An unrelated project's "three things" could not reuse this exact proportion and tick pattern without those numbers being wrong for it.

**Rule variants:**

- Rule A (Construction Visible): add a faint ghost-weight circle behind the whole frame, tangent to its outer edges — a visible reminder of the compass-and-ruler construction the rectangle's proportions were checked against, without asserting the frame itself is arc-derived (it isn't — only the check is).
- Rule B (Resolved Only): no circle — just the frame, its two internal dividers, and the tick marks.

**Rule self-check:**

- One Red Rule: PASS by omission.
- No-Decoration Rule: PASS — the proportion and every tick mark is drawn from a specific, named count in the source; nothing is invented to fill space.
- Compass Grammar: PASS — the outer frame and dividers are sharp-cornered construction elements; Rule A's circle is a genuine arc-defined check, not decoration.
- Flat-by-Construction: PASS — the asymmetric proportion and tick density carry all the meaning; no colour, no fill regions.
