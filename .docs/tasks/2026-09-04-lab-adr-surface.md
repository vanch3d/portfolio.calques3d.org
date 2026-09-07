---
epic: epic/design-compass-app
status: in-progress
started: 2026-09-04
---

# Lab ADR Surface — Task Plan

> Add ADRs and Engineering Insights to the frontend under `/lab/adr`.
> This is the "making-of" documentation track for the portfolio.

---

## Scope

### Routes

| Route | Content |
|---|---|
| `/lab/adr` | ADR index — search, filter by tag, paginated for 100s of entries |
| `/lab/adr/[slug]` | ADR detail — full markdown render + related insight callouts |
| `/lab/insights` | Insights index (TBD — pending user decision on IA) |
| `/lab/insights/[slug]` | Insight detail — discovery narrative (TBD) |

### Data constraints

- Source: `.docs/adr/*.md` and `.docs/insights/*.md`
- Files must NOT be modified — read-only static documents
- API layer: Next.js server-side reader (not modifying source files)
- Rendering strategy: SSG (`force-static`) — content is frozen per build

### Design constraints

- ADR index must handle 100s of entries: pagination OR virtualised list + search + tag filter
- Insights are "top-level valuable experience" — visually elevated above ADR list items
- ADR detail shows insight callouts inline ("Discovered in practice" block)
- Cross-references to other ADRs and to `/lab/design-system` should be live links
- Must reuse existing design system tokens exactly (no new tokens)
- WCAG 2.1 AA compliance required

---

## Strands

### Strand 1 — Surface design (via /impeccable)

- [x] Generate surface proposal for `/lab/adr` index — Blueprint Revision Sheet direction chosen (seed 1dc45268)
- [x] User approves comp — approved 2026-09-04, committed to `.docs/design/comps/adr-index-comp-v1.html`
- [x] Surface brief written — `.impeccable/surfaces/src-app-lab-adr-page-tsx.md`
- [x] Comp strategy for detail + insights — **Option C: inherit vocabulary, no new comps**
  - After implementation: `/impeccable critique` each surface against direction contract
- [ ] Process retrospective written — `.local/tmp/impeccable-flow-retrospective.md` ✓

### Strand 2 — Data API ✓ COMPLETE

- [x] `src/lib/content/adr.ts` — reads `.docs/adr/*.md`, frontmatter + body, slug from filename
- [x] `src/lib/content/insights.ts` — reads `.docs/insights/*.md`, links to related ADRs
- [x] `src/types/adr.ts` — `AdrMeta`, `Adr`, `AdrStatus`, `InsightMeta`, `Insight` re-exports + `AdrEntry`/`InsightEntry` aliases
- [x] `src/schemas/adr.schema.json` / `insight.schema.json` — frontmatter validation schemas
- [x] Cross-reference resolver: `adrSlugFromNumber()` used at page level to pre-resolve slugs
- [x] `InsightCalloutBlock.test.ts` — Vitest unit tests for `extractBodyExcerpt()` (pure function)

### Strand 3 — Implementation ✓ CODE COMPLETE (awaiting user review + test run)

Branch: `feat/lab-adr` off `epic/design-compass-app`

**ADR index (`/lab/adr`):**
- [x] `page.tsx` — thin shell using `LabBreadcrumb` + `LabRegisterHeader`
- [x] `AdrIndexClient` — client component managing filter/search/load-more state
- [x] `AdrRegisterTable` — uses `RegisterTable/*` + `LabTag` for tag cells
- [x] `AdrFilterBar` — `LabButton` for tag toggles, Base UI `Field`+`Input` for search
- [x] `InsightCalloutStrip` — max 2–3 insights + "SEE ALL (N) →" link

**ADR detail (`/lab/adr/[slug]`):**
- [x] `page.tsx` — SSG with `generateStaticParams`, `LabBreadcrumb` with extra segment
- [x] `AdrDocument` — header block (rule-heavy-x, title-italic), markdown body via remark
- [x] `InsightCalloutBlock` — "DISCOVERED IN PRACTICE" warm-tint block + excerpt

**Insights index (`/lab/insights`):**
- [x] `page.tsx` — `LabBreadcrumb` + `LabRegisterHeader`, resolves `relatedAdrSlug` at page level
- [x] `InsightsRegisterTable` — uses `RegisterTable/*`, `.title-italic` on title column

**Insights detail (`/lab/insights/[slug]`):**
- [x] `page.tsx` — SSG with `generateStaticParams`, `LabBreadcrumb`
- [x] `InsightDocument` — header, frontmatter dl, body, back-ref ADR link, prev/next nav

**Cross-cutting:**
- [x] `LabAdr` + `LabInsights` namespaces in `messages/en.json`
- [x] `export const dynamic = "force-static"` on all 4 route files
- [x] CT specs written alongside all components (not yet run)
- [x] `cypress/e2e/lab-adr.cy.ts` E2E spec stub
- [x] Atomic design primitives: `NavLink`, `LabTag`, `LabButton`, `RegisterTable/*`
- [x] `@base-ui/react` 1.8.0 installed
- [x] CSS utilities added to `globals.css`: `.rule-heavy-x`, `.register-row`, `.register-row-active`, `.title-italic`, `.register-body`, `.register-table`, `.register-table-container`
- [x] ADR 019 — Content pipeline decisions (gray-matter + remark, server-only data layer, page-level cross-reference resolution, E2E-only for async Server Components)
- [ ] **User reviews code → approves → runs tests**
- [ ] `pnpm validate` green
- [ ] User approval → PR into epic
- [ ] Post-ship: `/impeccable critique` on detail + insights surfaces

---

## Decisions resolved

| Question | Decision |
|---|---|
| Insights routing | Own routes: `/lab/insights` (index) + `/lab/insights/[slug]` (detail) — "worth trialling" |
| ADR index pagination | Search + tag filter + "load more" folio mark — no numbered pagination |
| Insights on index | Featured strip: max 2–3 most recent + "SEE ALL (N) →" link |
| MDX rendering | Full markdown render preferred (body is `.md`, not `.mdx`; `next-mdx-remote` or `remark` pipeline) |
| Cross-links live | ADR↔ADR: yes · ADR↔insight: yes · ADR→design-system: yes · external: yes |
| Comp strategy (detail+insights) | Option C — inherit direction contract, no new comps; critique after implementation |
| Rendering mode | SSG `force-static` on all routes (ADR 015) |
| Test run timing | Written alongside code; **not executed until user reviews the implementation** |
