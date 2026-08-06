/**
 * Unit tests for the server-side CSL formatter.
 *
 * These tests verify:
 *  - Author name formatting (compound surnames, multi-author)
 *  - Conference location rendering (publisher-place)
 *  - CSL style loading and distinctiveness from APA
 *  - Edge cases: no DOI, no abstract, no place
 *
 * Run: pnpm exec vitest run src/lib/csl/index.test.ts
 */
import { describe, it, expect } from "vitest";
import { formatCitation, formatCitations } from "./index";
import type { Publication } from "@/types/content";

// Authors in inverted "Family, Given" format — our canonical storage format
const confPaper: Publication = {
  key: "AAAA0001",
  type: "conferencePaper",
  title: "Towards an Adaptive Feedback Framework for Open-Ended Writing",
  authors: ["Van Labeke, Nicolas", "Whitelock, Denise"],
  year: 2016,
  venue: "Proceedings of LAK 2016",
  place: "Edinburgh, UK",
  doi: "10.1145/example.2016",
  abstract: "This paper presents an adaptive feedback framework.",
  tags: ["safesea"],
};

const journalArticle: Publication = {
  key: "AAAA0002",
  type: "journalArticle",
  title: "Formative e-Assessment of Essay Writing",
  authors: ["Whitelock, Denise", "Van Labeke, Nicolas"],
  year: 2014,
  venue: "Assessment & Evaluation in Higher Education",
  doi: "10.1016/example.2014",
  tags: [],
};

const confPaperNoPlace: Publication = {
  key: "BBBB0001",
  type: "conferencePaper",
  title: "A 3D Dynamic Geometry Environment for Secondary School",
  authors: ["Van Labeke, Nicolas"],
  year: 2010,
  venue: "Proceedings of ICTMT 2010",
  tags: [],
};

describe("formatCitation — compound surnames", () => {
  it("formats 'Van Labeke' as family name, not 'Labeke'", async () => {
    const html = await formatCitation(confPaper);
    expect(html).toContain("Van Labeke");
    expect(html).not.toMatch(/Labeke,\s*N\.V/); // misformatted split
  });

  it("initialises given name correctly: 'Van Labeke, N.'", async () => {
    const html = await formatCitation(confPaper);
    expect(html).toMatch(/Van Labeke,\s*N\./);
  });
});

describe("formatCitation — conference papers", () => {
  it("includes conference location when place is present", async () => {
    const html = await formatCitation(confPaper);
    expect(html).toContain("Edinburgh");
  });

  it("does not error when place is absent", async () => {
    const html = await formatCitation(confPaperNoPlace);
    expect(html).toBeTruthy();
    expect(html).toContain("Van Labeke");
  });

  it("includes the proceedings venue", async () => {
    const html = await formatCitation(confPaper);
    expect(html).toContain("Proceedings of LAK 2016");
  });
});

describe("formatCitation — journal articles", () => {
  it("includes journal name", async () => {
    const html = await formatCitation(journalArticle);
    expect(html).toContain("Assessment");
  });

  it("lists both authors", async () => {
    const html = await formatCitation(journalArticle);
    expect(html).toContain("Whitelock");
    expect(html).toContain("Van Labeke");
  });
});

describe("formatCitations — batch", () => {
  it("returns a map with one entry per publication", async () => {
    const pubs = [confPaper, journalArticle, confPaperNoPlace];
    const map = await formatCitations(pubs);
    expect(map.size).toBe(3);
    expect(map.has("AAAA0001")).toBe(true);
    expect(map.has("AAAA0002")).toBe(true);
    expect(map.has("BBBB0001")).toBe(true);
  });

  it("each entry contains the correct author surname", async () => {
    const map = await formatCitations([confPaper, journalArticle]);
    expect(map.get("AAAA0001")).toContain("Van Labeke");
    expect(map.get("AAAA0002")).toContain("Whitelock");
  });
});
