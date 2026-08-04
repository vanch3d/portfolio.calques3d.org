/**
 * /cv — smoke tests + accessibility checks
 *
 * ISR route — content is served from the Next.js cache (JSON files).
 * Accessibility: axe-core WCAG 2.1 AA checked on page load.
 */

describe("/cv", () => {
  beforeEach(() => {
    cy.visit("/cv");
    cy.injectAxe();
  });

  it("has no axe accessibility violations", () => {
    cy.checkA11y();
  });

  it("renders the page heading", () => {
    cy.get("h1").contains("Career Timeline");
  });

  it("renders at least one position", () => {
    cy.get("ol li").should("have.length.greaterThan", 0);
  });

  it("renders a back-to-home link", () => {
    cy.get('a[href="/"]').should("exist");
  });
});
