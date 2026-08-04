/**
 * /research — smoke tests
 *
 * These run against the built Next.js server (npm run build && npm run start).
 * Content is SSG — no network mocking needed; data is baked into the HTML.
 */

describe("/research listing", () => {
  beforeEach(() => {
    cy.visit("/research");
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

describe("/research/safesea detail", () => {
  beforeEach(() => {
    cy.visit("/research/safesea");
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
