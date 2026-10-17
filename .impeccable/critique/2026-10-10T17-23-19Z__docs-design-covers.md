---
target: ADR 026 svgmaker cover illustrations (14 projects)
total_score: 6
max_score: 12
na_heuristics: 1,3,5,6,7,9,10
p0_count: 2
p1_count: 2
target_identity: "file:C:\\Users\\Nicolas\\WebstormProjects\\nextjs-vanch-website\\.docs\\design\\covers"
timestamp: 2026-10-10T17-23-19Z
slug: docs-design-covers
---

Method: dual-agent (A: general-purpose design-review sub-agent, B: general-purpose deterministic-scan sub-agent) + direct visual verification via Cypress/Electron screenshot. Not degraded.

Design Health Score (adapted for static-asset review, 3 of 10 heuristics applicable):

- #2 Match System/Real World: 2/4
- #4 Consistency and Standards: 1/4
- #8 Aesthetic and Minimalist Design: 3/4
  Total: 6/12 (50%) - Acceptable, low end. Heuristics 1,3,5,6,7,9,10 n/a (non-interactive asset).

Design Specificity Verdict: Deterministic scan (15 files): 0 files contain any true geometric primitive (line/circle/rect/polygon/ellipse) - every shape is a traced <path>. 12/15 files contain gradient defs (101 total). 14/15 files have zero exact DESIGN.md palette matches (Matillion: 1). Banned content (text/filters/raster) fully clean across all 15.

Empirically verified this session (Cypress screenshot, crop-hivemq-edge.png): duotone-specimen filter does NOT resolve gradients - raw and filtered renders both show visible gradient-shaded icon, filter only desaturates hue. This was ADR 026's single most important untested question.

Genericness uneven: ILP (0 gradients, cleanest) and HubSpot (9-icon grid) read as specific/intentional. HiveMQ Edge's story-driven render (ADR 026's own featured example) visually leans into literal icon-collage (gears, compass, bee-hex logo) against its own prompt's "no stock icon" instruction - also the worst gradient offender (62).

What's Working:

1. Zero banned content, 15/15.
2. Story-driven hue discipline real and visually confirmed - no stray blues/browns.
3. ILP, HubSpot, myPAL, MyPlan, Matillion individually strong results.

Priority Issues:
[P0] Zero geometric primitives across all 15 files - Compass Grammar fails categorically.
[P0] duotone-specimen does not resolve gradients - empirically confirmed.
[P1] Palette is 7-70 color tonal ramp per file, not literal two-tone, in 14/15 files.
[P1] HiveMQ Edge's featured Option-2 example visually fails its own "no stock icon" instruction.
[P2] Dense files (HiveMQ Edge, Calques3D) only checked at lg size (200x168), not md (120x100).

Recommendation (synthesized from both assessments + visual evidence): neither Option 1 nor Option 2 as scoped. Option 1 remains the only committed/shipped mechanism. AI pipeline kept alive only as unpromoted ideation/reference material, not a shipped content register, until either a different vectorization model is proven to produce near-primitive output, or a genuine flattening filter (posterize/threshold, not grayscale+sepia+contrast) is designed and visually tested - duotone-specimen is now known not to be that filter.

Artifacts: .docs/design/covers/review-2026-10-10-contact-sheet.html (source), .docs/design/covers/review-2026-10-10-screenshots/ (3 PNG crops: hivemq-edge, ilp, hubspot).
