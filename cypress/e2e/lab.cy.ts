/**
 * /lab — Cypress E2E spec
 *
 * Tests the lab index page at the page composition level.
 * Component-level assertions (DOM structure of individual atoms, class names,
 * prop variants) belong in CT specs. This spec focuses on:
 *   - Page load and HTTP response
 *   - Breadcrumb structure and active state
 *   - The One Red Rule: exactly one active-mark element per surface
 *   - Navigation links are present, correct, and functional
 *   - Sub-route links are listed under the parent section
 *   - Page-level accessibility (full page, not individual components)
 *
 * Requires: pnpm build && pnpm start (or pnpm dev)
 */

describe("/lab — index", () => {
  beforeEach(() => {
    cy.visit("/lab");
    cy.injectAxe();
  });

  // ── Page load ────────────────────────────────────────────────────────────

  it("loads without error", () => {
    cy.location("pathname").should("eq", "/lab");
    cy.get("main").should("exist");
  });

  // ── Accessibility — must be first substantive check ──────────────────────

  it("has no axe accessibility violations", () => {
    cy.checkA11y();
  });

  // ── Breadcrumb ───────────────────────────────────────────────────────────

  it("breadcrumb contains a link to the homepage", () => {
    cy.get("nav[aria-label='Breadcrumb'] a[href='/']").should("exist");
  });

  it("breadcrumb marks 'Lab' as the current page with aria-current", () => {
    cy.get("[aria-current='page']").should("contain.text", "Lab");
  });

  // ── The One Red Rule ─────────────────────────────────────────────────────

  it("has exactly one active-mark element (One Red Rule)", () => {
    // The design system invariant: one compass-arc red per surface.
    // On /lab the active mark is the 'Lab' breadcrumb segment.
    cy.get(".active-mark").should("have.length", 1);
  });

  it("the single active-mark is the Lab breadcrumb segment", () => {
    cy.get(".active-mark").should("contain.text", "Lab");
  });

  // ── Navigation links ─────────────────────────────────────────────────────

  it("shows a link to /lab/design-system", () => {
    cy.get("a[href='/lab/design-system']").should("exist");
  });

  it("shows a link to /lab/adr", () => {
    cy.get("a[href='/lab/adr']").should("exist");
  });

  it("lists the Colors sub-route under Design System", () => {
    cy.get("a[href='/lab/design-system/colors']").should("exist");
  });

  it("lists the Typography sub-route under Design System", () => {
    cy.get("a[href='/lab/design-system/typography']").should("exist");
  });

  // ── Navigation flows ─────────────────────────────────────────────────────

  it("navigates to /lab/design-system on click", () => {
    cy.get("a[href='/lab/design-system']").first().click();
    cy.location("pathname").should("eq", "/lab/design-system");
  });

  it("navigates to /lab/adr on click", () => {
    cy.visit("/lab");
    cy.get("a[href='/lab/adr']").first().click();
    cy.location("pathname").should("eq", "/lab/adr");
  });
});
