# SAFeSEA — SVGMaker Prompt Record

Companion record to ADR 026. SAFeSEA has no hand-authored `briefs.md` yet — this file is
currently the only design-record artifact for this project's cover art.

**Style parameters:** `style=line_art`, `color_mode=few_colors`, `background=opaque`,
`composition=full_scene`, `image_complexity=illustration`, `aspectRatio=square`.

**Source material read for this prompt:** `src/content/research/safesea.mdx` (this repo);
`nvl-research-overview/data/project-summaries/nvl.safesea.md` (external, read-only).

---

Two generations exist for the same story-driven prompt, run minutes apart on 2026-10-09 — one
through the web app UI, one through the API. Both use identical prompt text and style parameters;
only the delivery path differs. Run B is the one that matches the naming convention
(`svgmaker-poc-story-driven.svg`) used by the other six projects, since it's the one an API
`svgmaker_generate` call could actually retrieve.

---

## Run A — "Story-driven", web app (2026-10-09)

**Status:** prompt was run manually by Nicolas through the SVGMaker **web app UI**, not the API.
Verified via `svgmaker_generations_get` — prompt text on file matches this record exactly.
Generation id `xUs5cs5gjGpskWG1JeTZ`, type `generate`, quality `medium`, public, hashtags `svg,
blueprint, geometric_grace, technical_illustration, abstract, diagram, minimalist_modern,
etched_lines, education, conceptual`.

**Known blocker:** the web app's own save/download for this generation is gated behind a Pro
subscription — Nicolas confirmed he could not download or save it from the web app itself. The
API-side re-download path (`svgmaker_gallery_download`, `format=svg`) is also blocked: that
format costs 1 credit, and the connected account showed 0 credits earlier in this session (`png`/
`webp` formats are free and were used for the preview below). So the actual vector source for
_this specific generation_ was never retrievable — neither web-app download (Pro-only) nor API
re-download (needs 1 credit) worked. Superseded in practice by Run B below, which used the
live-generation path instead of trying to re-download a stored item.

**Prompt:**

> Create an abstract technical/conceptual illustration inspired by the following true story about an educational research project called SAFeSEA / OpenEssayist:
>
> The project built a web tool that gave university students automated feedback on their draft essays — but deliberately avoided grading, correcting, or scoring the essay in any way. Instead, it used natural-language processing to identify an essay's own most central, recurring words, phrases and sentences — picked out not by any external rule about "good writing," but purely from how densely each piece of text connected back to the rest of the student's own essay, like finding the most-referenced points in a web of internal connections. That distilled core was then reflected straight back to the student, in their own original words, laid directly over their own original text, so they could notice for themselves whether what reflected back actually matched what they meant to say. There was no verdict, no grade, no checkmark or cross — only the student's own material, returned to them in a reduced, concentrated form, for the student alone to judge. The target users were distance-learning students writing long essays in isolation, with little day-to-day support, so the tool had to support open-ended self-reflection rather than hand down a judgement.
>
> Interpret this concept visually and creatively as an abstract technical diagram or construction — invent your own composition and metaphor for these ideas: a dense, complete body of original material being analysed entirely from within itself, not against any outside standard; a small subset of that same material being identified as structurally central because of how it connects to everything else; and that distilled subset being held up and reflected back, overlaid on or paired with the original, as a mirror made of the author's own content rather than an external judgement. Do not draw literal computer screens, web browsers, highlighter pens, essays-as-lined-notebook-paper, or people. Do not draw a generic magnifying-glass-over-document icon or a generic checklist/graded-paper icon. Find a shape that genuinely embodies this specific idea of internal self-distillation and reflection, not an external verdict.
>
> Style requirements — strict, non-negotiable:
>
> - Pure flat 2D vector line art, in the manner of a hand-drafted compass-and-ruler technical drawing, patent illustration, or engineering blueprint. Every curve that appears must read as a true geometric arc or circle, never a free-form organic curve.
> - Exactly two colors only: a solid flat cream/paper background color (#f8f4ed, warm off-white) and a single graphite ink color (#2a2a2a) for all linework. No third color anywhere, no tinted greys, no blues, no browns, no color gradients or color transitions of any kind.
> - Absolutely NO gradients, NO drop shadows, NO 3D shading, NO isometric/perspective rendering tricks, NO photographic texture, NO paper grain, NO vignette. The only way to suggest depth, mass, or density is through line weight variation (thin hairline vs. heavy stroke) and line density (hatching / repeated parallel strokes) — never through tone, blur, or color.
> - NO text, NO letters, NO numbers, NO logos, NO readable labels anywhere in the image.
> - The mood is precise, technical, and engineering-diagram-like — not decorative, not painterly, not whimsical, not photographic.

**Result:** two concentric, mirrored radial constructions (star-of-connections node graph,
compass-arc rings, hatched outer bands) joined by a shared axis through a single small central
node — reads as the project's own two-halves-reflecting-each-other concept reasonably well,
though symmetric-mirror is close to the "generic radial diagram" pattern ADR 026's Round 2 notes
flag as a recurring risk; worth a genericness check if this ever moves toward promotion. Only
artifact retrievable: `svgmaker-poc-story-driven-preview.png` (free `gallery_download`,
`format=png`) — not the vector source.

---

## Run B — "Story-driven", API (2026-10-09)

**Status:** same prompt and style parameters as Run A, submitted directly via the `svgmaker` MCP's
`svgmaker_generate` tool — the same path used for the other six projects. The account had enough
credits for this call (contrary to the 0-credit reading earlier in the session — balance had
evidently refreshed). The tool's response included a direct, non-paywalled hosted URL for the
fresh file (12h expiry), fetched immediately via `curl` and saved as
`svgmaker-poc-story-driven.svg` — the canonical filename matching the other six projects.
Generation id `DINdKaqkWprnS77PAfqW` (listed via `svgmaker_generations_list`, but — like Run A —
`svgmaker_generations_preview`/`_download` both still error "Download feature is only available
for paid users"; the file was only obtainable via the one-time generate-response URL, not via any
later re-fetch of the stored generation).

**Result:** `svgmaker-poc-story-driven.svg` — 297.1KB, 4 `linearGradient` defs, 921 traced bezier
paths. Gradient presence is consistent with every other story-driven run on record (ADR 026: the
pipeline paints a raster image then auto-vectorizes it, so gradients survive regardless of prompt
wording). Not yet visually reviewed in this session — the file exceeds the 256KB inline-read limit
and SVG preview/download tools are paid-gated, so composition hasn't been eyeballed the way Run
A's was via `gallery_preview`. Open it directly in a browser or editor before treating this as a
candidate for promotion.
