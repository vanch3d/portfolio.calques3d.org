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

const root = resolve(fileURLToPath(import.meta.url), "../..");

// import.meta.resolve() is native ESM — works correctly with pnpm's package
// isolation. createRequire().resolve() does not reliably find packages that
// are direct dependencies in pnpm's strict node_modules layout.
const pdfjsPackageUrl = import.meta.resolve("pdfjs-dist/package.json");
const pdfjsDir = resolve(fileURLToPath(pdfjsPackageUrl), "..");

const src = join(pdfjsDir, "build", "pdf.worker.min.mjs");
const dest = join(root, "public", "pdf.worker.min.mjs");

if (!existsSync(src)) {
  console.error(`pdf.js worker not found at: ${src}`);
  process.exit(1);
}

copyFileSync(src, dest);
console.log(`pdf.js worker copied → public/pdf.worker.min.mjs`);
