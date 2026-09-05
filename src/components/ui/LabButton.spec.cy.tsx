import { LabButton } from "./LabButton";

describe("LabButton", () => {
  it("renders children as button text", () => {
    cy.mountAccessible(<LabButton>Click me</LabButton>);
    cy.get("button").should("contain.text", "Click me");
  });

  it("has role=button", () => {
    cy.mountAccessible(<LabButton>Action</LabButton>);
    cy.get("button").should("exist");
  });

  it("sets aria-pressed when pressed=true", () => {
    cy.mountAccessible(<LabButton pressed={true}>Active</LabButton>);
    cy.get("[aria-pressed='true']").should("exist");
  });

  it("sets aria-pressed=false when pressed=false", () => {
    cy.mountAccessible(<LabButton pressed={false}>Inactive</LabButton>);
    cy.get("[aria-pressed='false']").should("exist");
  });

  it("is disabled when disabled=true", () => {
    cy.mountAccessible(<LabButton disabled>Disabled</LabButton>);
    cy.get("button").should("be.disabled");
  });

  it("applies aria-label when provided", () => {
    cy.mountAccessible(<LabButton aria-label="Custom label">B</LabButton>);
    cy.get("[aria-label='Custom label']").should("exist");
  });

  it("has no axe accessibility violations", () => {
    cy.mountAccessible(<LabButton>Action</LabButton>);
    cy.checkA11y();
  });

  it("has no axe violations when pressed", () => {
    cy.mountAccessible(<LabButton pressed={true}>Tag</LabButton>);
    cy.checkA11y();
  });

  it("has no axe violations when disabled", () => {
    cy.mountAccessible(<LabButton disabled>Disabled</LabButton>);
    cy.checkA11y();
  });
});
