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

- [x] `ResourceBlockSection` — heading `<p>` → `<h2>`, `aria-labelledby` on the section
- [x] `TaxonomyPanel` — `<dl>`, tags as `<ul>` in a `<dd>`
- [x] `RestrictedBlock` — heading
- [x] `page.tsx` footer — career timeline label
- [x] `ProjectNav` — prev/next titles inside the link's accessible name, `<ul>` (see notes)
- [x] `PublicationsBlock` — link row as `<ul>`; type label deliberately left as `<p>` (see notes)
- [x] `ResourceAnnotationBar` — labelled `<ul>` (added during the task, not in the first scope)

Case studies and home:

- [x] `CaseTitleBlock`, `CaseStudyEntry`, `FeaturedCaseStudies` — meta strip: reviewed, left as `<p>` (see notes)
- [x] `EraColumn`, `ChapterList`, `ChapterRail` — reviewed, no breach

Design system (lab):

- [x] `TypeSpecimen`, `NamedRuleCard`, `MoleculeFrame`, `atoms/page.tsx` — captions
- [x] `ColorSwatch`, `molecules/page.tsx` — reviewed, left as `<p>` (see notes)

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
- `ProjectNav`: the first pass only made the cells a `<ul>` and the spec asserted the title was
  _outside_ the link, so the accessible-name requirement was inverted, not met. Fixed after
  review: the title is now an `sr-only` suffix inside the link (`← Previous project: Audiles`)
  and the visible title beside it is `aria-hidden`, so sighted users keep the short underlined
  target and screen readers hear the title once. `NavLink` needed no change.
- `PublicationsBlock`: the type label ("Journal", "Conference") stays a `<p>`. It is a short
  eyebrow above a citation, not the label of a value, so a `dl` pair would invent a term for
  content that has none.
- Unchanged in the review round, with reason: `mb-md` on `TaxonomyPanel`'s `dd` (restores the old
  `<p>` margin; needs a visual check at `md`/`lg`), the empty `aria-hidden` `<li>` placeholders in
  `ProjectNav`, and the literal heading id in `page.tsx` (rendered once).
- The visibility, location and client change is a content change, not a styling-neutral one. It
  was decided in review with the owner, not left to the refactor.

## Verification

- CT specs updated per component, axe checks kept
- `pnpm validate`, `tsc`, ESLint, Prettier, Cypress CT for touched specs
- No `pnpm build` while the dev server runs
