---
version: 2
slug: 'src-app-lab-design-system-page-tsx'
primary_target: 'src/app/lab/design-system/page.tsx'
related_targets:
  - 'src/app/lab/design-system/colors/page.tsx'
  - 'src/app/lab/design-system/typography/page.tsx'
  - 'src/app/lab/design-system/atoms/page.tsx'
  - 'src/app/lab/design-system/molecules/page.tsx'
  - 'src/app/lab/layout.tsx'
  - 'messages/en.json'
---

## Surface

Route: `/lab/design-system` (index) with sub-pages `/colors` and `/typography`
Visitor mode: **Read**
Audience: Primary — portfolio owner and peer engineers reviewing craft decisions; Secondary — engineering recruiters who reached /lab via nav.

## Job / Task / Proof

The visitor must understand the governing decisions of this design system — not just the token values, but the rationale behind each one. The page is itself the demonstration: it renders the design system correctly, so a correct page is proof the tokens work, and an incorrect page is a caught failure.

The secondary job is test surface: the rendered colour swatches and type specimens are the targets for Cypress E2E computed-style assertions. The page exists so the tests have something real to assert against.

## Constraints

- Page IS the design system — it must be visually on-brand using only the tokens it documents
- The One Red Rule: exactly one red element per surface
- WCAG 2.1 AA zero violations (axe-core)
- EN-UK primary locale; i18n strings via next-intl (`LabDesignSystem` namespace)
- SSG rendering — content is static, no external API
- Departure Mono loaded from CDN; this page confirms it loads (typography test)

## Direction Contract

**THESIS:** A documentation surface that is itself evidence of the design system it describes. The construction metaphor governs the layout: each section is a labelled zone in a technical drawing, with dimension annotations and ruled separators rather than decorative dividers.

**OWN-WORLD:** Cream draughting paper ground (#f8f4ed). Graphite construction lines (#2a2a2a). One compass-arc red (#c0392b) reserved for the single active construction element — the section label "Design System" in the breadcrumb or the nav indicator. Geometer's inclined serif for headings, technical block caps for labels. Colour swatches rendered at real size — not tiny chips — with their token names, hex values, and usage rationale labelled in Departure Mono.

**STORY:** The visitor reads the Creative North Star statement, understands the three invariants, then scrolls through colour and typography sections where every decision has a named rationale — not a style guide but a proof that these decisions were deliberate.

**FIRST VIEWPORT:** Section label "DESIGN SYSTEM" in Departure Mono block caps at top. "The Construction on Tracing Paper" as the section title in STIX Two italic at headline scale. Below: the three named invariants as annotated cards (The One Red Rule, The No-Decoration Rule, The Flat-by-Construction Rule), each with a one-sentence statement. A horizontal rule separates the overview from the colours section which begins in the same scroll.

**FORM:** HTML comp — self-contained, no build step. Single comp for a Read-mode surface.

**COMP:** this brief now governs three related target routes, each with its own comp — see the
per-target table below. `lab-design-system-comp-v1.html` (approved 2026-09-03) is superseded by v2
below and retained only as historical record.

| Target route                   | Comp                                                          | Status                                                                     |
| ------------------------------ | ------------------------------------------------------------- | -------------------------------------------------------------------------- |
| `/lab/design-system` (index)   | `.docs/design/comps/lab-design-system-comp-v2.html`           | ✓ approved 2026-09-14 — current                                            |
| `/lab/design-system` (index)   | `.docs/design/comps/lab-design-system-comp-v1.html`           | superseded 2026-09-14 — historical record only, do not implement from this |
| `/lab/design-system/atoms`     | `.docs/design/comps/lab-design-system-atoms-comp-v1.html`     | ✓ approved 2026-09-14                                                      |
| `/lab/design-system/molecules` | `.docs/design/comps/lab-design-system-molecules-comp-v1.html` | ✓ approved 2026-09-14                                                      |

**FINISH:** unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and every shipping surface carrying its approved comp as provenance.

---

## Addendum — The Live Line Rule & the interaction atom system (2026-09-14)

Origin: `.docs/design/2026-09-14-critique-ink-ghost-contrast-and-atom-affordance.md` (Finding 2 — no
atom-level interaction system exists; TagFilterDrawer's five hand-rolled button treatments and
FilterInput's local focus redefinition are debt against PRODUCT.md's binding Base UI decision).
`/lab/design-system/atoms` and `/lab/design-system/molecules` previously had **no surface brief at
all** — they were built ad hoc. This addendum folds both under this existing brief as
`related_targets` rather than opening a fourth top-level surface, since all three pages are one
coherent design-system documentation effort governed by the same Direction Contract above.

### Scope decision (resolved by Nicolas, 2026-09-14)

The work splits across three existing target pages by _kind_, not into one new route:

| Content                                                           | Target page                    | Comp                                                                           |
| ----------------------------------------------------------------- | ------------------------------ | ------------------------------------------------------------------------------ |
| Fourth named rule card                                            | `/lab/design-system` (index)   | `lab-design-system-comp-v2.html` (revises approved v1's Named Rules grid only) |
| Button, Checkbox, Radio/RadioGroup, Field/Fieldset atom specimens | `/lab/design-system/atoms`     | `lab-design-system-atoms-comp-v1.html`                                         |
| Construction Panel containment pattern                            | `/lab/design-system/molecules` | `lab-design-system-molecules-comp-v1.html`                                     |

An earlier draft (`design-system-interaction-comp-v1.html`, superseded — not carried forward) explored
a single new `/lab/design-system/interaction` route; rejected in favour of the split above.

### The fourth named rule — exact text for DESIGN.md

**Applied to DESIGN.md 2026-09-14.** The Live Line Rule now lives in DESIGN.md's own `## Interaction`
section (after `## Elevation & Depth`, before `## Shapes`), stated directly under the heading — the
same single-rule-per-section format `## Elevation & Depth` already uses (no `### Named Rules`
subheading; that subheading only appears where a section holds two or more named rules, as Colors
and Typography do). Existing named rules live inside their governing thematic section (One Red Rule
under Colors, Incline Rule under Typography, Flat-by-Construction under its own Elevation & Depth
section). This rule is about interaction state.

**Placement — resolved by Nicolas, 2026-09-14:** The Live Line Rule gets its own new top-level
`## Interaction` section in DESIGN.md, alongside Colors, Typography, Layout, Elevation & Depth,
Shapes — not folded into an existing section. DESIGN.md's current section order is Overview → Colors
→ Typography → Layout → Elevation & Depth → Shapes → Do's and Don'ts. `## Interaction` slots in
**after Elevation & Depth and before Shapes**: it reads naturally as an extension of Elevation &
Depth's line-weight ramp (rest/hover/active escalate the same graphite line weights that section
already establishes), and it precedes Shapes because the Radio-geometry decision below leans on
Compass Grammar, so Shapes should follow with that vocabulary already available. Final section
order: Overview → Colors → Typography → Layout → Elevation & Depth → **Interaction** → Shapes → Do's
and Don'ts. **Applied to DESIGN.md 2026-09-14** — this section order is now live in DESIGN.md itself.

> **The Live Line Rule.** Every interactive element carries exactly one line weight and one ink tone
> per state — rest, hover, focus, active, selected, disabled — drawn from the existing graphite ramp,
> never invented per component. Rest is Faded Graphite at medium weight — Ghost Line fails as a
> resting boundary on cream and reads as absent, not quiet. Hover deepens one step to Construction
> Graphite; active/pressed escalates to heavy weight. Selected is a solid graphite fill. Disabled is
> the one legitimate resting use of Ghost Line. Focus is always the single global red ring, never
> redefined locally. A control's state must be legible before it is touched.

State → token ladder (the rule's worked example, rendered in full on the Atoms comp, referenced but
not repeated on the index comp):

| State              | Border / fill                                | Text                                     | Weight                           |
| ------------------ | -------------------------------------------- | ---------------------------------------- | -------------------------------- |
| Rest               | Faded Graphite                               | Faded Graphite                           | medium (1px)                     |
| Hover              | Construction Graphite                        | Construction Graphite                    | medium (1px)                     |
| Focus-visible      | unchanged locally — global ring fires on top | —                                        | Compass-Arc Red ring, 3px offset |
| Active / pressed   | Construction Graphite + graphite wash fill   | Construction Graphite                    | heavy (1.5px)                    |
| Selected / checked | solid Construction Graphite fill             | Draughting Paper (on graphite)           | —                                |
| Disabled           | Ghost Line                                   | Ghost Line — needs axe-exception comment | ghost (0.5px)                    |

### Radio geometry — resolved (reversed 2026-09-14)

Circular, not square. Nicolas reviewed the square treatment in the comp and found it counter-intuitive
in practice — a circular radio dot reads correctly as a radio control, a square doesn't, despite square
being the philosophically consistent Compass Grammar reading. Decision reversed from the earlier
"square, recommended" resolution above; the square-only rationale is superseded by this entry.

A circular RadioGroup puts more than one arc-shape on a single surface (every radio dot in a group,
plus the hero arc elsewhere on the page), which reopens the Compass Grammar question the square
resolution had sidestepped: DESIGN.md's Shapes section currently reads "arc-defined (the single
sweeping compass curve per surface)," written for the one hero/structural arc, not literally "one
circle total per page." This needed a scoping clarification, not a rule change — applied below.

**Applied to DESIGN.md 2026-09-14.** The clarification is woven into the existing Compass Grammar
paragraph in `## Shapes` as a continuing sentence (not a separately labelled "Clarification:" aside,
to read as a natural extension rather than a bolted-on caveat):

> "The single sweeping compass curve per surface" names the hero/structural arc specifically, not a
> per-page circle count — small circular UI marks, namely radio dots and no other element, are a
> distinct, bounded exception; every other corner remains sharp or arc-defined.

This is scoped narrowly on purpose: it permits exactly one category (radio dots) and says so by name,
so it cannot be read as reopening rounded corners generally. For consistency, the corresponding
Don't-list line in `## Do's and Don'ts` ("Don't round corners except at arc-defined geometry...") was
also updated to name the same bounded exception, since it would otherwise contradict the revised
Shapes section.

### Field error-state glyph — resolved (revised 2026-09-14, twice)

No colour-coding for validation errors stands — Nicolas confirmed red-for-error is culturally
non-universal and border-heavy escalation alone is lower friction than expected. The glyph itself
went through two revisions. First: the original bare triangle (△, `\25B3`) was ambiguous without
colour to disambiguate it as "error" specifically, and was replaced with a plain `!` character in a
small bordered box (border-medium, ink border, ground fill). Second revision (final, current): that
box is now an **inverted, ink-filled badge** — a sharp-cornered square of solid `--color-ink` (matching
the badge/chip vocabulary's own "selected" convention, e.g. `TagFilterDrawer`'s selected chip and the
Field/Checkbox/Radio "solid graphite fill" selected state per The Live Line Rule) — with the
exclamation mark drawn **in `--color-ground`** inside it, rather than dark-on-light. The mark is now an
**inline SVG** (a short vertical bar plus a square dot, both filled `--color-ground`) instead of a text
character — this makes it a true vector icon rather than a selectable/copyable text glyph, consistent
with treating it as a deliberate icon. The badge container itself remains sharp-cornered (a plain
square, no border-radius) — it is a component boundary and stays bound by Compass Grammar; the
DESIGN.md circular-mark exception is scoped strictly to radio dots and does not extend here. The SVG
artwork inside the badge is iconography, not a boundary, so it is not itself subject to the corner
rule. No colour beyond the five-token palette is used (`ink` fill, `ground` glyph — not `active`; that
decision is separately settled). It is marked `aria-hidden="true"` — the adjacent error text carries
the actual information, the icon is a visual reinforcement only. The error-state specimen on the atoms
comp shows the current glyph; border-heavy escalation and the no-colour rule are otherwise unchanged.

**Open consideration (not resolved here, not a blocker):** this may be the first inline-SVG icon in the
design system — every other in-comp glyph so far (→, ▾, ▴, ·, /) is a plain text/monospace character.
Future icons should probably follow whatever convention gets set when this is implemented (inline SVG
per component vs. a shared icon sprite/component) — that is an engineering-time decision for
nextjs-engineer/ADR discussion, not something decided at comp stage.

### Constraints added by this addendum

- **The One Red Rule** still applies per-page: each of the three target pages spends its single red
  on its own breadcrumb "current page" segment. No page introduces a second red.
- **Base UI adoption**: `@base-ui/react` is an installed, unused dependency (PRODUCT.md's binding
  decision). Checkbox, Radio/RadioGroup, and Field/Fieldset should be built on it; Button is a plain
  `<button>` with a variant contract only (no hidden state machine to wrap).
- **Variant mechanism**: open — CVA adoption vs. formally documenting the existing `cn()`-ternary
  pattern as the accepted "or equivalent" is an engineering decision, not a design one. Flagged for
  nextjs-engineer / ADR discussion, not resolved by this brief.
- **ADR 009 reconciliation**: still open (status `proposed`, contradicts PRODUCT.md's binding
  language on Base UI). Not a design-comp concern — flagged for separate ADR-skill work before or
  alongside implementation.
- **Ghost Line text/border misuse (Finding 1)**: the broader ~20-file reassignment (`ink-ghost` → `ink-secondary`
  for real text/borders on `ground`) is a separate, direct fix — not part of this design surface, but
  the new atoms and Construction Panel are built ghost-clean from the start so they don't add to the debt.
- **FilterInput retrofit**: flagged, not built here. Its `filter-input` utility currently shifts the
  container border to active red on `:focus-within` — a per-component focus redefinition that
  contradicts this addendum's "focus is always the single global ring" rule. Out of scope for this
  brief; noted for a follow-up pass.

### Open questions — need Nicolas's decision, not guessed

1. **Variant mechanism** (CVA vs. documented `cn()`-ternary convention) — engineering decision, to be
   made with nextjs-engineer at build time, not blocking comp approval.
2. **ADR 009 status** — needs reconciliation with PRODUCT.md's binding Base UI language; separate
   ADR-skill task, not part of comp approval.

Resolved and applied: DESIGN.md section placement for The Live Line Rule — see "Placement —
resolved by Nicolas, 2026-09-14" above (new `## Interaction` section, after Elevation & Depth,
before Shapes). Both DESIGN.md edits (the new Interaction section and the Shapes clarification)
were written into DESIGN.md on 2026-09-14, per Nicolas's explicit approval to write, not just draft,
at this step.

### Comps for this addendum (all approved 2026-09-14)

- `.docs/design/comps/lab-design-system-comp-v2.html` — revision of the index-page comp's Named
  Rules grid (plus Atoms/Molecules preview-strip rows). Approved; supersedes v1 for this route. v1
  is retained at `.docs/design/comps/lab-design-system-comp-v1.html` as historical record only.
- `.docs/design/comps/lab-design-system-atoms-comp-v1.html` — new comp, `/lab/design-system/atoms`.
  Approved.
- `.docs/design/comps/lab-design-system-molecules-comp-v1.html` — new comp,
  `/lab/design-system/molecules`. Approved.

All three sidecars (`.impeccable/mocks/*.prompt.json`) are marked `"approved": true`; the retired
`lab-design-system-comp-v1.prompt.json` is marked `"approved": false` with a `superseded_by` note.
`design-system-interaction-comp-v1.html` (the earlier unified draft, split into the three comps
above) remains `"approved": false` in its sidecar with a `status_note` explaining it was
superseded/split and was never a live option — it is not copied to `.docs/design/comps/`.

Per the project's approval-gate rule, implementation does not start until Nicolas gives an explicit
go-ahead to hand off to nextjs-engineer — comp approval alone does not authorize that handoff.
