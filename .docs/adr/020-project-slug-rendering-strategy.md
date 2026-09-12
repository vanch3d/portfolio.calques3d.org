---
number: 20
title: 'Rendering Strategy for /projects/[slug]'
status: accepted
date: '2026-09-08'
decision-makers: vanch3d
tags: ['rendering', 'ssg', 'isr', 'nextjs', 'projects']
---

# ADR 020 — Rendering Strategy for /projects/[slug]

**Date:** 2026-09-08
**Status:** Decided

## Context

The portfolio intentionally uses different Next.js rendering modes across its
sections as a learning exercise (see CLAUDE.md, ADR 001). The `/projects/[slug]`
route is the detail surface for both research and engineering projects. It has
two distinct content sources with different freshness requirements:

1. **Project metadata and narrative** — JSON + MDX files in `src/content/`.
   These are frozen at build time. Changes require a new deploy.

2. **Publications** — Fetched from the Zotero API via `src/lib/api/zotero.ts`.
   This data changes as publications are added or corrected in the Zotero library.
   We want revalidation without a full redeploy.

## Decision

**SSG for the page shell + `unstable_cache` for publications.**

- `generateStaticParams()` generates one static page per slug at build time.
- Project metadata, position, case studies, MDX content — all resolved at build time. Zero runtime cost per visit.
- Publications: wrapped in `unstable_cache` with a per-tag cache key and a `publications` tag. This means:
  - The first visit after a cold cache resolves the Zotero API call.
  - Subsequent visits within the same cache lifetime use the cached value.
  - On-demand revalidation via `revalidateTag("publications")` triggers a fresh fetch.
- If Zotero is unavailable (credentials missing, API error, network failure), the page catches the error and renders an empty publications array — no hard failure.

```ts
function getCachedPublications(tag: string) {
  return unstable_cache(
    async (): Promise<Publication[]> => {
      try {
        return await getPublicationsByProject(tag)
      } catch {
        return []
      }
    },
    [`publications-${tag}`],
    { tags: [`publications`, `publications-${tag}`] }
  )()
}
```

## Rationale

| Option                          | Verdict                                                  |
| ------------------------------- | -------------------------------------------------------- |
| Full SSG (no Zotero)            | Publications missing — not acceptable                    |
| Full SSR                        | Every visit hits Zotero API — wasteful, adds latency     |
| ISR (`revalidate: N`)           | Blunt — all project pages revalidate together on a timer |
| SSG + `unstable_cache` (chosen) | Per-tag cache with on-demand revalidation — surgical     |

`unstable_cache` is used instead of `revalidate` because:

- Different projects have different Zotero tags — we cache per-tag, not per-page.
- On-demand revalidation (`revalidateTag`) lets us refresh only the affected publications when the Zotero library changes, without touching unrelated project pages.

## Consequences

- **Positive:** Static pages load from CDN at zero compute cost. Publications are cached separately and revalidated on demand.
- **Positive:** Zotero outages do not break the page — graceful empty state.
- **Negative:** `unstable_cache` is a Next.js internal API — stability not guaranteed across major versions.
- **Watch:** If Next.js stabilises the caching API (e.g. via `"use cache"` directive in Next.js 15+), migrate to the stable form.

## Implementation notes

- `generateStaticParams()` in `page.tsx` returns all slugs from both research and engineering content.
- `getProjectBySlug()` in `src/lib/content/projects.ts` resolves the correct type union.
- MDX is imported via dynamic `import()` — resolved at build time for SSG slugs.
- Case studies resolved via `getCaseStudiesForProject(slug)` — reads from local filesystem (build-time safe).

### Rendering-classification rule for `_components/`

The classification rule for components below `page.tsx` (only `page.tsx` is
async; every `_components/` file is Client-with-own-i18n or plain sync
Server) is recorded as its own decision in **ADR 021 — Component Rendering
Strategy and Unified Timeline Molecule for Project Surface**, alongside the
related unified-timeline-molecule decision. See ADR 021 for the full
rationale, alternatives considered, and implementation plan.
