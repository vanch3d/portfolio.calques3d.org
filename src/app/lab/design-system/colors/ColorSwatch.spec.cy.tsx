import { ColorSwatch } from "./ColorSwatch";

describe("ColorSwatch", () => {
  it("renders the ground token swatch with name and hex", () => {
    cy.mountAccessible(<ColorSwatch token="color-ground" />);
    cy.findByTestId("color-swatch-color-ground").should("be.visible");
    cy.contains("Draughting Paper").should("be.visible");
    cy.contains("#f8f4ed").should("be.visible");
  });

  it("renders the ink token swatch", () => {
    cy.mountAccessible(<ColorSwatch token="color-ink" />);
    cy.findByTestId("color-swatch-color-ink").should("be.visible");
    cy.contains("Construction Graphite").should("be.visible");
    cy.contains("#2a2a2a").should("be.visible");
  });

  it("renders the ink-secondary token swatch", () => {
    cy.mountAccessible(<ColorSwatch token="color-ink-secondary" />);
    cy.findByTestId("color-swatch-color-ink-secondary").should("be.visible");
    cy.contains("Faded Graphite").should("be.visible");
  });

  it("renders the ink-ghost token swatch", () => {
    cy.mountAccessible(<ColorSwatch token="color-ink-ghost" />);
    cy.findByTestId("color-swatch-color-ink-ghost").should("be.visible");
    cy.contains("Ghost Line").should("be.visible");
  });

  it("renders the active token swatch", () => {
    cy.mountAccessible(<ColorSwatch token="color-active" />);
    cy.findByTestId("color-swatch-color-active").should("be.visible");
    cy.contains("Compass-Arc Red").should("be.visible");
    cy.contains("#c0392b").should("be.visible");
  });

  it("renders the swatch block as an img role with aria-label", () => {
    cy.mountAccessible(<ColorSwatch token="color-ground" />);
    cy.get("[role='img']").should("have.attr", "aria-label");
  });

  it("has no axe accessibility violations", () => {
    cy.mountAccessible(<ColorSwatch token="color-ground" />);
    cy.checkA11y();
  });
});
