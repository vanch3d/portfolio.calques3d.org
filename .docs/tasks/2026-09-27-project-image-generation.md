# Project Image Generation — Pipeline Proposal

**Route affected:** `/projects/[slug]` — `SpecimenIllustration` component (`media.cover`)
**Branch:** `epic/design-compass-app`
**Started:** 2026-09-27
**Status:** Round 2 artifacts produced (12 SVGs + contact sheet, expanded vocabulary, genericness-checked) for hivemq-edge + demist — Phase 4 (review/select) pending
**Parent task:** `.docs/tasks/2026-09-08-project-surface.md` (Step 3 — "Specimen illustration — image notes", deferred generation task)

---

## Brief (from the parent task)

> Generation task (separate): image generation for each project is a follow-on task using `imagegen-frontend-web` or `brandkit` skills. The generation brief per project must specify: "flat geometric illustration, cream (#f8f4ed) ground, graphite (#2a2a2a) construction lines, one red (#c0392b) accent, no gradients, no photography". Projects without sufficient narrative content use one of two generic fallbacks: `cover-research-generic.png` / `cover-engineering-generic.png`.

This document scopes and sequences that follow-on task, using **hivemq-edge** (engineering) and **demist** (research) as a two-project proof of concept.

---

## Round 2 (2026-09-27): the first 12 SVGs were rejected — vocabulary, not rules, was the problem

Round 1 produced 12 SVGs (still on disk at `.local/tmp/covers/` — superseded, not deleted, see "Re-doing under changed rules" for why old work stays) built entirely from three primitives: points, straight/dashed lines, and thin arcs, almost always converging on or radiating from one shared centre. On review this collapsed to generic templates: DEMIST's "DeFT Framework" candidate (three vectors at 120° from a centre point) is geometrically indistinguishable from a completely unrelated project's 3D coordinate axes (a real, live risk once Calques3D's cover is drafted). If a mark can represent an unrelated project's concept equally well, it isn't modelling _this_ project's concept — it's a generic icon wearing a label.

**Root cause:** conflating DESIGN.md's actual constraint (flat, no gradient/shadow, sharp-or-arc corners) with a narrower habit — small element counts, uniform weight, everything reduced to a radial or linear diagram. Nothing in DESIGN.md requires that reduction. Its own vocabulary is richer: "dimension lines with terminal arrows, construction arcs with **centre marks**, **leader lines** from labels to elements" — and the designwithintent.ai reference this whole approach is based on explicitly uses "**frames**... **apertures**... **layered zones**," none of which Round 1 touched. The clinching counter-example: Leonardo's Vitruvian Man is entirely compass-and-ruler construction (a circle, a square, a proportionally-placed figure) and is dense, specific, and unmistakably itself — proof that strict geometric construction doesn't force minimalism.

**Two concrete techniques Round 1 never used, now mandatory to consider for every motif:**

- **Hatching / line density as value.** Repeated parallel strokes at varying density read as volume, mass, or texture — without a gradient or a shadow-blur. This is DESIGN.md's own Flat-by-Construction Rule ("depth conveyed by line weight... and the tonal ramp") taken seriously at illustration scale, not a workaround for it. Use it wherever a concept is about _quantity, density, or heterogeneity_ ("twenty-plus protocols," "seven attempts") instead of a token 2–3-element stand-in for "many."
- **Figural / asymmetric construction, not just abstract diagrams.** A recognisable form (a silhouette, a proportioned figure, an asymmetrically-subdivided frame reflecting real unequal proportions in the source content) is exactly as "compass-and-ruler" as a node graph. Don't default to a symmetric radial or linear diagram just because it's the fastest thing to construct.

**New required check, added to every brief going forward:** **Genericness check** — "could this exact geometry represent an unrelated project's concept with equal validity?" If yes, the motif isn't specific enough; rework it or cut it. This is now a required field alongside the existing Rule self-check (see Phase 2, updated below).

Round 2 briefs for both projects are being rebuilt against this bar — see the updated `.docs/design/covers/hivemq-edge/briefs.md` and `.docs/design/covers/demist/briefs.md`. Round 1's briefs and SVGs are left on disk as a documented false start, not deleted — the source grounding in them is still valid even though the compositions were rejected (see "Re-doing under changed rules" below for the general version of this distinction).

---

## Evolving a selected candidate (layered enrichment of one instance)

A different situation from "the whole design system changed" (see "Re-doing under changed rules") or "the first draft was wrong" (see "Round 2" above): a specific candidate's **base construction is right**, but after living with it — at Phase 4 review, or later, even post-ship — it becomes clear it needs another layer to fully land. The Vitruvian Man is the model here too: the circle-and-square construction is correct and complete on its own, and the figure was added as a distinguishable further layer, not fused into one undifferentiated drawing from the start.

**When to use this:** only when a reviewer (you, or a future agent) explicitly judges "this base concept is right, it just needs more" — never a default next step, never applied automatically to every promoted candidate.

**The discipline doesn't relax for an evolution round — it scopes down to the delta:**

1. **Write the addition down before drawing it.** Add an **Evolution log** entry to the candidate's section in `briefs.md` (only candidates that actually get evolved need this section at all): **Layer name**, **Trigger** (what prompted adding this — a review finding, a later realisation, explicit direction), **Source grounding** for the _new_ content specifically (same verbatim-quote-with-path discipline as the base brief — an added layer is not exempt from grounding), **Composition delta** (what's added and precisely how it relates to the existing base: layered over it / extends a specific element / replaces a specific sub-element), and a **Rule self-check** for the new layer alone, including the genericness check.
2. **Structure the SVG in named layers, base first.** Every shipped or staged candidate organises its content into `<g id="...">` groups: `<g id="base">` for everything from the original brief, then one `<g id="layer-<short-name>">` per added dimension, in the order added. This keeps a promoted file self-documenting (a future agent can read the group structure to see what's foundational vs. additive) and makes a layer that doesn't work out removable without touching the base.
3. **Don't invent a parallel version-naming scheme.** No `-v2`/`-v3` suffixed files — git already is the version history. Each evolution round is its own commit naming the layer added; the working file at `public/images/covers/<slug>.svg` always reflects current state; the brief's Evolution log plus `git log` together tell the full story.

---

## Reusable procedure

Read this section first if you're picking this up cold — for the next project, a brand-new one, or re-doing the POC's own output under a changed design system. The narrative sections below (Revision, Third-party skill survey) are provenance for _why_ the pipeline looks like this; they're not required reading to run it again. The `.docs/design/covers/hivemq-edge/briefs.md` and `.docs/design/covers/demist/briefs.md` files are worked examples — read one before starting a new project's brief, as a concrete reference for depth and format.

### Inputs you need before starting

1. **The project's own content** — its MDX file (`src/content/research/<slug>.mdx` or `src/content/engineering/<slug>.mdx`) plus anything richer: a staged case study under `src/content/case-studies/<slug>--*/`, or (for research projects specifically) paper summaries in the sibling `nvl-research-overview/data/summaries/` project — **read-only**, never edit anything there. Thin MDX-only content is a real signal, not just an inconvenience: if there's nothing to quote, that project is a candidate for one of the two generic fallbacks (`cover-research-generic.svg` / `cover-engineering-generic.svg` under this SVG-based approach) instead of a bespoke brief. Don't invent a motif to fill the gap.
2. **The target page's own current colour usage** — before deciding whether the cover can carry the compass-arc red, check what else on the destination page already uses it. For `/projects/[slug]`, `ClassificationHeader`'s ONGOING status stamp already spends the page's one red (DESIGN.md's One Red Rule is page-scoped — see the revision note further down.). **Don't assume "ongoing = red, archived = graphite" by default** — that was wrong the first time through this exact task; check the actual page composition each time instead.
3. **DESIGN.md, current version** — specifically the Compass Grammar, One Red Rule, No-Decoration Rule, and Flat-by-Construction Rule sections. If DESIGN.md has changed since 2026-09-27, the token values below and the rule self-check criteria in every existing brief may be stale — see "Re-doing under changed rules."

### The six-phase loop (repeat per project)

1. **Visual brief** — find 2–5 genuinely different motifs grounded in the project's own content (not generic "tech illustration"). One sentence per motif is enough at this stage; full development happens in Phase 2.
2. **Written interpretation** — for each motif, write the full brief (motif name, source grounding as a verbatim quote + file path, concept statement, composition, rule variants, rule self-check) into `.docs/design/covers/<slug>/briefs.md`. This is the QA gate — a weak brief gets cut or reworked here, before any SVG time is spent.
3. **Author + preview** — for each approved brief, write two `.svg` files (Rule A / Construction Visible, Rule B / Resolved Only) to a staging directory, then add them to a contact-sheet HTML page rendering every candidate at real `lg`/`md` ship sizes on real cream ground.
4. **Review and select** — check the brief and the rendered SVG together (did the drawing drift from what was written down), then get an explicit human pick — one candidate per project.
5. **Promote + wire** — move the winning SVG to `public/images/covers/<slug>.svg`, set `media.cover` in the project's MDX frontmatter, run `npm run validate`.
6. **Record the decision** — note the outcome (which candidate won, why) either in this document or in a project-specific follow-up note; keep the losing candidates' briefs on disk, they're not wasted work if the design system changes later (see below).

### Token quick-reference (current as of 2026-09-27 — verify against live DESIGN.md before reuse)

| Purpose                                                                                | Value                                                                                                                                                   |
| -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Graphite stroke                                                                        | `#2a2a2a`                                                                                                                                               |
| Ghost-weight stroke/fill                                                               | `#c8c4bc`                                                                                                                                               |
| Compass-arc red (only if the target page's colour budget allows it — see Inputs above) | `#c0392b`                                                                                                                                               |
| Cream ground                                                                           | `#f8f4ed` — **not baked into the SVG**; the SVG background stays transparent and the page's own `bg-ground` shows through                               |
| Heavy stroke width                                                                     | `1.5`                                                                                                                                                   |
| Medium stroke width                                                                    | `1`                                                                                                                                                     |
| Ghost stroke width                                                                     | `0.5`                                                                                                                                                   |
| Medium dash pattern                                                                    | `4 3`                                                                                                                                                   |
| Ghost dash-dot pattern                                                                 | `1 2 5 2`                                                                                                                                               |
| Ghost short-dash pattern                                                               | `2 2`                                                                                                                                                   |
| viewBox / render target                                                                | `0 0 200 168` (matches the `lg` 200×168px render exactly; `md` 120×100px is the same SVG scaled down by the browser, not a separate viewBox)            |
| Root element                                                                           | `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 168" width="200" height="168" fill="none">`, first two children always `<title>` and `<desc>` |

No text glyphs, no embedded fonts, no base64, no `<filter>`, no `<linearGradient>`/`<radialGradient>`, relative coordinates avoided (absolute throughout — makes hand-verification of geometry possible without a renderer).

### Re-doing under changed rules

If DESIGN.md's world changes (new palette, new line-weight scale, a relaxed or tightened One Red Rule, etc.), what needs re-deriving and what stays valid:

- **Stays valid, don't redo:** the briefs' source grounding (Phase 2's quotes/citations) and concept statements — these are about the project's content, not the design system, and don't expire when tokens change.
- **Needs re-checking:** every brief's **Rule self-check** section and the **Token quick-reference** table above — both are snapshots against a specific DESIGN.md version. Re-run the self-check against the new rules before trusting an old PASS.
- **Needs re-drawing, not just re-checking:** the actual `.svg` files, if the token values (colours, stroke widths) changed, or if a structural rule changed (e.g. corners are no longer restricted to sharp/arc-defined). The compositions described in each brief's **Composition** section should still be valid as _geometry_ — translate them into new coordinates/tokens rather than inventing new motifs from scratch.
- **The rule-variant matrix itself (Construction Visible / Resolved Only) is a durable methodology**, independent of any specific token set — it stays useful as a production technique even if what "construction apparatus" looks like changes.

---

## Revision (2026-09-27): hand-authored SVG, not AI raster generation

The first pass of this plan (see git history) reached for raster image generation — `generate-image.mjs` → OpenAI `gpt-image-2`, $0.05–0.25/image, requiring an API key I don't have in this environment. That was the wrong instinct.

The reference the user pointed to, [designwithintent.ai/skills/](https://designwithintent.ai/skills/), uses hand-vectored abstract "score" diagrams: geometric primitives (frames, vectors, points, apertures), monochrome hairline linework, where **the form of the mark models the concept** rather than depicting it literally (their wireframing icon uses orthogonal zone divisions — "structure before surface" — because that's what wireframing _is_, not a picture of a wireframe). That technique is near-identical to what DESIGN.md already specifies for this portfolio under **The Compass Grammar**: "Every shape in the UI should be derivable from a compass-and-ruler construction" — dimension lines with terminal arrows, construction arcs with centre marks, leader lines from labels to elements.

Checked both named skills again on this basis: `imagegen-frontend-web` and `brandkit` are prompt-direction files only (no scripts, no SVG output path) — both exist purely to steer a _raster_ image-generation call. Neither has any SVG capability. So the correction isn't "use a different skill" — it's that **no skill is needed here.** Authoring a small, precise, token-accurate vector construction is squarely a coding task, not an image-generation task. I write the SVG directly, the same way I'd write any other component.

This is a materially better fit for the project:

- **Token-exact colour** — `#f8f4ed` / `#2a2a2a` / `#c0392b` written directly, zero drift risk (no AI reinterpretation of "cream" or "graphite")
- **Zero cost, no external dependency, no API key**
- **Crisp at every size** — no raster resampling artefacts at 120×100px; the component can even drop the `<img>` wrapper and inline the `<svg>` if we later want CSS-driven hover states
- **"No gradients" is structural, not a prompt instruction** — an SVG built from `<line>`/`<path>`/`<circle>` strokes literally cannot gradient unless I write a `<linearGradient>`, so the constraint enforces itself
- **The duotone CSS filter note in the parent task becomes moot** — that filter exists to bring _out-of-world_ raster images (photography, full-colour renders) into the palette. A hand-authored SVG is already native to the world; it needs no filter, and `SpecimenIllustration` can render it directly

---

## Third-party skill survey (2026-09-27)

User surfaced three external candidates after the SVG pivot: `narumiruna/skills` (`create-svg-illustrations`), `supermemoryai/skills` (`svg-animations`), `dkyazzentwatwa/chatgpt-skills` (`svg-precision-skill`). Assessed against the Compass Grammar approach above:

| Skill                                 | What it is                                                                                                                                                                           | Verdict                                                                                                                                                                                                    |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `narumiruna/create-svg-illustrations` | Geometric/abstract technical diagrams, accessibility-first (semantic `<title>`/`<desc>`), portability discipline (no embedded fonts/base64/exotic filters), validated with `svglint` | Strong philosophical match — same posture as DESIGN.md. Surfaced a real gap: my plan hadn't specified how a cover SVG gets its accessible name.                                                            |
| `supermemoryai/svg-animations`        | Primarily motion — stroke-draw reveals, morphing, CSS/SMIL animation                                                                                                                 | Out of scope — these are static specimen illustrations, DESIGN.md's interaction rules are deliberately conservative. Noted as a possible future follow-up, not this task.                                  |
| `dkyazzentwatwa/svg-precision-skill`  | Deterministic spec-driven generation via its own Python CLI (`svg_cli.py build`) + templates, PNG-preview validation                                                                 | Principles fit (explicit viewBox, absolute coordinates, avoid text where exact rendering matters, avoid exotic filters), but ships an unaudited executable script for a job hand-authoring already covers. |

**Decision: adopt principles inline, install nothing.** No third-party code runs for this task. Folded into Phase 3 below:

- Every candidate SVG gets a semantic `<title>` (accessible name) and `<desc>` (one-line description of the construction) as its first children — satisfies the project's hard a11y rule (all images need alt text) without relying on host-level `alt` alone, and gives `SpecimenIllustration` something concrete to wire into `aria-label`/`alt` if a11y review flags the plain `<img>` wrapper as insufficient.
- Explicit `viewBox`, `width`, `height` on the root `<svg>`.
- Absolute coordinates throughout — no relative path shorthand that would make hand-verification harder.
- No embedded fonts, no base64, no filters — text stays out of the SVG entirely (labels like "MQTT" or "DeFT" render as page-level `<figcaption>`/CSS if needed, not baked into the vector) — reinforces the No-Decoration and Flat-by-Construction rules rather than fighting them.

---

## Pipeline

### Phase 1 — Per-project visual brief

For each project, derive a **specific conceptual diagram** from its actual narrative content — not a generic "tech illustration," and not a literal logo/scene. Follow the designwithintent.ai method: find the shape that _is_ the concept.

- **HiveMQ Edge** (`src/content/engineering/hivemq-edge.mdx` + the staged case study, richer): Translation Layer (protocol convergence), Bet That Worked (Workspace topology), Seven Attempts One Current (Domain Ontology). See `.docs/design/covers/hivemq-edge/briefs.md` for the grounded version.
- **DEMIST** (`src/content/research/demist.mdx` + paper summaries): Three Ways to Show Time (T-P/T-I/T-S taxonomy), Degrees of Connection (translation levels), The DeFT Framework. See `.docs/design/covers/demist/briefs.md`.
- **Colour, both projects: pure graphite, no red.** Revised 2026-09-27 (review round 2) — the One Red Rule is page-scoped (DESIGN.md: "exactly once **per surface**"; this project's own vocabulary treats "surface" as the whole page, per `.impeccable/surfaces/`), and `/projects/[slug]` already spends its one red on `ClassificationHeader`'s ONGOING status stamp. A red accent inside the cover would be a second red on the same page. Full reasoning in `.docs/design/covers/hivemq-edge/briefs.md`'s revision note.

Each project gets **3 distinct compositional takes**, each rendered in **2 rule variants** (see the matrix below) — 6 SVGs per project, 12 total for the POC.

### Rule-variant matrix (2026-09-27, added on review)

A brief (Phase 2) fixes _what a mark represents_. It doesn't have to fix _how much of its own construction is shown_ — that's a separate, orthogonal axis, and DESIGN.md's own "construction in progress" metaphor names exactly this tension. Rather than pick one answer per candidate, every candidate is drawn in both:

- **Rule A — Construction Visible:** the mark shows its own scaffolding — centre/origin marks where the composition was built from a shared point or radius, ghost-weight registration ticks, visible guide dots at implied grid intersections — even where that scaffolding isn't otherwise load-bearing to the concept. Legible as "this was compass-and-ruler built."
- **Rule B — Resolved Only:** all of that scaffolding is stripped. Only primitives that are semantically load-bearing to the concept itself remain (e.g. DEMIST Candidate 3's centre mark stays in both variants, because there the centre _is_ the concept — the system the three framework vectors jointly define — not scaffolding). Reads as a finished technical drawing, not work-in-progress.

Per-candidate specifics for what each variant adds/removes are recorded in each brief file directly, next to the base composition.

### Phase 2 — Written interpretation (QA gate before any SVG)

Before a single line of markup is written, every candidate gets a structured **interpretation brief** — the textual, reviewable form of "what this construction means and why," produced and checked independently of drawing. This is a hard gate: nothing gets drawn from an idea that hasn't been written down and reviewed first. It also gives us a clean audit trail for the "did the source content actually justify this mark" question, which pure image review can't answer on its own.

Stored at `.docs/design/covers/<slug>/briefs.md` (one file per project, all 3 candidates together), each candidate documented as:

- **Motif name** — short label.
- **Source grounding** — the specific sentence(s) or finding(s) this construction is derived from, quoted verbatim with their source (MDX body, a case-study chapter path, or — for DEMIST — a paper summary path under `nvl-research-overview/data/summaries/`). No motif ships without a quoted grounding line; if a motif has nothing real to point to, it gets cut or reworked here, not shipped on vibes.
- **Concept statement** — one sentence: what the form _models_, not what it _depicts_ (the designwithintent.ai discipline — form embodies function).
- **Composition** — element-by-element description of the geometry, written before any markup exists: how many primitives, their arrangement, what the eye reads first/second/third. Precise enough that two people implementing it from the brief alone would produce recognizably the same diagram. Don't default to a small symmetric radial/linear diagram — consider hatching/density and asymmetric or figural construction where the concept calls for it (see "Round 2" above).
- **Rule variants** — what Rule A (Construction Visible) adds and what Rule B (Resolved Only) keeps as the minimum, specific to this candidate's own geometry (see the rule-variant matrix above).
- **Genericness check** — could this exact geometry represent an unrelated project's concept with equal validity? If yes, rework or cut it (added after Round 1 — see above).
- **Rule self-check** — explicit pass/fail against the One Red Rule, No-Decoration Rule, Compass Grammar, and Flat-by-Construction Rule.

This brief — not the rendered SVG — is the primary review artifact for Phase 5. A candidate can be rejected here, before any drawing time is spent, if its grounding is weak or its composition doesn't actually model the concept it claims to.

### Phase 3 — Author + preview

Once a candidate's brief is written (Phase 2), author it as **two** standalone `.svg` files strictly from that brief — one per rule variant, no new ideas introduced at draw time. ViewBox sized to the render aspect (~1.19:1, matching the `lg` 200×168 target), built only from stroke-based primitives (`line`, `path`, `circle`, `polyline`) in the two world tokens now in play (cream ground, graphite — no red, see the revised motif list above) — no `fill` gradients, no raster embeds. Stage them at `.local/tmp/covers/<slug>/candidate-N-construction.svg` and `.local/tmp/covers/<slug>/candidate-N-resolved.svg`.

Rather than reviewing raw SVG source, build a small contact-sheet HTML page (reusing the existing comp-preview pattern this project already has for `.docs/design/comps/`) that renders every candidate for both projects at actual `lg` (200×168) and `md` (120×100) size against the real `--color-ground` cream, side by side. This is a far more honest review than eyeballing raster PNGs — it shows exactly what ships, at the exact sizes it ships at.

### Phase 4 — Review and select

Review both artifacts together, not the image alone: the brief (does the grounding still hold up, does the rule self-check still read true) and the rendered SVG on the contact sheet (does the shipped mark still match what was written down, is it legible at 120×100px). Flag any candidate that drifted from its own brief during authoring. Then hand the set to you for the actual pick — one candidate per project.

### Phase 5 — Promote + wire

Move the selected SVG to `public/images/covers/<slug>.svg` (schema already supports this — `media.cover` is "Path relative to /public or absolute URL", no format restriction). Set `media.cover` in the project's MDX frontmatter. Update `SpecimenIllustration` if needed to confirm it renders `.svg` cleanly via `<img>` (no filter applied — see Revision above). Run `npm run validate`. Keep the winning candidate's brief — move it alongside the SVG's record (e.g. reference it from this task doc's Phase 6 entry) so the shipped asset stays traceable to its written rationale.

### Phase 6 — Record the decision

Append the outcome (brief, candidates, selection rationale) to this document. Explicitly out of scope for this pass, called out as follow-ups:

- Remaining projects (calques3d, and any others under `src/content/research/` / `src/content/engineering/`)
- The two generic fallbacks: `cover-research-generic.png` / `cover-engineering-generic.png` (would also become `.svg` under this revised approach — worth renaming when that follow-up task starts)

---

## POC output (2026-09-27)

**Round 1** (superseded, kept for reference — see "Round 2" above for why): `.docs/design/covers/{hivemq-edge,demist}/briefs.md`'s Round 1 sections (where retained) and `.local/tmp/covers/{hivemq-edge,demist}/candidate-{1,2,3}-{construction,resolved}.svg` — rejected on review, genericness problem.

**Round 2** (current): Phases 1–3 complete for both projects, expanded vocabulary, genericness-checked. Not yet reviewed/selected (Phase 4) or promoted (Phase 5) — that's the next step, pending your pick.

- Briefs: `.docs/design/covers/hivemq-edge/briefs.md`, `.docs/design/covers/demist/briefs.md` — fully rewritten for Round 2 (3 candidates each, committed — permanent artifacts, not staged/temp). HiveMQ Edge Candidate 1 also carries a worked (not-yet-executed) Evolution log entry demonstrating the layered-enrichment process.
- SVGs (staged, not yet promoted — `.local/tmp/`, gitignored, safe to delete once a winner per project is promoted to `public/images/covers/`):
  - `.local/tmp/covers/hivemq-edge/round2-candidate-{1,2,3}-{construction,resolved}.svg` (6 files)
  - `.local/tmp/covers/demist/round2-candidate-{1,2,3}-{construction,resolved}.svg` (6 files)
  - Every file's content is wrapped in `<g id="base">`, per the Evolving-a-candidate structural convention — ready to receive a `<g id="layer-...">` addition later without restructuring.
- Contact sheet: `.local/tmp/covers/round2-contact-sheet.html` — open directly in a browser (relative `<img>` paths, no dev server needed) to review all 12 at real `lg` (200×168) and `md` (120×100) sizes against real cream ground.
- Coordinate geometry in all 12 files was hand-computed, not rendered/screenshotted during authoring — visual review in an actual browser is the verification step that hasn't happened yet, not a formality. HiveMQ Edge Candidate 1 ("Twenty-Plus, One") is self-flagged MARGINAL on its own genericness check in the brief — worth the closest look.

---

## Technical notes

- **Aspect/size:** target render is ~200×168px (`lg`) / 120×100px (`md`), aspect ≈ 1.19:1. SVG viewBox matches this natively; no format compromise the way raster sizing required.
- **The One Red Rule keeps cover art pure graphite for both projects** — it is page-scoped, not SVG-scoped, and the status stamp elsewhere on `/projects/[slug]` already spends the page's one red. See the revision note in `.docs/design/covers/hivemq-edge/briefs.md`.
- **No-Decoration Rule applies:** every line in the construction must be structural to the concept being represented — if removing a mark makes the diagram calmer without making it less legible as _that project's_ concept, cut it. The rule-variant matrix doesn't relax this: Rule A's added scaffolding must still be genuine construction apparatus (centre marks, registration ticks, guide dots), never invented decoration.
- **No 3D, no gradients, no animation by default** — Flat-by-Construction Rule bans shadow-based depth; the Shapes section allows only sharp or arc-defined corners; the parent task's own generation brief bans gradients outright, which also rules out DESIGN.md's one named pseudo-3D exception (the gradient-shaded "shallow fold" arc). Motion isn't explicitly forbidden but isn't called for either — the page's own framing of this element ("Specimen Illustration" inside a natural-history-specimen composition) argues for static.
- **Storage:** `public/images/covers/` doesn't exist yet in this repo (checked — `public/` currently only has the default Next.js SVGs). This task creates that directory.
- **No API key, no cost, no external skill invocation required** for this pass.
