import { describe, it, expect } from 'vitest'
import {
  pointOnCubicBezier,
  yearToArcPoint,
  computeSprinkleGeometry,
  avoidReservedRegions,
  sprinkleSlot,
  splitBezier,
  trimBezier,
  bezierToPathD,
  durationSegmentPath,
  translateBezier,
  durationEchoPath,
  RESEARCH_ARC,
  ENGINEERING_ARC,
} from './arc-geometry'
import type { ArcDefinition, CubicBezier, Rect, SprinkleGeometry } from './arc-geometry'

describe('pointOnCubicBezier', () => {
  const p0 = { x: 0, y: 0 }
  const p1 = { x: 0, y: 100 }
  const p2 = { x: 100, y: 100 }
  const p3 = { x: 100, y: 0 }

  it('returns p0 at t=0', () => {
    expect(pointOnCubicBezier(p0, p1, p2, p3, 0)).toEqual({ x: 0, y: 0 })
  })

  it('returns p3 at t=1', () => {
    expect(pointOnCubicBezier(p0, p1, p2, p3, 1)).toEqual({ x: 100, y: 0 })
  })

  it('returns the symmetric midpoint at t=0.5 for this symmetric curve', () => {
    const mid = pointOnCubicBezier(p0, p1, p2, p3, 0.5)
    expect(mid.x).toBeCloseTo(50, 5)
    expect(mid.y).toBeCloseTo(75, 5)
  })
})

describe('yearToArcPoint', () => {
  const arc: ArcDefinition = {
    p0: { x: 80, y: 720 },
    p1: { x: 250, y: 520 },
    p2: { x: 780, y: 420 },
    p3: { x: 1030, y: 480 },
    yearStart: 1995,
    yearEnd: 2018,
  }

  it('returns the curve origin at yearStart', () => {
    expect(yearToArcPoint(1995, arc)).toEqual({ x: 80, y: 720 })
  })

  it('returns the curve terminus at yearEnd', () => {
    expect(yearToArcPoint(2018, arc)).toEqual({ x: 1030, y: 480 })
  })

  it('clamps years before yearStart to the curve origin', () => {
    expect(yearToArcPoint(1980, arc)).toEqual({ x: 80, y: 720 })
  })

  it('clamps years after yearEnd to the curve terminus', () => {
    expect(yearToArcPoint(2030, arc)).toEqual({ x: 1030, y: 480 })
  })

  it('maps SAFeSEA (2013) to the mathematically correct point, not the old hand-placed (760, 590)', () => {
    const point = yearToArcPoint(2013, RESEARCH_ARC)
    expect(point.x).toBeCloseTo(834, 0)
    expect(point.y).toBeCloseTo(463, 0)
  })

  it('maps HiveMQ Edge (2023) on the engineering arc to the mathematically correct point', () => {
    const point = yearToArcPoint(2023, ENGINEERING_ARC)
    expect(Math.abs(point.x - 1228)).toBeLessThan(2)
    expect(Math.abs(point.y - 204)).toBeLessThan(2)
  })
})

describe('computeSprinkleGeometry', () => {
  it('places the dot exactly on the arc point for the given year', () => {
    const geometry = computeSprinkleGeometry(2013, RESEARCH_ARC, 'start')
    const expected = yearToArcPoint(2013, RESEARCH_ARC)
    expect(geometry.cx).toBeCloseTo(expected.x, 5)
    expect(geometry.cy).toBeCloseTo(expected.y, 5)
  })

  it('leans the leader line and label to the right for align="start"', () => {
    const geometry = computeSprinkleGeometry(2013, RESEARCH_ARC, 'start')
    expect(geometry.lx2).toBeGreaterThan(geometry.cx)
    expect(geometry.tx).toBeGreaterThan(geometry.lx2)
  })

  it('leans the leader line and label to the left for align="end"', () => {
    const geometry = computeSprinkleGeometry(2023, ENGINEERING_ARC, 'end')
    expect(geometry.lx2).toBeLessThan(geometry.cx)
    expect(geometry.tx).toBeLessThan(geometry.lx2)
  })

  it('always rises the leader line and label above the dot (smaller y)', () => {
    const geometry = computeSprinkleGeometry(2002, RESEARCH_ARC, 'start')
    expect(geometry.ly2).toBeLessThan(geometry.cy)
    expect(geometry.ty).toBeLessThan(geometry.ly2)
  })

  it('preserves the requested align on the returned geometry', () => {
    expect(computeSprinkleGeometry(2002, RESEARCH_ARC, 'start').align).toBe('start')
    expect(computeSprinkleGeometry(2023, ENGINEERING_ARC, 'end').align).toBe('end')
  })
})

describe('avoidReservedRegions', () => {
  const baseGeometry: SprinkleGeometry = {
    cx: 400,
    cy: 400,
    lx1: 403,
    ly1: 400,
    lx2: 436,
    ly2: 382,
    tx: 440,
    ty: 379,
    align: 'start',
  }

  it('returns the geometry unchanged when it overlaps no reserved region', () => {
    const result = avoidReservedRegions(baseGeometry, [])
    expect(result).toEqual(baseGeometry)
  })

  it('nudges the label upward until it clears an overlapping region', () => {
    const collidingRegion: Rect = { x: 430, y: 340, width: 100, height: 100 }
    const result = avoidReservedRegions(baseGeometry, [collidingRegion])

    expect(result.ty).toBeLessThan(baseGeometry.ty)
    expect(result.ly2).toBeLessThan(baseGeometry.ly2)
    // The leader-to-label vertical offset is preserved — only the whole
    // group moves, not its internal proportions.
    expect(result.ty - result.ly2).toBe(baseGeometry.ty - baseGeometry.ly2)
  })

  it('never moves the dot position — only the leader end and label', () => {
    const collidingRegion: Rect = { x: 430, y: 340, width: 100, height: 100 }
    const result = avoidReservedRegions(baseGeometry, [collidingRegion])
    expect(result.cx).toBe(baseGeometry.cx)
    expect(result.cy).toBe(baseGeometry.cy)
  })

  it('gives up after a bounded number of attempts rather than looping forever', () => {
    const unavoidableRegion: Rect = { x: -10000, y: -10000, width: 100000, height: 100000 }
    expect(() => avoidReservedRegions(baseGeometry, [unavoidableRegion])).not.toThrow()
  })
})

describe('sprinkleSlot', () => {
  it('composes computeSprinkleGeometry and avoidReservedRegions into a single slot', () => {
    const slot = sprinkleSlot(2013, RESEARCH_ARC, 'start')
    const expectedPoint = yearToArcPoint(2013, RESEARCH_ARC)
    expect(slot.cx).toBeCloseTo(expectedPoint.x, 5)
    expect(slot.cy).toBeCloseTo(expectedPoint.y, 5)
    expect(slot.align).toBe('start')
  })
})

describe('computeSprinkleGeometry labelOffset', () => {
  it('defaults to no offset — identical to calling without the argument', () => {
    const withDefault = computeSprinkleGeometry(2013, RESEARCH_ARC, 'start')
    const withExplicitZero = computeSprinkleGeometry(2013, RESEARCH_ARC, 'start', { x: 0, y: 0 })
    expect(withExplicitZero).toEqual(withDefault)
  })

  it('shifts the leader end and label anchor by (dx, dy), not the dot', () => {
    const base = computeSprinkleGeometry(2002, RESEARCH_ARC, 'start')
    const offset = computeSprinkleGeometry(2002, RESEARCH_ARC, 'start', { x: 20, y: 15 })
    expect(offset.cx).toBe(base.cx)
    expect(offset.cy).toBe(base.cy)
    expect(offset.lx2).toBeCloseTo(base.lx2 + 20, 5)
    expect(offset.ly2).toBeCloseTo(base.ly2 + 15, 5)
    expect(offset.tx).toBeCloseTo(base.tx + 20, 5)
    expect(offset.ty).toBeCloseTo(base.ty + 15, 5)
  })
})

// ─── splitBezier / trimBezier ────────────────────────────────────────────────

describe('splitBezier', () => {
  const bezier: CubicBezier = {
    p0: { x: 0, y: 0 },
    p1: { x: 0, y: 100 },
    p2: { x: 100, y: 100 },
    p3: { x: 100, y: 0 },
  }

  it('splits at t into two curves that share the point at t', () => {
    const [left, right] = splitBezier(bezier, 0.5)
    expect(left.p3).toEqual(right.p0)
    expect(left.p3).toEqual(pointOnCubicBezier(bezier.p0, bezier.p1, bezier.p2, bezier.p3, 0.5))
  })

  it('left curve starts at the original p0, right curve ends at the original p3', () => {
    const [left, right] = splitBezier(bezier, 0.5)
    expect(left.p0).toEqual(bezier.p0)
    expect(right.p3).toEqual(bezier.p3)
  })

  it('splitting at t=0 produces a degenerate left curve and an unchanged right curve', () => {
    const [left, right] = splitBezier(bezier, 0)
    expect(left.p0).toEqual(bezier.p0)
    expect(left.p3).toEqual(bezier.p0)
    expect(right).toEqual(bezier)
  })
})

describe('trimBezier', () => {
  const bezier: CubicBezier = RESEARCH_ARC

  it('returns the original curve unchanged for [0, 1]', () => {
    expect(trimBezier(bezier, 0, 1)).toEqual(bezier)
  })

  it('endpoints of the trimmed curve match pointOnCubicBezier at t0 and t1', () => {
    const t0 = 0.2
    const t1 = 0.7
    const trimmed = trimBezier(bezier, t0, t1)
    const expectedStart = pointOnCubicBezier(bezier.p0, bezier.p1, bezier.p2, bezier.p3, t0)
    const expectedEnd = pointOnCubicBezier(bezier.p0, bezier.p1, bezier.p2, bezier.p3, t1)
    expect(trimmed.p0.x).toBeCloseTo(expectedStart.x, 5)
    expect(trimmed.p0.y).toBeCloseTo(expectedStart.y, 5)
    expect(trimmed.p3.x).toBeCloseTo(expectedEnd.x, 5)
    expect(trimmed.p3.y).toBeCloseTo(expectedEnd.y, 5)
  })

  it('a midpoint of the trimmed curve lies exactly on the original curve (same shape, not an approximation)', () => {
    const t0 = 0.3
    const t1 = 0.6
    const trimmed = trimBezier(bezier, t0, t1)
    const midOfTrimmed = pointOnCubicBezier(trimmed.p0, trimmed.p1, trimmed.p2, trimmed.p3, 0.5)
    const midOfOriginalAtScaledT = pointOnCubicBezier(
      bezier.p0,
      bezier.p1,
      bezier.p2,
      bezier.p3,
      t0 + (t1 - t0) * 0.5
    )
    expect(midOfTrimmed.x).toBeCloseTo(midOfOriginalAtScaledT.x, 5)
    expect(midOfTrimmed.y).toBeCloseTo(midOfOriginalAtScaledT.y, 5)
  })
})

describe('bezierToPathD', () => {
  it('formats an SVG cubic path d attribute', () => {
    const bezier: CubicBezier = {
      p0: { x: 80, y: 720 },
      p1: { x: 250, y: 520 },
      p2: { x: 780, y: 420 },
      p3: { x: 1030, y: 480 },
    }
    expect(bezierToPathD(bezier)).toBe('M 80,720 C 250,520 780,420 1030,480')
  })
})

describe('durationSegmentPath', () => {
  it('returns a path spanning the given year range', () => {
    const d = durationSegmentPath(RESEARCH_ARC, 2012, 2014)
    expect(d).not.toBeNull()
    expect(d).toMatch(/^M [\d.-]+,[\d.-]+ C /)
  })

  it('clamps years outside the arc domain to the domain bounds', () => {
    const d = durationSegmentPath(RESEARCH_ARC, 1900, 2050)
    expect(d).toEqual(bezierToPathD(RESEARCH_ARC))
  })

  it('returns null when the clamped range has zero width', () => {
    // Both years clamp to the same end of the domain — no segment to draw.
    expect(durationSegmentPath(RESEARCH_ARC, 1800, 1900)).toBeNull()
  })

  it('returns null for a zero-width request even inside the domain', () => {
    expect(durationSegmentPath(RESEARCH_ARC, 2010, 2010)).toBeNull()
  })
})

describe('translateBezier', () => {
  const bezier: CubicBezier = {
    p0: { x: 0, y: 0 },
    p1: { x: 10, y: 20 },
    p2: { x: 30, y: 40 },
    p3: { x: 50, y: 60 },
  }

  it('shifts every control point by (dx, dy)', () => {
    const shifted = translateBezier(bezier, -8, -10)
    expect(shifted).toEqual({
      p0: { x: -8, y: -10 },
      p1: { x: 2, y: 10 },
      p2: { x: 22, y: 30 },
      p3: { x: 42, y: 50 },
    })
  })

  it('preserves the curve shape (zero offset is a no-op)', () => {
    expect(translateBezier(bezier, 0, 0)).toEqual(bezier)
  })
})

describe('durationEchoPath (Option B — secondary line, offset from the arc)', () => {
  it('returns a path spanning the given year range, offset by the given amount', () => {
    const offset = { x: -8, y: -10 }
    const d = durationEchoPath(RESEARCH_ARC, 2012, 2014, offset)
    const undoOffset = durationSegmentPath(RESEARCH_ARC, 2012, 2014)
    expect(d).not.toBeNull()
    expect(undoOffset).not.toBeNull()
    // The echo path is the plain segment path translated by `offset` — verify
    // via the inverse: translating the echo path's bezier back by -offset
    // reconstructs the un-offset segment exactly.
    const segmentBezier = durationSegmentBezierFromPath(undoOffset as string)
    const echoBezier = durationSegmentBezierFromPath(d as string)
    const reconstructed = translateBezier(echoBezier, -offset.x, -offset.y)
    expect(reconstructed.p0.x).toBeCloseTo(segmentBezier.p0.x, 5)
    expect(reconstructed.p0.y).toBeCloseTo(segmentBezier.p0.y, 5)
    expect(reconstructed.p3.x).toBeCloseTo(segmentBezier.p3.x, 5)
    expect(reconstructed.p3.y).toBeCloseTo(segmentBezier.p3.y, 5)
  })

  it('returns null when the underlying segment is null (zero-width/out-of-domain range)', () => {
    expect(durationEchoPath(RESEARCH_ARC, 2010, 2010, { x: -8, y: -10 })).toBeNull()
  })
})

// Parses a "M x,y C x,y x,y x,y" path d string back into a CubicBezier, for
// assertions above that need to compare computed paths structurally.
function durationSegmentBezierFromPath(d: string): CubicBezier {
  const match = d.match(
    /^M ([\d.-]+),([\d.-]+) C ([\d.-]+),([\d.-]+) ([\d.-]+),([\d.-]+) ([\d.-]+),([\d.-]+)$/
  )
  if (!match) throw new Error(`Unparseable path d: ${d}`)
  const [, x0, y0, x1, y1, x2, y2, x3, y3] = match.map(Number)
  return {
    p0: { x: x0, y: y0 },
    p1: { x: x1, y: y1 },
    p2: { x: x2, y: y2 },
    p3: { x: x3, y: y3 },
  }
}
