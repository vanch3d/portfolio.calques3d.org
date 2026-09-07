/**
 * IdentityBlock — Cypress CT spec
 *
 * NOT RUNNABLE IN CT: IdentityBlock is an async Server Component
 * (uses await getTranslations()). React DOM (client) cannot mount async
 * components in CT — mounting throws "Only Server Components can be async".
 *
 * Coverage path: cypress/e2e/homepage.cy.ts > describe("IdentityBlock")
 * mirrors this spec's narrative against the real rendered page.
 */

// No-op — keeps Cypress from marking the file as an error
it("IdentityBlock is covered by E2E — see cypress/e2e/homepage.cy.ts > describe('IdentityBlock')", () => {
  cy.log("CT not possible: async Server Component. See file comment.");
});
