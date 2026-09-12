# Graph Report - nextjs-vanch-website  (2026-09-12)

## Corpus Check
- 271 files · ~117,659 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1275 nodes · 1666 edges · 131 communities (94 shown, 23 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 45 edges (avg confidence: 0.81)
- Token cost: 2,800 input · 420 output

## Community Hubs (Navigation)
- ADR Index UI
- Career Timeline UI
- Shared Library References
- Agent Tooling & Skills
- ADR JSON Schema
- Content Validation Pipeline
- Insight Schema
- CV Education Schema
- Impeccable Design System
- Package Metadata
- Dev Dependencies
- Case Study Schema
- Cypress Test Infrastructure
- Build Scripts
- CV Content Layer
- Engineering Showcase Page
- Engineering Planning Docs
- CV Skills Schema
- Runtime Dependencies
- Citations & Bibliography
- TypeScript Configuration
- Era Column Timeline
- Zotero API Layer
- Server Utilities & APIs
- PR Snapshot Automation
- Design System Colors Page
- Type Specimen Component
- Mermaid Diagram Validation
- Project Schema Links
- Shared Schema Coordinates
- Shared Schema Time Periods
- Shared Schema External Links
- Agent Domain Guides
- Research Learning Concepts
- Lab Layout & Next.js Core
- Project Schema Defs
- Publication Schema
- Shared Schema Media
- Shared Schema Definitions
- UI Utility Libraries
- Design System Atoms Page
- Position Schema Properties
- Publication Details Schema
- Next.js Configuration
- Playwright Test Config
- Position Schema Root
- Position Schema Coordinates
- Position Schema Items
- MSW Zotero Mocks
- Position Schema Required
- Publication Authors Schema
- Citation.js Type Definitions
- Commit Guard Hook
- Remark Markdown Plugins
- Zotero Archive Scripts
- Era Block Component
- Project Schema Root
- ADR Design Comp Concepts
- OpenAPI-First Workflow
- MCP Server Config
- OwnCloud Proxy Scripts
- Publications Grouping Lib
- Shared Schema Root
- Shared Schema Tag Lists
- Test File Check Hook
- Tracker Reminder Hook
- ISR Revalidation Concepts
- Learning Analytics Concepts
- OwnCloud Inspect Scripts
- Zotero Inspect Scripts
- Section Label Component
- Position Title Schema
- Project Base Schema
- Project Visibility Schema
- Publication DOI Schema
- Publication Key Schema
- Publication Year Schema
- Shared Live URL Schema
- Branch Guard Hook
- HiveMQ Graph Canvas Concepts
- Cypress Configuration
- PR Snapshots E2E
- Next.js Starter Icons
- Next.js & Vercel Logos
- Zotero API Test Scripts
- Position Department Schema
- Position Description Schema
- Position Organisation Schema
- Project Abbreviation Schema
- Project Featured Flag Schema
- Project Institution Schema
- Project Location Schema
- Project Publications Schema
- Project Slug Schema
- Project Status Schema
- Project Title Schema
- Publication Pages Schema
- Publication Place Schema
- Publication Tags Schema
- Publication Title Schema
- Publication Type Schema
- Publication Venue Schema
- Manual Edit Applier
- Design Token Architecture
- Auditory Games Research
- Tangible Learning Research
- ESLint Configuration
- pnpm Configuration
- PostCSS Configuration
- Vitest Configuration
- i18n Request Config
- i18n Types
- README Documentation
- Almotech Engineering Content
- HubSpot Engineering Content
- Piwigo API Schema
- Citation.js Plugin Types

## God Nodes (most connected - your core abstractions)
1. `cn()` - 25 edges
2. `scripts` - 24 edges
3. `react` - 16 edges
4. `compilerOptions` - 16 edges
5. `vitest` - 15 edges
6. `NavLink()` - 13 edges
7. `next` - 12 edges
8. `Next.js Engineer Agent` - 12 edges
9. `DESIGN.md — design system seed: Construction on Tracing Paper` - 11 edges
10. `SectionLabel()` - 9 edges

## Surprising Connections (you probably didn't know these)
- `PR Flow Orchestration Pattern` --semantically_similar_to--> `Agentic Code Review Sub-agent (vanch-code-reviewer)`  [INFERRED] [semantically similar]
  .claude/skills/pr-flow/SKILL.md → .docs/adr/010-agentic-workflow.md
- `SSG for /lab routes — force-static; content frozen per build (ADR 015)` --semantically_similar_to--> `The Flat-by-Construction Rule — no shadows; depth via line weight`  [INFERRED] [semantically similar]
  .docs/tasks/2026-09-04-lab-adr-surface.md → DESIGN.md
- `PRODUCT.md — product purpose, users, positioning, and constraints` --references--> `DESIGN.md — design system seed: Construction on Tracing Paper`  [INFERRED]
  PRODUCT.md → DESIGN.md
- `ADR 005 — Claude Code Project Configuration Structure` --references--> `Mermaid Skill`  [EXTRACTED]
  .docs/adr/005-claude-project-config.md → .claude/skills/mermaid/SKILL.md
- `CLAUDE.md — project constitution for Claude Code` --references--> `Domain Docs — agent codebase orientation guide`  [EXTRACTED]
  CLAUDE.md → .docs/agents/domain.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Impeccable Workflow Agent Ensemble (asset producer, documenter, finish reviewer, manual edit applier)** — _claude_agents_impeccable_asset_producer_md_impeccable_asset_producer, _claude_agents_impeccable_documenter_md_impeccable_documenter, _claude_agents_impeccable_finish_reviewer_md_impeccable_finish_reviewer, _claude_agents_impeccable_manual_edit_applier_md_impeccable_manual_edit_applier [EXTRACTED 0.95]
- **Design System Non-Negotiable Rules (One Red, No Decoration, Flat-by-Construction, Compass Grammar, Incline Rule)** — _claude_agents_design_director_md_one_red_rule, _claude_agents_design_director_md_no_decoration_rule, _claude_agents_design_director_md_flat_by_construction [EXTRACTED 1.00]
- **Next.js Engineer Quality Gates (validate, accessibility, i18n, component conventions, tailwind)** — _claude_rules_accessibility_md_accessibility_rules, _claude_rules_i18n_md_i18n_rules, _claude_rules_components_md_component_conventions, _claude_rules_tailwind_md_tailwind_rules, _claude_commands_validate_md_validate_command [INFERRED 0.95]
- **Testing and Quality Gate System (Cypress CT + E2E + Playwright + axe-core)** — _docs_adr_002_testing_strategy_md, _docs_adr_007_accessibility_testing_md, _docs_adr_008_ci_pipeline_md, _docs_adr_011_animation_accessibility_testing_md [EXTRACTED 0.95]
- **Agentic PR Pipeline (pr-flow skill + pr-snapshots + code review + draft gate)** — _claude_skills_pr_flow_skill_md, _claude_skills_pr_snapshots_skill_md, _docs_adr_016_pr_snapshot_review_workflow_md, _docs_adr_010_agentic_workflow_md [EXTRACTED 0.95]
- **Content Model + Rendering Strategy System (ADR 012, 013, 014, 015, 019)** — _docs_adr_012_case_study_content_architecture_md, _docs_adr_014_content_model_md, _docs_adr_015_lab_rendering_strategy_md, _docs_adr_019_lab_content_pipeline_md [INFERRED 0.85]
- **Design system enforcement triad: DESIGN.md defines rules, token-review audits violations, agent-guidelines enforces in implementation** — design_md, _docs_engineering_2026_09_05_tailwind_token_review_md, _docs_engineering_2026_09_05_tailwind_agent_guidelines_md [EXTRACTED 0.95]
- **Surface brief → approved comp → task plan — the comp-led development workflow for /lab/adr** — _impeccable_surfaces_src_app_lab_adr_page_tsx_md, _docs_tasks_2026_09_04_lab_adr_surface_md, _docs_tasks_tracker_md [EXTRACTED 0.95]
- **CI pipeline: validate → unit (Vitest) → CT (Cypress) → E2E (Cypress) → staging → Playwright → promote** — _github_workflows_ci_yml, cypress_support_component_index_html, contributing_md [INFERRED 0.85]
- **OpenAPI as shared contract across Intrica, Matillion, and HiveMQ Edge engineering engagements** — src_content_engineering_intrica, src_content_engineering_matillion, src_content_engineering_hivemq_edge [INFERRED 0.85]
- **Learner modelling research thread: ILP, LeActiveMath OLM, SAFeSEA** — src_content_research_ilp, src_content_research_leactivemath, src_content_research_safesea [INFERRED 0.80]
- **Personalised adaptive learning research: MyPlan, myPAL, LeActiveMath** — src_content_research_myplan, src_content_research_mypal, src_content_research_leactivemath [INFERRED 0.75]

## Communities (131 total, 23 thin omitted)

### Community 0 - "ADR Index UI"
Cohesion: 0.05
Nodes (51): AdrIndexClient(), ADR_AUTH, ADR_DEPLOYMENT, ADR_I18N, ADR_TESTING, make(), MANY_ADRS, SAMPLE_ADRS (+43 more)

### Community 1 - "Career Timeline UI"
Cohesion: 0.05
Nodes (38): ArcSprinkleContent, CareerArc(), CareerArcProps, ENGINEERING_SLOTS, RESEARCH_SLOTS, PROPS, SprinkleSlot, EraTimeline() (+30 more)

### Community 2 - "Shared Library References"
Cohesion: 0.05
Nodes (34): mermaid, next-intl, react, AdrFilterBar(), AdrFilterBarProps, AdrIndexClientProps, FilterInputDemo(), FilterInputDemoProps (+26 more)

### Community 3 - "Agent Tooling & Skills"
Cohesion: 0.07
Nodes (43): Mermaid Skill, PR Flow Skill, PR Snapshots Skill, ADR 001 — Deployment Target: Vercel + cPanel DNS, ADR 002 — Testing Strategy, ADR 003 — API Layer and Data Fetching Strategy, ADR 004 — Component Structure and File Naming Conventions, ADR 005 — Claude Code Project Configuration Structure (+35 more)

### Community 4 - "ADR JSON Schema"
Cohesion: 0.05
Nodes (37): additionalProperties, description, format, type, $defs, TagList, description, $id (+29 more)

### Community 5 - "Content Validation Pipeline"
Cohesion: 0.11
Nodes (28): ajv-formats, gray-matter, ajv, __dirname, loadSchema(), root, shared, validateDir() (+20 more)

### Community 6 - "Insight Schema"
Cohesion: 0.06
Nodes (32): additionalProperties, description, format, type, $defs, TagList, description, description (+24 more)

### Community 7 - "CV Education Schema"
Cohesion: 0.06
Nodes (31): additionalProperties, description, type, description, description, type, description, type (+23 more)

### Community 8 - "Impeccable Design System"
Cohesion: 0.08
Nodes (31): Comp Lifecycle (Draft → Serve → Iterate → Approve → Reference), Design Director Agent, Flat-by-Construction Rule (no box-shadow, depth from line weight only), No-Decoration Rule (every element earns its place), The One Red Rule (--color-active appears exactly once per surface), Impeccable Asset Producer Agent, Plate Production (raster asset at 1.5x comp region pixel size), DESIGN.md (recorded design system from shipped artifact) (+23 more)

### Community 9 - "Package Metadata"
Cohesion: 0.06
Nodes (30): name, packageManager, private, version, ajv, @base-ui/react, cypress-terminal-report, eslint (+22 more)

### Community 10 - "Dev Dependencies"
Cohesion: 0.06
Nodes (31): devDependencies, ajv, ajv-formats, axe-core, @axe-core/playwright, cypress, cypress-axe, cypress-terminal-report (+23 more)

### Community 11 - "Case Study Schema"
Cohesion: 0.07
Nodes (26): additionalProperties, description, description, type, $id, description, $ref, properties (+18 more)

### Community 12 - "Cypress Test Infrastructure"
Cohesion: 0.11
Nodes (15): wrapWithSection(), Chainable, Cypress, wrapWithIntl(), mockRouter, RouterWrapperOptions, wrapWithRouter(), Chainable (+7 more)

### Community 13 - "Build Scripts"
Cohesion: 0.08
Nodes (24): scripts, build, dev, generate:types, inspect:owncloud, inspect:zotero, inspect:zotero-archive, lint (+16 more)

### Community 14 - "CV Content Layer"
Cohesion: 0.10
Nodes (21): CV_DIR, getEducation(), getSkills(), ADR, ADRStatus, CaseStudy, CaseStudyStatus, ChapterMeta (+13 more)

### Community 15 - "Engineering Showcase Page"
Cohesion: 0.11
Nodes (9): dynamic, metadata, DesignSystemLayoutProps, COLOR_STRIP, metadata, dynamic, metadata, NavLink() (+1 more)

### Community 16 - "Engineering Planning Docs"
Cohesion: 0.14
Nodes (22): Tailwind Agent Guidelines — 13 styling rules for agents, Tailwind Token Review — exhaustive audit of token/class anti-patterns, Arc Year-to-Point — Bézier geometry research note for career arc sprinkles, Homepage Surface Implementation Plan — Track A/B/C/D/E parallel tracks, /lab/design-system Implementation Plan — five-section documentation surface, Lab ADR Surface Task Plan — /lab/adr and /lab/insights routes, Homepage V4b R2 Implementation Plan — two-arc redesign component tasks, TRACKER.md — Homepage + Lab Design System progress tracker (+14 more)

### Community 17 - "CV Skills Schema"
Cohesion: 0.09
Nodes (21): additionalProperties, description, $id, description, type, minLength, type, description (+13 more)

### Community 18 - "Runtime Dependencies"
Cohesion: 0.10
Nodes (21): dependencies, @base-ui/react, @citation-js/core, @citation-js/plugin-csl, clsx, gray-matter, @mdx-js/loader, @mdx-js/react (+13 more)

### Community 19 - "Citations & Bibliography"
Cohesion: 0.17
Nodes (15): @citation-js/core, @citation-js/plugin-csl, CITATION_STYLES, CitationStyle, ensureStyleRegistered(), formatCitation(), formatCitations(), getActiveCitationStyle() (+7 more)

### Community 20 - "TypeScript Configuration"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 21 - "Era Column Timeline"
Cohesion: 0.15
Nodes (14): EraColumn(), EraColumnProps, EraEntry, EraLink, RulerTick(), RulerYear(), ENGINEERING_POSITIONS, ENGINEERING_PROPS (+6 more)

### Community 22 - "Zotero API Layer"
Cohesion: 0.20
Nodes (15): extractDoi(), extractTags(), extractVenue(), extractYear(), formatAuthors(), getAllPublications(), getConfig(), getPublicationsByProject() (+7 more)

### Community 23 - "Server Utilities & APIs"
Cohesion: 0.21
Nodes (13): server-only, vitest, buildAuthHeader(), buildFileUrl(), getConfig(), OwncloudConfig, ENV, PdfResolutionResult (+5 more)

### Community 24 - "PR Snapshot Automation"
Cohesion: 0.14
Nodes (11): allPngs, args, output, repoId, result, ROOT, rootDir, routes (+3 more)

### Community 25 - "Design System Colors Page"
Cohesion: 0.16
Nodes (10): metadata, ColorSwatch(), ColorSwatchProps, NamedRule, ACTIVE, GROUND, INK, INK_GHOST (+2 more)

### Community 26 - "Type Specimen Component"
Cohesion: 0.16
Nodes (10): BODY, DISPLAY, HEADLINE, LABEL, TITLE, SPECIMEN_CLASSES, SpecimenVariant, TypeSpecimen() (+2 more)

### Community 27 - "Mermaid Diagram Validation"
Cohesion: 0.18
Nodes (11): __dirname, EXTENSIONS, getDiagramType(), ADR-0002, ADR-0003, PARSER_SUPPORTED, root, SEARCH_DIRS (+3 more)

### Community 28 - "Project Schema Links"
Cohesion: 0.15
Nodes (13): description, type, $ref, $ref, description, $ref, properties, description (+5 more)

### Community 29 - "Shared Schema Coordinates"
Cohesion: 0.15
Nodes (13): additionalProperties, properties, required, type, Coordinates, maximum, minimum, type (+5 more)

### Community 30 - "Shared Schema Time Periods"
Cohesion: 0.15
Nodes (13): Period, description, oneOf, additionalProperties, description, properties, required, type (+5 more)

### Community 31 - "Shared Schema External Links"
Cohesion: 0.19
Nodes (13): items, type, description, items, type, format, type, items (+5 more)

### Community 32 - "Agent Domain Guides"
Cohesion: 0.18
Nodes (12): Domain Docs — agent codebase orientation guide, Issue Tracker — GitHub Issues / PR workflow guide, Insight 001 — Draft PR as Hard Agent Containment Boundary, CI workflow — validate → unit → CT → E2E → staging → Playwright → promote, AGENTS.md — Next.js breaking-changes warning for agents, CLAUDE.md — project constitution for Claude Code, Comp-Led Development — no coding without approved comp in .docs/design/comps/, Draft PR as Hard Agent Containment Boundary — platform-enforced merge block (+4 more)

### Community 33 - "Research Learning Concepts"
Cohesion: 0.17
Nodes (12): DeFT Framework (Design, Functions, Tasks) for multiple external representations, Extractive summarisation for formative essay feedback, ILP-based automatic student misconception modelling, Open Learner Modelling (OLM), Participatory design with domain experts, Pre-technology knowledge elicitation in co-design, Calques 3D — A 3D Dynamic Geometry Microworld, DEMIST — Design Environment for Multi-representational Instructional Simulation Technology (+4 more)

### Community 34 - "Lab Layout & Next.js Core"
Cohesion: 0.17
Nodes (8): next, LabLayoutProps, metadata, metadata, RootLayoutProps, spaceMono, spectral, stixTwoText

### Community 35 - "Project Schema Defs"
Cohesion: 0.17
Nodes (12): $ref, $defs, Coordinates, MediaAssets, Period, ProjectLinks, TagList, $ref (+4 more)

### Community 36 - "Publication Schema"
Cohesion: 0.18
Nodes (10): additionalProperties, $defs, TagList, description, $id, required, $schema, $ref (+2 more)

### Community 37 - "Shared Schema Media"
Cohesion: 0.18
Nodes (11): description, type, description, type, properties, cover, gallery, slides (+3 more)

### Community 38 - "Shared Schema Definitions"
Cohesion: 0.18
Nodes (11): $defs, MediaAssets, ProjectLinks, SlugRef, additionalProperties, type, additionalProperties, type (+3 more)

### Community 39 - "UI Utility Libraries"
Cohesion: 0.22
Nodes (7): clsx, tailwind-merge, DecisionRow, MoleculeFrame(), MoleculeFrameProps, DECISIONS, twMerge

### Community 40 - "Design System Atoms Page"
Cohesion: 0.24
Nodes (6): metadata, NamedRuleCard(), NamedRuleCardProps, FLAT, NO_DECORATION, ONE_RED

### Community 41 - "Position Schema Properties"
Cohesion: 0.22
Nodes (9): properties, slug, tags, type, description, $ref, $ref, enum (+1 more)

### Community 42 - "Publication Details Schema"
Cohesion: 0.22
Nodes (9): type, description, type, description, type, properties, abstract, eventName (+1 more)

### Community 43 - "Next.js Configuration"
Cohesion: 0.25
Nodes (7): nextConfig, ADR-0002, ADR-0003, ADR-0006, withMDX, withNextIntl, @next/mdx

### Community 44 - "Playwright Test Config"
Cohesion: 0.25
Nodes (3): ADR-0002, @axe-core/playwright, @playwright/test

### Community 45 - "Position Schema Root"
Cohesion: 0.25
Nodes (7): additionalProperties, description, $id, required, $schema, title, type

### Community 46 - "Position Schema Coordinates"
Cohesion: 0.25
Nodes (8): $ref, $defs, Coordinates, Period, TagList, $ref, coordinates, $ref

### Community 47 - "Position Schema Items"
Cohesion: 0.25
Nodes (8): type, properties, description, minLength, type, institution, location, period

### Community 48 - "MSW Zotero Mocks"
Cohesion: 0.38
Nodes (4): msw, MOCK_ITEMS, zoteroHandlers, server

### Community 49 - "Position Schema Required"
Cohesion: 0.29
Nodes (7): additionalProperties, required, type, sites, description, items, type

### Community 50 - "Publication Authors Schema"
Cohesion: 0.29
Nodes (7): description, items, minItems, type, minLength, type, authors

### Community 51 - "Citation.js Type Definitions"
Cohesion: 0.29
Nodes (3): @citation-js/core, @citation-js/plugin-csl, Cite

### Community 52 - "Commit Guard Hook"
Cohesion: 0.33
Nodes (4): data, files, hasSrcChanges, trackerStaged

### Community 53 - "Remark Markdown Plugins"
Cohesion: 0.40
Nodes (4): remark, remark-gfm, remark-html, markdownToHtml()

### Community 54 - "Zotero Archive Scripts"
Cohesion: 0.33
Nodes (5): env, root, withArchive, withChildren, without

### Community 55 - "Era Block Component"
Cohesion: 0.40
Nodes (4): EraBlock(), EraBlockProps, ENGINEERING, RESEARCH

### Community 56 - "Project Schema Root"
Cohesion: 0.33
Nodes (5): description, $id, oneOf, $schema, title

### Community 57 - "ADR Design Comp Concepts"
Cohesion: 0.40
Nodes (5): ADR Index Page Design Comp, ADR Filterable Table (18 records), ADR Insight 001 — Draft PR as Hard Agent Containment Boundary, Revision Register — Portfolio Build, Tag Filter UI (infrastructure, testing, components, i18n, accessibility, documentation, process)

### Community 58 - "OpenAPI-First Workflow"
Cohesion: 0.50
Nodes (5): OpenAPI as reverse-engineered documentation from traffic observation, OpenAPI-first development workflow, Building a Form-Driven UI Over an Undocumented API (case study), Intrica Ltd (engineering), Matillion Data Productivity Cloud

### Community 59 - "MCP Server Config"
Cohesion: 0.40
Nodes (4): uvx, server-fetch, webstorm, mcp-server-fetch

### Community 60 - "OwnCloud Proxy Scripts"
Cohesion: 0.40
Nodes (4): base, env, root, testFiles

### Community 62 - "Shared Schema Root"
Cohesion: 0.40
Nodes (4): description, $id, $schema, title

### Community 63 - "Shared Schema Tag Lists"
Cohesion: 0.40
Nodes (5): TagList, minLength, items, type, uniqueItems

### Community 66 - "ISR Revalidation Concepts"
Cohesion: 0.50
Nodes (4): On-demand ISR revalidation via API route, Zotero project tag convention nvl.<projectSlug>, Portfolio Internal API — OpenAPI spec, Zotero API v3 — portfolio subset OpenAPI spec

### Community 67 - "Learning Analytics Concepts"
Cohesion: 0.50
Nodes (4): Personalised pathway recommendation for lifelong learning, xAPI and Learning Analytics infrastructure for personalised feedback, myPAL — Personalised and Adaptive Learning Mentoring for Medical Students, MyPlan — Personalisation in Lifelong Learning Environments

### Community 68 - "OwnCloud Inspect Scripts"
Cohesion: 0.50
Nodes (3): env, hrefs, root

### Community 69 - "Zotero Inspect Scripts"
Cohesion: 0.50
Nodes (3): env, root, totalResults

### Community 71 - "Position Title Schema"
Cohesion: 0.50
Nodes (4): title, description, minLength, type

### Community 72 - "Project Base Schema"
Cohesion: 0.50
Nodes (4): ProjectBase, description, required, type

### Community 73 - "Project Visibility Schema"
Cohesion: 0.50
Nodes (4): visibility, description, enum, type

### Community 74 - "Publication DOI Schema"
Cohesion: 0.50
Nodes (4): description, pattern, type, doi

### Community 75 - "Publication Key Schema"
Cohesion: 0.50
Nodes (4): description, minLength, type, key

### Community 76 - "Publication Year Schema"
Cohesion: 0.50
Nodes (4): year, maximum, minimum, type

### Community 77 - "Shared Live URL Schema"
Cohesion: 0.50
Nodes (4): description, format, type, live

### Community 79 - "HiveMQ Graph Canvas Concepts"
Cohesion: 1.00
Nodes (3): Graph-canvas paradigm for industrial IoT configuration UI, HiveMQ Edge: A Design Retrospective (case study), HiveMQ Edge — Frontend Architecture for Industrial IoT

### Community 82 - "Next.js Starter Icons"
Cohesion: 1.00
Nodes (3): File/Document Icon SVG, Globe/World Icon SVG, Browser Window Icon SVG

### Community 83 - "Next.js & Vercel Logos"
Cohesion: 1.00
Nodes (3): Next.js Wordmark Logo SVG, Vercel Logo SVG (triangle mark), Site Favicon SVG (NVL monogram)

### Community 85 - "Position Department Schema"
Cohesion: 0.67
Nodes (3): description, type, department

### Community 86 - "Position Description Schema"
Cohesion: 0.67
Nodes (3): description, type, description

### Community 87 - "Position Organisation Schema"
Cohesion: 0.67
Nodes (3): minLength, type, organisation

### Community 88 - "Project Abbreviation Schema"
Cohesion: 0.67
Nodes (3): description, type, abbr

### Community 89 - "Project Featured Flag Schema"
Cohesion: 0.67
Nodes (3): description, type, featured

### Community 90 - "Project Institution Schema"
Cohesion: 0.67
Nodes (3): description, type, institution

### Community 91 - "Project Location Schema"
Cohesion: 0.67
Nodes (3): description, type, location

### Community 92 - "Project Publications Schema"
Cohesion: 0.67
Nodes (3): publications, description, type

### Community 93 - "Project Slug Schema"
Cohesion: 0.67
Nodes (3): slug, description, $ref

### Community 94 - "Project Status Schema"
Cohesion: 0.67
Nodes (3): status, enum, type

### Community 95 - "Project Title Schema"
Cohesion: 0.67
Nodes (3): title, minLength, type

### Community 96 - "Publication Pages Schema"
Cohesion: 0.67
Nodes (3): description, type, pages

### Community 97 - "Publication Place Schema"
Cohesion: 0.67
Nodes (3): description, type, place

### Community 98 - "Publication Tags Schema"
Cohesion: 0.67
Nodes (3): tags, description, $ref

### Community 99 - "Publication Title Schema"
Cohesion: 0.67
Nodes (3): title, minLength, type

### Community 100 - "Publication Type Schema"
Cohesion: 0.67
Nodes (3): type, enum, type

### Community 101 - "Publication Venue Schema"
Cohesion: 0.67
Nodes (3): venue, description, type

## Knowledge Gaps
- **626 isolated node(s):** `data`, `filePath`, `absPath`, `data`, `files` (+621 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 733 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **23 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `Shared Library References` to `Career Timeline UI`, `Content Validation Pipeline`, `Package Metadata`, `Cypress Test Infrastructure`, `Engineering Showcase Page`, `Era Column Timeline`, `Era Block Component`?**
  _High betweenness centrality (0.049) - this node is a cross-community bridge._
- **Why does `next` connect `Lab Layout & Next.js Core` to `Career Timeline UI`, `Package Metadata`, `Next.js Configuration`, `Engineering Showcase Page`, `Era Column Timeline`?**
  _High betweenness centrality (0.038) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `Dev Dependencies` to `Package Metadata`?**
  _High betweenness centrality (0.030) - this node is a cross-community bridge._
- **What connects `data`, `filePath`, `absPath` to the rest of the system?**
  _626 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `ADR Index UI` be split into smaller, more focused modules?**
  _Cohesion score 0.052214452214452214 - nodes in this community are weakly interconnected._
- **Should `Career Timeline UI` be split into smaller, more focused modules?**
  _Cohesion score 0.052403846153846155 - nodes in this community are weakly interconnected._
- **Should `Shared Library References` be split into smaller, more focused modules?**
  _Cohesion score 0.05376972530683811 - nodes in this community are weakly interconnected._