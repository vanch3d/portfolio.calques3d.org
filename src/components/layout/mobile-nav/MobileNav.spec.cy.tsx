import React from "react";
import { MobileNav } from ".";
import type { NavLink } from "../NavLinkItem";

const links: NavLink[] = [
  { href: "/research", label: "Research" },
  { href: "/engineering", label: "Engineering" },
  { href: "/cv", label: "CV" },
  { href: "/lab", label: "Lab" },
];

describe("MobileNav", () => {
  it("renders the hamburger trigger without a11y violations", () => {
    cy.mountAccessible(<MobileNav links={links} />);
    cy.checkA11y();
  });

  it("trigger has a descriptive aria-label when closed", () => {
    cy.mountAccessible(<MobileNav links={links} />);
    cy.get("button[aria-label='Open navigation menu']").should("exist");
  });

  it("opens the drawer on trigger click", () => {
    cy.mountAccessible(<MobileNav links={links} />);
    cy.get("button[aria-label='Open navigation menu']").click();
    cy.get("nav[aria-label='Mobile navigation']").should("be.visible");
  });

  it("renders all nav links inside the drawer", () => {
    cy.mountAccessible(<MobileNav links={links} />);
    cy.get("button[aria-label='Open navigation menu']").click();
    cy.get("nav[aria-label='Mobile navigation']").within(() => {
      cy.contains("Research").should("exist");
      cy.contains("Engineering").should("exist");
      cy.contains("CV").should("exist");
      cy.contains("Lab").should("exist");
    });
  });

  it("has no a11y violations when drawer is open", () => {
    cy.mountAccessible(<MobileNav links={links} />);
    cy.get("button[aria-label='Open navigation menu']").click();
    cy.get("nav[aria-label='Mobile navigation']").should("be.visible");
    cy.checkA11y();
  });

  it("closes the drawer when the in-drawer close button is clicked", () => {
    cy.mountAccessible(<MobileNav links={links} />);
    cy.get("button[aria-label='Open navigation menu']").click();
    cy.get("nav[aria-label='Mobile navigation']").should("be.visible");
    cy.get("[id='mobile-nav-drawer'] button[aria-label='Close navigation menu']").click();
    cy.get("nav[aria-label='Mobile navigation']").should("not.exist");
  });
});
