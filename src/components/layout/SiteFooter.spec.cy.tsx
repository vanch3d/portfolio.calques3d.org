import React from "react";
import { SiteFooter } from "./SiteFooter";

describe("SiteFooter", () => {
  it("renders without a11y violations", () => {
    cy.mountAccessible(<SiteFooter />);
    cy.checkA11y();
  });

  it("renders the copyright notice with the current year", () => {
    cy.mountAccessible(<SiteFooter />);
    cy.get("footer").contains(new Date().getFullYear().toString());
  });

  it("renders a GitHub link that opens in a new tab", () => {
    cy.mountAccessible(<SiteFooter />);
    cy.get("footer a[href*='github.com']")
      .should("have.attr", "target", "_blank")
      .and("have.attr", "rel", "noopener noreferrer");
  });

  it("renders an internal Lab link", () => {
    cy.mountAccessible(<SiteFooter />);
    cy.get("footer a[href='/lab']").should("have.text", "Lab");
  });
});
