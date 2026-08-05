import { Button } from "./Button";

describe("Button", () => {
  it("renders ghost variant as button", () => {
    cy.mountAccessible(<Button>Click me</Button>);
    cy.get("button").should("contain.text", "Click me");
    cy.checkA11y();
  });

  it("renders ghost variant as link when href is provided", () => {
    cy.mountAccessible(<Button href="/research">Research</Button>);
    cy.get("a").should("have.attr", "href", "/research");
    cy.checkA11y();
  });

  it("renders primary variant", () => {
    cy.mountAccessible(<Button variant="primary">Go</Button>);
    cy.get("button").should("exist");
    cy.checkA11y();
  });

  it("has no axe accessibility violations", () => {
    cy.mountAccessible(
      <nav aria-label="Test nav">
        <Button href="/research">Research</Button>
        <Button href="/cv">CV</Button>
      </nav>
    );
    cy.checkA11y();
  });
});
