/**
 * AdrRegisterTable — Cypress CT spec
 *
 * Tests the revision register table in isolation.
 * Verifies column structure, row content, active-row marking,
 * alternating row tones, and empty state.
 *
 * Coverage:
 *   - Renders a <table> with the correct aria-label
 *   - Renders five column headers: NO., TITLE, STATUS, DATE, TAGS
 *   - Renders one row per ADR in the adrs array
 *   - Each row shows zero-padded number, title, status, date, and tags
 *   - Status values are rendered in uppercase label form
 *   - Tags are rendered as a comma-separated string
 *   - Most recent accepted row has data identifiable as active (text-active on NO.)
 *   - Most recent accepted row has a screen-reader annotation
 *   - Rows with no mostRecentAcceptedNumber match render without active styling
 *   - Empty state renders the no-results message instead of a table
 *   - a11y: populated table with active row
 *   - a11y: empty state
 */

import { AdrRegisterTable } from "./AdrRegisterTable";
import type { AdrMeta } from "@/lib/content/adr";

const ADR_018: AdrMeta = {
  number: 18,
  title: "Engineering Insights Document Type",
  status: "accepted",
  date: "2026-09-04",
  tags: ["documentation", "process", "insights"],
  slug: "018-engineering-insights",
};

const ADR_017: AdrMeta = {
  number: 17,
  title: "ADR Conventions and Lifecycle",
  status: "accepted",
  date: "2026-09-04",
  tags: ["documentation", "adr"],
  slug: "017-adr-conventions",
};

const ADR_001: AdrMeta = {
  number: 1,
  title: "Deployment Target: Vercel + cPanel DNS",
  status: "accepted",
  date: "2026-08-03",
  tags: ["infrastructure", "deployment"],
  slug: "001-deployment-target",
};

const ADR_DEPRECATED: AdrMeta = {
  number: 5,
  title: "Old Auth Strategy",
  status: "deprecated",
  date: "2026-07-01",
  tags: ["auth"],
  slug: "005-old-auth",
};

const SAMPLE_ADRS = [ADR_018, ADR_017, ADR_001];

describe("AdrRegisterTable", () => {
  // ── Table structure ────────────────────────────────────────────────────────

  it("renders a table element with aria-label", () => {
    cy.mountAccessible(<AdrRegisterTable adrs={SAMPLE_ADRS} mostRecentAcceptedNumber={18} />);
    cy.get("table").should("have.attr", "aria-label");
  });

  it("renders the five column headers", () => {
    cy.mountAccessible(<AdrRegisterTable adrs={SAMPLE_ADRS} mostRecentAcceptedNumber={18} />);
    ["NO.", "TITLE", "STATUS", "DATE", "TAGS"].forEach((col) => {
      cy.get("thead").contains(col).should("exist");
    });
  });

  it("renders one row per ADR", () => {
    cy.mountAccessible(<AdrRegisterTable adrs={SAMPLE_ADRS} mostRecentAcceptedNumber={18} />);
    cy.get("tbody tr").should("have.length", 3);
  });

  // ── Row content ────────────────────────────────────────────────────────────

  it("renders zero-padded ADR number", () => {
    cy.mountAccessible(<AdrRegisterTable adrs={[ADR_001]} mostRecentAcceptedNumber={null} />);
    cy.get("tbody").contains("001").should("be.visible");
  });

  it("renders ADR title", () => {
    cy.mountAccessible(<AdrRegisterTable adrs={[ADR_018]} mostRecentAcceptedNumber={null} />);
    cy.contains("Engineering Insights Document Type").should("be.visible");
  });

  it("renders status in uppercase label form", () => {
    cy.mountAccessible(<AdrRegisterTable adrs={[ADR_018]} mostRecentAcceptedNumber={null} />);
    cy.contains("ACCEPTED").should("be.visible");
  });

  it("renders deprecated status correctly", () => {
    cy.mountAccessible(<AdrRegisterTable adrs={[ADR_DEPRECATED]} mostRecentAcceptedNumber={null} />);
    cy.contains("DEPRECATED").should("be.visible");
  });

  it("renders the date value", () => {
    cy.mountAccessible(<AdrRegisterTable adrs={[ADR_018]} mostRecentAcceptedNumber={null} />);
    cy.contains("2026-09-04").should("be.visible");
  });

  it("renders tags as a comma-separated string", () => {
    cy.mountAccessible(<AdrRegisterTable adrs={[ADR_018]} mostRecentAcceptedNumber={null} />);
    cy.contains("documentation, process, insights").should("be.visible");
  });

  // ── Active row ─────────────────────────────────────────────────────────────

  it("most recent accepted row number carries text-active class", () => {
    cy.mountAccessible(<AdrRegisterTable adrs={SAMPLE_ADRS} mostRecentAcceptedNumber={18} />);
    // Find row by its data-testid (zero-padded) — not by DOM position
    cy.findByTestId("adr-row-018").find("td").first().should("have.class", "text-active");
  });

  it("most recent accepted row has a screen-reader annotation", () => {
    cy.mountAccessible(<AdrRegisterTable adrs={SAMPLE_ADRS} mostRecentAcceptedNumber={18} />);
    cy.findByTestId("adr-row-018").find(".sr-only").should("exist");
  });

  it("non-active rows do not carry text-active class on number cell", () => {
    cy.mountAccessible(<AdrRegisterTable adrs={SAMPLE_ADRS} mostRecentAcceptedNumber={18} />);
    cy.findByTestId("adr-row-017").find("td").first().should("not.have.class", "text-active");
  });

  it("no row is active when mostRecentAcceptedNumber is null", () => {
    cy.mountAccessible(<AdrRegisterTable adrs={SAMPLE_ADRS} mostRecentAcceptedNumber={null} />);
    cy.get(".text-active").should("not.exist");
  });

  // ── Empty state ────────────────────────────────────────────────────────────

  it("renders the no-results message when adrs is empty", () => {
    cy.mountAccessible(<AdrRegisterTable adrs={[]} mostRecentAcceptedNumber={null} />);
    cy.get("table").should("not.exist");
    cy.findByTestId("no-results").should("be.visible");
  });

  // ── Accessibility ──────────────────────────────────────────────────────────

  it("has no axe accessibility violations (populated table with active row)", () => {
    cy.mountAccessible(<AdrRegisterTable adrs={SAMPLE_ADRS} mostRecentAcceptedNumber={18} />);
    cy.checkA11y();
  });

  it("has no axe accessibility violations (empty state)", () => {
    cy.mountAccessible(<AdrRegisterTable adrs={[]} mostRecentAcceptedNumber={null} />);
    cy.checkA11y();
  });
});
