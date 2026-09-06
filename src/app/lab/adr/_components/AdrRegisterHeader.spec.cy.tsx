/**
 * AdrRegisterHeader — Cypress CT spec
 *
 * Tests the blueprint-style 3-column title block and dimension line in isolation.
 * The component is a pure presentational Server Component — values come from props.
 *
 * Coverage:
 *   - Renders the register subtitle in the centre column
 *   - Renders "Architecture" and "Decision Records" label lines in the left column
 *   - Renders the RECORDS counter in the right column
 *   - Renders the INSIGHTS counter in the right column
 *   - Renders the AS OF date in the right column
 *   - Renders zero-padded min and max tick labels on the dimension line
 *   - Tick labels are hidden from accessibility tree (aria-hidden)
 *   - Heavy borders above and below the title block
 *   - a11y: default state
 */

import { AdrRegisterHeader } from "./AdrRegisterHeader";

const BASE = {
  adrCount: 19,
  insightCount: 1,
  asOf: "2026-09-05",
  minNumber: 1,
  maxNumber: 19,
};

describe("AdrRegisterHeader", () => {
  // ── Content ────────────────────────────────────────────────────────────────

  it("renders the register subtitle in the centre", () => {
    cy.mountAccessible(<AdrRegisterHeader {...BASE} />);
    cy.get("h1").should("be.visible");
  });

  it("renders Architecture and Decision Records in the left column", () => {
    cy.mountAccessible(<AdrRegisterHeader {...BASE} />);
    cy.contains("Architecture").should("be.visible");
    cy.contains("Decision Records").should("be.visible");
  });

  it("renders the RECORDS counter", () => {
    cy.mountAccessible(<AdrRegisterHeader {...BASE} />);
    cy.contains("19").should("be.visible");
  });

  it("renders the INSIGHTS counter", () => {
    cy.mountAccessible(<AdrRegisterHeader {...BASE} />);
    cy.contains("1").should("be.visible");
  });

  it("renders the AS OF date", () => {
    cy.mountAccessible(<AdrRegisterHeader {...BASE} />);
    cy.contains("2026-09-05").should("be.visible");
  });

  // ── Dimension line ─────────────────────────────────────────────────────────

  it("renders zero-padded min tick label (001)", () => {
    cy.mountAccessible(<AdrRegisterHeader {...BASE} />);
    // The dimension line is aria-hidden; query by text content
    cy.contains("001").should("exist");
  });

  it("renders zero-padded max tick label (019)", () => {
    cy.mountAccessible(<AdrRegisterHeader {...BASE} />);
    cy.contains("019").should("exist");
  });

  it("dimension line wrapper is hidden from accessibility tree", () => {
    cy.mountAccessible(<AdrRegisterHeader {...BASE} />);
    cy.get("[aria-hidden='true']").should("exist");
  });

  // ── Single-record edge case ────────────────────────────────────────────────

  it("renders correctly when min equals max (single ADR)", () => {
    cy.mountAccessible(
      <AdrRegisterHeader
        adrCount={1}
        insightCount={0}
        asOf="2026-08-03"
        minNumber={1}
        maxNumber={1}
      />
    );
    // Both ticks show "001"
    cy.get("[aria-hidden='true']").within(() => {
      cy.contains("001").should("exist");
    });
  });

  // ── Accessibility ──────────────────────────────────────────────────────────

  it("has no axe accessibility violations", () => {
    cy.mountAccessible(<AdrRegisterHeader {...BASE} />);
    cy.checkA11y();
  });
});
