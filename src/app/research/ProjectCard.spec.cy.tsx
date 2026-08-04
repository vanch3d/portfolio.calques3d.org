import { ProjectCard } from "./ProjectCard";
import type { ResearchProject } from "@/types/content";

const base: ResearchProject = {
  slug: "test-project",
  title: "A Test Research Project",
  type: "research",
  status: "completed",
  visibility: "public",
  featured: false,
  position: "test-position",
  period: { start: "2010", end: "2015" },
  links: {},
  tags: ["ai", "learning-analytics"],
};

// Explicit labels keep CT tests independent of the translation file
const labels = {
  fundedBy: (funder: string) => `Funded by ${funder}`,
  ongoing: "ongoing",
};

describe("<ProjectCard />", () => {
  it("has no axe accessibility violations (default state)", () => {
    cy.mountAccessible(<ProjectCard project={base} labels={labels} />);
    cy.checkA11y();
  });

  it("has no axe accessibility violations (with funding and institution)", () => {
    cy.mountAccessible(
      <ProjectCard
        project={{ ...base, funding: "EPSRC", institution: "University of X" }}
        labels={labels}
      />
    );
    cy.checkA11y();
  });

  it("renders the project title as a link", () => {
    cy.mount(<ProjectCard project={base} labels={labels} />);
    cy.get("a").contains("A Test Research Project");
    cy.get(`a[href="/research/test-project"]`).should("exist");
  });

  it("renders the period", () => {
    cy.mount(<ProjectCard project={base} labels={labels} />);
    cy.contains("2010–2015");
  });

  it('shows the ongoing label when period.end is null', () => {
    cy.mount(
      <ProjectCard
        project={{ ...base, period: { start: "2020", end: null } }}
        labels={labels}
      />
    );
    cy.contains("2020–ongoing");
  });

  it("renders all tags", () => {
    cy.mount(<ProjectCard project={base} labels={labels} />);
    cy.contains("ai");
    cy.contains("learning-analytics");
  });

  it("renders abbreviation when provided", () => {
    cy.mount(<ProjectCard project={{ ...base, abbr: "TRP" }} labels={labels} />);
    cy.contains("TRP");
  });

  it("renders funding using the fundedBy label function", () => {
    cy.mount(
      <ProjectCard project={{ ...base, funding: "EPSRC" }} labels={labels} />
    );
    cy.contains("Funded by EPSRC");
  });

  it("renders institution when provided", () => {
    cy.mount(
      <ProjectCard
        project={{ ...base, institution: "University of X" }}
        labels={labels}
      />
    );
    cy.contains("University of X");
  });
});
