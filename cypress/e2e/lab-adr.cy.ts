// E2E specs for /lab/adr and /lab/insights surfaces.
//
// Real slugs used:
//   ADR:     019-lab-content-pipeline (most recent accepted as of 2026-09-05)
//            001-deployment-target     (first; has prev/next neighbours)
//            016-pr-snapshot-review-workflow (has a related insight)
//   Insight: 001-draft-pr-as-agent-containment-boundary (only insight; related to ADR 016)

describe("/lab/adr — ADR index page", () => {
  beforeEach(() => {
    cy.visit("/lab/adr");
    cy.injectAxe();
  });

  it("has no axe accessibility violations", () => {
    cy.checkA11y();
  });

  it("renders the breadcrumb navigation", () => {
    cy.get("nav[aria-label='Breadcrumb and section navigation']").should("exist");
    cy.get("nav[aria-label='Breadcrumb and section navigation']").contains(
      "Nicolas Van Labeke"
    );
    cy.get("nav[aria-label='Breadcrumb and section navigation']").contains(
      "Lab"
    );
    cy.get("[aria-current='page']").should("contain.text", "ADR");
  });

  it("renders the title block with record and insight counts", () => {
    cy.get("header[role='banner']").should("exist");
    cy.get("header[role='banner']").contains("ARCHITECTURE DECISION RECORDS");
    cy.get("header[role='banner']").contains("Revision Register — Portfolio Build");
    cy.get("header[role='banner']").contains(/RECORDS: \d+/);
    cy.get("header[role='banner']").contains(/INSIGHTS: \d+/);
    cy.get("header[role='banner']").contains(/AS OF:/);
  });

  it("renders the insight callout strip", () => {
    cy.get("[aria-label='Engineering Insights']").should("exist");
    cy.get("[aria-label='Engineering Insights']").contains(
      "Discovered in Practice"
    );
  });

  it("renders all ADR rows in the register table", () => {
    cy.get("[data-testid='adr-row-19']").should("be.visible");
    cy.get("[data-testid='adr-row-1']").should("be.visible");
  });

  it("the most recent accepted ADR row has an aria-label marking it as most recent", () => {
    cy.get("[data-testid='adr-row-19']").should("have.attr", "aria-label");
  });

  it("clicking an ADR row title navigates to the detail page", () => {
    cy.get("[data-testid='adr-row-19']")
      .find("a")
      .first()
      .click();
    cy.url().should("include", "/lab/adr/019-lab-content-pipeline");
  });

  it("filters rows to ghost weight when a tag chip is clicked", () => {
    cy.get("[data-testid='adr-row-19']").should("have.css", "opacity", "1");
    cy.get("button").contains("rendering").click();
    cy.get("[data-testid='adr-row-1']").should("have.css", "opacity", "0.35");
    cy.get("[data-testid='adr-row-19']").should("have.css", "opacity", "1");
  });

  it("filters rows to ghost weight when search input is used", () => {
    cy.get("input[placeholder='SEARCH RECORDS...']").type("pipeline");
    cy.get("[data-testid='adr-row-19']").should("have.css", "opacity", "1");
    cy.get("[data-testid='adr-row-1']").should("have.css", "opacity", "0.35");
  });
});

describe("/lab/adr/[slug] — ADR detail page", () => {
  beforeEach(() => {
    cy.visit("/lab/adr/019-lab-content-pipeline");
    cy.injectAxe();
  });

  it("has no axe accessibility violations", () => {
    cy.checkA11y();
  });

  it("renders the breadcrumb navigation", () => {
    cy.get("nav[aria-label='Breadcrumb and section navigation']").should("exist");
    cy.get("nav[aria-label='Breadcrumb and section navigation']").contains(
      "Nicolas Van Labeke"
    );
    cy.get("nav[aria-label='Breadcrumb and section navigation']")
      .contains("ADR")
      .should("have.attr", "href", "/lab/adr");
    cy.get("[aria-current='page']").should("contain.text", "019");
  });

  it("renders the ADR number and title in the document header", () => {
    cy.get("[data-testid='adr-document']").should("exist");
    cy.get("[data-testid='adr-document']").contains("019");
    cy.get("h1").should("contain.text", "Content Pipeline for /lab/adr and /lab/insights");
  });

  it("renders the frontmatter annotation strip (status, date, tags)", () => {
    cy.get("[aria-label='ADR metadata']").should("exist");
    cy.get("[aria-label='ADR metadata']").contains("ACCEPTED");
    cy.get("[aria-label='ADR metadata']").contains("2026-09-05");
    cy.get("[aria-label='ADR metadata']").contains("rendering");
  });

  it("renders the ADR body content", () => {
    cy.get("[data-testid='adr-body']").should("exist");
    cy.get("[data-testid='adr-body']").should("not.be.empty");
    cy.get("[data-testid='adr-body']").contains("gray-matter");
  });

  it("renders previous and next ADR navigation links", () => {
    cy.get("[aria-label='ADR navigation']").should("exist");
    cy.get("[aria-label='ADR navigation']").contains(/← ADR/);
  });
});

describe("/lab/adr/[slug] — ADR detail page with related insight", () => {
  beforeEach(() => {
    cy.visit("/lab/adr/016-pr-snapshot-review-workflow");
    cy.injectAxe();
  });

  it("has no axe accessibility violations", () => {
    cy.checkA11y();
  });

  it("renders the insight callout block when a related insight exists", () => {
    cy.get("[data-testid='insight-callout-block']").should("exist");
    cy.get("[data-testid='insight-callout-block']").contains(
      "Draft PR as Hard Agent Containment Boundary"
    );
  });
});

describe("/lab/insights — Insights index page", () => {
  beforeEach(() => {
    cy.visit("/lab/insights");
    cy.injectAxe();
  });

  it("has no axe accessibility violations", () => {
    cy.checkA11y();
  });

  it("renders the breadcrumb navigation", () => {
    cy.get("nav[aria-label='Breadcrumb and section navigation']").should("exist");
    cy.get("nav[aria-label='Breadcrumb and section navigation']").contains(
      "Nicolas Van Labeke"
    );
    cy.get("nav[aria-label='Breadcrumb and section navigation']").contains("Lab");
    cy.get("[aria-current='page']").should("contain.text", "INSIGHTS");
  });

  it("renders the title block with insight count", () => {
    cy.get("header[role='banner']").should("exist");
    cy.get("header[role='banner']").contains("ENGINEERING INSIGHTS");
    cy.get("header[role='banner']").contains("Insights Register — Portfolio Build");
    cy.get("header[role='banner']").contains(/INSIGHTS: \d+/);
    cy.get("header[role='banner']").contains(/AS OF:/);
  });

  it("renders all insight rows in the register table", () => {
    cy.get("[data-testid='insight-row-1']").should("be.visible");
  });

  it("the most recent insight row has an aria-label marking it as most recent", () => {
    cy.get("[data-testid='insight-row-1']").should("have.attr", "aria-label");
  });

  it("insight title links navigate to the detail page", () => {
    cy.get("[data-testid='insight-row-1']")
      .find("a")
      .first()
      .click();
    cy.url().should(
      "include",
      "/lab/insights/001-draft-pr-as-agent-containment-boundary"
    );
  });

  it("related ADR chips link to the correct ADR detail page", () => {
    cy.get("[data-testid='insight-row-1']")
      .find("a[href*='/lab/adr/016']")
      .should("exist");
  });
});

describe("/lab/insights/[slug] — Insight detail page", () => {
  beforeEach(() => {
    cy.visit(
      "/lab/insights/001-draft-pr-as-agent-containment-boundary"
    );
    cy.injectAxe();
  });

  it("has no axe accessibility violations", () => {
    cy.checkA11y();
  });

  it("renders the breadcrumb navigation", () => {
    cy.get("nav[aria-label='Breadcrumb and section navigation']").should("exist");
    cy.get("nav[aria-label='Breadcrumb and section navigation']")
      .contains("INSIGHTS")
      .should("have.attr", "href", "/lab/insights");
    cy.get("[aria-current='page']").should("contain.text", "001");
  });

  it("renders the insight number and title in the document header", () => {
    cy.get("[data-testid='insight-document']").should("exist");
    cy.get("[data-testid='insight-document']").contains("001");
    cy.get("h1").should(
      "contain.text",
      "Draft PR as Hard Agent Containment Boundary"
    );
  });

  it("renders the frontmatter annotation strip (date, discovered-during, related ADR)", () => {
    cy.get("[aria-label='Insight metadata']").should("exist");
    cy.get("[aria-label='Insight metadata']").contains("2026-09-04");
    cy.get("[aria-label='Insight metadata']").contains(
      "First live run of the pr-flow skill"
    );
    cy.get("[aria-label='Insight metadata']").contains("ADR 16");
  });

  it("renders the insight body content", () => {
    cy.get("[data-testid='insight-body']").should("exist");
    cy.get("[data-testid='insight-body']").should("not.be.empty");
    cy.get("[data-testid='insight-body']").contains("draft state");
  });

  it("the related ADR back-reference link navigates to the correct ADR page", () => {
    cy.get("[data-testid='insight-document']")
      .find("a[href*='/lab/adr/016']")
      .first()
      .click();
    cy.url().should("include", "/lab/adr/016-pr-snapshot-review-workflow");
  });

  it("renders previous and next insight navigation links (only next shown for first insight)", () => {
    cy.get("[aria-label='Insight navigation']").should("exist");
  });
});
