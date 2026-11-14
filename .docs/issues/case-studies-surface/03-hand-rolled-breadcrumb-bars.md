Status: open

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
