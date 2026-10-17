#!/usr/bin/env node
// Deterministic/grep-style compliance scan of generated SVG cover illustrations
// against the DESIGN.md approved palette and banned-content rules.
// Exploratory/audit utility — not part of the build pipeline.

import { readFileSync, statSync } from 'node:fs'
import { globSync } from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const COVERS_GLOB = '.docs/design/covers/**/*.svg'

// Approved palette (DESIGN.md "Colors" section)
const APPROVED = {
  '#c0392b': 'Compass-Arc Red',
  '#f8f4ed': 'Draughting Paper',
  '#2a2a2a': 'Construction Graphite',
  '#6b6b6b': 'Faded Graphite',
  '#c8c4bc': 'Ghost Line',
}

function hexDistance(a, b) {
  // a, b are "#rrggbb" lowercase, same length guaranteed by caller
  const ar = parseInt(a.slice(1, 3), 16)
  const ag = parseInt(a.slice(3, 5), 16)
  const ab = parseInt(a.slice(5, 7), 16)
  const br = parseInt(b.slice(1, 3), 16)
  const bg = parseInt(b.slice(3, 5), 16)
  const bb = parseInt(b.slice(5, 7), 16)
  return Math.sqrt((ar - br) ** 2 + (ag - bg) ** 2 + (ab - bb) ** 2)
}

function normalizeHex(raw) {
  let h = raw.toLowerCase()
  if (h.length === 4) {
    // #abc -> #aabbcc
    h = '#' + [...h.slice(1)].map((c) => c + c).join('')
  }
  return h
}

function extractColors(svgText) {
  const colors = new Set()
  // fill="#xxxxxx" / stroke="#xxxxxx" / fill:#xxxxxx in style attrs / stop-color
  const attrRe = /(?:fill|stroke|stop-color)\s*[=:]\s*["']?(#[0-9a-fA-F]{3,6})["']?/g
  let m
  while ((m = attrRe.exec(svgText))) {
    colors.add(normalizeHex(m[1]))
  }
  // rgb()/rgba() forms
  const rgbRe = /(?:fill|stroke|stop-color)\s*[=:]\s*["']?(rgba?\([^)]+\))["']?/g
  while ((m = rgbRe.exec(svgText))) {
    colors.add(m[1].toLowerCase())
  }
  return colors
}

function classifyColors(colorSet) {
  const exact = []
  const nearMiss = [] // close to an approved color but not exact (hex distance <= 10)
  const outOfPalette = [] // not approved, not a near-miss
  const ignored = [] // none / transparent / currentColor / url(#...) refs

  function rgbToHex(raw) {
    const m = raw.match(/rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)/i)
    if (!m) return null
    const toHex = (n) => {
      const v = Math.max(0, Math.min(255, Math.round(parseFloat(n))))
      return v.toString(16).padStart(2, '0')
    }
    return `#${toHex(m[1])}${toHex(m[2])}${toHex(m[3])}`
  }

  for (const raw of colorSet) {
    if (
      raw === 'none' ||
      raw === 'transparent' ||
      raw === 'currentcolor' ||
      raw.startsWith('url(')
    ) {
      ignored.push(raw)
      continue
    }

    let hex = raw
    let originalFormat = 'hex'
    if (!raw.startsWith('#')) {
      const converted = rgbToHex(raw)
      if (!converted) {
        outOfPalette.push({
          color: raw,
          hex: null,
          nearest: null,
          nearestName: null,
          distance: null,
        })
        continue
      }
      hex = converted
      originalFormat = 'rgb'
    }

    if (APPROVED[hex]) {
      exact.push({ color: raw, hex, name: APPROVED[hex], originalFormat })
      continue
    }
    // find nearest approved color
    let best = null
    let bestDist = Infinity
    for (const approvedHex of Object.keys(APPROVED)) {
      const d = hexDistance(hex, approvedHex)
      if (d < bestDist) {
        bestDist = d
        best = approvedHex
      }
    }
    const entry = {
      color: raw,
      hex,
      originalFormat,
      nearest: best,
      nearestName: APPROVED[best],
      distance: Math.round(bestDist * 10) / 10,
    }
    if (bestDist <= 10) {
      nearMiss.push(entry)
    } else {
      outOfPalette.push(entry)
    }
  }
  return { exact, nearMiss, outOfPalette, ignored }
}

function countOccurrences(text, re) {
  const m = text.match(re)
  return m ? m.length : 0
}

function pathDataLength(text) {
  // sum the character length of every d="..." attribute value (path/clip data)
  let total = 0
  const re = /\sd\s*=\s*"([^"]*)"/g
  let m
  while ((m = re.exec(text))) {
    total += m[1].length
  }
  return total
}

function scanFile(filePath) {
  const text = readFileSync(filePath, 'utf8')
  const size = statSync(filePath).size

  const colorSet = extractColors(text)
  const { exact, nearMiss, outOfPalette, ignored } = classifyColors(colorSet)

  const gradientCount =
    countOccurrences(text, /<linearGradient[\s>]/g) +
    countOccurrences(text, /<radialGradient[\s>]/g)
  const linearGradientCount = countOccurrences(text, /<linearGradient[\s>]/g)
  const radialGradientCount = countOccurrences(text, /<radialGradient[\s>]/g)

  const primitives = {
    path: countOccurrences(text, /<path[\s>]/g),
    line: countOccurrences(text, /<line[\s>]/g),
    circle: countOccurrences(text, /<circle[\s>]/g),
    rect: countOccurrences(text, /<rect[\s>]/g),
    polygon: countOccurrences(text, /<polygon[\s>]/g),
    polyline: countOccurrences(text, /<polyline[\s>]/g),
    ellipse: countOccurrences(text, /<ellipse[\s>]/g),
  }
  const otherPrimitiveCount =
    primitives.line +
    primitives.circle +
    primitives.rect +
    primitives.polygon +
    primitives.polyline +
    primitives.ellipse

  const banned = {
    text: countOccurrences(text, /<text[\s>]/g),
    tspan: countOccurrences(text, /<tspan[\s>]/g),
    fontFamily: countOccurrences(text, /font-family/g),
    filter: countOccurrences(text, /<filter[\s>]/g),
    feDropShadow: countOccurrences(text, /<feDropShadow[\s>]/g),
    feGaussianBlur: countOccurrences(text, /<feGaussianBlur[\s>]/g),
    base64: countOccurrences(text, /base64/g),
  }

  const pathCharCount = pathDataLength(text)

  return {
    filePath,
    size,
    colorSet,
    exact,
    nearMiss,
    outOfPalette,
    ignored,
    distinctColorCount: colorSet.size,
    gradientCount,
    linearGradientCount,
    radialGradientCount,
    primitives,
    otherPrimitiveCount,
    banned,
    pathCharCount,
  }
}

function main() {
  const files = globSync(COVERS_GLOB, { cwd: ROOT }).sort()
  if (files.length === 0) {
    console.error('No SVG files found under', COVERS_GLOB)
    process.exit(1)
  }

  const results = files.map((f) => scanFile(path.join(ROOT, f)))

  console.log(
    JSON.stringify(
      results.map((r) => ({
        file: path.relative(ROOT, r.filePath).replace(/\\/g, '/'),
        size: r.size,
        distinctColorCount: r.distinctColorCount,
        exact: r.exact,
        nearMiss: r.nearMiss,
        outOfPalette: r.outOfPalette,
        ignored: r.ignored,
        gradientCount: r.gradientCount,
        linearGradientCount: r.linearGradientCount,
        radialGradientCount: r.radialGradientCount,
        primitives: r.primitives,
        otherPrimitiveCount: r.otherPrimitiveCount,
        banned: r.banned,
        pathCharCount: r.pathCharCount,
      })),
      null,
      2
    )
  )
}

main()
