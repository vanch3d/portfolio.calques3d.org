import { describe, it, expect } from "vitest";
import { DOT, DASH, joinParts, formatPeriod } from "./format";

describe("joinParts", () => {
  it("joins non-empty parts with the default DOT separator", () => {
    expect(joinParts(["Acme Corp", "Platform", "London"])).toBe(
      `Acme Corp${DOT}Platform${DOT}London`
    );
  });

  it("skips null values", () => {
    expect(joinParts(["Acme Corp", null, "London"])).toBe(`Acme Corp${DOT}London`);
  });

  it("skips undefined values", () => {
    expect(joinParts(["Acme Corp", undefined, "London"])).toBe(`Acme Corp${DOT}London`);
  });

  it("skips empty strings", () => {
    expect(joinParts(["Acme Corp", "", "London"])).toBe(`Acme Corp${DOT}London`);
  });

  it("returns an empty string when all parts are falsy", () => {
    expect(joinParts([null, undefined, ""])).toBe("");
  });

  it("returns the single part unchanged when only one part is non-empty", () => {
    expect(joinParts([null, "Only"])).toBe("Only");
  });

  it("accepts a custom separator", () => {
    expect(joinParts(["a", "b", "c"], " | ")).toBe("a | b | c");
  });
});

describe("formatPeriod", () => {
  it("formats a closed range with DASH separator", () => {
    expect(formatPeriod("2020-01", "2022-06", "present")).toBe(
      `2020-01${DASH}2022-06`
    );
  });

  it("uses the ongoing label when end is null", () => {
    expect(formatPeriod("2022-01", null, "present")).toBe(`2022-01${DASH}present`);
  });

  it("uses the ongoing label when end is undefined", () => {
    expect(formatPeriod("2022-01", undefined, "present")).toBe(`2022-01${DASH}present`);
  });

  it("works with year-only precision strings", () => {
    expect(formatPeriod("1996", "1999", "present")).toBe(`1996${DASH}1999`);
  });
});
