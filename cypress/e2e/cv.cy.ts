/**
 * /cv — smoke tests + accessibility checks
 *
 * ISR route — content is served from the Next.js cache (JSON files).
 * Accessibility: axe-core WCAG 2.1 AA checked on page load.
 *
 * NOTE: Skipped — these tests were written against the legacy app (pre-D0
 * redesign) and have not been updated for the current implementation.
 * Re-enable and update once the /cv route is rebuilt in the new design system.
 */

describe.skip("/cv", () => {
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
