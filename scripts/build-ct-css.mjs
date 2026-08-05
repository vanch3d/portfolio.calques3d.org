/**
 * Compiles globals.css (Tailwind v4 + tokens) and inlines the result into
 * cypress/support/component-index.html as a <style> block.
 *
 * Why inline rather than a <link>: the Cypress CT webpack dev server only
 * serves files in its module graph — a <link> to a static file returns a
 * 404 HTML page, causing a MIME type mismatch and the stylesheet is silently
 * ignored. Inlining avoids any network request.
 *
 * Usage:  pnpm exec tsx scripts/build-ct-css.mjs
 * Runs automatically via pretest:ct / pretest:ct:open scripts.
 */

import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const postcss = require("postcss");
const tailwind = require("@tailwindcss/postcss");

import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const from = resolve("src/app/globals.css");
const htmlPath = resolve("cypress/support/component-index.html");

const input = readFileSync(from, "utf8");
const result = await postcss([tailwind]).process(input, { from });

// Replace the contents of the <!-- CT_CSS_START --> / <!-- CT_CSS_END --> block
// in component-index.html with the freshly compiled CSS.
const html = readFileSync(htmlPath, "utf8");
const updated = html.replace(
  /<!-- CT_CSS_START -->[\s\S]*?<!-- CT_CSS_END -->/,
  `<!-- CT_CSS_START -->\n    <style>\n${result.css}\n    </style>\n    <!-- CT_CSS_END -->`
);

if (updated === html) {
  console.error("✗ CT_CSS_START / CT_CSS_END markers not found in component-index.html");
  process.exit(1);
}

writeFileSync(htmlPath, updated);
console.log(`✓ CT CSS inlined → cypress/support/component-index.html (${result.css.length} bytes)`);
