import { EngineeringProjectMeta } from "./EngineeringProjectMeta";
import type { EngineeringProject } from "@/types/content";

const base: EngineeringProject = {
  slug: "test-project",
  title: "A Test Engineering Project",
  type: "engineering",
  status: "completed",
  visibility: "public",
  featured: false,
  position: "test-position",
  client: "Test Client",
  role_title: "Lead Engineer",
  period: { start: "2020", end: "2023" },
  links: {
    github: ["org/repo"],
    external: ["https://example.com/docs"],
    live: "https://example.com",
  },
  tags: ["React", "TypeScript"],
  highlights: ["Built the core UI"],
  artefacts: [],
};

const labels = {
  tagsLabel: "Technologies",
  repositoriesLabel: "Repositories",
  externalLinksLabel: "Links",
  liveLabel: "Live site",
};

describe("<EngineeringProjectMeta />", () => {
  it("has no axe accessibility violations (public)", () => {
    cy.mountAccessible(
      <EngineeringProjectMeta project={base} labels={labels} />
    );
    cy.checkA11y();
  });

  it("has no axe accessibility violations (proprietary)", () => {
    cy.mountAccessible(
      <EngineeringProjectMeta
        project={{ ...base, visibility: "proprietary" }}
        labels={labels}
      />
    );
    cy.checkA11y();
  });

  it("has no axe accessibility violations (no optional links)", () => {
    cy.mountAccessible(
      <EngineeringProjectMeta
        project={{ ...base, links: {}, tags: [] }}
        labels={labels}
      />
    );
    cy.checkA11y();
  });

  it("renders technology tags", () => {
    cy.mount(<EngineeringProjectMeta project={base} labels={labels} />);
    cy.contains("React");
    cy.contains("TypeScript");
  });

  it("renders github link for public projects", () => {
    cy.mount(<EngineeringProjectMeta project={base} labels={labels} />);
    cy.get('a[href="https://github.com/org/repo"]').should("exist");
  });

  it("renders github link for proprietary projects", () => {
    cy.mount(
      <EngineeringProjectMeta
        project={{ ...base, visibility: "proprietary" }}
        labels={labels}
      />
    );
    cy.get('a[href="https://github.com/org/repo"]').should("exist");
  });

  it("renders external links for public projects", () => {
    cy.mount(<EngineeringProjectMeta project={base} labels={labels} />);
    cy.get('a[href="https://example.com/docs"]').should("exist");
  });

  it("hides external links for proprietary projects", () => {
    cy.mount(
      <EngineeringProjectMeta
        project={{ ...base, visibility: "proprietary" }}
        labels={labels}
      />
    );
    cy.get('a[href="https://example.com/docs"]').should("not.exist");
  });

  it("renders live link for public projects", () => {
    cy.mount(<EngineeringProjectMeta project={base} labels={labels} />);
    cy.get('a[href="https://example.com"]').should("exist");
  });

  it("hides live link for proprietary projects", () => {
    cy.mount(
      <EngineeringProjectMeta
        project={{ ...base, visibility: "proprietary" }}
        labels={labels}
      />
    );
    cy.get('a[href="https://example.com"]').should("not.exist");
  });

  it("renders nothing when project has no tags and no links", () => {
    cy.mount(
      <EngineeringProjectMeta
        project={{ ...base, links: {}, tags: [] }}
        labels={labels}
      />
    );
    cy.get("section").should("not.exist");
  });
});
