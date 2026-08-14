import React from "react";
import { Breadcrumb } from "./Breadcrumb";

const twoLevel = [
  { label: "Engineering", href: "/engineering" },
  { label: "HiveMQ Edge" },
];

const threeLevel = [
  { label: "Home", href: "/" },
  { label: "Research", href: "/research" },
  { label: "SafeSea" },
];

describe("Breadcrumb", () => {
  it("renders 2-level breadcrumb without a11y violations", () => {
    cy.mountAccessible(<Breadcrumb items={twoLevel} />);
    cy.get("nav[aria-label='Breadcrumb']").should("exist");
    cy.contains("HiveMQ Edge").should("have.attr", "aria-current", "page");
    cy.checkA11y();
  });

  it("renders 3-level breadcrumb without a11y violations", () => {
    cy.mountAccessible(<Breadcrumb items={threeLevel} />);
    cy.contains("SafeSea").should("have.attr", "aria-current", "page");
    cy.contains("Research").should("have.attr", "href", "/research");
    cy.checkA11y();
  });

  it("renders ancestor items as links", () => {
    cy.mountAccessible(<Breadcrumb items={twoLevel} />);
    cy.contains("Engineering").should("have.attr", "href", "/engineering");
  });

  it("renders last item without a link", () => {
    cy.mountAccessible(<Breadcrumb items={twoLevel} />);
    cy.contains("HiveMQ Edge").should("not.have.attr", "href");
  });
});
