import { ProjectHeader } from "./ProjectHeader";
import type { ResearchProject } from "@/types/content";

const base: ResearchProject = {
  slug: "calques3d",
  title: "Calques 3D",
  type: "research",
  status: "completed",
  visibility: "public",
  featured: true,
  position: "leeds",
  period: { start: "1997", end: "2005" },
  links: {},
  tags: ["geometry", "3d"],
};

const full: ResearchProject = {
  ...base,
  abbr: "C3D",
  description: "A microworld for 3D dynamic geometry.",
};

const labels = { period: "1997–2005" };

describe("ProjectHeader", () => {
  it("renders the project title as h1", () => {
    cy.mountAccessible(<ProjectHeader project={base} labels={labels} />);
    cy.get("h1").should("contain.text", "Calques 3D");
  });

  it("renders the period label", () => {
    cy.mountAccessible(<ProjectHeader project={base} labels={labels} />);
    cy.contains("1997–2005").should("exist");
  });

  it("renders abbr when defined", () => {
    cy.mountAccessible(<ProjectHeader project={full} labels={labels} />);
    cy.contains("C3D").should("exist");
  });

  it("does not render abbr when absent", () => {
    cy.mountAccessible(<ProjectHeader project={base} labels={labels} />);
    cy.contains("C3D").should("not.exist");
  });

  it("renders description when defined", () => {
    cy.mountAccessible(<ProjectHeader project={full} labels={labels} />);
    cy.contains("A microworld for 3D dynamic geometry.").should("exist");
  });

  it("does not render description when absent", () => {
    cy.mountAccessible(<ProjectHeader project={base} labels={labels} />);
    cy.contains("A microworld for 3D dynamic geometry.").should("not.exist");
  });

  it("has no axe accessibility violations (minimal)", () => {
    cy.mountAccessible(<ProjectHeader project={base} labels={labels} />);
    cy.checkA11y();
  });

  it("has no axe accessibility violations (all optional fields)", () => {
    cy.mountAccessible(<ProjectHeader project={full} labels={labels} />);
    cy.checkA11y();
  });
});
