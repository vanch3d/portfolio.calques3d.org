/**
 * ColorSwatch — Cypress CT spec
 *
 * Tests the colour documentation row atom in isolation.
 * Each swatch maps a design token to a static Tailwind bg class — the mapping
 * is exhaustive and compile-time. This spec verifies the correct class is applied
 * and all metadata is rendered.
 *
 * Coverage:
 *   - Swatch block has the correct bg class for each of the five system colours
 *   - Swatch block has role="img" and the correct aria-label
 *   - Colour name is rendered
 *   - Token name and hex value are rendered
 *   - Usage copy is rendered
 *   - Named-rule callout is shown when provided, hidden when not
 *   - Named-rule callout contains both the rule name and body text
 *   - Falls back to bg-ink-ghost for an unknown token (defensive branch)
 *   - a11y: neutral colour (bg-ground — swatch is visible only via border)
 *   - a11y: accent colour with named-rule callout
 *   - a11y: all five swatches in sequence (the full neutral + accent groups)
 */

import { ColorSwatch } from "./ColorSwatch";

const GROUND = {
  token: "color-ground",
  name: "Draughting Paper",
  hex: "#f8f4ed",
  usage:
    "The ground. Every surface begins here. Warm, not clinical — the colour of cream draughting paper, not office-white.",
  ariaLabel: "Draughting Paper colour swatch — #f8f4ed",
};

const INK = {
  token: "color-ink",
  name: "Construction Graphite",
  hex: "#2a2a2a",
  usage:
    "Primary lines, headings, body text. The weight of a freshly-sharpened pencil.",
  ariaLabel: "Construction Graphite colour swatch — #2a2a2a",
};

const INK_SECONDARY = {
  token: "color-ink-secondary",
  name: "Faded Graphite",
  hex: "#6b6b6b",
  usage: "Secondary annotations, labels, dates.",
  ariaLabel: "Faded Graphite colour swatch — #6b6b6b",
};

const INK_GHOST = {
  token: "color-ink-ghost",
  name: "Ghost Line",
  hex: "#c8c4bc",
  usage: "Tertiary grid lines, dividers, construction guides.",
  ariaLabel: "Ghost Line colour swatch — #c8c4bc",
};

const ACTIVE = {
  token: "color-active",
  name: "Compass-Arc Red",
  hex: "#c0392b",
  usage:
    "The single active construction element per surface. Never used for decoration.",
  ariaLabel: "Compass-Arc Red colour swatch — #c0392b",
  namedRule: {
    name: "The One Red Rule",
    body: "The compass-arc red appears exactly once per surface. A second red means the first was wrong.",
  },
};

describe("ColorSwatch", () => {
  // ── Swatch block ───────────────────────────────────────────────────────────

  it("applies bg-ground class for color-ground token", () => {
    cy.mountAccessible(<ColorSwatch {...GROUND} />);
    cy.get('[role="img"]').should("have.class", "bg-ground");
  });

  it("applies bg-ink class for color-ink token", () => {
    cy.mountAccessible(<ColorSwatch {...INK} />);
    cy.get('[role="img"]').should("have.class", "bg-ink");
  });

  it("applies bg-ink-secondary class for color-ink-secondary token", () => {
    cy.mountAccessible(<ColorSwatch {...INK_SECONDARY} />);
    cy.get('[role="img"]').should("have.class", "bg-ink-secondary");
  });

  it("applies bg-ink-ghost class for color-ink-ghost token", () => {
    cy.mountAccessible(<ColorSwatch {...INK_GHOST} />);
    cy.get('[role="img"]').should("have.class", "bg-ink-ghost");
  });

  it("applies bg-active class for color-active token", () => {
    cy.mountAccessible(<ColorSwatch {...ACTIVE} />);
    cy.get('[role="img"]').should("have.class", "bg-active");
  });

  it("applies the fallback bg-ink-ghost for an unknown token", () => {
    cy.mountAccessible(
      <ColorSwatch
        token="color-unknown"
        name="Unknown"
        hex="#000"
        usage="Fallback test"
        ariaLabel="Unknown swatch"
      />
    );
    cy.get('[role="img"]').should("have.class", "bg-ink-ghost");
  });

  // ── Accessibility attributes on swatch ────────────────────────────────────

  it("swatch block has role=img", () => {
    cy.mountAccessible(<ColorSwatch {...INK} />);
    cy.get('[role="img"]').should("exist");
  });

  it("swatch block has the correct aria-label", () => {
    cy.mountAccessible(<ColorSwatch {...INK} />);
    cy.get('[role="img"]').should(
      "have.attr",
      "aria-label",
      INK.ariaLabel
    );
  });

  // ── Metadata ───────────────────────────────────────────────────────────────

  it("renders the colour name", () => {
    cy.mountAccessible(<ColorSwatch {...INK} />);
    cy.contains(INK.name).should("be.visible");
  });

  it("renders the token name", () => {
    cy.mountAccessible(<ColorSwatch {...INK} />);
    cy.contains("--color-ink").should("be.visible");
  });

  it("renders the hex value", () => {
    cy.mountAccessible(<ColorSwatch {...INK} />);
    cy.contains(INK.hex).should("be.visible");
  });

  it("renders the usage copy", () => {
    cy.mountAccessible(<ColorSwatch {...INK} />);
    cy.contains(INK.usage).should("be.visible");
  });

  // ── Named-rule callout ─────────────────────────────────────────────────────

  it("does not render a named-rule callout when namedRule is omitted", () => {
    cy.mountAccessible(<ColorSwatch {...INK} />);
    cy.contains("The One Red Rule").should("not.exist");
  });

  it("renders the named-rule callout when namedRule is provided", () => {
    cy.mountAccessible(<ColorSwatch {...ACTIVE} />);
    cy.contains(ACTIVE.namedRule.name).should("be.visible");
    cy.contains(ACTIVE.namedRule.body).should("be.visible");
  });

  // ── Accessibility ──────────────────────────────────────────────────────────

  it("has no axe accessibility violations (neutral colour — ground)", () => {
    // bg-ground is the same as the page background; the border-ghost makes it
    // visible. axe must not flag the low-contrast swatch block itself — it has
    // role=img and carries no text, so contrast rules do not apply to the block.
    cy.mountAccessible(<ColorSwatch {...GROUND} />);
    cy.checkA11y();
  });

  it("has no axe accessibility violations (accent colour with named-rule callout)", () => {
    cy.mountAccessible(<ColorSwatch {...ACTIVE} />);
    cy.checkA11y();
  });

  it("has no axe accessibility violations (all five swatches in sequence)", () => {
    cy.mountAccessible(
      <div className="flex flex-col gap-md">
        <ColorSwatch {...GROUND} />
        <ColorSwatch {...INK} />
        <ColorSwatch {...INK_SECONDARY} />
        <ColorSwatch {...INK_GHOST} />
        <ColorSwatch {...ACTIVE} />
      </div>
    );
    cy.checkA11y();
  });
});
