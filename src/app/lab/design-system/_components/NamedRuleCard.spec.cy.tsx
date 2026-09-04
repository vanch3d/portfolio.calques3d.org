import { NamedRuleCard } from "./NamedRuleCard";

describe("NamedRuleCard", () => {
  it("renders the one_red variant with name and statement", () => {
    cy.mountAccessible(<NamedRuleCard variant="one_red" />);
    cy.findByTestId("rule-card-one_red").should("be.visible");
    cy.contains("The One Red Rule").should("be.visible");
    cy.contains(
      "The compass-arc red appears exactly once per surface"
    ).should("be.visible");
  });

  it("renders the no_decoration variant", () => {
    cy.mountAccessible(<NamedRuleCard variant="no_decoration" />);
    cy.findByTestId("rule-card-no_decoration").should("be.visible");
    cy.contains("The No-Decoration Rule").should("be.visible");
  });

  it("renders the flat_by_construction variant", () => {
    cy.mountAccessible(<NamedRuleCard variant="flat_by_construction" />);
    cy.findByTestId("rule-card-flat_by_construction").should("be.visible");
    cy.contains("The Flat-by-Construction Rule").should("be.visible");
    cy.contains("No shadows").should("be.visible");
  });

  it("has no axe accessibility violations", () => {
    cy.mountAccessible(<NamedRuleCard variant="one_red" />);
    cy.checkA11y();
  });
});
