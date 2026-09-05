import { LabRegisterHeader } from "./LabRegisterHeader";

describe("LabRegisterHeader", () => {
  it("renders the left label text", () => {
    cy.mountAccessible(
      <LabRegisterHeader
        leftLabel="ARCHITECTURE DECISION RECORDS"
        title="Revision Register — Portfolio Build"
        metadata={["RECORDS: 19", "AS OF: 2026-09-05"]}
      />
    );
    cy.get("header").contains("ARCHITECTURE DECISION RECORDS");
  });

  it("renders the centre title", () => {
    cy.mountAccessible(
      <LabRegisterHeader
        leftLabel="ARCHITECTURE DECISION RECORDS"
        title="Revision Register — Portfolio Build"
        metadata={["RECORDS: 19", "AS OF: 2026-09-05"]}
      />
    );
    cy.get("h1").should("contain.text", "Revision Register — Portfolio Build");
  });

  it("renders each metadata line as a separate block span", () => {
    cy.mountAccessible(
      <LabRegisterHeader
        leftLabel="ARCHITECTURE DECISION RECORDS"
        title="Revision Register — Portfolio Build"
        metadata={["RECORDS: 19", "INSIGHTS: 1", "AS OF: 2026-09-05"]}
      />
    );
    cy.get("header").contains("RECORDS: 19");
    cy.get("header").contains("INSIGHTS: 1");
    cy.get("header").contains("AS OF: 2026-09-05");
  });

  it("renders a single metadata line correctly", () => {
    cy.mountAccessible(
      <LabRegisterHeader
        leftLabel="ENGINEERING INSIGHTS"
        title="Insights Register — Portfolio Build"
        metadata={["INSIGHTS: 1"]}
      />
    );
    cy.get("header").contains("INSIGHTS: 1");
  });

  it("renders with role banner", () => {
    cy.mountAccessible(
      <LabRegisterHeader
        leftLabel="ARCHITECTURE DECISION RECORDS"
        title="Revision Register — Portfolio Build"
        metadata={["RECORDS: 19"]}
      />
    );
    cy.get("[role='banner']").should("exist");
  });

  it("has no axe accessibility violations (default state)", () => {
    cy.mountAccessible(
      <LabRegisterHeader
        leftLabel="ARCHITECTURE DECISION RECORDS"
        title="Revision Register — Portfolio Build"
        metadata={["RECORDS: 19", "AS OF: 2026-09-05"]}
      />
    );
    cy.checkA11y();
  });

  it("has no axe accessibility violations (multiple metadata lines)", () => {
    cy.mountAccessible(
      <LabRegisterHeader
        leftLabel="ARCHITECTURE DECISION RECORDS"
        title="Revision Register — Portfolio Build"
        metadata={["RECORDS: 19", "INSIGHTS: 1", "AS OF: 2026-09-05"]}
      />
    );
    cy.checkA11y();
  });
});
