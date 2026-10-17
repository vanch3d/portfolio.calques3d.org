#!/usr/bin/env node
// Summarizes scripts/svg-compliance-scan.mjs output into a compact table.
import { readFileSync } from 'node:fs'

const data = JSON.parse(readFileSync(process.argv[2] || '.local/tmp/svg-scan-results.json', 'utf8'))

function fmtColor(entry) {
  return `${entry.hex || entry.color}${entry.nearestName ? ` (~${entry.nearestName}, d=${entry.distance})` : ''}`
}

const rows = []
for (const r of data) {
  const bannedFlags = Object.entries(r.banned)
    .filter(([, v]) => v > 0)
    .map(([k, v]) => `${k}:${v}`)
    .join(',')
  rows.push({
    file: r.file.replace('.docs/design/covers/', '').replace('/svgmaker-poc-', ' :: '),
    size: r.size,
    distinctColors: r.distinctColorCount,
    exactApproved: r.exact.length,
    nearMiss: r.nearMiss.length,
    outOfPalette: r.outOfPalette.length,
    gradients: r.gradientCount,
    pathCount: r.primitives.path,
    otherPrimitives: r.otherPrimitiveCount,
    bannedFlags: bannedFlags || 'none',
    pathCharCount: r.pathCharCount,
  })
}

// Table
const header = [
  'file',
  'size(B)',
  'distinctColors',
  'exact',
  'nearMiss',
  'outOfPalette',
  'gradients',
  'pathCount',
  'otherPrim',
  'banned',
  'pathChars',
]
console.log(header.join(' | '))
console.log(header.map(() => '---').join(' | '))
for (const row of rows) {
  console.log(
    [
      row.file,
      row.size,
      row.distinctColors,
      row.exactApproved,
      row.nearMiss,
      row.outOfPalette,
      row.gradients,
      row.pathCount,
      row.otherPrimitives,
      row.bannedFlags,
      row.pathCharCount,
    ].join(' | ')
  )
}

console.log('\n--- Totals / extremes ---')
console.log('Files scanned:', data.length)
console.log(
  'Total exact-approved color uses (sum across files):',
  rows.reduce((a, r) => a + r.exactApproved, 0)
)
console.log(
  'Total near-miss colors (sum across files):',
  rows.reduce((a, r) => a + r.nearMiss, 0)
)
console.log(
  'Total out-of-palette colors (sum across files):',
  rows.reduce((a, r) => a + r.outOfPalette, 0)
)
console.log(
  'Total gradient defs (sum across files):',
  rows.reduce((a, r) => a + r.gradients, 0)
)
console.log(
  'Files with zero gradients:',
  rows
    .filter((r) => r.gradients === 0)
    .map((r) => r.file)
    .join(', ') || 'none'
)
console.log(
  'Files with any banned-content flag:',
  rows
    .filter((r) => r.bannedFlags !== 'none')
    .map((r) => r.file)
    .join(', ') || 'none'
)

const byDistinct = [...rows].sort((a, b) => b.distinctColors - a.distinctColors)
console.log('\nMost distinct colors:', byDistinct[0].file, byDistinct[0].distinctColors)
console.log(
  'Fewest distinct colors:',
  byDistinct[byDistinct.length - 1].file,
  byDistinct[byDistinct.length - 1].distinctColors
)

const byGradient = [...rows].sort((a, b) => b.gradients - a.gradients)
console.log('Most gradients:', byGradient[0].file, byGradient[0].gradients)

const byPath = [...rows].sort((a, b) => b.pathCount - a.pathCount)
console.log('Most <path> elements:', byPath[0].file, byPath[0].pathCount)

const bySize = [...rows].sort((a, b) => b.size - a.size)
console.log('Largest file:', bySize[0].file, bySize[0].size, 'bytes')
console.log(
  'Smallest file:',
  bySize[bySize.length - 1].file,
  bySize[bySize.length - 1].size,
  'bytes'
)

// Full near-miss detail dump (small, useful for report)
console.log('\n--- Near-miss detail (hex distance <= 10 from an approved color) ---')
for (const r of data) {
  if (r.nearMiss.length > 0) {
    console.log(r.file)
    for (const nm of r.nearMiss) console.log('  ', fmtColor(nm))
  }
}
if (data.every((r) => r.nearMiss.length === 0)) console.log('(none found in any file)')

// Exact match detail
console.log('\n--- Exact-approved-color detail ---')
for (const r of data) {
  if (r.exact.length > 0) {
    console.log(r.file)
    for (const e of r.exact) console.log('  ', e.color, '->', e.name)
  }
}
if (data.every((r) => r.exact.length === 0)) console.log('(none found in any file)')
