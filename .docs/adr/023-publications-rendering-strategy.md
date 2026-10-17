---
number: 23
title: 'Rendering Strategy for /publications'
status: accepted
date: '2026-09-16'
decision-makers: vanch3d
tags: ['rendering', 'ssg', 'nextjs', 'publications', 'api']
---

# ADR 023 — Rendering Strategy for /publications

**Date:** 2026-09-16
**Status:** Decided

## Context

The portfolio intentionally uses different Next.js rendering modes across its
sections as a learning exercise (see CLAUDE.md, ADR 001). `/publications` is
the full publications index — every item in the Zotero collection, with
client-side tag filtering — distinct from the per-project publication lists
already covered by ADR 020 on `/projects/[slug]`.

The route has a single content source: the Zotero API via
`src/lib/api/zotero.ts`. This data changes as publications are added or
corrected in the Zotero library, and we want revalidation without a full
redeploy.

## Decision

**SSG for the page shell + `unstable_cache` for the full publication list —
the same caching pattern established in ADR 020, applied to the unfiltered
(all-publications) case.**

- `page.tsx` is the only async Server Component on this surface. It resolves
  the publication list once and passes it down to Client Components.
- Publications are fetched via `getCachedPublications()` in
  `src/lib/publications.ts`, called with no project tag. The cache key
  resolves to `publications-ALL` and carries both the `publications` tag and
  the `publications-ALL` tag.
- On-demand revalidation via `revalidateTag("publications")` refreshes this
  route together with every per-project publication list from ADR 020, since
  they share the `publications` tag.
- If Zotero is unavailable, `getCachedPublications()` catches the error and
  resolves to an empty array — the page renders with zero publications
  rather than failing.

```ts
export async function PublicationsPage() {
  const publications = await getCachedPublications()
  // ...
}
```

## Rationale

| Option                          | Verdict                                                         |
| ------------------------------- | --------------------------------------------------------------- |
| Full SSG (no Zotero)            | Publications missing — not acceptable                           |
| Full SSR                        | Every visit hits Zotero API — wasteful, adds latency            |
| ISR (`revalidate: N`)           | Blunt — refreshes on a timer regardless of whether data changed |
| SSG + `unstable_cache` (chosen) | Matches ADR 020, on-demand revalidation, no redeploy needed     |

Using the same pattern as ADR 020 keeps caching behaviour consistent across
every surface that reads from Zotero — a single `revalidateTag("publications")`
call refreshes both `/publications` and every `/projects/[slug]` publication
list in one action.

## Consequences

- **Positive:** The page loads from CDN at zero compute cost after the first
  render; a Zotero outage degrades to an empty list instead of a broken page.
- **Positive:** Shares invalidation with ADR 020 — one revalidation path for
  all Zotero-derived content on the site.
- **Negative:** `unstable_cache` is a Next.js internal API — stability not
  guaranteed across major versions (same caveat as ADR 020).
- **Watch:** If Next.js stabilises the caching API (e.g. via a `"use cache"`
  directive), migrate both this route and `/projects/[slug]` together.

## Implementation notes

- `src/app/publications/page.tsx` — the only async Server Component on this
  surface; resolves `getCachedPublications()` and renders the static shell.
- `src/app/publications/_components/` — `PublicationHeader`,
  `PublicationMainClient`, `PublicationSearchBar` are Client Components with
  their own i18n namespace, receiving the fully-resolved publication list as
  props. None of them are async.
- `src/app/publications/_utils/tags.ts` — pure, synchronous tag-aggregation
  utility consumed by the Client Components; not part of the rendering path.
- `src/lib/publications.ts` — `getCachedPublications(tag?)` is the single
  entry point for cached Zotero reads, shared with `/projects/[slug]`
  (ADR 020).
