# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Primary — recruiters and recruiting agencies:** arrive from a job application or outreach, scan fast (30–60 seconds), need to read a coherent career narrative across two distinct eras and judge seniority and breadth quickly.

**Secondary** 
- **fellow researchers and software engineers:** arrive from GitHub, Google Scholar, or a direct referral; read for depth — specific projects, publications, technology choices, and methodology.
- **myself**, for record-kepping and as a framework for curating evidence during future positions

## Product Purpose

A digital CV and portfolio for Dr Nicolas Van Labeke: 25+ years of R&D and frontend engineering, unified into a single navigable record. The site must support two reading modes — fast career-narrative scan for recruiters, and deep per-project exploration for peers. It also functions as a meta-output of the career: the `/lab` section documents the design and engineering decisions made in building the portfolio itself, and hosts interactive technical demos.

## Positioning

Two eras, one continuous practice. The research period (1995–2017) was not a detour into academia: it was full-stack ownership of interactive systems — designing, building, deploying, and validating with real users — before that phrase existed in commercial engineering. The engineering period (2018–present) applies the same discipline to commercial product engineering. No other candidate can truthfully claim both a peer-reviewed publication record in AI & Education and senior frontend ownership of a production IoT gateway to WCAG compliance.

## Operating Context

- Visitors typically arrive from a job application, LinkedIn, or GitHub; a minority arrive from Google Scholar or an academic reference.
- Recruiters scan the timeline and tech stack first; the narrative of the two eras must be legible in one viewport without explanation.
- Peers navigate by project or publication; the content model (position → projects → timeline → stack → outputs) must be consistent across both eras so depth is always one click away.
- The site is actively used during a job search (as of late 2026).
- The old personal site at `nvl.calques3d.org` is a living historical reference and the intended canonical domain.
- ADRs are maintained in the `.docs/adr/` directory (canonical path per CLAUDE.md)

## Capabilities and Constraints

**Content model:** The timeline is certainly the most appropriate approach and must be used in reverse chronology, recent events first. Positions articulate with one primary project, possibly with one or more secondary projects; each project carries a timeline, narrative, technology stack, and typed outputs (publications, slides, repos, screenshots, artifacts). 
Project might have one or several use-cases that are design/product narrative used to convey 
This model must be consistent across both eras despite their different output types.

**External data sources (confirmed, accessible via API or protocol):**
- Zotero API — full bibliography with metadata and DOIs; integration code already implemented for this stack
- Personal cloud / WebDAV API — paper PDFs; integration code already implemented for this stack
- Self-hosted photo library — project screenshots and images
- GitHub (`github.com/vanch3d`) — code repositories, primarily engineering era
- SlideShare + PDF files — conference presentations and slides

**Engineering-era artifacts:** Projects in this era are products, mostly proprietary software; public outputs are limited. Source code remains available and can be run against mocks to generate dedicated narrative screenshots. HiveMQ Edge PR screenshots (Cypress E2E, ~1280–1920px) are available and well-documented. When expanded, a product will be narrated around a selection of "use cases" that will highlight some of the design and implementation decisions made during that product's lifecycle.

**Hosting:** Vercel free tier (serverless; no persistent Node.js processes). Domain `nvl.calques3d.org` points here via redirect.

**Component architecture (binding):**
- **Base UI** — headless, unstyled component primitives for all interactive elements (Button, Menu, Dialog, Select, etc.); ensures accessibility compliance without fighting a pre-styled system. Make sure to use current package from https://github.com/mui/base-ui (`@base-ui-components/react` is deprecated)
- **Strong component model** — variants defined via CVA or equivalent; never hard-coded Tailwind classnames inline; every interactive element is a named component with explicit variant props
- **Design system as Tailwind v4 theme** — all design tokens (color, spacing, typography, radius, shadow) expressed as CSS custom properties in the Tailwind v4 theme; the token layer is the single authority, documentable independently in the Lab
- **i18n from day one** — next-intl throughout; every user-facing string exported to a translation file; no inline string literals in components; primary locale EN-UK, FR planned

**Testing stack (binding — the portfolio is itself an engineering output and must meet production rigour):**
- Vitest — unit tests (utils, hooks, pure functions)
- Cypress — component tests
- Cypress + MSW — E2E tests with mocked APIs
- Playwright — staged E2E smoke tests (Percy excluded: cost-prohibitive at this stage)
- Cypress + Deque axe-core + cypress-axe — accessibility testing at component and E2E level
- Every component, util, and hook ships with a co-located test file using the appropriate layer
- **Approach: spec-first.** Tests are written as they *should* be (covering the intended behaviour) before or alongside implementation. Running and debugging is deferred to parallel subagents or a later stage — tests are not a build blocker but are not optional. This approach is itself an ADR candidate for the Lab.

**Design system requirements:**
- Self-contained token architecture (primitive → semantic → component layers)
- Tailwind v4 CSS theme as the token delivery mechanism
- Lab section documents the design system: tokens, component variants, and ADRs
- All tokens must survive a future FR locale addition without restructuring

**The `/lab` section** serves two roles: (1) meta — design system tokens, ADRs, design decisions, and impeccable outputs produced while building this portfolio; (2) interactive — D3.js technical demos and experiments. It is not a showcase of past project artifacts — those appear within their respective project sections. `/lab` replaces the earlier `/experiments` route.

**Career eras:**
- Era 1 — R&D in AI & Education: 1995–2017 (PhD Nancy I; research positions at Nottingham, Northumbria, Glasgow, Edinburgh, Birkbeck, Open University, Leeds)
- Era 2 — UX & Frontend Engineering: 2018–present (HubSpot Dublin, Almotech Galway, Matillion Manchester, HiveMQ remote)

**Languages:** French (native), English (fluent).

## Brand Commitments

- Name on the site: **Dr Nicolas Van Labeke** (academic title is part of the identity)
- Domain identity: `calques3d.org` / `nvl.calques3d.org` (longstanding personal domain, named after the PhD software Calques 3D)
- Contact: `nicolas@calques3d.org` (but no email in clear on the website, obfuscation is mandatory)
- GitHub: `github.com/vanch3d`
- LinkedIn: `linkedin.com/in/nvanlabeke`

## Evidence on Hand

- `docs/vanlabeke_cv (academic 2018).pdf` — 10-page academic CV covering research record through 2018: positions, research activities, publications (31 items), grants, teaching
- `docs/vanlabeke_cv (engineering 2026).docx` — Engineering CV covering commercial period 2018–2026: roles, tech stack, achievements
- Zotero library — full bibliography (accessible via API); includes journal papers, book chapters, conference papers, workshop papers, technical reports, and PhD dissertation
- WebDAV cloud — PDFs of papers
- Self-hosted photo library — screenshots and images from past projects
- SlideShare + PDF slides — conference and workshop presentations
- `github.com/vanch3d` — public repositories
- `nvl.calques3d.org` — existing personal site (historical content, additional reference)

**Fabrication prohibition:** Do not invent testimonials, metrics, usage numbers, award claims, or deployment figures not present in the source documents.

## Product Principles

1. **The site is evidence, not assertion.** Design quality, code quality, and documented decisions are the portfolio — they should not need captions explaining that they demonstrate craft.
2. **One career, two languages.** The research era and engineering era share a common content model; the vocabulary shifts but the underlying practice (build → deploy → validate with real users) is continuous.
3. **Depth on demand.** Every surface must be scannable in 30 seconds and explorable in 10 minutes; neither audience should be forced through the other's reading mode.
4. **The Lab is the making-of.** Design system tokens, ADRs, and impeccable outputs live there — not as decoration, but as a working record of decisions that a senior engineer would actually make and document.
5. **Sources, not summaries.** Where an output (paper, repo, slide, screenshot) is accessible, link or embed it; do not paraphrase what can be shown.

## Accessibility & Inclusion

WCAG 2.1 AA compliance is a hard requirement and is itself a portfolio output — it demonstrates that the engineering-era practice extends to every component shipped. Every component must pass Deque axe-core with zero violations (tested via cypress-axe at component and E2E level). The academic-era audience may include users with assistive technology needs; accessibility is not optional on any route.
