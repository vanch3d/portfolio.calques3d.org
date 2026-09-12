---
version: 1
slug: "src-app-projects-slug-page-tsx"
primary_target: "src/app/projects/[slug]/page.tsx"
related_targets:
  - "src/content/research/*.mdx"
  - "src/content/engineering/*.mdx"
  - "src/schemas/project.schema.json"
---

## Surface

Route: `/projects/[slug]`
Visitor mode: **Experience**
Audience: Peer researcher, engineering recruiter, or collaborator arriving from the homepage arc, an era landing page, or a direct link. They are here to read a specific body of work — not to browse.

## Job / Task / Proof

The visitor must leave with a full understanding of what the project is, what was produced, and what evidence exists. The page is the primary evidence record — it surfaces all typed resources (publications, code, slides, gallery, case studies, artefacts) and positions each project within its institutional context. The proof is the density and precision of that record: a scholar's dossier, not a marketing card.

## Constraints

- Must work for both project types (research / engineering) with structural emphasis difference only — no palette split
- Must handle all resource-absence states gracefully (zero publications, no case studies, no live URL, proprietary)
- Proprietary projects: always shown; artefacts/code replaced by RESTRICTED annotation with explanation
- One Red Rule: only ongoing projects receive the red marker; archived/completed stay pure graphite
- WCAG 2.1 AA zero violations (axe-core)
- EN-UK primary locale; i18n strings via next-intl
- Breadcrumb must be present: Home → [Era] → [Position/Organisation] → [Project title]
- Sibling project navigation when a position has multiple projects

## Direction Contract

**THESIS:** The project page as a natural history specimen record — a classification header that orients the visitor in the taxonomy, a two-column anatomy that separates institutional metadata from narrative, and a resource layer that treats every evidence type with equal documentary precision.

**OWN-WORLD:** Construction on Tracing Paper. Cream ground (#f8f4ed). Graphite (#2a2a2a). Faded (#6b6b6b). Ghost (#c8c4bc). One red (#c0392b) for a single active/ongoing marker only. STIX Two Text italic for display/classification headings. Spectral for body narrative. Space Mono for labels, counts, dimension annotations. Flat, no shadows, sharp corners, strict line-weight hierarchy (heavy 1.5px / medium 1px / ghost 0.5px).

**STORY:** The visitor reads a classification header (era badge, period strip, institution, status stamp) that tells them immediately where this project sits in the larger taxonomy. They scan the narrow taxonomy column (type, funding, role, tags) for the institutional facts, then read the narrative body at their own pace. Below the fold the resources section lays out every evidence type as a typed, counted, annotated block — citation list for publications, preview card for case studies, reference entry for links. Information density is the trust signal.

**FIRST VIEWPORT:** Full-width classification header (one horizontal band): era label top-left, project abbreviation/title top-right, period measurement strip, institution line, status stamp (ONGOING in red or ARCHIVED/COMPLETED in graphite). Below: two columns — narrow taxonomy panel (25% / ~320px) and wide narrative body (75%). The narrow panel contains type badge, position/institution, role or funding, top tags. The wide column contains the full project description in Spectral body at measure ~68ch.

**STRUCTURAL EMPHASIS:**
- **Research projects:** Publication block is the first and largest resource section below the narrative. Funding agency and collaborating institutions are listed in the taxonomy column. Gallery and slides are secondary resource entries.
- **Engineering projects:** Highlights (3–5 achievement bullets) appear as the first block immediately after the description (inside the narrative column, above the resource section). Case studies are the dominant resource block. Tech stack tags are prominent in the taxonomy column.

**RESOURCE SECTION:** A horizontal annotation bar below the narrative divides "above = description" from "below = evidence". The bar shows: `n publications · n repos · n case studies · n slides` (only types with content). Below it, each resource type is a typed block rendered in its own visual grammar: citation list / preview cards / reference entries / measurement row. Absent types are omitted silently except when proprietary — those get a RESTRICTED annotation.

**RESPONSIVE LAYOUT:**

The comp was designed at 1280px. Three layout modes govern the responsive behaviour — these are architectural decisions, not cosmetic tweaks:

| Zone | `lg` ≥1024px | `md` 768–1023px | `sm` <768px |
|---|---|---|---|
| **ClassificationHeader** | Full bar: era badge · title · period measurement strip (witness lines + ticks + span arrow) · status stamp | Same bar; period strip keeps endpoints, drops intermediate ticks | Title full width; era badge + period as single label line; no witness lines; status stamp inline |
| **SpecimenIllustration** | 200×168px, top-right of ProjectTitle zone | 120×100px, right side of horizontal metadata band | Hidden — too narrow; image appears on listing-page cards instead |
| **Two-column layout** | `grid-cols-[280px_1fr]` — TaxonomyPanel left, narrative right | TaxonomyPanel → full-width horizontal metadata band above narrative | Metadata band → 2-col key/value grid (top 3 tags + "N more") |
| **TaxonomyPanel tags** | All tags, wrapping | Top 5 tags inline | Top 3 + "N more" count |
| **ResourceAnnotationBar** | Measurement tick marks per resource type visible | Ticks hidden; text counts remain | Ticks hidden; text counts remain |
| **CaseStudy cards** | 2-column grid | 1-column full width | 1-column full width |
| **SiblingNav** | Horizontal tab-strip below ClassificationHeader | Compact vertical list | Compact vertical list |
| **Period dimension line (footer)** | Full tick-marked construction line with witness lines | Start year → end year, single span arrow | Hidden (period shown in ClassificationHeader) |

**Implementation note on TaxonomyPanel:** render both the column layout and the horizontal band layout in the DOM; toggle visibility with `hidden lg:block` / `lg:hidden` responsive classes. Do not use JS breakpoint detection. Both layouts must pass axe checks independently.

**Specimen illustration — field and treatment:**
- Field: `media.cover` (already in `MediaAssets` — no schema change needed)
- When present: `<img>` with `filter: grayscale(100%) sepia(20%) contrast(1.1)` to bring any image into the cream/graphite world
- When absent: ghost dashed placeholder with corner registration marks and `SPECIMEN ILLUSTRATION` label — never hide the zone
- Image generation is a separate task; brief constraint per project: flat geometric, cream/graphite/red palette only, no photography
- Generic fallbacks: `cover-research-generic.png` / `cover-engineering-generic.png`

**FORM:** Comp A — THE ROLL — Natural history specimen record. User-selected from four candidates (A/B/C/D). Seed key f36157c0, dealt index 5 (lead).

**COMP:** `.docs/design/comps/project-detail-comp-specimen.html`

**FINISH:** unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md update, and every shipping raster carrying its provenance.
