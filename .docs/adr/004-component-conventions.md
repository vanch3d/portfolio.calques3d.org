---
number: 4
title: "Component Structure and File Naming Conventions"
status: accepted
date: "2026-08-04"
decision-makers: vanch3d
tags: ["conventions", "testing", "components", "eslint"]
---

# ADR 004 — Component Structure and File Naming Conventions

**Date:** 2026-08-04
**Status:** Decided

## Context

Next.js App Router imposes fixed filenames (`page.tsx`, `layout.tsx`, etc.) that do not
reflect the content of the file. As the codebase grows, `page.tsx` files become hard to
search, components become hard to locate, and the boundary between route wiring and
component logic blurs.

Additionally, Cypress component testing co-locates test files with their component — this
requires a consistent and predictable naming scheme for both component files and their tests.

## Decision

### 1. `page.tsx` is a thin shell

Route page files contain only:
- Data fetching calls (server-side)
- `generateStaticParams` / `generateMetadata`
- Composition of named components imported from co-located files

No substantial JSX or business logic lives in `page.tsx`.

### 2. Component co-location

Route-level components live in the same folder as the route:

```
src/app/research/[slug]/
  page.tsx                        ← thin shell
  ResearchProjectDetail.tsx       ← main component
  ProjectHeader.tsx               ← sub-component
  PublicationsList.tsx            ← sub-component
  ResearchProjectDetail.spec.cy.tsx   ← Cypress component test
```

Shared/reusable components go in `src/components/ui/`.

### 3. File naming

| Type | Convention | Example |
|---|---|---|
| React components | PascalCase | `ResearchProjectDetail.tsx` |
| Utilities / lib | camelCase | `zotero.ts` |
| Cypress component tests | `<ComponentName>.spec.cy.tsx` | `ResearchProjectDetail.spec.cy.tsx` |
| Vitest unit tests | `<filename>.test.ts` | `zotero.test.ts` |

### 4. Sub-components in `page.tsx`

Small, private sub-components may be defined inline in `page.tsx` if:
- They are not independently testable (purely presentational, trivial)
- They are fewer than ~30 lines

**The moment a sub-component requires a Cypress component test, it is extracted to its
own file.** This is a hard rule — inline components cannot be tested in isolation by Cypress.

### 5. Function style

- Page export functions: **named function declarations**
  ```ts
  export default function ResearchProjectPage() { ... }
  ```
- Sub-components and utilities: arrow functions acceptable

### 6. ESLint enforcement (planned)

Current ESLint config (`eslint-config-next`) does not enforce these conventions.
Planned additions:
- `func-style: ["warn", "declaration", { allowArrowFunctions: true }]` — enforce named
  function declarations for top-level exports
- `unicorn/filename-case` — enforce PascalCase for component files, camelCase for utilities

These will be added when the testing infrastructure (Stage 7) is configured, so that the
linter and test toolchain are set up together.

## Consequences

**Positive:**
- `page.tsx` files are always short and scannable
- Cypress component tests are trivially findable — same name, `.spec.cy.tsx` suffix
- IDE search for a component name (`ResearchProjectDetail`) finds the implementation file
  directly, not a generic `page.tsx`
- Consistent enough to be partially automated / lint-enforced

**Negative / Trade-offs:**
- More files per route folder than a monolithic `page.tsx` approach
- Requires discipline to keep `page.tsx` thin — not currently lint-enforced
- `func-style` lint rule will require refactoring existing arrow-function components when
  added

## Related

- ADR 002 — Testing Strategy (Cypress component tests, co-location)
