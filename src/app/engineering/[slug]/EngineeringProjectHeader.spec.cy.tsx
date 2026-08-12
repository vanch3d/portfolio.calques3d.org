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
  links: {},
  tags: ["React", "TypeScript"],
  highlights: ["Built the core UI from scratch"],
  artefacts: [],
};

const labels = { ongoing: "present" };

describe("<EngineeringProjectHeader />", () => {
  it("has no axe accessibility violations (with role and client)", () => {
    cy.mountAccessible(
      <EngineeringProjectHeader project={base} labels={labels} />
    );
    cy.checkA11y();
  });

  it("has no axe accessibility violations (no optional fields)", () => {
    cy.mountAccessible(
      <EngineeringProjectHeader
        project={{ ...base, role_title: undefined, client: undefined }}
        labels={labels}
      />
    );
    cy.checkA11y();
  });

  it("renders the project title as h1", () => {
    cy.mount(<EngineeringProjectHeader project={base} labels={labels} />);
    cy.get("h1").contains("A Test Engineering Project");
  });

  it("renders role and client as subtitle", () => {
    cy.mount(<EngineeringProjectHeader project={base} labels={labels} />);
    cy.contains("Lead Engineer · Test Client");
  });

  it("renders the period", () => {
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

  it("omits subtitle when neither role_title nor client is set", () => {
    cy.mount(
      <EngineeringProjectHeader
        project={{ ...base, role_title: undefined, client: undefined }}
        labels={labels}
      />
    );
    cy.get("p").should("have.length", 1); // only the period line
  });
});
