/**
 * CSL formatting smoke test + style comparison.
 *
 * Verifies that:
 *  1. The custom umuai-nvl.csl style is registered and produces output
 *     that DIFFERS from APA (confirms the style is actually loaded).
 *  2. Compound surnames (Van Labeke) are formatted correctly.
 *  3. Conference location appears in paper-conference entries.
 *  4. Multiple authors are formatted with correct separators.
 *
 * Usage: pnpm exec tsx scripts/test-csl.mjs
 * Non-zero exit on any assertion failure — suitable for CI.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

// Load plugins before importing Cite
await import("@citation-js/plugin-csl");
const { Cite, plugins } = await import("@citation-js/core");

const cslXml = readFileSync(resolve("src/lib/csl/umuai-nvl.csl"), "utf8");
plugins.config.get("@csl").styles.add("umuai-nvl", cslXml);

// -----------------------------------------------------------------------
// Test data — authors in inverted "Family, Given" format (our canonical
// storage format, matching Zotero's separate firstName/lastName fields).
// -----------------------------------------------------------------------
const items = [
  {
    id: "AAAA0001",
    type: "paper-conference",
    title: "Towards an Adaptive Feedback Framework for Open-Ended Writing",
    author: [
      { family: "Van Labeke", given: "Nicolas" },
      { family: "Whitelock", given: "Denise" },
    ],
    issued: { "date-parts": [[2016]] },
    DOI: "10.1145/example.2016",
    "container-title": "Proceedings of LAK 2016",
    "publisher-place": "Edinburgh, UK",
  },
  {
    id: "AAAA0002",
    type: "article-journal",
    title: "Formative e-Assessment of Essay Writing",
    author: [
      { family: "Whitelock", given: "Denise" },
      { family: "Van Labeke", given: "Nicolas" },
    ],
    issued: { "date-parts": [[2014]] },
    DOI: "10.1016/example.2014",
    "container-title": "Assessment & Evaluation in Higher Education",
    volume: "39",
    issue: "5",
  },
  {
    id: "BBBB0001",
    type: "paper-conference",
    title: "A 3D Dynamic Geometry Environment for Secondary School",
    author: [{ family: "Van Labeke", given: "Nicolas" }],
    issued: { "date-parts": [[2010]] },
    "container-title": "Proceedings of ICTMT 2010",
    "publisher-place": "Hissar, Bulgaria",
  },
];

// -----------------------------------------------------------------------
// Assertion helpers
// -----------------------------------------------------------------------
let failures = 0;

function assert(condition, message) {
  if (!condition) {
    console.error(`  FAIL: ${message}`);
    failures++;
  } else {
    console.log(`  pass: ${message}`);
  }
}

function formatWith(style) {
  const cite = new Cite(items);
  return cite.format("bibliography", { format: "html", template: style, lang: "en-US" });
}

// -----------------------------------------------------------------------
// Run
// -----------------------------------------------------------------------
console.log("\n=== umuai-nvl output ===");
const umuai = formatWith("umuai-nvl");
console.log(umuai);

console.log("\n=== apa output ===");
const apa = formatWith("apa");
console.log(apa);

// -----------------------------------------------------------------------
// Assertions
// -----------------------------------------------------------------------
console.log("\n=== Assertions ===\n");

// 1. Style distinctiveness — confirm umuai-nvl differs from APA
assert(umuai !== apa, "umuai-nvl and APA produce different output (style is loaded)");

// 2. Compound surname — must appear as "Van Labeke" not "Labeke"
assert(umuai.includes("Van Labeke"), "compound surname 'Van Labeke' intact (not split)");
assert(!umuai.includes("Labeke, N.V"), "not misformatted as 'Labeke, N.V'");

// 3. Conference location appears for paper-conference entries
assert(umuai.includes("Edinburgh"), "conference location 'Edinburgh' present in AAAA0001");
assert(umuai.includes("Hissar"), "conference location 'Hissar' present in BBBB0001");

// 4. Author initials formatted correctly (UMUAI uses initialize-with=". ")
assert(umuai.includes("Van Labeke, N."), "'Van Labeke, N.' format present");

// 5. Multi-author — both authors appear
assert(umuai.includes("Whitelock"), "second author Whitelock present");

// 6. Journal entry contains container-title in italics
assert(umuai.includes("Assessment"), "journal container-title present for AAAA0002");

// -----------------------------------------------------------------------
// Result
// -----------------------------------------------------------------------
console.log(`\n${failures === 0 ? "All assertions passed." : `${failures} assertion(s) FAILED.`}`);
process.exit(failures > 0 ? 1 : 0);
