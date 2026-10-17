---
name: cover-illustrations
description: >
  Generate, audit, and promote AI-generated project cover illustrations
  (`media.cover`, rendered by `SpecimenIllustration.tsx`) under the Content
  Layer rules (ADR 027). Use when adding a cover for a new research/engineering
  project, re-prompting a rejected candidate, auditing the existing batch for
  DESIGN.md compliance, or normalizing background-colour drift across files.
license: MIT
metadata:
  author: vanch3d
  version: '1.0'
---

# Cover Illustrations Skill

Owns the pipeline for `/projects/[slug]` cover art: story-driven generation via
the `svgmaker` MCP, deterministic compliance auditing, background
normalization, and promotion into `public/images/covers/` + `media.cover`.

**Read first, every time:** `DESIGN.md`'s "Content Layer" section (the binding
ruleset this skill enforces) and ADR 027
(`.docs/adr/027-cover-illustration-content-layer-ai-generated-specimens-hand-authored-infrastructure-boundary.md`,
the decision this skill implements). ADR 026
(`.docs/adr/026-cover-illustration-hand-authored-vs-ai-generated-specimens.md`)
is the historical record of the fork ADR 027 resolved — read for context, not
as current policy.

**Usage:** `/cover-illustrations [generate <slug> | scan | normalize | promote <slug>]`

No argument: ask which stage is needed, or walk the full pipeline below for a
new project end to end.

---

## The Content Layer rules (enforced by this pipeline)

From `DESIGN.md`, binding for every file this skill touches:

- Stay inside the cream-to-graphite tonal family — no stray hues.
- No compass-arc red.
- Gradients and organic/traced geometry are **permitted** here (exempted from
  the Compass Grammar and Flat-by-Construction Rule, which remain
  Infrastructure-only — see ADR 027 if the distinction is unclear).
- No text, no logos, no embedded raster/photography, no readable labels —
  **zero exceptions**, and the one rule this pipeline has actually been
  burned by (HiveMQ Edge's first generation baked in a wordmark + logo mark
  as traced path geometry, invisible to any markup scan — only caught by
  rendering the file and looking at it).
- Narrative grounding required — every candidate traces to a quoted source
  sentence from the project's own content.
- A genericness check before promotion — "could this exact composition
  represent an unrelated project's concept equally well?" If yes, re-prompt.
- `duotone-specimen` is never applied to these files — they're already
  native to the cream/graphite world. `SpecimenIllustration.tsx` scopes the
  filter to non-SVG covers only, automatically.

## Pipeline stage 1 — Generate

Not scriptable — `svgmaker_generate` is an MCP tool call, not a CLI. Story-driven
prompting (hand the model the project's own narrative + domain context, let it
invent the composition) reliably beats dictated-construction prompting (which
wanders into off-palette hues) — see ADR 026's Run A/B comparison for why.

1. Read the project's own `src/content/{research,engineering}/<slug>.mdx` plus
   any richer external source (case study chapters, research-paper summaries)
   available read-only outside this repo.
2. Write a story-driven prompt: narrative paragraph grounded in a quoted
   source sentence, an "interpret this abstractly, invent your own
   composition" instruction, explicit bans on literal objects/icons/text/logos
   specific to that project's domain, and the standard style block (see any
   existing `svgmaker-prompts.md` for the exact wording — keep it verbatim
   across projects, only the narrative and domain-specific bans change).
3. Call `mcp__svgmaker__svgmaker_generate` with
   `style=line_art, color_mode=few_colors, background=opaque, composition=full_scene, image_complexity=illustration, aspectRatio=square`.
4. **Credits are unreliable** — `svgmaker_account_info` reads 0 even when a
   call will succeed, and a failed call sometimes appears to trigger a refresh
   observable moments later. Don't trust the balance reading; retry the actual
   `generate` call once or twice before concluding it's genuinely blocked.
5. On success, the response includes a direct, non-paywalled hosted URL
   (expires in ~12h) — `curl` it immediately to `.docs/design/covers/<slug>/svgmaker-poc-story-driven.svg`.
   Do not rely on `svgmaker_generations_download`/`svgmaker_gallery_download`
   for this — those are paid-gated regardless of account credit balance; only
   the fresh `generate` response URL is free.
6. Record the exact prompt and resulting stats in
   `.docs/design/covers/<slug>/svgmaker-prompts.md`, matching the format of
   existing project records in that directory.

## Pipeline stage 2 — Audit

```bash
node .claude/skills/cover-illustrations/scripts/svg-compliance-scan.mjs > /tmp/scan.json
node .claude/skills/cover-illustrations/scripts/svg-compliance-summarize.mjs /tmp/scan.json
```

Deterministic, markup-only: distinct-colour count vs. the 5 approved DESIGN.md
hex values, gradient-def count, primitive-vs-path census, banned-content grep
(`<text>`, `<tspan>`, `font-family`, `<filter>`, `feDropShadow`,
`feGaussianBlur`, `base64`). **This cannot catch text/logos baked in as traced
path geometry** — that only shows up by actually rendering the file (see
Pipeline stage 4). Treat a clean scan as necessary, not sufficient.

## Pipeline stage 3 — Normalize

```bash
node .claude/skills/cover-illustrations/scripts/normalize-cover-background.mjs
```

Locks every near-cream fill/stroke/stop-color value (RGB distance ≤20 from
`#f8f4ed`) to the exact DESIGN.md token, across every
`.docs/design/covers/*/svgmaker-poc-story-driven.svg` file. Idempotent — safe
to re-run after adding a new project. Mid-tone/graphite ink colours are far
outside the threshold and untouched. Verify with a contact-sheet render after
running (stage 4) — never assume a bulk regex pass didn't break anything.

## Pipeline stage 4 — Review (not scriptable, requires real rendering)

No image-rendering or browser-automation MCP tool is reliably available —
**this project's own Cypress install is the actual browser automation path**,
not a missing capability. Serve the covers directory and screenshot it:

```bash
npx serve .docs/design/covers -p <port> --no-clipboard   # avoid ports 5060/5061 (SIP, browser-blocked)
```

Write a throwaway Cypress spec under `.local/tmp/` (never `cypress/e2e/` — this
isn't a permanent test) that visits the served contact sheet / individual file
and calls `cy.screenshot()`, run via
`pnpm cypress run --e2e --spec ".local/tmp/<name>.cy.ts" --config "baseUrl=http://localhost:<port>,specPattern=.local/tmp/<name>.cy.ts"`,
then `Read` the resulting PNG. This is the only step that catches the
text/logo-as-geometry failure mode, and the only way to judge genericness and
actual legibility at the real `md` (120×100) / `lg` (200×168) render sizes —
not just full resolution. Clean up the server and temp spec/screenshot files
when done.

## Pipeline stage 5 — Promote

```bash
cp .docs/design/covers/<slug>/svgmaker-poc-story-driven.svg public/images/covers/<slug>.svg
```

Then set `media.cover: '/images/covers/<slug>.svg'` in
`src/content/{research,engineering}/<slug>.mdx` (the schema's documented
contract — `src/schemas/shared.schema.json` — path relative to `/public`; no
schema or component changes needed). Run `pnpm run validate` afterward.
`.docs/design/covers/<slug>/` stays in place permanently as the design-
reference archive (briefs, prompts, rejected candidates, review screenshots)
— it is never the served source, and promotion never deletes anything from it.

A rejected candidate is renamed in place to flag why
(`svgmaker-poc-story-driven-run-b-icon-collage-rejected.svg` is the existing
precedent), never deleted — the next attempt's prompt record should name
exactly what the rejected run got wrong, verbatim, as the "CRITICAL
correction from a previous attempt" instruction for the retry.

---

## Related

- ADR 026, ADR 027 — the decision history and current binding policy.
- `DESIGN.md` — "Content Layer" section.
- `.docs/tasks/2026-09-27-project-image-generation.md` — the earlier
  hand-authored-only pipeline (Infrastructure-equivalent discipline); its
  grounding/genericness-check method is what this skill's generation step
  reuses.
- `.docs/issues/cover-illustrations/` — open tickets for this area (e.g.
  small-form-factor/icon-scale summary marks for list views).
- `src/app/projects/[slug]/_components/SpecimenIllustration.tsx` — the
  component these files render through.
