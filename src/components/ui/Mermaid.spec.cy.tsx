import { Mermaid } from "./Mermaid";

const SIMPLE_CHART = `flowchart LR
    A["Start"] --> B["End"]`;

const FLOWCHART = `flowchart LR
    D["Device"] --> A["Adapter"]
    A -->|publish| B["Broker"]
    B --> C["Cloud"]`;

const INVALID_CHART = `flowchart LR
    %%%INVALID SYNTAX%%%`;

describe("<Mermaid />", () => {
  it("renders an SVG for a valid flowchart", () => {
    cy.mountAccessible(<Mermaid chart={SIMPLE_CHART} />);
    // Mermaid renders asynchronously — wait for the SVG to appear
    cy.get('div[role="img"] svg', { timeout: 8000 }).should("exist");
  });

  it("renders an SVG for a multi-node flowchart", () => {
    cy.mountAccessible(<Mermaid chart={FLOWCHART} />);
    cy.get('div[role="img"] svg', { timeout: 8000 }).should("exist");
  });

  it("shows an error state for an invalid chart instead of failing silently", () => {
    cy.mountAccessible(<Mermaid chart={INVALID_CHART} />);
    // Should render the error pre rather than an empty div
    cy.get("pre", { timeout: 8000 }).should("contain.text", "[Diagram error]");
    cy.get('div[role="img"] svg').should("not.exist");
  });

  it("has no axe accessibility violations (rendered diagram)", () => {
    cy.mountAccessible(<Mermaid chart={SIMPLE_CHART} />);
    cy.get('div[role="img"] svg', { timeout: 8000 }).should("exist");
    cy.checkA11y();
  });
});
