# Brief: Dagre feedback-edge diagram (HiveMQ retrospective, plate 3)

Editable brief for the `design-director` subagent. Edit any section, then re-trigger with the one-line
launcher at the bottom. Output is overwritten each round (previous round kept as `-v<N>`).

## Goal

One figure for `Portfolio_04_DomainOntology.md`, section "Forcing a cyclic reality into an acyclic
renderer". It replaces the `[!NOTE]` placeholder. It must make this paragraph visible without reading it:

> Dagre's layout assumes a directed acyclic graph. The relationship graph of a deployed system is not
> acyclic (southbound mappings and bridge subscriptions can create feedback loops). The solution was to
> detect those relationships, call them feedback edges, render them as visually distinct dashed lines,
> and exclude them from Dagre's forward-layout pass entirely, so the acyclic assumption stays intact
> while the dashed edges still communicate that a real, unmodelled loop exists.

## Content (what the figure says)

Two panels, left to right, same nodes in both, same colours, same labels. A thin graphite arrow or
dimension-line "step" mark between them reads "layout pass".

- **Left, "What the domain is":** a small directed graph (6 to 7 nodes) that contains one cycle.
  Suggested nodes, from the HiveMQ Edge domain: `Adapter`, `Tag`, `Topic`, `Topic filter`, `Bridge`,
  `Combiner` (+ optionally `Device`). Suggested loop: `Adapter` to `Tag` to `Topic` to `Combiner` to
  `Topic filter` and a **southbound mapping** back to `Adapter` (this closing edge is the feedback edge).
  The feedback edge is **dashed** and labelled: `excluded from layout pass, shown for reference`.
- **Right, "What Dagre lays out":** the same nodes in strict top-to-bottom ranks, no edge going upward,
  forward edges solid. The feedback edge is **not part of the layout**: it is re-drawn afterwards as a
  dashed curve along the side, bottom to top, visibly an annotation laid over the layers, with the same
  label (or a short `feedback edge` tag).
- Panel captions in the label face: `01 DOMAIN GRAPH (CYCLIC)` and `02 DAGRE LAYERS (ACYCLIC)`.
- A reader must see, within five seconds: one loop on the left, no loop on the right, and the dashed edge
  that survives in both.
- Edit the node names if a better set from the DomainOntology module reads clearer; keep it under 8 nodes.
  Facts to respect: `TOPIC` to `TOPIC FILTER` is matched by MQTT wildcard at runtime (not stored); a
  southbound mapping or bridge subscription is what creates the feedback.

## Design constraints (non-negotiable, from DESIGN.md)

- Ground is Draughting Paper `#f8f4ed`; lines and text are graphite. Take exact values from
  `src/styles/tokens/colors.css`; do not invent hex values for the structure.
- **No red.** Compass-Arc Red is reserved for site chrome; a figure never carries it.
- **No shadows, no glow, no blur.** Depth only through line weight (heavy 1.5px / medium 1px / ghost 0.5px
  at 1x) and tonal ramp.
- Sharp corners on nodes and labels. Circles only where compass-derived (a node marker, an arc). No
  rounded-rectangle cards.
- Typography: Departure Mono for labels and node names (uppercase, 10 to 11px at 1x, tracked), STIX Two
  Text italic for panel titles, Spectral for any sentence. Load them from Google Fonts or a local copy;
  confirm in the rendered PNG that the fallback font is **not** showing.
- Edges: arrowheads are terminal dimension-line arrows. Leader lines for the label. Straight or compass-arc
  routes only, no bezier spaghetti.
- No decoration that is not information.

## Colour (open decision: edit here)

The request was "colourful, high quality". The Content Layer rule (DESIGN.md, ADR 027) otherwise keeps
figures in the cream-to-graphite family. Proposed bounded exception, taken from the product's own Concept
Wheel so the colour carries meaning and traces to the content:

| Role          | Hue              | Value (adjust to taste)           | Used for                              |
| ------------- | ---------------- | --------------------------------- | ------------------------------------- |
| Tag family    | warm orange      | `#e8873a` tint + `#b85f16` stroke | `Tag`, `Adapter`                      |
| Topic family  | blue             | `#5b92c4` tint + `#2f6590` stroke | `Topic`, `Topic filter`               |
| Structure     | graphite         | tokens                            | `Bridge`, `Combiner`, all edges, text |
| Feedback edge | graphite, dashed | token                             | the one dashed edge, nothing else     |

Rules: at most these two hues, always as a flat fill at 18 to 28% tint with a 1px full-strength stroke,
never a gradient, never on text. If, in review, this reads as off-system, fall back to graphite-only with
fill density (hatching) as the second channel and report that you did.

## Tools (document what you used)

- Author as **one self-contained HTML file with inline SVG** (no framework, no build step).
- Render with Playwright's Chromium via `@playwright/test` (already installed; the plain `playwright`
  package is not). Device scale factor 2, clip to the figure, no page chrome.
- Do not install anything. `diagram-design` and `/brandkit` were evaluated and not used (see task doc);
  borrow only the principles: delete before adding, one focal point, label every non-obvious edge.
- Put render code in `.local/tmp/render-diagram.mjs` with a header comment (usage, args).

## Deliverables

1. `.docs/design/diagrams/dagre-feedback-edge.html` (source, the editable artefact).
2. `public/images/case-studies/hivemq-edge--design-retro/diagram-dagre-feedback-edge.png`
   (2x, about 1600 to 2000px wide, aspect between 16:7 and 16:9).
3. A short `Tooling and decisions` section appended to
   `.docs/tasks/2026-11-23-hivemq-retro-missing-plates.md` under "Plate 3 result": tools used, final
   palette (and whether the colour exception or the fallback shipped), font check, anything cut.
4. Do **not** edit the case-study markdown, `TRACKER.md`, or any `src/` file. The orchestrator wires the
   figure in after review.

## Self-review before reporting (read the PNG, do not assume)

- [ ] Loop visible on the left, absent on the right, dashed edge present in both.
- [ ] Label legible at the width the figure renders in the margin plate (about 480px): test by viewing a
      downscaled copy; if node text is under about 9px at that width, enlarge or cut nodes.
- [ ] No red anywhere. No shadow. No rounded corners. No more than two hues.
- [ ] Fonts are the real ones.
- [ ] Contrast of text on every fill is at least 4.5:1.
- [ ] Nothing in the figure could be deleted without losing information.

## Launcher (paste to retrigger)

Prompt for `Agent` with `subagent_type: design-director`:

```text
Graphify first: before reading any file under src/styles/ or DESIGN.md, run
`graphify query "design tokens colors typography line weights"` and use what it returns to locate them.
Then carry out the brief in .docs/tasks/2026-11-23-hivemq-retro-diagram-prompt.md exactly as written
(it is the source of truth; I may have edited it since the last round). If a previous output exists,
rename it to *-v<N> before overwriting. Report: files written, palette actually shipped, font check
result, and any constraint you could not meet.
```
