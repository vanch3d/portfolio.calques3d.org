/**
 * Copies the pdf.js worker bundle to public/ so it can be served as a
 * static asset. Must stay in sync with the installed pdfjs-dist version.
 *
 * Run automatically via postinstall. Also safe to run manually.
 * Usage: node scripts/copy-pdf-worker.mjs
 */
import { copyFileSync, existsSync } from "fs";
import { resolve, join } from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";

const root = resolve(fileURLToPath(import.meta.url), "../..");
const require = createRequire(import.meta.url);

const pdfjsDir = resolve(require.resolve("pdfjs-dist/package.json"), "..");
const src = join(pdfjsDir, "build", "pdf.worker.min.mjs");
const dest = join(root, "public", "pdf.worker.min.mjs");

if (!existsSync(src)) {
  console.error(`pdf.js worker not found at: ${src}`);
  process.exit(1);
}

copyFileSync(src, dest);
console.log(`pdf.js worker copied → public/pdf.worker.min.mjs`);
