import { Badge } from "./Badge";

describe("Badge", () => {
  it("renders default variant", () => {
    cy.mountAccessible(<Badge>NLP</Badge>);
    cy.get("span").should("contain.text", "NLP");
    cy.checkA11y();
  });

  it("renders type variant", () => {
    cy.mountAccessible(<Badge variant="type">research</Badge>);
    cy.get("span").should("contain.text", "research");
    cy.checkA11y();
  });

  it("has no axe accessibility violations (default)", () => {
    cy.mountAccessible(
      <div>
        <Badge>AI</Badge>
        <Badge>Education</Badge>
      </div>
    );
    cy.checkA11y();
  });

  it("has no axe accessibility violations (type variant)", () => {
    cy.mountAccessible(<Badge variant="type">employment</Badge>);
    cy.checkA11y();
  });
});
