/**
 * InsightCalloutStrip — Cypress CT spec
 *
 * Tests the "Discovered in Practice" callout in isolation.
 * The component surfaces the most recent Engineering Insight on the ADR index.
 *
 * Coverage:
 *   - Renders the "DISCOVERED IN PRACTICE" label
 *   - Renders the zero-padded insight number and title
 *   - Renders the discoveredDuring context line
 *   - Renders all insight tags as chip elements
 *   - Renders the "Related" label and ADR reference when relatedAdr is set
 *   - Omits the related ADR box when relatedAdr is absent
 *   - Aside has the correct aria-label for the insights strip
 *   - a11y: with related ADR
 *   - a11y: without related ADR
 */

import { InsightCalloutStrip } from "./InsightCalloutStrip";
import type { InsightMeta } from "@/lib/content/insights";

const INSIGHT_WITH_RELATED: InsightMeta = {
  number: 1,
  title: "Draft PR as Hard Agent Containment Boundary",
  date: "2026-09-04",
  discoveredDuring: "First live run of the pr-flow skill — PR #29",
  relatedAdr: 16,
  tags: ["agents", "safety", "github", "workflow"],
  slug: "001-draft-pr-as-agent-containment-boundary",
};

const INSIGHT_NO_RELATED: InsightMeta = {
  number: 2,
  title: "Some Standalone Discovery",
  date: "2026-09-05",
  discoveredDuring: "Routine development session",
  tags: ["process"],
  slug: "002-some-standalone-discovery",
};

describe("InsightCalloutStrip", () => {
  // ── Core content ───────────────────────────────────────────────────────────

  it("renders the DISCOVERED IN PRACTICE label", () => {
    cy.mountAccessible(<InsightCalloutStrip insight={INSIGHT_WITH_RELATED} />);
    cy.contains("Discovered in Practice").should("be.visible");
  });

  it("renders the zero-padded insight number with the title", () => {
    cy.mountAccessible(<InsightCalloutStrip insight={INSIGHT_WITH_RELATED} />);
    cy.contains("001 — Draft PR as Hard Agent Containment Boundary").should("be.visible");
  });

  it("renders the discoveredDuring context line", () => {
    cy.mountAccessible(<InsightCalloutStrip insight={INSIGHT_WITH_RELATED} />);
    cy.contains("First live run of the pr-flow skill").should("be.visible");
  });

  it("renders all insight tags", () => {
    cy.mountAccessible(<InsightCalloutStrip insight={INSIGHT_WITH_RELATED} />);
    ["agents", "safety", "github", "workflow"].forEach((tag) => {
      cy.contains(tag).should("be.visible");
    });
  });

  // ── Related ADR box ────────────────────────────────────────────────────────

  it("renders the Related label when relatedAdr is set", () => {
    cy.mountAccessible(<InsightCalloutStrip insight={INSIGHT_WITH_RELATED} />);
    cy.contains("Related").should("be.visible");
  });

  it("renders the ADR reference number when relatedAdr is set", () => {
    cy.mountAccessible(<InsightCalloutStrip insight={INSIGHT_WITH_RELATED} />);
    cy.contains("ADR 16").should("be.visible");
  });

  it("omits the related ADR box when relatedAdr is absent", () => {
    cy.mountAccessible(<InsightCalloutStrip insight={INSIGHT_NO_RELATED} />);
    cy.contains("Related").should("not.exist");
  });

  // ── Accessibility ──────────────────────────────────────────────────────────

  it("aside has the correct aria-label", () => {
    cy.mountAccessible(<InsightCalloutStrip insight={INSIGHT_WITH_RELATED} />);
    cy.get("aside").should("have.attr", "aria-label");
  });

  it("has no axe accessibility violations (with related ADR)", () => {
    cy.mountAccessible(<InsightCalloutStrip insight={INSIGHT_WITH_RELATED} />);
    cy.checkA11y();
  });

  it("has no axe accessibility violations (without related ADR)", () => {
    cy.mountAccessible(<InsightCalloutStrip insight={INSIGHT_NO_RELATED} />);
    cy.checkA11y();
  });
});
