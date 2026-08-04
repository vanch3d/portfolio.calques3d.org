
---
number: 8
title: "GitHub Actions CI Pipeline"
status: decided
date: "2026-08-04"
tags: ["ci", "github-actions", "vercel", "cypress", "playwright", "testing"]
supersedes: []
---

# ADR 008 — GitHub Actions CI Pipeline

**Date:** 2026-08-04
**Status:** Decided

## Context

Stage 7 established a four-layer test suite: Vitest (unit), Cypress CT (component),
Cypress E2E (smoke), and Playwright (full E2E + accessibility). These tests need to
run automatically on every push and pull request.

The deployment target is Vercel (ADR 001). Playwright tests run against a live
deployment rather than localhost, so the CI pipeline must coordinate testing and
deployment order.

The workflow file is also a portfolio artefact — it demonstrates real CI/CD
engineering practice.

## Decision

A single workflow file at `.github/workflows/ci.yml` with six jobs:

```
validate ──┐
test-unit ─┤
            ├─► deploy-preview ──► test-playwright
test-ct ───┤         (main only)       (main only)
test-e2e ──┘
```

### Job summary

| Job | Trigger | Needs secrets | Depends on |
|---|---|---|---|
| `validate` | push + PR | no | — |
| `test-unit` | push + PR | no | — |
| `test-component` | push + PR | no | — |
| `test-e2e` | push + PR | ZOTERO_* | — |
| `deploy-preview` | push to main only | ZOTERO_* + VERCEL_* | all 4 above |
| `test-playwright` | push to main only | — | deploy-preview |

### validate job

Runs `npm run validate` (content schema + Mermaid syntax) and `npx tsc --noEmit`.
No server, no secrets. Fastest feedback loop for content/type errors.

### test-unit job

Runs Vitest (`npm test`). MSW node server stubs Zotero — no real API calls,
no secrets needed.

### test-component job

Uses `cypress-io/github-action@v6` with `component: true`. The action handles
`npm ci`, browser install, and headless CT run. No Next.js server: Cypress CT
bundles components via webpack (`devServer: { framework: 'next', bundler: 'webpack' }`).

### test-e2e job

Steps:
1. `npm ci` (manual — install first, before the action)
2. `npm run build` with ZOTERO_* env vars (ISR routes call Zotero at build time)
3. `cypress-io/github-action@v6` with `install: false`, `start: npm start`,
   `wait-on: http://localhost:3000`

The build step must precede the Cypress action; passing `install: false` avoids
a duplicate `npm ci`.

### deploy-preview job

Runs only on push to `main`, after all four test jobs pass. Uses Vercel CLI:

```
vercel pull --environment=production   # fetch .vercel/ settings + env vars
vercel build --prod                    # build with Vercel's env (incl. ZOTERO_*)
vercel deploy --prebuilt --prod        # upload prebuilt output, capture URL
```

The deployment URL is written to `GITHUB_OUTPUT` and consumed by `test-playwright`.

### test-playwright job

Runs only after `deploy-preview`. Sets `PLAYWRIGHT_BASE_URL` to the live URL.
Installs Chromium only (matches `playwright.config.ts`).

### PR handling

On pull requests: `validate`, `test-unit`, `test-component`, `test-e2e` all run.
`deploy-preview` and `test-playwright` are skipped — Vercel's GitHub App handles
PR preview deployments automatically (separate from this pipeline).

### Concurrency

```yaml
concurrency:
  group: ci-${{ github.ref }}
  cancel-in-progress: true
```

Cancels any in-progress CI run on the same branch when a new push arrives.

## Required GitHub Secrets

| Secret | Purpose |
|---|---|
| `ZOTERO_USER_ID` | Zotero API — user ID |
| `ZOTERO_API_KEY` | Zotero API — API key |
| `ZOTERO_COLLECTION_ID` | Zotero API — collection to fetch |
| `VERCEL_TOKEN` | Vercel CLI authentication |
| `VERCEL_ORG_ID` | Vercel organisation ID |
| `VERCEL_PROJECT_ID` | Vercel project ID |

ZOTERO_* values are also set in Vercel project settings (for production/preview
builds triggered by Vercel's own GitHub integration).

## Consequences

**Positive:**
- All four test layers run automatically on every push and PR
- Playwright tests hit the live Vercel deployment — closest to real user experience
- PRs get fast feedback (4 parallel jobs) without needing Vercel deploy
- `cancel-in-progress` avoids wasted CI minutes on superseded pushes
- Secrets scoped correctly: unit/CT never see Vercel credentials

**Negative / Trade-offs:**
- `test-playwright` only runs on merge to main — PRs skip it
  (mitigated by Cypress E2E axe checks which do run on PRs)
- Vercel deploy in CI runs in addition to Vercel's own GitHub integration,
  so two deployments are triggered on push to main
  (acceptable for now; the CLI deploy is the authoritative one for Playwright)
- Zotero rate limits: build + E2E both call the API — could add caching later

## Related

- ADR 001 — Deployment target (Vercel)
- ADR 002 — Testing strategy
- ADR 007 — Accessibility testing (axe-core)
- `.github/workflows/ci.yml` — the workflow itself
