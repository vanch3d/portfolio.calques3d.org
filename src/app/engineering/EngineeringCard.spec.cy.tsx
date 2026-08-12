import { EngineeringCard } from "./EngineeringCard";
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
  highlights: [
    "Built the core UI from scratch",
    "Led a team of 3 engineers",
    "Shipped 6 major features",
  ],
};

// Explicit labels — CT tests are independent of the translation file
const labels = {
  ongoing: "present",
  visibilityPublic: "Open source",
  visibilityProprietary: "Proprietary",
  visibilityRedacted: "Confidential",
  cardLinkLabel: "View case study",
};

describe("<EngineeringCard />", () => {
  it("has no axe accessibility violations (public)", () => {
    cy.mountAccessible(<EngineeringCard project={base} labels={labels} />);
    cy.checkA11y();
  });

  it("has no axe accessibility violations (proprietary)", () => {
    cy.mountAccessible(
      <EngineeringCard
        project={{ ...base, visibility: "proprietary" }}
        labels={labels}
      />
    );
    cy.checkA11y();
  });

  it("has no axe accessibility violations (redacted)", () => {
    cy.mountAccessible(
      <EngineeringCard
        project={{ ...base, visibility: "redacted" }}
        labels={labels}
      />
    );
    cy.checkA11y();
  });

  it("renders title as a link for public projects", () => {
    cy.mount(<EngineeringCard project={base} labels={labels} />);
    cy.get(`a[href="/engineering/test-project"]`).should("exist");
    cy.get("h2").contains("A Test Engineering Project");
  });

  it("renders title as a link for proprietary projects", () => {
    cy.mount(
      <EngineeringCard
        project={{ ...base, visibility: "proprietary" }}
        labels={labels}
      />
    );
    cy.get(`a[href="/engineering/test-project"]`).should("exist");
  });

  it("renders title without a link for redacted projects", () => {
    cy.mount(
      <EngineeringCard
        project={{ ...base, visibility: "redacted" }}
        labels={labels}
      />
    );
    cy.get(`a[href="/engineering/test-project"]`).should("not.exist");
    cy.get("h2").contains("A Test Engineering Project");
  });

  it("renders the period", () => {
    cy.mount(<EngineeringCard project={base} labels={labels} />);
    cy.contains("2020–2023");
  });

  it("shows the ongoing label when period.end is null", () => {
    cy.mount(
      <EngineeringCard
        project={{ ...base, period: { start: "2023", end: null } }}
        labels={labels}
      />
    );
    cy.contains("2023–present");
  });

  it("renders role and client", () => {
    cy.mount(<EngineeringCard project={base} labels={labels} />);
    cy.contains("Lead Engineer");
    cy.contains("Test Client");
  });

  it("renders up to 3 highlights", () => {
    cy.mount(<EngineeringCard project={base} labels={labels} />);
    cy.contains("Built the core UI from scratch");
    cy.contains("Led a team of 3 engineers");
    cy.contains("Shipped 6 major features");
  });

  it("renders all tags as badges", () => {
    cy.mount(<EngineeringCard project={base} labels={labels} />);
    cy.contains("React");
    cy.contains("TypeScript");
  });

  it("renders the visibility badge — public", () => {
    cy.mount(<EngineeringCard project={base} labels={labels} />);
    cy.contains("Open source");
  });

  it("renders the visibility badge — proprietary", () => {
    cy.mount(
      <EngineeringCard
        project={{ ...base, visibility: "proprietary" }}
        labels={labels}
      />
    );
    cy.contains("Proprietary");
  });

  it("shows case study link for public projects", () => {
    cy.mount(<EngineeringCard project={base} labels={labels} />);
    cy.contains("View case study");
  });

  it("hides case study link for proprietary projects", () => {
    cy.mount(
      <EngineeringCard
        project={{ ...base, visibility: "proprietary" }}
        labels={labels}
      />
    );
    cy.contains("View case study").should("not.exist");
  });

  it("hides case study link for redacted projects", () => {
    cy.mount(
      <EngineeringCard
        project={{ ...base, visibility: "redacted" }}
        labels={labels}
      />
    );
    cy.contains("View case study").should("not.exist");
  });
});
