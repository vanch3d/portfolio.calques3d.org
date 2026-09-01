import { describe, it, expect } from "vitest";
import { getSkills, getEducation } from "./cv";

describe("getSkills", () => {
  it("returns a non-empty array", () => {
    expect(getSkills().length).toBeGreaterThan(0);
  });

  it("each group has id, label, and a non-empty skills array", () => {
    for (const group of getSkills()) {
      expect(group.id).toBeTruthy();
      expect(group.label).toBeTruthy();
      expect(group.skills.length).toBeGreaterThan(0);
      for (const skill of group.skills) {
        expect(skill).toBeTruthy();
      }
    }
  });

  it("all group ids are unique", () => {
    const ids = getSkills().map((g) => g.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("getEducation", () => {
  it("returns a non-empty array", () => {
    expect(getEducation().length).toBeGreaterThan(0);
  });

  it("each entry has required fields with valid period strings", () => {
    for (const entry of getEducation()) {
      expect(entry.degree).toBeTruthy();
      expect(entry.institution).toBeTruthy();
      expect(entry.location).toBeTruthy();
      expect(entry.period.start).toMatch(/^\d{4}/);
      expect(entry.period.end).toMatch(/^\d{4}/);
    }
  });

  it("entries are sorted most-recent-first by period.end", () => {
    const entries = getEducation();
    for (let i = 1; i < entries.length; i++) {
      expect(entries[i - 1].period.end >= entries[i].period.end).toBe(true);
    }
  });
});
