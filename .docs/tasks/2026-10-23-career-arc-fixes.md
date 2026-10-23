---
status: implemented
---

# CareerArc — viewport crop, responsive breakpoints, label positioning

> Component: `src/app/_components/CareerArc.tsx` (hero canvas, homepage)
> Reported: 2026-10-23, with 4 screenshots showing the defects live
> Related: `.docs/tasks/2026-09-03-homepage-surface-plan.md` (original comp), ADR 021 (timeline molecule — CareerArc is explicitly exempted from it, see CareerArc.tsx header comment)

## Problem statement (as reported)

1. **Viewport crop at load** — the canvas viewport matches the browser viewport but has no top/bottom safe margin, so part of the diagram is off-screen at load (screenshot 1).
2. **Responsive breakpoints cut the diagram off** rather than adapting it (screenshots 2, 3, 4) — no breakpoint logic exists today.
3. **Label placement is wrong**:
   - ERA I appears missing in some screenshots.
   - HiveMQ Edge sprinkle reads as "too early" on the engineering arc.
   - SAFeSEA sprinkle is "clearly at the wrong place".
   - Both eras should be unambiguously associated with their arc, and labels must not collide.
4. **Featured-project request**: favour `projects` (not `positions`) for arc sprinkles, driven by a `featured` property — add HiveMQ Edge, Calques3D, SAFeSEA as featured if the property doesn't exist yet.

## Investigation findings

### 1. Viewport crop — root cause confirmed

`CareerArc.tsx`:

```tsx
<svg className="absolute inset-0 h-full w-full" viewBox="0 0 1440 900"
     preserveAspectRatio="xMidYMin slice" ... >
```

rendered inside `page.tsx`'s `<section className="relative h-screen min-h-[600px] w-full overflow-hidden">`.

viewBox aspect ratio is 1440:900 = **1.6**. Any browser viewport wider than 1.6:1 (virtually all desktop monitors — 16:9 ≈ 1.78, 16:10 ≈ 1.6, ultrawide ≈ 2.4+) triggers `slice` to scale the SVG so its **width** matches the container, which makes the rendered **height** exceed the container height. With `YMin` alignment, the excess is cropped from the **bottom** — i.e. the 1995-era content (viewBox y ≈ 700–900: Calques 3D sprinkle, ERA I label, arc origin) gets pushed below the fold. No vertical safe margin is reserved anywhere in the stack. This is exactly what screenshot 1 (wide 16:9-ish window) shows, and why narrower screenshots (2–4) crop less.

"ERA I is missing" (screenshot 1) is a symptom of this same crop, not a separate label bug — ERA I renders fine in screenshots 2–4, just at the very edge/cut off further on narrower windows too.

### 2. Responsive breakpoints — none exist

The SVG geometry, sprinkle slots, and text are identical at every viewport size; only the CSS `slice` scaling changes what's visible. There's no Tailwind breakpoint logic in this component at all, so there's no "reduce density on small screens" behaviour to adapt — it just clips.

### 3. Label placement — root cause confirmed, with numbers

`RESEARCH_SLOTS` / `ENGINEERING_SLOTS` in `CareerArc.tsx` are **hand-eyeballed static pixel coordinates**, written once and never re-derived against the actual Bézier curves they annotate or the actual project picked by `pickSprinkle()` for that slot's `idealYear`.

Computing the mathematically correct point on each arc's cubic Bézier for the real picked project's year (`pointOnCubicBezier`, linear `t` interpolation across the arc's year domain) against the hardcoded constants:

| Sprinkle                               | idealYear | Arc control points                                    | Hardcoded (cx, cy) | Computed-correct (cx, cy) | Delta                                                                     |
| -------------------------------------- | --------- | ----------------------------------------------------- | ------------------ | ------------------------- | ------------------------------------------------------------------------- |
| Research slot 0 (picks e.g. Calques3D) | 2002      | `M 80,720 C 250,520 780,420 1030,480` (1995→2018)     | (240, 696)         | (≈317, ≈463)              | Δx ≈ 77px (5.3%)                                                          |
| Research slot 1 (picks SAFeSEA)        | 2013      | same                                                  | (760, 590)         | (≈834, ≈463)              | Δy ≈ **127px (14%)**                                                      |
| Engineering slot 0 (picks HiveMQ Edge) | 2023      | `M 1030,480 C 1090,300 1260,160 1360,120` (2018→2026) | (1230, 250)        | (≈1228, ≈204)             | Δy ≈ 46px (5%) — reads as "too early" (lower = less far along the ascent) |

SAFeSEA's hardcoded slot is **127px too low** (out of 900 viewBox units) relative to where year 2013 actually falls on the curve — enough to visually overlap the `IdentityBlock` text column / `CareerChord` dashed diagonal, matching "clearly at the wrong place". HiveMQ Edge's slot is 46px low, matching "too early".

The fix is to stop hand-placing coordinates and compute them from the curve, the same way `src/lib/period.ts` already does for the footer/sidebar timelines (`assignLabelPositions`, `deduplicateDatums` — tested, documented pure functions consumed by `PeriodRuler`). This component is explicitly exempted from reusing `PeriodRuler` itself (see file header), but the _pattern_ — pure, tested, documented geometry functions — still applies.

### 4. `featured` property — already exists, already correct

`src/types/content.ts:91` (`EngineeringProject`) and `:177` (`ResearchProject`) both already declare `featured: boolean`. `pickSprinkle()` (`arc-sprinkles.ts:63`) already prefers featured candidates. Content already has exactly the three requested projects marked `featured: true`:

- `src/content/research/calques3d.mdx`
- `src/content/research/safesea.mdx`
- `src/content/engineering/hivemq-edge.mdx`

**No schema or content change needed for this part.** (Confirmed via `src/schemas/project.schema.json`, `case-study.schema.json` too — `featured` is a required field there as well.)

## Fix plan

### A. Viewport crop fix

Stop clipping the full 1440×900 scene on load. Likely direction: `preserveAspectRatio="xMidYMid meet"` (letterbox instead of crop) combined with re-checking `h-screen`/`min-h` on the hero `<section>`, OR an explicit computed height that guarantees the full viewBox fits. Validate against the reported screenshot sizes plus 1920×1080, 2560×1440, 3440×1440 (ultrawide) and the 600px `min-h` floor already set on the section.

### B. Responsive breakpoint rules (new)

Build a density table across Tailwind's default breakpoints (`sm` 640 / `md` 768 / `lg` 1024 / `xl` 1280 / `2xl` 1536, plus an explicit ultra-wide check ≥1920) driven by a dedicated Cypress spec — `CareerArc.responsive.cy.tsx` (CT, `cy.viewport()` per breakpoint) — that is the source of truth for what the rules should be, not a guess. Likely direction (to refine against real rendering, not fixed in advance): drop sprinkle subtitle lines, then whole sprinkles, then non-essential chrome as viewport shrinks — mirroring the existing `md`/`sm` density-reduction pattern already used by `ClassificationHeader`/`ResourceAnnotationBar` (`.docs/tasks/2026-09-08-project-surface.md` §Breakpoints).

**Test strategy (confirmed with Nicolas 2026-10-23), in priority order:**

1. **Structural assertions, primary.** For each breakpoint: which sprinkle/label elements are expected `.should('exist')` vs `.should('not.exist')` per the density table (`data-testid`s already exist on most groups — `arc-research`, `arc-engineering`, `timeline-legend`, etc.; add any missing on sprinkle/era-label groups as part of this work).
2. **Quadrant/bounding-box containment, primary.** Assert every visible element's rendered bounding box (`getBoundingClientRect()` via `.then(($el) => ...)`) falls fully within the viewport's client rect — i.e. nothing clips off any edge at any tested size. This is the direct regression test for bug A (viewport crop) and catches breakpoint-density mistakes that leave content hanging off-canvas.
3. **Screenshot/visual regression — fallback only**, if (1)+(2) can't adequately express a case (e.g. subtle overlap between two visible labels that doesn't trip a bounding-box check). Use Cypress's built-in `cy.screenshot()` + manual baseline review rather than introducing a new visual-diff dependency, unless an existing one is already in the project (check before adding a package).

### C. Deterministic sprinkle positioning (new, tested, documented)

New `src/app/_utils/arc-geometry.ts`:

- `pointOnCubicBezier(p0, p1, p2, p3, t)` — standard cubic Bézier.
- `yearToArcPoint(year, arc)` — maps a project year linearly to `t` across the arc's year domain, returns the point.
- Leader-line/text-anchor offset derived from the computed point via a documented fixed delta, replacing hand-placed `lx/ly/tx/ty`.
- Collision guard against the ERA I/II zone labels and the `IdentityBlock` reserved region, reproducing and fixing the SAFeSEA overlap.
- Unit tested in `arc-geometry.test.ts` (Vitest — pure functions, per project test-framework division), same rigor as `period.ts`'s existing tests.

### D. `featured` flag

No action — already correct (§4 above). Will mention this to avoid duplicate/confusing changes.

### E. Tests

- `CareerArc.spec.cy.tsx` updated for geometry-driven sprinkle rendering.
- New `arc-geometry.test.ts` (Vitest).
- New `CareerArc.responsive.cy.tsx` (Cypress CT) covering the breakpoint matrix from (B) — see test strategy above.

## Implementation record (what actually shipped, after two revisions)

Fix A went through three attempts before landing — recorded here so the reasoning isn't lost. All three were real implementations that were screenshotted, tested, and still had to be thrown out; the first-principles version (attempt 3) is what's live now.

**Attempt 1 — `preserveAspectRatio="xMidYMid meet"`.** Fixed the crop but let the SVG scale uniformly, which on tall/narrow viewports vertically centers the scene with large letterbox gaps — drifted straight into IdentityBlock's independently-positioned text.

**Attempt 2 — aspect-`[1440/900]`-locked inner wrapper, flex document flow.** Tried to eliminate drift by giving the canvas its own fixed-aspect box and stacking it below IdentityBlock in normal flow (`flex-col`, `flex-1`, CSS `container-type:size` + `cqh` units). This genuinely fixed overlap and clipping (verified with a 60-point width×height sweep), but the canvas's height became a function of however much vertical room IdentityBlock's flex sibling left over — on realistic _windowed_ (non-fullscreen) browser sizes, that was short enough to force the aspect-locked box down to a fraction of the available width, producing a small, centered, over-margined diagram. Nicolas's correction: stop computing size from flex content at all.

**Attempt 3 — stretch-fill (final).** Simplified per Nicolas's explicit spec: the canvas frame is `h-screen` (fixed to viewport height at load, same as before either attempt — doesn't change with content reflow) and `w-full` (tracks window width). `CareerArc` fills that frame exactly (`absolute inset-0 h-full w-full`); the SVG uses `preserveAspectRatio="none"` so the 1440×900 scene stretches non-uniformly (independent x/y scale) to cover the frame exactly — no crop, no letterbox, nothing to center or push around. `IdentityBlock` reverted to its original absolute+clamp positioning, a sibling overlay as before. HTML labels (still percentage-positioned, left unchanged from Fix C) now track the non-uniform stretch correctly because `left: x%`/`top: y%` are independently axis-scaled, exactly like `preserveAspectRatio="none"`.

**New collision case this surfaced:** stretching non-uniformly means a viewBox y-fraction maps to very different real pixel values depending on frame _height_ alone (independent of width) — on a short, wide frame a high-y element (e.g. ERA II at y≈324/900) sits comfortably clear of IdentityBlock; on a tall, narrow frame the same y-fraction lands much further down in pixels and collides, since IdentityBlock's own pixel footprint doesn't shrink with frame height. Confirmed empirically this is driven by **aspect ratio, not width** — 1024×768 (1.33) never collides, 768×1024 (0.75) and 390×844 (0.46) both do, at the _same_ 768–1024px width range. Fixed with a single `min-aspect-ratio` CSS condition (`ASPECT_SAFE_CLASS` in `CareerArc.tsx`) gating ERA II's label, the engineering sprinkle's title, and even its bare dot — visible only above a 1.3 aspect ratio. This is a width-independent axis orthogonal to the Fix B density table (which stays purely width-based) — see `CareerArc.responsive.spec.cy.tsx`'s dedicated "aspect-ratio collision guard" block.

**Verification actually performed** (not just claimed): a live `pnpm dev` server driven with Playwright for real-browser screenshots and DOM `getBoundingClientRect()` overlap checks across a dense width×height sweep (390–3440 × 700–1440, ~60 points) plus manual visual review of every screenshot; the full Cypress CT suite (`CareerArc.spec.cy.tsx`, `CareerArc.responsive.spec.cy.tsx` — 57 tests) and the `cypress/e2e/homepage.cy.ts` E2E suite (37 tests, including a real page-composition overlap check between every visible label and `#canvas-identity` across 8 viewport sizes — the one check CT specs structurally cannot do, since they mount `CareerArc` without `IdentityBlock`); Vitest (`arc-geometry.test.ts` + others, 69 tests); `tsc --noEmit`, ESLint, Prettier; `pnpm validate`.

## Follow-up fixes (post-review, 2026-10-23)

Nicolas reviewed the stretch-fill implementation and found five more issues:

1. **Inflection circle rendered as an ellipse** — a direct consequence of `preserveAspectRatio="none"`: a `<circle>`'s geometry gets the same non-uniform x/y stretch as everything else in the SVG. Fixed by moving it out of the SVG entirely into the HTML overlay as `InflectionMarker` — a fixed `h-4 w-4 rounded-full` element, immune to the stretch for the same reason the text labels are (real HTML size, not viewBox-relative). Added a CT test asserting rendered width equals rendered height.
2. **Asymmetric ghost-grid/structural-border verticals** — `GhostGrid` had a line at viewBox x=0 (left) with no mirror at x=1440 (right); `StructuralBorders` had one at x=60 with no mirror at x=1380. Both pre-dated this task (confirmed via `git show` against the pre-session file) but were more visible now that the full scene is never cropped. Added the missing mirrored lines.
3. **Hardcoded "2026"/"31 years"** — `timeline_end`, `arc_label`, and `career_timeline_span` were static strings in `messages/en.json`, so the displayed end-year and years-elapsed count would go stale every January. Now computed in `page.tsx` from `new Date().getFullYear()` and `CAREER_START` (`src/lib/period.ts`), passed into the (now ICU-templated) translation strings as `{years}`/`{start}`/`{end}`. Since the homepage is `force-static` (SSG), this updates on the next deploy rather than live per request — correct, not live-reactive, which is the appropriate tradeoff for a rebuilt-on-deploy portfolio site.
4. **Large empty margin below the arc / bottom not reaching the frame edge** — confirmed via `git show` that the research arc's start point (`M 80,720 ...`) and the `StructuralBorders` bottom line (`y=888`) are unchanged from the pre-session, comp-approved geometry. The ~20% of viewBox height between y=720 (1995/arc origin) and y=900 (frame bottom) has always been empty in the source illustration — it's just now **always fully visible** (stretch-fill never crops), where every previous crop/letterbox mode happened to hide some or all of it. This is a property of the original Bézier geometry, not a regression from this task's changes. **Flagged, not changed** — redesigning the arc's vertical proportions is a design decision outside this bug-fix task's scope; needs Nicolas's call on whether to extend the geometry, trim the viewBox, or treat it as intentional breathing room.
5. **Scroll needed to see the bottom structural line at load** — investigated directly: `document.getElementById('hero').getBoundingClientRect().height` was measured equal to `window.innerHeight` with zero horizontal overflow at 1920×1080, 1440×900, and 1366×768 in a real Chromium/Playwright session — no reproducible discrepancy found. Likely explanation: the screenshot tool used captured OS/browser chrome (tabs, address bar) as part of the image, which eats into the visible content area without that chrome counting toward `window.innerHeight`/`100vh` — CSS has no way to know about it. Could not confirm without Nicolas's exact browser/OS window metrics; **not fixed, needs reproduction steps** if it's a real CSS issue rather than a capture artifact.

Re-verified after fixes 1–3: full Cypress CT (58 tests) + E2E (37 tests) + Vitest (69 tests) + `tsc --noEmit` + ESLint + Prettier + `pnpm validate`, all green.

## Second follow-up round (same day, 2026-10-23) — hand-picked improvements

Item 1 (scroll-to-bottom) confirmed browser-specific (renders correctly in Edge) — dismissed, no further action. Item 4 (dead margin) deferred to a later session by Nicolas's own call.

Four more changes, all re-verified (55 CT + 45 E2E + 84 Vitest + clean `tsc`/ESLint/Prettier/`pnpm validate`):

1. **ERA I and ERA II now always visible, never hidden by breakpoint or aspect ratio.** The aspect-ratio-based hiding system built in the first follow-up round (`ASPECT_SAFE_CLASS`, `min-aspect-ratio` gating) is removed entirely — Nicolas's explicit correction: visibility takes priority over guaranteed non-overlap. Replaced with a static positional nudge (`ENGINEERING_SLOT_0_OFFSET`, ERA II's y-coordinates +40) that _reduces_ but doesn't _guarantee eliminate_ the IdentityBlock collision at extreme aspect ratios (confirmed still touching at 390×844 and 768×1024, both minor). `cypress/e2e/homepage.cy.ts`'s strict "never overlaps" check now explicitly excludes `era-zone-engineering*`/`sprinkle-engineering-0*` testids, with the tradeoff documented inline; a new test asserts both ERA labels are visible at every tested size instead.
2. **Sprinkle subtitle (tag line) breakpoint lowered from `lg` (1024) to `md` (768).** Nicolas's call — there was room earlier than originally set. Applies to both research and engineering sprinkles; the research secondary sprinkle (slot 1) and its subtitle now both land on the same `md` tier.
3. **Calques3D (research slot 0) label nudged clear of the arc.** Added an optional `labelOffset` parameter to `computeSprinkleGeometry`/`sprinkleSlot` (`src/app/_utils/arc-geometry.ts`) — a per-slot escape hatch for a label whose fixed leader-line geometry happens to sit close to the curve at that particular point, without moving the shared leader constants (which would move every slot). `RESEARCH_SLOT_0_OFFSET = { x: 25, y: 28 }`; verified by zoomed screenshot that the label now clears both the thin arc line and the new duration-segment band (see next item) underneath it.
4. **New: duration overlay, addressing "no way to pinpoint the project on the arc."** The sprinkle dot sits at a single `idealYear`, not the picked project's real start/end, making it hard to tell what span of the arc a label actually refers to. Added `splitBezier`/`trimBezier` to `arc-geometry.ts` — `trimBezier` uses two sequential De Casteljau splits to extract the **exact** cubic Bézier sub-curve for an arbitrary `[t0, t1]` range (not a `stroke-dasharray`/`pathLength` approximation, which is only arc-length-accurate for uniform-speed curves, which a Bézier generally isn't). `ArcSprinkleContent` gained `periodStartYear`/`periodEndYear` (computed in `buildSprinkle`, `src/app/_utils/arc-sprinkles.ts`, with an ongoing project's `null` end falling back to `currentYear`, threaded in from `page.tsx`). 9 new Vitest cases for the Bézier-splitting math, 2 for the `buildSprinkle` period-year fallback.

   **Two rendering options were built for an A/B design review, picked via one constant (`DURATION_INDICATOR` in `CareerArc.tsx`):**
   - **Option A — "band"** (`durationSegmentPath`): the sub-curve drawn as a bolder `strokeWidth="6"` stroke directly on the main line. First shipped, then reviewed same-day by Nicolas: the thickness didn't read well against the design. Kept in `arc-geometry.ts`/`CareerArc.tsx`, not deleted, for comparison.
   - **Option B — "echo"** (`durationEchoPath`, **live now**): a secondary `1.5px` line, uniformly translated via the new `translateBezier`, spanning only the project's real period. Matches the project-page timeline's existing convention — `PeriodRuler`'s `ruler-span-bar` is also a span indicator offset from its baseline, not a thickness change to the baseline itself — so the same visual language now holds across the site instead of introducing a second "wide stroke" idiom. Also reuses the uniform-translate simplification CareerArc's own whole-arc echo paths already use, rather than a true per-point curve-normal offset.

   Research slot 0's `labelOffset` (`RESEARCH_SLOT_0_OFFSET`) increased from `{x:20,y:15}` to `{x:25,y:28}` once the band version made the line visually thicker right under the label — left as-is after the echo gap tightened back down (next item), still clears both lines with room to spare.

5. **Echo gap tightened to match PeriodRuler's actual margin.** First pass used `{x:-8,y:-10}` for the echo offset — reviewed same-day: too far from the arc compared to the project-page timeline's own span-indicator gap. Replaced with a single named constant, `DURATION_ECHO_GAP = 5` (viewBox units), applied equally to both axes, documented against the concrete source: `ruler-span-bar`'s `bottom: calc(50% + var(--line-medium) + 3px)` in `src/styles/utilities/index.css` — a 3px real-pixel gap. Not pixel-exact (CareerArc's frame stretches non-uniformly per viewport, so there's no fixed viewBox-unit-to-px ratio — see Fix A), but now one deliberate, documented number instead of two unexplained magic offsets, visually matching the "span indicator sits just above its line" language PeriodRuler already established.

## Status

Implemented and verified for items 1–3 of the original three fixes, plus follow-ups 1–3 above. Follow-ups 4 and 5 are open — see above. Not yet committed — staged for review.
