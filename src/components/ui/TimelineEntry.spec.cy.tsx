import { TimelineEntry } from "./TimelineEntry";
import type { TimelineEntryLabels } from "./TimelineEntry";
import type { Position } from "@/types/content";

const labels: TimelineEntryLabels = {
  ongoing: "present",
  typeLabel: "Employment",
};

const basePosition: Position = {
  slug: "acme",
  title: "Senior Frontend Engineer",
  organisation: "Acme Corp",
  location: "London, UK",
  period: { start: "2022-01", end: "2024-06" },
  type: "employment",
  tags: ["React", "TypeScript"],
  description: "Built customer-facing UI features.",
};

const ongoingPosition: Position = {
  ...basePosition,
  slug: "acme-current",
  period: { start: "2023-04", end: null },
};

const withDepartment: Position = {
  ...basePosition,
  slug: "acme-dept",
  department: "Platform",
};

const withSites: Position = {
  ...basePosition,
  slug: "multi-site",
  organisation: "University Network",
  sites: [
    { institution: "University A", location: "City A", period: { start: "2004-02", end: "2005-01" } },
    { institution: "University B", period: { start: "2005-03", end: "2006-07" } },
  ],
};

// Wrap in an ol to give TimelineEntry valid context
function mountInTimeline(jsx: React.ReactNode) {
  return cy.mountAccessible(<ol className="relative ml-3 border-l-2">{jsx}</ol>);
}

describe("TimelineEntry", () => {
  it("renders title and organisation", () => {
    mountInTimeline(<TimelineEntry position={basePosition} labels={labels} />);
    cy.contains("h3", "Senior Frontend Engineer");
    cy.contains("Acme Corp");
  });

  it("renders formatted period", () => {
    mountInTimeline(<TimelineEntry position={basePosition} labels={labels} />);
    cy.contains("2022-01 – 2024-06");
  });

  it("renders 'present' for ongoing positions", () => {
    mountInTimeline(<TimelineEntry position={ongoingPosition} labels={labels} />);
    cy.contains("present");
  });

  it("renders the type badge", () => {
    mountInTimeline(<TimelineEntry position={basePosition} labels={labels} />);
    cy.contains("Employment");
  });

  it("renders department when provided", () => {
    mountInTimeline(<TimelineEntry position={withDepartment} labels={labels} />);
    cy.contains("Platform");
  });

  it("renders description when provided", () => {
    mountInTimeline(<TimelineEntry position={basePosition} labels={labels} />);
    cy.contains("Built customer-facing UI features.");
  });

  it("renders tags", () => {
    mountInTimeline(<TimelineEntry position={basePosition} labels={labels} />);
    cy.contains("React");
    cy.contains("TypeScript");
  });

  it("renders multi-site institutions", () => {
    mountInTimeline(<TimelineEntry position={withSites} labels={labels} />);
    cy.contains("University A");
    cy.contains("University B");
  });

  it("has no axe accessibility violations", () => {
    mountInTimeline(<TimelineEntry position={basePosition} labels={labels} />);
    cy.checkA11y();
  });

  it("has no axe accessibility violations (ongoing)", () => {
    mountInTimeline(<TimelineEntry position={ongoingPosition} labels={labels} />);
    cy.checkA11y();
  });
});
