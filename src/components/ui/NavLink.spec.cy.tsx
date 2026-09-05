import { NavLink } from "./NavLink";

describe("AppLink", () => {
  it("renders children as link text", () => {
    cy.mountAccessible(<NavLink href="/lab">Lab</NavLink>);
    cy.contains("Lab").should("be.visible");
  });

  it("renders as an anchor element pointing to the given href", () => {
    cy.mountAccessible(<NavLink href="/lab/adr">ADR</NavLink>);
    cy.get("a[href='/lab/adr']").should("exist");
  });

  it("accepts an arbitrary string href without TypeScript error", () => {
    cy.mountAccessible(<NavLink href="/lab/insights/001-some-slug">Insight</NavLink>);
    cy.get("a").should("have.attr", "href", "/lab/insights/001-some-slug");
  });

  it("has no axe accessibility violations", () => {
    cy.mountAccessible(<NavLink href="/lab">Lab</NavLink>);
    cy.checkA11y();
  });
});
