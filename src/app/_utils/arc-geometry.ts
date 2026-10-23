// Pure functions computing CareerArc sprinkle/label geometry from each arc's
// cubic Bézier control points and a calendar year, instead of hand-placed
// pixel constants. Follows the pure/tested/documented pattern in
// src/lib/period.ts. See .docs/tasks/2026-10-23-career-arc-fixes.md.

export type Point = { x: number; y: number }

export type CubicBezier = {
  p0: Point
  p1: Point
  p2: Point
  p3: Point
}

export type ArcDefinition = CubicBezier & {
  yearStart: number
  yearEnd: number
}

export const RESEARCH_ARC: ArcDefinition = {
  p0: { x: 80, y: 720 },
  p1: { x: 250, y: 520 },
  p2: { x: 780, y: 420 },
  p3: { x: 1030, y: 480 },
  yearStart: 1995,
  yearEnd: 2018,
}

export const ENGINEERING_ARC: ArcDefinition = {
  p0: { x: 1030, y: 480 },
  p1: { x: 1090, y: 300 },
  p2: { x: 1260, y: 160 },
  p3: { x: 1360, y: 120 },
  yearStart: 2018,
  yearEnd: 2026,
}

// Single source of truth for sprinkle idealYear, shared by page.tsx
// (pickSprinkle) and CareerArc.tsx (sprinkleSlot).
export const RESEARCH_SPRINKLE_YEARS: readonly number[] = [2002, 2013]
export const ENGINEERING_SPRINKLE_YEARS: readonly number[] = [2023]

/** B(t) = (1-t)³P0 + 3(1-t)²tP1 + 3(1-t)t²P2 + t³P3, t ∈ [0, 1] */
export function pointOnCubicBezier(p0: Point, p1: Point, p2: Point, p3: Point, t: number): Point {
  const mt = 1 - t
  const a = mt * mt * mt
  const b = 3 * mt * mt * t
  const c = 3 * mt * t * t
  const d = t * t * t
  return {
    x: a * p0.x + b * p1.x + c * p2.x + d * p3.x,
    y: a * p0.y + b * p1.y + c * p2.y + d * p3.y,
  }
}

/** Maps a calendar year to a point on `arc`, clamping years outside its domain. */
export function yearToArcPoint(year: number, arc: ArcDefinition): Point {
  const span = arc.yearEnd - arc.yearStart
  const t = span === 0 ? 0 : (year - arc.yearStart) / span
  const clampedT = Math.min(1, Math.max(0, t))
  return pointOnCubicBezier(arc.p0, arc.p1, arc.p2, arc.p3, clampedT)
}

export type LabelAlign = 'start' | 'end'

export type SprinkleGeometry = {
  cx: number
  cy: number
  lx1: number
  ly1: number
  lx2: number
  ly2: number
  tx: number
  ty: number
  align: LabelAlign
}

// sign flips horizontal deltas so 'start' labels trail up-right and 'end'
// labels trail up-left.
const LEADER_GAP = 3
const LEADER_RUN = 33
const LEADER_RISE = 18
const LABEL_GAP = 4
const LABEL_RISE = 3

export const SPRINKLE_LINE_HEIGHT = 14

// Approximate label bounding box for collision detection only, not rendering.
const LABEL_BOX_WIDTH = 170
const LABEL_BOX_HEIGHT = SPRINKLE_LINE_HEIGHT + 14

/**
 * Computes a sprinkle's dot, leader line, and label anchor for `year` on `arc`.
 * `labelOffset` nudges the leader end and label only (never the dot) — a
 * per-slot escape hatch for a label that sits close to the curve at that
 * point, without moving the shared leader constants for every slot.
 */
export function computeSprinkleGeometry(
  year: number,
  arc: ArcDefinition,
  align: LabelAlign,
  labelOffset: Point = { x: 0, y: 0 }
): SprinkleGeometry {
  const { x: cx, y: cy } = yearToArcPoint(year, arc)
  const sign = align === 'start' ? 1 : -1

  const lx1 = cx + sign * LEADER_GAP
  const ly1 = cy
  const lx2 = lx1 + sign * LEADER_RUN + labelOffset.x
  const ly2 = ly1 - LEADER_RISE + labelOffset.y
  const tx = lx2 + sign * LABEL_GAP
  const ty = ly2 - LABEL_RISE

  return { cx, cy, lx1, ly1, lx2, ly2, tx, ty, align }
}

export type Rect = { x: number; y: number; width: number; height: number }

// IdentityBlock renders outside the SVG as a CSS sibling, so this is an
// approximation of its footprint in viewBox units, not a measured value.
export const ERA_I_LABEL_REGION: Rect = { x: 380, y: 678, width: 120, height: 55 }
export const ERA_II_LABEL_REGION: Rect = { x: 1125, y: 328, width: 120, height: 55 }
export const IDENTITY_BLOCK_REGION: Rect = { x: 0, y: 0, width: 520, height: 360 }

export const DEFAULT_RESERVED_REGIONS: readonly Rect[] = [
  ERA_I_LABEL_REGION,
  ERA_II_LABEL_REGION,
  IDENTITY_BLOCK_REGION,
]

function labelRect(geometry: SprinkleGeometry): Rect {
  const left = geometry.align === 'start' ? geometry.tx : geometry.tx - LABEL_BOX_WIDTH
  const top = geometry.ty - 11
  return { x: left, y: top, width: LABEL_BOX_WIDTH, height: LABEL_BOX_HEIGHT }
}

function rectsOverlap(a: Rect, b: Rect): boolean {
  return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y
}

const COLLISION_NUDGE_STEP = 24
const MAX_COLLISION_ATTEMPTS = 6

/**
 * Nudges a sprinkle's leader end and label upward in fixed steps until clear
 * of every reserved region, or MAX_COLLISION_ATTEMPTS is exhausted. The dot
 * (cx, cy) never moves.
 */
export function avoidReservedRegions(
  geometry: SprinkleGeometry,
  regions: readonly Rect[] = DEFAULT_RESERVED_REGIONS
): SprinkleGeometry {
  let current = geometry
  let attempts = 0

  while (
    attempts < MAX_COLLISION_ATTEMPTS &&
    regions.some((region) => rectsOverlap(labelRect(current), region))
  ) {
    current = {
      ...current,
      ly2: current.ly2 - COLLISION_NUDGE_STEP,
      ty: current.ty - COLLISION_NUDGE_STEP,
    }
    attempts++
  }

  return current
}

/** Collision-resolved sprinkle slot — the entry point CareerArc.tsx uses for each slot. */
export function sprinkleSlot(
  year: number,
  arc: ArcDefinition,
  align: LabelAlign,
  labelOffset?: Point
): SprinkleGeometry {
  return avoidReservedRegions(computeSprinkleGeometry(year, arc, align, labelOffset))
}

function lerp(a: Point, b: Point, t: number): Point {
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t }
}

/** Splits a cubic Bézier at `t`, returning the [before, after] sub-curves. */
export function splitBezier(bezier: CubicBezier, t: number): [CubicBezier, CubicBezier] {
  const { p0, p1, p2, p3 } = bezier
  const p01 = lerp(p0, p1, t)
  const p12 = lerp(p1, p2, t)
  const p23 = lerp(p2, p3, t)
  const p012 = lerp(p01, p12, t)
  const p123 = lerp(p12, p23, t)
  const p0123 = lerp(p012, p123, t)
  return [
    { p0, p1: p01, p2: p012, p3: p0123 },
    { p0: p0123, p1: p123, p2: p23, p3 },
  ]
}

/** Exact cubic Bézier sub-curve spanning [t0, t1] of `bezier`, via two sequential splits. */
export function trimBezier(bezier: CubicBezier, t0: number, t1: number): CubicBezier {
  if (t0 <= 0 && t1 >= 1) return bezier
  const [upToT1] = splitBezier(bezier, Math.max(t1, 1e-9))
  if (t0 <= 0) return upToT1
  const t0Local = t0 / t1
  const [, fromT0] = splitBezier(upToT1, Math.min(t0Local, 1))
  return fromT0
}

/** Formats a CubicBezier as an SVG cubic path `d` attribute. */
export function bezierToPathD(bezier: CubicBezier): string {
  const { p0, p1, p2, p3 } = bezier
  return `M ${p0.x},${p0.y} C ${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y}`
}

/**
 * Exact Bézier sub-curve of `arc` spanning [periodStartYear, periodEndYear],
 * clamped to the arc's domain. Null when the clamped range has zero width.
 */
export function durationSegmentBezier(
  arc: ArcDefinition,
  periodStartYear: number,
  periodEndYear: number
): CubicBezier | null {
  const span = arc.yearEnd - arc.yearStart
  if (span === 0) return null
  const toT = (year: number) => Math.min(1, Math.max(0, (year - arc.yearStart) / span))
  const t0 = toT(periodStartYear)
  const t1 = toT(periodEndYear)
  if (t1 - t0 <= 0) return null
  return trimBezier({ p0: arc.p0, p1: arc.p1, p2: arc.p2, p3: arc.p3 }, t0, t1)
}

/** Duration indicator Option A ("band") — see CareerArc.tsx's DurationIndicator. */
export function durationSegmentPath(
  arc: ArcDefinition,
  periodStartYear: number,
  periodEndYear: number
): string | null {
  const segment = durationSegmentBezier(arc, periodStartYear, periodEndYear)
  return segment ? bezierToPathD(segment) : null
}

/** Translates every control point of a cubic Bézier by a fixed (dx, dy). */
export function translateBezier(bezier: CubicBezier, dx: number, dy: number): CubicBezier {
  const shift = (p: Point): Point => ({ x: p.x + dx, y: p.y + dy })
  return { p0: shift(bezier.p0), p1: shift(bezier.p1), p2: shift(bezier.p2), p3: shift(bezier.p3) }
}

/** Duration indicator Option B ("echo") — see CareerArc.tsx's DurationIndicator. */
export function durationEchoPath(
  arc: ArcDefinition,
  periodStartYear: number,
  periodEndYear: number,
  offset: Point
): string | null {
  const segment = durationSegmentBezier(arc, periodStartYear, periodEndYear)
  return segment ? bezierToPathD(translateBezier(segment, offset.x, offset.y)) : null
}
