---
number: 13
title: "Case Study Content Location"
status: proposed
date: "2026-09-01"
decision-makers: vanch3d
tags: ["content", "mdx", "cms", "isr", "architecture"]
---

# ADR 013 — Case Study Content Location

**Date:** 2026-09-01
**Status:** Open (investigating)

## Context

ADR 012 decided that case study content is MDX, SSG, co-located in
`src/content/case-studies/` within the application repository. This is the
simplest viable approach and the correct starting point.

However, case studies are the content type most likely to evolve independently
of the application codebase: new chapters are added, copy is revised, images
are swapped. Every such change currently requires a full Vercel build and
deployment — even if no application code changed.

This ADR investigates whether case study content should be decoupled from the
application repository, and if so, in what form.

## Options under investigation

### Option A — In-repo (current, ADR 012)

`src/content/case-studies/` in `nextjs-vanch-website`. MDX read from the local
filesystem at build time via `lib/content/case-studies.ts`.

**Works well when:** content and code evolve together; author is also the
developer; deployment frequency is low.

**Friction when:** a copy edit to a single chapter requires a full production
build; content review happens in PRs alongside code review.

### Option B — Separate content repository

Case study MDX in a dedicated Git repository (e.g.
`vanch3d/portfolio-content`). Consumed by the app as:

- A **Git submodule** — pinned to a commit; updating content requires updating
  the submodule reference and rebuilding the app
- A **published npm package** — content versioned and published; app pins a
  version; requires a publish step before content appears

Both sub-variants still require a full Vercel build to publish new content.
They separate authorship history without eliminating the build dependency.

### Option C — Remote MDX with ISR

Case study content loaded at request time (or on-demand revalidation) from an
external source:

- **`next-mdx-remote`** loading MDX from a GitHub API, a CDN, or a headless CMS
- **ISR** (`revalidate` or on-demand via webhook) — content updates propagate
  without a code deployment; a webhook from the content source triggers
  revalidation

This makes case studies the ISR entry in the rendering matrix that isn't tied
to an external API (Zotero handles publications). It is also the option with
the most learning value in the context of this site's stated goal (ADR 001:
"each section uses a different rendering mode as a hands-on exercise").

Custom MDX components (flip-card grids, evidence links, disclosure accordions)
must be explicitly passed to the `next-mdx-remote` serializer — this is the
main added complexity vs. local-file MDX.

### Option D — Headless CMS

Content managed in Contentful, Sanity, or similar. Queried at build time (SSG)
or on request (ISR). Rich editing UI; structured content model enforced by the
CMS.

**Trade-off:** introduces a paid external dependency and a separate content
schema to maintain. Likely overkill for a personal portfolio with one author.
Not worth evaluating further until Option C is validated.

## Decision criteria

The decision should be made once the following are answered:

1. **Update frequency** — how often will case study content change after initial
   publication? If "rarely," Option A is fine indefinitely.
2. **Author workflow** — is editing MDX in a code editor acceptable long-term,
   or is a prose-focused editing interface wanted (Sanity Studio, Notion, etc.)?
3. **Component coupling** — how many custom MDX components will be registered?
   Option C's serializer whitelist becomes a maintenance surface as that list grows.
4. **Build time** — as case studies accumulate, does SSG build time become a
   practical problem? ISR amortises this; SSG does not.

## Current decision

**Option A** (in-repo, SSG) — per ADR 012. Revisit when:

- A case study needs to be updated without a code deployment, **or**
- Build time exceeds ~3 minutes on Vercel's free tier due to content volume, **or**
- A non-developer author needs to contribute content

## Related

- ADR 001 — Deployment target (Vercel); rendering mode table
- ADR 012 — Case Study Content Architecture (current content model)
- [next-mdx-remote](https://github.com/hashicorp/next-mdx-remote) — Option C implementation reference
