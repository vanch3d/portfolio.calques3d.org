# HiveMQ Edge retrospective: missing plates

Status: done. All four placeholders are filled (2 screenshot sets, 2 diagrams); no `[!NOTE]` is left in the chapters.
Branch: `docs/hivemq-retro-plates`, from `main`. PR base: `main`.
Tracker: Track P6, line "HiveMQ retrospective: remaining placeholders" ticked (ADR 025, index only).
Scope: `src/content/case-studies/hivemq-edge--design-retro/`. Content work only, no code.

## Problem

Screenshots are still missing from the retrospective. Each is written as a `> [!NOTE]` callout, which
`buildCaseBlocks()` turns into a pending plate. The task is to find good-enough screenshots in
Nicolas's own PRs on `hivemq/hivemq-edge` and list every candidate for review.

## Inventory of pending plates (2026-11-23)

The 2026-11-13 plan counted 9. **4 remained** when this task started (3 in the table below, plus the OT-to-MQTT
scene-setting diagram in `Portfolio_01_ProblemClass.md`, which was briefly deleted in the working tree and then
restored); the others were already filled.

| #   | Location                                                                                 | Asked for                                                                  | Kind                 |
| --- | ---------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- | -------------------- |
| 1   | `Portfolio_02_Workspace.md:38`, "The node that doesn't exist in the backend"             | Close-up of a Device node, Tags shown on it, properties panel open         | Screenshot           |
| 2   | `Portfolio_04_DomainOntology.md:25`, "Seven attempts at the same question"               | The seven visualisations                                                   | Screenshots          |
| 3   | `Portfolio_04_DomainOntology.md:36`, "Forcing a cyclic reality into an acyclic renderer" | Annotated graph: dashed excluded edge, next to the Dagre layout without it | Diagram, build fresh |

Already used (not touched): `pr51`, `pr271`, `pr1308`, `pr1449` x2, combiner x2.

## Candidates

All files are downloaded to `.local/tmp/candidates/` (gitignored) as `pr<N>-<k>.png`, `k` = order in the PR body.
Rating is on fit for the plate, not on the PR's merit.

### Plate 1: Device node with Tags

| Rank | File          | PR                                                                                                 | What it shows                                                                                         | Verdict                                                                                 |
| ---- | ------------- | -------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| 1    | `pr586-2.png` | [#586](https://github.com/hivemq/hivemq-edge/pull/586) feat(25881) Device Tag management, 2024-10  | OPC UA device node, "Open the overview panel" tooltip, two Tags on the adapter below. Clean, 1264x934 | Best close crop of the device node, but the Tags sit on the adapter, not the device     |
| 2    | `pr730-2.png` | [#730](https://github.com/hivemq/hivemq-edge/pull/730) fix(28933) Device tags on the node, 2025-01 | Device nodes carrying Tag chips (`tag/opcua/temperature`, `+1`), next to topic chips on adapters      | **Best match for "Tags displayed on the node"**. Full workspace at 2560px, needs a crop |
| 3    | `pr730-1.png` | #730                                                                                               | Same view before the change, no Tags on devices                                                       | Good "before" for a before/after pair with `pr730-2`                                    |
| 4    | `pr586-4.png` | #586                                                                                               | "Edit the tags" drawer, Tag Name and Source Node ID                                                   | Covers "properties panel open", but shows a form, not the node                          |
| 5    | `pr586-1.png` | #586                                                                                               | Empty "Device Overview" drawer over a skeleton workspace                                              | Weak: drawer is empty                                                                   |
| 6    | `pr590-1.png` | [#590](https://github.com/hivemq/hivemq-edge/pull/590) refactor(26909) Device toolbar              | Skeleton workspace with a device selected and its toolbars                                            | Useful only to show device toolbar; names hidden                                        |
| 7    | `pr639-1.png` | [#639](https://github.com/hivemq/hivemq-edge/pull/639) device node for every adapter               | Workspace where each adapter has a device node                                                        | Context shot, device barely legible                                                     |

Not found: a single frame with the node _and_ the properties panel open. Options: compose
`pr730-2` (crop) + `pr586-4` as a pair, or take a fresh capture from current `master` (the note says
the current state is acceptable).

### Plate 2: the seven ontology visualisations

The DomainOntology module has **no committed screenshots** and no PR of yours carries them beyond
[#754](https://github.com/hivemq/hivemq-edge/pull/754) (2025-01-22), which shows four of the seven
tabs, all on an almost empty Edge ("No tag created in your Edge"). Searched: all PRs by `vanch3d` for
Sankey, Sunburst, chord, cluster, concept, overview, ontology. [#1395](https://github.com/hivemq/hivemq-edge/pull/1395)
(handover docs) has no images.

| File          | PR   | View                                       | Verdict                                         |
| ------------- | ---- | ------------------------------------------ | ----------------------------------------------- |
| `pr754-4.png` | #754 | Relation Chords                            | Readable, colourful, but sparse data            |
| `pr754-5.png` | #754 | Concept Flow (Sankey)                      | Readable, sparse data                           |
| `pr754-3.png` | #754 | Concept Wheel                              | Works as a shape, but both halves say "No data" |
| `pr754-2.png` | #754 | Workspace Cluster with grouping rules form | Nearly empty graph, form is the content         |
| `pr754-1.png` | #754 | Error page ("no root")                     | Unusable                                        |

Not covered by any PR image: `RelationMatrix`, `AdapterCluster` (populated), `RelationEdgeBundling`,
`NetworkGraphView`, `DataFlowTracer`. `NetworkGraphView` and `DataFlowTracer` no longer exist in
`master` (only a `.tsx` spec exists for `ConceptWheel`, `RelationMatrix`, `RelationEdgeBundling`,
`AdapterCluster`, `ConceptFlow`, `SunburstChart`).

**Recommendation:** the PR images cannot carry this plate. Either (a) use `pr754-3/4/5` as a
three-up "what the first attempts looked like" strip and accept the empty data, or (b) capture the
four views with Cypress component specs at the commit near #1395, with seeded data, as the note itself
suggests. (b) is a real piece of work (checkout, mock data, screenshot run); it is not started.

### Plate 3: cyclic edge diagram

No source in the repo. The note already says build fresh. The only adjacent material is
`pr1253-1.png` ([#1253](https://github.com/hivemq/hivemq-edge/pull/1253), automatic layouts: toolbar
with the layout picker and a laid-out graph with combiners and an asset node). It illustrates that
layouts exist, not the exclusion of a cyclic edge, so it is context, not a fit.

### Seen and rejected

`pr524-*` (#524, groups with ungrouped nodes, workspace overview, not ontology),
`pr556-*`, `pr898-*`, `pr869-*` (workspace identity, not asked for here).

## Decisions (2026-11-23, Nicolas)

1. Plate 1: orchestrator's choice. **Shipped:** `pr730-2` cropped alone (1660x600) as `pr730-img-2.png`. The
   before/after pair was left out: a single frame carries the point, and the caption makes the argument
   (Tags sit on the node but belong to the adapter's configuration). The before frame (`pr730-1`) stays in
   `.local/tmp/candidates/` if wanted.
2. Plate 2: **shipped:** the three #754 views (Concept Wheel, Relation Chords, Concept Flow), cropped to drop the
   drawer header where the product logo overlapped the title (1280x740), as `pr754-img-3/4/5.png`. Captions state
   they are January 2025 prototypes on an empty Edge. A Cypress-generated set is under way in another context
   and will replace or extend these.
3. Plate 3: build the diagram in HTML + inline SVG, render a PNG. Brief:
   `.docs/tasks/2026-11-23-hivemq-retro-diagram-prompt.md` (editable, with a launcher prompt for another round).

## Tooling evaluation for plate 3

| Option                                                                                                                            | Verdict                                                                                                                                                                                                                                                                                                                                                                                          |
| --------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Mermaid                                                                                                                           | Rejected by Nicolas: layout control too poor for this figure                                                                                                                                                                                                                                                                                                                                     |
| `/brandkit`                                                                                                                       | Not suitable: it generates brand-guideline boards and logo systems, not technical diagrams                                                                                                                                                                                                                                                                                                       |
| [`cathrynlavery/diagram-design`](https://github.com/cathrynlavery/diagram-design) (MIT, 52 diagram types, HTML + SVG, no shadows) | Investigated, **not installed**. A third-party skill with its own first-run style-gate and an editorial default skin (`#bf4520` accent) that would have to be re-skinned to our tokens; dependencies are decided case by case. Principles borrowed: delete before adding, one focal point, label every non-obvious edge. Its "Dependency graph" and "Flowchart" references are the nearest types |
| Hand-authored HTML + inline SVG on our tokens, rendered by Playwright Chromium                                                    | **Chosen.** Full control of tokens and fonts; the source file is the editable artefact; `@playwright/test` is already a dependency (plain `playwright` is not)                                                                                                                                                                                                                                   |

Colour: DESIGN.md's Content Layer keeps figures in the cream-to-graphite family with no red, which conflicts with
"colourful". The brief proposes a bounded exception: two muted hues taken from the product's own Concept Wheel
(orange for tags, blue for topics), flat tints, no red, no gradient, with a graphite-only fallback. **Open for
your review; if accepted, it should be recorded in ADR 027 or DESIGN.md, not only here.**

A fourth plate (the Problem Class OT-to-MQTT diagram) was added on the same method, briefed in
`.docs/tasks/2026-11-23-hivemq-retro-topology-diagram-prompt.md`. Nicolas approved both diagrams "for the time being".

## Open items

- `Portfolio_04_DomainOntology.md:23` still holds an authoring placeholder ("presented as flip cards ... Full content and
  component specification held separately"). It is body text, not a `[!NOTE]`, so it renders as prose. Not touched.
- The Dagre figure still misses the 9px-at-480px target (see "Plate 3 result"); the topology figure meets it. A
  relaunch of the Dagre brief with fewer nodes would fix it.
- The colour exception (orange/blue in figures) is not yet recorded in ADR 027 or DESIGN.md.
- Content schema validation passes (`pnpm validate:content`); the figures were not yet seen rendered on the site,
  including the presentation tree.
- The Cypress-generated ontology screenshots (other context) should replace the three #754 images when ready.

## Scripts (kept in `.local/tmp/`, gitignored)

`list-pending-plates.mjs` (notes with full text), `pr-images.mjs` (image URLs per PR),
`fetch-pr-images.mjs` (download). Reusable for the other case studies.

## Plate 3 result

Built: `.docs/design/diagrams/dagre-feedback-edge.html` (source) and
`public/images/case-studies/hivemq-edge--design-retro/diagram-dagre-feedback-edge.png` (2000 x 1020, 2x).

### Tooling and decisions

- Tools: hand-authored inline SVG in one HTML file; rendered with `@playwright/test` Chromium
  via `.local/tmp/render-diagram.mjs` (DSF 2, clipped to the svg). Nothing installed.
- Departure Mono: the remote woff2 sends no CORS header, so it failed to load over http. A local
  copy sits at `.docs/design/diagrams/fonts/DepartureMono-Regular.woff2` (same file, 22 KB) and is
  the first `src`; the remote URL stays as fallback. Reference it only from the source HTML.
- Palette shipped: the colour exception. Tag family (`Adapter`, `Tag`) `#e8873a` at 24% fill with
  `#b85f16` 1px stroke; Topic family (`Topic`, `Topic filter`) `#5b92c4` at 24% with `#2f6590`.
  `Combiner` and all edges/text are graphite tokens; the one dashed edge is graphite. No red.
- Font check: `document.fonts.check` true and status `loaded` for Departure Mono, STIX Two Text
  italic, Spectral; the PNG shows the real faces, no fallback.
- Cut: `Bridge` and `Device` (five nodes keep the loop legible); the `TOPIC` to `TOPIC FILTER`
  wildcard annotation (edge too short to label). Added: rank numbers 1 to 5 and a three-item legend.
- Not met: at the 480px margin width node text is about 7.7px, under the 9px target. Enlarging
  breaks `TOPIC FILTER` inside its node; the full-width figure is fine.

## Problem Class diagram result

Built: `.docs/design/diagrams/ot-to-mqtt-topology.html` (source) and
`public/images/case-studies/hivemq-edge--design-retro/diagram-ot-to-mqtt-topology.png` (2000 x 980, 2x).
`.local/tmp/render-diagram.mjs` viewport height raised to 800 (output unchanged for the Dagre figure).

- Palette shipped: the colour exception, same two hues. Source side (`PLC`, `Sensor`, `SCADA`) `#e8873a`
  at 24% with `#b85f16`; MQTT side (`MQTT bridge`, `MQTT broker`, `Cloud`, `Enterprise`) `#5b92c4` at 24%
  with `#2f6590`. Edge frame, adapters, broker, console, lines and text are graphite tokens. No red.
  The legend states the three roles.
- Font check: `document.fonts.check` true and status `loaded` for Departure Mono, STIX Two Text italic,
  Spectral; the PNG shows the real faces.
- Text size at 480px: minimum 19 viewBox units, so 9.1px at 480px (labels, legend, Spectral note);
  panel titles 25 units, 12px. Checked on a 0.48x render; all labels read, none touches a line or edge
  (tightest: `ETHERNET/IP` ends about 20 units before the adapters arrow).
- Focal point: `Operations console` at 3px stroke (heaviest in the figure, Edge frame is 1.5px), with three
  thin graphite leaders up to adapters, broker and bridge, plus the note "configures; not in the data path".
- Cut or shortened (to hold 19 units): `(decades old)` on the PLC (carried by the panel title instead),
  `SCADA / HMI` to `SCADA`, `Enterprise systems` to `Enterprise`; `MQTT` label appears once on the three
  outgoing lines. 13 nodes counting the console. Adjacent label to line gaps are kept at 10 units or more.
