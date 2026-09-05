import { NavLink } from "@/components/ui/NavLink";

describe("AppLink (formerly LabLink)", () => {
  it("renders children as link text", () => {
    cy.mountAccessible(<NavLink href="/lab/design-system/colors">Colors</NavLink>);
    cy.contains("Colors").should("be.visible");
  });

  it("renders as an anchor element pointing to the given href", () => {
    cy.mountAccessible(
      <NavLink href="/lab/design-system/typography">Typography</NavLink>
    );
    cy.get("a[href='/lab/design-system/typography']").should("exist");
  });

  it("has no axe accessibility violations", () => {
    cy.mountAccessible(
      <NavLink href="/lab/design-system/colors">Colors</NavLink>
    );
    cy.checkA11y();
  });
});
