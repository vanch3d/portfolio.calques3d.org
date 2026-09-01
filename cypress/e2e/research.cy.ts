/**
 * /test/research — smoke tests + accessibility checks
 *
 * Verifies the research content pipeline end-to-end against the
 * built Next.js server (pnpm build && pnpm start).
 * Content is SSG — no network mocking needed; data is baked into the HTML.
 */

describe("/test/research", () => {
  beforeEach(() => {
    cy.visit("/test/research");
    cy.injectAxe();
  });

  it("has no axe accessibility violations", () => {
    cy.checkA11y();
  });

  it("renders the page heading with project count", () => {
    cy.get("h1").should("contain", "Research projects");
  });

  it("renders at least one project row", () => {
    cy.get("table tbody tr").should("have.length.greaterThan", 0);
  });

  it("renders a back link", () => {
    cy.get('a[href="/test"]').should("exist");
  });
});
