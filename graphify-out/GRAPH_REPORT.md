# Graph Report - nextjs-vanch-website  (2026-09-13)

## Corpus Check
- 314 files · ~140,563 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1632 nodes · 2374 edges · 168 communities (128 shown, 25 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 48 edges (avg confidence: 0.83)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `92f85e6f`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- ADR Tag Taxonomy (canonical tags, merge history, authoring rules)
- HiveMQ Edge — Frontend Architecture for Industrial IoT
- ClassificationHeader.tsx
- CLAUDE.md Project Constitution
- adr.schema.json
- insight.schema.json
- package.json
- education.schema.json
- devDependencies
- react
- GET /users/{userId}/collections/{collectionId}/items/top — getCollectionTopItems operation
- case-study.schema.json
- commands/index.ts
- scripts
- cn
- api/zotero.ts
- skill-group.schema.json
- dependencies
- FilterInput.tsx
- citation.ts
- SectionLabel.tsx
- molecules/page.tsx
- Implementation plan
- next.config.ts
- TaxonomyPanel.tsx
- positions.ts
- compilerOptions
- AdrIndexClient.tsx
- project-utils.ts
- EraTimeline.tsx
- CareerArc.tsx
- EraColumn.tsx
- CaseStudiesBlock.tsx
- content/adr.ts
- take-snapshots.mjs
- $defs
- Project Surface — Design Investigation
- ColorSwatch.tsx
- TypeSpecimen.tsx
- Agent Guidelines: Tailwind & Token Architecture
- validate-diagrams.mjs
- content/index.ts
- HomepageScrollHandler.tsx
- properties
- Coordinates
- Period
- properties
- content.ts
- Homepage Implementation Plan — V4b R2
- CONTEXT.md Domain Vocabulary
- period.ts
- Step 4 — Responsive layout
- publication.schema.json
- properties
- $defs
- mdx-components.tsx
- validate-content.mjs
- [slug]/page.tsx
- AdrIndexClient.spec.cy.tsx
- insights.ts
- NavLink.tsx
- CI Workflow
- @vitejs/plugin-react
- adr/page.tsx
- next-intl
- projects.ts
- properties
- properties
- Homepage Surface + Lab Design System — Progress Tracker
- The Construction on Tracing Paper (Creative North Star)
- ADR 020 — Rendering Strategy for /projects/[slug]
- @playwright/test
- arc-sprinkles.ts
- position.schema.json
- $defs
- location
- handlers/zotero.ts
- items
- authors
- citation-js.d.ts
- tracker-commit-guard.mjs
- Brief
- markdown.ts
- inspect-zotero-archive.mjs
- EraBlock.tsx
- ADR Index Page Design Comp
- Cypress CT component-index.html
- Design process
- src-app-projects-slug-page-tsx.md
- server-fetch
- smoke-owncloud-proxy.mjs
- Arc geometry: mapping a year to a point on the career arc
- ChapterList.tsx
- PiwigoImagesResponse schema
- shared.schema.json
- TagList
- test-file-check.mjs
- tracker-reminder.mjs
- Spectral (Body Font)
- CVA Variant Model
- inspect-owncloud.mjs
- inspect-zotero.mjs
- lab/layout.tsx
- Game-based Auditory Learning Environments (AuditoryGames)
- title
- ProjectBase
- visibility
- doi
- key
- year
- live
- PR Flow Skill
- branch-guard.mjs
- pr-snapshots.cy.ts
- File/Document Icon SVG
- Aside.tsx
- department
- description
- organisation
- abbr
- Period
- featured
- institution
- location
- position
- publications
- slug
- status
- title
- pages
- place
- tags
- title
- type
- venue
- Entry Atomicity (all ops in entry must succeed or whole entry is undone)
- Mermaid Skill
- Domain Docs Guide
- Issue Tracker: GitHub Guide
- eslint.config.mjs
- postcss.config.mjs
- Next.js Wordmark Logo SVG
- IMS Workshop at ITS'16 (2016) — learning analytics in vocational contexts
- request.ts
- i18n.d.ts
- /comp-server slash command (start/stop/status design comp server)
- The Incline Rule (display italic vs body italic)
- Construction Graphite
- Faded Graphite
- Ghost Line
- NVL monogram favicon (SVG, ground/ink token colours)
- MyPlan — Personalisation in Lifelong Learning Environments
- plugins

## God Nodes (most connected - your core abstractions)
1. `cn()` - 35 edges
2. `next-intl` - 25 edges
3. `scripts` - 24 edges
4. `ADR Tag Taxonomy (canonical tags, merge history, authoring rules)` - 21 edges
5. `vitest` - 19 edges
6. `ADR 021 — Component Rendering Strategy and Unified Timeline Molecule for Project Surface` - 18 edges
7. `react` - 18 edges
8. `next` - 17 edges
9. `NavLink()` - 16 edges
10. `compilerOptions` - 16 edges

## Surprising Connections (you probably didn't know these)
- `Chapter 5: How I Actually Build` --semantically_similar_to--> `Spec-First Testing Approach`  [INFERRED] [semantically similar]
  src/content/case-studies/hivemq-edge--design-retro/index.mdx → PRODUCT.md
- `P3: Below-fold era cards lack hover/construction continuity` --rationale_for--> `Homepage Implementation Plan — V4b R2`  [AMBIGUOUS]
  .impeccable/critique/2026-09-07T18-41-51Z__src-app-page-tsx.md → .docs/tasks/2026-09-07-homepage-v2-surface.md
- `HiveMQ Edge — Frontend Architecture for Industrial IoT` --references--> `cypress`  [EXTRACTED]
  src/content/engineering/hivemq-edge.mdx → package.json
- `Matillion Data Productivity Cloud` --references--> `cypress`  [EXTRACTED]
  src/content/engineering/matillion.mdx → package.json
- `HiveMQ Edge — Frontend Architecture for Industrial IoT` --references--> `typescript`  [EXTRACTED]
  src/content/engineering/hivemq-edge.mdx → package.json

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **CI Testing Pipeline (four-layer testing + MSW + axe-core)** — _docs_adr_002_testing_strategy_fourlayertesting, _docs_adr_002_testing_strategy_msw, _docs_adr_002_testing_strategy_cypressct, _docs_adr_002_testing_strategy_playwrighte2e, _docs_adr_007_accessibility_testing_axecore [EXTRACTED 0.95]
- **Content Model entities (Position, Project, Publication, Case Study)** — _docs_adr_014_content_model_positionentity, _docs_adr_014_content_model_projectentity, _docs_adr_014_content_model_publicationentity, _docs_adr_012_case_study_content_architecture_casestudyentity [EXTRACTED 0.95]
- **Impeccable Workflow Agent Ensemble (asset producer, documenter, finish reviewer, manual edit applier)** — _claude_agents_impeccable_asset_producer_md_impeccable_asset_producer, _claude_agents_impeccable_documenter_md_impeccable_documenter, _claude_agents_impeccable_finish_reviewer_md_impeccable_finish_reviewer, _claude_agents_impeccable_manual_edit_applier_md_impeccable_manual_edit_applier [EXTRACTED 0.95]
- **CI/CD pipeline: validate → tests → deploy-staging → Playwright → promote-production** — _github_workflows_ci_validate, _github_workflows_ci_test_unit, _github_workflows_ci_test_component, _github_workflows_ci_test_e2e, _github_workflows_ci_deploy_staging, _github_workflows_ci_test_playwright, _github_workflows_ci_promote_production [EXTRACTED 1.00]
- **Named Design Rules of the Construction-on-Tracing-Paper System** — design_one_red_rule, design_no_decoration_rule, design_incline_rule, design_flat_by_construction_rule [EXTRACTED 1.00]
- **Design System Non-Negotiable Rules (One Red, No Decoration, Flat-by-Construction, Compass Grammar, Incline Rule)** — _claude_agents_design_director_md_one_red_rule, _claude_agents_design_director_md_no_decoration_rule, _claude_agents_design_director_md_flat_by_construction [EXTRACTED 1.00]
- **The three named design invariants of the Construction on Tracing Paper system** — design_one_red_rule, design_no_decoration_rule, design_flat_by_construction_rule [EXTRACTED 1.00]
- **AIED student-modelling and multiple-representation research lineage (Nancy ILP to LeActiveMath xOLM to DEMIST DeFT)** — src_content_research_ilp_project, src_content_research_leactivemath_xolm, src_content_research_demist_deft_framework [INFERRED 0.75]
- **OpenAPI-as-Contract Pattern Across Projects** — src_content_engineering_intrica_project, src_content_case_studies_intrica_edge_ui_index_case_study, src_content_engineering_matillion_project, src_content_engineering_hivemq_edge_project, tech_openapi [INFERRED 0.75]
- **HiveMQ Edge Project Narrative (Position → Project → Case Study)** — src_content_positions_hivemq, src_content_engineering_hivemq_edge_project, src_content_case_studies_hivemq_edge_design_retro_index_case_study [INFERRED 0.85]
- **Multi-rendering-strategy learning exercise across site sections** — _docs_adr_001_deployment_target_deploymenttarget, _docs_adr_015_lab_rendering_strategy_labrendering, _docs_adr_020_project_slug_rendering_strategy_projectrendering, docs_adr_021_component_rendering_strategy_and_unified_timeline_molecule_for_project_surface_adr_021_component_rendering_strategy_and_unified_timeline_molecule_for_project_surface [INFERRED 0.85]
- **Zotero nvl.<projectSlug> tag convention linking publications API to research projects** — src_openapi_zotero_getcollectiontopitems, src_content_research_auditorygames_project, src_content_research_calques3d_project, src_content_research_demist_project, src_content_research_explabs_project, src_content_research_ilp_project, src_content_research_leactivemath_project, src_content_research_makingstuff_project, src_content_research_mypal_project, src_content_research_myplan_project, src_content_research_safesea_project [INFERRED 0.85]
- **Next.js Engineer Quality Gates (validate, accessibility, i18n, component conventions, tailwind)** — _claude_rules_accessibility_md_accessibility_rules, _claude_rules_i18n_md_i18n_rules, _claude_rules_components_md_component_conventions, _claude_rules_tailwind_md_tailwind_rules, _claude_commands_validate_md_validate_command [INFERRED 0.95]

## Communities (168 total, 25 thin omitted)

### Community 0 - "ADR Tag Taxonomy (canonical tags, merge history, authoring rules)"
Cohesion: 0.07
Nodes (62): cPanel used for DNS-only (CNAME to Vercel), ADR 001: Deployment Target - Vercel + cPanel DNS, Vercel (primary deployment platform, free tier, GitHub auto-deploy), Cypress Component Testing (mounts components in real browser), Four-layer testing strategy (Vitest, Cypress CT, Cypress E2E, Playwright), MSW (Mock Service Worker) shared API mocking layer, Playwright full E2E against live Vercel preview, ADR 002: Testing Strategy (four-layer) (+54 more)

### Community 1 - "HiveMQ Edge — Frontend Architecture for Industrial IoT"
Cohesion: 0.06
Nodes (47): hivemq/hivemq-edge GitHub Repository, Spec-First Testing Approach, Testing Stack, cypress, typescript, Chapter 6: Where the Practice Is Now, HiveMQ Edge: A Design Retrospective, Chapter 5: How I Actually Build (+39 more)

### Community 2 - "ClassificationHeader.tsx"
Cohesion: 0.25
Nodes (7): ClassificationHeader(), ClassificationHeaderProps, PeriodStrip(), PeriodStripProps, isActiveDatum(), ProjectStatus, ProjectType

### Community 3 - "CLAUDE.md Project Constitution"
Cohesion: 0.06
Nodes (41): Comp Lifecycle (Draft → Serve → Iterate → Approve → Reference), Design Director Agent, Flat-by-Construction Rule (no box-shadow, depth from line weight only), No-Decoration Rule (every element earns its place), The One Red Rule (--color-active appears exactly once per surface), Impeccable Asset Producer Agent, Plate Production (raster asset at 1.5x comp region pixel size), DESIGN.md (recorded design system from shipped artifact) (+33 more)

### Community 4 - "adr.schema.json"
Cohesion: 0.05
Nodes (37): additionalProperties, description, format, type, $defs, TagList, description, $id (+29 more)

### Community 5 - "insight.schema.json"
Cohesion: 0.06
Nodes (32): additionalProperties, description, format, type, $defs, TagList, description, description (+24 more)

### Community 6 - "package.json"
Cohesion: 0.06
Nodes (31): name, packageManager, pnpm, onlyBuiltDependencies, private, version, ajv, @base-ui/react (+23 more)

### Community 7 - "education.schema.json"
Cohesion: 0.06
Nodes (31): additionalProperties, description, type, description, description, type, description, type (+23 more)

### Community 8 - "devDependencies"
Cohesion: 0.06
Nodes (31): devDependencies, ajv, ajv-formats, axe-core, @axe-core/playwright, cypress, cypress-axe, cypress-terminal-report (+23 more)

### Community 9 - "react"
Cohesion: 0.16
Nodes (11): react, SAMPLE_TAGS, TagFilterDrawerDemo(), TagFilterDrawerDemoProps, sampleTags, TagFilterDrawer(), TagFilterDrawerProps, TagGroup() (+3 more)

### Community 10 - "GET /users/{userId}/collections/{collectionId}/items/top — getCollectionTopItems operation"
Cohesion: 0.08
Nodes (27): Mathematics and Computers in Simulation (2010) — Calques3D/Maple theorem proving, Participatory design methodology (teachers co-design), Calques 3D — 3D Dynamic Geometry Microworld, DeFT Framework (Design, Functions, Tasks) for multiple external representations, DEMIST — Design Environment for Multi-representational Instructional Simulation Technology, Actor-Network Theory (ANT) mapping, Participatory / co-design methodology (Experience Labs), Experience Labs for Digital Health (+19 more)

### Community 11 - "case-study.schema.json"
Cohesion: 0.07
Nodes (26): additionalProperties, description, description, type, $id, description, $ref, properties (+18 more)

### Community 12 - "commands/index.ts"
Cohesion: 0.11
Nodes (15): wrapWithSection(), Chainable, Cypress, wrapWithIntl(), mockRouter, RouterWrapperOptions, wrapWithRouter(), Chainable (+7 more)

### Community 13 - "scripts"
Cohesion: 0.08
Nodes (24): scripts, build, dev, generate:types, inspect:owncloud, inspect:zotero, inspect:zotero-archive, lint (+16 more)

### Community 14 - "cn"
Cohesion: 0.16
Nodes (12): clsx, tailwind-merge, DecisionRow, MoleculeFrame(), MoleculeFrameProps, DECISIONS, ProjectTitle(), ProjectTitleProps (+4 more)

### Community 15 - "api/zotero.ts"
Cohesion: 0.15
Nodes (18): env, root, extractDoi(), extractTags(), extractVenue(), extractYear(), formatAuthors(), getAllPublications() (+10 more)

### Community 16 - "skill-group.schema.json"
Cohesion: 0.09
Nodes (21): additionalProperties, description, $id, description, type, minLength, type, description (+13 more)

### Community 17 - "dependencies"
Cohesion: 0.10
Nodes (21): dependencies, @base-ui/react, @citation-js/core, @citation-js/plugin-csl, clsx, gray-matter, @mdx-js/loader, @mdx-js/react (+13 more)

### Community 18 - "FilterInput.tsx"
Cohesion: 0.20
Nodes (6): AdrFilterBar(), AdrFilterBarProps, FilterInputDemo(), FilterInputDemoProps, FilterInput(), FilterInputProps

### Community 19 - "citation.ts"
Cohesion: 0.08
Nodes (33): @citation-js/core, @citation-js/plugin-csl, server-only, citation(), PublicationsBlock(), PublicationsBlockProps, PUB, buildAuthHeader() (+25 more)

### Community 20 - "SectionLabel.tsx"
Cohesion: 0.14
Nodes (10): metadata, NamedRuleCard(), NamedRuleCardProps, FLAT, NO_DECORATION, ONE_RED, COLOR_STRIP, metadata (+2 more)

### Community 21 - "molecules/page.tsx"
Cohesion: 0.13
Nodes (15): PropRow, PropsTable(), PropsTableProps, OPTIONAL_NO_DEFAULT, OPTIONAL_ROW, REQUIRED_ROW, ARCHIVED_DATUMS, CAREER_DOMAIN (+7 more)

### Community 22 - "Implementation plan"
Cohesion: 0.20
Nodes (10): Context for new sessions, Implementation plan, Specimen illustration — image notes, Step 0 — Schema change (prerequisite), Step 1 — Unified project resolver, Step 2 — Route file, Step 3 — Components, Step 5 — Content validation (+2 more)

### Community 23 - "next.config.ts"
Cohesion: 0.25
Nodes (7): nextConfig, ADR-0002, ADR-0003, ADR-0006, withMDX, withNextIntl, @next/mdx

### Community 24 - "TaxonomyPanel.tsx"
Cohesion: 0.25
Nodes (7): Field(), FieldProps, RoleOrFunding, BASE, TAG_LIMITS, TaxonomyPanel(), TaxonomyPanelProps

### Community 25 - "positions.ts"
Cohesion: 0.23
Nodes (13): ENGINEERING_POSITION_TYPES, getAllPositions(), getEngineeringPositions(), getPositionBySlug(), getPositionMap(), getResearchPositions(), POSITIONS_DIR, readPosition() (+5 more)

### Community 26 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 27 - "AdrIndexClient.tsx"
Cohesion: 0.23
Nodes (9): AdrIndexClientProps, AdrRegisterTable(), AdrRegisterTableProps, ADR_001, ADR_017, ADR_018, ADR_DEPRECATED, SAMPLE_ADRS (+1 more)

### Community 28 - "project-utils.ts"
Cohesion: 0.31
Nodes (6): ChronologicalNeighbours, pickChronologicalNeighbours(), sliceTags(), TagSlice, ADR-0021, ProjectResolution

### Community 29 - "EraTimeline.tsx"
Cohesion: 0.20
Nodes (10): ADR-0021, EraTimeline(), toEraEntry(), ProjectNav(), ProjectNavProps, NEXT, PREV, getAllProjectsChronological() (+2 more)

### Community 30 - "CareerArc.tsx"
Cohesion: 0.12
Nodes (7): ArcSprinkleContent, CareerArc(), CareerArcProps, ENGINEERING_SLOTS, RESEARCH_SLOTS, PROPS, SprinkleSlot

### Community 31 - "EraColumn.tsx"
Cohesion: 0.15
Nodes (12): EraColumn(), EraColumnProps, EraEntry, EraLink, ENGINEERING_PROJECTS, ENGINEERING_PROPS, RESEARCH_PROJECTS, RESEARCH_PROPS (+4 more)

### Community 32 - "CaseStudiesBlock.tsx"
Cohesion: 0.43
Nodes (5): CaseStudiesBlock(), CaseStudiesBlockProps, STUDY, caseStudyHref(), CaseStudy

### Community 33 - "content/adr.ts"
Cohesion: 0.17
Nodes (16): InsightCalloutStrip(), InsightCalloutStripProps, Adr, ADR_DIR, AdrFrontmatter, adrSlugFromNumber(), AdrStatus, getAdr() (+8 more)

### Community 34 - "take-snapshots.mjs"
Cohesion: 0.13
Nodes (10): allPngs, args, output, repoId, result, ROOT, rootDir, routes (+2 more)

### Community 35 - "$defs"
Cohesion: 0.13
Nodes (14): $ref, $defs, Coordinates, MediaAssets, ProjectLinks, TagList, description, $id (+6 more)

### Community 36 - "Project Surface — Design Investigation"
Cohesion: 0.22
Nodes (13): Homepage Comp V4b R2 — Two Ascending Arcs, Lab Design System Comp v1, The Construction on Tracing Paper (thesis), Project Detail Comp — Natural History Specimen Record, Surface Brief: /lab/design-system, Surface Brief: / (homepage), Surface Brief: /projects/[slug], ProjectNav redesign amendment (2026-09-12) (+5 more)

### Community 37 - "ColorSwatch.tsx"
Cohesion: 0.16
Nodes (10): metadata, ColorSwatch(), ColorSwatchProps, NamedRule, ACTIVE, GROUND, INK, INK_GHOST (+2 more)

### Community 38 - "TypeSpecimen.tsx"
Cohesion: 0.16
Nodes (10): BODY, DISPLAY, HEADLINE, LABEL, TITLE, SPECIMEN_CLASSES, SpecimenVariant, TypeSpecimen() (+2 more)

### Community 39 - "Agent Guidelines: Tailwind & Token Architecture"
Cohesion: 0.22
Nodes (13): Agent Guidelines: Tailwind & Token Architecture, Rule 13: Three-tier token architecture, Rule 1: Never use var() inside className, Rule 3: Never hardcode a raw colour value, Rule 4: Always use line-weight tokens for border widths, Rule 5: Stay within the type scale, Tailwind CSS & Token Architecture Review, Architecture diagnosis: partial @theme exposure is root cause (+5 more)

### Community 40 - "validate-diagrams.mjs"
Cohesion: 0.17
Nodes (10): __dirname, EXTENSIONS, getDiagramType(), ADR-0002, ADR-0003, PARSER_SUPPORTED, root, SEARCH_DIRS (+2 more)

### Community 41 - "content/index.ts"
Cohesion: 0.23
Nodes (13): vitest, CASE_STUDIES_DIR, getAllCaseStudies(), getCaseStudiesForProject(), getCaseStudyBySlug(), getCaseStudyParams(), importCaseStudyMDX(), parseFrontmatter() (+5 more)

### Community 42 - "HomepageScrollHandler.tsx"
Cohesion: 0.36
Nodes (3): HomepageScrollHandler(), useHomepageScroll(), UseHomepageScrollOptions

### Community 43 - "properties"
Cohesion: 0.15
Nodes (13): description, type, $ref, $ref, description, type, properties, description (+5 more)

### Community 44 - "Coordinates"
Cohesion: 0.15
Nodes (13): additionalProperties, properties, required, type, Coordinates, maximum, minimum, type (+5 more)

### Community 45 - "Period"
Cohesion: 0.15
Nodes (13): Period, description, oneOf, additionalProperties, description, properties, required, type (+5 more)

### Community 46 - "properties"
Cohesion: 0.19
Nodes (13): items, type, description, items, type, format, type, items (+5 more)

### Community 47 - "content.ts"
Cohesion: 0.14
Nodes (16): ENGINEERING_BASE, RESEARCH_BASE, ADR, ADRStatus, CaseStudyStatus, ChapterMeta, Coordinates, CVData (+8 more)

### Community 48 - "Homepage Implementation Plan — V4b R2"
Cohesion: 0.53
Nodes (6): Homepage Implementation Plan — V4b R2, Homepage Design Critique (2026-09-07), P0: Arc trajectory contradicts positioning statement, P1: Scroll promise not materialised, P2: Navigation is a dead end (Lab/Publications/CV unreachable), P3: Below-fold era cards lack hover/construction continuity

### Community 49 - "CONTEXT.md Domain Vocabulary"
Cohesion: 0.11
Nodes (22): Calques 3D (PhD Software), ADR (domain term), Case Study (domain term), Chapter (domain term), CV data (domain term), CONTEXT.md Domain Vocabulary, EngineeringProject (domain term), Forward Reference Convention (+14 more)

### Community 50 - "period.ts"
Cohesion: 0.24
Nodes (11): ADR-0020, PeriodRuler(), PeriodRulerProps, domain, toPercent(), assignLabelPositions(), DatumRole, deduplicateDatums() (+3 more)

### Community 51 - "Step 4 — Responsive layout"
Cohesion: 0.22
Nodes (9): Breakpoints in use (Tailwind v4), CaseStudiesBlock cards, ClassificationHeader, Period dimension line at footer, ResourceAnnotationBar, SiblingNav, Step 4 — Responsive layout, Tags in TaxonomyPanel (+1 more)

### Community 52 - "publication.schema.json"
Cohesion: 0.18
Nodes (10): additionalProperties, $defs, TagList, description, $id, required, $schema, $ref (+2 more)

### Community 53 - "properties"
Cohesion: 0.18
Nodes (11): description, type, description, type, properties, cover, gallery, slides (+3 more)

### Community 54 - "$defs"
Cohesion: 0.18
Nodes (11): $defs, MediaAssets, ProjectLinks, SlugRef, additionalProperties, type, additionalProperties, type (+3 more)

### Community 55 - "mdx-components.tsx"
Cohesion: 0.25
Nodes (6): mermaid, Mermaid(), render(), MermaidProps, ADR-0002, ADR-0003

### Community 56 - "validate-content.mjs"
Cohesion: 0.28
Nodes (8): ajv-formats, ajv, __dirname, loadSchema(), root, shared, validateDir(), validateMdxDir()

### Community 57 - "[slug]/page.tsx"
Cohesion: 0.13
Nodes (19): MESSAGE_KEY, RESOURCE_KEYS, ResourceAnnotationBar(), ResourceAnnotationBarProps, ZERO_COUNTS, generateMetadata(), getCachedPublications(), ProjectPage() (+11 more)

### Community 58 - "AdrIndexClient.spec.cy.tsx"
Cohesion: 0.13
Nodes (9): AdrIndexClient(), ADR_AUTH, ADR_DEPLOYMENT, ADR_I18N, ADR_TESTING, make(), MANY_ADRS, SAMPLE_ADRS (+1 more)

### Community 59 - "insights.ts"
Cohesion: 0.33
Nodes (10): getAllInsights(), getAllInsightTags(), getInsight(), getInsightFilenames(), getInsightSlugs(), getMostRecentInsightNumber(), InsightFrontmatter, INSIGHTS_DIR (+2 more)

### Community 60 - "NavLink.tsx"
Cohesion: 0.13
Nodes (11): next, dynamic, metadata, DesignSystemLayoutProps, dynamic, metadata, Breadcrumb(), BreadcrumbItem (+3 more)

### Community 61 - "CI Workflow"
Cohesion: 0.53
Nodes (9): CI Workflow, CI job: deploy-staging (Vercel preview), CI job: promote-production, CI job: test-component (Cypress CT + axe), CI job: test-e2e (Cypress smoke), CI job: test-playwright (vs staging), CI job: test-playwright-pr (vs PR preview), CI job: test-unit (Vitest + MSW) (+1 more)

### Community 63 - "adr/page.tsx"
Cohesion: 0.33
Nodes (8): AdrRegisterHeader(), AdrRegisterHeaderProps, AdrIndexPage(), dynamic, metadata, getAllAdrs(), getAllAdrTags(), getMostRecentAcceptedAdrNumber()

### Community 64 - "next-intl"
Cohesion: 0.06
Nodes (29): next-intl, SiteNav(), SiteNavProps, metadata, RootLayoutProps, spaceMono, spectral, stixTwoText (+21 more)

### Community 65 - "projects.ts"
Cohesion: 0.16
Nodes (19): gray-matter, IdentityBlock(), dynamic, HomePage(), generateStaticParams(), ENGINEERING_DIR, getAllEngineeringProjects(), getEngineeringProjectBySlug() (+11 more)

### Community 66 - "properties"
Cohesion: 0.22
Nodes (9): properties, slug, tags, type, description, $ref, $ref, enum (+1 more)

### Community 67 - "properties"
Cohesion: 0.22
Nodes (9): type, description, type, description, type, properties, abstract, eventName (+1 more)

### Community 68 - "Homepage Surface + Lab Design System — Progress Tracker"
Cohesion: 0.33
Nodes (7): ADR Index Comp v1 — Blueprint Revision Sheet, Implementation Plan — Homepage Surface, Lab ADR Surface — Task Plan, Homepage Surface + Lab Design System — Progress Tracker, Page-level rendering strategy decision (ADR 020, referenced), Unified timeline molecule decision — PeriodRuler/PeriodStrip (ADR 021, referenced), Surface Brief: /lab/adr

### Community 69 - "The Construction on Tracing Paper (Creative North Star)"
Cohesion: 0.33
Nodes (6): Plan — /lab/design-system, Compass-Arc Red, The Compass Grammar, The Construction on Tracing Paper (Creative North Star), Draughting Paper, The Flat-by-Construction Rule

### Community 70 - "ADR 020 — Rendering Strategy for /projects/[slug]"
Cohesion: 0.25
Nodes (7): ADR 020 — Rendering Strategy for /projects/[slug], Consequences, Context, Decision, Implementation notes, Rationale, Rendering-classification rule for `_components/`

### Community 71 - "@playwright/test"
Cohesion: 0.25
Nodes (3): ADR-0002, @axe-core/playwright, @playwright/test

### Community 72 - "arc-sprinkles.ts"
Cohesion: 0.42
Nodes (5): buildSprinkle(), pickSprinkle(), Project, extractYear(), formatPeriod()

### Community 73 - "position.schema.json"
Cohesion: 0.25
Nodes (7): additionalProperties, description, $id, required, $schema, title, type

### Community 74 - "$defs"
Cohesion: 0.25
Nodes (8): $ref, $defs, Coordinates, Period, TagList, $ref, coordinates, $ref

### Community 75 - "location"
Cohesion: 0.25
Nodes (8): type, properties, description, minLength, type, institution, location, period

### Community 76 - "handlers/zotero.ts"
Cohesion: 0.38
Nodes (4): msw, MOCK_ITEMS, zoteroHandlers, server

### Community 77 - "items"
Cohesion: 0.29
Nodes (7): additionalProperties, required, type, sites, description, items, type

### Community 78 - "authors"
Cohesion: 0.29
Nodes (7): description, items, minItems, type, minLength, type, authors

### Community 79 - "citation-js.d.ts"
Cohesion: 0.29
Nodes (3): @citation-js/core, @citation-js/plugin-csl, Cite

### Community 80 - "tracker-commit-guard.mjs"
Cohesion: 0.33
Nodes (4): data, files, hasSrcChanges, trackerStaged

### Community 81 - "Brief"
Cohesion: 0.33
Nodes (6): Brief, Content examples, Information architecture, Resources model, Route decisions (confirmed), Visual type flavour

### Community 82 - "markdown.ts"
Cohesion: 0.40
Nodes (4): remark, remark-gfm, remark-html, markdownToHtml()

### Community 83 - "inspect-zotero-archive.mjs"
Cohesion: 0.33
Nodes (5): env, root, withArchive, withChildren, without

### Community 84 - "EraBlock.tsx"
Cohesion: 0.40
Nodes (4): EraBlock(), EraBlockProps, ENGINEERING, RESEARCH

### Community 85 - "ADR Index Page Design Comp"
Cohesion: 0.40
Nodes (5): ADR Index Page Design Comp, ADR Filterable Table (18 records), ADR Insight 001 — Draft PR as Hard Agent Containment Boundary, Revision Register — Portfolio Build, Tag Filter UI (infrastructure, testing, components, i18n, accessibility, documentation, process)

### Community 86 - "Cypress CT component-index.html"
Cohesion: 0.40
Nodes (5): ADR 011 (Animation Freeze), Animation/Transition Freeze for A11y Testing, Page-Level Axe Scaffold Pattern, Cypress CT component-index.html, next-style-loader Anchor Div Requirement

### Community 87 - "Design process"
Cohesion: 0.40
Nodes (5): Challenger evaluation, Concept seed, Dealt cards (indices 5, 2, 4), Design process, My 7 structural candidates (ordered by resonance)

### Community 88 - "src-app-projects-slug-page-tsx.md"
Cohesion: 0.40
Nodes (4): Constraints, Direction Contract, Job / Task / Proof, Surface

### Community 89 - "server-fetch"
Cohesion: 0.40
Nodes (4): uvx, server-fetch, webstorm, mcp-server-fetch

### Community 90 - "smoke-owncloud-proxy.mjs"
Cohesion: 0.40
Nodes (4): base, env, root, testFiles

### Community 91 - "Arc geometry: mapping a year to a point on the career arc"
Cohesion: 0.67
Nodes (4): Arc geometry: mapping a year to a point on the career arc, yearToArcPoint algorithm (proposed), yearToSprinkleGeometry algorithm (proposed), arc-sprinkles.ts module

### Community 92 - "ChapterList.tsx"
Cohesion: 0.40
Nodes (3): ChapterItem, ChapterList(), ChapterListProps

### Community 93 - "PiwigoImagesResponse schema"
Cohesion: 0.40
Nodes (5): PiwigoDerivative schema, POST /ws.php pwg.categories.getImages operation, PiwigoImage schema, PiwigoImagesResponse schema, PiwigoPaging schema

### Community 94 - "shared.schema.json"
Cohesion: 0.40
Nodes (4): description, $id, $schema, title

### Community 95 - "TagList"
Cohesion: 0.40
Nodes (5): TagList, minLength, items, type, uniqueItems

### Community 98 - "Spectral (Body Font)"
Cohesion: 0.50
Nodes (4): Departure Mono (Label Font), The Incline Rule, Spectral (Body Font), STIX Two Text (Display Font)

### Community 99 - "CVA Variant Model"
Cohesion: 0.50
Nodes (4): Base UI Component Library, CVA Variant Model, next-intl i18n, Tailwind v4 Theme Token Layer

### Community 100 - "inspect-owncloud.mjs"
Cohesion: 0.50
Nodes (3): env, hrefs, root

### Community 101 - "inspect-zotero.mjs"
Cohesion: 0.50
Nodes (3): env, root, totalResults

### Community 104 - "Game-based Auditory Learning Environments (AuditoryGames)"
Cohesion: 0.50
Nodes (4): PLoS ONE (2014) — tinnitus gameplay engagement study, Game-based Auditory Learning Environments (AuditoryGames), Making Stuff — Tangibles and Interactive Technology, ShareIt Workshop on Shareable Interfaces for Learning (2008) — Spot-On presentation

### Community 105 - "title"
Cohesion: 0.50
Nodes (4): title, description, minLength, type

### Community 106 - "ProjectBase"
Cohesion: 0.50
Nodes (4): ProjectBase, description, required, type

### Community 107 - "visibility"
Cohesion: 0.50
Nodes (4): visibility, description, enum, type

### Community 108 - "doi"
Cohesion: 0.50
Nodes (4): description, pattern, type, doi

### Community 109 - "key"
Cohesion: 0.50
Nodes (4): description, minLength, type, key

### Community 110 - "year"
Cohesion: 0.50
Nodes (4): year, maximum, minimum, type

### Community 111 - "live"
Cohesion: 0.50
Nodes (4): description, format, type, live

### Community 112 - "PR Flow Skill"
Cohesion: 1.00
Nodes (3): PR Flow Skill, PR Snapshots Skill, PR Flow Orchestration Pattern

### Community 115 - "File/Document Icon SVG"
Cohesion: 1.00
Nodes (3): File/Document Icon SVG, Globe/World Icon SVG, Browser Window Icon SVG

### Community 117 - "department"
Cohesion: 0.67
Nodes (3): description, type, department

### Community 118 - "description"
Cohesion: 0.67
Nodes (3): description, type, description

### Community 119 - "organisation"
Cohesion: 0.67
Nodes (3): minLength, type, organisation

### Community 120 - "abbr"
Cohesion: 0.67
Nodes (3): description, type, abbr

### Community 121 - "Period"
Cohesion: 0.67
Nodes (3): Period, $ref, period

### Community 122 - "featured"
Cohesion: 0.67
Nodes (3): description, type, featured

### Community 123 - "institution"
Cohesion: 0.67
Nodes (3): description, type, institution

### Community 124 - "location"
Cohesion: 0.67
Nodes (3): description, type, location

### Community 125 - "position"
Cohesion: 0.67
Nodes (3): description, $ref, position

### Community 126 - "publications"
Cohesion: 0.67
Nodes (3): publications, description, type

### Community 127 - "slug"
Cohesion: 0.67
Nodes (3): slug, description, $ref

### Community 128 - "status"
Cohesion: 0.67
Nodes (3): status, enum, type

### Community 129 - "title"
Cohesion: 0.67
Nodes (3): title, minLength, type

### Community 130 - "pages"
Cohesion: 0.67
Nodes (3): description, type, pages

### Community 131 - "place"
Cohesion: 0.67
Nodes (3): description, type, place

### Community 132 - "tags"
Cohesion: 0.67
Nodes (3): tags, description, $ref

### Community 133 - "title"
Cohesion: 0.67
Nodes (3): title, minLength, type

### Community 134 - "type"
Cohesion: 0.67
Nodes (3): type, enum, type

### Community 135 - "venue"
Cohesion: 0.67
Nodes (3): venue, description, type

## Ambiguous Edges - Review These
- `Homepage Implementation Plan — V4b R2` → `P3: Below-fold era cards lack hover/construction continuity`  [AMBIGUOUS]
  .docs/tasks/2026-09-07-homepage-v2-surface.md · relation: rationale_for

## Knowledge Gaps
- **779 isolated node(s):** `ClassificationHeaderProps`, `PeriodStripProps`, `AsideProps`, `MountParams`, `ProjectTitleProps` (+774 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 895 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **25 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `Homepage Implementation Plan — V4b R2` and `P3: Below-fold era cards lack hover/construction continuity`?**
  _Edge tagged AMBIGUOUS (relation: rationale_for) - confidence is low._
- **Why does `next` connect `NavLink.tsx` to `next-intl`, `projects.ts`, `CaseStudiesBlock.tsx`, `package.json`, `lab/layout.tsx`, `next.config.ts`, `[slug]/page.tsx`, `EraTimeline.tsx`, `EraColumn.tsx`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **Why does `react` connect `react` to `next-intl`, `projects.ts`, `package.json`, `HomepageScrollHandler.tsx`, `commands/index.ts`, `FilterInput.tsx`, `EraBlock.tsx`, `mdx-components.tsx`, `AdrIndexClient.tsx`, `NavLink.tsx`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **Why does `next-intl` connect `next-intl` to `CaseStudiesBlock.tsx`, `ClassificationHeader.tsx`, `package.json`, `react`, `commands/index.ts`, `cn`, `FilterInput.tsx`, `citation.ts`, `period.ts`, `TaxonomyPanel.tsx`, `[slug]/page.tsx`, `AdrIndexClient.tsx`, `NavLink.tsx`, `EraTimeline.tsx`?**
  _High betweenness centrality (0.026) - this node is a cross-community bridge._
- **What connects `ClassificationHeaderProps`, `PeriodStripProps`, `AsideProps` to the rest of the system?**
  _779 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `ADR Tag Taxonomy (canonical tags, merge history, authoring rules)` be split into smaller, more focused modules?**
  _Cohesion score 0.06502816180235535 - nodes in this community are weakly interconnected._
- **Should `HiveMQ Edge — Frontend Architecture for Industrial IoT` be split into smaller, more focused modules?**
  _Cohesion score 0.05612244897959184 - nodes in this community are weakly interconnected._