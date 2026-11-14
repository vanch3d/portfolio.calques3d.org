Status: open

# Header and responsive-layout consistency review across routes

Spec: ADR 029 (`.docs/adr/029-shared-page-shell-and-skip-nav-for-every-route.md`). Raised after the `PageShell` work (branch `feat/page-shell`).

A code-only read of every route's header and responsive rules, to separate intended visual identity from drift. Nothing here was checked at a narrow viewport: items marked **check** need a visual pass first.

## 1. Main header (`PageShell`)

| Route                                                                                                 | Header content                   | Extra header (`headerExtra`)                                                 |
| ----------------------------------------------------------------------------------------------------- | -------------------------------- | ---------------------------------------------------------------------------- |
| `/research`, `/engineering`, `/lab`, `/lab/adr`, `/publications`, `/case-studies`, `/projects/[slug]` | Breadcrumb                       | none                                                                         |
| `/lab/design-system/*`                                                                                | Breadcrumb                       | section links (Colors, Typography, Atoms, Molecules), set once in the layout |
| `/case-studies/[project]/[slug]` and `/[chapter]`                                                     | Breadcrumb                       | "Project: X" link                                                            |
| `/`                                                                                                   | Fixed, scroll-revealed `SiteNav` | n/a                                                                          |
| 404                                                                                                   | none                             | n/a                                                                          |

Findings:

- **Spacing mismatch.** `Breadcrumb` bakes in `mb-lg`; the design-system section nav then adds `mb-lg` and the case-study project link adds `mb-md`. The same slot has two different gaps.
- **Wrong "current page" on design-system sub-pages.** On `/lab/design-system/colors` the red crumb reads "Design System" with `aria-current="page"`; the current page is Colors. The layout cannot see the pathname, so each sub-page would need to supply its own trail.
- **Repeated label.** The first crumb ("Nicolas Van Labeke") is defined in eight i18n namespaces (`ResearchPage`, `EngineeringPage`, `LabNav`, `LabAdr`, `Publications`, `CaseStudiesIndex`, `CaseStudyHeader`, `ProjectDetail`). This follows the per-namespace rule but is a lot of copies of one string.

## 2. Content header, by route

| Route                       | Structure                                                                                                                                                                                                             |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/research`, `/engineering` | label, h1 (headline), intro, "return home" link                                                                                                                                                                       |
| `/lab`                      | `SectionLabel`, h1 (headline), route list                                                                                                                                                                             |
| Design-system pages (x5)    | `<header>`: `SectionLabel`, h1 (headline), intro. Same markup copy-pasted five times                                                                                                                                  |
| `/lab/adr`                  | Ruled sheet: heavy top and bottom rules, three columns (document label, centred h1 at title size, counters right), plus a dimension line                                                                              |
| `/publications`             | The same ruled sheet with an empty left cell. A second copy of the ADR markup                                                                                                                                         |
| `/projects/[slug]`          | Two bands. `ClassificationHeader`: era and type on the left, period strip and status stamp on the right. Then `ProjectTitle`: h1 at display size, subtitle, specimen top-right. Tags are in the aside, not the header |
| `/case-studies`             | `<header>`: label, then the h1 from the MDX                                                                                                                                                                           |
| Case hub and chapter        | `<header>`: meta row (eyebrow, status mark, chapter count), h1 (headline), lead, tags below                                                                                                                           |
| 404                         | "404" label, h1                                                                                                                                                                                                       |

Tags never sit above a title: below it on case studies, in the aside on projects.

Findings:

- **Gap to the heavy rule differs.** After the breadcrumb, `CaseTitleBlock` adds `mt-sm`, `CaseStudiesLead` adds `mt-lg`, and `ClassificationHeader` and the ruled sheets add nothing. Padding under the rule also differs: `pt-lg` (classification), `pt-md` (case blocks), `py-md` (ruled sheets).
- **Hardcoded English** (breaks `.claude/rules/i18n.md`): `AdrRegisterHeader` has "Architecture / Decision Records" as literal text; `src/app/lab/page.tsx` has `<SectionLabel>Lab</SectionLabel>`.
- **h1 location.** On the project page the h1 is inside a `<div>` (`ProjectTitle`); elsewhere it sits in a `<header>`. Probably fine.
- **Intended, not a defect:** three h1 sizes (display on projects and home, headline on most pages, title on the ruled sheets).

## 3. Responsive rules

No custom breakpoints; everything uses Tailwind's defaults (sm 640, md 768, lg 1024).

| Pattern                                  | Rule                                                                                                                                                                 |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Project body                             | Left aside from `lg` (`grid-cols-[280px_1fr]`). The aside has three states: 2-column grid below md, wrapping row from md to lg, left column from lg                  |
| Project header                           | Stacks below md, row from md. Specimen image appears at md, larger at lg                                                                                             |
| Case-study body                          | Right margin column from `lg` (measure + 17.5rem plate); section numbers hang into the left margin at `lg`; figure captions are a row at sm to lg and a column at lg |
| Chapter rail                             | Two-column at `md`                                                                                                                                                   |
| Chapter pager                            | Two columns at `sm`                                                                                                                                                  |
| Publications                             | Two columns at `md`; the tag drawer becomes a full-screen sheet below `sm`                                                                                           |
| Design-system rows                       | `ColorSwatch` switches at `sm`, `TypeSpecimen` at `md`                                                                                                               |
| `/research`, `/engineering`, `/lab`, 404 | None, single column                                                                                                                                                  |

Consistent: the aside collapse is `lg` for both the project's left aside and the case study's right margin plate.

Findings:

- **Design-system rows break at different widths.** `ColorSwatch` at `sm`, `TypeSpecimen` at `md`, for the same "label column + content" pattern.
- **Magic numbers.** The project aside is a literal `280px`, equal to the `--margin-plate-w` token (17.5rem). `ColorSwatch` (`120px`) and `TypeSpecimen` (`180px`) also use literals, against `.claude/rules/tailwind.md`.
- **Ruled sheets have no breakpoint (check).** The ADR and publications headers use `1fr auto 1fr` with a `nowrap` h1; on a phone the h1 plus two label columns will probably overflow. `InsightCalloutStrip` (`1fr auto`) has no breakpoint either, and no responsive classes were found in the ADR table components.
- **Publications uses three thresholds** (sm drawer, md columns, plus the ruled-sheet issue above).

## Scope (proposed clean-up)

- Extract the ruled sheet into one shared component (fixes the ADR/publications duplication and gives one place for the mobile fix); extract a small title block for the five design-system headers and the placeholder pages.
- Settle one gap and padding rule between the breadcrumb and the first heavy rule, and between the breadcrumb and `headerExtra`.
- Replace the `280px`, `120px` and `180px` literals with tokens; align `ColorSwatch` and `TypeSpecimen` on one breakpoint.
- Move the two hardcoded strings into `messages/en.json`.
- Give design-system sub-pages a breadcrumb whose current crumb is the sub-page (Home / Lab / Design System / Colors).
- Check the ADR and publications pages at 320 to 480px and fix overflow.

## Related

- `.docs/adr/029-shared-page-shell-and-skip-nav-for-every-route.md`
- `.docs/issues/one-red-rule-review/01-cross-app-review-of-red-usage-in-navigation.md`
- `.docs/issues/case-studies-surface/03-hand-rolled-breadcrumb-bars.md`
