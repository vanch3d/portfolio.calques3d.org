---
version: 1
slug: 'src-app-case-studies-page-tsx'
primary_target: 'src/app/case-studies/page.tsx'
related_targets:
  - 'src/app/case-studies/_components/CaseStudyCard.tsx'
  - 'src/content/case-studies/index.mdx'
---

## Surface

Route: `/case-studies`
Visitor mode: **Read** (the lead text), with a scannable index beneath.
Audience: A recruiter or peer who wants to see the cases and pick one.

## Job / Task / Proof

The visitor understands the stance (design by building) from the lead, sees the five cases at a glance, and enters one. The proof is the breadth of the list.

## Constraints

- Lead: `src/content/case-studies/index.mdx` rendered in the reading column. Title "Design by building" at headline scale. The text is a placeholder draft that Nicolas will rewrite, so the design must not depend on its length or its exact wording.
- Two groups by era, in this order, each with a labelled rule:
  - Engineering: HiveMQ Edge (chaptered).
  - Research: OpenEssayist, Calques 3D, MyPlan, Auditory games.
  - A group with no cases does not render.
- Each entry: case title, the project name as a quiet label, summary if the frontmatter has one, and the draft mark. The chaptered case shows "{n} chapters". Entries are whole-card links.
- Order follows `index.mdx`. The `featured` flag does not affect layout.
- No red on this page. The draft mark is a plain label.
- Mobile: single column; group labels remain as rules.
- Same sheet, tokens and line weights as the case-study page (`.docs/design/comps/case-study-page-comp-v2.html`).
- WCAG 2.1 AA zero violations. Strings via next-intl, one namespace per component.

## Direction Contract

**THESIS:** The collection as the index sheet of a drawing set: a short lead statement, then two ruled lists of numbered plates.

**OWN-WORLD:** Construction on Tracing Paper (DESIGN.md).

**COMP:** `.docs/design/comps/case-studies-landing-comp-v1.html`

**Build notes:** numbering runs 1 to 5 across groups and restarts per page if Engineering is empty. The group rule carries the case count. Project display names come from project data (slug to title lookup). Use the `index.mdx` H2 as the page title and remove its authoring H1 when Nicolas rewrites it. The comp was rebuilt from the design-director's own CSS, so reconcile spacing with the approved case-study comp v2.
