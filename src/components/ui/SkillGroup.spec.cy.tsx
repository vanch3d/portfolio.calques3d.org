import { SkillGroup } from "./SkillGroup";
import type { SkillGroup as SkillGroupData } from "@/types/content";

const group: SkillGroupData = {
  id: "frontend",
  label: "Frontend Engineering",
  skills: ["React", "TypeScript", "Next.js", "Tailwind"],
};

const singleSkill: SkillGroupData = {
  id: "single",
  label: "Testing",
  skills: ["Cypress"],
};

describe("SkillGroup", () => {
  it("renders the group label as a heading", () => {
    cy.mountAccessible(<SkillGroup group={group} />);
    cy.contains("h3", "Frontend Engineering");
  });

  it("renders all skills as tags", () => {
    cy.mountAccessible(<SkillGroup group={group} />);
    cy.contains("React");
    cy.contains("TypeScript");
    cy.contains("Next.js");
    cy.contains("Tailwind");
  });

  it("renders a single skill", () => {
    cy.mountAccessible(<SkillGroup group={singleSkill} />);
    cy.contains("Cypress");
  });

  it("has no axe accessibility violations", () => {
    cy.mountAccessible(<SkillGroup group={group} />);
    cy.checkA11y();
  });
});
