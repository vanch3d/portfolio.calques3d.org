/**
 * /engineering — smoke tests + accessibility checks
 *
 * These run against the built Next.js server (npm run build && npm run start).
 * Content is SSG — no network mocking needed; data is baked into the HTML.
 *
 * Accessibility: axe-core WCAG 2.1 AA checked on every page visit.
 */

describe("/engineering listing", () => {
  beforeEach(() => {
    cy.visit("/engineering");
    cy.injectAxe();
  });

  it("has no axe accessibility violations", () => {
    cy.checkA11y();
  });

  it("renders the page heading", () => {
    cy.get("h1").contains("Engineering");
  });

  it("renders at least one project card", () => {
    cy.get("article").should("have.length.greaterThan", 0);
  });

  it("public and proprietary cards link to a detail page", () => {
    cy.get('article a[href^="/engineering/"]').should(
      "have.length.greaterThan",
      0
    );
  });

  it("redacted cards have no detail page link", () => {
    // intrica is the only redacted project — verify its card has no link
    cy.contains("article", "Intrica").within(() => {
      cy.get('a[href^="/engineering/"]').should("not.exist");
    });
  });
});
