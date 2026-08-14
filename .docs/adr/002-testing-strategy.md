---
number: 2
title: "Testing Strategy"
status: decided
date: "2026-08-04"
tags: ["testing", "ci-cd", "quality"]
supersedes: []
---

# ADR 002 — Testing Strategy

**Date:** 2026-08-04
**Status:** Decided

## Context

The site has a mixed rendering architecture (SSG, SSR, ISR, CSR), external API dependencies (Zotero), and serves as an engineering portfolio showcase. Testing needs to cover both correctness and real-world deployment behaviour, while also serving as a learning exercise across modern testing toolchains.

## Decision

A four-layer testing strategy using distinct tools for distinct concerns:

| Layer | Tool | Target | Data | Trigger |
|---|---|---|---|---|
| Unit | Vitest | Logic, transforms, schema validation | None | Every push |
| Component | Cypress CT | Mounted React components | MSW mocks | Every push |
| Smoke E2E | Cypress | Local / localhost | MSW mocks | Every push |
| Full E2E | Playwright | Vercel preview deployment | Live APIs | Post-deploy |

### Tool responsibilities

**Vitest** — pure logic with no browser dependency: data transformation, content schema validation, Zotero response parsing, utility functions. Fast, runs in Node.

**Cypress Component Testing** — mounts individual components in a real browser. Catches rendering issues that jsdom would miss. Well-suited to a design portfolio where visual accuracy matters.

**Cypress E2E (smoke)** — fast, deterministic smoke tests against local dev server with MSW intercepting API calls. Answers: *"Does this page render correctly given this data shape?"*

**MSW (Mock Service Worker)** — shared API mocking layer used by both Cypress layers. Fixtures are snapshots of real Zotero responses, kept in version control.

**Playwright E2E** — runs against the Vercel preview deployment after each deploy. Hits live APIs (Zotero, real ISR revalidation, real routing). Answers: *"Does the real deployed site work for a real user?"* Catches issues that mocks never would: API downtime, ISR staleness, DNS/CDN edge cases.

## GitHub Actions flow

```
push
  └─ Vitest (unit)
  └─ Cypress (component + smoke, MSW mocks)
       └─ pass → Vercel deploys preview
                    └─ deploy webhook → Playwright (full E2E, live preview URL)
                                            └─ pass → ready to merge
```

## Consequences

**Positive:**
- Clear conceptual boundary between "correct given this data" (Cypress) and "works in production" (Playwright)
- Vercel preview deployments become a first-class testing target — real SSR/ISR behaviour is validated before merge
- Learning objective met: four distinct tools, each used appropriately
- The CI/CD pipeline itself is a portfolio piece demonstrating engineering practice
- MSW fixture snapshots serve as living documentation of expected API shapes

**Negative / Trade-offs:**
- Higher CI complexity than a single-tool approach
- Playwright against a live preview adds latency to the merge cycle
- MSW mocks can drift from real API responses — fixture refresh strategy needed
- Overkill for a portfolio with ~15 projects and infrequent content changes

## Cypress support file structure

```
cypress/
  support/
    component.ts          # CT entry point — registers cy.mount(), cy.mountWithIntl()
    e2e.ts                # E2E entry point — registers axe commands
    commands/             # All custom commands and CT helpers
      index.ts            # Axe logger, cy.checkA11y override, cy.mountAccessible
      IntlWrapper.tsx     # wrapWithIntl() — NextIntlClientProvider factory for CT
      # future: ThemeWrapper.tsx, RouterWrapper.tsx, ...
```

**Conventions:**
- `commands/index.ts` is the barrel — imported as `"./commands"` by both `component.ts` and `e2e.ts` (Node resolves `./commands` → `./commands/index.ts` automatically).
- Each helper is a `.tsx` file (JSX allowed) exporting a factory function, not a React component, to avoid `react/no-children-prop` when called from `component.ts`.
- New helpers get their own named file in `commands/`; do not append to `index.ts`.

## Alternatives Considered

- **Vitest + React Testing Library only** — sufficient for correctness, misses real deployment validation and browser rendering
- **Playwright only** — covers E2E well but loses fast local feedback loop and component-level isolation
- **Cypress only** — Component + E2E in one tool, but Cypress running against a real cloud deployment is slower and less reliable than Playwright
