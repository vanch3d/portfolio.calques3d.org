---
number: 19
title: "Content Pipeline for /lab/adr and /lab/insights"
status: accepted
date: "2026-09-05"
decision-makers: vanch3d
tags: ["rendering", "content", "markdown", "ssg", "lab", "adr", "insights", "testing"]
---

# ADR 019 — Content Pipeline for /lab/adr and /lab/insights

**Date:** 2026-09-05
**Status:** Accepted

## Context

The `/lab/adr` and `/lab/insights` surfaces render content from two sets of Markdown
files on disk:

- `.docs/adr/*.md` — Architecture Decision Records, ~20 files, growing
- `.docs/insights/*.md` — Engineering Insights, small and slow-growing

Each file has a YAML frontmatter block and a plain Markdown body. Content is
frozen between deploys — no runtime writes, no user-submitted data.

Four decisions were required before implementation could begin:

1. **How to parse the Markdown files** — frontmatter extraction + body rendering
2. **Where data access lives** — server-only module vs shared, page vs component
3. **How cross-references resolve** — ADR↔insight slugs at what layer
4. **How to test async Server Components** — CT is impossible; where does coverage live

---

## Decision 1 — Markdown parsing pipeline: gray-matter + remark

### Options considered

**Option A — `next-mdx-remote`**
Supports MDX (components in Markdown). Heavyweight: requires a serialise/deserialise
round-trip, adds a client bundle, and MDX authoring is not needed for ADRs — they are
plain `.md` files written by humans and agents, not component authors.

**Option B — `unified` / `remark` / `remark-html`**
Composable pipeline: `gray-matter` extracts frontmatter, `remark` + `remark-gfm` +
`remark-html` converts the body to an HTML string. Output is rendered via
`dangerouslySetInnerHTML` inside a scoped `.register-body` container. No client
bundle. Markdown-only; MDX is not a goal.

**Option C — `marked` or `micromark` directly**
Lower-level; fewer plugins available. GFM support (tables, task lists) requires
manual extension. Remark ecosystem is more mature and better maintained.

### Decision

**Option B — gray-matter + remark pipeline.**

`gray-matter` is already in the dependency graph from the existing content API layer.
`remark` + `remark-gfm` + `remark-html` gives GFM table support (needed for the ADR
"Options considered" sections) without a client bundle. HTML is scoped to `.register-body`
which applies the full body typography contract from `globals.css`.

The pipeline lives in `src/lib/content/markdown.ts`:

```ts
export async function markdownToHtml(markdown: string): Promise<string>
```

---

## Decision 2 — Data access: server-only module at `src/lib/content/`

### Options considered

**Option A — Fetch from an API route (`/api/adrs`)**
Adds a network round-trip on every SSG build pass. SSG pages do not need runtime
API routes; the data is local disk. This pattern exists for ISR or CSR use cases.

**Option B — Direct file reads inside page.tsx**
Works, but `page.tsx` is a thin shell by convention (CLAUDE.md). Inline `fs.readFileSync`
calls in page files are untestable in isolation and violate single-responsibility.

**Option C — Server-only module (`src/lib/content/adr.ts`, `insights.ts`)**
Named, typed functions with clear contracts:

```ts
getAllAdrs(): Promise<AdrMeta[]>
getAdr(slug: string): Promise<Adr | null>
getAdrSlugs(): Promise<string[]>
adrSlugFromNumber(n: number): Promise<string | null>
getMostRecentAcceptedAdrNumber(): Promise<number>
```

Same pattern for insights. `page.tsx` calls these functions; it does not touch `fs` or
`gray-matter` directly. Modules are Node-only (use `fs`) and safe under `force-static`.

### Decision

**Option C.** Consistent with the existing `src/lib/content/` convention established
for positions, research, and engineering content (ADR 012, ADR 014). The data layer is
independently unit-testable (pure Node functions, no browser) via Vitest.

Slug derivation rule: slug = filename without `.md` extension. This keeps slugs
stable across renames of frontmatter fields and avoids a slug-generation step.

---

## Decision 3 — Cross-reference resolution: at page level, not component level

### Context

`InsightsRegisterTable` needs to render a link to each insight's related ADR. The ADR
is identified in frontmatter as an integer (`related-adr: 16`). The component needs
a slug string (`016-draft-pr-containment`) to construct the `href`.

`adrSlugFromNumber()` reads the filesystem. Two options for where the call lives:

### Options considered

**Option A — Resolve inside the component**
`InsightsRegisterTable` calls `adrSlugFromNumber()` per row. The component becomes
async and does N filesystem reads. Components that mix presentation and I/O are
harder to test and reuse.

**Option B — Resolve at page level, pass as data**
`insights/page.tsx` calls `adrSlugFromNumber()` for each row before rendering the
table. The component receives a fully resolved `InsightRow[]` with
`relatedAdrSlug: string | null`. The component is a pure presentational Server
Component — no I/O, no async.

### Decision

**Option B.** Page shells are the correct layer for data orchestration. Components
receive typed, resolved data. `InsightRow` is exported from `InsightsRegisterTable`
so the page knows exactly what shape to produce. This makes the component mountable
and testable in Cypress CT without mocking a filesystem module.

---

## Decision 4 — CT coverage for async Server Components: E2E-only

### Context

`AdrDocument` and `InsightDocument` are async Server Components that call
`getTranslations()` from `next-intl/server`. Cypress CT (`cy.mountAccessible()`)
renders components in a browser iframe via React — it cannot `await` an async
component that reads from the filesystem and calls server-side next-intl APIs.

### Options considered

**Option A — Test via `react-dom/server` in a helper**
Render the async component to HTML in a Node-level test (Vitest), then assert on
the string. Works but loses the axe-core accessibility check (no real DOM) and
requires a test-doubles setup for `getTranslations`.

**Option B — Wrap in a client shell for CT**
Create a client-side wrapper that receives pre-resolved props and renders the same
markup. Doubles the component surface for the sole purpose of testing.

**Option C — E2E-only coverage**
Accept that these two components are tested exclusively through Cypress E2E page
specs. The page spec visits the rendered URL, runs `cy.checkA11y()`, and asserts
on visible content. All child components (which are presentational) have their own
CT specs.

### Decision

**Option C.** The rule "every component has a CT spec" applies to components that
can be mounted. Async Server Components with server-side I/O are page-layer concerns;
their coverage lives at the E2E layer. This is documented in sibling `.test.ts` files
(`AdrDocument.test.ts`, `InsightDocument.test.ts`) so the absence of a CT spec is
intentional and discoverable.

---

## Consequences

**Positive:**
- Data layer is independently testable: Vitest covers `markdownToHtml()`,
  `extractBodyExcerpt()`, and the slug/number utilities without a browser.
- Components are pure presentational Server Components — CT-mountable, no I/O.
- Cross-references resolve to typed slugs at the page layer; no component touches
  the filesystem.
- HTML rendering pipeline adds no client bundle (`remark-html` is server-only).
- ADR and insight slugs are filename-stable — no slug-generation fragility.

**Negative / Trade-offs:**
- `AdrDocument` and `InsightDocument` have no CT spec — E2E is the only browser-level
  test layer for those two components.
- `dangerouslySetInnerHTML` is required for the remark HTML output. Risk is low
  (content is author-controlled, not user-submitted) but must not be extended to
  user-facing inputs.
- GFM is the ceiling for content formatting. If future ADRs need interactive
  components embedded in prose (e.g. a live token comparison), the pipeline would
  need to graduate to MDX.

## Related

- ADR 012 — Case Study Content Architecture (server-only content module pattern)
- ADR 014 — Content Model (frontmatter conventions)
- ADR 015 — Lab Rendering Strategy (`force-static` on all `/lab` routes)
- ADR 017 — ADR Conventions and Lifecycle
- ADR 018 — Engineering Insights Document Type
- `src/lib/content/adr.ts`, `src/lib/content/insights.ts`, `src/lib/content/markdown.ts`
- `src/app/lab/adr/page.tsx`, `src/app/lab/insights/page.tsx`
