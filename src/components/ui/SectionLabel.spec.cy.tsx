/**
 * SectionLabel — Cypress CT spec
 *
 * Tests the Space Mono label atom in isolation.
 * The component receives all display text as children — no translations wired here.
 *
 * Coverage:
 *   - Renders the correct HTML element per the `as` prop
 *   - Applies the `.label` utility class unconditionally
 *   - Applies `.active-mark` only when active=true
 *   - Forwards the `id` prop (required for aria-labelledby consumers)
 *   - Forwards arbitrary className additions
 *   - Renders its children correctly
 *   - a11y: default state
 *   - a11y: active state (One Red Rule — red text must not fail contrast on cream ground)
 */

import { SectionLabel } from "./SectionLabel";

describe("SectionLabel", () => {
  // ── Rendering ──────────────────────────────────────────────────────────────

  it("renders as <p> by default", () => {
    cy.mountAccessible(<SectionLabel>Colors</SectionLabel>);
    cy.get("p").should("contain.text", "Colors");
  });

  it("renders as <h2> when as='h2'", () => {
    cy.mountAccessible(<SectionLabel as="h2">Named Rules</SectionLabel>);
    cy.get("h2").should("contain.text", "Named Rules");
  });

  it("renders as <h3> when as='h3'", () => {
    cy.mountAccessible(<SectionLabel as="h3">Sub-section</SectionLabel>);
    cy.get("h3").should("contain.text", "Sub-section");
  });

  it("renders as <span> when as='span'", () => {
    cy.mountAccessible(
      <p>
        <SectionLabel as="span">Inline</SectionLabel>
      </p>
    );
    cy.get("span").should("contain.text", "Inline");
  });

  // ── Class application ──────────────────────────────────────────────────────

  it("always has the label utility class", () => {
    cy.mountAccessible(<SectionLabel>Design System</SectionLabel>);
    cy.get("p").should("have.class", "label");
  });

  it("does not have active-mark by default", () => {
    cy.mountAccessible(<SectionLabel>Colors</SectionLabel>);
    cy.get("p").should("not.have.class", "active-mark");
  });

  it("adds active-mark when active=true", () => {
    cy.mountAccessible(<SectionLabel active>Lab</SectionLabel>);
    cy.get("p").should("have.class", "active-mark");
  });

  it("does not add active-mark when active=false", () => {
    cy.mountAccessible(<SectionLabel active={false}>Colors</SectionLabel>);
    cy.get("p").should("not.have.class", "active-mark");
  });

  // ── Props forwarding ───────────────────────────────────────────────────────

  it("forwards the id prop", () => {
    cy.mountAccessible(
      <SectionLabel as="h2" id="named-rules-heading">
        Named Rules
      </SectionLabel>
    );
    cy.get("#named-rules-heading").should("exist");
  });

  it("merges an additional className", () => {
    cy.mountAccessible(
      <SectionLabel className="mb-sm">Colors</SectionLabel>
    );
    cy.get("p").should("have.class", "mb-sm").and("have.class", "label");
  });

  // ── Accessibility ──────────────────────────────────────────────────────────

  it("has no axe accessibility violations (default state)", () => {
    cy.mountAccessible(<SectionLabel>Design System</SectionLabel>);
    cy.checkA11y();
  });

  it("has no axe accessibility violations (active state)", () => {
    // The One Red Rule: active-mark sets Compass-Arc Red (#c0392b) on cream ground (#f8f4ed).
    // Contrast ratio for #c0392b on #f8f4ed is ~4.6:1 — passes WCAG AA for normal text.
    cy.mountAccessible(<SectionLabel active>Lab</SectionLabel>);
    cy.checkA11y();
  });

  it("has no axe accessibility violations when used as a section heading", () => {
    cy.mountAccessible(
      <section aria-labelledby="section-label">
        <SectionLabel as="h2" id="section-label">
          Named Rules
        </SectionLabel>
        <p>Content under the section.</p>
      </section>
    );
    cy.checkA11y();
  });
});
