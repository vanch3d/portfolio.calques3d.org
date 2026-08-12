import { SectionHeader } from "./SectionHeader";

describe("<SectionHeader />", () => {
  it("has no axe accessibility violations (with tagline)", () => {
    cy.mountAccessible(
      <SectionHeader heading="Engineering" tagline="Frontend career (2018–present)." />
    );
    cy.checkA11y();
  });

  it("has no axe accessibility violations (heading only)", () => {
    cy.mountAccessible(<SectionHeader heading="Engineering" />);
    cy.checkA11y();
  });

  it("renders the heading as h1", () => {
    cy.mount(<SectionHeader heading="Engineering" />);
    cy.get("h1").contains("Engineering");
  });

  it("renders the tagline when provided", () => {
    cy.mount(
      <SectionHeader heading="Engineering" tagline="Frontend career." />
    );
    cy.contains("Frontend career.");
  });

  it("omits the tagline paragraph when not provided", () => {
    cy.mount(<SectionHeader heading="Engineering" />);
    cy.get("p").should("not.exist");
  });
});
