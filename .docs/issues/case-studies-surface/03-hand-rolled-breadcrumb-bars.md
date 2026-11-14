Status: resolved

# Four routes hand-roll the breadcrumb bar instead of using Breadcrumb

Spec: `.docs/tasks/2026-11-13-case-studies-surface.md`.

## Problem

`src/components/ui/Breadcrumb.tsx` is the shared top bar, used by `/publications`, `/projects/[slug]` and (since this work) every case-study page. Four routes build the same bar by hand, each slightly different (gap, border, separators, aria strings, page container):

- `/research` (`src/app/research/page.tsx`)
- `/engineering` (`src/app/engineering/page.tsx`)
- `/lab` (`src/app/lab/page.tsx`)
- `/lab/adr` (`src/app/lab/adr/page.tsx`)

The page containers differ too: `page-wrap`, `page-wrap py-xl`, `page-wrap py-2xl`.

## Scope

- Replace the four hand-rolled bars with `Breadcrumb`, keeping each route's trail and aria label.
- Settle one container convention for top-level routes (`page-wrap` plus a shared vertical padding).
- Add an E2E check that every top-level route has a breadcrumb back to the home page.

## Related

- The breadcrumb's current-page crumb is red (`active-mark`). On a case-study chapter page it appears together with the chapter rail's red tick, so the page has two reds against the One Red Rule. Decide which keeps the red.
- Process: design briefs must inventory the shared elements first (page chrome, tags, status stamps). Recorded in the project memory.

## Resolution

Resolved on `feat/page-shell` (ADR 029), with a wider scope than the ticket: not four routes but every route except the homepage.

- New `PageShell` frames every non-home route: one `page-wrap py-xl` container holding `<header>` (the shared `Breadcrumb`), `<main id="main-content">` and `<footer>`. The four hand-rolled bars are gone; the design-system section mounts the shell once in its layout.
- New `SkipNav` (a port of the DiceUI Base UI skip-nav) in the root layout, targeting `#main-content`; the homepage `<main>` and the 404 page carry the same id.
- `cypress/e2e/page-shell.cy.ts` checks, for 15 routes, a breadcrumb with a link home, exactly one `main#main-content`, a `<footer>`, and a skip link that is the first anchor and moves focus to `<main>`.
- The ADR page's current crumb is now red like every other route (its "no active-mark" E2E assertion became "one header active-mark").
- Project pages: the era crumb reads "Engineering" / "Research", matching the era pages, via new `ProjectDetail.breadcrumb_*` keys; the "Era II — Engineering" label stays in the classification header.
- The red-rule question in "Related" is deferred to `.docs/issues/one-red-rule-review/01-cross-app-review-of-red-usage-in-navigation.md`: the crumb keeps its red meanwhile.
