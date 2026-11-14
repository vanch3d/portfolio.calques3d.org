---
number: 28
title: 'Feature flag registry with build-time env override'
status: accepted
date: '2026-11-13'
decision-makers: vanch3d
tags: ['architecture', 'feature-flags']
---

# Feature flag registry with build-time env override

## Context and Problem Statement

The case-study chapter pages need a sticky chapter rail that must be removable outright, or A/B-able, without code archaeology (Track P2, stage 1 review). The repo has no feature-flag mechanism: a search for flag-like code found only ad-hoc booleans. Without a shared mechanism each flag would invent its own env var name, default and read path, and server and client code would disagree.

The site is statically generated (SSG/ISR, no per-request server work on most routes), deployed to Vercel, and has no user accounts. Flags here are developer switches, not per-user experiments.

## Decision

A single typed registry at `src/lib/flags.ts`:

- `FLAGS` declares every flag once: key, boolean default, one-line description.
- Each flag may be overridden at build time with `NEXT_PUBLIC_FLAG_<NAME>` (`true|false|1|0|on|off|yes|no`). Unset or unparseable values fall back to the default.
- One read function, `isFlagEnabled(key)`, works in Server and Client Components. Env vars are read through literal `process.env.NEXT_PUBLIC_…` accesses so Next inlines them into client bundles.
- The first flag is `chapterRail` (default on).

Non-goals: runtime or per-user toggling, remote flag services, percentage rollouts. A flag that outlives its experiment is deleted, together with its registry entry.

## Consequences

- Good, because every flag is discoverable in one file and typed; a misspelled key fails `tsc`.
- Good, because the same call works on server and client, with no provider or context.
- Good, because the override is a build-time constant: no runtime cost and no hydration mismatch between server and client.
- Bad, because adding a flag means touching two places (`FLAGS` and the `readEnv` switch); the switch exists because dynamic `process.env[key]` is not inlined on the client.
- Bad, because changing a flag requires a rebuild; an A/B comparison needs two deployments.

## Implementation Plan

- **Affected paths**: `src/lib/flags.ts`, `src/lib/flags.test.ts`.
- **Dependencies**: none.
- **Patterns to follow**: guard the flagged surface in the page (`isFlagEnabled('chapterRail') ? <ChapterRail … /> : null`), keep the flag-off variant complete and coherent.
- **Patterns to avoid**: reading `process.env.NEXT_PUBLIC_FLAG_*` outside `flags.ts`; dynamic env lookups; flags that gate data or routing.

### Verification

- [x] `src/lib/flags.test.ts` covers default, override on/off and unparseable values.
- [ ] A build with `NEXT_PUBLIC_FLAG_CHAPTER_RAIL=false` renders the plain "Chapter n of N" label on chapter pages.

## Alternatives Considered

- Vercel Edge Config / a flag service: a runtime dependency and network hop for a static site with a single developer.
- Ad-hoc `process.env` reads per feature: no registry, no types, inconsistent defaults.
- A React context provider: forces Client Components and does not help Server Components.

## More Information

Revisit if a flag needs runtime or per-user evaluation. Related: `.docs/tasks/2026-11-13-case-studies-surface.md` (Stage 1), `.impeccable/surfaces/src-app-case-studies-project-slug-page-tsx.md`.
