import { AdrRegisterTable } from "./AdrRegisterTable";
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

describe("AdrRegisterTable", () => {
  it("renders a row for each ADR", () => {
    cy.mountAccessible(
      <AdrRegisterTable
        adrs={adrs}
        activeTag={null}
        searchQuery=""
        mostRecentAcceptedNumber={18}
      />
    );
    cy.findByTestId("adr-row-18").should("be.visible");
    cy.findByTestId("adr-row-17").should("be.visible");
    cy.findByTestId("adr-row-1").should("be.visible");
  });

  it("renders ADR numbers padded to 3 digits", () => {
    cy.mountAccessible(
      <AdrRegisterTable
        adrs={adrs}
        activeTag={null}
        searchQuery=""
        mostRecentAcceptedNumber={18}
      />
    );
    cy.findByTestId("adr-row-1").contains("001");
  });

  it("renders the ADR title as a link to its detail page", () => {
    cy.mountAccessible(
      <AdrRegisterTable
        adrs={adrs}
        activeTag={null}
        searchQuery=""
        mostRecentAcceptedNumber={18}
      />
    );
    cy.findByTestId("adr-row-17")
      .find("a")
      .should("have.attr", "href", "/lab/adr/017-adr-conventions");
  });

  it("marks the most recent accepted row with an aria-label", () => {
    cy.mountAccessible(
      <AdrRegisterTable
        adrs={adrs}
        activeTag={null}
        searchQuery=""
        mostRecentAcceptedNumber={18}
      />
    );
    cy.findByTestId("adr-row-18").should(
      "have.attr",
      "aria-label"
    );
  });

  it("ghosted rows have reduced opacity when a tag filter is active", () => {
    cy.mountAccessible(
      <AdrRegisterTable
        adrs={adrs}
        activeTag="infrastructure"
        searchQuery=""
        mostRecentAcceptedNumber={18}
      />
    );
    cy.findByTestId("adr-row-18").should("have.css", "opacity", "0.35");
    cy.findByTestId("adr-row-1").should("have.css", "opacity", "1");
  });

  it("ghosted rows have reduced opacity when a search query is active", () => {
    cy.mountAccessible(
      <AdrRegisterTable
        adrs={adrs}
        activeTag={null}
        searchQuery="deployment"
        mostRecentAcceptedNumber={18}
      />
    );
    cy.findByTestId("adr-row-18").should("have.css", "opacity", "0.35");
    cy.findByTestId("adr-row-1").should("have.css", "opacity", "1");
  });

  it("all rows are full opacity when no filter is active", () => {
    cy.mountAccessible(
      <AdrRegisterTable
        adrs={adrs}
        activeTag={null}
        searchQuery=""
        mostRecentAcceptedNumber={18}
      />
    );
    cy.findByTestId("adr-row-18").should("have.css", "opacity", "1");
    cy.findByTestId("adr-row-17").should("have.css", "opacity", "1");
  });

  it("has no axe accessibility violations (no filter)", () => {
    cy.mountAccessible(
      <AdrRegisterTable
        adrs={adrs}
        activeTag={null}
        searchQuery=""
        mostRecentAcceptedNumber={18}
      />
    );
    cy.checkA11y();
  });

  it("has no axe accessibility violations (with active filter)", () => {
    cy.mountAccessible(
      <AdrRegisterTable
        adrs={adrs}
        activeTag="documentation"
        searchQuery=""
        mostRecentAcceptedNumber={18}
      />
    );
    cy.checkA11y();
  });
});
