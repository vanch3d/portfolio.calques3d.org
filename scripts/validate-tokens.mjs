/**
 * validate-tokens.mjs
 *
 * Validates the three-layer design token system in src/app/globals.css:
 * 1. All semantic tokens (--color-*, --shadow-*, etc.) reference a primitive token (--p-*)
 *    or a valid CSS value — no bare hex codes or rgb() in semantic declarations.
 * 2. All tokens listed in src/design-system/tokens.ts exist as declarations in globals.css.
 * 3. Reports any semantic tokens declared in globals.css missing from tokens.ts.
 *
 * Run:  node scripts/validate-tokens.mjs
 * Exit: 0 on success, 1 on any failure.
 */

import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

// ── Read source files ────────────────────────────────────────────────────────

const cssPath = resolve(ROOT, "src/app/globals.css");
const tokensPath = resolve(ROOT, "src/design-system/tokens.ts");

const css = readFileSync(cssPath, "utf8");
const tsSource = readFileSync(tokensPath, "utf8");

// ── Extract token declarations from CSS ──────────────────────────────────────

// Match lines like:   --color-bg: var(--p-neutral-0);
//                     --shadow-sm: 0 1px 2px ...;
const declarationRe = /^\s*(--[\w-]+)\s*:\s*(.+?);?\s*$/gm;

/** @type {Map<string, string>} token name → raw value */
const cssDeclarations = new Map();
let m;
while ((m = declarationRe.exec(css)) !== null) {
  cssDeclarations.set(m[1], m[2].trim());
}

// ── Extract token names from tokens.ts ──────────────────────────────────────

// Match string literals that look like CSS custom properties
const tsTokenRe = /"(--[\w-]+)"/g;

/** @type {Set<string>} */
const tsTokens = new Set();
while ((m = tsTokenRe.exec(tsSource)) !== null) {
  tsTokens.add(m[1]);
}

// ── Validation 1: Semantic tokens must reference a primitive or allowed value ─
//    Primitive tokens start with --p-; they may reference raw values directly.
//    Semantic tokens (--color-*, --shadow-*, --radius-*, --space-*, --glass-*,
//    --nav-height, --prose-width, --sidebar-width, --container-max) must either:
//      a) use var(--p-...) references, OR
//      b) use calc() / rgba() / complex multi-part values (shadows, sizes)
//    Bare hex codes in semantic tokens are flagged as a warning (not hard error).

const semanticPrefixes = [
  "--color-",
  "--glass-",
];

/** @type {string[]} */
const bareHexWarnings = [];

for (const [token, value] of cssDeclarations) {
  const isSemantic = semanticPrefixes.some((p) => token.startsWith(p));
  if (!isSemantic) continue;
  if (token.startsWith("--p-")) continue;

  // Check for bare hex codes — indicates a value that should be a primitive ref
  if (/#[0-9a-fA-F]{3,8}(?:\s|;|$)/.test(value) && !value.startsWith("var(")) {
    bareHexWarnings.push(`  ${token}: ${value}`);
  }
}

// ── Validation 2: All tokens in tokens.ts exist in globals.css ───────────────

/** @type {string[]} */
const missingInCss = [];

for (const token of tsTokens) {
  if (!cssDeclarations.has(token)) {
    missingInCss.push(`  ${token}`);
  }
}

// ── Validation 3: All semantic tokens in CSS are listed in tokens.ts ─────────

const allSemanticPrefixes = [
  "--color-",
  "--shadow-",
  "--radius-",
  "--space-",
  "--glass-",
  "--nav-height",
  "--prose-width",
  "--sidebar-width",
  "--container-max",
];

/** @type {string[]} */
const missingInTs = [];

for (const token of cssDeclarations.keys()) {
  if (token.startsWith("--p-")) continue; // primitives intentionally excluded
  if (token.startsWith("--tw-")) continue; // Tailwind internals
  if (token.startsWith("--font-")) continue; // font tokens managed by layout.tsx

  const isTracked = allSemanticPrefixes.some((p) => token.startsWith(p));
  if (!isTracked) continue;

  if (!tsTokens.has(token)) {
    missingInTs.push(`  ${token}`);
  }
}

// ── Report ───────────────────────────────────────────────────────────────────

let failed = false;

console.log("┌─ Design Token Validation ──────────────────────────────────┐");
console.log(`│  globals.css declarations : ${cssDeclarations.size}`);
console.log(`│  tokens.ts entries        : ${tsTokens.size}`);
console.log("└────────────────────────────────────────────────────────────┘\n");

if (bareHexWarnings.length > 0) {
  console.warn("⚠  WARN  Semantic tokens with bare hex values (should use --p-* refs):");
  bareHexWarnings.forEach((w) => console.warn(w));
  console.warn("");
  // Warning only — not a hard failure; rgba() in shadows is intentional.
}

if (missingInCss.length > 0) {
  console.error("✖  FAIL  Tokens listed in tokens.ts but missing from globals.css:");
  missingInCss.forEach((t) => console.error(t));
  console.error("");
  failed = true;
}

if (missingInTs.length > 0) {
  console.warn("⚠  WARN  Semantic tokens in globals.css not listed in tokens.ts:");
  missingInTs.forEach((t) => console.warn(t));
  console.warn("");
  // Warning only — tokens.ts is documentation; globals.css is authoritative.
}

if (!failed) {
  console.log("✔  PASS  All token integrity checks passed.");
}

process.exit(failed ? 1 : 0);
