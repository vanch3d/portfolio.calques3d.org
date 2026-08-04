import { describe, it, expect } from "vitest";
import {
  getAllResearchProjects,
  getResearchProjectBySlug,
  getResearchSlugs,
} from "./research";

describe("getAllResearchProjects", () => {
  it("returns at least one project", () => {
    expect(getAllResearchProjects().length).toBeGreaterThan(0);
  });

  it("featured projects come before non-featured", () => {
    const projects = getAllResearchProjects();
    let seenNonFeatured = false;
    for (const p of projects) {
      if (!p.featured) seenNonFeatured = true;
      if (seenNonFeatured) expect(p.featured).toBe(false);
    }
  });

  it("slugs never contain the .mdx extension", () => {
    for (const p of getAllResearchProjects()) {
      expect(p.slug).not.toMatch(/\.mdx$/);
    }
  });

  it("every project has required fields", () => {
    for (const p of getAllResearchProjects()) {
      expect(p.slug).toBeTruthy();
      expect(p.title).toBeTruthy();
      expect(p.period.start).toBeTruthy();
      expect(["research", "engineering"]).toContain(p.type);
      expect(["completed", "ongoing", "archived"]).toContain(p.status);
      expect(["public", "proprietary", "redacted"]).toContain(p.visibility);
    }
  });
});

describe("getResearchProjectBySlug", () => {
  it("returns the correct project for a known slug", () => {
    const project = getResearchProjectBySlug("safesea");
    expect(project).not.toBeNull();
    expect(project?.slug).toBe("safesea");
    expect(project?.type).toBe("research");
  });

  it("returns null for an unknown slug", () => {
    expect(getResearchProjectBySlug("does-not-exist-xyz")).toBeNull();
  });
});

describe("getResearchSlugs", () => {
  it("returns at least one slug", () => {
    expect(getResearchSlugs().length).toBeGreaterThan(0);
  });

  it("slugs have no .mdx extension", () => {
    for (const slug of getResearchSlugs()) {
      expect(slug).not.toMatch(/\.mdx$/);
    }
  });

  it("includes safesea", () => {
    expect(getResearchSlugs()).toContain("safesea");
  });

  it("slug count matches getAllResearchProjects count", () => {
    expect(getResearchSlugs().length).toBe(getAllResearchProjects().length);
  });
});
