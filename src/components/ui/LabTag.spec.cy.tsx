import { LabTag } from "./LabTag";

describe("LabTag", () => {
  it("renders the tag text", () => {
    cy.mountAccessible(<LabTag>infrastructure</LabTag>);
    cy.contains("infrastructure").should("be.visible");
  });

  it("renders as a non-interactive element (span)", () => {
    cy.mountAccessible(<LabTag>process</LabTag>);
    cy.get("span").should("exist");
    cy.get("button").should("not.exist");
  });

  it("applies the optional aria-label when provided", () => {
    cy.mountAccessible(
      <LabTag label="Category: testing">testing</LabTag>
    );
    cy.get("span[aria-label='Category: testing']").should("exist");
  });

  it("has no axe accessibility violations", () => {
    cy.mountAccessible(<LabTag>accessibility</LabTag>);
    cy.checkA11y();
  });

  it("has no axe accessibility violations with aria-label", () => {
    cy.mountAccessible(
      <LabTag label="Tag: components">components</LabTag>
    );
    cy.checkA11y();
  });
});
