import { describe, it, expect } from "vitest";
import {
  getAllPositions,
  getPositionBySlug,
  getPositionMap,
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
    for (const p of getAllPositions()) {
      expect(p.slug).toBeTruthy();
      expect(p.title).toBeTruthy();
      expect(p.organisation).toBeTruthy();
      expect(p.location).toBeTruthy();
      expect(p.period.start).toBeTruthy();
      expect(["employment", "contract", "academic", "freelance", "phd", "voluntary"]).toContain(p.type);
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
