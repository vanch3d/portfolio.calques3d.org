/**
 * CareerArc — full-viewport SVG construction drawing.
 *
 * Geometry derived from the approved comp (homepage-comp-v1.html, 1440×900 viewBox).
 * All color values reference CSS custom properties via var() on SVG presentation
 * attributes — no inline style props, no hardcoded hex values.
 *
 * One Red Rule: the 2018 inflection tick on the dimension line is the single
 * active element. Everything else is ink/ink-secondary/ink-ghost.
 *
 * The SVG is aria-hidden. Semantic content (name, era labels, dates) lives in
 * the IdentityBlock and EraBlock components above the SVG in the DOM.
 */

type CareerArcProps = {
  /** Label for the career span dimension line — e.g. "CAREER ARC · 31 YEARS" */
  arcLabel: string;
  timelineStart: string;
  timelineTransition: string;
  timelineEnd: string;
};

export function CareerArc({
  arcLabel,
  timelineStart,
  timelineTransition,
  timelineEnd,
}: CareerArcProps) {
  return (
    <svg
      className="absolute inset-0 w-full h-full"
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      {/* ── Ghost grid ────────────────────────────────────────────────── */}
      <line x1="0"    y1="300" x2="1440" y2="300" stroke="var(--color-ink-ghost)" strokeWidth="0.5" />
      <line x1="0"    y1="500" x2="1440" y2="500" stroke="var(--color-ink-ghost)" strokeWidth="0.5" />
      <line x1="0"    y1="700" x2="1440" y2="700" stroke="var(--color-ink-ghost)" strokeWidth="0.5" />
      <line x1="120"  y1="0"   x2="120"  y2="900" stroke="var(--color-ink-ghost)" strokeWidth="0.5" />
      <line x1="720"  y1="0"   x2="720"  y2="900" stroke="var(--color-ink-ghost)" strokeWidth="0.5" />
      <line x1="1320" y1="0"   x2="1320" y2="900" stroke="var(--color-ink-ghost)" strokeWidth="0.5" />

      {/* ── Main compass arc: 1995 → 2026 ─────────────────────────────── */}
      <path
        d="M 80,820 A 1380,1380 0 0,1 1360,820"
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth="1.5"
      />

      {/* Compass centre cross (implied below viewport) */}
      <line x1="720" y1="860" x2="720" y2="880" stroke="var(--color-ink-secondary)" strokeWidth="1" />
      <line x1="710" y1="870" x2="730" y2="870" stroke="var(--color-ink-secondary)" strokeWidth="1" />

      {/* ── Dimension line: career span ────────────────────────────────── */}
      {/* Horizontal span at y=148 */}
      <line x1="80"   y1="148" x2="1360" y2="148" stroke="var(--color-ink-secondary)" strokeWidth="1" />
      {/* Terminal ticks */}
      <line x1="80"   y1="140" x2="80"   y2="156" stroke="var(--color-ink-secondary)" strokeWidth="1.5" />
      <line x1="1360" y1="140" x2="1360" y2="156" stroke="var(--color-ink-secondary)" strokeWidth="1.5" />
      {/* Dashed leader lines from arc endpoints up to dimension line */}
      <line x1="80"   y1="820" x2="80"   y2="156" stroke="var(--color-ink-ghost)" strokeWidth="0.5" strokeDasharray="4 4" />
      <line x1="1360" y1="820" x2="1360" y2="156" stroke="var(--color-ink-ghost)" strokeWidth="0.5" strokeDasharray="4 4" />

      {/* Year labels */}
      <text x="80"   y="132" fontFamily="var(--font-label)" fontSize="11" fill="var(--color-ink-secondary)" textAnchor="middle" letterSpacing="1">
        {timelineStart}
      </text>
      <text x="1360" y="132" fontFamily="var(--font-label)" fontSize="11" fill="var(--color-ink-secondary)" textAnchor="middle" letterSpacing="1">
        {timelineEnd}
      </text>

      {/* Arc span label centred above arc */}
      <text x="720" y="116" fontFamily="var(--font-label)" fontSize="10" fill="var(--color-ink-ghost)" textAnchor="middle" letterSpacing="2">
        {arcLabel}
      </text>

      {/* ── Era inflection at 2018 (x≈1030, y≈154) ───────────────────── */}
      {/* Dashed drop line from arc to bottom */}
      <line x1="1030" y1="154" x2="1030" y2="820" stroke="var(--color-ink-ghost)" strokeWidth="0.5" strokeDasharray="3 5" />
      {/* Inflection node on arc */}
      <circle cx="1030" cy="154" r="4" fill="var(--color-ground)" stroke="var(--color-ink)" strokeWidth="1.5" />

      {/* ── Era zone labels ────────────────────────────────────────────── */}
      <text x="555" y="420" fontFamily="var(--font-label)" fontSize="11" fill="var(--color-ink-ghost)" textAnchor="middle" letterSpacing="2">ERA I</text>
      <text x="555" y="438" fontFamily="var(--font-label)" fontSize="11" fill="var(--color-ink-ghost)" textAnchor="middle" letterSpacing="1">RESEARCH</text>
      <text x="555" y="456" fontFamily="var(--font-label)" fontSize="10" fill="var(--color-ink-ghost)" textAnchor="middle" letterSpacing="1">1995–2017</text>

      <text x="1195" y="320" fontFamily="var(--font-label)" fontSize="11" fill="var(--color-ink-ghost)" textAnchor="middle" letterSpacing="2">ERA II</text>
      <text x="1195" y="338" fontFamily="var(--font-label)" fontSize="11" fill="var(--color-ink-ghost)" textAnchor="middle" letterSpacing="1">ENGINEERING</text>
      <text x="1195" y="356" fontFamily="var(--font-label)" fontSize="10" fill="var(--color-ink-ghost)" textAnchor="middle" letterSpacing="1">2018–PRESENT</text>

      {/* ── One Red Rule: 2018 tick on dimension line ──────────────────── */}
      <line x1="1030" y1="140" x2="1030" y2="148" stroke="var(--color-active)" strokeWidth="1.5" />
      <text x="1030" y="132" fontFamily="var(--font-label)" fontSize="11" fill="var(--color-active)" textAnchor="middle" letterSpacing="1">
        {timelineTransition}
      </text>

      {/* ── Structural borders ─────────────────────────────────────────── */}
      {/* Left margin rule */}
      <line x1="60" y1="0"   x2="60"   y2="900" stroke="var(--color-ink-ghost)" strokeWidth="0.5" />
      {/* Bottom drawing border */}
      <line x1="0"  y1="888" x2="1440" y2="888" stroke="var(--color-ink-ghost)" strokeWidth="0.5" />
    </svg>
  );
}
