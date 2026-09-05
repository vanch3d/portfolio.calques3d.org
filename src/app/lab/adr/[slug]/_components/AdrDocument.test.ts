// AdrDocument is a Server Component (uses getTranslations from next-intl/server).
// It cannot be mounted in Cypress CT. Behaviour is verified via E2E tests on /lab/adr/[slug].
// This file documents that decision — no unit test is required here.
//
// Smoke-check: the extractBodyExcerpt utility used by InsightCalloutBlock
// (co-located sibling) is covered by InsightCalloutBlock.test.ts.
