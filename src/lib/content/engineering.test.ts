import { describe, it, expect } from "vitest";
import {
  getAllEngineeringProjects,
  getEngineeringProjectBySlug,
  getEngineeringSlugs,
} from "./engineering";

describe("getAllEngineeringProjects", () => {
  it("returns at least one project", () => {
    expect(getAllEngineeringProjects().length).toBeGreaterThan(0);
  });

  it("featured projects come before non-featured", () => {
    const projects = getAllEngineeringProjects();
    let seenNonFeatured = false;
    for (const p of projects) {
      if (!p.featured) seenNonFeatured = true;
      if (seenNonFeatured) expect(p.featured).toBe(false);
    }
  });

  it("slugs never contain the .mdx extension", () => {
    for (const p of getAllEngineeringProjects()) {
      expect(p.slug).not.toMatch(/\.mdx$/);
    }
  });

  it("every project has required fields", () => {
    for (const p of getAllEngineeringProjects()) {
      expect(p.slug).toBeTruthy();
      expect(p.title).toBeTruthy();
      expect(p.period.start).toBeTruthy();
      expect(p.type).toBe("engineering");
      expect(["completed", "ongoing", "archived"]).toContain(p.status);
      expect(["public", "proprietary", "redacted"]).toContain(p.visibility);
    }
  });

  it("hivemq-edge is the featured project", () => {
    const first = getAllEngineeringProjects()[0];
    expect(first.slug).toBe("hivemq-edge");
    expect(first.featured).toBe(true);
  });
});

describe("getEngineeringProjectBySlug", () => {
  it("returns the correct project for a known slug", () => {
    const project = getEngineeringProjectBySlug("hivemq-edge");
    expect(project).not.toBeNull();
    expect(project?.slug).toBe("hivemq-edge");
    expect(project?.type).toBe("engineering");
    expect(project?.visibility).toBe("public");
  });

  it("returns null for an unknown slug", () => {
    expect(getEngineeringProjectBySlug("does-not-exist-xyz")).toBeNull();
  });
});

describe("getEngineeringSlugs", () => {
  it("returns at least one slug", () => {
    expect(getEngineeringSlugs().length).toBeGreaterThan(0);
  });

  it("slugs have no .mdx extension", () => {
    for (const slug of getEngineeringSlugs()) {
      expect(slug).not.toMatch(/\.mdx$/);
    }
  });

  it("includes hivemq-edge", () => {
    expect(getEngineeringSlugs()).toContain("hivemq-edge");
  });

  it("excludes redacted projects", () => {
    expect(getEngineeringSlugs()).not.toContain("intrica");
  });

  it("slug count is less than total project count (redacted excluded)", () => {
    expect(getEngineeringSlugs().length).toBeLessThan(
      getAllEngineeringProjects().length,
    );
  });
});
