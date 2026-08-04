/**
 * /cv — smoke tests
 *
 * ISR route — content is served from the Next.js cache (JSON files).
 * No network mocking needed.
 */

describe("/cv", () => {
  beforeEach(() => {
    cy.visit("/cv");
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
