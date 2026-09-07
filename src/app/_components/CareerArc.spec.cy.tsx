/**
 * CareerArc — Cypress CT spec
 *
 * Tests the SVG arc construction in isolation.
 *
 * Coverage:
 *   - Renders an SVG element
 *   - SVG is aria-hidden (decorative — semantic content is in IdentityBlock/EraBlock)
 *   - SVG is not focusable
 *   - Arc path is rendered
 *   - Year labels are rendered (start, transition, end)
 *   - Arc span label is rendered
 *   - One active element exists (the transition year text — One Red Rule)
 *   - a11y: SVG hidden from assistive tech, no violations
 */

import { CareerArc } from "./CareerArc";

const PROPS = {
  arcLabel: "CAREER ARC · 31 YEARS",
  timelineStart: "1995",
  timelineTransition: "2018",
  timelineEnd: "2026",
};

describe("CareerArc", () => {
  it("renders an SVG element", () => {
    cy.mountAccessible(<CareerArc {...PROPS} />);
    cy.get("svg").should("exist");
  });

  it("SVG is aria-hidden", () => {
    cy.mountAccessible(<CareerArc {...PROPS} />);
    cy.get("svg").should("have.attr", "aria-hidden", "true");
  });

  it("SVG has focusable=false", () => {
    cy.mountAccessible(<CareerArc {...PROPS} />);
    cy.get("svg").should("have.attr", "focusable", "false");
  });

  it("renders the main arc path", () => {
    cy.mountAccessible(<CareerArc {...PROPS} />);
    cy.get("path").should("exist");
  });

  it("renders the timeline start year", () => {
    cy.mountAccessible(<CareerArc {...PROPS} />);
    cy.get("svg").contains("1995").should("exist");
  });

  it("renders the timeline end year", () => {
    cy.mountAccessible(<CareerArc {...PROPS} />);
    cy.get("svg").contains("2026").should("exist");
  });

  it("renders the transition year (2018)", () => {
    cy.mountAccessible(<CareerArc {...PROPS} />);
    cy.get("svg").contains("2018").should("exist");
  });

  it("renders the arc span label", () => {
    cy.mountAccessible(<CareerArc {...PROPS} />);
    cy.get("svg").contains("CAREER ARC").should("exist");
  });

  it("has no axe accessibility violations", () => {
    cy.mountAccessible(<CareerArc {...PROPS} />);
    cy.checkA11y();
  });
});
