/**
 * InsightCalloutStrip — Cypress CT spec
 *
 * NOT RUNNABLE IN CT: InsightCalloutStrip is an async Server Component and
 * imports from "next-intl/server" which transitively pulls in "server-only".
 * The CT webpack bundle rejects "server-only" at compile time — the spec file
 * cannot even load. describe.skip is insufficient; the import itself must be absent.
 *
 * Coverage path: cypress/e2e/adr.cy.ts > describe("InsightCalloutStrip")
 * mirrors this spec's narrative against the real rendered page.
 *
 * To restore CT coverage: extract the presentational shell of InsightCalloutStrip
 * into a "use client" component that accepts pre-resolved strings as props,
 * then test that client component here.
 */

// No-op test to keep Cypress from marking the file as an error
it("InsightCalloutStrip is covered by E2E — see cypress/e2e/adr.cy.ts > describe('InsightCalloutStrip')", () => {
  cy.log("CT not possible: server-only import. See file comment.");
});
