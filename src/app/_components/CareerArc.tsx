/**
 * CareerArc — full-viewport SVG construction drawing.
 *
 * Geometry from approved comp homepage-comp-v4b-r2.html (viewBox 0 0 1440 900).
 * Two ascending Bézier arcs meeting at the 2018 inflection node:
 *   Era I  Research:    M 80,720 C 250,520 780,420 1030,480
 *   Era II Engineering: M 1030,480 C 1090,300 1260,160 1360,120
 *
 * One Red Rule: the inflection circle at (1030,480) is the single --color-active
 * element in the hero canvas. The 2018 tick on the dimension legend is also active
 * — both are part of the same inflection marker, not two separate active elements.
 *
 * The SVG is aria-hidden. Semantic content lives in the sr-only paragraph
 * rendered by the parent section in page.tsx.
 *
 * All colour values reference CSS custom properties — no inline style props,
 * no hardcoded hex values.
 *
 * Sprinkle text (project abbr + period + tags) is data-driven — supplied as
 * props from page.tsx which reads the content layer. SVG geometry for each
 * sprinkle slot is a static design constant kept alongside the arc geometry
 * it annotates.
 *
 * This SVG legend is explicitly exempted from the PeriodRuler/PeriodStrip
 * "local timeline" unification (ADR 021) — it is an illustrative element with
 * hand-placed pixel coordinates matched to this file's bespoke Bézier arc
 * paths; an HTML/CSS ruler component cannot render inside it. This is a
 * permanent, documented exception, not a gap to close later.
 */

/** Content for a single arc sprinkle annotation. */
export type ArcSprinkleContent = {
  /** Line 1: "Project Name · YYYY–YYYY" */
  title: string
  /** Line 2: "Tag1 · Tag2 · Tag3" */
  subtitle: string
}

export type CareerArcProps = {
  /** Label for the career span dimension line — e.g. "CAREER ARC · 31 YEARS" */
  arcLabel: string
  timelineStart: string
  timelineTransition: string
  timelineEnd: string
  /** Project sprinkles for the research arc (2 slots). null = slot left empty. */
  researchSprinkles: Array<ArcSprinkleContent | null>
  /** Project sprinkles for the engineering arc (1 slot). null = slot left empty. */
  engineeringSprinkles: Array<ArcSprinkleContent | null>
}

// Vertical offset between the title and subtitle text lines within a sprinkle.
// Matches the fontSize="9.5" title line at ~1.47 leading. If font size changes,
// update this value to maintain the intended line spacing.
const SPRINKLE_LINE_HEIGHT = 14

// ─── Internal: SVG geometry for sprinkle slots ───────────────────────────────
// These are design constants — positions along the arcs chosen to annotate
// key projects. Not data-driven.

type SprinkleSlot = {
  cx: number
  cy: number
  lx1: number
  ly1: number
  lx2: number
  ly2: number
  tx: number
  ty: number
  align: 'start' | 'end'
}

const RESEARCH_SLOTS: readonly SprinkleSlot[] = [
  // Slot 0 — near arc origin: Calques 3D era
  { cx: 240, cy: 696, lx1: 243, ly1: 696, lx2: 276, ly2: 678, tx: 280, ty: 675, align: 'start' },
  // Slot 1 — mid arc: Learning Analytics era
  { cx: 760, cy: 590, lx1: 763, ly1: 590, lx2: 790, ly2: 572, tx: 794, ty: 570, align: 'start' },
]

const ENGINEERING_SLOTS: readonly SprinkleSlot[] = [
  // Slot 0 — near arc terminus: HiveMQ Edge
  { cx: 1230, cy: 250, lx1: 1227, ly1: 250, lx2: 1196, ly2: 233, tx: 1192, ty: 230, align: 'end' },
]

// ─── Sub-components ───────────────────────────────────────────────────────────

function GhostGrid() {
  return (
    <g data-testid="ghost-grid">
      <line x1="0" y1="300" x2="1440" y2="300" stroke="var(--color-ink-ghost)" strokeWidth="0.5" />
      <line x1="0" y1="600" x2="1440" y2="600" stroke="var(--color-ink-ghost)" strokeWidth="0.5" />
      <line x1="120" y1="0" x2="120" y2="900" stroke="var(--color-ink-ghost)" strokeWidth="0.5" />
      <line x1="720" y1="0" x2="720" y2="900" stroke="var(--color-ink-ghost)" strokeWidth="0.5" />
      <line
        x1="1030"
        y1="0"
        x2="1030"
        y2="900"
        stroke="var(--color-ink-ghost)"
        strokeWidth="0.5"
        strokeDasharray="3 4"
      />
      <line x1="1320" y1="0" x2="1320" y2="900" stroke="var(--color-ink-ghost)" strokeWidth="0.5" />
    </g>
  )
}

function TimelineLegend({
  arcLabel,
  timelineStart,
  timelineTransition,
  timelineEnd,
}: CareerArcProps) {
  return (
    <g data-testid="timeline-legend">
      <text
        x="720"
        y="56"
        fontFamily="var(--font-label)"
        fontSize="10"
        fill="var(--color-ink-ghost)"
        textAnchor="middle"
        letterSpacing="2"
      >
        {arcLabel}
      </text>

      <line x1="80" y1="80" x2="1360" y2="80" stroke="var(--color-ink-secondary)" strokeWidth="1" />

      <line x1="80" y1="72" x2="80" y2="88" stroke="var(--color-ink-secondary)" strokeWidth="1.5" />
      <text
        x="80"
        y="66"
        fontFamily="var(--font-label)"
        fontSize="11"
        fill="var(--color-ink-secondary)"
        textAnchor="middle"
        letterSpacing="1"
      >
        {timelineStart}
      </text>
      <line
        x1="80"
        y1="88"
        x2="80"
        y2="717"
        stroke="var(--color-ink-ghost)"
        strokeWidth="0.5"
        strokeDasharray="3 4"
      />

      <line x1="1030" y1="72" x2="1030" y2="88" stroke="var(--color-active)" strokeWidth="1.5" />
      <text
        x="1030"
        y="66"
        fontFamily="var(--font-label)"
        fontSize="11"
        fill="var(--color-active)"
        textAnchor="middle"
        letterSpacing="1"
      >
        {timelineTransition}
      </text>
      <line
        x1="1030"
        y1="88"
        x2="1030"
        y2="472"
        stroke="var(--color-ink-ghost)"
        strokeWidth="0.5"
        strokeDasharray="3 4"
      />

      <line
        x1="1360"
        y1="72"
        x2="1360"
        y2="88"
        stroke="var(--color-ink-secondary)"
        strokeWidth="1.5"
      />
      <text
        x="1360"
        y="66"
        fontFamily="var(--font-label)"
        fontSize="11"
        fill="var(--color-ink-secondary)"
        textAnchor="middle"
        letterSpacing="1"
      >
        {timelineEnd}
      </text>
      <line
        x1="1360"
        y1="88"
        x2="1360"
        y2="117"
        stroke="var(--color-ink-ghost)"
        strokeWidth="0.5"
        strokeDasharray="3 4"
      />
    </g>
  )
}

function CareerChord() {
  return (
    <g data-testid="career-chord">
      <line
        x1="80"
        y1="720"
        x2="1360"
        y2="120"
        stroke="var(--color-ink-secondary)"
        strokeWidth="1"
        strokeDasharray="6 4"
        opacity="0.5"
      />
      <line
        x1="80"
        y1="710"
        x2="80"
        y2="730"
        stroke="var(--color-ink-secondary)"
        strokeWidth="1.5"
      />
      <line
        x1="1360"
        y1="110"
        x2="1360"
        y2="130"
        stroke="var(--color-ink-secondary)"
        strokeWidth="1.5"
      />
    </g>
  )
}

function Sprinkle({ slot, content }: { slot: SprinkleSlot; content: ArcSprinkleContent }) {
  return (
    <>
      <circle cx={slot.cx} cy={slot.cy} r="3" fill="var(--color-ink-ghost)" stroke="none" />
      <line
        x1={slot.lx1}
        y1={slot.ly1}
        x2={slot.lx2}
        y2={slot.ly2}
        stroke="var(--color-ink-ghost)"
        strokeWidth="0.5"
        strokeDasharray="2 3"
      />
      <text
        x={slot.tx}
        y={slot.ty}
        fontFamily="var(--font-label)"
        fontSize="9.5"
        fill="var(--color-ink-secondary)"
        textAnchor={slot.align}
        letterSpacing="0.5"
      >
        {content.title}
      </text>
      <text
        x={slot.tx}
        y={slot.ty + SPRINKLE_LINE_HEIGHT}
        fontFamily="var(--font-label)"
        fontSize="9"
        fill="var(--color-ink-ghost)"
        textAnchor={slot.align}
        letterSpacing="0.5"
      >
        {content.subtitle}
      </text>
    </>
  )
}

function ResearchArc({ sprinkles }: { sprinkles: Array<ArcSprinkleContent | null> }) {
  return (
    <g data-testid="arc-research">
      <path
        data-testid="arc-research-echo"
        d="M 90,730 C 260,528 790,428 1040,490"
        fill="none"
        stroke="var(--color-ink-ghost)"
        strokeWidth="0.5"
      />
      <path
        data-testid="arc-research-path"
        d="M 80,720 C 250,520 780,420 1030,480"
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth="1.5"
      />

      <text
        x="440"
        y="690"
        fontFamily="var(--font-label)"
        fontSize="10"
        fill="var(--color-ink-ghost)"
        textAnchor="middle"
        letterSpacing="2"
      >
        ERA I
      </text>
      <text
        x="440"
        y="708"
        fontFamily="var(--font-label)"
        fontSize="10"
        fill="var(--color-ink-ghost)"
        textAnchor="middle"
        letterSpacing="1"
      >
        RESEARCH
      </text>
      <text
        x="440"
        y="725"
        fontFamily="var(--font-label)"
        fontSize="10"
        fill="var(--color-ink-ghost)"
        textAnchor="middle"
        letterSpacing="0.5"
      >
        1995–2017
      </text>

      {RESEARCH_SLOTS.map((slot, i) =>
        sprinkles[i] ? <Sprinkle key={i} slot={slot} content={sprinkles[i]} /> : null
      )}
    </g>
  )
}

function EngineeringArc({ sprinkles }: { sprinkles: Array<ArcSprinkleContent | null> }) {
  return (
    <g data-testid="arc-engineering">
      <path
        data-testid="arc-engineering-echo"
        d="M 1040,490 C 1100,308 1270,168 1370,128"
        fill="none"
        stroke="var(--color-ink-ghost)"
        strokeWidth="0.5"
      />
      <path
        data-testid="arc-engineering-path"
        d="M 1030,480 C 1090,300 1260,160 1360,120"
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth="1.5"
      />

      <text
        x="1185"
        y="340"
        fontFamily="var(--font-label)"
        fontSize="10"
        fill="var(--color-ink-ghost)"
        textAnchor="middle"
        letterSpacing="2"
      >
        ERA II
      </text>
      <text
        x="1185"
        y="358"
        fontFamily="var(--font-label)"
        fontSize="10"
        fill="var(--color-ink-ghost)"
        textAnchor="middle"
        letterSpacing="1"
      >
        ENGINEERING
      </text>
      <text
        x="1185"
        y="375"
        fontFamily="var(--font-label)"
        fontSize="10"
        fill="var(--color-ink-ghost)"
        textAnchor="middle"
        letterSpacing="0.5"
      >
        2018–PRESENT
      </text>

      {ENGINEERING_SLOTS.map((slot, i) =>
        sprinkles[i] ? <Sprinkle key={i} slot={slot} content={sprinkles[i]} /> : null
      )}
    </g>
  )
}

function InflectionNode() {
  return (
    <g data-testid="inflection-node">
      <circle
        data-testid="inflection-circle"
        cx="1030"
        cy="480"
        r="8"
        fill="var(--color-ground)"
        stroke="var(--color-active)"
        strokeWidth="2"
      />
      <line
        x1="722"
        y1="886"
        x2="718"
        y2="894"
        stroke="var(--color-ink-secondary)"
        strokeWidth="0.5"
      />
      <line
        x1="718"
        y1="886"
        x2="722"
        y2="894"
        stroke="var(--color-ink-secondary)"
        strokeWidth="0.5"
      />
    </g>
  )
}

function StructuralBorders() {
  return (
    <g data-testid="structural-borders">
      <line x1="60" y1="0" x2="60" y2="900" stroke="var(--color-ink-ghost)" strokeWidth="0.5" />
      <line x1="0" y1="888" x2="1440" y2="888" stroke="var(--color-ink-ghost)" strokeWidth="0.5" />
    </g>
  )
}

export function CareerArc(props: CareerArcProps) {
  return (
    <svg
      className="absolute inset-0 h-full w-full"
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMin slice"
      aria-hidden="true"
      focusable="false"
    >
      <GhostGrid />
      <TimelineLegend {...props} />
      <CareerChord />
      <ResearchArc sprinkles={props.researchSprinkles} />
      <EngineeringArc sprinkles={props.engineeringSprinkles} />
      <InflectionNode />
      <StructuralBorders />
    </svg>
  )
}
