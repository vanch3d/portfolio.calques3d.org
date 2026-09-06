/**
 * AdrIndexClient — Cypress CT spec
 *
 * Tests the interactive orchestrator in isolation: filtering, pagination,
 * clear state, and footer count display.
 *
 * The component owns:
 *   - Search query (title substring, case-insensitive)
 *   - Active tags (OR logic — any matching tag) — managed via TagFilterDrawer
 *   - Visible count (load-more pagination, PAGE_SIZE = 20)
 *   - hasClearable derived from search + tags state
 *
 * Coverage:
 *   - Renders a filter bar and the register table
 *   - Renders all rows on initial mount
 *   - Search input narrows visible rows
 *   - Search is case-insensitive
 *   - Clearing search restores all rows
 *   - Tag filter via drawer narrows visible rows (OR logic)
 *   - Multiple active tags narrow rows to union of matches
 *   - Clearing tags restores all rows
 *   - Clear button is absent when no filter is active
 *   - Clear button appears after search input
 *   - Clear button appears after tag selection
 *   - Clear button resets both search and tags
 *   - Footer shows plain count (no zero-padding) when all rows visible
 *   - Footer shows load-more button when rows exceed PAGE_SIZE
 *   - Clicking load-more reveals more rows
 *   - Empty-state message is shown when no rows match
 *   - a11y: initial state
 *   - a11y: with active search and tag
 */

import { AdrIndexClient } from "./AdrIndexClient";
import type { AdrMeta } from "@/lib/content/adr";
import type { TagWithCount } from "@/components/ui/TagFilterDrawer";

// ── Fixtures ──────────────────────────────────────────────────────────────────

const make = (n: number, overrides: Partial<AdrMeta> = {}): AdrMeta => ({
  number: n,
  title: `ADR Title ${n}`,
  status: "accepted",
  date: "2026-09-01",
  tags: ["infrastructure"],
  slug: `${String(n).padStart(3, "0")}-adr-title-${n}`,
  ...overrides,
});

const ADR_DEPLOYMENT = make(1, {
  title: "Deployment Target: Vercel",
  tags: ["infrastructure", "deployment"],
});
const ADR_TESTING = make(2, {
  title: "Testing Strategy",
  tags: ["testing", "quality"],
});
const ADR_I18N = make(3, {
  title: "Internationalisation with next-intl",
  tags: ["i18n"],
});
const ADR_AUTH = make(4, {
  title: "Authentication Architecture",
  tags: ["infrastructure", "auth"],
});

const SAMPLE_ADRS = [ADR_DEPLOYMENT, ADR_TESTING, ADR_I18N, ADR_AUTH];

const TAGS: TagWithCount[] = [
  { tag: "infrastructure", count: 2 },
  { tag: "deployment", count: 1 },
  { tag: "testing", count: 1 },
  { tag: "quality", count: 1 },
  { tag: "i18n", count: 1 },
  { tag: "auth", count: 1 },
];

// Generate 21 ADRs to exercise load-more (PAGE_SIZE = 20)
const MANY_ADRS: AdrMeta[] = Array.from({ length: 21 }, (_, i) => make(i + 1));

// ── Helpers ───────────────────────────────────────────────────────────────────

function mountClient(adrs: AdrMeta[] = SAMPLE_ADRS, mostRecentAcceptedNumber: number | null = 1) {
  cy.viewport(1024, 768);
  cy.mountAccessible(
    <AdrIndexClient
      adrs={adrs}
      tags={TAGS}
      mostRecentAcceptedNumber={mostRecentAcceptedNumber}
    />
  );
}

function openDrawer() {
  cy.findByTestId("drawer-toggle").click();
}

// ── Spec ──────────────────────────────────────────────────────────────────────

describe("AdrIndexClient", () => {
  // ── Initial render ─────────────────────────────────────────────────────────

  it("renders the filter bar", () => {
    mountClient();
    cy.get("[role='search']").should("exist");
  });

  it("renders the register table", () => {
    mountClient();
    cy.get("table").should("exist");
  });

  it("renders all rows on initial mount", () => {
    mountClient();
    cy.get("tbody tr").should("have.length", SAMPLE_ADRS.length);
  });

  it("renders the TagFilterDrawer toggle button", () => {
    mountClient();
    cy.findByTestId("drawer-toggle").should("exist");
  });

  // ── Search filter ──────────────────────────────────────────────────────────

  it("search input narrows visible rows", () => {
    mountClient();
    cy.get("input[type='text']").first().type("Deployment");
    cy.get("tbody tr").should("have.length", 1);
    cy.get("tbody").should("contain.text", "Deployment Target");
  });

  it("search is case-insensitive", () => {
    mountClient();
    cy.get("input[type='text']").first().type("deployment");
    cy.get("tbody tr").should("have.length", 1);
  });

  it("clearing the search input restores all rows", () => {
    mountClient();
    cy.get("input[type='text']").first().type("Deployment").clear();
    cy.get("tbody tr").should("have.length", SAMPLE_ADRS.length);
  });

  it("shows empty state when search matches nothing", () => {
    mountClient();
    cy.get("input[type='text']").first().type("xyzxyz_no_match");
    cy.get("table").should("not.exist");
    cy.get("p").should("be.visible");
  });

  // ── Tag filter via drawer ──────────────────────────────────────────────────

  it("tag filter via drawer narrows visible rows", () => {
    mountClient();
    openDrawer();
    cy.findByTestId("tag-chip-testing").click();
    cy.get("tbody tr").should("have.length", 1);
    cy.get("tbody").should("contain.text", "Testing Strategy");
  });

  it("multiple active tags show union of matches (OR logic)", () => {
    mountClient();
    openDrawer();
    cy.findByTestId("tag-chip-testing").click();
    cy.findByTestId("tag-chip-i18n").click();
    cy.get("tbody tr").should("have.length", 2);
  });

  it("deselecting a tag chip restores rows for remaining tags", () => {
    mountClient();
    openDrawer();
    cy.findByTestId("tag-chip-testing").click();
    cy.findByTestId("tag-chip-testing").click();
    cy.get("tbody tr").should("have.length", SAMPLE_ADRS.length);
  });

  // ── Clear button ───────────────────────────────────────────────────────────

  it("clear button is absent when no filter is active", () => {
    mountClient();
    cy.contains("button", /clear/i).should("not.exist");
  });

  it("clear button appears after typing in search", () => {
    mountClient();
    cy.get("input[type='text']").first().type("x");
    cy.contains("button", /clear/i).should("be.visible");
  });

  it("clear button appears after selecting a tag", () => {
    mountClient();
    openDrawer();
    cy.findByTestId("tag-chip-testing").click();
    cy.contains("button", /clear/i).should("be.visible");
  });

  it("clear button resets both search and tags", () => {
    mountClient();
    cy.get("input[type='text']").first().type("Deployment");
    openDrawer();
    cy.findByTestId("tag-chip-infrastructure").click();
    cy.findByTestId("drawer-toggle").click();
    cy.contains("button", /clear/i).click();
    cy.get("input[type='text']").first().should("have.value", "");
    cy.get("tbody tr").should("have.length", SAMPLE_ADRS.length);
    cy.contains("button", /clear/i).should("not.exist");
  });

  // ── Footer ─────────────────────────────────────────────────────────────────

  it("footer shows plain count without zero-padding when all rows visible", () => {
    mountClient();
    cy.contains(`${SAMPLE_ADRS.length} / ${SAMPLE_ADRS.length}`).should("exist");
  });

  it("footer shows plain filtered count when search is active", () => {
    mountClient();
    cy.get("input[type='text']").first().type("Deployment");
    cy.contains(`1 / ${SAMPLE_ADRS.length}`).should("exist");
  });

  it("footer shows load-more button when rows exceed PAGE_SIZE", () => {
    mountClient(MANY_ADRS, null);
    cy.contains(/load more/i).should("be.visible");
  });

  it("clicking load-more reveals more rows", () => {
    mountClient(MANY_ADRS, null);
    cy.get("tbody tr").should("have.length", 20);
    cy.contains(/load more/i).click();
    cy.get("tbody tr").should("have.length", 21);
  });

  // ── Accessibility ──────────────────────────────────────────────────────────

  it("has no axe accessibility violations (initial state)", () => {
    mountClient();
    cy.checkA11y();
  });

  it("has no axe accessibility violations (active search and tag)", () => {
    mountClient();
    cy.get("input[type='text']").first().type("inf");
    openDrawer();
    cy.findByTestId("tag-chip-infrastructure").click();
    // Wait for the chip to reach selected state before running axe —
    // ensures the DOM reflects the updated activeTags before contrast is checked.
    cy.findByTestId("tag-chip-infrastructure").should("have.attr", "aria-pressed", "true");
    cy.checkA11y();
  });
});
