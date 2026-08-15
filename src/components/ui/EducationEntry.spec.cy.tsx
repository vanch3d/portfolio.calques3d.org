import { EducationEntry } from "./EducationEntry";
import type { EducationRecord } from "@/types/content";

const entry: EducationRecord = {
  degree: "PhD in Computer Science",
  institution: "Université Henri Poincaré – Nancy I",
  location: "Nancy, France",
  period: { start: "1996-02", end: "1999-12" },
  description: "Involving teachers in the design of Interactive Learning Environments.",
};

const noDescription: EducationRecord = {
  degree: "BSc Computer Science",
  institution: "University of Example",
  location: "Example, UK",
  period: { start: "1988-10", end: "1991-06" },
};

describe("EducationEntry", () => {
  it("renders the degree as a heading", () => {
    cy.mountAccessible(<EducationEntry entry={entry} />);
    cy.contains("h3", "PhD in Computer Science");
  });

  it("renders institution and location", () => {
    cy.mountAccessible(<EducationEntry entry={entry} />);
    cy.contains("Université Henri Poincaré – Nancy I");
    cy.contains("Nancy, France");
  });

  it("renders the period (year only)", () => {
    cy.mountAccessible(<EducationEntry entry={entry} />);
    cy.contains("1996 – 1999");
  });

  it("renders description when provided", () => {
    cy.mountAccessible(<EducationEntry entry={entry} />);
    cy.contains("Involving teachers in the design");
  });

  it("does not render a description element when absent", () => {
    cy.mountAccessible(<EducationEntry entry={noDescription} />);
    cy.get("p").should("have.length", 2); // institution line + period line, no description
  });

  it("has no axe accessibility violations", () => {
    cy.mountAccessible(<EducationEntry entry={entry} />);
    cy.checkA11y();
  });

  it("has no axe accessibility violations (no description)", () => {
    cy.mountAccessible(<EducationEntry entry={noDescription} />);
    cy.checkA11y();
  });
});
