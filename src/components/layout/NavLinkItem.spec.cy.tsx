import React from "react";
import { NavLinkItem } from "./NavLinkItem";

describe("NavLinkItem", () => {
  it("renders a link with the correct href", () => {
    cy.mountAccessible(<NavLinkItem href="/research" label="Research" />);
    cy.get("a[href='/research']").should("contain.text", "Research");
  });

  it("has no a11y violations when inactive", () => {
    cy.mountAccessible(<NavLinkItem href="/research" label="Research" />);
    cy.checkA11y();
  });

  it("has no a11y violations when active", () => {
    cy.mountAccessible(<NavLinkItem href="/research" label="Research" />, {
      pathname: "/research",
    });
    cy.checkA11y();
  });

  it("sets aria-current=page when the pathname matches", () => {
    cy.mountAccessible(<NavLinkItem href="/research" label="Research" />, {
      pathname: "/research",
    });
    cy.get("a").should("have.attr", "aria-current", "page");
  });

  it("sets aria-current=page when on a child route", () => {
    cy.mountAccessible(<NavLinkItem href="/research" label="Research" />, {
      pathname: "/research/safesea",
    });
    cy.get("a").should("have.attr", "aria-current", "page");
  });

  it("does not set aria-current when inactive", () => {
    cy.mountAccessible(<NavLinkItem href="/research" label="Research" />, {
      pathname: "/cv",
    });
    cy.get("a").should("not.have.attr", "aria-current");
  });
});
