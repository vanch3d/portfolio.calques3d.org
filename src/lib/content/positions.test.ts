import { describe, it, expect } from "vitest";
import {
  getAllPositions,
  getPositionBySlug,
  getPositionMap,
  getResearchPositions,
  getEngineeringPositions,
} from "./positions";

describe("getAllPositions", () => {
  it("returns at least one position", () => {
    expect(getAllPositions().length).toBeGreaterThan(0);
  });

  it("sorts most-recent-end first — null end (ongoing) sorts as latest", () => {
    const positions = getAllPositions();
    for (let i = 0; i < positions.length - 1; i++) {
      const aEnd = positions[i].period.end ?? "9999";
      const bEnd = positions[i + 1].period.end ?? "9999";
      expect(aEnd.localeCompare(bEnd)).toBeGreaterThanOrEqual(0);
    }
  });

  it("every position has required fields", () => {
    const validTypes = ["employment", "contract", "academic", "freelance", "phd", "voluntary"];
    for (const p of getAllPositions()) {
      expect(p.slug).toBeTruthy();
      expect(p.title).toBeTruthy();
      expect(p.organisation).toBeTruthy();
      expect(p.location).toBeTruthy();
      expect(p.period.start).toBeTruthy();
      expect(validTypes).toContain(p.type);
    }
  });
});

describe("getPositionBySlug", () => {
  it("returns the correct position for a known slug", () => {
    const pos = getPositionBySlug("hivemq");
    expect(pos).not.toBeNull();
    expect(pos?.slug).toBe("hivemq");
  });

  it("returns null for an unknown slug", () => {
    expect(getPositionBySlug("does-not-exist-xyz")).toBeNull();
  });
});

describe("getPositionMap", () => {
  it("has the same count as getAllPositions", () => {
    expect(getPositionMap().size).toBe(getAllPositions().length);
  });

  it("keys match each position's slug", () => {
    for (const [key, pos] of getPositionMap()) {
      expect(key).toBe(pos.slug);
    }
  });

  it("includes hivemq", () => {
    expect(getPositionMap().has("hivemq")).toBe(true);
  });
});

describe("getResearchPositions", () => {
  it("returns at least one position", () => {
    expect(getResearchPositions().length).toBeGreaterThan(0);
  });

  it("every returned position has a research type (academic | phd)", () => {
    for (const p of getResearchPositions()) {
      expect(["academic", "phd"]).toContain(p.type);
    }
  });

  it("contains no engineering-era types", () => {
    const engineeringTypes = ["employment", "contract", "freelance", "voluntary"];
    for (const p of getResearchPositions()) {
      expect(engineeringTypes).not.toContain(p.type);
    }
  });

  it("includes the nancy PhD position", () => {
    const slugs = getResearchPositions().map((p) => p.slug);
    expect(slugs).toContain("nancy");
  });

  it("is sorted most-recent-end first", () => {
    const positions = getResearchPositions();
    for (let i = 0; i < positions.length - 1; i++) {
      const aEnd = positions[i].period.end ?? "9999";
      const bEnd = positions[i + 1].period.end ?? "9999";
      expect(aEnd.localeCompare(bEnd)).toBeGreaterThanOrEqual(0);
    }
  });

  it("research + engineering positions together equal all positions", () => {
    const all = getAllPositions().length;
    const research = getResearchPositions().length;
    const engineering = getEngineeringPositions().length;
    expect(research + engineering).toBe(all);
  });
});

describe("getEngineeringPositions", () => {
  it("returns at least one position", () => {
    expect(getEngineeringPositions().length).toBeGreaterThan(0);
  });

  it("every returned position has an engineering type (employment | contract | freelance | voluntary)", () => {
    const engineeringTypes = ["employment", "contract", "freelance", "voluntary"];
    for (const p of getEngineeringPositions()) {
      expect(engineeringTypes).toContain(p.type);
    }
  });

  it("contains no research-era types", () => {
    const researchTypes = ["academic", "phd"];
    for (const p of getEngineeringPositions()) {
      expect(researchTypes).not.toContain(p.type);
    }
  });

  it("includes the hivemq position", () => {
    const slugs = getEngineeringPositions().map((p) => p.slug);
    expect(slugs).toContain("hivemq");
  });

  it("is sorted most-recent-end first", () => {
    const positions = getEngineeringPositions();
    for (let i = 0; i < positions.length - 1; i++) {
      const aEnd = positions[i].period.end ?? "9999";
      const bEnd = positions[i + 1].period.end ?? "9999";
      expect(aEnd.localeCompare(bEnd)).toBeGreaterThanOrEqual(0);
    }
  });
});
