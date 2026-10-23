// CareerArc — construction-drawing hero canvas. Geometry from approved comp
// homepage-comp-v4b-r2.html (viewBox 0 0 1440 900). Architecture history and
// rationale: .docs/tasks/2026-10-23-career-arc-fixes.md.

import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import {
  RESEARCH_ARC,
  ENGINEERING_ARC,
  RESEARCH_SPRINKLE_YEARS,
  ENGINEERING_SPRINKLE_YEARS,
  sprinkleSlot,
  durationSegmentPath,
  durationEchoPath,
  SPRINKLE_LINE_HEIGHT,
} from '@/app/_utils/arc-geometry'
import type { SprinkleGeometry, ArcDefinition } from '@/app/_utils/arc-geometry'

export type ArcSprinkleContent = {
  title: string
  subtitle: string
  periodStartYear: number
  periodEndYear: number
}

export type CareerArcProps = {
  arcLabel: string
  timelineStart: string
  timelineTransition: string
  timelineEnd: string
  researchSprinkles: Array<ArcSprinkleContent | null>
  engineeringSprinkles: Array<ArcSprinkleContent | null>
}

const VIEWBOX_WIDTH = 1440
const VIEWBOX_HEIGHT = 900

// Nudges a label off the curve it sits near — never moves the dot itself.
const RESEARCH_SLOT_0_OFFSET = { x: 25, y: 28 }
const ENGINEERING_SLOT_0_OFFSET = { x: 0, y: 40 }

const RESEARCH_SLOTS: readonly SprinkleGeometry[] = RESEARCH_SPRINKLE_YEARS.map((year, i) =>
  sprinkleSlot(year, RESEARCH_ARC, 'start', i === 0 ? RESEARCH_SLOT_0_OFFSET : undefined)
)

const ENGINEERING_SLOTS: readonly SprinkleGeometry[] = ENGINEERING_SPRINKLE_YEARS.map((year, i) =>
  sprinkleSlot(year, ENGINEERING_ARC, 'end', i === 0 ? ENGINEERING_SLOT_0_OFFSET : undefined)
)

type LabelAnchor = 'start' | 'middle' | 'end'

function arcPercent(value: number, axisMax: number): string {
  return `${(value / axisMax) * 100}%`
}

type ArcLabelProps = {
  x: number
  y: number
  anchor?: LabelAnchor
  testId?: string
  className?: string
  children: ReactNode
}

function ArcLabel({ x, y, anchor = 'start', testId, className, children }: ArcLabelProps) {
  const translateX = anchor === 'middle' ? '-50%' : anchor === 'end' ? '-100%' : '0%'
  return (
    <span
      data-testid={testId}
      className={cn('absolute font-label tracking-label whitespace-nowrap', className)}
      style={{
        left: arcPercent(x, VIEWBOX_WIDTH),
        top: arcPercent(y, VIEWBOX_HEIGHT),
        transform: `translate(${translateX}, -100%)`,
      }}
    >
      {children}
    </span>
  )
}

function GhostGrid() {
  return (
    <g data-testid="ghost-grid" className="hidden sm:block">
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
      <line x1="1440" y1="0" x2="1440" y2="900" stroke="var(--color-ink-ghost)" strokeWidth="0.5" />
    </g>
  )
}

function TimelineLegendMarks() {
  return (
    <g data-testid="timeline-legend">
      <line x1="80" y1="80" x2="1360" y2="80" stroke="var(--color-ink-secondary)" strokeWidth="1" />
      <line x1="80" y1="72" x2="80" y2="88" stroke="var(--color-ink-secondary)" strokeWidth="1.5" />
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

function TimelineLegendLabels({
  arcLabel,
  timelineStart,
  timelineTransition,
  timelineEnd,
}: CareerArcProps) {
  return (
    <>
      <ArcLabel
        x={720}
        y={50}
        anchor="middle"
        testId="timeline-legend-arc-label"
        className="hidden text-micro text-ink-ghost sm:block"
      >
        {arcLabel}
      </ArcLabel>
      <ArcLabel
        x={80}
        y={62}
        anchor="middle"
        testId="timeline-legend-start"
        className="text-label text-ink-secondary"
      >
        {timelineStart}
      </ArcLabel>
      <ArcLabel
        x={1030}
        y={62}
        anchor="middle"
        testId="timeline-legend-transition"
        className="text-label text-active"
      >
        {timelineTransition}
      </ArcLabel>
      <ArcLabel
        x={1360}
        y={62}
        anchor="middle"
        testId="timeline-legend-end"
        className="text-label text-ink-secondary"
      >
        {timelineEnd}
      </ArcLabel>
    </>
  )
}

function CareerChord() {
  return (
    <g data-testid="career-chord" className="hidden sm:block">
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

type SprinkleDotProps = {
  slot: SprinkleGeometry
  testId: string
  className?: string
}

function SprinkleDot({ slot, testId, className }: SprinkleDotProps) {
  return (
    <g data-testid={testId} className={className}>
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
    </g>
  )
}

// A/B under design review — see .docs/tasks/2026-10-23-career-arc-fixes.md.
// 'band': bolder stroke on the main line. 'echo': secondary line offset
// above it (matches PeriodRuler's ruler-span-bar convention). 'echo' is live.
const DURATION_INDICATOR: 'band' | 'echo' = 'echo'

// PeriodRuler's `ruler-span-bar` utility sits 3px above its baseline
// (src/styles/utilities/index.css) — a span indicator reads as "just above
// its line", not a separate, far-off line. Matched here in viewBox units (not
// 1:1 with real px, since the frame stretches non-uniformly — see Fix A) so
// both surfaces use the same small-gap language instead of two different
// distances.
const DURATION_ECHO_GAP = 5
const DURATION_ECHO_OFFSET = { x: -DURATION_ECHO_GAP, y: -DURATION_ECHO_GAP }

type DurationIndicatorProps = {
  arc: ArcDefinition
  content: ArcSprinkleContent
  testId: string
  className?: string
}

function DurationIndicator({ arc, content, testId, className }: DurationIndicatorProps) {
  if (DURATION_INDICATOR === 'band') {
    const d = durationSegmentPath(arc, content.periodStartYear, content.periodEndYear)
    if (!d) return null
    return (
      <path
        data-testid={testId}
        className={className}
        d={d}
        fill="none"
        stroke="var(--color-ink-ghost)"
        strokeWidth="6"
        strokeLinecap="round"
      />
    )
  }

  const d = durationEchoPath(
    arc,
    content.periodStartYear,
    content.periodEndYear,
    DURATION_ECHO_OFFSET
  )
  if (!d) return null
  return (
    <path
      data-testid={testId}
      className={className}
      d={d}
      fill="none"
      stroke="var(--color-ink-secondary)"
      strokeWidth="1.5"
    />
  )
}

type SprinkleLabelsProps = {
  slot: SprinkleGeometry
  content: ArcSprinkleContent
  testId: string
  titleClassName?: string
  subtitleClassName?: string
}

function SprinkleLabels({
  slot,
  content,
  testId,
  titleClassName,
  subtitleClassName,
}: SprinkleLabelsProps) {
  return (
    <>
      <ArcLabel
        x={slot.tx}
        y={slot.ty}
        anchor={slot.align}
        testId={`${testId}-title`}
        className={cn('text-micro text-ink-secondary', titleClassName)}
      >
        {content.title}
      </ArcLabel>
      <ArcLabel
        x={slot.tx}
        y={slot.ty + SPRINKLE_LINE_HEIGHT}
        anchor={slot.align}
        testId={`${testId}-subtitle`}
        className={cn('text-micro text-ink-ghost', subtitleClassName)}
      >
        {content.subtitle}
      </ArcLabel>
    </>
  )
}

type ArcGeometryProps = { sprinkles: Array<ArcSprinkleContent | null> }

function ResearchArcGeometry({ sprinkles }: ArcGeometryProps) {
  return (
    <g data-testid="arc-research">
      {RESEARCH_SLOTS.map((_slot, i) =>
        sprinkles[i] ? (
          <DurationIndicator
            key={i}
            arc={RESEARCH_ARC}
            content={sprinkles[i]}
            testId={`sprinkle-research-${i}-duration`}
            className={i === 1 ? 'hidden md:block' : undefined}
          />
        ) : null
      )}

      <path
        data-testid="arc-research-echo"
        className="hidden sm:block"
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

      {RESEARCH_SLOTS.map((slot, i) =>
        sprinkles[i] ? (
          <SprinkleDot
            key={i}
            slot={slot}
            testId={`sprinkle-research-${i}`}
            className={i === 1 ? 'hidden md:block' : undefined}
          />
        ) : null
      )}
    </g>
  )
}

function EngineeringArcGeometry({ sprinkles }: ArcGeometryProps) {
  return (
    <g data-testid="arc-engineering">
      {ENGINEERING_SLOTS.map((_slot, i) =>
        sprinkles[i] ? (
          <DurationIndicator
            key={i}
            arc={ENGINEERING_ARC}
            content={sprinkles[i]}
            testId={`sprinkle-engineering-${i}-duration`}
          />
        ) : null
      )}

      <path
        data-testid="arc-engineering-echo"
        className="hidden sm:block"
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

      {ENGINEERING_SLOTS.map((slot, i) =>
        sprinkles[i] ? (
          <SprinkleDot key={i} slot={slot} testId={`sprinkle-engineering-${i}`} />
        ) : null
      )}
    </g>
  )
}

function EraZoneResearchLabels() {
  return (
    <>
      <ArcLabel
        x={440}
        y={674}
        anchor="middle"
        testId="era-zone-research"
        className="text-micro text-ink-ghost"
      >
        ERA I
      </ArcLabel>
      <ArcLabel x={440} y={692} anchor="middle" className="text-micro text-ink-ghost">
        RESEARCH
      </ArcLabel>
      <ArcLabel
        x={440}
        y={709}
        anchor="middle"
        testId="era-zone-research-years"
        className="hidden text-micro text-ink-ghost sm:block"
      >
        1995–2017
      </ArcLabel>
    </>
  )
}

function EraZoneEngineeringLabels() {
  return (
    <>
      <ArcLabel
        x={1185}
        y={364}
        anchor="middle"
        testId="era-zone-engineering"
        className="text-micro text-ink-ghost"
      >
        ERA II
      </ArcLabel>
      <ArcLabel x={1185} y={382} anchor="middle" className="text-micro text-ink-ghost">
        ENGINEERING
      </ArcLabel>
      <ArcLabel
        x={1185}
        y={399}
        anchor="middle"
        testId="era-zone-engineering-years"
        className="hidden text-micro text-ink-ghost sm:block"
      >
        2018–PRESENT
      </ArcLabel>
    </>
  )
}

// HTML, not SVG — preserveAspectRatio="none" would stretch an SVG <circle> into an ellipse.
function InflectionMarker() {
  return (
    <span
      data-testid="inflection-circle"
      className="absolute block h-4 w-4 rounded-full border-heavy border-active bg-ground"
      style={{
        left: arcPercent(1030, VIEWBOX_WIDTH),
        top: arcPercent(480, VIEWBOX_HEIGHT),
        transform: 'translate(-50%, -50%)',
      }}
    />
  )
}

function InflectionNode() {
  return (
    <g data-testid="inflection-node">
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
    <g data-testid="structural-borders" className="hidden sm:block">
      <line x1="60" y1="0" x2="60" y2="900" stroke="var(--color-ink-ghost)" strokeWidth="0.5" />
      <line x1="1380" y1="0" x2="1380" y2="900" stroke="var(--color-ink-ghost)" strokeWidth="0.5" />
      <line x1="0" y1="888" x2="1440" y2="888" stroke="var(--color-ink-ghost)" strokeWidth="0.5" />
    </g>
  )
}

export function CareerArc(props: CareerArcProps) {
  const { researchSprinkles, engineeringSprinkles } = props

  return (
    <div data-testid="career-arc-canvas" className="absolute inset-0 h-full w-full">
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1440 900"
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
      >
        <GhostGrid />
        <TimelineLegendMarks />
        <CareerChord />
        <ResearchArcGeometry sprinkles={researchSprinkles} />
        <EngineeringArcGeometry sprinkles={engineeringSprinkles} />
        <InflectionNode />
        <StructuralBorders />
      </svg>

      <div
        data-testid="career-arc-labels"
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <InflectionMarker />
        <TimelineLegendLabels {...props} />

        <EraZoneResearchLabels />
        {RESEARCH_SLOTS.map((slot, i) =>
          researchSprinkles[i] ? (
            <SprinkleLabels
              key={i}
              slot={slot}
              content={researchSprinkles[i]}
              testId={`sprinkle-research-${i}`}
              titleClassName={i === 1 ? 'hidden md:block' : undefined}
              subtitleClassName="hidden md:block"
            />
          ) : null
        )}

        <EraZoneEngineeringLabels />
        {ENGINEERING_SLOTS.map((slot, i) =>
          engineeringSprinkles[i] ? (
            <SprinkleLabels
              key={i}
              slot={slot}
              content={engineeringSprinkles[i]}
              testId={`sprinkle-engineering-${i}`}
              subtitleClassName="hidden md:block"
            />
          ) : null
        )}
      </div>
    </div>
  )
}
