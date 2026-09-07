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
  //
  // The homepage is the root surface — it has no breadcrumb and no nav active
  // segment. Zero active-marks is correct here; the One Red Rule applies when
  // there is a navigation context (sub-pages use a breadcrumb with one red segment).

  it("has no active-mark elements (root page has no breadcrumb)", () => {
    cy.get(".active-mark").should("have.length", 0);
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

  // ── IdentityBlock — server component coverage ─────────────────────────────
  // IdentityBlock is an async Server Component (await getTranslations) and
  // cannot be mounted in CT. These tests mirror the CT spec narrative exactly,
  // executed against the real rendered page. See IdentityBlock.spec.cy.tsx.
  describe("IdentityBlock", () => {
    it("renders an h1", () => {
      cy.get("h1").should("exist");
    });

    it("h1 contains the full name", () => {
      cy.get("h1").should("contain.text", "Nicolas");
      cy.get("h1").should("contain.text", "Van\u00a0Labeke");
    });

    it("renders the era label text", () => {
      cy.contains("Research").should("be.visible");
      cy.contains("Engineering").should("be.visible");
    });

    it("renders the positioning sentence", () => {
      cy.contains("25 years of precise practice").should("be.visible");
    });

    it("leading rule span inside the era-label paragraph is aria-hidden", () => {
      cy.get("p").first().find("[aria-hidden='true']").should("exist");
    });
  });
});
