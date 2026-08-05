import { EraMarker } from "./EraMarker";

describe("EraMarker", () => {
  it("renders label and period", () => {
    cy.mountAccessible(
      <ol>
        <EraMarker label="Engineering Era" period="2017–present" />
      </ol>
    );
    cy.contains("Engineering Era").should("exist");
    cy.contains("2017–present").should("exist");
  });

  it("has no axe accessibility violations (engineering era)", () => {
    cy.mountAccessible(
      <ol>
        <EraMarker label="Engineering Era" period="2017–present" />
      </ol>
    );
    cy.checkA11y();
  });

  it("has no axe accessibility violations (research era)", () => {
    cy.mountAccessible(
      <ol>
        <EraMarker label="Research Era" period="1996–2017" />
      </ol>
    );
    cy.checkA11y();
  });
});
