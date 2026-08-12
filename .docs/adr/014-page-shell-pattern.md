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

### `<BackLink href label navLabel />`

Used on every **detail page** (research/[slug], engineering/[slug], CV, publications).
Renders a `<nav aria-label={navLabel}>` with a single anchor styled as secondary
text. The `navLabel` prop (e.g. "Page navigation") is resolved by the parent page
from its i18n namespace so it can be translated. The `navLabel` distinguishes this
nav from the site-wide header nav, which is required for WCAG 2.4.1 (Multiple Ways).

## Consequences

- All section pages use `SectionHeader` — h1 style is uniform.
- All detail pages use `BackLink` — back-nav markup is uniform.
- The `aria-label` on the `<nav>` is always present and always translated.
- Adds a `src/components/layout/` directory alongside `src/components/ui/`.
- Both components follow the existing sub-component pattern: synchronous,
  receives resolved strings as props, CT-testable without i18n infrastructure.

## Rejected alternatives

**Single `PageShell` component wrapping everything:** Too prescriptive — different
pages need different content between the back link and the main content. Composing
two small primitives gives the same consistency without restricting page-level
layout decisions.

**Layout files (Next.js layout.tsx):** Layouts cannot receive per-page translated
strings without a client-side translation hook, which would require `"use client"`
and lose SSG. The primitive approach keeps everything server-side.
