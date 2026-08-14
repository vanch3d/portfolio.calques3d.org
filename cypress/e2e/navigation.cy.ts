/**
 * Navigation smoke tests — checks that the NavigationBar, skip link, and
 * footer are present and accessible across all main routes.
 *
 * Runs against the built Next.js server (pnpm run build && pnpm run start).
 */

const ROUTES = ["/", "/research", "/cv"];

describe("NavigationBar", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.injectAxe();
  });

  it("has no axe accessibility violations", () => {
    cy.checkA11y();
  });

  it("renders the skip-to-content link as the first focusable element", () => {
    cy.get("a[href='#main-content']").should("exist");
  });

  it("renders the wordmark linking to home", () => {
    cy.get("header a[href='/']").should("exist");
  });

  it("renders all four navigation links on desktop", () => {
    cy.viewport(1280, 800);
    cy.get("nav[aria-label='Main navigation']").within(() => {
      cy.contains("a", "Research").should("have.attr", "href", "/research");
      cy.contains("a", "Engineering").should("have.attr", "href", "/engineering");
      cy.contains("a", "CV").should("have.attr", "href", "/cv");
      cy.contains("a", "Lab").should("have.attr", "href", "/lab");
    });
  });

  it("marks the active link with aria-current=page", () => {
    cy.visit("/research");
    cy.injectAxe();
    cy.get("nav[aria-label='Main navigation'] a[href='/research']")
      .should("have.attr", "aria-current", "page");
  });

  it("renders the theme toggle button", () => {
    cy.get("header button[aria-label]").should("exist");
  });
});

describe("Skip link", () => {
  it("targets the main content landmark", () => {
    cy.visit("/");
    cy.get("#main-content").should("exist");
    cy.get("a[href='#main-content']").should("exist");
  });
});

describe("SiteFooter", () => {
  it("renders the GitHub link", () => {
    cy.visit("/");
    cy.injectAxe();
    cy.get("footer a[href*='github.com']").should("exist");
  });

  it("has no axe accessibility violations", () => {
    cy.checkA11y("footer");
  });
});

ROUTES.forEach((route) => {
  describe(`Navigation present on ${route}`, () => {
    beforeEach(() => {
      cy.visit(route);
      cy.injectAxe();
    });

    it("renders a header element", () => {
      cy.get("header").should("exist");
    });

    it("renders a main content landmark", () => {
      cy.get("main#main-content").should("exist");
    });

    it("renders a footer", () => {
      cy.get("footer").should("exist");
    });
  });
});
