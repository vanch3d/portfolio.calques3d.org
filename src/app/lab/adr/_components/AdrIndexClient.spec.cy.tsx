import { AdrIndexClient } from "./AdrIndexClient";
import type { AdrMeta } from "@/lib/content/adr";

const adrs: AdrMeta[] = [
  {
    number: 18,
    title: "Engineering Insights Document Type",
    status: "accepted",
    date: "2026-09-04",
    tags: ["documentation", "process", "insights"],
    slug: "018-engineering-insights",
  },
  {
    number: 17,
    title: "ADR Conventions and Lifecycle",
    status: "accepted",
    date: "2026-09-04",
    tags: ["documentation", "process", "adr"],
    slug: "017-adr-conventions",
  },
  {
    number: 1,
    title: "Deployment Target: Vercel + cPanel DNS",
    status: "accepted",
    date: "2026-08-03",
    tags: ["infrastructure", "deployment"],
    slug: "001-deployment-target",
  },
];

const tags = ["documentation", "process", "insights", "adr", "infrastructure", "deployment"];

describe("AdrIndexClient", () => {
  it("renders the filter bar and register table", () => {
    cy.mountAccessible(
      <AdrIndexClient
        adrs={adrs}
        tags={tags}
        mostRecentAcceptedNumber={18}
      />
    );
    cy.findByTestId("adr-filter-bar").should("be.visible");
    cy.findByTestId("adr-register-table").should("be.visible");
  });

  it("shows all ADR rows initially", () => {
    cy.mountAccessible(
      <AdrIndexClient
        adrs={adrs}
        tags={tags}
        mostRecentAcceptedNumber={18}
      />
    );
    cy.findByTestId("adr-row-18").should("be.visible");
    cy.findByTestId("adr-row-17").should("be.visible");
    cy.findByTestId("adr-row-1").should("be.visible");
  });

  it("ghosted rows when a tag filter is activated", () => {
    cy.mountAccessible(
      <AdrIndexClient
        adrs={adrs}
        tags={tags}
        mostRecentAcceptedNumber={18}
      />
    );
    cy.findByTestId("tag-chip-infrastructure").click();
    cy.findByTestId("adr-row-1").should("have.css", "opacity", "1");
    cy.findByTestId("adr-row-18").should("have.css", "opacity", "0.35");
  });

  it("toggles tag filter off when the same chip is clicked again", () => {
    cy.mountAccessible(
      <AdrIndexClient
        adrs={adrs}
        tags={tags}
        mostRecentAcceptedNumber={18}
      />
    );
    cy.findByTestId("tag-chip-infrastructure").click();
    cy.findByTestId("tag-chip-infrastructure").should("have.attr", "aria-pressed", "true");
    cy.findByTestId("tag-chip-infrastructure").click();
    cy.findByTestId("tag-chip-infrastructure").should("have.attr", "aria-pressed", "false");
    cy.findByTestId("adr-row-18").should("have.css", "opacity", "1");
  });

  it("shows no-results message when search matches nothing", () => {
    cy.mountAccessible(
      <AdrIndexClient
        adrs={adrs}
        tags={tags}
        mostRecentAcceptedNumber={18}
      />
    );
    cy.get("input[type='search']").type("xyznonexistent");
    cy.get("[role='status']").should("be.visible");
  });

  it("does not show load-more footer when total is within initial visible count", () => {
    cy.mountAccessible(
      <AdrIndexClient
        adrs={adrs}
        tags={tags}
        mostRecentAcceptedNumber={18}
      />
    );
    cy.contains("CONTINUATION: LOAD MORE RECORDS").should("not.exist");
  });

  it("has no axe accessibility violations (initial state)", () => {
    cy.mountAccessible(
      <AdrIndexClient
        adrs={adrs}
        tags={tags}
        mostRecentAcceptedNumber={18}
      />
    );
    cy.checkA11y();
  });

  it("has no axe accessibility violations (tag filter active)", () => {
    cy.mountAccessible(
      <AdrIndexClient
        adrs={adrs}
        tags={tags}
        mostRecentAcceptedNumber={18}
      />
    );
    cy.findByTestId("tag-chip-documentation").click();
    cy.checkA11y();
  });
});
