// LabBreadcrumb is an async Server Component that calls getTranslations() from
// next-intl/server. It cannot be mounted in Cypress CT — cy.mountAccessible()
// renders components in a browser iframe via React, which cannot await an async
// component that calls server-side next-intl APIs.
//
// Coverage strategy:
// - E2E tests on /lab/adr and /lab/insights verify the breadcrumb renders
//   with correct segment labels and navigation links in a real browser context.
// - The NavLink sub-component used for each breadcrumb link is covered by
//   src/components/ui/NavLink.spec.cy.tsx.
// - The LabNav translation namespace (site_name, nav_lab, nav_adr, nav_insights,
//   nav_aria_label) is exercised through the E2E specs on those pages.
//
// See also: AdrDocument.test.ts, InsightDocument.test.ts — same pattern.
// See: ADR 019, Decision 4 — CT coverage for async Server Components: E2E-only.
