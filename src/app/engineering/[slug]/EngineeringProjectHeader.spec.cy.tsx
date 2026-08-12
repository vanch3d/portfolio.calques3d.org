import { EngineeringProjectHeader } from "./EngineeringProjectHeader";
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
  highlights: ["Built the core UI from scratch"],
  artefacts: [],
};

const labels = {
  ongoing: "present",
  periodLabel: "Period",
  roleLabel: "Role",
  clientLabel: "Client",
  tagsLabel: "Technologies",
  repositoriesLabel: "Repositories",
  externalLinksLabel: "Links",
  liveLabel: "Live site",
};

describe("<EngineeringProjectHeader />", () => {
  it("has no axe accessibility violations (public)", () => {
    cy.mountAccessible(
      <EngineeringProjectHeader project={base} labels={labels} />
    );
    cy.checkA11y();
  });

  it("has no axe accessibility violations (proprietary)", () => {
    cy.mountAccessible(
      <EngineeringProjectHeader
        project={{ ...base, visibility: "proprietary" }}
        labels={labels}
      />
    );
    cy.checkA11y();
  });

  it("has no axe accessibility violations (minimal — no optional fields)", () => {
    cy.mountAccessible(
      <EngineeringProjectHeader
        project={{
          ...base,
          role_title: undefined,
          client: undefined,
          links: {},
          tags: [],
        }}
        labels={labels}
      />
    );
    cy.checkA11y();
  });

  it("renders the project title as h1", () => {
    cy.mount(<EngineeringProjectHeader project={base} labels={labels} />);
    cy.get("h1").contains("A Test Engineering Project");
  });

  it("renders role and client subtitle", () => {
    cy.mount(<EngineeringProjectHeader project={base} labels={labels} />);
    cy.contains("Lead Engineer · Test Client");
  });

  it("renders the period in the metadata list", () => {
    cy.mount(<EngineeringProjectHeader project={base} labels={labels} />);
    cy.contains("2020–2023");
  });

  it("shows 'present' when period.end is null", () => {
    cy.mount(
      <EngineeringProjectHeader
        project={{ ...base, period: { start: "2023", end: null } }}
        labels={labels}
      />
    );
    cy.contains("2023–present");
  });

  it("renders tags as badges", () => {
    cy.mount(<EngineeringProjectHeader project={base} labels={labels} />);
    cy.contains("React");
    cy.contains("TypeScript");
  });

  it("shows github link for public projects", () => {
    cy.mount(<EngineeringProjectHeader project={base} labels={labels} />);
    cy.get('a[href="https://github.com/org/repo"]').should("exist");
  });

  it("shows github link for proprietary projects", () => {
    cy.mount(
      <EngineeringProjectHeader
        project={{ ...base, visibility: "proprietary" }}
        labels={labels}
      />
    );
    cy.get('a[href="https://github.com/org/repo"]').should("exist");
  });

  it("shows external links for public projects", () => {
    cy.mount(<EngineeringProjectHeader project={base} labels={labels} />);
    cy.get('a[href="https://example.com/docs"]').should("exist");
  });

  it("hides external links for proprietary projects", () => {
    cy.mount(
      <EngineeringProjectHeader
        project={{ ...base, visibility: "proprietary" }}
        labels={labels}
      />
    );
    cy.get('a[href="https://example.com/docs"]').should("not.exist");
  });

  it("shows live link for public projects", () => {
    cy.mount(<EngineeringProjectHeader project={base} labels={labels} />);
    cy.get('a[href="https://example.com"]').should("exist");
  });

  it("hides live link for proprietary projects", () => {
    cy.mount(
      <EngineeringProjectHeader
        project={{ ...base, visibility: "proprietary" }}
        labels={labels}
      />
    );
    cy.get('a[href="https://example.com"]').should("not.exist");
  });
});
