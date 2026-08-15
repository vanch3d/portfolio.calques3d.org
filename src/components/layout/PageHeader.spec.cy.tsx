import { PageHeader } from "./PageHeader";

describe("PageHeader", () => {
  it("renders the heading", () => {
    cy.mountAccessible(<PageHeader heading="Research" />);
    cy.contains("h1", "Research").should("exist");
  });

  it("renders tagline when provided", () => {
    cy.mountAccessible(<PageHeader heading="Research" tagline="Academic R&D work" />);
    cy.contains("Academic R&D work").should("exist");
  });

  it("omits tagline when not provided", () => {
    cy.mountAccessible(<PageHeader heading="Research" />);
    cy.contains("h1", "Research").closest("div").find("p").should("not.exist");
  });

  it("renders meta when provided", () => {
    cy.mountAccessible(<PageHeader heading="Research" meta="10 projects" />);
    cy.contains("10 projects").should("exist");
  });

  it("omits meta when not provided", () => {
    cy.mountAccessible(<PageHeader heading="CV" tagline="Career timeline" />);
    cy.contains("h1", "CV").closest("div").find("p").should("have.length", 1);
  });

  it("has no axe accessibility violations (heading only)", () => {
    cy.mountAccessible(<PageHeader heading="Research" />);
    cy.checkA11y();
  });

  it("has no axe accessibility violations (all props)", () => {
    cy.mountAccessible(
      <PageHeader heading="Research" tagline="Academic R&D work in AI and education." meta="10 projects · 1996–2017" />
    );
    cy.checkA11y();
  });
});
