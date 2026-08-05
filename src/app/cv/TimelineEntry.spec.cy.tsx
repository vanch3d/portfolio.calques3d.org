import { TimelineEntry, type TimelineEntryLabels } from "./TimelineEntry";
import type { Position } from "@/types/content";

const TYPE_LABELS: Record<string, string> = {
  employment: "Full-time",
  contract: "Contract",
  freelance: "Freelance",
  voluntary: "Voluntary",
  academic: "Research staff",
  phd: "PhD Student",
};

const labels: TimelineEntryLabels = {
  ongoing: "present",
  typeLabel: (type) => TYPE_LABELS[type] ?? type,
};

const basePosition: Position = {
  slug: "hivemq",
  title: "Senior Software Engineer",
  organisation: "HiveMQ",
  location: "Landshut, Germany (fully remote, Co. Galway)",
  period: { start: "2023-04", end: null },
  type: "employment",
  tags: ["React", "TypeScript", "Cypress"],
};

describe("TimelineEntry", () => {
  it("renders position title and organisation", () => {
    cy.mountAccessible(
      <ol>
        <TimelineEntry position={basePosition} labels={labels} />
      </ol>
    );
    cy.contains("Senior Software Engineer").should("exist");
    cy.contains("HiveMQ").should("exist");
  });

  it("shows 'present' for ongoing positions", () => {
    cy.mountAccessible(
      <ol>
        <TimelineEntry position={basePosition} labels={labels} />
      </ol>
    );
    cy.contains("2023–present").should("exist");
  });

  it("shows end year for completed positions", () => {
    const completed: Position = {
      ...basePosition,
      period: { start: "2022-01", end: "2023-04" },
    };
    cy.mountAccessible(
      <ol>
        <TimelineEntry position={completed} labels={labels} />
      </ol>
    );
    cy.contains("2022–2023").should("exist");
  });

  it("renders translated type label", () => {
    cy.mountAccessible(
      <ol>
        <TimelineEntry position={basePosition} labels={labels} />
      </ol>
    );
    cy.contains("Full-time").should("exist");
  });

  it("renders PhD Student label for phd type", () => {
    const phdPos: Position = { ...basePosition, type: "phd" };
    cy.mountAccessible(
      <ol>
        <TimelineEntry position={phdPos} labels={labels} />
      </ol>
    );
    cy.contains("PhD Student").should("exist");
  });

  it("renders tags", () => {
    cy.mountAccessible(
      <ol>
        <TimelineEntry position={basePosition} labels={labels} />
      </ol>
    );
    cy.contains("React").should("exist");
    cy.contains("TypeScript").should("exist");
  });

  it("has no axe accessibility violations", () => {
    cy.mountAccessible(
      <ol>
        <TimelineEntry position={basePosition} labels={labels} />
      </ol>
    );
    cy.checkA11y();
  });

  it("has no axe accessibility violations (with department)", () => {
    const withDept: Position = {
      ...basePosition,
      department: "Product & Engineering",
    };
    cy.mountAccessible(
      <ol>
        <TimelineEntry position={withDept} labels={labels} />
      </ol>
    );
    cy.checkA11y();
  });
});
