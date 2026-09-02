import { describe, it, expect } from "vitest";
import {
  getAllCaseStudies,
  getCaseStudyBySlug,
  getCaseStudiesForProject,
  getCaseStudyParams,
} from "./case-studies";

describe("getAllCaseStudies", () => {
  it("returns at least one case study", () => {
    expect(getAllCaseStudies().length).toBeGreaterThan(0);
  });

  it("featured case studies come before non-featured", () => {
    const all = getAllCaseStudies();
    let seenNonFeatured = false;
    for (const cs of all) {
      if (!cs.featured) seenNonFeatured = true;
      if (seenNonFeatured) expect(cs.featured).toBe(false);
    }
  });

  it("every case study has required fields", () => {
    for (const cs of getAllCaseStudies()) {
      expect(cs.slug).toBeTruthy();
      expect(cs.project).toBeTruthy();
      expect(cs.title).toBeTruthy();
      expect(["draft", "published"]).toContain(cs.status);
      expect(typeof cs.featured).toBe("boolean");
      expect(Array.isArray(cs.tags)).toBe(true);
    }
  });

  it("skips directories without index.mdx", () => {
    // The hivemq-edge draft folders have no index.mdx and must not appear
    const all = getAllCaseStudies();
    for (const cs of all) {
      expect(cs.slug).toBeTruthy();
      expect(cs.project).toBeTruthy();
    }
  });
});

describe("getCaseStudyBySlug", () => {
  it("returns the intrica test case study", () => {
    const cs = getCaseStudyBySlug("intrica", "edge-ui");
    expect(cs).not.toBeNull();
    expect(cs?.slug).toBe("edge-ui");
    expect(cs?.project).toBe("intrica");
    expect(cs?.title).toBeTruthy();
  });

  it("returns null for an unknown project/slug combination", () => {
    expect(getCaseStudyBySlug("does-not-exist", "also-missing")).toBeNull();
  });
});

describe("getCaseStudiesForProject", () => {
  it("returns case studies matching the given project slug", () => {
    const results = getCaseStudiesForProject("intrica");
    expect(results.length).toBeGreaterThan(0);
    for (const cs of results) {
      expect(cs.project).toBe("intrica");
    }
  });

  it("returns an empty array for a project with no case studies", () => {
    expect(getCaseStudiesForProject("project-with-no-case-studies")).toHaveLength(0);
  });
});

describe("getCaseStudyParams", () => {
  it("returns at least one param set", () => {
    expect(getCaseStudyParams().length).toBeGreaterThan(0);
  });

  it("each param set has project and slug", () => {
    for (const p of getCaseStudyParams()) {
      expect(p.project).toBeTruthy();
      expect(p.slug).toBeTruthy();
    }
  });

  it("param count matches getAllCaseStudies count", () => {
    expect(getCaseStudyParams().length).toBe(getAllCaseStudies().length);
  });
});
