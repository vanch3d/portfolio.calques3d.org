# Project page semantics — global refactor

Branch: `refactor/project-page-semantics`
Started: 2026-11-16

## Problem

Metadata and section labels across the app are styled `<p className="label">`, so the
structure exists only visually. Screen-reader users get no definition list, no heading
outline and no list semantics. Styling must not change.

## Rules applied

- Label/value pairs → `<dl>` with `<div><dt>…</dt><dd>…</dd></div>` groups.
- Section labels → real headings (`h2` on pages whose title is `h1`; `h3` under an `h2`).
  Keep the `label` look with `label not-italic` (the base layer makes headings italic display).
- Short runs of sibling items (chips, link rows, meta strips) → `<ul>`/`<li>`.
- Captions of figures/specimens → `<figure>`/`<figcaption>`.
- Plain prose, eyebrows above an `h1`, and empty-state text stay `<p>`.
- Microdata: not added. Nothing maps cleanly to schema.org (status, visibility).
  JSON-LD `CreativeWork` is the right tool, as a separate follow-up.

## Scope

Project page:

- [ ] `ResourceBlockSection` — heading `<p>` → `<h2>`, `aria-labelledby` on the section
- [ ] `TaxonomyPanel` — `<dl>`, tags as `<ul>` in a `<dd>`
- [ ] `RestrictedBlock` — heading
- [ ] `page.tsx` footer — career timeline label
- [ ] `ProjectNav` — prev/next titles inside the link's accessible name, `<ul>`
- [ ] `PublicationsBlock` — type label, link row as `<ul>`

Case studies and home:

- [ ] `CaseTitleBlock`, `CaseStudyEntry`, `FeaturedCaseStudies` — meta strip
- [ ] `EraColumn`, `ChapterList`, `ChapterRail` — review, change only if a real breach

Design system (lab):

- [ ] `TypeSpecimen`, `NamedRuleCard`, `ColorSwatch`, `MoleculeFrame`, `atoms/page.tsx`,
      `molecules/page.tsx` — captions

## Outcome notes

- Reused `SectionLabel` (`as="h2" | "h3"`) for every heading label; it now drops the base
  layer's italic/weight on headings itself, so call sites don't repeat `not-italic`.
- Case-study/home meta strips (`CaseTitleBlock`, `CaseStudyEntry`, `FeaturedCaseStudies`) stay
  `<p>`: they are an inline eyebrow, and `CaseStatusMark` renders nothing for published cases,
  so a list would leave empty `<li>`s.
- `EraColumn`, `ChapterList`, `ChapterRail`, `not-found`: eyebrows or status text, no breach.
- Design system: `TypeSpecimen` → `figure`/`figcaption`; `NamedRuleCard` and `MoleculeFrame`
  names → headings; state/description pairs in `atoms/page.tsx` → `dl`.
- Left as `<p>`: `ColorSwatch` named-rule label and the ConstructionPanel sample group label in
  `molecules/page.tsx` (no heading level fits without skipping one).

- `ResourceAnnotationBar` → labelled `<ul>` (`resource_summary_aria`); each item is a whole
  phrase, so a list, not a `dl`.
- `TaxonomyPanel`: visibility, location and client were `hidden lg:block`, so `display: none`
  removed them from the accessibility tree below `lg`. The plan's md/sm band had simply not
  listed them. Now shown at every width; the plan (`2026-09-08-project-surface.md`, two-column
  table) is updated to match. Viewport-dependent _content_ is the anti-pattern; viewport-dependent
  _amount_ (the tag slices) is acceptable.
- Added the "Semantic fitness" section to `.claude/rules/accessibility.md`.

## Verification

- CT specs updated per component, axe checks kept
- `pnpm validate`, `tsc`, ESLint, Prettier, Cypress CT for touched specs
- No `pnpm build` while the dev server runs
