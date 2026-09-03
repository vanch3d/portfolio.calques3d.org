---
number: 12
title: "Case Study Content Architecture"
status: accepted
date: "2026-09-01"
decision-makers: vanch3d
tags: ["content", "mdx", "routing", "case-studies", "ssg"]
---

# ADR 012 — Case Study Content Architecture

**Date:** 2026-09-01
**Status:** Decided

## Context

The portfolio includes long-form engineering narratives — design retrospectives, feature
deep-dives, methodology write-ups — that are distinct from the short project summaries
in `src/content/engineering/`. These narratives require:

- Progressive disclosure (hook → expand → detail) at any granularity
- Embedded interactive or visually rich components alongside prose
- A rendering surface that is not the project detail page — its own visual identity
  and direct URL
- Authorship in prose (not in code), but with full component access at any point

These are "case studies." They are prime citizens of the content model — not
sub-items of a project entry, not a rendering variant of the project detail page.

A project can have zero or many case studies. A case study belongs to exactly one
project (engineering or research). Case studies have no prescribed internal structure
beyond shared curation frontmatter; a case study may be a single prose page or a
multi-chapter hub with sidebar navigation.

## Decision

### Format: MDX

All production case study content is MDX. This is the enabling decision: any
section, progressive-disclosure pattern, or visual element can be engineered as a
React component embedded directly in the narrative.

Example: a flip-card grid (to show a set of design explorations with front/back
trade-off text) is one possible progressive-disclosure component. It might be
replaced by a side-by-side image+text grid, an accordion, or an annotated
diagram, depending on what is designed for the surface. MDX makes every content
element an engineering decision rather than a format constraint.

Satellite content — structured data or sub-collections that feed a component —
are co-located MDX or MD files within the same case study directory, imported or
linked from the main content file.

Working drafts are MD (with review markers, internal notes, unconfirmed claims).
They live in the same directory structure but are **not consumed by the content
reader** and are not committed as production content.

### Directory structure: flat, globally unique slugs

```
src/content/case-studies/
  {project-slug}--{case-study-slug}/
    index.mdx              ← required; the case study entity
    chapter-1.mdx          ← optional; discovered automatically
    chapter-2.mdx
    satellite-data.md      ← optional; co-located content for a component
```

The directory name uses `{project}--{slug}` (double-dash separator) to ensure
global uniqueness in a flat directory. Example: `hivemq-edge--agentic/`.

The case study's own short slug (e.g. `agentic`) and its parent project slug
(e.g. `hivemq-edge`) are declared in `index.mdx` frontmatter — not derived from
the directory name. The directory name is a storage convention for uniqueness only.

### Frontmatter (`index.mdx`)

```yaml
---
slug: agentic
project: hivemq-edge
title: "Directing an AI Agent Through a Codebase-Wide Design Problem"
status: draft | published
featured: false
tags: ["ai", "ownership", "react", "typescript"]
---
```

No `format` field. Whether a case study has chapters is determined by the
presence of `chapter-*.mdx` siblings at read time — not by a frontmatter
declaration.

### Routing

`/case-studies/[project]/[slug]` — SSG.

Example: `/case-studies/hivemq-edge/agentic`

- `[project]` matches the `project:` frontmatter field
- `[slug]` matches the `slug:` frontmatter field (not the full directory name)
- Case studies have their own layout and visual identity, independent of the
  project detail page at `/engineering/[slug]`
- The project page links to its case studies; it does not embed or frame them

### Project ↔ case study relationship

The `project:` field in `index.mdx` is the **only** forward reference.
`EngineeringProject` and `ResearchProject` types do **not** gain a `case_studies`
field. The relationship is computed at build time:

```ts
getCaseStudiesForProject(projectSlug: string): Promise<CaseStudy[]>
```

This avoids the two-place update problem (project MDX + case study MDX both
needing changes when adding a case study).

### Content reader interface (`lib/content/case-studies.ts`)

```ts
getAllCaseStudies(): Promise<CaseStudy[]>
getCaseStudyBySlug(project: string, slug: string): Promise<CaseStudy | null>
getCaseStudiesForProject(projectSlug: string): Promise<CaseStudy[]>
getChaptersForCaseStudy(project: string, slug: string): Promise<ChapterMeta[]>
importCaseStudyMDX(project: string, slug: string): Promise<MDXContent>
```

The reader maps `{project}--{slug}` directory names to route parameters using
the `--` separator convention.

### Types (`src/types/content.ts`)

```ts
export type CaseStudyStatus = 'draft' | 'published'

export interface CaseStudy {
  slug: string        // short slug from frontmatter, e.g. "agentic"
  project: string     // → Project.slug (engineering or research)
  title: string
  status: CaseStudyStatus
  featured: boolean
  tags: string[]
}

export interface ChapterMeta {
  slug: string        // e.g. "chapter-1"
  number: number
  title: string
}
```

### Rendering mode

SSG. Case study content is authored, not live-fetched. On-demand revalidation
is not needed at this stage. See ADR 013 for the future investigation into
remote/decoupled content.

## Why not sub-routes of `/engineering`?

A case study is not a rendering variant of the project detail page. It has a
distinct narrative purpose, potentially its own layout (sidebar chapter nav,
full-bleed imagery, interactive embeds), and needs a stable direct URL for
sharing. Sub-routing under `/engineering/[slug]/case-studies/[cs-slug]` would
subordinate case studies visually and semantically — a reader following a link to
a case study shouldn't land inside the project page's chrome.

## Consequences

**Positive:**
- Case studies are independently addressable and shareable by URL
- MDX gives full component access at any point in the narrative — no content is
  locked into prose-only rendering
- No two-place update problem for project ↔ case study relationships
- Structure (single page vs chapters) is declarative via files, not a frontmatter enum
- Works for both engineering and research projects without type branching

**Negative / Trade-offs:**
- `--` separator convention in directory names is informal; breaking it causes the
  reader's slug-extraction logic to fail silently
- `generateStaticParams` for `/case-studies/[project]/[slug]` must scan the
  filesystem and parse frontmatter at build time — slower than a simple slug list
- No validation that `project:` in a case study frontmatter matches a real project
  slug (schema validation catches this at CI time if `project` is an enum; otherwise
  a broken reference surfaces only as a 404)

## Related

- ADR 003 — API layer (lib/ content reader pattern)
- ADR 013 — Case Study Content Location (open — investigating remote/CMS options)
- ADR 014 — Content Model (full entity overview and relationships)
- `.local/planning/case-study-content-structure.md` — planning analysis
