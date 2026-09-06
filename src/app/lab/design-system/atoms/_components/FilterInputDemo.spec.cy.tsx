/**
 * FilterInputDemo — Cypress CT spec
 *
 * Tests the client wrapper that holds controlled state for the atoms page.
 *
 * Coverage:
 *   - Renders FilterInput with provided placeholder
 *   - startAddon prop renders the addon
 *   - Typing updates the displayed value
 *   - No startAddon rendered when prop is absent
 *   - initialValue pre-fills the input
 *   - a11y: default state
 *   - a11y: with startAddon
 */

import { FilterInputDemo } from "./FilterInputDemo";

describe("FilterInputDemo", () => {
  it("renders FilterInput with the provided placeholder", () => {
    cy.mountAccessible(
      <FilterInputDemo placeholder="SEARCH..." ariaLabel="Search records" />
    );
    cy.get("input[type='text']").should("have.attr", "placeholder", "SEARCH...");
  });

  it("renders the startAddon when provided", () => {
    cy.mountAccessible(
      <FilterInputDemo
        placeholder="SEARCH..."
        ariaLabel="Search records"
        startAddon="⌕"
      />
    );
    cy.contains("⌕").should("exist");
  });

  it("does not render startAddon when prop is absent", () => {
    cy.mountAccessible(
      <FilterInputDemo placeholder="SEARCH..." ariaLabel="Search records" />
    );
    cy.get("[aria-hidden='true']").should("not.exist");
  });

  it("pre-fills the input with initialValue", () => {
    cy.mountAccessible(
      <FilterInputDemo
        placeholder="SEARCH..."
        ariaLabel="Search records"
        startAddon="⌕"
        initialValue="accessibility"
      />
    );
    cy.get("input[type='text']").should("have.value", "accessibility");
  });

  it("typing updates the displayed value", () => {
    cy.mountAccessible(
      <FilterInputDemo placeholder="SEARCH..." ariaLabel="Search records" />
    );
    cy.get("input[type='text']").type("react");
    cy.get("input[type='text']").should("have.value", "react");
  });

  it("has no axe accessibility violations (default state)", () => {
    cy.mountAccessible(
      <FilterInputDemo placeholder="SEARCH..." ariaLabel="Search records" />
    );
    cy.checkA11y();
  });

  it("has no axe accessibility violations (with startAddon)", () => {
    cy.mountAccessible(
      <FilterInputDemo
        placeholder="SEARCH..."
        ariaLabel="Search records"
        startAddon="⌕"
      />
    );
    cy.checkA11y();
  });
});
