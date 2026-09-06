/**
 * IdentityBlock — Cypress CT spec
 *
 * Tests the name / era label / positioning sentence block in isolation.
 * This is a Server Component using getTranslations — tested via cy.mountAccessible()
 * which provides the full NextIntlClientProvider context.
 *
 * Coverage:
 *   - Renders an h1 element
 *   - h1 contains the name text
 *   - Era label is rendered and visible
 *   - Positioning sentence is rendered and visible
 *   - Leading rule span is aria-hidden
 *   - a11y: default state
 */

import { IdentityBlock } from "./IdentityBlock";

describe("IdentityBlock", () => {
  beforeEach(() => {
    cy.mountAccessible(<IdentityBlock />);
  });

  it("renders an h1", () => {
    cy.get("h1").should("exist");
  });

  it("h1 contains the name", () => {
    cy.get("h1").should("contain.text", "Nicolas");
    cy.get("h1").should("contain.text", "Van Labeke");
  });

  it("renders the era label", () => {
    cy.contains("Research").should("be.visible");
    cy.contains("Engineering").should("be.visible");
  });

  it("renders the positioning sentence", () => {
    cy.contains("25 years").should("be.visible");
  });

  it("leading rule span is aria-hidden", () => {
    cy.get("[aria-hidden='true']").first().should("exist");
  });

  it("has no axe accessibility violations", () => {
    cy.checkA11y();
  });
});
