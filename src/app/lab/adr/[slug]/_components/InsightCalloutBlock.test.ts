import { describe, it, expect } from "vitest";
import { extractBodyExcerpt } from "./InsightCalloutBlock";

describe("extractBodyExcerpt", () => {
  it("returns the first two sentences of a plain text body", () => {
    const body =
      "First sentence here. Second sentence here. Third sentence here.";
    expect(extractBodyExcerpt(body)).toBe(
      "First sentence here. Second sentence here."
    );
  });

  it("strips markdown heading lines before extracting", () => {
    const body =
      "## Discovery\n\nFirst sentence here. Second sentence here.";
    expect(extractBodyExcerpt(body)).toBe(
      "First sentence here. Second sentence here."
    );
  });

  it("strips bold markdown before extracting", () => {
    const body = "**Bold text** appears here. Second sentence.";
    expect(extractBodyExcerpt(body)).toBe(
      "Bold text appears here. Second sentence."
    );
  });

  it("strips inline code before extracting", () => {
    const body = "The `pr-flow` skill was running. Second sentence.";
    expect(extractBodyExcerpt(body)).toBe(
      "The pr-flow skill was running. Second sentence."
    );
  });

  it("strips markdown links and keeps the link text", () => {
    const body =
      "[ADR 016](/lab/adr/016) documents the workflow. Second sentence.";
    expect(extractBodyExcerpt(body)).toBe(
      "ADR 016 documents the workflow. Second sentence."
    );
  });

  it("truncates the excerpt at maxLength characters and appends ellipsis", () => {
    const long = "A".repeat(150) + ". Short sentence.";
    const result = extractBodyExcerpt(long, 50);
    expect(result.length).toBeLessThanOrEqual(51);
    expect(result.endsWith("…")).toBe(true);
  });

  it("returns a truncated plain-text fallback when no sentence boundaries exist", () => {
    const body = "No sentence terminator in this string at all";
    const result = extractBodyExcerpt(body, 200);
    expect(result).toBe("No sentence terminator in this string at all");
  });

  it("handles an empty body string gracefully", () => {
    expect(extractBodyExcerpt("")).toBe("");
  });

  it("handles a body with only heading lines", () => {
    const body = "## Context\n\n## Decision";
    const result = extractBodyExcerpt(body);
    expect(typeof result).toBe("string");
  });
});
