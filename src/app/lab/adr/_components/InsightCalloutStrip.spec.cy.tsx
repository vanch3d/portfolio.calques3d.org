import { InsightCalloutStrip } from "./InsightCalloutStrip";
import type { InsightMeta } from "@/lib/content/insights";

const baseInsight: InsightMeta = {
  number: 1,
  title: "Draft PR as Hard Agent Containment Boundary",
  date: "2026-09-04",
  discoveredDuring: "First live run of the pr-flow skill (PR #29)",
  relatedAdr: 16,
  tags: ["agents", "safety", "github", "workflow"],
  slug: "001-draft-pr-as-agent-containment-boundary",
};

const secondInsight: InsightMeta = {
  number: 2,
  title: "Another Engineering Discovery",
  date: "2026-09-05",
  discoveredDuring: "ADR 017 implementation",
  relatedAdr: 17,
  tags: ["process"],
  slug: "002-another-discovery",
};

const thirdInsight: InsightMeta = {
  number: 3,
  title: "Third Insight Found During Testing",
  date: "2026-09-06",
  discoveredDuring: "Testing phase",
  relatedAdr: undefined,
  tags: ["testing"],
  slug: "003-third-insight",
};

const fourthInsight: InsightMeta = {
  number: 4,
  title: "Fourth Insight",
  date: "2026-09-07",
  discoveredDuring: "Code review",
  relatedAdr: undefined,
  tags: [],
  slug: "004-fourth-insight",
};

describe("InsightCalloutStrip", () => {
  it("renders the discovered-in-practice label", () => {
    cy.mountAccessible(
      <InsightCalloutStrip insights={[baseInsight]} totalInsights={1} />
    );
    cy.findByTestId("insight-callout-strip").should("be.visible");
    cy.contains("Discovered in Practice").should("be.visible");
  });

  it("renders each insight title as a link to its detail page", () => {
    cy.mountAccessible(
      <InsightCalloutStrip
        insights={[baseInsight, secondInsight]}
        totalInsights={2}
      />
    );
    cy.contains("Draft PR as Hard Agent Containment Boundary")
      .should("have.attr", "href", "/lab/insights/001-draft-pr-as-agent-containment-boundary");
    cy.contains("Another Engineering Discovery")
      .should("have.attr", "href", "/lab/insights/002-another-discovery");
  });

  it("renders insight number padded to 3 digits in the title link", () => {
    cy.mountAccessible(
      <InsightCalloutStrip insights={[baseInsight]} totalInsights={1} />
    );
    cy.contains("001 — Draft PR as Hard Agent Containment Boundary").should("be.visible");
  });

  it("renders tags for each insight", () => {
    cy.mountAccessible(
      <InsightCalloutStrip insights={[baseInsight]} totalInsights={1} />
    );
    cy.contains("agents").should("be.visible");
    cy.contains("safety").should("be.visible");
  });

  it("does not render see-all link when total is within the shown limit", () => {
    cy.mountAccessible(
      <InsightCalloutStrip
        insights={[baseInsight, secondInsight, thirdInsight]}
        totalInsights={3}
      />
    );
    cy.contains("SEE ALL INSIGHTS").should("not.exist");
  });

  it("renders see-all link to /lab/insights when total exceeds shown limit", () => {
    cy.mountAccessible(
      <InsightCalloutStrip
        insights={[baseInsight, secondInsight, thirdInsight]}
        totalInsights={4}
      />
    );
    cy.contains("SEE ALL INSIGHTS (4)")
      .should("have.attr", "href", "/lab/insights");
  });

  it("shows at most 3 insights regardless of how many are passed", () => {
    cy.mountAccessible(
      <InsightCalloutStrip
        insights={[baseInsight, secondInsight, thirdInsight, fourthInsight]}
        totalInsights={4}
      />
    );
    cy.contains("Fourth Insight").should("not.exist");
  });

  it("has no axe accessibility violations (single insight)", () => {
    cy.mountAccessible(
      <InsightCalloutStrip insights={[baseInsight]} totalInsights={1} />
    );
    cy.checkA11y();
  });

  it("has no axe accessibility violations (with see-all link)", () => {
    cy.mountAccessible(
      <InsightCalloutStrip
        insights={[baseInsight, secondInsight, thirdInsight]}
        totalInsights={4}
      />
    );
    cy.checkA11y();
  });
});
