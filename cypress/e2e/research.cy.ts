/**
 * /research — smoke tests + accessibility checks
 *
 * These run against the built Next.js server (npm run build && npm run start).
 * Content is SSG — no network mocking needed; data is baked into the HTML.
 *
 * Accessibility: axe-core WCAG 2.1 AA checked on every page visit.
 * App Router note: axe runs against the fully rendered DOM (SSG HTML +
 * client hydration), so Server Component output is covered automatically.
 *
 * NOTE: Skipped — these tests were written against the legacy app (pre-D0
 * redesign) and have not been updated for the current implementation.
 * Re-enable and update once the /research routes are rebuilt in the new
 * design system.
 */

describe.skip("/research listing", () => {
  beforeEach(() => {
    cy.visit("/research");
    cy.injectAxe();
  });

  it("has no axe accessibility violations", () => {
    cy.checkA11y();
  });

  it("renders the page heading", () => {
    cy.get("h1").contains("Research");
  });

  it("renders at least one project card", () => {
    cy.get("article").should("have.length.greaterThan", 0);
  });

  it("each card links to a project detail page", () => {
    cy.get("article a").each(($a) => {
      cy.wrap($a)
        .should("have.attr", "href")
        .and("match", /^\/research\/.+/);
    });
  });
});

describe.skip("/research/safesea detail", () => {
  beforeEach(() => {
    cy.visit("/research/safesea");
    cy.injectAxe();
  });

  it("has no axe accessibility violations", () => {
    cy.checkA11y();
  });

  it("renders the project heading", () => {
    cy.get("h1").should("not.be.empty");
  });

  it("renders a back-to-listing link", () => {
    cy.get('a[href="/research"]').should("exist");
  });

  it("renders the publications section", () => {
    cy.get("#publications-heading").contains("Publications");
  });
});
