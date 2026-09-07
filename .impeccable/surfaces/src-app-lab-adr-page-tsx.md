---
version: 1
slug: "src-app-lab-adr-page-tsx"
primary_target: "src/app/lab/adr/page.tsx"
related_targets: ["src/app/lab/adr/[slug]/page.tsx","src/app/lab/insights/page.tsx","src/app/lab/insights/[slug]/page.tsx"]
---

## Surface strategy

**Route:** `/lab/adr` (index) · `/lab/adr/[slug]` (detail) · `/lab/insights` (index) · `/lab/insights/[slug]` (detail)
**Visitor mode:** Read — visitor comes to understand architecture decisions made while building the portfolio
**Audience:** Fellow engineers and technical peers reading for depth; the site author returning to the record
**Job:** Browse the ADR register, filter by tag or status, open a decision and read its full rationale; encounter related insights surfaced as elevated callouts

## Direction contract

**THESIS:** The ADR index as the formal revision register of the portfolio's own drawing set — each decision a numbered row in the record, not a card or a tile. The direction the surface refuses: the familiar documentation card-grid with status badges and excerpt previews.

**OWN-WORLD:** Cream draughting paper ground (#f8f4ed), construction graphite ink, Departure Mono column headings and measurements, STIX Two italic for decision titles and insight callouts. Ruled table structure — heavy outer border (1.5px), ghost dividers between rows. One red mark: the most recent accepted ADR's row. No shadows, no rounded corners, no card containers.

**STORY:** The visitor lands on a formal revision register. The insights strip floats above the table showing 2–3 of the most recent insights at elevated STIX italic scale — unmistakably above the numbered entries. A "SEE ALL INSIGHTS (N) →" folio link leads to `/lab/insights` when more than those shown exist. They filter by tag (ghosting non-matching rows to ghost weight rather than hiding them, preserving register density). They open a row and read the full decision rendered in the same register vocabulary, with any related insight surfaced as a "Discovered in practice" callout block.

**FIRST VIEWPORT:** Full-width title block with heavy ruled border (portfolio name · register title · record count). Below: insights strip (warm tint, STIX italic, elevated). Filter bar (Departure Mono tag chips as construction annotations; search field as measurement input). Revision register table: No. · Title · Status · Date · Tags — 15–20 rows visible before scroll. The active row (018) carries the single red left-border and red number.

**FORM:** Blueprint Revision Sheet — candidate 4 from the ordered structural list, dealt as the lead by seed 1dc45268 (surface scope, read mode). Approved comp: `.docs/design/comps/adr-index-comp-v1.html` · screenshot: `.docs/design/comps/adr-index-comp-v1.png`.

**FINISH:** unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.

## Detail page extension (inherits direction)

The ADR detail page inherits the register vocabulary:
- Breadcrumb: `LAB / ADR / 018` in Departure Mono
- Document header: ADR number (large Departure Mono) + title (STIX Two italic headline) + frontmatter table (status, date, tags, decision-makers) styled as a title-block annotation strip
- Body: Spectral, body measure, rendered as standard markdown sections (Context / Decision / Consequences / Alternatives / Related)
- Insight callout: a ruled block with warm tint, leader line, "DISCOVERED IN PRACTICE" label, linked insight in STIX Two italic — appears inline after the section it relates to
- Navigation: prev/next ADR in Departure Mono, styled as folio continuation marks
- Cross-links: ADR-to-ADR and ADR-to-design-system links are plain underlined Spectral text

## Insights surface extension (inherits direction)

**Index (`/lab/insights`):** A register-style listing of all insights ordered by date, using the same ruled table vocabulary as the ADR register. Each row: insight number · title (STIX Two italic) · discovered-during label (Departure Mono) · related ADR tag. The active/most-recent insight carries the red left-border mark. Pagination or "load more" folio mark at the bottom (same as ADR register footer pattern).

**Detail (`/lab/insights/[slug]`):** Uses the same register vocabulary as the ADR detail page but with insight-specific frontmatter (discovered-during, related-adr). The insight body sections (Discovery / The insight / Why it matters / Relation to decisions) use the same typographic treatment as ADR sections. Related ADR link is styled as a back-reference folio mark.

## Comp strategy — resolved

**Detail and insights surfaces: Option C — inherit the vocabulary, no new comps.**
The direction contract in this brief is the design authority for `/lab/adr/[slug]`, `/lab/insights`, and `/lab/insights/[slug]`. The engineer implements from the brief. After implementation, `/impeccable critique` reviews each surface against the inherited vocabulary and the approved index comp, then amendments are made. No second comp round before engineering.

## Unresolved

- ADR detail MDX vs. parsed markdown: TBD at implementation — full markdown render preferred for callout component support
- Cross-link resolution: ADR-to-design-system links (e.g. ADR 004 → /lab/design-system) need a lookup table in the API layer
