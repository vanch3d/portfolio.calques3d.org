/**
 * AdrRegisterHeader — Cypress CT spec
 *
 * NOT RUNNABLE IN CT: AdrRegisterHeader is an async Server Component
 * (uses await getTranslations()). React DOM (client) cannot mount async
 * components in CT — mounting throws "Only Server Components can be async".
 *
 * Coverage path: cypress/e2e/adr.cy.ts > describe("AdrRegisterHeader")
 * mirrors this spec's narrative against the real rendered page.
 *
 * Note: the single-ADR edge case (min === max) is not testable in E2E
 * as it depends on real content. It needs seeded data or a mock server.
 */

// No-op — keeps Cypress from marking the file as an error
it("AdrRegisterHeader is covered by E2E — see cypress/e2e/adr.cy.ts > describe('AdrRegisterHeader')", () => {
  cy.log('CT not possible: async Server Component. See file comment.')
})
