---
number: 29
title: 'Shared page shell and skip link for every route'
status: accepted
date: '2026-11-14'
decision-makers: vanch3d
tags: ['architecture', 'accessibility', 'components']
---

# Shared page shell and skip link for every route

## Context and Problem Statement

Each route under `src/app/` built its own frame: a hand-rolled `header > nav` breadcrumb on four routes, the shared `Breadcrumb` on four others, and three different containers (`page-wrap`, `page-wrap py-xl`, `page-wrap py-2xl`). Some pages had no `<header>`, the project page nested its `<footer>` inside `<main>`, and the design-system layout nested a `<nav>` inside a `<nav>`. No page had a skip link, so keyboard and screen-reader users had to tab through the navigation on every page (WCAG 2.4.1, Bypass Blocks).

Each page repeating the frame meant each page could drift from the others, and the drift was visible: different gaps, separators, aria strings and vertical padding for the same top bar.

## Decision

- **`PageShell`** (`src/components/ui/PageShell.tsx`) is the one frame for every route except the homepage. It renders a single `page-wrap` container holding `<header>` (the shared `Breadcrumb`, plus an optional `headerExtra` such as a section nav), `<main id="main-content">` and `<footer>`. The vertical padding convention is `py-xl`.
- The `<footer>` landmark always renders. It is empty unless the page has something that obviously belongs at the bottom (the project page's career ruler and prev/next navigation, the chapter pager). The shell adds no new visual surface.
- The design-system section mounts its shell once, in `lab/design-system/layout.tsx`; its pages no longer render their own `<main>`.
- **`SkipNav`** (`src/components/ui/SkipNav.tsx`) is rendered once in the root layout, so it is the first focusable element on every page, the homepage included. It is a port of the DiceUI Base UI skip-nav, restyled with this project's tokens and `SkipNav` i18n namespace.
- `MAIN_CONTENT_ID` lives in its own plain module (`src/components/ui/main-content-id.ts`). A constant exported from a `'use client'` file reaches Server Components as an opaque client reference, not as its string value.
- The homepage keeps its own structure (fixed `SiteNav`, no breadcrumb) and carries `id="main-content"` on its `<main>` so the skip link works there too.

Non-goals: a site-wide footer with content; moving the shell into a route-group layout (the breadcrumb trail is page-specific data a layout cannot know).

## Consequences

- Good, because a new route gets the frame, the breadcrumb pattern and the skip target by wrapping its content in one component.
- Good, because the breadcrumb markup, aria label and spacing exist in one place.
- Good, because the landmark set (banner, navigation, main, contentinfo) is the same on every page and checked by one E2E spec.
- Bad, because every page must remember to use `PageShell`; nothing but the E2E spec (`cypress/e2e/page-shell.cy.ts`) enforces it.
- Bad, because an empty `<footer>` is an empty `contentinfo` landmark on pages with nothing to put there.
- Bad, because `PageShell` renders its own `<main>`, so it cannot be mounted in a Cypress component test (the CT scaffold supplies one); the shell is covered by E2E instead.

## Implementation Plan

- **Affected paths**: `src/components/ui/PageShell.tsx`, `src/components/ui/SkipNav.tsx`, `src/components/ui/main-content-id.ts`, `src/app/layout.tsx`, every `page.tsx` outside `src/app/page.tsx`, `src/app/lab/design-system/layout.tsx`, `messages/en.json` (`SkipNav`).
- **Dependencies**: `@base-ui/react` (already installed; `merge-props`).
- **Patterns to follow**: new routes wrap their content in `PageShell` and pass the breadcrumb trail; put bottom-of-page navigation in the `footer` slot; add the route to `SHELL_ROUTES` in `cypress/e2e/page-shell.cy.ts`.
- **Patterns to avoid**: a route rendering its own `<main>` or `page-wrap` container; hand-rolled breadcrumb markup; importing `MAIN_CONTENT_ID` from `SkipNav.tsx`.

### Verification

- `cypress/e2e/page-shell.cy.ts` passes for every listed route: one breadcrumb with a link home, exactly one `main#main-content`, a `<footer>`, and a skip link that is the first anchor and moves focus to `<main>`.
- `SkipNav.spec.cy.tsx` passes, including its axe check.
