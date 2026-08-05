---
number: 12
title: "Page Metadata Conventions"
status: decided
date: "2026-08-05"
tags: ["conventions", "seo", "metadata", "next.js"]
supersedes: []
---

# ADR 012 — Page Metadata Conventions

## Context

Next.js App Router exposes metadata via `export const metadata: Metadata` (static)
and `export async function generateMetadata()` (dynamic). The initial implementation
used both patterns inconsistently:

- Some pages omitted `import type { Metadata }` and exported untyped objects
- Some pages had no metadata at all
- The title format was not uniform: `"CV"`, `"Engineering"`, and `"Engineering · Nicolas Van Labeke"` (from template) all appeared
- `generateMetadata` lacked a return type annotation
- The template separator (`·`) conflicted with the home-page separator (`—`)

## Decision

### Title format

| Route | Title | Notes |
|---|---|---|
| `/` | `Nicolas Van Labeke — Research & Engineering Portfolio` | Explicit override — descriptive tagline, not subject to template |
| All other routes | `Nicolas Van Labeke \| {Page}` | Template applied via layout |
| Slug routes (2-level) | `Nicolas Van Labeke \| {Section} \| {Item}` | `generateMetadata` composes `"{Section} \| {Item}"` as the `%s` value |

**Separator rationale:**
- `|` (pipe) is unambiguous, widely understood as a hierarchy separator, and scales to
  two levels cleanly (`… | Research | SAFeSEA`) without visual noise.
- `—` (em dash) is reserved exclusively for the home page tagline, where it reads as a
  descriptive phrase rather than a hierarchy.
- `·` (middot) is discarded — it is a typographic nicety but provides no visual hierarchy
  signal and is harder to parse at a glance in a browser tab.

### Title values by route

| Route | `%s` value passed to template |
|---|---|
| `/research` | `Research` |
| `/research/[slug]` | `Research \| {project.title}` |
| `/research/publications` | `Publications` |
| `/engineering` | `Engineering` |
| `/cv` | `CV` |
| `/lab` | `Lab` |
| `/lab/adr` | `Lab \| ADR` |
| `/lab/tokens` | `Lab \| Tokens` |
| `/lab/components` | `Lab \| Components` |
| `/lab/decisions` | `Lab \| Design decisions` |

### TypeScript rules

- Every `export const metadata` must be typed `const metadata: Metadata` with
  `import type { Metadata } from "next"`.
- Every `generateMetadata` must declare its return type as
  `Promise<Metadata>` — not inferred, not `{}`.
- `page.tsx` is a thin shell; metadata belongs at the top of the file, before the
  default export.

### Description

Every page must have a `description` field. Content:
- `/` — site-level description (already in layout, acts as default)
- Section pages — one sentence describing the section's scope
- Slug pages — `generateMetadata` constructs a description from content fields
  (title, period, type)

### `not-found.tsx` and error pages

These do not need per-page metadata; the layout default applies.

## Template in layout.tsx

```tsx
export const metadata: Metadata = {
  title: {
    template: "Nicolas Van Labeke | %s",
    default: "Nicolas Van Labeke — Research & Engineering Portfolio",
  },
  description: "Professional portfolio of Nicolas Van Labeke — ...",
};
```

## Checklist for new routes

When adding a new `page.tsx`:

- [ ] `import type { Metadata } from "next"` at the top
- [ ] `export const metadata: Metadata = { title: "...", description: "..." }`
  or `export async function generateMetadata(...): Promise<Metadata>`
- [ ] Title follows the `{Section}` or `{Section} | {Item}` pattern
- [ ] Description is concise (under 160 characters) and unique per route
- [ ] For slug routes: verify title is unique across all possible values

## Consequences

- Consistent `<title>` tags across all pages improves SEO and browser-tab legibility
- TypeScript enforcement catches missing or mis-typed metadata at build time
- Two-level titles (`Research | SAFeSEA`) remain within typical browser tab width
- The em dash in the home title is intentionally unique — no other page uses it
