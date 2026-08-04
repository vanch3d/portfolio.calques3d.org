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

describe("<ProjectCard />", () => {
  it("renders the project title as a link", () => {
    cy.mount(<ProjectCard project={base} />);
    cy.get("a").contains("A Test Research Project");
    cy.get(`a[href="/research/test-project"]`).should("exist");
  });

  it("renders the period", () => {
    cy.mount(<ProjectCard project={base} />);
    cy.contains("2010–2015");
  });

  it('shows "ongoing" when period.end is null', () => {
    cy.mount(
      <ProjectCard project={{ ...base, period: { start: "2020", end: null } }} />
    );
    cy.contains("2020–ongoing");
  });

  it("renders all tags", () => {
    cy.mount(<ProjectCard project={base} />);
    cy.contains("ai");
    cy.contains("learning-analytics");
  });

  it("renders abbreviation when provided", () => {
    cy.mount(<ProjectCard project={{ ...base, abbr: "TRP" }} />);
    cy.contains("TRP");
  });

  it("renders funding when provided", () => {
    cy.mount(<ProjectCard project={{ ...base, funding: "EPSRC" }} />);
    cy.contains("Funded by EPSRC");
  });

  it("renders institution when provided", () => {
    cy.mount(<ProjectCard project={{ ...base, institution: "University of X" }} />);
    cy.contains("University of X");
  });
});
