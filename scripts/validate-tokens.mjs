/**
 * validate-tokens.mjs
 *
 * Validates src/design-system/tokens.css:
 *   1. All semantic tokens reference declared primitives (--p-*) via var()
 *   2. Key color pairs meet WCAG AA contrast ratios
 *   3. No semantic token is set to a raw hex value (primitives only)
 *
 * Run: node scripts/validate-tokens.mjs
 * Also called by: npm run validate
 */

import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const tokenFile = resolve(__dirname, "../src/design-system/tokens.css");
const css = readFileSync(tokenFile, "utf8");

let errors = 0;
let warnings = 0;

function fail(msg) {
  console.error(`  ✗ ${msg}`);
  errors++;
}

function warn(msg) {
  console.warn(`  ⚠ ${msg}`);
  warnings++;
}

function pass(msg) {
  console.log(`  ✓ ${msg}`);
}

// ─── Parse all CSS custom property declarations ───────────────────────────

/**
 * Returns a flat map of { name → rawValue } for all --* declarations in the CSS.
 * Strips comments before parsing.
 */
function parseTokens(css) {
  const stripped = css.replace(/\/\*[\s\S]*?\*\//g, "");
  const map = new Map();
  const re = /--([\w-]+)\s*:\s*([^;]+);/g;
  let m;
  while ((m = re.exec(stripped)) !== null) {
    const name = `--${m[1]}`;
    const value = m[2].trim();
    // Keep the last declaration (overrides like dark mode are in separate blocks)
    // We only use the :root defaults for validation
    if (!map.has(name)) {
      map.set(name, value);
    }
  }
  return map;
}

const tokens = parseTokens(css);

const primitives = new Map(
  [...tokens].filter(([k]) => k.startsWith("--p-"))
);
const semantic = new Map(
  [...tokens].filter(([k]) => !k.startsWith("--p-") && !k.startsWith("--color-") && !k.startsWith("--font-"))
);

// ─── Check 1: Semantic tokens must reference primitives via var() ─────────

console.log("\nCheck 1: Semantic tokens reference declared primitives");

const hexPattern = /^#[0-9a-fA-F]{3,8}$/;
const varPattern = /^var\(--([\w-]+)\)/;

for (const [name, value] of semantic) {
  if (hexPattern.test(value)) {
    // Exception: --accent-foreground is intentionally hardcoded white
    // (white cannot be expressed as a warm-neutral primitive)
    if (name === "--accent-foreground" && value.toLowerCase() === "#ffffff") {
      pass(`${name}: ${value} (documented exception — pure white)`);
      continue;
    }
    fail(`${name}: raw hex "${value}" — move this to a --p-* primitive`);
    continue;
  }

  const varMatch = value.match(varPattern);
  if (varMatch) {
    const ref = `--${varMatch[1]}`;
    if (ref.startsWith("--p-") && primitives.has(ref)) {
      pass(`${name} → ${ref}`);
    } else if (!ref.startsWith("--p-")) {
      warn(`${name} → ${ref} (references another semantic token, not a primitive)`);
    } else {
      fail(`${name} → ${ref} (primitive not declared)`);
    }
    continue;
  }

  // color-mix and other CSS functions are acceptable
  if (value.startsWith("color-mix(") || value.startsWith("rgb(") || value.startsWith("hsl(")) {
    pass(`${name}: ${value.substring(0, 40)}… (CSS function — manual review)`);
    continue;
  }

  warn(`${name}: "${value}" — unexpected value format`);
}

// ─── Check 2: WCAG contrast for key pairs ────────────────────────────────

console.log("\nCheck 2: WCAG AA contrast ratios (light mode defaults)");

/**
 * Resolve a token value to a hex string by following var() references.
 * Only works for simple single-level var() chains in this implementation.
 */
function resolveToHex(tokenName) {
  const value = tokens.get(tokenName);
  if (!value) return null;
  if (hexPattern.test(value)) return value;
  const varMatch = value.match(varPattern);
  if (varMatch) return resolveToHex(`--${varMatch[1]}`);
  return null; // CSS functions can't be resolved statically
}

function relativeLuminance(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const linear = (c) =>
    c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  return 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);
}

function contrastRatio(hex1, hex2) {
  const l1 = relativeLuminance(hex1);
  const l2 = relativeLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Pairs to check: [foreground-token, background-token, min-ratio, description]
 *
 * Ratios:
 *   4.5:1 — WCAG AA for normal text
 *   3.0:1 — WCAG AA for large text (18pt+ or 14pt+ bold) and UI components
 *
 * Accent is intentionally 3.0:1 — used for UI/decorative, not normal text.
 * See tokens.css comments for full rationale.
 */
const pairs = [
  ["--foreground",           "--background",  4.5, "body text (foreground on background)"],
  ["--foreground-secondary", "--background",  4.5, "secondary text on background"],
  ["--foreground",           "--surface",     4.5, "body text on surface (cards)"],
  // --accent (teal-600) is for decorative/UI use only (borders, icons, indicators).
  // Filled backgrounds with white text MUST use --accent-hover (teal-700, ≥4.5:1).
  ["--accent-foreground",    "--accent-hover", 4.5, "white text on filled accent bg (--accent-hover)"],
  ["--accent",               "--background",   3.0, "accent UI element on background (decorative, 3:1 UI rule)"],
  ["--accent-hover",         "--background",   4.5, "accent-hover as link/interactive text"],
];

for (const [fgToken, bgToken, minRatio, label] of pairs) {
  const fg = resolveToHex(fgToken);
  const bg = resolveToHex(bgToken);

  if (!fg || !bg) {
    warn(`${label}: cannot resolve ${!fg ? fgToken : bgToken} to hex — skipping`);
    continue;
  }

  const ratio = contrastRatio(fg, bg);
  const ratioStr = ratio.toFixed(2);

  if (ratio >= minRatio) {
    pass(`${label}: ${ratioStr}:1 (≥ ${minRatio}:1 required)`);
  } else {
    fail(`${label}: ${ratioStr}:1 (< ${minRatio}:1 required) — ${fgToken}:${fg} on ${bgToken}:${bg}`);
  }
}

// ─── Summary ─────────────────────────────────────────────────────────────

console.log("");
if (errors > 0) {
  console.error(`Token validation FAILED: ${errors} error(s), ${warnings} warning(s)`);
  process.exit(1);
} else if (warnings > 0) {
  console.warn(`Token validation passed with ${warnings} warning(s)`);
} else {
  console.log(`Token validation passed.`);
}
