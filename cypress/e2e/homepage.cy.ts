/**
 * / — Homepage Cypress E2E spec
 *
 * Tests the homepage at page composition level.
 * Does NOT re-test what CT specs already cover (component rendering, prop variants).
 *
 * Focuses on:
 *   - Route load and page structure
 *   - Hero section presence and landmark
 *   - h1 visible in first viewport
 *   - One Red Rule: exactly one .active-mark element
 *   - Era blocks below the fold (both present)
 *   - Era nav links present
 *   - Scroll prompt is aria-hidden
 *   - Page-level a11y
 */

describe("/ — homepage", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.injectAxe();
  });

  // ── Page load ────────────────────────────────────────────────────────────

  it("loads without error", () => {
    cy.location("pathname").should("eq", "/");
  });

  it("has no axe accessibility violations", () => {
    cy.checkA11y();
  });

  // ── Hero section ─────────────────────────────────────────────────────────

  it("renders a hero section with aria-label", () => {
    cy.get("section[aria-label]").should("exist");
  });

  it("renders a visible h1 in the hero", () => {
    cy.get("h1").should("be.visible");
  });

  it("h1 contains the name", () => {
    cy.get("h1").should("contain.text", "Nicolas");
  });

  it("renders the positioning sentence", () => {
    cy.contains("25 years").should("be.visible");
  });

  it("scroll prompt is aria-hidden", () => {
    cy.contains("Scroll").closest("[aria-hidden='true']").should("exist");
  });

  // ── One Red Rule ──────────────────────────────────────────────────────────

  it("has exactly one active-mark element on the page", () => {
    cy.get(".active-mark").should("have.length", 1);
  });

  // ── Era blocks ────────────────────────────────────────────────────────────

  it("renders both era headings", () => {
    cy.contains("h2", "Research").should("exist");
    cy.contains("h2", "Engineering").should("exist");
  });

  it("renders era date spans", () => {
    cy.contains("1995").should("exist");
    cy.contains("2018").should("exist");
  });

  it("renders nav links to research and engineering", () => {
    cy.get("a[href='/research']").should("exist");
    cy.get("a[href='/engineering']").should("exist");
  });
});
