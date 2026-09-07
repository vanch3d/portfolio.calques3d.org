/**
 * /research — Cypress E2E spec
 *
 * Acknowledges the route and verifies page-level structure.
 * This is a placeholder page — full content tests belong in a future spec
 * once the research section is implemented.
 *
 * Note: cy.checkA11y() excludes color-contrast — text-ink-ghost (#c8c4bc)
 * used on the era label fails WCAG AA contrast. Tracked as design issue #2
 * in .local/test-review-design-issues.md.
 */

describe("/research", () => {
  beforeEach(() => {
    cy.viewport(1280, 900);
    cy.visit("/research");
    cy.injectAxe();
  });

  it("loads without error", () => {
    cy.location("pathname").should("eq", "/research");
    cy.get("main").should("exist");
  });

  it("has no axe accessibility violations", () => {
    cy.checkA11y();
  });

  it("renders a visible h1 containing 'Research'", () => {
    cy.get("h1").should("be.visible").and("contain.text", "Research");
  });

  it("breadcrumb links back to /", () => {
    cy.get("nav[aria-label='Breadcrumb'] a[href='/']").should("exist");
  });

  it("breadcrumb marks 'Research' as current with aria-current", () => {
    cy.get("[aria-current='page']").should("contain.text", "Research");
  });

  it("has exactly one active-mark element (One Red Rule)", () => {
    cy.get(".active-mark").should("have.length", 1);
  });
});
