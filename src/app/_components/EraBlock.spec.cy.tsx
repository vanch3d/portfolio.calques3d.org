/**
 * EraBlock — Cypress CT spec
 *
 * Tests a single era card in isolation.
 *
 * Coverage:
 *   - Renders an h2 with the era name
 *   - Era label is rendered
 *   - Date span is rendered
 *   - Summary text is rendered
 *   - Nav link is rendered with correct href
 *   - Nav link carries nav-link class
 *   - Nav link carries label class
 *   - a11y: research era
 *   - a11y: engineering era
 */

import { EraBlock } from "./EraBlock";

const RESEARCH = {
  label: "Era I",
  span: "1995–2017",
  name: "Research",
  summary: "AI in Education · Human-Computer Interaction · Peer-reviewed scholarship",
  linkHref: "/research" as const,
  linkLabel: "Research",
};

const ENGINEERING = {
  label: "Era II",
  span: "2018–present",
  name: "Engineering",
  summary: "Frontend engineering · Product UX · IoT & SaaS platforms",
  linkHref: "/engineering" as const,
  linkLabel: "Engineering",
};

describe("EraBlock", () => {
  it("renders an h2 with the era name", () => {
    cy.mountAccessible(<EraBlock {...RESEARCH} />);
    cy.get("h2").should("contain.text", "Research");
  });

  it("renders the era label", () => {
    cy.mountAccessible(<EraBlock {...RESEARCH} />);
    cy.contains("Era I").should("be.visible");
  });

  it("renders the date span", () => {
    cy.mountAccessible(<EraBlock {...RESEARCH} />);
    cy.contains("1995–2017").should("be.visible");
  });

  it("renders the summary text", () => {
    cy.mountAccessible(<EraBlock {...RESEARCH} />);
    cy.contains("AI in Education").should("be.visible");
  });

  it("renders a nav link with the correct href", () => {
    cy.mountAccessible(<EraBlock {...RESEARCH} />);
    cy.get("a[href='/research']").should("exist");
  });

  it("nav link carries the nav-link class", () => {
    cy.mountAccessible(<EraBlock {...RESEARCH} />);
    cy.get("a").should("have.class", "nav-link");
  });

  it("nav link carries the label class", () => {
    cy.mountAccessible(<EraBlock {...RESEARCH} />);
    cy.get("a").should("have.class", "label");
  });

  it("renders the engineering era correctly", () => {
    cy.mountAccessible(<EraBlock {...ENGINEERING} />);
    cy.get("h2").should("contain.text", "Engineering");
    cy.contains("Era II").should("be.visible");
    cy.contains("2018–present").should("be.visible");
    cy.get("a[href='/engineering']").should("exist");
  });

  it("has no axe accessibility violations (research era)", () => {
    cy.mountAccessible(<EraBlock {...RESEARCH} />);
    cy.checkA11y();
  });

  it("has no axe accessibility violations (engineering era)", () => {
    cy.mountAccessible(<EraBlock {...ENGINEERING} />);
    cy.checkA11y();
  });
});
