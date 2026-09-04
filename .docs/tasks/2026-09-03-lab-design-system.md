---
date: 2026-09-03
tracker: .docs/tasks/TRACKER.md
epic: epic/design-compass-app
status: proposed
---

# Plan — /lab/design-system

## Why this exists

The design system for this portfolio is not a config file — it is a set of deliberate decisions with rationale: why cream not white, why STIX Two and not another serif, why exactly one red per surface. Those decisions need to be visible, documented, and verifiable.

PRODUCT.md already defines the purpose of `/lab`:
> *"design system tokens, ADRs, design decisions, and impeccable outputs — a working record of decisions that a senior engineer would actually make and document."*

`/lab/design-system` is that record made navigable. It also solves a testing problem: meaningful Cypress tests need real rendered elements to assert against. A colour swatch that renders incorrectly is a test failure. A font family that falls back is a test failure. The lab page is the test surface.

This is also a portfolio artifact in its own right. A documented, testable, on-brand design system demonstrates the same standard of craft as the rest of the site.

Reference: [Atlassian Design System](https://atlassian.design/) — not for scope, but for the quality of documentation: every token has a name, a value, and an explanation of when and why.

---

## Section structure

```
/lab/
  design-system/           ← index: overview, north star, design principles
    colors/                ← palette swatches with name, hex, usage rationale, named rules
    typography/            ← live specimens at each scale level, font rationale, The Incline Rule
    spacing/               ← scale steps visualised as dimension lines
    line-weights/          ← heavy / medium / ghost demonstrated structurally
    utilities/             ← .label, .active-mark, .tabular shown in context
```

Each page:
- Renders the tokens it documents (the page IS the demonstration)
- Carries the rationale from DESIGN.md, not just the values
- Includes named rules where they apply
- Is the target for Cypress E2E assertions

---

## Content per section

### `/lab/design-system` (index)
- Creative North Star: "The Construction on Tracing Paper" — the thesis and what it means
- The three invariants: one red per surface, no decoration that isn't structural, depth by line weight not shadow
- Links to each section
- Rendering mode: SSG

### `/lab/design-system/colors`
Content per colour:
- Swatch rendered at real size (not a tiny chip)
- Descriptive name ("Draughting Paper"), CSS token (`--color-ground`), hex value (`#f8f4ed`)
- Usage: where it appears and why
- Named rules inline (The One Red Rule under Compass-Arc Red, The No-Decoration Rule)

Cypress assertion: the Draughting Paper swatch has `background-color: rgb(248, 244, 237)`.

### `/lab/design-system/typography`
Content per role (Display → Headline → Title → Body → Label):
- Live text specimen using real i18n strings from `messages/en.json`
- Font family, weight, size, leading, tracking — all labelled
- Rationale: why STIX Two italic as display (mathematical typesetting standard, geometric incline as character not emphasis), why Spectral for body (academic without stiffness), why Departure Mono for labels (tabular figures, instrument-panel character)
- The Incline Rule shown visually: display italic vs body italic, with explanation of the distinction

Cypress assertions:
- Display specimen has `font-family` containing `STIX Two Text`
- Body specimen has `font-family` containing `Spectral`
- Label specimen has `font-family` containing `Departure Mono`
- Label specimen has `text-transform: uppercase` and `letter-spacing: 0.1em`

**This is also the test that catches the Departure Mono CDN issue.** If the font isn't loading, the assertion fails here.

### `/lab/design-system/spacing`
- Scale steps (xs → 3xl) rendered as dimension lines with endpoint arrows and value labels
- Drawing-annotation convention noted: more space above a heading than below it
- Demonstrated in context with a sample heading + body pair

### `/lab/design-system/line-weights`
- Heavy (1.5px), medium (1px), ghost (0.5px) shown as horizontal rules
- Each labelled with its token name and use case (primary structure / secondary / grid)
- The Flat-by-Construction Rule: depth by line weight, not shadow

### `/lab/design-system/utilities`
- `.label` — shown with a date and a tech tag
- `.active-mark` — shown applied to a single word in a sentence; the surrounding text is graphite
- `.tabular` — shown in a column of dates, demonstrating alignment

---

## Rendering strategy

All `/lab/design-system/*` routes: **SSG**. Content is static; no external API. This is consistent with CLAUDE.md's rendering strategy table and should be documented in an ADR.

---

## Implementation sequence

### Step 0: Surface brief + comp (design-director)
`/lab/design-system` is a new surface. It gets a surface brief (`.impeccable/surfaces/`) and a comp before any code. The comp should itself demonstrate the design system — a documentation page that is visually on-brand is stronger evidence than one that uses generic styles.

Run `/impeccable surface` for `src/app/lab/design-system/page.tsx`.

### Step 1: PR — `/lab` shell and design-system index (nextjs-engineer)
Branch: `feat/lab-design-system-shell` off `epic/design-compass-app`
- `src/app/lab/layout.tsx` — lab section layout
- `src/app/lab/page.tsx` — lab index (links to sub-sections)
- `src/app/lab/design-system/page.tsx` — overview page
- `messages/en.json` — `LabDesignSystem` namespace
- SSG export config

### Step 2: PR — Colors and Typography pages (nextjs-engineer)
Branch: `feat/lab-design-system-color-type` off `epic/design-compass-app`
- `src/app/lab/design-system/colors/page.tsx`
- `src/app/lab/design-system/typography/page.tsx`
- Cypress E2E specs for both (computed style assertions)

**This PR resolves the Departure Mono font verification question.**

### Step 3: PR — Spacing, line-weights, utilities pages
Branch: `feat/lab-design-system-tokens` off `epic/design-compass-app`
- Remaining three sections
- Cypress E2E specs

### Step 4: Replace design-tokens.test.ts permanently
The deleted Vitest string-check is replaced by the Cypress E2E suite covering all lab pages. Add to `cypress/e2e/lab-design-system.cy.ts`.

---

## Done criteria (full feature)

- All five sections render at `localhost:3000/lab/design-system/*`
- Each page is itself on-brand (uses the design system it documents)
- Cypress E2E passes: correct computed colour, font-family, font-weight, letter-spacing per section
- Departure Mono CDN confirmed loading (typography test passes)
- `pnpm validate` green
- ADR written for SSG decision on `/lab` routes

---

## Key files

| Purpose | Path |
|---|---|
| Design system source of truth | `DESIGN.md` |
| i18n strings | `messages/en.json` (add `LabDesignSystem` namespace) |
| Token layer | `src/app/globals.css` |
| Surface brief (to create) | `.impeccable/surfaces/src-app-lab-design-system-page-tsx.md` |
| Existing SSG pattern | `src/app/research/[slug]/page.tsx` (reference) |
| Cypress E2E pattern | `cypress/e2e/` |
