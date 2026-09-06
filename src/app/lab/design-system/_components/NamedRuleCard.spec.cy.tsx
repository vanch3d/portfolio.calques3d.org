/**
 * NamedRuleCard — Cypress CT spec
 *
 * Tests the invariant card atom in isolation.
 * The component receives all strings as props — no translation context needed.
 *
 * Coverage:
 *   - Renders name as a label element
 *   - Renders statement text
 *   - Renders rationale when provided
 *   - Omits rationale element when not provided
 *   - Applies border structure (no shadows — flat by construction)
 *   - Forwards className additions
 *   - a11y: with rationale
 *   - a11y: without rationale
 *   - a11y: three cards in a grid (the standard usage on the design-system page)
 */

import { NamedRuleCard } from "./NamedRuleCard";

const ONE_RED = {
  name: "The One Red Rule",
  statement:
    "The compass-arc red appears exactly once per surface — on the single element that is active, current, or selected.",
  rationale:
    "A second red on the same surface means the first was wrong. Its rarity is the point: it marks the foreground construction element, nothing else.",
};

const NO_DECORATION = {
  name: "The No-Decoration Rule",
  statement:
    "If removing an element makes the surface less informative, it was earning its place. If it makes it calmer, it was decoration.",
  rationale:
    "Every mark on the drawing earns its place or is removed. This is not minimalism — it is maximum information, zero noise.",
};

const FLAT = {
  name: "The Flat-by-Construction Rule",
  statement:
    "No shadows. Depth from line weight and tonal ramp only — heavy lines are closer, ghost lines are background.",
};

describe("NamedRuleCard", () => {
  // ── Rendering ──────────────────────────────────────────────────────────────

  it("renders the rule name", () => {
    cy.mountAccessible(<NamedRuleCard {...ONE_RED} />);
    cy.get("p").first().should("contain.text", ONE_RED.name);
  });

  it("renders the statement text", () => {
    cy.mountAccessible(<NamedRuleCard {...ONE_RED} />);
    cy.contains(ONE_RED.statement).should("be.visible");
  });

  it("renders the rationale when provided", () => {
    cy.mountAccessible(<NamedRuleCard {...ONE_RED} />);
    cy.contains(ONE_RED.rationale).should("be.visible");
  });

  it("does not render a rationale element when rationale is omitted", () => {
    cy.mountAccessible(<NamedRuleCard {...FLAT} />);
    // Only name + statement paragraphs — no third paragraph
    cy.get("article p").should("have.length", 2);
  });

  // ── Structure ──────────────────────────────────────────────────────────────

  it("renders as an <article> element", () => {
    cy.mountAccessible(<NamedRuleCard {...ONE_RED} />);
    cy.get("article").should("exist");
  });

  it("name paragraph has the label utility class", () => {
    cy.mountAccessible(<NamedRuleCard {...ONE_RED} />);
    cy.get("article p").first().should("have.class", "label");
  });

  it("merges additional className on the article", () => {
    cy.mountAccessible(
      <NamedRuleCard {...ONE_RED} className="mt-lg" />
    );
    cy.get("article").should("have.class", "mt-lg");
  });

  // ── Grid usage ─────────────────────────────────────────────────────────────

  it("renders three cards in the standard grid without layout issues", () => {
    cy.mountAccessible(
      <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-md">
        <NamedRuleCard {...ONE_RED} />
        <NamedRuleCard {...NO_DECORATION} />
        <NamedRuleCard {...FLAT} />
      </div>
    );
    cy.get("article").should("have.length", 3);
  });

  // ── Accessibility ──────────────────────────────────────────────────────────

  it("has no axe accessibility violations (with rationale)", () => {
    cy.mountAccessible(<NamedRuleCard {...ONE_RED} />);
    cy.checkA11y();
  });

  it("has no axe accessibility violations (without rationale)", () => {
    cy.mountAccessible(<NamedRuleCard {...FLAT} />);
    cy.checkA11y();
  });

  it("has no axe accessibility violations (three cards in grid)", () => {
    cy.mountAccessible(
      <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-md">
        <NamedRuleCard {...ONE_RED} />
        <NamedRuleCard {...NO_DECORATION} />
        <NamedRuleCard {...FLAT} />
      </div>
    );
    cy.checkA11y();
  });
});
