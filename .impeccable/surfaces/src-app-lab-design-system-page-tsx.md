---
version: 1
slug: "src-app-lab-design-system-page-tsx"
primary_target: "src/app/lab/design-system/page.tsx"
related_targets:
  - "src/app/lab/design-system/colors/page.tsx"
  - "src/app/lab/design-system/typography/page.tsx"
  - "src/app/lab/layout.tsx"
  - "messages/en.json"
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

**COMP:** `.docs/design/comps/lab-design-system-comp-v1.html` ✓ approved 2026-09-03

**FINISH:** unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and every shipping surface carrying its approved comp as provenance.
