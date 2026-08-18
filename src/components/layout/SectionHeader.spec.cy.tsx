import { SectionHeader } from "./SectionHeader";

describe("SectionHeader", () => {
  it("renders the heading", () => {
    cy.mountAccessible(<SectionHeader heading="Skills" />);
    cy.contains("h2", "Skills").should("exist");
  });

  it("shows the rule line when ruled=true", () => {
    cy.mountAccessible(<SectionHeader heading="Skills" ruled />);
    cy.get("[aria-hidden='true']").should("exist");
  });

  it("omits the rule line when ruled=false", () => {
    cy.mountAccessible(<SectionHeader heading="Skills" />);
    cy.get("[aria-hidden='true']").should("not.exist");
  });

  it("applies mono styling when mono=true", () => {
    cy.mountAccessible(<SectionHeader heading="Research Era" mono />);
    cy.contains("h2", "Research Era").should("have.class", "font-mono");
  });

  it("uses standard heading style when mono=false", () => {
    cy.mountAccessible(<SectionHeader heading="Skills" />);
    cy.contains("h2", "Skills").should("have.class", "font-semibold");
  });

  it("forwards id to the h2 element for aria-labelledby linkage", () => {
    cy.mountAccessible(<SectionHeader heading="2016" id="year-2016" mono />);
    cy.get("h2#year-2016").should("exist");
  });

  it("has no axe accessibility violations (default)", () => {
    cy.mountAccessible(<SectionHeader heading="Skills" />);
    cy.checkA11y();
  });

  it("has no axe accessibility violations (ruled + mono)", () => {
    cy.mountAccessible(<SectionHeader heading="Research Era · 1996–2017" ruled mono />);
    cy.checkA11y();
  });
});
