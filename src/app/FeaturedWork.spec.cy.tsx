import { FeaturedWork, type FeaturedWorkLabels } from "./FeaturedWork";
import type { ResearchProject } from "@/types/content";

const labels: FeaturedWorkLabels = {
  heading: "Featured Work",
  sectionLabel: "Featured work",
  researchLabel: "Research",
  engineeringLabel: "Engineering",
  engineeringTitle: "HiveMQ Edge",
  engineeringPeriod: "2023–present",
  engineeringBody: "Open-source IIoT edge platform.",
  engineeringLink: "View engineering work",
  publicationLabel: "Publication",
  publicationBody: "Full academic publication list coming soon.",
  ongoing: "present",
};

const featuredResearch: ResearchProject = {
  slug: "safesea",
  title: "Supportive Automated Feedback for Short Essay Answers",
  abbr: "SAFeSEA",
  type: "research",
  status: "completed",
  visibility: "public",
  featured: false,
  position: "open-university",
  period: { start: "2012", end: "2014" },
  funding: "EPSRC",
  links: { github: [], external: [] },
  tags: ["NLP", "formative feedback", "essay analysis"],
};

describe("FeaturedWork", () => {
  beforeEach(() => {
    cy.mountAccessible(
      <FeaturedWork featuredResearch={featuredResearch} labels={labels} />
    );
  });

  it("renders section heading", () => {
    cy.get("h2").should("contain.text", "Featured Work");
  });

  it("renders all three cards", () => {
    cy.get("article").should("have.length", 3);
  });

  it("renders research card with project title", () => {
    cy.contains("Supportive Automated Feedback for Short Essay Answers").should("exist");
  });

  it("renders engineering card", () => {
    cy.contains("HiveMQ Edge").should("exist");
  });

  it("has no axe accessibility violations", () => {
    cy.checkA11y();
  });
});
