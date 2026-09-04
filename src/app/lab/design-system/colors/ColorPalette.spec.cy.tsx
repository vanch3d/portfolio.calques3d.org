import { ColorPalette } from "./ColorPalette";

describe("ColorPalette", () => {
  it("renders all five colour swatches", () => {
    cy.mountAccessible(<ColorPalette />);
    cy.findByTestId("color-swatch-color-ground").should("be.visible");
    cy.findByTestId("color-swatch-color-ink").should("be.visible");
    cy.findByTestId("color-swatch-color-ink-secondary").should("be.visible");
    cy.findByTestId("color-swatch-color-ink-ghost").should("be.visible");
    cy.findByTestId("color-swatch-color-active").should("be.visible");
  });

  it("renders neutral and accent group headings", () => {
    cy.mountAccessible(<ColorPalette />);
    cy.get("#neutral-group-heading").should("contain.text", "Neutral");
    cy.get("#accent-group-heading").should("contain.text", "Accent");
  });

  it("renders exactly one active (red) swatch", () => {
    cy.mountAccessible(<ColorPalette />);
    cy.findByTestId("color-swatch-color-active").should("have.length", 1);
  });

  it("has no axe accessibility violations", () => {
    cy.mountAccessible(<ColorPalette />);
    cy.checkA11y();
  });
});
