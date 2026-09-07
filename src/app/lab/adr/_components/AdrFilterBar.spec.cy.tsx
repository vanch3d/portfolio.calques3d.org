/**
 * AdrFilterBar — Cypress CT spec
 *
 * Tests the search input + clear CTA in isolation.
 * Tag filtering has moved to the TagFilterDrawer molecule (see TagFilterDrawer.spec.cy.tsx).
 *
 * Coverage:
 *   - Renders the search input with correct placeholder
 *   - Search input is accessibly labelled
 *   - Search input calls onSearchChange when typed into
 *   - Reflects the controlled searchQuery value
 *   - The search container has role=search
 *   - Clear button is hidden when hasClearable is false
 *   - Clear button is visible when hasClearable is true
 *   - Clear button calls onClear when clicked
 *   - a11y: no filter active
 *   - a11y: search active (clear button visible)
 */

import { AdrFilterBar } from "./AdrFilterBar";

function mountBar(
  overrides: Partial<{
    searchQuery: string;
    onSearchChange: (q: string) => void;
    hasClearable: boolean;
    onClear: () => void;
  }> = {}
) {
  const defaults = {
    searchQuery: "",
    onSearchChange: cy.stub().as("onSearchChange"),
    hasClearable: false,
    onClear: cy.stub().as("onClear"),
  };
  cy.mountAccessible(<AdrFilterBar {...defaults} {...overrides} />);
}

describe("AdrFilterBar", () => {
  // ── Search input ───────────────────────────────────────────────────────────

  it("renders a search input", () => {
    mountBar();
    cy.get("input[type='text']").should("exist");
  });

  it("search input is labelled accessibly", () => {
    mountBar();
    cy.get("input[type='text']").should("have.attr", "aria-label", "Search ADR records");
  });

  it("search input calls onSearchChange when typed into", () => {
    mountBar();
    cy.get("input[type='text']").type("api");
    cy.get("@onSearchChange").should("have.been.called");
  });

  it("reflects the controlled searchQuery value", () => {
    mountBar({ searchQuery: "design" });
    cy.get("input[type='text']").should("have.value", "design");
  });

  // ── Clear button ───────────────────────────────────────────────────────────

  it("clear button is hidden when hasClearable is false", () => {
    mountBar({ hasClearable: false });
    cy.contains("button", /clear/i).should("not.exist");
  });

  it("clear button is visible when hasClearable is true", () => {
    mountBar({ hasClearable: true });
    cy.contains("button", /clear/i).should("be.visible");
  });

  it("clear button calls onClear when clicked", () => {
    mountBar({ hasClearable: true });
    cy.contains("button", /clear/i).click();
    cy.get("@onClear").should("have.been.called");
  });

  // ── Accessibility ──────────────────────────────────────────────────────────

  it("search container has role=search", () => {
    mountBar();
    cy.get("[role='search']").should("exist");
  });

  it("has no axe accessibility violations (no filter active)", () => {
    mountBar();
    cy.checkA11y();
  });

  it("has no axe accessibility violations (clear button visible)", () => {
    mountBar({ hasClearable: true });
    cy.checkA11y();
  });
});
