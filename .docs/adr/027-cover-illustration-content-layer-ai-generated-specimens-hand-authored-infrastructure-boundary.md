---
number: 27
title: 'Cover Illustration Content Layer: AI-Generated Specimens, Hand-Authored Infrastructure Boundary'
status: accepted
date: '2026-10-10'
decision-makers: vanch3d
tags: ['design-system', 'content', 'illustration', 'projects', 'process']
---

# ADR 027 — Cover Illustration Content Layer: AI-Generated Specimens, Hand-Authored Infrastructure Boundary

**Date:** 2026-10-10
**Status:** Accepted
**Supersedes:** ADR 026

## Context

ADR 026 recorded an open fork on how `/projects/[slug]` cover illustrations (`SpecimenIllustration.tsx`, `media.cover`) should be produced: Option 1 (hand-authored only, per `.docs/tasks/2026-09-27-project-image-generation.md`) vs. Option 2 (AI-generated `svgmaker` "content-layer specimens," routed through the existing `duotone-specimen` CSS filter). ADR 026 explicitly deferred the decision to an `/impeccable` design-critique session, which this ADR records the outcome of.

By 2026-10-10, 14 of the portfolio's projects had svgmaker story-driven covers generated (hivemq-edge, demist, calques3d, ilp, leactivemath, auditorygames, safesea, explabs, makingstuff, myplan, mypal, matillion, hubspot, almotech), plus an earlier dictated-construction variant for hivemq-edge — 15 files total, none promoted. The critique session ran two isolated sub-agent assessments (a markup-level design review and a deterministic grep-based compliance scan across all 15 files) plus direct browser-rendered visual verification via a purpose-built Cypress screenshot (this project's existing comp/PR-snapshot mechanism, reused for illustration review) — the first time these files were actually looked at, rather than reasoned about from prompt text and gradient counts alone.

The critique's first pass concluded, on structural/compliance grounds, that the AI covers failed DESIGN.md's Compass Grammar and Flat-by-Construction Rule categorically (0 of 15 files contain any true geometric primitive — every shape is a traced `<path>`; 12 of 15 contain gradient definitions) and that the proposed `duotone-specimen` bridge did not resolve this — confirmed empirically by screenshot: the filter desaturates hue but a gradient survives as a grayscale gradient. On that evidence alone, the initial recommendation was to keep Option 1 as the only shipped mechanism and treat the AI pipeline as unpromoted reference material.

Nicolas reviewed that conclusion and pushed back on three specific grounds, each checked before this ADR was finalized rather than taken on faith:

1. **The comparison was one-sided.** The critique scored the AI covers against DESIGN.md in detail but never checked the hand-authored alternative under the same lens. A direct screenshot comparison of the hand-authored Round 2 candidates (`.local/tmp/covers/round2-contact-sheet.html`, archived at `.docs/design/covers/review-2026-10-10-screenshots/hand-authored-round2-comparison.png`) against the AI covers confirmed this: the hand-authored candidates are minimal to the point of near-interchangeability between projects (e.g. HiveMQ Edge Candidate 3 is a line, a dot, and two faint arcs; DEMIST Candidate 3 is two boxes and an arc) — exactly the "generic template" failure mode the hand-authored pipeline's own Round 1 retrospective (`.docs/tasks/2026-09-27-project-image-generation.md`) had already flagged and tried to correct, with only partial success by Round 2. For a portfolio whose stated purpose is to make each project's narrative legible at a glance (PRODUCT.md: "Depth on demand... scannable in 30 seconds"), near-indistinguishable covers are a real cost that strict rule-compliance alone does not capture.
2. **The critique conflated two different layers of the design system.** DESIGN.md's Compass Grammar, Flat-by-Construction Rule, and One Red Rule were written for — and have only ever been tested against — the site's structural chrome: navigation, headers, status stamps, dimension lines. They were never written with an illustration register in mind. Treating a content illustration's organic/gradient-bearing geometry as a violation of rules scoped to structural chrome is applying the wrong ruleset, not finding a real inconsistency.
3. **Several findings were treated as terminal when they are actually cheap to fix or already proven fixable.** Cream-background color drift between files is a mechanical normalization, not a structural flaw. HiveMQ Edge's lean into literal icon imagery (gears, a bee-shaped hex mark) is the one outlier among 15 files and is fixable by the same re-prompting method already used to fix the earlier dictated-construction palette problem (ADR 026's own Run A vs. Run B finding). Neither was weighed as "fixable" in the critique's P0/P1 framing.

## Decision

**Adopt a two-layer design system: Infrastructure and Content.** This is now a named, binding distinction, to be written into DESIGN.md directly (follow-up task — see Related), not left implicit.

**Infrastructure layer** — unchanged, still fully binding, zero exceptions: all site chrome (navigation, headers, `ClassificationHeader`, status stamps, dimension lines — every component DESIGN.md's Compass Grammar, Flat-by-Construction Rule, and One Red Rule were written to govern) stays strictly compass-and-ruler, flat (no gradients, no shadows), and two-tone cream/graphite with the single compass-arc red per surface. Nothing in this ADR relaxes any Infrastructure-layer rule anywhere.

**Content layer — new.** Project cover illustrations (`media.cover`, rendered by `SpecimenIllustration.tsx`) are formally a second visual register, governed by a narrower ruleset:

- **Must stay inside the disciplined cream-to-graphite tonal family** — no stray hues (blues, browns, saturated colors). This is the one property story-driven svgmaker prompting has reliably delivered across all 15 files on record, and is the actual load-bearing visual-consistency guarantee for this layer.
- **No text, no logos, no embedded raster/photography, no readable labels** — unchanged from the existing generation briefs. HiveMQ Edge's original story-driven render ("Run B") violated this (see remediation below); re-prompted ("Run C") and now compliant, promoted. The finding was only caught by rendering the file and looking at it, since the offending letterforms were traced `<path>` geometry from the raster-then-vectorize pipeline, not real `<text>` elements a markup scan would catch. Any future compliance check for this layer must include an actual render, not markup inspection alone.
- **No compass-arc red** — the One Red Rule's accent stays reserved for Infrastructure-layer active/selected state; cover art stays pure cream-to-graphite.
- **Gradients and organic/traced geometry are permitted** — explicitly exempted from the Compass Grammar and Flat-by-Construction Rule, which remain Infrastructure-only.
- **Narrative grounding is required** — every candidate must trace to a quoted source sentence from the project's own content (already the practice, documented per-project in each `svgmaker-prompts.md`).
- **A genericness check is required before promotion** — "could this exact composition represent an unrelated project's concept equally well?" A candidate that fails (as HiveMQ Edge's original "Run B" render did, leaning into generic gear/compass/logo iconography against its own prompt's instruction) is re-prompted, not promoted as-is — demonstrated in practice, not just policy, by HiveMQ Edge's own Run B → Run C remediation.
- **`duotone-specimen` is not applied to Content-layer covers.** The filter's own code comment (`src/styles/utilities/index.css`) already scopes it to imported, out-of-world imagery (photography) — Content-layer SVGs are natively in the cream/graphite family by construction and need no bridge. This also resolves ADR 026's open technical question: the filter was never the right mechanism for this output, not a broken one. `SpecimenIllustration.tsx` should stop applying `duotone-specimen` unconditionally and only apply it to genuinely out-of-world raster imagery, if that ever becomes a real input.

**Required remediation before any file is promoted to `public/images/covers/` / wired into `media.cover`:**

1. ~~Normalize the background/base fill color across all 14 generated files to a single locked value~~ — **done.** `.claude/skills/cover-illustrations/scripts/normalize-cover-background.mjs` replaced every near-cream fill/stroke/stop-color value (within RGB distance 20 of `#f8f4ed`) with the exact token across all 14 files; verified by re-rendering the full contact sheet, no regressions.
2. ~~Re-prompt HiveMQ Edge's story-driven cover~~ — **done (2026-10-11).** Scope widened on inspection: rendering the file (not just reading its markup) showed Run B baked in the literal wordmark "HiveMQ Edge" plus a bee/hive-shaped hex logo mark — a direct "no text, no logos" violation, not just the originally-scoped icon-collage lean. Revised prompt ("Run C", `.docs/design/covers/hivemq-edge/svgmaker-prompts.md`), explicitly forbidding both, succeeded on retry: zero banned-content matches confirmed by grep, a genuinely specific chaos-converging-to-order composition with no icons or text. Run C is now the canonical file, promoted to `public/images/covers/hivemq-edge.svg` and wired into `media.cover`; Run B kept on disk renamed `svgmaker-poc-story-driven-run-b-icon-collage-rejected.svg` for the record.
3. ~~Spot-check legibility of the two densest files at the real shipped 120×100 `md` size~~ — **done.** HiveMQ Edge's Run B wordmark/logo violation was clearly legible even at `md` size, reinforcing why it needed re-prompting, not merely cropping differently — resolved by item 2 above. Calques3D holds up fine at `md` — the hatched isometric construction stays legible, no action needed. A broader 5-file spot-check (DEMIST, SAFeSEA, Matillion, MyPlan, LeActiveMath) for the same hidden-text failure mode found no equivalent issue elsewhere.

All three remediation items are complete. **All 14 of 14 covers are promoted** to `public/images/covers/` and wired into `media.cover` across `src/content/{research,engineering}/*.mdx` — verified live on the real `/projects/[slug]` pages, not just the design-reference contact sheet. Separately, `SpecimenIllustration.tsx`'s `object-cover` was found to crop ~17% off the top/bottom of every cover (square source into a non-square box) and changed to `object-contain` — see that component's own code comment; not a Content Layer policy change, a rendering-fidelity fix.

## Consequences

**Positive:**

- Cover art gets genuinely differentiated, narrative-specific illustrations at the velocity story-driven prompting already demonstrated (minutes per project, not a multi-phase hand-authored pipeline), without the near-interchangeability the hand-authored baseline was shown to produce.
- The Infrastructure/Content split gives the portfolio's own stated design philosophy ("construction on tracing paper," a geometric proof) a real, defensible boundary instead of an implicit one — structural chrome's credibility claim ("nothing arbitrary") stays intact because content was never claiming to be structural chrome in the first place.
- `duotone-specimen` keeps its originally-scoped job (bridging genuinely out-of-world imagery) rather than being stretched to do a job it demonstrably can't do (flattening gradients).
- The remediation list is small, concrete, and bounded — not an open-ended quality chase.

**Negative / Trade-offs:**

- Recurring cost enters the project's cover-art pipeline for the first time (svgmaker credits, free-tier-gated as observed repeatedly this session — generation availability is not fully predictable).
- A second visual register now exists and must be explained to any future contributor or agent — mitigated by writing it into DESIGN.md directly rather than leaving it as tribal knowledge in ADRs.
- The genericness check is manual/judgment-based, not automatable the way the color/gradient/primitive checks are — HiveMQ Edge's failure was caught by a human (Nicolas), not by either sub-agent's structural scan, which only reads markup.
- `ilp` and `hubspot`'s comparatively strong results (0 gradients, cleanest geometry; and a 9-icon grid reading as genuinely specific, respectively) are noted here as evidence that subject abstraction level correlates with pipeline cleanliness — useful for future prompting, not treated as an exception needing separate promotion rules.

## Alternatives considered

**Option 1 as originally scoped (hand-authored only, no exceptions).** This session's own comparison screenshot undercuts its main claimed advantage (visual/narrative specificity); the hand-authored Round 2 candidates are demonstrably less differentiated between projects than the AI alternative, not more. Rejected as the sole mechanism, though the hand-authored _pipeline and discipline_ (grounded-quote briefs, genericness check, rule-variant matrix) remains the template the Content Layer's own genericness check borrows from.

**Option 2 as originally scoped in ADR 026 (AI content bridged through `duotone-specimen`).** Rejected specifically on the filter mechanism: empirically confirmed this session that `duotone-specimen` does not flatten gradients, only desaturates hue, so it cannot do the job Option 2 assigned it. Superseded by this ADR's version, which drops the filter requirement entirely rather than trying to fix or replace it.

**A real flattening/posterize filter, tested and substituted for `duotone-specimen`.** Considered as a middle path (keep filtering, just use a filter that actually works) but rejected for now: Content-layer SVGs are already natively in-palette, so there is nothing for a flattening filter to fix that generation-prompt discipline doesn't already handle. Revisit only if a future out-of-world raster source (real photography) is ever added to `media.cover`.

**Scope the AI track down to only abstraction-heavy, low-gradient-prone projects (ILP-like).** Considered after the critique's first pass, before the hand-authored comparison was run. Rejected once that comparison showed the hand-authored baseline underperforms broadly, not just on concrete-subject projects — narrowing eligibility would have reintroduced the differentiation problem this ADR exists to fix.

## Related

- ADR 026 — the fork this ADR resolves and supersedes.
- `.docs/tasks/2026-09-27-project-image-generation.md` — the hand-authored pipeline; its grounding/genericness-check discipline is reused by the Content Layer policy above.
- `.docs/design/covers/{hivemq-edge,demist,calques3d,ilp,leactivemath,auditorygames,safesea,explabs,makingstuff,myplan,mypal,matillion,hubspot,almotech}/svgmaker-prompts.md` — per-project generation records.
- `.impeccable/critique/2026-10-10T17-23-19Z__docs-design-covers.md` — the persisted critique snapshot this ADR is built on.
- `.docs/design/covers/review-2026-10-10-contact-sheet.html`, `.docs/design/covers/review-2026-10-10-screenshots/` — the visual evidence (both the AI-cover contact sheet and the hand-authored comparison) produced during this review.
- `src/app/projects/[slug]/_components/SpecimenIllustration.tsx`, `src/styles/utilities/index.css` (`duotone-specimen`) — done; `duotone-specimen` now only applies to non-SVG (raster) covers, scoped by file extension. CT spec updated with both cases.
- `DESIGN.md` — done; "Content Layer" subsection added after Shapes, before Do's and Don'ts.
- `public/images/covers/<slug>.svg`, `media.cover` frontmatter in `src/content/{research,engineering}/*.mdx` — done for all 14 of 14 projects, including `hivemq-edge` after its Run C remediation. Promoted directly to `public/images/covers/`, matching the existing documented schema contract in `src/schemas/shared.schema.json` (`cover: "Path relative to /public or absolute URL"`) — no schema or component change needed. `.docs/design/covers/` stays in place as the permanent design-reference archive (briefs, prompts, rejected candidates, critique screenshots); it is not the served source. A `src/content/covers/` co-located-source-plus-sync-script alternative was considered and explicitly declined in favour of this simpler path.
- `.claude/skills/cover-illustrations/` — the skill this pipeline's scripts (`svg-compliance-scan.mjs`, `svg-compliance-summarize.mjs`, `normalize-cover-background.mjs`) and recipe now live under, keeping the repo-root `scripts/` directory limited to one-off inspection utilities rather than accumulating purpose-specific tooling.

## More Information

- **2026-10-10:** Critique session run (two isolated sub-agent assessments + direct Cypress-based visual verification), initial recommendation revised after Nicolas's review surfaced the one-sided-comparison and layer-conflation issues above. This ADR records the corrected, final decision.
- **2026-10-10 (same day, follow-up):** Remediation items 1 (background normalization) and 3 (`md`-size legibility check) completed; item 2 (HiveMQ Edge re-prompt) remains blocked on svgmaker credits. `SpecimenIllustration.tsx` and DESIGN.md follow-up changes completed. 13 of 14 covers promoted to `public/images/covers/` and wired into `media.cover`; `hivemq-edge` excluded pending its text/logo remediation — do not promote the existing file. CSS custom properties for the SVG fills (to link Content-layer colours to the design-system token layer) were considered and explicitly declined: no live dark-mode consumer exists yet (`src/styles/themes/index.css` is a documented no-op placeholder), `<img src>` cannot see host CSS variables regardless (would require inlining, costly at these file sizes — up to 586KB/1,608 paths), and the Content layer is deliberately allowed its own multi-shade tonal ramp rather than Infrastructure's 2-token contract, so there isn't a clean 1:1 variable mapping to make. Revisit only if dark mode becomes a real, scheduled feature — a CSS `filter` on the `<img>` is the cheaper mechanism to reach for first.
