/**
 * IdentityBlock — Cypress CT spec
 *
 * NOT RUNNABLE IN CT: IdentityBlock is an async Server Component
 * (uses await getTranslations()). React DOM (client) cannot mount async
 * components in CT — mounting throws "Only Server Components can be async".
 *
 * V4b R2 changes covered by E2E:
 *   - Wrapper has id="canvas-identity"
 *   - Wrapper is anchored upper-left (top: clamp(6rem, 14vh, 8rem))
 *   - h1 has id="canvas-name" for scroll handler targeting
 *   - h1 carries transition-opacity class for JS-driven fade
 *
 * Coverage path: cypress/e2e/homepage.cy.ts > describe("IdentityBlock")
 * mirrors this spec's narrative against the real rendered page.
 */

// No-op — keeps Cypress from marking the file as an error
it("IdentityBlock is covered by E2E — see cypress/e2e/homepage.cy.ts > describe('IdentityBlock')", () => {
  cy.log("CT not possible: async Server Component. See file comment.");
});
