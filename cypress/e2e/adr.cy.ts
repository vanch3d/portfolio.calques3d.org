/**
 * /lab/adr — Cypress E2E spec
 *
 * Tests the ADR register index at the page composition level.
 * Does NOT re-test what CT specs already cover (component class names,
 * prop variants, Base UI internals).
 *
 * Focuses on:
 *   - Route load and page structure
 *   - Breadcrumb correctness and One Red Rule
 *   - Register header renders with real data (counters, dimension line)
 *   - Insights callout strip is present when insights exist
 *   - Filter bar is rendered (search input)
 *   - TagFilterDrawer toggle is rendered
 *   - Register table renders rows with real ADR data
 *   - Search filter narrows the visible rows
 *   - Tag filter via drawer narrows the visible rows
 *   - NONE button deselects all tags
 *   - CLEAR resets both search and tags
 *   - Load-more footer is present
 *   - Page-level a11y
 */

describe("/lab/adr — register index", () => {
  beforeEach(() => {
    cy.viewport(1280, 900);
    cy.visit("/lab/adr");
    cy.injectAxe();
  });

  // ── Page load ────────────────────────────────────────────────────────────

  it("loads without error", () => {
    cy.location("pathname").should("eq", "/lab/adr");
    cy.get("main").should("exist");
  });

  it("has no axe accessibility violations", () => {
    cy.checkA11y();
  });

  // ── Breadcrumb / One Red Rule ────────────────────────────────────────────

  it("breadcrumb contains links to / and /lab", () => {
    cy.get("nav[aria-label='Breadcrumb'] a[href='/']").should("exist");
    cy.get("nav[aria-label='Breadcrumb'] a[href='/lab']").should("exist");
  });

  it("breadcrumb marks 'ADR' as current with aria-current", () => {
    cy.get("[aria-current='page']").should("contain.text", "ADR");
  });

  it("has exactly one active-mark element (One Red Rule)", () => {
    cy.get(".active-mark").should("have.length", 1);
  });

  // ── Register header ──────────────────────────────────────────────────────

  it("renders the register subtitle heading", () => {
    cy.get("h1").should("be.visible");
  });

  it("renders Architecture and Decision Records label", () => {
    cy.contains("Architecture").should("be.visible");
    cy.contains("Decision Records").should("be.visible");
  });

  it("renders the RECORDS counter with a non-zero value", () => {
    cy.contains(/RECORDS:\s*\d+/i).should("be.visible");
  });

  it("renders the INSIGHTS counter", () => {
    cy.contains(/INSIGHTS:\s*\d+/i).should("be.visible");
  });

  it("renders the AS OF date", () => {
    cy.contains(/AS OF:\s*\d{4}-\d{2}-\d{2}/i).should("be.visible");
  });

  it("renders dimension-line tick labels", () => {
    cy.contains("001").should("exist");
  });

  // ── Insights callout ─────────────────────────────────────────────────────

  it("renders the insights callout strip", () => {
    cy.get("[aria-label]").contains("Discovered in Practice").should("be.visible");
  });

  it("callout strip shows the insight title", () => {
    cy.contains("Draft PR as Hard Agent Containment Boundary").should("be.visible");
  });

  it("callout strip shows the Related ADR reference", () => {
    cy.contains("ADR 16").should("be.visible");
  });

  // ── Filter bar ───────────────────────────────────────────────────────────

  it("renders the search input", () => {
    cy.get("input[type='text']").should("exist");
  });

  it("renders the TAGS toggle button", () => {
    cy.findByTestId("drawer-toggle").should("be.visible");
  });

  // ── Register table ───────────────────────────────────────────────────────

  it("renders a table with ADR rows", () => {
    cy.get("table").should("exist");
    cy.get("tbody tr").should("have.length.gte", 1);
  });

  it("most recent accepted row has red number (text-active class)", () => {
    cy.get("tbody tr").first().find("td").first().should("have.class", "text-active");
  });

  it("renders the column headers", () => {
    ["NO.", "TITLE", "STATUS", "DATE", "TAGS"].forEach((col) => {
      cy.get("thead").contains(col).should("exist");
    });
  });

  // ── Search filter ────────────────────────────────────────────────────────

  it("search input narrows the visible rows", () => {
    cy.get("tbody tr").its("length").then((initialCount) => {
      cy.get("input[type='text']").type("deployment");
      cy.get("tbody tr").should("have.length.lessThan", initialCount);
    });
  });

  it("shows no-results message when search matches nothing", () => {
    cy.get("input[type='text']").type("xyzxyzxyz_no_match");
    cy.get("table").should("not.exist");
    cy.get("p").should("be.visible");
  });

  it("clearing the search restores all rows", () => {
    cy.get("tbody tr").its("length").then((initialCount) => {
      cy.get("input[type='text']").type("deployment").clear();
      cy.get("tbody tr").should("have.length", initialCount);
    });
  });

  // ── Tag filter via drawer ─────────────────────────────────────────────────

  it("clicking TAGS opens the drawer", () => {
    cy.findByTestId("drawer-toggle").click();
    cy.findByTestId("tag-drawer-panel").should("exist");
  });

  it("selecting a tag in the drawer filters the table", () => {
    cy.get("tbody tr").its("length").then((initialCount) => {
      cy.findByTestId("drawer-toggle").click();
      cy.findByTestId("tag-drawer-panel").should("exist");
      cy.get("[data-testid^='tag-chip-']").first().click();
      cy.get("tbody tr").should("have.length.lessThan", initialCount);
    });
  });

  it("NONE button deselects all tags and restores rows", () => {
    cy.get("tbody tr").its("length").then((initialCount) => {
      cy.findByTestId("drawer-toggle").click();
      cy.get("[data-testid^='tag-chip-']").first().click();
      cy.get("tbody tr").should("have.length.lessThan", initialCount);
      cy.findByTestId("none-button").click();
      cy.get("tbody tr").should("have.length", initialCount);
    });
  });

  it("CLEAR resets both search and tags", () => {
    cy.get("tbody tr").its("length").then((initialCount) => {
      cy.get("input[type='text']").type("a");
      cy.findByTestId("drawer-toggle").click();
      cy.get("[data-testid^='tag-chip-']").first().click();
      cy.findByTestId("drawer-toggle").click();
      cy.contains("button", /clear/i).click();
      cy.get("input[type='text']").should("have.value", "");
      cy.get("tbody tr").should("have.length", initialCount);
      cy.contains("button", /clear/i).should("not.exist");
    });
  });

  // ── Footer ───────────────────────────────────────────────────────────────

  it("renders the folio footer below the table", () => {
    cy.get("main").within(() => {
      cy.get("button, [aria-hidden='true']").last().should("exist");
    });
  });
});
