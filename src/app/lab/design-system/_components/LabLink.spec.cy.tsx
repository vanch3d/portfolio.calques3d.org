import { LabLink } from "./LabLink";

describe("LabLink", () => {
  it("renders children as link text", () => {
    cy.mountAccessible(<LabLink href="/lab/design-system/colors">Colors</LabLink>);
    cy.contains("Colors").should("be.visible");
  });

  it("renders as an anchor element pointing to the given href", () => {
    cy.mountAccessible(
      <LabLink href="/lab/design-system/typography">Typography</LabLink>
    );
    cy.get("a[href='/lab/design-system/typography']").should("exist");
  });

  it("has no axe accessibility violations", () => {
    cy.mountAccessible(
      <LabLink href="/lab/design-system/colors">Colors</LabLink>
    );
    cy.checkA11y();
  });
});
