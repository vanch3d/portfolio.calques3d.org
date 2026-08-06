/**
 * Copies the pdf.js worker bundle to public/ so it can be served as a
 * static asset. Must stay in sync with the installed pdfjs-dist version.
 *
 * Run automatically via postinstall. Also safe to run manually.
 * Usage: node scripts/copy-pdf-worker.mjs
 */
import { copyFileSync } from "fs";
import { resolve } from "path";
import { fileURLToPath } from "url";

const root = resolve(fileURLToPath(import.meta.url), "../..");

// Resolve the worker file directly via ESM resolution — works correctly with
// pnpm's strict package isolation on all supported Node.js versions.
const src = fileURLToPath(
  import.meta.resolve("pdfjs-dist/build/pdf.worker.min.mjs"),
);
const dest = resolve(root, "public", "pdf.worker.min.mjs");

copyFileSync(src, dest);
console.log(`pdf.js worker copied → public/pdf.worker.min.mjs`);
