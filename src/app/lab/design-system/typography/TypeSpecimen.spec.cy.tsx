import { TypeSpecimen } from "./TypeSpecimen";

// TypeSpecimen renders a <li> — mount inside <ul> for valid HTML/axe context
function mount(role: Parameters<typeof TypeSpecimen>[0]["role"]) {
  cy.mountAccessible(
    <ul style={{ listStyle: "none", padding: 0 }}>
      <TypeSpecimen role={role} />
    </ul>
  );
}

describe("TypeSpecimen", () => {
  it("renders the display role with specimen text", () => {
    mount("display");
    cy.findByTestId("type-specimen-display").should("be.visible");
    cy.findByTestId("specimen-display")
      .should("be.visible")
      .and("contain.text", "Dr Nicolas Van Labeke");
  });

  it("renders the headline role", () => {
    mount("headline");
    cy.findByTestId("type-specimen-headline").should("be.visible");
    cy.findByTestId("specimen-headline").should("contain.text", "The Construction on Tracing Paper");
  });

  it("renders the title role", () => {
    mount("title");
    cy.findByTestId("type-specimen-title").should("be.visible");
  });

  it("renders the body role", () => {
    mount("body");
    cy.findByTestId("type-specimen-body").should("be.visible");
  });

  it("renders the label role with uppercase specimen text", () => {
    mount("label");
    cy.findByTestId("type-specimen-label").should("be.visible");
    cy.findByTestId("specimen-label").should("contain.text", "Era I");
  });

  it("renders the role label in the meta column", () => {
    mount("display");
    cy.contains("Display").should("be.visible");
  });

  it("has no axe accessibility violations", () => {
    mount("display");
    cy.checkA11y();
  });
});
