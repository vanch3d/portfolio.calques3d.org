import { describe, it, expect } from "vitest";
import { activeNavHref } from "./navigation";

const navLinks = [
  { href: "/" },
  { href: "/research" },
  { href: "/engineering" },
  { href: "/research/publications" },
  { href: "/cv" },
  { href: "/lab" },
];

describe("activeNavHref", () => {
  describe("exact route matches", () => {
    it("matches /research on /research", () => {
      expect(activeNavHref("/research", navLinks)).toBe("/research");
    });

    it("matches /research/publications on /research/publications", () => {
      expect(activeNavHref("/research/publications", navLinks)).toBe(
        "/research/publications",
      );
    });

    it("matches / on /", () => {
      expect(activeNavHref("/", navLinks)).toBe("/");
    });

    it("matches /cv on /cv", () => {
      expect(activeNavHref("/cv", navLinks)).toBe("/cv");
    });
  });

  describe("prefix matching", () => {
    it("matches /research on a project detail page", () => {
      expect(activeNavHref("/research/safesea", navLinks)).toBe("/research");
    });

    it("matches /lab on a lab sub-page", () => {
      expect(activeNavHref("/lab/tokens", navLinks)).toBe("/lab");
    });

    it("matches /engineering on an engineering detail page", () => {
      expect(activeNavHref("/engineering/hivemq", navLinks)).toBe(
        "/engineering",
      );
    });
  });

  describe("longest match wins (the core case)", () => {
    it("matches /research/publications not /research when on /research/publications", () => {
      const active = activeNavHref("/research/publications", navLinks);
      expect(active).toBe("/research/publications");
      expect(active).not.toBe("/research");
    });
  });

  describe("no false prefix matches", () => {
    it("does not match / on /research", () => {
      expect(activeNavHref("/research", navLinks)).not.toBe("/");
    });

    it("does not match /research on /research-extra (no slash boundary)", () => {
      const links = [{ href: "/research" }, { href: "/research-extra" }];
      expect(activeNavHref("/research-extra", links)).toBe("/research-extra");
      expect(activeNavHref("/research-extra", links)).not.toBe("/research");
    });
  });

  describe("no match", () => {
    it("returns undefined for an unknown pathname", () => {
      expect(activeNavHref("/unknown", navLinks)).toBeUndefined();
    });
  });
});
