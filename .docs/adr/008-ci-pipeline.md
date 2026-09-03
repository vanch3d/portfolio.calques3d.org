---
number: 8
title: "GitHub Actions CI Pipeline"
status: accepted
date: "2026-08-04"
decision-makers: vanch3d
tags: ["ci", "github-actions", "vercel", "cypress", "playwright", "testing"]
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

A single workflow file at `.github/workflows/ci.yml` with seven jobs.

### Pipeline shape

```
validate ──┐
test-unit ─┤
            ├─► deploy-staging ──► test-playwright ──► promote-production
test-ct ───┤    (preview URL)      (vs preview)         (vercel promote)
test-e2e ──┘

All on push to main. PRs run only the four test jobs.
```

### Core principle: build once, test on staging, promote atomically

The critical insight is that `vercel promote <url>` promotes an **already-built**
preview deployment to the production domain without rebuilding. This means:

- The artefact that was tested by Playwright is **identical** to what goes to production
- No new build risk at the promotion step
- Broken code never reaches production users
- Rollback (if ever needed) is `vercel rollback` — instant, no rebuild

### Job summary

| Job | Trigger | Needs secrets | Depends on |
|---|---|---|---|
| `validate` | push + PR | no | — |
| `test-unit` | push + PR | no | — |
| `test-component` | push + PR | no | — |
| `test-e2e` | push + PR | ZOTERO_* | — |
| `deploy-staging` | push to main only | ZOTERO_* + VERCEL_* | all 4 above |
| `test-playwright` | push to main only | — | deploy-staging |
| `promote-production` | push to main only | VERCEL_* | deploy-staging + test-playwright |

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
1. `npm ci` (manual — before the action)
2. `npm run build` with ZOTERO_* env vars (ISR routes call Zotero at build time)
3. `cypress-io/github-action@v6` with `install: false`, `start: npm start`,
   `wait-on: http://localhost:3000`

### deploy-staging job

Runs only on push to `main`, after all four test jobs pass. Uses Vercel CLI:

```
vercel pull --environment=production   # fetch production env vars
vercel build                           # build (no --prod flag)
vercel deploy --prebuilt               # deploy to preview, capture URL
```

Environment vars are pulled from the production environment so the staging build
is functionally identical to production. The absence of `--prod` on `vercel build`
and `vercel deploy` means the resulting deployment is a preview URL, not the live site.

### test-playwright job

Runs against the preview URL from `deploy-staging`. Sets `PLAYWRIGHT_BASE_URL` to
that URL. Installs Chromium only (matches `playwright.config.ts`).

If any Playwright test fails, `promote-production` is blocked — production is untouched.

### promote-production job

```
vercel promote <staging-url> --yes
```

Atomically aliases the tested preview deployment to the production domain.
No rebuild. The deployment that users see is byte-for-byte identical to what
Playwright tested.

### PR handling

On pull requests: `validate`, `test-unit`, `test-component`, `test-e2e` all run.
The three deployment/promotion jobs are skipped (main-only guard). Vercel's GitHub
App creates its own PR preview deployment independently.

### Concurrency

```yaml
concurrency:
  group: ci-${{ github.ref }}
  cancel-in-progress: true
```

Cancels any in-progress CI run on the same branch when a new push arrives.

## Why not the previous approach (deploy directly to production)?

The first version of this pipeline deployed to production with `vercel deploy --prod`
before running Playwright. If Playwright found a bug, it would require a manual
`vercel rollback`. While rollback is fast on Vercel, it is reactive — users could
see the broken deployment briefly.

The build-once/promote pattern eliminates this window entirely.

## Required GitHub Secrets

| Secret | Purpose |
|---|---|
| `ZOTERO_USER_ID` | Zotero API — user ID |
| `ZOTERO_API_KEY` | Zotero API — API key |
| `ZOTERO_COLLECTION_ID` | Zotero API — collection to fetch |
| `VERCEL_TOKEN` | Vercel CLI authentication |
| `VERCEL_ORG_ID` | Vercel organisation ID |
| `VERCEL_PROJECT_ID` | Vercel project ID |

ZOTERO_* values must also be set in Vercel project settings (for Vercel's own
GitHub integration builds on PRs and branches).

## Consequences

**Positive:**
- Broken code never reaches production — Playwright is a gate, not a post-check
- `vercel promote` is atomic — no rebuild risk, no partial state
- Instant rollback available if anything is discovered post-promotion
- PRs get fast feedback (4 parallel jobs) without deployment overhead
- Secrets scoped correctly: unit/CT never see Vercel credentials
- Pipeline itself is a portfolio artefact demonstrating standard devops practice

**Negative / Trade-offs:**
- Two Vercel deployments per push to main: the preview (from this pipeline) and
  any auto-deploy Vercel's GitHub integration triggers. The pipeline's `promote`
  is the authoritative one; Vercel's auto-deploy is redundant (can be disabled in
  Vercel project settings under Git → Production Branch)
- `test-playwright` runs only on merge to main — PRs skip it. Mitigated by
  Cypress E2E axe checks which do run on PRs
- Zotero API is called at build time in both `test-e2e` and `deploy-staging` jobs
  (two separate builds). Could be unified with build artifact caching in future

## Related

- ADR 001 — Deployment target (Vercel)
- ADR 002 — Testing strategy
- ADR 007 — Accessibility testing (axe-core)
- `.github/workflows/ci.yml` — the workflow itself
