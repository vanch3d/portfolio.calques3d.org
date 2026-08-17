/**
 * /publications — smoke tests + accessibility checks
 *
 * Runs against the built Next.js server (pnpm run build && pnpm run start).
 * Page is dynamic (Zotero ISR) — no network mocking; asserts against live data.
 *
 * Accessibility: axe-core WCAG 2.1 AA checked on page load.
 */

describe("/publications", () => {
  beforeEach(() => {
    cy.visit("/publications");
    cy.injectAxe();
  });

  it("has no axe accessibility violations", () => {
    cy.checkA11y();
  });

  it("renders the page heading", () => {
    cy.get("h1").contains("Publications");
  });

  it("shows a publication count in the page header", () => {
    // Meta line contains a count like "45 publications"
    cy.contains(/\d+ publication/).should("exist");
  });

  it("groups publications into year sections", () => {
    // Each year section has a heading with a 4-digit year
    cy.get("section[aria-labelledby^='year-']").should("have.length.greaterThan", 0);
    cy.get("section[aria-labelledby^='year-'] h2").each(($h) => {
      expect($h.text().trim()).to.match(/^\d{4}$/);
    });
  });

  it("renders year sections in descending order", () => {
    cy.get("section[aria-labelledby^='year-'] h2").then(($headings) => {
      const years = [...$headings].map((el) => parseInt(el.textContent ?? "0", 10));
      for (let i = 0; i < years.length - 1; i++) {
        expect(years[i]).to.be.greaterThan(years[i + 1]);
      }
    });
  });

  it("renders at least one DOI link", () => {
    cy.get("a[href^='https://doi.org']").should("have.length.greaterThan", 0);
  });

  it("DOI links open in a new tab with rel=noopener", () => {
    cy.get("a[href^='https://doi.org']").first().then(($a) => {
      expect($a.attr("target")).to.equal("_blank");
      expect($a.attr("rel")).to.include("noopener");
    });
  });

  it("renders at least one PDF download link", () => {
    cy.get("a[href$='/pdf']").should("have.length.greaterThan", 0);
  });

  it("PDF download links point to the key-based content route", () => {
    cy.get("a[href$='/pdf']").first().then(($a) => {
      expect($a.attr("href")).to.match(/^\/publications\/[A-Z0-9]{8}\/pdf$/i);
      expect($a.attr("target")).to.equal("_blank");
    });
  });
});
