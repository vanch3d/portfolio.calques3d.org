import { SectionLabel } from "./SectionLabel";

describe("SectionLabel", () => {
  it("renders children text", () => {
    cy.mountAccessible(<SectionLabel>Design System</SectionLabel>);
    cy.contains("Design System").should("be.visible");
  });

  it("renders with an id for aria-labelledby use", () => {
    cy.mountAccessible(<SectionLabel id="test-label">Named Rules</SectionLabel>);
    cy.get("#test-label").should("exist").and("contain.text", "Named Rules");
  });

  it("has no axe accessibility violations", () => {
    cy.mountAccessible(<SectionLabel>Design System</SectionLabel>);
    cy.checkA11y();
  });
});
