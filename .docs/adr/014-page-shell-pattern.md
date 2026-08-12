---
number: 14
title: "Page Shell Pattern — SectionHeader and BackLink"
status: decided
date: "2026-08-12"
tags: ["layout", "components", "accessibility", "design-system"]
supersedes: []
---

# ADR 014 — Page Shell Pattern — SectionHeader and BackLink

**Date:** 2026-08-12
**Status:** Decided

## Context

As sections of the site were built independently (research, engineering, CV,
publications), each page introduced its own ad-hoc HTML for the page heading
and back navigation. This created several inconsistencies:

- h1 font sizes varied: `text-3xl` on most pages, `text-4xl` on publications.
- The back-navigation `<nav>` markup was duplicated verbatim in every detail page.
- The `<header>` wrapper appeared on publications but nowhere else.
- Pages with a back link above the h1 had `mt-6` on the h1; pages without it
  did not — creating a "moving h1" visual rhythm break across sections.
- No consistent landmark structure for screen readers navigating by region.

## Decision

Introduce two layout primitives in `src/components/layout/`:

### `<SectionHeader heading tagline? />`

Used on every **listing/overview page** (research, engineering, publications, CV).
Renders a `<header>` with a fixed `h1` style (`text-3xl font-semibold
tracking-tight`) and an optional tagline `<p>`. The `<header>` element provides
a consistent landmark for the section content.

Listing pages never have a back link above the h1, so the h1 always sits at
the same vertical position — no more moving h1.

### `<Breadcrumb items navLabel />`

Used on **every page** — listing pages (Home / Research) and detail pages
(Home / Engineering / HiveMQ Edge). Renders a `<nav aria-label={navLabel}>` with
an `<ol>` of breadcrumb items. Items without `href` are the current page and carry
`aria-current="page"`. `aria-hidden` separators keep the list readable for screen
readers without announcing `/` as content.

Having a breadcrumb on every page (including top-level listing pages) ensures the
h1 always sits at the same vertical position — a consistent reading rhythm across
the entire site regardless of page depth.

Item labels come from the `Navigation` namespace (section names like "Research",
"Engineering", "Home" are already there). Detail page titles are data-driven and
passed directly. The `navLabel` ("Breadcrumb") comes from
`Navigation.breadcrumb_nav_label`.

## Consequences

- All pages use `SectionHeader` for the section h1 (listing pages) or a
  project-specific `<header>` component (detail pages) — h1 style is uniform.
- All pages use `Breadcrumb` — navigation markup is uniform and every h1
  sits at the same vertical position across the site.
- The `aria-label` on the `<nav>` is always present and always translated
  ("Breadcrumb" from `Navigation.breadcrumb_nav_label`).
- Adds a `src/components/layout/` directory alongside `src/components/ui/`.
- Both primitives follow the existing sub-component pattern: synchronous,
  receives resolved strings as props, CT-testable without i18n infrastructure.

## Rejected alternatives

**Single `PageShell` component wrapping everything:** Too prescriptive — different
pages need different content between the back link and the main content. Composing
two small primitives gives the same consistency without restricting page-level
layout decisions.

**Layout files (Next.js layout.tsx):** Layouts cannot receive per-page translated
strings without a client-side translation hook, which would require `"use client"`
and lose SSG. The primitive approach keeps everything server-side.
