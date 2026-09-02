import { Mermaid } from "./Mermaid";

const SIMPLE_CHART = "graph TD\n  A --> B";

describe("Mermaid", () => {
  it("renders a container div", () => {
    cy.mountAccessible(<Mermaid chart={SIMPLE_CHART} />);
    cy.get("div[role='img']").should("exist");
  });

  it("exposes an aria-label on the container", () => {
    cy.mountAccessible(<Mermaid chart={SIMPLE_CHART} />);
    cy.get("[role='img']").should("have.attr", "aria-label", "Diagram");
  });

  it("has no axe accessibility violations", () => {
    cy.mountAccessible(<Mermaid chart={SIMPLE_CHART} />);
    cy.checkA11y();
  });
});
