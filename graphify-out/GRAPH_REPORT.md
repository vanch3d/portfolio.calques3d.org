# Graph Report - nextjs-vanch-website  (2026-09-12)

## Corpus Check
- 270 files · ~129,969 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1380 nodes · 1834 edges · 149 communities (112 shown, 22 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 45 edges (avg confidence: 0.81)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `494091e5`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- content/adr.ts
- period.ts
- TagFilterDrawer.tsx
- ADR 005 — Claude Code Project Configuration Structure
- adr.schema.json
- content.ts
- insight.schema.json
- education.schema.json
- Next.js Engineer Agent
- package.json
- devDependencies
- case-study.schema.json
- commands/index.ts
- scripts
- [slug]/page.tsx
- NavLink.tsx
- DESIGN.md — design system seed: Construction on Tracing Paper
- skill-group.schema.json
- dependencies
- citation.ts
- compilerOptions
- EraColumn.tsx
- api/zotero.ts
- CareerArc.tsx
- take-snapshots.mjs
- ColorSwatch.tsx
- TypeSpecimen.tsx
- validate-diagrams.mjs
- properties
- Coordinates
- Period
- properties
- CLAUDE.md — project constitution for Claude Code
- Open Learner Modelling (OLM)
- molecules/page.tsx
- $defs
- publication.schema.json
- properties
- $defs
- AdrIndexClient.tsx
- atoms/page.tsx
- properties
- properties
- next.config.ts
- @playwright/test
- position.schema.json
- $defs
- location
- Implementation plan
- items
- authors
- citation-js.d.ts
- tracker-commit-guard.mjs
- markdown.ts
- inspect-zotero-archive.mjs
- arc-sprinkles.ts
- app/layout.tsx
- ADR Index Page Design Comp
- OpenAPI as reverse-engineered documentation from traffic observation
- server-fetch
- smoke-owncloud-proxy.mjs
- react
- shared.schema.json
- TagList
- test-file-check.mjs
- tracker-reminder.mjs
- Portfolio Internal API — OpenAPI spec
- Personalised pathway recommendation for lifelong learning
- inspect-owncloud.mjs
- inspect-zotero.mjs
- mdx-components.tsx
- title
- ProjectBase
- visibility
- doi
- key
- year
- live
- branch-guard.mjs
- Graph-canvas paradigm for industrial IoT configuration UI
- cypress.config.ts
- pr-snapshots.cy.ts
- File/Document Icon SVG
- Next.js Wordmark Logo SVG
- cn
- department
- description
- organisation
- abbr
- featured
- institution
- location
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
- ADR 009 — Three-Layer Design Token Architecture
- Auditory Discrimination Therapy delivered via casual games
- Tangibles and physical computing for embodied learning
- eslint.config.mjs
- pnpm
- postcss.config.mjs
- @vitejs/plugin-react
- request.ts
- i18n.d.ts
- README.md — repository readme
- Almotech — Enterprise Web Applications
- HubSpot CRM — Frontend Engineering
- Piwigo JSON API — portfolio subset OpenAPI spec
- plugins
- positions.ts
- content/index.ts
- app/page.tsx
- pdf.ts
- validate-content.mjs
- handlers/zotero.ts
- ADR 021 — Component Rendering Strategy and Unified Timeline Molecule for Project Surface
- AdrIndexClient.spec.cy.tsx
- ADR 020 — Rendering Strategy for /projects/[slug]
- src-app-projects-slug-page-tsx.md
- Period
- ChapterList.tsx
- position
- Aside.tsx
- SectionLabel.tsx
- EraBlock.tsx
- AdrIndexClient

## God Nodes (most connected - your core abstractions)
1. `cn()` - 27 edges
2. `scripts` - 24 edges
3. `compilerOptions` - 16 edges
4. `vitest` - 16 edges
5. `react` - 15 edges
6. `NavLink()` - 13 edges
7. `next` - 13 edges
8. `Next.js Engineer Agent` - 12 edges
9. `DESIGN.md — design system seed: Construction on Tracing Paper` - 11 edges
10. `next-intl` - 10 edges

## Surprising Connections (you probably didn't know these)
- `SSG for /lab routes — force-static; content frozen per build (ADR 015)` --semantically_similar_to--> `The Flat-by-Construction Rule — no shadows; depth via line weight`  [INFERRED] [semantically similar]
  .docs/tasks/2026-09-04-lab-adr-surface.md → DESIGN.md
- `PR Flow Orchestration Pattern` --semantically_similar_to--> `Agentic Code Review Sub-agent (vanch-code-reviewer)`  [INFERRED] [semantically similar]
  .claude/skills/pr-flow/SKILL.md → .docs/adr/010-agentic-workflow.md
- `PRODUCT.md — product purpose, users, positioning, and constraints` --references--> `DESIGN.md — design system seed: Construction on Tracing Paper`  [INFERRED]
  PRODUCT.md → DESIGN.md
- `ADR 005 — Claude Code Project Configuration Structure` --references--> `Mermaid Skill`  [EXTRACTED]
  .docs/adr/005-claude-project-config.md → .claude/skills/mermaid/SKILL.md
- `Tailwind Agent Guidelines — 13 styling rules for agents` --conceptually_related_to--> `The One Red Rule — compass-arc red appears exactly once per surface`  [INFERRED]
  .docs/engineering/2026-09-05-tailwind-agent-guidelines.md → DESIGN.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Design system enforcement triad: DESIGN.md defines rules, token-review audits violations, agent-guidelines enforces in implementation** — design_md, _docs_engineering_2026_09_05_tailwind_token_review_md, _docs_engineering_2026_09_05_tailwind_agent_guidelines_md [EXTRACTED 0.95]
- **Agentic PR Pipeline (pr-flow skill + pr-snapshots + code review + draft gate)** — _claude_skills_pr_flow_skill_md, _claude_skills_pr_snapshots_skill_md, _docs_adr_016_pr_snapshot_review_workflow_md, _docs_adr_010_agentic_workflow_md [EXTRACTED 0.95]
- **Surface brief → approved comp → task plan — the comp-led development workflow for /lab/adr** — _impeccable_surfaces_src_app_lab_adr_page_tsx_md, _docs_tasks_2026_09_04_lab_adr_surface_md, _docs_tasks_tracker_md [EXTRACTED 0.95]
- **Testing and Quality Gate System (Cypress CT + E2E + Playwright + axe-core)** — _docs_adr_002_testing_strategy_md, _docs_adr_007_accessibility_testing_md, _docs_adr_008_ci_pipeline_md, _docs_adr_011_animation_accessibility_testing_md [EXTRACTED 0.95]
- **Impeccable Workflow Agent Ensemble (asset producer, documenter, finish reviewer, manual edit applier)** — _claude_agents_impeccable_asset_producer_md_impeccable_asset_producer, _claude_agents_impeccable_documenter_md_impeccable_documenter, _claude_agents_impeccable_finish_reviewer_md_impeccable_finish_reviewer, _claude_agents_impeccable_manual_edit_applier_md_impeccable_manual_edit_applier [EXTRACTED 0.95]
- **Design System Non-Negotiable Rules (One Red, No Decoration, Flat-by-Construction, Compass Grammar, Incline Rule)** — _claude_agents_design_director_md_one_red_rule, _claude_agents_design_director_md_no_decoration_rule, _claude_agents_design_director_md_flat_by_construction [EXTRACTED 1.00]
- **Personalised adaptive learning research: MyPlan, myPAL, LeActiveMath** — src_content_research_myplan, src_content_research_mypal, src_content_research_leactivemath [INFERRED 0.75]
- **Learner modelling research thread: ILP, LeActiveMath OLM, SAFeSEA** — src_content_research_ilp, src_content_research_leactivemath, src_content_research_safesea [INFERRED 0.80]
- **CI pipeline: validate → unit (Vitest) → CT (Cypress) → E2E (Cypress) → staging → Playwright → promote** — _github_workflows_ci_yml, cypress_support_component_index_html, contributing_md [INFERRED 0.85]
- **Content Model + Rendering Strategy System (ADR 012, 013, 014, 015, 019)** — _docs_adr_012_case_study_content_architecture_md, _docs_adr_014_content_model_md, _docs_adr_015_lab_rendering_strategy_md, _docs_adr_019_lab_content_pipeline_md [INFERRED 0.85]
- **OpenAPI as shared contract across Intrica, Matillion, and HiveMQ Edge engineering engagements** — src_content_engineering_intrica, src_content_engineering_matillion, src_content_engineering_hivemq_edge [INFERRED 0.85]
- **Next.js Engineer Quality Gates (validate, accessibility, i18n, component conventions, tailwind)** — _claude_rules_accessibility_md_accessibility_rules, _claude_rules_i18n_md_i18n_rules, _claude_rules_components_md_component_conventions, _claude_rules_tailwind_md_tailwind_rules, _claude_commands_validate_md_validate_command [INFERRED 0.95]

## Communities (149 total, 22 thin omitted)

### Community 0 - "content/adr.ts"
Cohesion: 0.08
Nodes (42): AdrRegisterHeader(), AdrRegisterHeaderProps, AdrRegisterTable(), AdrRegisterTableProps, ADR_001, ADR_017, ADR_018, ADR_DEPRECATED (+34 more)

### Community 1 - "period.ts"
Cohesion: 0.28
Nodes (11): PeriodRuler(), PeriodRulerProps, domain, toPercent(), assignLabelPositions(), DatumRole, deduplicateDatums(), isActiveDatum() (+3 more)

### Community 2 - "TagFilterDrawer.tsx"
Cohesion: 0.16
Nodes (10): SAMPLE_TAGS, TagFilterDrawerDemo(), TagFilterDrawerDemoProps, sampleTags, TagFilterDrawer(), TagFilterDrawerProps, TagGroup(), TagGroupProps (+2 more)

### Community 3 - "ADR 005 — Claude Code Project Configuration Structure"
Cohesion: 0.07
Nodes (43): Mermaid Skill, PR Flow Skill, PR Snapshots Skill, ADR 001 — Deployment Target: Vercel + cPanel DNS, ADR 002 — Testing Strategy, ADR 003 — API Layer and Data Fetching Strategy, ADR 004 — Component Structure and File Naming Conventions, ADR 005 — Claude Code Project Configuration Structure (+35 more)

### Community 4 - "adr.schema.json"
Cohesion: 0.05
Nodes (37): additionalProperties, description, format, type, $defs, TagList, description, $id (+29 more)

### Community 5 - "content.ts"
Cohesion: 0.09
Nodes (24): vitest, CV_DIR, getEducation(), getSkills(), groupByYear(), ADR, ADRStatus, CaseStudy (+16 more)

### Community 6 - "insight.schema.json"
Cohesion: 0.06
Nodes (32): additionalProperties, description, format, type, $defs, TagList, description, description (+24 more)

### Community 7 - "education.schema.json"
Cohesion: 0.06
Nodes (31): additionalProperties, description, type, description, description, type, description, type (+23 more)

### Community 8 - "Next.js Engineer Agent"
Cohesion: 0.08
Nodes (31): Comp Lifecycle (Draft → Serve → Iterate → Approve → Reference), Design Director Agent, Flat-by-Construction Rule (no box-shadow, depth from line weight only), No-Decoration Rule (every element earns its place), The One Red Rule (--color-active appears exactly once per surface), Impeccable Asset Producer Agent, Plate Production (raster asset at 1.5x comp region pixel size), DESIGN.md (recorded design system from shipped artifact) (+23 more)

### Community 9 - "package.json"
Cohesion: 0.06
Nodes (30): name, packageManager, private, version, ajv, @base-ui/react, cypress-terminal-report, eslint (+22 more)

### Community 10 - "devDependencies"
Cohesion: 0.06
Nodes (31): devDependencies, ajv, ajv-formats, axe-core, @axe-core/playwright, cypress, cypress-axe, cypress-terminal-report (+23 more)

### Community 11 - "case-study.schema.json"
Cohesion: 0.07
Nodes (26): additionalProperties, description, description, type, $id, description, $ref, properties (+18 more)

### Community 12 - "commands/index.ts"
Cohesion: 0.11
Nodes (15): wrapWithSection(), Chainable, Cypress, wrapWithIntl(), mockRouter, RouterWrapperOptions, wrapWithRouter(), Chainable (+7 more)

### Community 13 - "scripts"
Cohesion: 0.08
Nodes (24): scripts, build, dev, generate:types, inspect:owncloud, inspect:zotero, inspect:zotero-archive, lint (+16 more)

### Community 14 - "[slug]/page.tsx"
Cohesion: 0.19
Nodes (17): ADR-0020, generateMetadata(), generateStaticParams(), getCachedPublications(), ProjectPage(), ProjectPageParams, ProjectPageProps, ENGINEERING_DIR (+9 more)

### Community 15 - "NavLink.tsx"
Cohesion: 0.15
Nodes (7): dynamic, metadata, DesignSystemLayoutProps, dynamic, metadata, NavLink(), NavLinkProps

### Community 16 - "DESIGN.md — design system seed: Construction on Tracing Paper"
Cohesion: 0.14
Nodes (22): Tailwind Agent Guidelines — 13 styling rules for agents, Tailwind Token Review — exhaustive audit of token/class anti-patterns, Arc Year-to-Point — Bézier geometry research note for career arc sprinkles, Homepage Surface Implementation Plan — Track A/B/C/D/E parallel tracks, /lab/design-system Implementation Plan — five-section documentation surface, Lab ADR Surface Task Plan — /lab/adr and /lab/insights routes, Homepage V4b R2 Implementation Plan — two-arc redesign component tasks, TRACKER.md — Homepage + Lab Design System progress tracker (+14 more)

### Community 17 - "skill-group.schema.json"
Cohesion: 0.09
Nodes (21): additionalProperties, description, $id, description, type, minLength, type, description (+13 more)

### Community 18 - "dependencies"
Cohesion: 0.10
Nodes (21): dependencies, @base-ui/react, @citation-js/core, @citation-js/plugin-csl, clsx, gray-matter, @mdx-js/loader, @mdx-js/react (+13 more)

### Community 19 - "citation.ts"
Cohesion: 0.20
Nodes (15): @citation-js/core, @citation-js/plugin-csl, CITATION_STYLES, CitationStyle, ensureStyleRegistered(), formatCitation(), formatCitations(), getActiveCitationStyle() (+7 more)

### Community 20 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 21 - "EraColumn.tsx"
Cohesion: 0.11
Nodes (16): next, EraColumn(), EraColumnProps, EraEntry, EraLink, ENGINEERING_POSITIONS, ENGINEERING_PROPS, RESEARCH_POSITIONS (+8 more)

### Community 22 - "api/zotero.ts"
Cohesion: 0.16
Nodes (17): env, root, extractDoi(), extractTags(), extractVenue(), extractYear(), formatAuthors(), getAllPublications() (+9 more)

### Community 23 - "CareerArc.tsx"
Cohesion: 0.12
Nodes (7): ArcSprinkleContent, CareerArc(), CareerArcProps, ENGINEERING_SLOTS, RESEARCH_SLOTS, PROPS, SprinkleSlot

### Community 24 - "take-snapshots.mjs"
Cohesion: 0.14
Nodes (11): allPngs, args, output, repoId, result, ROOT, rootDir, routes (+3 more)

### Community 25 - "ColorSwatch.tsx"
Cohesion: 0.16
Nodes (10): metadata, ColorSwatch(), ColorSwatchProps, NamedRule, ACTIVE, GROUND, INK, INK_GHOST (+2 more)

### Community 26 - "TypeSpecimen.tsx"
Cohesion: 0.16
Nodes (10): BODY, DISPLAY, HEADLINE, LABEL, TITLE, SPECIMEN_CLASSES, SpecimenVariant, TypeSpecimen() (+2 more)

### Community 27 - "validate-diagrams.mjs"
Cohesion: 0.18
Nodes (11): __dirname, EXTENSIONS, getDiagramType(), ADR-0002, ADR-0003, PARSER_SUPPORTED, root, SEARCH_DIRS (+3 more)

### Community 28 - "properties"
Cohesion: 0.15
Nodes (13): description, type, $ref, $ref, description, type, properties, description (+5 more)

### Community 29 - "Coordinates"
Cohesion: 0.15
Nodes (13): additionalProperties, properties, required, type, Coordinates, maximum, minimum, type (+5 more)

### Community 30 - "Period"
Cohesion: 0.15
Nodes (13): Period, description, oneOf, additionalProperties, description, properties, required, type (+5 more)

### Community 31 - "properties"
Cohesion: 0.19
Nodes (13): items, type, description, items, type, format, type, items (+5 more)

### Community 32 - "CLAUDE.md — project constitution for Claude Code"
Cohesion: 0.18
Nodes (12): Domain Docs — agent codebase orientation guide, Issue Tracker — GitHub Issues / PR workflow guide, Insight 001 — Draft PR as Hard Agent Containment Boundary, CI workflow — validate → unit → CT → E2E → staging → Playwright → promote, AGENTS.md — Next.js breaking-changes warning for agents, CLAUDE.md — project constitution for Claude Code, Comp-Led Development — no coding without approved comp in .docs/design/comps/, Draft PR as Hard Agent Containment Boundary — platform-enforced merge block (+4 more)

### Community 33 - "Open Learner Modelling (OLM)"
Cohesion: 0.17
Nodes (12): DeFT Framework (Design, Functions, Tasks) for multiple external representations, Extractive summarisation for formative essay feedback, ILP-based automatic student misconception modelling, Open Learner Modelling (OLM), Participatory design with domain experts, Pre-technology knowledge elicitation in co-design, Calques 3D — A 3D Dynamic Geometry Microworld, DEMIST — Design Environment for Multi-representational Instructional Simulation Technology (+4 more)

### Community 34 - "molecules/page.tsx"
Cohesion: 0.13
Nodes (15): PropRow, PropsTable(), PropsTableProps, OPTIONAL_NO_DEFAULT, OPTIONAL_ROW, REQUIRED_ROW, ARCHIVED_DATUMS, CAREER_DOMAIN (+7 more)

### Community 35 - "$defs"
Cohesion: 0.13
Nodes (14): $ref, $defs, Coordinates, MediaAssets, ProjectLinks, TagList, description, $id (+6 more)

### Community 36 - "publication.schema.json"
Cohesion: 0.18
Nodes (10): additionalProperties, $defs, TagList, description, $id, required, $schema, $ref (+2 more)

### Community 37 - "properties"
Cohesion: 0.18
Nodes (11): description, type, description, type, properties, cover, gallery, slides (+3 more)

### Community 38 - "$defs"
Cohesion: 0.18
Nodes (11): $defs, MediaAssets, ProjectLinks, SlugRef, additionalProperties, type, additionalProperties, type (+3 more)

### Community 39 - "AdrIndexClient.tsx"
Cohesion: 0.36
Nodes (4): next-intl, AdrFilterBar(), AdrFilterBarProps, AdrIndexClientProps

### Community 40 - "atoms/page.tsx"
Cohesion: 0.24
Nodes (6): metadata, NamedRuleCard(), NamedRuleCardProps, FLAT, NO_DECORATION, ONE_RED

### Community 41 - "properties"
Cohesion: 0.22
Nodes (9): properties, slug, tags, type, description, $ref, $ref, enum (+1 more)

### Community 42 - "properties"
Cohesion: 0.22
Nodes (9): type, description, type, description, type, properties, abstract, eventName (+1 more)

### Community 43 - "next.config.ts"
Cohesion: 0.25
Nodes (7): nextConfig, ADR-0002, ADR-0003, ADR-0006, withMDX, withNextIntl, @next/mdx

### Community 44 - "@playwright/test"
Cohesion: 0.25
Nodes (3): ADR-0002, @axe-core/playwright, @playwright/test

### Community 45 - "position.schema.json"
Cohesion: 0.25
Nodes (7): additionalProperties, description, $id, required, $schema, title, type

### Community 46 - "$defs"
Cohesion: 0.25
Nodes (8): $ref, $defs, Coordinates, Period, TagList, $ref, coordinates, $ref

### Community 47 - "location"
Cohesion: 0.25
Nodes (8): type, properties, description, minLength, type, institution, location, period

### Community 48 - "Implementation plan"
Cohesion: 0.06
Nodes (34): Breakpoints in use (Tailwind v4), Brief, CaseStudiesBlock cards, Challenger evaluation, ClassificationHeader, Concept seed, Content examples, Context for new sessions (+26 more)

### Community 49 - "items"
Cohesion: 0.29
Nodes (7): additionalProperties, required, type, sites, description, items, type

### Community 50 - "authors"
Cohesion: 0.29
Nodes (7): description, items, minItems, type, minLength, type, authors

### Community 51 - "citation-js.d.ts"
Cohesion: 0.29
Nodes (3): @citation-js/core, @citation-js/plugin-csl, Cite

### Community 52 - "tracker-commit-guard.mjs"
Cohesion: 0.33
Nodes (4): data, files, hasSrcChanges, trackerStaged

### Community 53 - "markdown.ts"
Cohesion: 0.40
Nodes (4): remark, remark-gfm, remark-html, markdownToHtml()

### Community 54 - "inspect-zotero-archive.mjs"
Cohesion: 0.33
Nodes (5): env, root, withArchive, withChildren, without

### Community 55 - "arc-sprinkles.ts"
Cohesion: 0.33
Nodes (8): buildSprinkle(), pickSprinkle(), Project, extractYear(), formatPeriod(), EngineeringProject, ProjectBase, ResearchProject

### Community 56 - "app/layout.tsx"
Cohesion: 0.29
Nodes (5): metadata, RootLayoutProps, spaceMono, spectral, stixTwoText

### Community 57 - "ADR Index Page Design Comp"
Cohesion: 0.40
Nodes (5): ADR Index Page Design Comp, ADR Filterable Table (18 records), ADR Insight 001 — Draft PR as Hard Agent Containment Boundary, Revision Register — Portfolio Build, Tag Filter UI (infrastructure, testing, components, i18n, accessibility, documentation, process)

### Community 58 - "OpenAPI as reverse-engineered documentation from traffic observation"
Cohesion: 0.50
Nodes (5): OpenAPI as reverse-engineered documentation from traffic observation, OpenAPI-first development workflow, Building a Form-Driven UI Over an Undocumented API (case study), Intrica Ltd (engineering), Matillion Data Productivity Cloud

### Community 59 - "server-fetch"
Cohesion: 0.40
Nodes (4): uvx, server-fetch, webstorm, mcp-server-fetch

### Community 60 - "smoke-owncloud-proxy.mjs"
Cohesion: 0.40
Nodes (4): base, env, root, testFiles

### Community 61 - "react"
Cohesion: 0.29
Nodes (5): react, FilterInputDemo(), FilterInputDemoProps, FilterInput(), FilterInputProps

### Community 62 - "shared.schema.json"
Cohesion: 0.40
Nodes (4): description, $id, $schema, title

### Community 63 - "TagList"
Cohesion: 0.40
Nodes (5): TagList, minLength, items, type, uniqueItems

### Community 66 - "Portfolio Internal API — OpenAPI spec"
Cohesion: 0.50
Nodes (4): On-demand ISR revalidation via API route, Zotero project tag convention nvl.<projectSlug>, Portfolio Internal API — OpenAPI spec, Zotero API v3 — portfolio subset OpenAPI spec

### Community 67 - "Personalised pathway recommendation for lifelong learning"
Cohesion: 0.50
Nodes (4): Personalised pathway recommendation for lifelong learning, xAPI and Learning Analytics infrastructure for personalised feedback, myPAL — Personalised and Adaptive Learning Mentoring for Medical Students, MyPlan — Personalisation in Lifelong Learning Environments

### Community 68 - "inspect-owncloud.mjs"
Cohesion: 0.50
Nodes (3): env, hrefs, root

### Community 69 - "inspect-zotero.mjs"
Cohesion: 0.50
Nodes (3): env, root, totalResults

### Community 70 - "mdx-components.tsx"
Cohesion: 0.28
Nodes (6): mermaid, Mermaid(), render(), MermaidProps, ADR-0002, ADR-0003

### Community 71 - "title"
Cohesion: 0.50
Nodes (4): title, description, minLength, type

### Community 72 - "ProjectBase"
Cohesion: 0.50
Nodes (4): ProjectBase, description, required, type

### Community 73 - "visibility"
Cohesion: 0.50
Nodes (4): visibility, description, enum, type

### Community 74 - "doi"
Cohesion: 0.50
Nodes (4): description, pattern, type, doi

### Community 75 - "key"
Cohesion: 0.50
Nodes (4): description, minLength, type, key

### Community 76 - "year"
Cohesion: 0.50
Nodes (4): year, maximum, minimum, type

### Community 77 - "live"
Cohesion: 0.50
Nodes (4): description, format, type, live

### Community 79 - "Graph-canvas paradigm for industrial IoT configuration UI"
Cohesion: 1.00
Nodes (3): Graph-canvas paradigm for industrial IoT configuration UI, HiveMQ Edge: A Design Retrospective (case study), HiveMQ Edge — Frontend Architecture for Industrial IoT

### Community 82 - "File/Document Icon SVG"
Cohesion: 1.00
Nodes (3): File/Document Icon SVG, Globe/World Icon SVG, Browser Window Icon SVG

### Community 83 - "Next.js Wordmark Logo SVG"
Cohesion: 1.00
Nodes (3): Next.js Wordmark Logo SVG, Vercel Logo SVG (triangle mark), Site Favicon SVG (NVL monogram)

### Community 84 - "cn"
Cohesion: 0.20
Nodes (10): clsx, tailwind-merge, DecisionRow, MoleculeFrame(), MoleculeFrameProps, DECISIONS, PeriodStrip(), PeriodStripProps (+2 more)

### Community 85 - "department"
Cohesion: 0.67
Nodes (3): description, type, department

### Community 86 - "description"
Cohesion: 0.67
Nodes (3): description, type, description

### Community 87 - "organisation"
Cohesion: 0.67
Nodes (3): minLength, type, organisation

### Community 88 - "abbr"
Cohesion: 0.67
Nodes (3): description, type, abbr

### Community 89 - "featured"
Cohesion: 0.67
Nodes (3): description, type, featured

### Community 90 - "institution"
Cohesion: 0.67
Nodes (3): description, type, institution

### Community 91 - "location"
Cohesion: 0.67
Nodes (3): description, type, location

### Community 92 - "publications"
Cohesion: 0.67
Nodes (3): publications, description, type

### Community 93 - "slug"
Cohesion: 0.67
Nodes (3): slug, description, $ref

### Community 94 - "status"
Cohesion: 0.67
Nodes (3): status, enum, type

### Community 95 - "title"
Cohesion: 0.67
Nodes (3): title, minLength, type

### Community 96 - "pages"
Cohesion: 0.67
Nodes (3): description, type, pages

### Community 97 - "place"
Cohesion: 0.67
Nodes (3): description, type, place

### Community 98 - "tags"
Cohesion: 0.67
Nodes (3): tags, description, $ref

### Community 99 - "title"
Cohesion: 0.67
Nodes (3): title, minLength, type

### Community 100 - "type"
Cohesion: 0.67
Nodes (3): type, enum, type

### Community 101 - "venue"
Cohesion: 0.67
Nodes (3): venue, description, type

### Community 131 - "positions.ts"
Cohesion: 0.22
Nodes (15): EraTimeline(), toEraEntry(), ENGINEERING_POSITION_TYPES, getAllPositions(), getEngineeringPositions(), getPositionBySlug(), getPositionMap(), getResearchPositions() (+7 more)

### Community 132 - "content/index.ts"
Cohesion: 0.26
Nodes (12): CASE_STUDIES_DIR, getAllCaseStudies(), getCaseStudiesForProject(), getCaseStudyBySlug(), getCaseStudyParams(), importCaseStudyMDX(), parseFrontmatter(), getAllResearchProjects() (+4 more)

### Community 133 - "app/page.tsx"
Cohesion: 0.17
Nodes (8): HomepageScrollHandler(), IdentityBlock(), SiteNav(), SiteNavProps, dynamic, HomePage(), useHomepageScroll(), UseHomepageScrollOptions

### Community 134 - "pdf.ts"
Cohesion: 0.22
Nodes (12): server-only, buildAuthHeader(), buildFileUrl(), getConfig(), OwncloudConfig, ENV, PdfResolutionResult, resolvePdfSource() (+4 more)

### Community 135 - "validate-content.mjs"
Cohesion: 0.24
Nodes (9): ajv-formats, gray-matter, ajv, __dirname, loadSchema(), root, shared, validateDir() (+1 more)

### Community 136 - "handlers/zotero.ts"
Cohesion: 0.38
Nodes (4): msw, MOCK_ITEMS, zoteroHandlers, server

### Community 137 - "ADR 021 — Component Rendering Strategy and Unified Timeline Molecule for Project Surface"
Cohesion: 0.18
Nodes (10): ADR 021 — Component Rendering Strategy and Unified Timeline Molecule for Project Surface, Alternatives Considered, Consequences, Context, Decision, Implementation Plan, Part 1 — Rendering-strategy rule, Part 2 — Unified timeline molecule (+2 more)

### Community 138 - "AdrIndexClient.spec.cy.tsx"
Cohesion: 0.20
Nodes (8): ADR_AUTH, ADR_DEPLOYMENT, ADR_I18N, ADR_TESTING, make(), MANY_ADRS, SAMPLE_ADRS, TAGS

### Community 140 - "ADR 020 — Rendering Strategy for /projects/[slug]"
Cohesion: 0.25
Nodes (7): ADR 020 — Rendering Strategy for /projects/[slug], Consequences, Context, Decision, Implementation notes, Rationale, Rendering-classification rule for `_components/`

### Community 141 - "src-app-projects-slug-page-tsx.md"
Cohesion: 0.40
Nodes (4): Constraints, Direction Contract, Job / Task / Proof, Surface

### Community 142 - "Period"
Cohesion: 0.67
Nodes (3): Period, $ref, period

### Community 143 - "ChapterList.tsx"
Cohesion: 0.40
Nodes (3): ChapterItem, ChapterList(), ChapterListProps

### Community 144 - "position"
Cohesion: 0.67
Nodes (3): description, $ref, position

### Community 146 - "SectionLabel.tsx"
Cohesion: 0.27
Nodes (4): COLOR_STRIP, metadata, SectionLabel(), SectionLabelProps

### Community 147 - "EraBlock.tsx"
Cohesion: 0.40
Nodes (4): EraBlock(), EraBlockProps, ENGINEERING, RESEARCH

## Knowledge Gaps
- **688 isolated node(s):** `Context`, `Decision`, `Rationale`, `Consequences`, `Rendering-classification rule for `_components/`` (+683 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 799 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **22 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `EraColumn.tsx` to `positions.ts`, `app/page.tsx`, `package.json`, `next.config.ts`, `[slug]/page.tsx`, `NavLink.tsx`, `app/layout.tsx`?**
  _High betweenness centrality (0.041) - this node is a cross-community bridge._
- **Why does `scripts` connect `scripts` to `package.json`?**
  _High betweenness centrality (0.032) - this node is a cross-community bridge._
- **Why does `react` connect `react` to `TagFilterDrawer.tsx`, `app/page.tsx`, `mdx-components.tsx`, `AdrIndexClient.tsx`, `package.json`, `commands/index.ts`, `[slug]/page.tsx`, `NavLink.tsx`, `EraBlock.tsx`?**
  _High betweenness centrality (0.032) - this node is a cross-community bridge._
- **What connects `Context`, `Decision`, `Rationale` to the rest of the system?**
  _688 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `content/adr.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07591836734693877 - nodes in this community are weakly interconnected._
- **Should `ADR 005 — Claude Code Project Configuration Structure` be split into smaller, more focused modules?**
  _Cohesion score 0.07419712070874862 - nodes in this community are weakly interconnected._
- **Should `adr.schema.json` be split into smaller, more focused modules?**
  _Cohesion score 0.05263157894736842 - nodes in this community are weakly interconnected._