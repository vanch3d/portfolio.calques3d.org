import { Aside } from "./Aside";

describe("Aside", () => {
  it("renders children", () => {
    cy.mountAccessible(<Aside>A sidebar note.</Aside>);
    cy.contains("A sidebar note.").should("be.visible");
  });

  it("uses an aside element", () => {
    cy.mountAccessible(<Aside>Content</Aside>);
    cy.get("aside").should("exist");
  });

  it("has no axe accessibility violations", () => {
    cy.mountAccessible(<Aside>Accessible aside content for testing.</Aside>);
    cy.checkA11y();
  });
});
