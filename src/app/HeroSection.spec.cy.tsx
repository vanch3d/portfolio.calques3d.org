import { HeroSection, type HeroSectionLabels } from "./HeroSection";

const labels: HeroSectionLabels = {
  heading: "Nicolas Van Labeke",
  role: "Senior Software Engineer · Lead Frontend",
  thesis: "Systems that communicate complexity.",
  heroNavLabel: "Content areas",
  ctaResearch: "Research",
  ctaEngineering: "Engineering",
  ctaCV: "CV",
};

describe("HeroSection", () => {
  beforeEach(() => {
    cy.mountAccessible(<HeroSection labels={labels} />);
  });

  it("renders the heading", () => {
    cy.get("h1").should("contain.text", "Nicolas Van Labeke");
  });

  it("renders the thesis statement", () => {
    cy.contains("Systems that communicate complexity.").should("exist");
  });

  it("renders navigation links", () => {
    cy.get("nav a").should("have.length", 3);
    cy.get("nav a").eq(0).should("have.attr", "href", "/research");
    cy.get("nav a").eq(1).should("have.attr", "href", "/engineering");
    cy.get("nav a").eq(2).should("have.attr", "href", "/cv");
  });

  it("has no axe accessibility violations", () => {
    cy.checkA11y();
  });
});
