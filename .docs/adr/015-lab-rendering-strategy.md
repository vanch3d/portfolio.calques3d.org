---
number: 15
title: "Rendering Strategy for /lab Routes"
status: accepted
date: "2026-09-04"
decision-makers: vanch3d
tags: ["rendering", "ssg", "next.js", "lab", "design-system"]
---

# ADR 015 — Rendering Strategy for /lab Routes

**Date:** 2026-09-04
**Status:** Decided

## Context

The portfolio intentionally uses different Next.js rendering modes across its
sections as a hands-on demonstration of the App Router's rendering model (see
CLAUDE.md and ADR 001). Each mode must be chosen deliberately and documented —
the `/lab` section is the first set of routes beyond the homepage to reach this
decision gate.

The `/lab` routes currently in scope:

| Route | Content |
|---|---|
| `/lab` | Lab index — link list |
| `/lab/design-system` | Design system index — named rules, color/type previews |
| `/lab/design-system/colors` | Full colour palette with named-rule card |
| `/lab/design-system/typography` | Full type scale + Incline Rule comparison |

All four pages are implemented as async Server Components. They call
`getTranslations()` from `next-intl/server` to resolve UI strings from
`messages/en.json`. No external API calls, no database reads, no
user-specific data, no search params, no cookies.

In Next.js 15+, the default rendering mode for App Router pages changed to
dynamic rendering. Without an explicit segment config, these pages would be
re-rendered on every request — unnecessary given that their content is
compile-time stable.

## Options considered

### Option A — Leave default (dynamic rendering)

No segment config. Pages render on each request. Works correctly but wastes
compute: the same HTML is produced on every hit, indefinitely.

### Option B — `export const revalidate = false`

Caches the page output at the CDN edge indefinitely (equivalent to SSG).
Requires a manual redeploy to pick up content changes. Less explicit about
intent — `revalidate = false` reads as "revalidation disabled" rather than
"this is a static page".

### Option C — `export const dynamic = "force-static"`

Explicitly opts the segment into static generation. Next.js will error at
build time if the page uses any dynamic API (cookies, headers, searchParams)
that is incompatible with static rendering — making the constraint
self-documenting and build-time-enforced.

## Decision

**Option C — `export const dynamic = "force-static"`** on all four `/lab`
page files.

Rationale:

1. **Content is build-time stable.** All strings come from `messages/en.json`
   (bundled at build). No runtime data sources exist or are planned for these
   pages.

2. **Explicit is better than implicit.** `force-static` documents the intent
   at the file level. A future engineer adding `headers()` or `cookies()` to
   one of these pages will get an immediate build error rather than a silent
   runtime behaviour change.

3. **Consistent with the portfolio's pedagogical goal.** The site demonstrates
   deliberate rendering-mode selection. SSG is the correct mode here; it should
   be stated clearly, not inferred from a missing config.

4. **Aligned with next-intl's static generation support.** `getTranslations()`
   resolves from bundled messages and is fully compatible with `force-static`.
   No additional configuration is required.

## Consequences

**Positive:**
- Pages are generated once at build time and served from the CDN edge — zero
  server compute per request.
- Build will fail if a future change accidentally introduces a dynamic API,
  preventing silent regressions.
- Rendering intent is readable at a glance in each page file.

**Negative / Trade-offs:**
- Any change to `messages/en.json` strings on these pages requires a redeploy
  to take effect. Acceptable: these are design-system documentation pages, not
  live content.
- If a future `/lab` route requires dynamic behaviour (e.g. a live token
  inspector reading query params), it must explicitly override this config or
  opt out — this is the correct behaviour, not a drawback.

## Scope

This decision applies to `/lab` and `/lab/design-system/**` routes only.
Future `/lab` sub-sections (spacing, line weights, utilities) should default
to `force-static` unless a specific requirement for dynamic data exists.

Routes outside `/lab` are governed by their own rendering-strategy decisions
(see CLAUDE.md rendering strategy table).

## Related

- ADR 001 — Deployment Target (rendering strategy overview)
- CLAUDE.md — rendering strategy table
- `src/app/lab/page.tsx`, `src/app/lab/design-system/page.tsx`,
  `src/app/lab/design-system/colors/page.tsx`,
  `src/app/lab/design-system/typography/page.tsx`
