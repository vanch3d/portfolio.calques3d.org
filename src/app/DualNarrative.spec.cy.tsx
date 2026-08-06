import { DualNarrative, type DualNarrativeLabels } from "./DualNarrative";

const labels: DualNarrativeLabels = {
  sectionLabel: "Career overview",
  researchEraLabel: "Research Era",
  researchEraPeriod: "1996–2017",
  researchEraBody: "Twenty years of academic R&D.",
  engineeringEraLabel: "Engineering Era",
  engineeringEraPeriod: "2017–present",
  engineeringEraBody: "From research to production engineering.",
};

describe("DualNarrative", () => {
  beforeEach(() => {
    cy.mountAccessible(<DualNarrative labels={labels} />);
  });

  it("renders both era labels", () => {
    cy.contains("Research Era").should("exist");
    cy.contains("Engineering Era").should("exist");
  });

  it("renders both period strings", () => {
    cy.contains("1996–2017").should("exist");
    cy.contains("2017–present").should("exist");
  });

  it("has no axe accessibility violations", () => {
    cy.checkA11y();
  });
});
