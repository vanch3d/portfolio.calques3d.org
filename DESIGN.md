---
name: Dr Nicolas Van Labeke — Portfolio
description: 25 years of precise practice — research and engineering drawn as one continuous proof
---

<!-- SEED: established with the user before implementation; re-run /impeccable document once there's code to capture the actual tokens and components. -->

# Design System: Dr Nicolas Van Labeke — Portfolio

## Overview

**Creative North Star: "The Construction on Tracing Paper"**

The visual world is a geometric proof in progress — compass arcs, dimension lines, and construction marks on cream draughting paper. Every element is placed with the deliberateness of a technical drawing: no decoration that isn't also structural, no colour that isn't also information. The word _calques_ (French for tracing paper) is the literal name of the PhD software at the centre of Era 1; this world makes that etymology visible rather than decorative.

The portfolio spans two professional cultures — the rigour of peer review and the velocity of product shipping — and the visual language must hold both without favouring either. The construction-in-progress metaphor does this: a geometric proof is simultaneously intellectual and technical, it unfolds over time, and its correctness is demonstrable rather than claimed. The career arc is drawn, not asserted.

No colour enters except by rule. One compass-arc red marks the single active construction element per surface — the current position, the selected era, the focused project. Everything else is graphite on cream.

**Key Characteristics:**

- Cream draughting paper ground — warm, not clinical
- Graphite construction lines with strict weight hierarchy (heavy / medium / ghost)
- Single active-element red — used once per surface, never decoratively
- Geometer's inclined serif for identity and headings
- Technical block caps for labels, tabular figures for measurements
- Professional information density — density is the trust signal, not clutter to be fixed

## Colors

One accent used by rule. All other colour is tonal variation of graphite on cream.

### Primary

- **Compass-Arc Red** (`#c0392b`): The single active construction element per surface — current position, selected era, active project. Never used for decoration. Its rarity is the point.

### Neutral

- **Draughting Paper** (`#f8f4ed`): The ground. Every surface begins here.
- **Construction Graphite** (`#2a2a2a`): Primary lines, headings, body text. The weight of a freshly-sharpened pencil.
- **Faded Graphite** (`#6b6b6b`): Secondary annotations, labels, dates. The weight of a second-pass construction line.
- **Ghost Line** (`#c8c4bc`): Tertiary grid lines, dividers, construction guides. The weight of a preliminary mark.

### Named Rules

**The One Red Rule.** The compass-arc red appears exactly once per surface — on the single element that is active, current, or selected. A second red on the same surface means the first was wrong.

**The No-Decoration Rule.** If removing an element makes the surface less informative, it was earning its place. If removing it makes the surface calmer, it was decoration and should be removed.

## Typography

**Display / Heading Font:** STIX Two Text (italic cut as display) — the mathematical typesetting standard, designed for scientific journals and peer-reviewed papers. The italic cut carries a genuine geometric incline: not emphasis, but character. Available on Google Fonts.

**Body Font:** Spectral — designed for screens, academic without stiffness. Holds 65–72ch lines at 17px without fatigue. Pairs cleanly with STIX Two's scholarly register. Available on Google Fonts.

**Label / Measurement Font:** Departure Mono — distinctive tabular-figures monospace with instrument-panel character. Used for dimension annotations, dates, tick marks, and tech tags. Less ubiquitous than JetBrains Mono. Available on Google Fonts.

**Character:** The pairing reads like a technical drawing annotated by someone who has published in peer-reviewed journals — STIX Two carries the intellectual authority of mathematical typesetting, Spectral carries sustained readable argument, Departure Mono carries the precision of measurement without personality.

### Hierarchy

- **Display** (STIX Two Text italic, 400, fluid ~56–72px): Name and era-level headings. Used once per surface at maximum scale.
- **Headline** (STIX Two Text italic, 400, ~24–32px): Section and project titles.
- **Title** (Spectral, 500, ~18–20px): Position names, institution names, case study chapter titles.
- **Body** (Spectral, 400, 17px, 1.70 leading, 65–72ch max): Project narrative, case study prose, publication abstracts.
- **Label** (Departure Mono, 400, 10–11px, 0.08–0.12em tracking, uppercase): Dates, tech tags, dimension annotations, tick marks, era identifiers.

### Named Rules

**The Incline Rule.** The display face carries a geometric incline — not italics as emphasis, but incline as character. Italic variants of the body face are reserved for titles of works (papers, products) only.

## Layout

[to be resolved during implementation]

The spatial grammar is a **technical drawing sheet**: a consistent margin acts as the drawing border, content regions are dimensioned zones, and the timeline runs as a horizontal ruled baseline from which positions rise as annotated endpoints.

Density is calibration-grade — more space above a heading than below it (drawing-annotation convention). The grid is implicit, derived from construction logic. On mobile, the dimension-line timeline stacks vertically, positions listed as annotated entries; the construction metaphor holds, the axis rotates.

## Elevation & Depth

**The Flat-by-Construction Rule.** No shadows. Depth is conveyed by line weight (heavier lines are closer), by the tonal ramp from Construction Graphite to Ghost Line, and by the single Compass-Arc Red marking the foreground element. A shadow here would be a smudge on the drawing.

The one structural exception: a single sweeping compass arc may lift the ground plane into a shallow fold — achieved through a graphite gradient on the fold face, never a box-shadow.

## Shapes

**The Compass Grammar.** Corners are either sharp (construction elements, labels, dimension lines) or arc-defined (the single sweeping compass curve per surface). No intermediate rounding. Every shape in the UI should be derivable from a compass-and-ruler construction.

Form language: dimension lines with terminal arrows, construction arcs with centre marks, leader lines from labels to elements.

## Do's and Don'ts

### Do:

- **Do** use graphite line-weight hierarchy to encode importance: heavy for primary structure, medium for secondary, ghost for grid and guides.
- **Do** let density carry seriousness — pack information at calibration-grade density and trust the reader.
- **Do** use tabular figures for all dates, counts, and measurements so columns align without tricks.
- **Do** treat the timeline as a ruled dimension line: endpoints labelled, the span annotated, intermediate marks tick-spaced.
- **Do** make navigation emerge from the construction — dimension lines and arc labels that are also links, not a separate system laid over the drawing.

### Don't:

- **Don't** use Compass-Arc Red for anything that is not the single active / current / selected element on that surface.
- **Don't** add a shadow to any element — depth comes from line weight and tonal ramp, not blur.
- **Don't** round corners except at arc-defined geometry (the single compass sweep per surface).
- **Don't** add a decorative element that is not also structural — every mark on the drawing earns its place.
- **Don't** use italic for emphasis in body text — italics are reserved for titles of works only.
