/**
 * CSL output inspector — human-readable debug tool.
 *
 * Prints formatted citations side-by-side for umuai-nvl and APA styles so
 * you can visually inspect the output. Not a test — assertions live in
 * src/lib/csl/index.test.ts (Vitest).
 *
 * Usage: pnpm run inspect:csl
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

await import("@citation-js/plugin-csl");
const { Cite, plugins } = await import("@citation-js/core");

const cslXml = readFileSync(resolve("src/lib/csl/umuai-nvl.csl"), "utf8");
plugins.config.get("@csl").styles.add("umuai-nvl", cslXml);

// Authors in inverted "Family, Given" format — our canonical storage format
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

function formatWith(style) {
  return new Cite(items).format("bibliography", {
    format: "html",
    template: style,
    lang: "en-US",
  });
}

console.log("=== umuai-nvl ===\n");
console.log(formatWith("umuai-nvl"));

console.log("\n=== apa ===\n");
console.log(formatWith("apa"));
