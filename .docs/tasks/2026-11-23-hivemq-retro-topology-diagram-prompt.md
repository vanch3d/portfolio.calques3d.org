# Brief: OT-to-MQTT topology diagram (HiveMQ retrospective, "The Problem Class")

Editable brief for the `design-director` subagent. Sibling of
`2026-11-23-hivemq-retro-diagram-prompt.md` (the Dagre figure, approved). Edit any section, then
re-trigger with the launcher at the bottom.

## Inherited rules (read that brief first)

The **Design constraints**, **Colour**, **Tools**, and **Self-review** sections of
`.docs/tasks/2026-11-23-hivemq-retro-diagram-prompt.md` apply unchanged, with the adjustments below.
Reuse and parameterise `.local/tmp/render-diagram.mjs` and the local Departure Mono copy in
`.docs/design/diagrams/fonts/`. The shipped Dagre figure (`.docs/design/diagrams/dagre-feedback-edge.html`
and its PNG) is the visual reference for house style: same ground, line weights, label face, panel titles,
legend treatment. This figure must look like its sibling.

## Goal

One figure for `Portfolio_01_ProblemClass.md`, replacing the `[!NOTE]` after the third paragraph. It is
scene-setting, schematic, about the **domain, not the interface**. It makes the chapter's opening visible:

> HiveMQ Edge translates twenty-plus industrial protocols (OPC-UA, Modbus, EtherNet/IP, decades-old
> equipment included) into MQTT. The operations console I owned sits in the middle of that gap: the only
> surface where someone configures a protocol adapter, wires up an MQTT bridge, defines a data policy, or
> asks "is this working, and if not, where is it broken".

## Content

Three zones, left to right, one direction of reading. Structure borrowed from HiveMQ's public
platform topology (OT left, Edge in the middle, IT right). **Do not reproduce its logos, icons, wordmark,
or layout details**: those are HiveMQ's trademarks and not our register. Plain geometry and labels only.

- **Left, `OT` (operational technology):** 3 or 4 stacked device blocks, labelled generically, e.g.
  `PLC (decades old)`, `Sensor`, `SCADA / HMI`. Each connects to the middle by a labelled protocol line:
  `OPC UA`, `Modbus`, `EtherNet/IP`. A short note on the zone: `20+ protocols`.
- **Centre, `HiveMQ Edge`, the translation layer:** one enclosing frame (graphite, heavy weight) containing
  a short chain: `Protocol adapters` to `Broker` to `MQTT bridge`. Keep it to those three.
  Attached to the frame from below or above: `Operations console` (the frontend the author owned), drawn
  as a distinct block that touches `Protocol adapters`, `MQTT bridge` and the broker with thin leader lines
  (it configures them, it is not in the data path). **This is the single focal point of the figure**: give
  it the heaviest line weight and the only extra emphasis (no red).
- **Right, `IT`:** 2 or 3 blocks: `MQTT broker (central)`, `Cloud`, `Enterprise systems`. The bridge
  connects to them with a line labelled `MQTT`.
- Zone captions in the label face, numbered like the sibling: `01 OT`, `02 EDGE`, `03 IT`, with panel titles
  in STIX Two italic: e.g. "Decades-old protocols", "The translation layer", "MQTT".
- A reader must see within five seconds: many old protocols in, one translation layer, MQTT out, and that
  the console sits on the translation layer.
- Under 14 nodes in total. If it gets crowded, delete, do not shrink.

## Colour (inherits the approved exception)

Same two hues as the Dagre figure, new meaning, stated in a legend:

| Role        | Hue                                    | Used for                                                        |
| ----------- | -------------------------------------- | --------------------------------------------------------------- |
| Source side | warm orange (tint + stroke, as before) | OT device blocks and their protocol labels                      |
| MQTT side   | blue (tint + stroke, as before)        | IT blocks, the `MQTT` line label, the `MQTT bridge`             |
| Structure   | graphite                               | Edge frame, adapters, broker, console, all other lines and text |

Flat tints only, no red, no gradient. If it fails review, fall back to graphite-only and report it.

## Legibility (the one constraint missed last round, now binding)

The figure renders in a margin plate about **480px wide**. Use a viewBox about 1000 wide and a minimum
text size of **19 viewBox units** for every label, so it is at least 9px at 480px. Check by viewing a
0.48x downscale, as before. If the text does not fit, cut content; never go below 19 units. Leave clear
space around every label: no text touching a line or edge (last round "FEEDBACK EDGE" nearly touched its arc).

## Deliverables

1. `.docs/design/diagrams/ot-to-mqtt-topology.html` (source).
2. `public/images/case-studies/hivemq-edge--design-retro/diagram-ot-to-mqtt-topology.png`
   (2x, about 2000px wide, aspect between 16:7 and 16:9).
3. A section `Problem Class diagram result` appended to
   `.docs/tasks/2026-11-23-hivemq-retro-missing-plates.md`: palette shipped, font check, text-size check at
   480px, what was cut.
4. Do **not** edit the case-study markdown, `TRACKER.md`, any `src/` file, or the Dagre files. The
   orchestrator wires the figure in after review.

## Launcher (paste to retrigger)

Prompt for `Agent` with `subagent_type: design-director`:

```text
Graphify first: before reading any file under src/styles/ or DESIGN.md, run
`graphify query "design tokens colors typography line weights"`; if it returns nothing useful, read
src/styles/tokens/colors.css directly. Then carry out the brief in
.docs/tasks/2026-11-23-hivemq-retro-topology-diagram-prompt.md exactly as written (it is the source of
truth and may have been edited since the last round). It inherits sections from
.docs/tasks/2026-11-23-hivemq-retro-diagram-prompt.md: read both. If a previous output exists, rename it
to *-v<N> before overwriting. Report: files written, palette shipped, font check, the text size at 480px
width, and any constraint you could not meet.
```
