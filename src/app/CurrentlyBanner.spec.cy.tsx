import { CurrentlyBanner, type CurrentlyBannerLabels } from "./CurrentlyBanner";
import type { Position } from "@/types/content";

const labels: CurrentlyBannerLabels = {
  sectionLabel: "Current position",
  prefix: "Currently",
  body: "Building the frontend for HiveMQ Edge.",
  linkLabel: "View engineering work →",
};

const position: Position = {
  slug: "hivemq",
  title: "Senior Software Engineer",
  organisation: "HiveMQ",
  location: "Landshut, Germany (fully remote, Co. Galway)",
  period: { start: "2023-04", end: null },
  type: "employment",
  tags: [],
};

describe("CurrentlyBanner", () => {
  beforeEach(() => {
    cy.mountAccessible(<CurrentlyBanner position={position} labels={labels} />);
  });

  it("renders the prefix", () => {
    cy.contains("Currently").should("exist");
  });

  it("renders the current role", () => {
    cy.contains("Senior Software Engineer at HiveMQ").should("exist");
  });

  it("renders the body text", () => {
    cy.contains("Building the frontend for HiveMQ Edge.").should("exist");
  });

  it("renders the link", () => {
    cy.get("a").should("have.attr", "href", "/engineering");
  });

  it("has no axe accessibility violations", () => {
    cy.checkA11y();
  });
});
