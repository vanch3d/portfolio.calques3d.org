# HiveMQ Edge — SVGMaker Prompt Record

Companion to `briefs.md` (the hand-authored candidate briefs) and to ADR 026, which discusses this
project's two svgmaker PoC runs as the worked example. Records the exact prompts fed to the
`svgmaker` MCP (`mcp__svgmaker__svgmaker_generate`) — the "story" inputs behind each generated
image, kept for design-system reference regardless of which direction (hand-authored vs.
AI-generated) the `/impeccable` session in ADR 026 lands on.

Both runs below used identical style parameters: `style=line_art`, `color_mode=few_colors`,
`background=opaque`, `composition=full_scene`, `image_complexity=illustration`,
`aspectRatio=square`. Only the prompt text differs.

---

## Run A — "Dictated construction" (2026-09-28)

**Approach:** the prompt translates Candidate 1's ("Twenty-Plus, One") own Composition section
from `briefs.md` almost verbatim into prose — precise geometry dictated to the model rather than
left to its own interpretation.

**Prompt:**

> A precise flat 2D technical line-art diagram, engineering/blueprint drafting style, on a solid cream background (#f8f4ed). All linework is a single graphite color (#2a2a2a) — no other colors, no red, no blue, no colored accents of any kind.
>
> Composition, horizontal rectangle canvas near-square (about 1.2:1): the left two-thirds of the frame is filled with a dense, irregular field of roughly 20-24 short straight hairline strokes — industrial protocol connectors — scattered at chaotic, non-repeating angles and positions. These strokes deliberately vary in FOUR independent properties simultaneously: some are heavy weight (1.5px), some medium (1px), some ultra-thin ghost hairlines (0.5px); lengths vary noticeably short to long; angles are all different, no two parallel; and roughly half are solid lines, half are dashed lines. No two strokes look alike. This chaotic hatched mass reads as heterogeneous, aging, mismatched industrial equipment — not a neat pattern, not a grid, not radiating from a center.
>
> At roughly two-thirds across the canvas, a single heavy vertical straight line runs the full height, like a wall or boundary — except for one narrow horizontal gap precisely at its vertical center, a deliberate aperture cut into the line, as if traffic passes through that single gap.
>
> The right third of the canvas is calm and orderly: a uniform stack of perfectly evenly-spaced, identical parallel horizontal medium-weight solid straight lines, all the same length and spacing — representing one single standardized output signal.
>
> Overall visual story: chaos and irregularity on the left, passing through one narrow gate, resolving into calm uniform order on the right.
>
> Style requirements — strict: pure flat vector line art only, like a hand-drafted compass-and-ruler technical drawing or patent illustration. NO gradients anywhere. NO drop shadows. NO 3D effects, NO isometric perspective, NO depth-of-field blur, NO photographic textures, NO shading fills of any kind — the only way "depth" or "mass" is conveyed is through stroke weight and line density (hatching), never through tone/gradient/shadow. NO rounded organic curves — only straight lines and, if any curve is needed, true compass-drawn circular arcs. NO text, NO letters, NO numbers, NO logos, NO decorative flourishes, NO people, NO photography, NO textures, NO paper grain. Every single line must look structural and deliberate, like a construction diagram, not decorative art. Background must stay a completely flat solid cream color, no texture, no vignette.

**Result:** `svgmaker-poc-dictated-construction.svg` — 6+ colors including navy blues, 3 `linearGradient` defs, 273 traced bezier paths, 85.8KB.

---

## Run B — "Story-driven" (2026-09-28)

**Approach:** instead of dictating geometry, the prompt hands the model the project's own raw
narrative (source-grounded in `Portfolio_01_ProblemClass.md`) plus enough domain context (MQTT,
OT protocols) to be self-contained, and explicitly asks it to invent its own composition.

**Prompt:**

> Create an abstract technical/conceptual illustration inspired by the following true story about a piece of industrial software called HiveMQ Edge:
>
> HiveMQ Edge is industrial IoT edge software that lives on the factory floor. Its job is to translate more than twenty different industrial operational-technology protocols — OPC-UA, Modbus, EtherNet/IP, and many others, some of them running on equipment that is decades old, mismatched, and never designed to talk to anything modern — into a single unified, lightweight publish/subscribe messaging protocol called MQTT. It stands as a translation layer directly between two very different worlds: a chaotic, heterogeneous, aging mess of industrial protocols and vendor-specific hardware on one side, and a clean, standardized, uniform MQTT data stream on the other. The people who operate this factory equipment are engineers and technicians, not software developers, so the entire value of HiveMQ Edge is that it quietly absorbs decades of industrial protocol fragmentation and hands back one simple, trustworthy, uniform stream of data on the other side.
>
> Interpret this concept visually and creatively as an abstract technical diagram or construction — invent your own composition and metaphor for "many chaotic, mismatched, aging things converging into one clean uniform thing passing through a translation boundary." Do not draw literal factory machinery, computer screens, cables, or people. Do not draw generic circuit-board or network-node clipart. Find a shape that genuinely embodies this specific idea of heterogeneity resolving into uniformity through a translation point.
>
> Style requirements — strict, non-negotiable:
>
> - Pure flat 2D vector line art, in the manner of a hand-drafted compass-and-ruler technical drawing, patent illustration, or engineering blueprint. Every curve that appears must read as a true geometric arc or circle, never a free-form organic curve.
> - Exactly two colors only: a solid flat cream/paper background color (#f8f4ed, warm off-white) and a single graphite ink color (#2a2a2a) for all linework. No third color anywhere, no tinted greys, no blues, no browns, no color gradients or color transitions of any kind.
> - Absolutely NO gradients, NO drop shadows, NO 3D shading, NO isometric/perspective depth, NO photographic texture, NO paper grain, NO vignette. The only way to suggest depth, mass, density, or "many things" is through line weight variation (thin hairline vs. heavy stroke) and line density (hatching / repeated parallel strokes) — never through tone, blur, or color.
> - NO text, NO letters, NO numbers, NO logos, NO readable labels anywhere in the image.
> - The mood is precise, technical, and engineering-diagram-like — not decorative, not painterly, not whimsical, not photographic.

**Result:** `svgmaker-poc-story-driven.svg` — clean cream-to-graphite grey ramp (`rgb(249,242,222)` → `rgb(15,15,13)`), no stray hues, 62 `linearGradient` defs, 337 traced bezier paths, 167.5KB.

---

## Cross-run takeaway

Story-driven prompting (Run B) produced far better color discipline than dictated-construction
(Run A) — no wandering into off-brief hues — for no cost in structural compliance (both runs kept
gradients and organic paths). See ADR 026 for the full comparison and open questions.

---

## Finding (2026-10-10): Run B bakes in a literal wordmark and logo mark

During the ADR 027 critique session, a `lg`/`md`-size legibility screenshot of Run B
(`svgmaker-poc-story-driven.svg`) revealed the product name **"HiveMQ Edge" rendered as a legible
wordmark**, directly beside a hexagon shaped like a bee/hive logo mark — both clearly visible at
the real shipped 120×100 `md` size, not just at full resolution. Neither sub-agent's deterministic
scan in the critique caught this: it greps for real `<text>`/`<tspan>` elements, but this came
from a raster-then-vectorize pipeline, so the letterforms are ordinary traced `<path>` shapes —
invisible to a markup-level check, only catchable by actually looking at the rendered image. This
is a direct violation of the prompt's own "NO text, NO logos" instruction and DESIGN.md's Content
Layer rules — more serious than the icon-collage framing (gears/compass/documents) this file was
already flagged for. A spot-check of five other projects (DEMIST, SAFeSEA, Matillion, MyPlan,
LeActiveMath) found no equivalent text/logo intrusion — this appears isolated to this file, not a
batch-wide issue.

## Run C — remediation re-prompt (succeeded 2026-10-11)

**Status:** succeeded on retry (first attempt 2026-10-10 returned "Insufficient credits"; a
same-prompt retry the next day worked once credits had refreshed — consistent with the pattern
observed across this whole batch). Response included a direct, non-paywalled hosted URL, fetched
via `curl` and saved. **This is now the canonical file** — promoted to the filename
`svgmaker-poc-story-driven.svg`, replacing Run B, which is kept on disk renamed to
`svgmaker-poc-story-driven-run-b-icon-collage-rejected.svg` for the historical record (not deleted,
per this task's own "keep losing candidates" convention).

**Result:** 356.7KB, 18 `linearGradient` defs, 1,135 traced bezier paths, 48 distinct colors — a
clean cream-to-graphite ramp (lightest `rgb(255,255,246)`, darkest `rgb(0,0,0)`), no stray hues
beyond the expected warm-cream tint. Zero banned-content matches (`<text>`, `<tspan>`,
`font-family`, `<filter>`, `feDropShadow`, `feGaussianBlur`, `base64`) — verified by direct grep,
not just visual inspection, given what slipped through in Run B. Composition: a dense chaotic field
of circles, hatching, dashed arcs, and scattered lines on the left, converging through a heavy
vertical boundary wall into perfectly uniform, evenly-spaced parallel horizontal lines on the
right — a genuinely specific, legible rendering of "heterogeneous mess resolving into uniform
stream through a translation point," with no icon-collage or text/logo intrusion. Background
normalized to the exact DESIGN.md token (`.claude/skills/cover-illustrations/scripts/normalize-cover-background.mjs`) and **promoted**
to `public/images/covers/hivemq-edge.svg`, wired into `media.cover` in
`src/content/engineering/hivemq-edge.mdx`, verified live on `/projects/hivemq-edge` at `lg` size.
All 14 of 14 covers are now promoted — ADR 027's remediation is fully complete.

**Prompt:**

> Create an abstract technical/conceptual illustration inspired by the following true story about a piece of industrial software called HiveMQ Edge:
>
> HiveMQ Edge is industrial IoT edge software that lives on the factory floor. Its job is to translate more than twenty different industrial operational-technology protocols — OPC-UA, Modbus, EtherNet/IP, and many others, some of them running on equipment that is decades old, mismatched, and never designed to talk to anything modern — into a single unified, lightweight publish/subscribe messaging protocol called MQTT. It stands as a translation layer directly between two very different worlds: a chaotic, heterogeneous, aging mess of industrial protocols and vendor-specific hardware on one side, and a clean, standardized, uniform MQTT data stream on the other.
>
> Interpret this concept visually and creatively as an abstract technical diagram or construction — invent your own composition and metaphor for "many chaotic, mismatched, aging things converging into one clean uniform thing passing through a translation boundary."
>
> CRITICAL correction from a previous attempt at this same brief: that attempt drew a collage of small literal icons — gears, a compass/divider drafting tool, document/paper rectangles — and, worst of all, rendered the literal text "HiveMQ Edge" as a wordmark next to a hexagon shaped like a bee or hive logo. That is explicitly wrong and must not happen again. Do NOT render any text, letters, or words of any kind, anywhere, for any reason — not as a label, not as a logo, not integrated into the linework. Do NOT draw any discrete small icon-like pictograms either — no gears, no compasses, no dividers, no documents, no magnifying glasses, no hexagon logo marks, no insect or bee or hive shapes, no icon-grid or icon-pack layout of any kind, nothing that reads as a company logo or app icon. Instead, render this as ONE single continuous abstract construction — a unified field of linework (lines, arcs, hatching, density gradients) that as a whole reads as "chaotic converging into ordered," built from pure geometric mark-making, not from assembling recognizable object-icons or any text.
>
> Style requirements — strict, non-negotiable:
>
> - Pure flat 2D vector line art, in the manner of a hand-drafted compass-and-ruler technical drawing, patent illustration, or engineering blueprint. Every curve that appears must read as a true geometric arc or circle, never a free-form organic curve.
> - Exactly two colors only: a solid flat cream/paper background color (#f8f4ed, warm off-white) and a single graphite ink color (#2a2a2a) for all linework. No third color anywhere, no tinted greys, no blues, no browns, no color gradients or color transitions of any kind.
> - Absolutely NO gradients, NO drop shadows, NO 3D shading, NO isometric/perspective depth, NO photographic texture, NO paper grain, NO vignette. The only way to suggest depth, mass, or density is through line weight variation (thin hairline vs. heavy stroke) and line density (hatching / repeated parallel strokes) — never through tone, blur, or color.
> - NO text, NO letters, NO numbers, NO logos, NO readable labels anywhere in the image.
> - The mood is precise, technical, and engineering-diagram-like — not decorative, not painterly, not whimsical, not photographic, and absolutely not a stock icon set.

**Result:** pending — not yet generated.
