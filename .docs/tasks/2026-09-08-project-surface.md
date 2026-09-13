# Project Surface — Design Investigation
**Route:** `/projects/[slug]` (and eventual `/case-studies/[slug]`)
**Branch:** `epic/design-compass-app`
**Started:** 2026-09-08
**Status:** Design composition choice pending

---

## Brief

Design the `/projects/[slug]` detail page — the most important surface in the portfolio.
Every other route is a curated path *into* this surface.

### Information architecture

```
Era (research | engineering)
  └─ Position (employment, contract, academic, phd…)
       └─ Project (primary + secondary; type: research | engineering)
            ├─ Resources: Publications (Zotero), GitHub repos, Slides, Live, Gallery, Case studies
            └─ Case Study
                 └─ Chapters (co-located MDX, auto-discovered)
```

**The project is the primary organising element.** Routes into it are curated access to this topology:
- `/projects/[slug]` — primary route (slug = MDX filename, e.g. `hivemq-edge`, `calques3d`)
- `/case-studies/[project-slug]--[study-slug]` — flat URL, uniqueness guaranteed by naming convention
- `/research`, `/engineering` — era landing pages (separate design task)

### Route decisions (confirmed)

| Question | Decision |
|---|---|
| Project route | `/projects/[slug]` — slug from MDX filename |
| Case study route | `/case-studies/hivemq-edge--design-retro` (flat, convention-enforced uniqueness) |
| Primary vs secondary | Add `primary: boolean` flag (or ordering convention) to project schema |
| Project anatomy | Type-agnostic "resources" model; type gives structural emphasis and visual flavour |
| Case study chapters | Single scrolling page (separate surface design) |
| Proprietary visibility | Info panel / RESTRICTED annotation; page always shown |
| Scope of this task | `/projects/[slug]` only — era pages and case study pages are follow-on surfaces |

### Resources model

All external evidence is typed as **Resources**:
- Publications (Zotero API — fetched at render time)
- Code repos (GitHub links)
- Slides (Speakerdeck URL in `media.slides`)
- Live demo / deployment (`links.live`)
- Gallery (Piwigo photo albums)
- Case studies (first-class child content with preview)
- Artefacts (engineering-only — Figma, screenshots)

### Visual type flavour

Both project types stay within the Construction on Tracing Paper world (cream/graphite/one red).
Difference is **structural emphasis**, not palette:
- **Research:** publication grid dominates; funding/collaborators prominent; gallery and slides secondary
- **Engineering:** highlights bullets dominate; tech stack prominent; case studies are the narrative layer

**The One Red Rule:** only ongoing projects carry the red marker; archived/completed projects are pure graphite.

### Content examples

**HiveMQ Edge** (`hivemq-edge.mdx`)
- Ongoing, public, Lead Frontend Engineer at HiveMQ (2023–present)
- Tags: React, TypeScript, React Flow, OpenAPI, Cypress, Chakra UI, MQTT
- GitHub: hivemq/hivemq-edge · External: hivemq.com/products/hivemq-edge
- Case study: "HiveMQ Edge: A Design Retrospective" (6 chapters, ~25 min)
- No publications

**Calques 3D** (`calques3d.mdx`)
- Archived, public, PhD 1995–2010
- Tags: 3D geometry, ILE, C++, OpenGL, computer algebra
- External: nvl.calques3d.org · Gallery: Piwigo "calques3d"
- Publications: Zotero tag "calques3d"
- No case studies

---

## Design process

### Concept seed
- Seed key: `f36157c0`
- Mode: experience
- Scope: surface (world established — choice is composition)
- Dealt indices: 5, 2, 4 (index 5 leads)

### My 7 structural candidates (ordered by resonance)

1. Dimension-line specification sheet
2. Annotated section elevation
3. Academic journal article
4. Technical dossier / classified file
5. Natural history specimen record
6. Observatory logbook entry
7. Technical drawing revision block

### Dealt cards (indices 5, 2, 4)

**Card A — THE ROLL (Index 5): Natural history specimen record**
- Classification header (era label, period measurement strip, status stamp)
- Two-column layout: narrow taxonomy panel (type, institution, funding/role) + wide narrative body
- Resource count annotation bar (n papers · n repos · n case studies)
- Typed resource blocks: publications as citation list, case studies as preview cards, links as reference entries
- Period dimension line at footer (tick-marked at key events)
- Comp: `.docs/design/comps/project-detail-comp-specimen.html`

**Card B (Index 2): Annotated section elevation**
- Full-width period dimension line at top, project title as span label
- Wide narrative body (72ch); marginal annotations orbit the text with leader lines
- Each resource type annotates the margin where it is most relevant in the body
- Construction arc sweeps from period line to right edge
- Comp: `.docs/design/comps/project-detail-comp-elevation.html`

**Card C (Index 4): Technical dossier**
- Title block (display title + metadata row + status stamp ONGOING in red / ARCHIVED)
- Numbered heavy-rule sections: OVERVIEW, NARRATIVE, RESOURCES
- RESOURCES section: typed sub-sections (PUBLICATIONS, REPOSITORIES, CASE STUDIES, ARTEFACTS)
- Proprietary work: RESTRICTED stamp replaces artefact block
- Comp: `.docs/design/comps/project-detail-comp-dossier.html`

**Model pick (Index 1): Dimension-line specification sheet**
- Dimensioned header: project title centred, era/period as witness lines + dimension arrow
- Abstract box in ruled frame
- Single-column narrative (68ch) with narrow annotation column (tags, refs)
- Resource legend table: TYPE | COUNT | ENTRIES, ghost-line row dividers
- Comp: `.docs/design/comps/project-detail-comp-datasheet.html`

### Challenger evaluation

| Challenger | Verdict | Reason | Donation to assigned |
|---|---|---|---|
| Particle detector event display | Declined | Near-black ground conflicts with cream world; concentric topology doesn't serve linear narrative | Resource count as measurement annotation bar |
| Suminagashi fluid ink basin | Declined | Requires complete visual world replacement | Organic transitions between sections |

---

## Status

- [x] Composition choice — **Comp A: THE ROLL (Natural history specimen record)** selected 2026-09-08
- [x] Direction contract written — `.impeccable/surfaces/src-app-projects-slug-page-tsx.md`
- [x] Comp approved — `.docs/design/comps/project-detail-comp-specimen.html`
- [x] Implementation plan written — see below
- [ ] Schema change: add `primary: boolean` to project schema
- [ ] Implementation complete
- [ ] Engineering handoff approved by user

### Design feedback recorded
- **Comp B (Section Elevation):** narrative and comp did not match or complement each other — the dimension-line header concept was sound but marginal leader-line annotations at that column width created visual confusion rather than structure. Candidate abandoned.

---

## Implementation plan

### Context for new sessions

**Branch:** `epic/design-compass-app`
**Approved comp:** `.docs/design/comps/project-detail-comp-specimen.html` — this is the spec, do not edit it
**Surface brief:** `.impeccable/surfaces/src-app-projects-slug-page-tsx.md` — direction contract
**Design world:** Construction on Tracing Paper — cream (#f8f4ed), graphite (#2a2a2a), faded (#6b6b6b), ghost (#c8c4bc), red (#c0392b). STIX Two Text / Spectral / Space Mono. Flat, no shadows, strict line-weight hierarchy.

**What already exists in the data layer (do not duplicate):**
- `src/lib/content/research.ts` — `getResearchProjectBySlug(slug)`, `getAllResearchProjects()`, `getResearchSlugs()`
- `src/lib/content/engineering.ts` — `getEngineeringProjectBySlug(slug)`, `getAllEngineeringProjects()`, `getEngineeringSlugs()`
- `src/lib/content/positions.ts` — `getPositionBySlug(slug)`
- `src/lib/content/case-studies.ts` — `getCaseStudiesForProject(projectSlug)` (already built for this exact use case)
- `src/lib/api/zotero.ts` — Zotero API wrapper
- `src/lib/publications.ts` — publication processing layer

**All slugs come from MDX filenames** (no separate index). The project `type` determines which content directory to read from.

---

### Step 0 — Schema change (prerequisite)

Add `primary` to `ProjectBase` in `src/schemas/project.schema.json`:

```json
"primary": {
  "type": "boolean",
  "description": "Marks this as the primary project of its position. At most one per position."
}
```

Then run `npm run generate:types` to regenerate `src/types/content.ts`.
Then run `npm run validate` to confirm.

---

### Step 1 — Unified project resolver

Create `src/lib/content/projects.ts`:

```ts
// Tries research first, then engineering. Returns {project, type} or null.
export function getProjectBySlug(slug: string):
  | { project: ResearchProject; type: 'research' }
  | { project: EngineeringProject; type: 'engineering' }
  | null

// All slugs from both directories for generateStaticParams
export function getAllProjectSlugs(): string[]
```

This is the single entry point for `src/app/projects/[slug]/page.tsx`.

---

### Step 2 — Route file

**File:** `src/app/projects/[slug]/page.tsx`
**Rendering:** SSG for all data except publications — use `generateStaticParams` from `getAllProjectSlugs()`.
Publications come from Zotero. Use `unstable_cache` with a revalidation tag (not full ISR) so the page shell stays SSG while publication data refreshes on demand. If Zotero is unavailable, show a graceful empty state — never block render.

```ts
export async function generateStaticParams() {
  return getAllProjectSlugs().map(slug => ({ slug }))
}
```

Page component assembles: project data + position + case studies + publications (if `project.publications` tag exists).

---

### Step 3 — Components

All components live in `src/app/projects/[slug]/_components/`. Each is a named Server Component unless noted.

| Component | Responsibility |
|---|---|
| `ProjectDetailPage` | Top-level shell — assembles all sections |
| `ClassificationHeader` | Era badge, title/abbr, period strip, status stamp (ONGOING red / else graphite) |
| `ProjectTitle` | Display title + subtitle + `SpecimenIllustration` placeholder — flex row, title left, image right |
| `SpecimenIllustration` | `media.cover` image when available; ghost dashed placeholder with corner registration marks when absent. Renders as `<img>` with duotone CSS filter. See image generation notes below. |
| `TaxonomyPanel` | Left column on desktop; horizontal band on tablet; stacked on mobile. Contains: type badge, institution, role/funding, tags. |
| `ProjectNarrative` | Spectral body prose from MDX. On engineering: `HighlightsBlock` renders above the description, inside this column. |
| `HighlightsBlock` | Engineering-only. 3–5 bullet achievements. Always first in the narrative column, above the prose. |
| `ResourceAnnotationBar` | Full-width separator. Shows counts: `n publications · n repos · n case studies`. Measurement ticks at desktop. |
| `PublicationsBlock` | Citation list. Empty state if no `project.publications` tag. Zotero data passed as prop. |
| `CaseStudiesBlock` | Preview cards for linked case studies. Empty state if none. |
| `RepositoryBlock` | GitHub links as reference entries. Hidden if empty. |
| `ExternalLinksBlock` | Live demo / external site links. Hidden if empty. |
| `SlidesBlock` | Speakerdeck embed or link. Hidden if empty. |
| `GalleryBlock` | Piwigo album link/preview. Hidden if empty. |
| `ArtefactsBlock` | Engineering artefacts (Figma, screenshots). Shows `RestrictedBlock` when `visibility === 'proprietary'`. |
| `RestrictedBlock` | RESTRICTED annotation with one-line explanation. Replaces artefact content. |
| `SiblingNav` | Other projects in same position. Horizontal at desktop; vertical list at tablet/mobile. |
| `Breadcrumb` | Home → [Era] → [Institution/Position] → [Project title] |

#### Specimen illustration — image notes

**Field:** `media.cover` (already in `MediaAssets` schema — no new field needed).

**When present:** render as `<img>` inside the `SpecimenIllustration` container. Apply a CSS duotone treatment to keep images within the cream/graphite/red visual world:
```css
filter: grayscale(100%) sepia(20%) contrast(1.1);
```
Images generated outside the design world (photographs, full-colour renders) are brought into it via this filter. Images generated within the world (flat geometric, cream/graphite palette) render cleanly without it.

**When absent:** render the ghost dashed placeholder from the comp (dashed border, corner registration marks, `SPECIMEN ILLUSTRATION` label, dimensions note). This is the correct empty state — never hide the zone.

**Responsive behaviour:**
- `lg`: 200×168px, top-right of `ProjectTitle` zone
- `md`: 120×100px, inline within the horizontal metadata band (right side)
- `sm`: hidden — the title area is too narrow; image surfaces only on listing-page cards

**Generation task (separate):** image generation for each project is a follow-on task using `imagegen-frontend-web` or `brandkit` skills. The generation brief per project must specify: "flat geometric illustration, cream (#f8f4ed) ground, graphite (#2a2a2a) construction lines, one red (#c0392b) accent, no gradients, no photography". Projects without sufficient narrative content use one of two generic fallbacks: `cover-research-generic.png` / `cover-engineering-generic.png`.

**Resource section order:**
- **Research projects:** Publications → Gallery → Slides → External links
- **Engineering projects:** Case studies → Repositories → Artefacts (or RESTRICTED) → External links → Slides

---

### Step 4 — Responsive layout

The comp was designed at 1280px. The responsive strategy below must be applied from the start — not retrofitted.

#### Breakpoints in use (Tailwind v4)
- `lg` ≥ 1024px — full two-column layout as designed
- `md` 768–1023px — taxonomy collapses to horizontal band
- `sm` < 768px — fully stacked

#### ClassificationHeader

| Breakpoint | Behaviour |
|---|---|
| `lg` | Full bar: era badge top-left · title top-right · period measurement strip (witness lines + ticks + span arrow) below · status stamp absolute top-right corner |
| `md` | Same bar; period strip keeps start–end endpoints but drops intermediate ticks; status stamp inline right |
| `sm` | Title full width (large). Era badge + period ("Research · 1995–2010") as a single label line below. No witness lines. Status stamp: inline text badge after the period |

#### Two-column layout (TaxonomyPanel + ProjectNarrative)

| Breakpoint | Behaviour |
|---|---|
| `lg` | `grid-cols-[280px_1fr]`. TaxonomyPanel is a left fixed-width column. Sticks to top on scroll within the narrative height. |
| `md` | Taxonomy panel collapses to a full-width horizontal metadata band above the narrative. Shows: era badge · type badge · institution · role/funding · top 5 tags (inline). Narrative becomes full-width single column. |
| `sm` | Metadata band wraps to a 2-column key/value grid (label left, value right). Top 3 tags only + "N more" link. Narrative full width. |

**Implementation note:** use `grid md:grid-cols-1 lg:grid-cols-[280px_1fr]` on the container div. TaxonomyPanel receives a `variant` prop (`'column' | 'band'`) determined at runtime via server-side breakpoint-agnostic rendering — or more practically, render both layouts and hide the appropriate one with Tailwind responsive classes (`hidden lg:block` / `lg:hidden`).

#### ResourceAnnotationBar

| Breakpoint | Behaviour |
|---|---|
| `lg` | Full separator with measurement tick marks per resource type |
| `md`/`sm` | Text only: `n publications · n repos · n case studies`. Ticks hidden (`hidden lg:block` on tick elements). |

#### CaseStudiesBlock cards

| Breakpoint | Behaviour |
|---|---|
| `lg` | 2-column card grid |
| `md`/`sm` | 1-column, full width |

#### Tags in TaxonomyPanel

| Breakpoint | Behaviour |
|---|---|
| `lg` | All tags, wrapping |
| `md` | Top 5 tags inline |
| `sm` | Top 3 tags + "N more" (no interaction — this is a count, not a filter) |

#### SiblingNav

| Breakpoint | Behaviour |
|---|---|
| `lg` | Horizontal tab-strip below ClassificationHeader |
| `md`/`sm` | Compact vertical list ("Other projects at [Institution]") |

#### Period dimension line at footer

| Breakpoint | Behaviour |
|---|---|
| `lg` | Full tick-marked construction line with witness lines and annotations |
| `md` | Simplified: start year — end year with a single span arrow |
| `sm` | Hidden (period already shown in ClassificationHeader) |

---

### Step 5 — Content validation

Before implementation, verify MDX frontmatter for both example projects:
- `src/content/engineering/hivemq-edge.mdx` — check all fields against schema
- `src/content/research/calques3d.mdx` — check all fields against schema

These are the two reference projects the comp was designed against. Implementation must be verified against both.

---

### Step 6 — Testing

Co-locate specs: `src/app/projects/[slug]/_components/ClassificationHeader.spec.cy.tsx`, etc.

Per component, the spec must cover:
- Default state
- Research variant vs engineering variant
- Ongoing (red stamp) vs archived (graphite)
- Proprietary visibility (RestrictedBlock rendered)
- Empty resource states
- Axe a11y check on each variant

---

### Step 7 — i18n

All UI copy into `messages/en.json` under the `ProjectDetail` namespace. Content from MDX (title, description, highlights) is data — not translated.

Strings needed:
- Section labels: "Publications", "Case Studies", "Repositories", "Gallery", "Slides", "Artefacts"
- Status labels: "Ongoing", "Completed", "Archived"
- Type labels: "Research Project", "Engineering Project"
- Resource annotation: "{count} publications · {count} repos · {count} case studies"
- Restricted: "This work is under NDA. Artefacts are not available publicly."
- Breadcrumb labels, sibling nav prompt

---

## Deferred to follow-on surfaces

| Surface | Notes |
|---|---|
| `/case-studies/[slug]` | Scrolling page with chapter navigation; separate design investigation |
| `/research`, `/engineering` | Era landing pages with specialised listings; after project surface is done |
