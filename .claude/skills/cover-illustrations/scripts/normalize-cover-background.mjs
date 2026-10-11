#!/usr/bin/env node
// Remediation step 1 (ADR 027): normalize the near-cream background/ground tone
// across all 14 svgmaker story-driven cover SVGs to the exact DESIGN.md
// Draughting Paper token (#f8f4ed = rgb(248,244,237)). Each file currently
// carries its own slightly different near-cream shade (background colour
// drift noticed on review) — this locks every near-cream fill/stroke/
// stop-color value to the one canonical token, in place.
//
// Scope: only values within DIST_THRESHOLD of the cream target are touched.
// Mid-tone/graphite ink colours are far outside this threshold and are left
// untouched — this is a ground-tone normalization, not a full repaint.

import { readFileSync, writeFileSync, globSync } from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const COVERS_GLOB = '.docs/design/covers/*/svgmaker-poc-story-driven.svg'
const CREAM = [248, 244, 237] // #f8f4ed, DESIGN.md Draughting Paper
const CREAM_RGB = `rgb(${CREAM[0]},${CREAM[1]},${CREAM[2]})`
const DIST_THRESHOLD = 20 // Euclidean RGB distance

function dist(a, b) {
  return Math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2)
}

function findNearCreamValues(text) {
  const re = /rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/g
  const found = new Map() // raw string -> distance
  let m
  while ((m = re.exec(text))) {
    const raw = m[0]
    if (found.has(raw)) continue
    const rgb = [Number(m[1]), Number(m[2]), Number(m[3])]
    const d = dist(rgb, CREAM)
    if (d > 0 && d <= DIST_THRESHOLD) {
      found.set(raw, Math.round(d * 10) / 10)
    }
  }
  return found
}

function main() {
  const files = globSync(COVERS_GLOB, { cwd: ROOT }).sort()
  if (files.length === 0) {
    console.error('No files found under', COVERS_GLOB)
    process.exit(1)
  }

  const report = []

  for (const rel of files) {
    const filePath = path.join(ROOT, rel)
    let text = readFileSync(filePath, 'utf8')
    const nearCream = findNearCreamValues(text)

    if (nearCream.size === 0) {
      report.push({
        file: rel,
        replaced: [],
        note: 'no near-cream value found (already exact, or no ground tone present)',
      })
      continue
    }

    const replaced = []
    for (const [raw, d] of nearCream) {
      const count = text.split(raw).length - 1
      text = text.split(raw).join(CREAM_RGB)
      replaced.push({ from: raw, distance: d, occurrences: count })
    }

    writeFileSync(filePath, text, 'utf8')
    report.push({ file: rel, replaced })
  }

  console.log(
    JSON.stringify({ target: CREAM_RGB, threshold: DIST_THRESHOLD, files: report }, null, 2)
  )
}

main()
