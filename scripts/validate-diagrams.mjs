/**
 * Validates all Mermaid diagrams in .md and .mdx files across the project.
 *
 * Strategy:
 * - Diagrams whose type is supported by @mermaid-js/parser (gitGraph, pie, packet,
 *   info, architecture, etc.) are fully parsed and validated.
 * - flowchart / sequenceDiagram / classDiagram / stateDiagram / erDiagram use a
 *   structural check (balanced brackets, quoted special chars) until Playwright is
 *   installed and rehype-mermaid can be used for build-time SVG validation.
 *   See ADR 002, ADR 003.
 *
 * Run with: node scripts/validate-diagrams.mjs
 */

import { parse, MermaidParseError } from "@mermaid-js/parser";
import { readFileSync, readdirSync, statSync } from "fs";
import { join, resolve, extname } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const root = resolve(__dirname, "..");

const SEARCH_DIRS = ["src/content", ".docs"];
const EXTENSIONS = new Set([".md", ".mdx"]);

// Diagram types supported by @mermaid-js/parser
const PARSER_SUPPORTED = new Set([
  "gitgraph", "info", "pie", "packet", "architecture",
  "radar", "treemap", "wardley", "cynefin",
  "railroad", "railroadebnf", "railroadabnf", "railroadpeg",
  "eventmodeling",
]);

// Characters that cause Mermaid parse errors when unquoted in node labels.
// Matches an unquoted label [...] containing / * or @.
// Note: . and () are safe in practice; \n in source is a literal two chars, not a newline.
const UNQUOTED_SPECIAL_CHARS = /(?<!")\[([^\]"]*[/*@][^\]"]*)\](?!")/g;

function* walkFiles(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      yield* walkFiles(full);
    } else if (EXTENSIONS.has(extname(full))) {
      yield full;
    }
  }
}

function extractMermaidBlocks(content) {
  const blocks = [];
  const regex = /```mermaid\r?\n([\s\S]*?)```/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const lineNumber = content.slice(0, match.index).split("\n").length;
    blocks.push({ chart: match[1].trim(), line: lineNumber });
  }
  return blocks;
}

function getDiagramType(chart) {
  return chart.split("\n")[0].trim().toLowerCase().split(/\s+/)[0];
}

async function validateChart(chart) {
  const errors = [];
  const diagramType = getDiagramType(chart);

  if (PARSER_SUPPORTED.has(diagramType)) {
    // Full parse validation
    try {
      await parse(diagramType, chart);
    } catch (err) {
      errors.push(
        err instanceof MermaidParseError
          ? err.message
          : String(err)
      );
    }
  } else {
    // Structural checks for DOM-dependent diagram types
    // Check for unquoted special characters in node labels
    const lines = chart.split("\n");
    lines.forEach((lineContent, i) => {
      UNQUOTED_SPECIAL_CHARS.lastIndex = 0;
      const match = UNQUOTED_SPECIAL_CHARS.exec(lineContent);
      if (match) {
        errors.push(
          `Line ${i + 1}: unquoted special character in label: [${match[1]}] — wrap in double quotes`
        );
      }
    });

    // Check balanced brackets/parens
    const open = (chart.match(/\[/g) ?? []).length;
    const close = (chart.match(/\]/g) ?? []).length;
    if (open !== close) {
      errors.push(`Unbalanced square brackets: ${open} '[' vs ${close} ']'`);
    }
  }

  return errors;
}

let totalFiles = 0;
let totalDiagrams = 0;
let failures = 0;

for (const dir of SEARCH_DIRS) {
  const absDir = join(root, dir);
  for (const filePath of walkFiles(absDir)) {
    const content = readFileSync(filePath, "utf8");
    const blocks = extractMermaidBlocks(content);
    if (blocks.length === 0) continue;

    totalFiles++;
    const rel = filePath.replace(root + "\\", "").replace(root + "/", "");

    for (const { chart, line } of blocks) {
      totalDiagrams++;
      const errors = await validateChart(chart);
      if (errors.length > 0) {
        console.error(`\nFAIL: ${rel}:${line}`);
        errors.forEach((e) => console.error(`  ${e}`));
        failures++;
      } else {
        const type = getDiagramType(chart);
        const mode = PARSER_SUPPORTED.has(type) ? "full" : "structural";
        console.log(`  ok  ${rel}:${line}  [${type}, ${mode}]`);
      }
    }
  }
}

console.log(`\nChecked ${totalDiagrams} diagram(s) in ${totalFiles} file(s).`);

if (failures > 0) {
  console.error(`${failures} diagram(s) failed validation.`);
  process.exit(1);
} else {
  console.log("All diagrams valid.");
}
