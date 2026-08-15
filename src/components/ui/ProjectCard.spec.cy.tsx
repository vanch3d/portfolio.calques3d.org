import { ProjectCard } from "./ProjectCard";
import type { ProjectBase } from "@/types/content";

const base: ProjectBase = {
  slug: "calques3d",
  title: "Calques 3D",
  abbr: "Calques 3D",
  type: "research",
  status: "archived",
  visibility: "public",
  featured: true,
  position: "nancy",
  period: { start: "1995", end: "2010" },
  links: { github: [], external: [] },
  tags: ["3D geometry", "ILE", "dynamic geometry"],
  description: "A 3D dynamic geometry microworld for learning.",
};

const proprietary: ProjectBase = {
  ...base,
  slug: "matillion",
  title: "Matillion Data Productivity Cloud",
  abbr: "Matillion",
  type: "engineering",
  visibility: "proprietary",
  featured: false,
};

const redacted: ProjectBase = {
  ...base,
  slug: "intrica",
  title: "Intrica",
  abbr: "Intrica",
  type: "engineering",
  visibility: "redacted",
  featured: false,
};

const labels = {
  ongoing: "present",
  visibilityPublic: "Open source",
  visibilityProprietary: "Proprietary",
  visibilityRedacted: "Redacted",
};

// ─── Default variant ──────────────────────────────────────────────────────────

describe("ProjectCard — default variant", () => {
  it("renders title and period", () => {
    cy.mountAccessible(<ProjectCard project={base} basePath="/research" labels={labels} />);
    cy.contains("Calques 3D").should("exist");
    cy.contains("1995–2010").should("exist");
  });

  it("renders description when provided", () => {
    cy.mountAccessible(<ProjectCard project={base} basePath="/research" labels={labels} />);
    cy.contains("A 3D dynamic geometry microworld").should("exist");
  });

  it("renders up to 3 tags", () => {
    cy.mountAccessible(<ProjectCard project={base} basePath="/research" labels={labels} />);
    cy.get("[aria-label='Tags'] li").should("have.length", 3);
  });

  it("links to detail page for public projects", () => {
    cy.mountAccessible(<ProjectCard project={base} basePath="/research" labels={labels} />);
    cy.contains("a", "Calques 3D").should("have.attr", "href", "/research/calques3d");
  });

  it("shows no link for redacted projects", () => {
    cy.mountAccessible(<ProjectCard project={redacted} basePath="/engineering" labels={labels} />);
    cy.contains("Intrica");
    cy.get("a[href*='intrica']").should("not.exist");
  });

  it("shows visibility badge for proprietary projects", () => {
    cy.mountAccessible(<ProjectCard project={proprietary} basePath="/engineering" labels={labels} />);
    cy.contains("Proprietary").should("exist");
  });

  it("uses ongoing label when period.end is null", () => {
    const ongoing = { ...base, period: { start: "2023", end: null } };
    cy.mountAccessible(<ProjectCard project={ongoing} basePath="/research" labels={labels} />);
    cy.contains("2023–present").should("exist");
  });

  it("has no axe accessibility violations (public)", () => {
    cy.mountAccessible(<ProjectCard project={base} basePath="/research" labels={labels} />);
    cy.checkA11y();
  });

  it("has no axe accessibility violations (proprietary)", () => {
    cy.mountAccessible(<ProjectCard project={proprietary} basePath="/engineering" labels={labels} />);
    cy.checkA11y();
  });

  it("has no axe accessibility violations (redacted)", () => {
    cy.mountAccessible(<ProjectCard project={redacted} basePath="/engineering" labels={labels} />);
    cy.checkA11y();
  });
});

// ─── Mini variant ─────────────────────────────────────────────────────────────

describe("ProjectCard — mini variant", () => {
  it("renders abbr and period", () => {
    cy.mountAccessible(
      <ProjectCard project={base} variant="mini" basePath="/research" labels={labels} />
    );
    cy.contains("Calques 3D").should("exist");
    cy.contains("1995–2010").should("exist");
  });

  it("renders up to 2 tags in mini variant", () => {
    cy.mountAccessible(
      <ProjectCard project={base} variant="mini" basePath="/research" labels={labels} />
    );
    cy.get("[aria-label='Tags'] li").should("have.length", 2);
  });

  it("has no axe accessibility violations (mini public)", () => {
    cy.mountAccessible(
      <ProjectCard project={base} variant="mini" basePath="/research" labels={labels} />
    );
    cy.checkA11y();
  });

  it("has no axe accessibility violations (mini proprietary)", () => {
    cy.mountAccessible(
      <ProjectCard project={proprietary} variant="mini" basePath="/engineering" labels={labels} />
    );
    cy.checkA11y();
  });
});
