# Arc geometry: mapping a year to a point on the career arc

**Status:** Research note — not yet implemented
**Related:** `src/app/_components/CareerArc.tsx`, `src/app/_utils/arc-sprinkles.ts`

---

## The question

The two career arcs are cubic Bézier curves. The x-axis encodes time linearly
(1995 → x=80, 2018 → x=1030, 2026 → x=1360). Given a year, can we find its
(x, y) position on the arc — so that sprinkle dots are placed geometrically on
the curve rather than at design-constant coordinates?

---

## The math

A cubic Bézier curve is parameterised by t ∈ [0,1]:

```
P(t) = (1-t)³·P0 + 3(1-t)²t·P1 + 3(1-t)t²·P2 + t³·P3
```

For the research arc the four control points are:

| Point | x    | y   |
| ----- | ---- | --- |
| P0    | 80   | 720 |
| P1    | 250  | 520 |
| P2    | 780  | 420 |
| P3    | 1030 | 480 |

The x component is:

```
x(t) = (1-t)³·80 + 3(1-t)²t·250 + 3(1-t)t²·780 + t³·1030
```

Because x increases monotonically with t along both arcs (the control points
are left-to-right), there is exactly one t for any target x.

---

## The algorithm

### Step 1 — year to x (linear)

```
x_research    = 80  + (year - 1995) / (2018 - 1995) * (1030 - 80)
x_engineering = 1030 + (year - 2018) / (2026 - 2018) * (1360 - 1030)
```

### Step 2 — x to t (binary search)

Binary search on t ∈ [0,1] until |x(t) - target_x| < ε (e.g. 0.1 px):

```ts
function tForX(p: [Point, Point, Point, Point], targetX: number, eps = 0.1): number {
  let lo = 0,
    hi = 1
  while (hi - lo > 1e-6) {
    const mid = (lo + hi) / 2
    cubicAt(p, mid).x > targetX ? (hi = mid) : (lo = mid)
  }
  return (lo + hi) / 2
}
```

Converges in ~20 iterations (2^-20 ≈ 1 µm precision). Newton–Raphson would
converge faster but binary search is robust with no risk of divergence.

### Step 3 — t to y

```ts
const t = tForX(researchPoints, targetX)
const y = cubicAt(researchPoints, t).y
```

---

## Feasibility verdict

**Yes, straightforward.** The implementation is ~30 lines of pure TypeScript with
no dependencies. It belongs in `src/app/_utils/arc-geometry.ts` alongside the
existing sprinkle utilities.

The function signature would be:

```ts
/**
 * Returns the (x, y) SVG coordinate for a given year on the career arc.
 * Returns null if the year falls outside the arc's range.
 */
function yearToArcPoint(
  year: number,
  arc: 'research' | 'engineering'
): { x: number; y: number } | null
```

The control points and year range constants are already in `CareerArc.tsx` —
they could be exported from there, or duplicated as constants in `arc-geometry.ts`
(duplication is acceptable for geometry that is frozen to the approved comp).

---

## Implications for sprinkle placement

Currently sprinkle dot positions are static design constants in `CareerArc.tsx`
(`RESEARCH_SLOTS`, `ENGINEERING_SLOTS`). With `yearToArcPoint`, the dot position
could be derived from the project's year rather than hand-tuned per slot. The
leader line endpoints would still need design judgement (offset direction),
but the anchor dot would be geometrically accurate.

This would make it possible to add/remove projects from content and have their
dots land correctly on the arc without touching component code.

---

---

## Label placement: where to put the text once the dot is found

Given a point P(t) on the curve, placing the annotation label requires two more
pieces of geometry: the **outward normal** (which direction to push the label)
and the **text anchor** (whether the text grows left or right from its x position).

### The tangent

The first derivative of a cubic Bézier gives the tangent vector at t:

```
P'(t) = 3[(1-t)²(P1-P0) + 2(1-t)t(P2-P1) + t²(P3-P2)]
```

Normalised: `T = P'(t) / |P'(t)|`

### The outward normal

Rotating the tangent 90° gives two candidate normals:

```
N_left  = (-Ty,  Tx)   ← rotates CCW (points "left" of direction of travel)
N_right = ( Ty, -Tx)   ← rotates CW  (points "right" of direction of travel)
```

In SVG, y increases downward. The career arcs ascend from bottom-left to
top-right, so the tangent points up-right. The existing annotations are placed
**above** the arc (lower y in SVG terms), which corresponds to `N_left` for
both arcs (since the arcs travel left-to-right, "left of travel" = upward).

The outward normal is therefore `N = (-Ty, Tx)`, which naturally points away
from the concave interior of the arc.

### Placing the leader line and label

Given dot position `dot = P(t)` and outward normal `N`:

```
leader_start = dot                          // the circle on the arc
leader_end   = dot + N * leader_length      // end of the dashed line (e.g. 30 units)
text_pos     = dot + N * (leader_length + text_gap)  // label origin (e.g. +4 units)
```

### Text anchor

The horizontal component of N (`Nx`) determines which side the text flows:

```
textAnchor = Nx >= 0 ? "start" : "end"
```

If the normal points right, text is left-anchored (grows right from text_pos).
If the normal points left, text is right-anchored (grows left from text_pos).

### Verification against existing hand-tuned annotations

The three existing sprinkle positions confirm this model:

| Project        | Dot        | Leader direction | textAnchor |
| -------------- | ---------- | ---------------- | ---------- |
| Calques 3D     | (240,696)  | up-right         | start      |
| Learning Anal. | (760,590)  | up-right         | start      |
| HiveMQ Edge    | (1230,250) | up-left          | end        |

HiveMQ Edge flips to `textAnchor="end"` because at t≈0.88 on the engineering
arc, the tangent is steep enough that N_left points left-upward — consistent
with the existing hand-placed annotation.

### Full derived signature

```ts
/**
 * Returns all geometry needed to render a sprinkle annotation at a given year.
 */
function yearToSprinkleGeometry(
  year: number,
  arc: 'research' | 'engineering',
  leaderLength?: number, // default 30
  textGap?: number // default 4
): {
  dot: { x: number; y: number }
  leaderEnd: { x: number; y: number }
  textPos: { x: number; y: number }
  textAnchor: 'start' | 'end'
} | null
```

---

## When to implement

When the sprinkle count or positions need to change, or when a dynamic number of
sprinkles is wanted (e.g. all featured projects). Not needed while the slot count
is fixed at 2 + 1.
