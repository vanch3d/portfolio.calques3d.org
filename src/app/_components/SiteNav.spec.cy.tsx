/**
 * SiteNav — Cypress CT spec
 *
 * Coverage:
 *   - Renders the nav element with accessible label
 *   - Hidden by default (nav-hidden class present, visible class absent)
 *   - When visible class is added to the nav, the component shows
 *   - All five nav links are rendered with correct hrefs
 *   - Contact link has aria-label="Contact"
 *   - Contact link carries the active border style (border-active class)
 *   - a11y: default state
 *   - a11y: visible state
 */

import { SiteNav } from "./SiteNav";

describe("SiteNav", () => {
  it("renders a nav element with aria-label", () => {
    cy.mountAccessible(<SiteNav id="site-nav" />);
    cy.get("nav").should("have.attr", "aria-label", "Site navigation");
  });

  it("has nav-hidden class by default (hidden above viewport)", () => {
    cy.mountAccessible(<SiteNav id="site-nav" />);
    cy.get("nav").should("have.class", "nav-hidden");
  });

  it("does not have visible class by default", () => {
    cy.mountAccessible(<SiteNav id="site-nav" />);
    cy.get("nav").should("not.have.class", "visible");
  });

  it("shows when the visible class is added by JS", () => {
    cy.mountAccessible(<SiteNav id="site-nav" />);
    cy.get("nav").then(($nav) => {
      $nav[0].classList.add("visible");
    });
    cy.get("nav").should("have.class", "visible");
  });

  it("renders the Research nav link", () => {
    cy.mountAccessible(<SiteNav />);
    cy.get("a[href='/research']").should("exist").and("contain.text", "Research");
  });

  it("renders the Engineering nav link", () => {
    cy.mountAccessible(<SiteNav />);
    cy.get("a[href='/engineering']").should("exist").and("contain.text", "Engineering");
  });

  it("renders the Publications nav link", () => {
    cy.mountAccessible(<SiteNav />);
    cy.get("a[href='/research/publications']").should("exist").and("contain.text", "Publications");
  });

  it("renders the Lab nav link", () => {
    cy.mountAccessible(<SiteNav />);
    cy.get("a[href='/lab']").should("exist").and("contain.text", "Lab");
  });

  it("renders the contact link with aria-label", () => {
    cy.mountAccessible(<SiteNav />);
    cy.get("a[href='/contact']").should("have.attr", "aria-label", "Contact");
  });

  it("contact link carries active border styling", () => {
    cy.mountAccessible(<SiteNav />);
    cy.get("a[href='/contact']").should("have.class", "border-active");
  });

  it("has no axe accessibility violations (default state)", () => {
    cy.mountAccessible(<SiteNav id="site-nav" />);
    cy.checkA11y();
  });

  it("has no axe accessibility violations (visible state)", () => {
    cy.mountAccessible(<SiteNav id="site-nav" />);
    cy.get("nav").then(($nav) => {
      $nav[0].classList.add("visible");
    });
    cy.checkA11y();
  });
});
