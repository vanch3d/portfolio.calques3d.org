# Almotech — SVGMaker Prompt Record

Companion record to ADR 026. Almotech has no hand-authored `briefs.md` yet — this file is
currently the only design-record artifact for this project's cover art.

**Style parameters:** `style=line_art`, `color_mode=few_colors`, `background=opaque`,
`composition=full_scene`, `image_complexity=illustration`, `aspectRatio=square`.

**Source material:** `src/content/engineering/almotech.mdx` (this repo) — proprietary/thin,
limited to a tags list and four one-line highlights, no narrative body. Complemented with public
context on what Almotech actually builds (a digital-signage control platform — one hub managing
content across video walls, individual screens, outdoor LED boards, posters, and menu boards) —
Almotech is a small Irish digital-signage/in-store-media company, confirmed via its own site
([almotech.com](https://almotech.com/)) and company-profile listings; no dedicated engineering
blog was found, so this is business/product-level public context rather than an engineering
writeup.

---

## Run — "Story-driven" (2026-10-09, generated 2026-10-10)

**Status:** generated directly via the `svgmaker` MCP's `svgmaker_generate` (API path), same
pattern as the rest of this session's batch. First attempt (2026-10-09, right after Matillion and
HubSpot) returned "Insufficient credits"; a same-prompt retry the next day succeeded once credits
had refreshed. Response included a direct, non-paywalled hosted URL, fetched immediately via
`curl` and saved as `svgmaker-poc-story-driven.svg`.

**Prompt:**

> Create an abstract technical/conceptual illustration inspired by the following true story about frontend engineering on a digital signage platform at a company called Almotech:
>
> Almotech builds the software platform behind digital signage — one central hub used to design, schedule and control content across many different physical displays at once: video walls, individual screens, outdoor LED boards, freestanding posters, menu boards, all driven from the same one schedule. The frontend of this platform was rebuilt from an old, single tangled legacy structure into several separate, coordinated services with a single-page application layered on top; the video editing and scheduling tools were redesigned for mobile use; and real recorded sessions of actual users were used to validate redesign decisions against how the tool was genuinely being used, rather than relying on assumption.
>
> Interpret this concept visually and creatively as an abstract technical diagram or construction — invent your own composition and metaphor for these ideas: one single timeline or schedule simultaneously driving several different, physically distinct output surfaces at once; and a single tangled structure being reorganised into several separate, clearly coordinated parts. Do not draw literal screens, television sets, billboards, or people. Do not draw a generic broadcast-tower-with-signal-waves icon. Find a shape that genuinely embodies this specific idea, not a stock icon.
>
> Style requirements — strict, non-negotiable:
>
> - Pure flat 2D vector line art, in the manner of a hand-drafted compass-and-ruler technical drawing, patent illustration, or engineering blueprint. Every curve that appears must read as a true geometric arc or circle, never a free-form organic curve.
> - Exactly two colors only: a solid flat cream/paper background color (#f8f4ed, warm off-white) and a single graphite ink color (#2a2a2a) for all linework. No third color anywhere, no tinted greys, no blues, no browns, no color gradients or color transitions of any kind.
> - Absolutely NO gradients, NO drop shadows, NO 3D shading, NO isometric/perspective rendering tricks, NO photographic texture, NO paper grain, NO vignette. The only way to suggest depth, mass, or density is through line weight variation (thin hairline vs. heavy stroke) and line density (hatching / repeated parallel strokes) — never through tone, blur, or color.
> - NO text, NO letters, NO numbers, NO logos, NO readable labels anywhere in the image.
> - The mood is precise, technical, and engineering-diagram-like — not decorative, not painterly, not whimsical, not photographic.

**Result:** `svgmaker-poc-story-driven.svg` — 146.9KB, 3 `linearGradient` defs, 454 traced bezier
paths. Not yet visually reviewed in this session — open directly in a browser/editor before
treating as a promotion candidate.
