import { CaseStudyHeader } from "./CaseStudyHeader";
import type { CaseStudyHeaderLabels } from "./CaseStudyHeader";
import type { EngineeringProject } from "@/types/content";

const labels: CaseStudyHeaderLabels = {
  ongoing: "present",
  visibilityLabel: "Open source",
};

const publicProject: EngineeringProject = {
  slug: "hivemq-edge",
  title: "HiveMQ Edge",
  type: "engineering",
  status: "ongoing",
  visibility: "public",
  featured: true,
  position: "hivemq",
  period: { start: "2023-04", end: null },
  links: { github: ["hivemq/hivemq-edge"], external: [] },
  tags: ["React", "TypeScript"],
  role_title: "Lead Frontend Engineer",
  description: "Lead frontend role on HiveMQ Edge.",
};

const proprietaryProject: EngineeringProject = {
  ...publicProject,
  slug: "matillion",
  title: "Matillion Data Productivity Cloud",
  visibility: "proprietary",
  featured: false,
  position: "matillion",
  period: { start: "2022-01", end: "2023-03" },
  links: { github: [], external: [] },
  role_title: "Senior Software Engineer",
  client: "Matillion",
};

const minimalProject: EngineeringProject = {
  ...publicProject,
  slug: "minimal",
  title: "Minimal Project",
  role_title: undefined,
  client: undefined,
  description: undefined,
};

describe("CaseStudyHeader", () => {
  it("renders title", () => {
    cy.mountAccessible(<CaseStudyHeader project={publicProject} labels={labels} />);
    cy.contains("h1", "HiveMQ Edge");
  });

  it("renders period as meta", () => {
    cy.mountAccessible(<CaseStudyHeader project={publicProject} labels={labels} />);
    cy.contains("2023-04");
    cy.contains("present");
  });

  it("renders closed period for completed project", () => {
    cy.mountAccessible(
      <CaseStudyHeader
        project={proprietaryProject}
        labels={{ ...labels, visibilityLabel: "Proprietary" }}
      />
    );
    cy.contains("2022-01");
    cy.contains("2023-03");
  });

  it("renders role_title and client joined", () => {
    cy.mountAccessible(
      <CaseStudyHeader
        project={proprietaryProject}
        labels={{ ...labels, visibilityLabel: "Proprietary" }}
      />
    );
    cy.contains("Senior Software Engineer");
    cy.contains("Matillion");
  });

  it("renders description when provided", () => {
    cy.mountAccessible(<CaseStudyHeader project={publicProject} labels={labels} />);
    cy.contains("Lead frontend role on HiveMQ Edge.");
  });

  it("renders visibility badge", () => {
    cy.mountAccessible(<CaseStudyHeader project={publicProject} labels={labels} />);
    cy.contains("Open source");
  });

  it("renders without optional fields", () => {
    cy.mountAccessible(<CaseStudyHeader project={minimalProject} labels={labels} />);
    cy.contains("h1", "Minimal Project");
  });

  it("has no axe accessibility violations (public, ongoing)", () => {
    cy.mountAccessible(<CaseStudyHeader project={publicProject} labels={labels} />);
    cy.checkA11y();
  });

  it("has no axe accessibility violations (proprietary, completed)", () => {
    cy.mountAccessible(
      <CaseStudyHeader
        project={proprietaryProject}
        labels={{ ...labels, visibilityLabel: "Proprietary" }}
      />
    );
    cy.checkA11y();
  });
});
