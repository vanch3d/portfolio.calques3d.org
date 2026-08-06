/**
 * / — smoke tests + accessibility checks
 *
 * These run against the built Next.js server (npm run build && npm run start).
 * Content is static — no network mocking needed.
 *
 * Accessibility: axe-core WCAG 2.1 AA checked on page load.
 */

describe("/ home page", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.injectAxe();
  });

  it("has no axe accessibility violations", () => {
    cy.checkA11y();
  });

  it("renders the hero heading", () => {
    cy.get("h1").should("contain.text", "Nicolas Van");
  });

  it("renders the thesis statement", () => {
    cy.contains("Systems that communicate complexity.").should("exist");
  });

  it("renders the hero CTA navigation links", () => {
    cy.get("nav[aria-label]").contains("a", "Research").should("have.attr", "href", "/research");
    cy.get("nav[aria-label]").contains("a", "Engineering").should("have.attr", "href", "/engineering");
    cy.get("nav[aria-label]").contains("a", "CV").should("have.attr", "href", "/cv");
  });

  it("renders the featured work section with three cards", () => {
    cy.get("article").should("have.length", 3);
  });

  it("renders the currently banner", () => {
    cy.contains("Currently").should("exist");
  });

  it("currently banner links to engineering", () => {
    cy.get('a[href="/engineering"]').should("exist");
  });
});
