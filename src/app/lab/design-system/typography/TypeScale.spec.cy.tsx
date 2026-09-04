import { TypeScale } from "./TypeScale";

describe("TypeScale", () => {
  it("renders all five type specimen rows", () => {
    cy.mountAccessible(<TypeScale />);
    cy.findByTestId("type-specimen-display").should("be.visible");
    cy.findByTestId("type-specimen-headline").should("be.visible");
    cy.findByTestId("type-specimen-title").should("be.visible");
    cy.findByTestId("type-specimen-body").should("be.visible");
    cy.findByTestId("type-specimen-label").should("be.visible");
  });

  it("renders exactly five specimens", () => {
    cy.mountAccessible(<TypeScale />);
    cy.get("li").should("have.length", 5);
  });

  it("has no axe accessibility violations", () => {
    cy.mountAccessible(<TypeScale />);
    cy.checkA11y();
  });
});
