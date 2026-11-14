---
version: 1
slug: 'src-app-case-studies-entry-points'
primary_target: 'src/app/page.tsx'
related_targets:
  - 'src/app/_components/EraColumn.tsx'
  - 'src/app/projects/[slug]/_components/CaseStudiesBlock.tsx'
  - 'src/components/'
---

## Surface

Not a new route. These are the entry points that lead into `/case-studies`: the home page, the site nav, and the project page.
Visitor mode: **Persuade** (light): the visitor chooses to go deeper.

## Decisions (Nicolas, 2026-11-13)

1. **Home page rows:** a passive marker on project rows that have a case study (a plain label, for example "Case study"). The row stays one link, to `/projects/[slug]`. No second link on the row.
2. **Era link:** each era column gets a "Case studies" link to `/case-studies`, using the existing `NavLink` atom.
3. **Featured case studies:** the home page gets a space for featured case studies. Today only HiveMQ Edge has `featured: true`; the space must work with 0, 1 and several featured cases. Where it sits on the page is open: the comp should show two placements for Nicolas to choose between.
4. **Site nav:** add a "Case studies" link to the main nav, next to Research and Engineering.
5. **Project page:** the existing `CaseStudiesBlock` is the entry from the project. Review whether it needs a change now that the landing exists (for example, a link to the whole collection).

## Constraints

- One Red Rule: the home page already uses its red for the 2018 era inflection. The marker, featured space and nav link must add none.
- Home page layout and tokens come from the approved `homepage-comp-v4b-r2.html`. The existing rows and era columns do not change except for the marker.
- Mobile: the nav link must fit the existing mobile nav pattern.
- WCAG 2.1 AA zero violations. Strings via next-intl, one namespace per component.
- Approved Stage 1 and 2 comps: `.docs/design/comps/case-study-page-comp-v2.html`, `.docs/design/comps/case-studies-landing-comp-v1.html`.

## Direction Contract

**COMP:** `.docs/design/comps/case-studies-entry-points-comp-v1.html`

**Approved with these amendments (the comp is immutable; the build follows this list where it differs):**

1. Featured placement is **A**: a full-width band between the hero and the timeline. Not rendered with 0 featured. Placement B is discarded.
2. Era links go to **each era's group on the landing**: the Engineering link to the Engineering group, the Research link to the Research group (anchors on the group headings). The comp draws both to `/case-studies`.
3. The nav gets the "Case studies" link on **desktop only**. The mobile collapse is a separate design and PR: `.docs/issues/case-studies-surface/01-site-nav-mobile-collapse.md`.
4. Project block: "All case studies →" sits in the heading rule (the variant, not the foot link).
5. **No "Draft" mark on the featured cells on the home page.** It stays on the `/case-studies` landing rows. (Nicolas wrote "not on landing page" for the home-page question; confirm this reading at the build gate.)
