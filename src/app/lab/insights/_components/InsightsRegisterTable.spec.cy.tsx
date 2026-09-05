import { InsightsRegisterTable } from "./InsightsRegisterTable";
import type { InsightRow } from "./InsightsRegisterTable";

const rows: InsightRow[] = [
  {
    number: 2,
    title: "Another Engineering Discovery",
    date: "2026-09-05",
    discoveredDuring: "ADR 017 implementation",
    relatedAdr: 17,
    tags: ["process", "workflow"],
    slug: "002-another-discovery",
    relatedAdrSlug: "017-adr-conventions",
  },
  {
    number: 1,
    title: "Draft PR as Hard Agent Containment Boundary",
    date: "2026-09-04",
    discoveredDuring: "First live run of the pr-flow skill (PR #29)",
    relatedAdr: 16,
    tags: ["agents", "safety", "github"],
    slug: "001-draft-pr-as-agent-containment-boundary",
    relatedAdrSlug: "016-draft-pr-containment",
  },
];

describe("InsightsRegisterTable", () => {
  it("renders a row for each insight", () => {
    cy.mountAccessible(
      <InsightsRegisterTable rows={rows} mostRecentNumber={2} />
    );
    cy.findByTestId("insight-row-2").should("be.visible");
    cy.findByTestId("insight-row-1").should("be.visible");
  });

  it("renders insight numbers padded to 3 digits", () => {
    cy.mountAccessible(
      <InsightsRegisterTable rows={rows} mostRecentNumber={2} />
    );
    cy.findByTestId("insight-row-1").contains("001");
  });

  it("renders the insight title as a link to its detail page", () => {
    cy.mountAccessible(
      <InsightsRegisterTable rows={rows} mostRecentNumber={2} />
    );
    cy.findByTestId("insight-row-1")
      .find("a")
      .first()
      .should(
        "have.attr",
        "href",
        "/lab/insights/001-draft-pr-as-agent-containment-boundary"
      );
  });

  it("renders the discovered-during context in each row", () => {
    cy.mountAccessible(
      <InsightsRegisterTable rows={rows} mostRecentNumber={2} />
    );
    cy.findByTestId("insight-row-1").contains(
      "First live run of the pr-flow skill"
    );
  });

  it("renders a related ADR chip linking to the ADR detail page", () => {
    cy.mountAccessible(
      <InsightsRegisterTable rows={rows} mostRecentNumber={2} />
    );
    cy.findByTestId("insight-row-1")
      .find("a[href='/lab/adr/016-draft-pr-containment']")
      .should("exist");
  });

  it("marks the most recent insight row with an aria-label", () => {
    cy.mountAccessible(
      <InsightsRegisterTable rows={rows} mostRecentNumber={2} />
    );
    cy.findByTestId("insight-row-2").should("have.attr", "aria-label");
  });

  it("renders nothing in the related ADR column for insights without a related ADR", () => {
    const rowWithoutAdr: InsightRow = {
      number: 3,
      title: "Standalone Insight",
      date: "2026-09-06",
      discoveredDuring: "Code review",
      relatedAdr: undefined,
      tags: [],
      slug: "003-standalone",
      relatedAdrSlug: null,
    };
    cy.mountAccessible(
      <InsightsRegisterTable rows={[rowWithoutAdr]} mostRecentNumber={3} />
    );
    cy.findByTestId("insight-row-3").find("a").should("not.exist");
  });

  it("has no axe accessibility violations (standard list)", () => {
    cy.mountAccessible(
      <InsightsRegisterTable rows={rows} mostRecentNumber={2} />
    );
    cy.checkA11y();
  });

  it("has no axe accessibility violations (no most recent)", () => {
    cy.mountAccessible(
      <InsightsRegisterTable rows={rows} mostRecentNumber={null} />
    );
    cy.checkA11y();
  });
});
