import { getTranslations } from 'next-intl/server'

type AdrRegisterHeaderProps = {
  adrCount: number
  insightCount: number
  asOf: string
  minNumber: number
  maxNumber: number
}

/**
 * AdrRegisterHeader — the blueprint-style title block for the ADR register.
 *
 * Three-column layout flanked by heavy borders (the "ruled sheet" frame):
 *   Left:   "ARCHITECTURE / DECISION RECORDS" in label type
 *   Centre: h1 in display italic
 *   Right:  RECORDS: N / INSIGHTS: N / AS OF: DATE in label type (right-aligned)
 *
 * Below: a dimension line (ghost rule) with tick marks at the first and last
 * ADR numbers — a technical-drawing annotation of the register's span.
 */
export async function AdrRegisterHeader({
  adrCount,
  insightCount,
  asOf,
  minNumber,
  maxNumber,
}: AdrRegisterHeaderProps) {
  const t = await getTranslations('LabAdr')

  const minLabel = String(minNumber).padStart(3, '0')
  const maxLabel = String(maxNumber).padStart(3, '0')

  return (
    <>
      {/* ── 3-column title block ──────────────────────────────── */}
      <div className="grid grid-cols-centred-header items-center gap-lg border-t-heavy border-b-heavy border-ink py-md">
        {/* Left: document type label */}
        <div className="label leading-body">
          Architecture
          <br />
          Decision Records
        </div>

        {/* Centre: register title */}
        <h1 className="text-center font-display text-title leading-title whitespace-nowrap text-ink italic">
          {t('register_subtitle')}
        </h1>

        {/* Right: counters */}
        <div className="text-right label leading-body">
          <span className="block" data-testid="counter-records">
            {t('records_count', { count: adrCount })}
          </span>
          <span className="block" data-testid="counter-insights">
            {t('insights_count', { count: insightCount })}
          </span>
          <span className="block" data-testid="counter-as-of">
            {t('as_of', { date: asOf })}
          </span>
        </div>
      </div>

      {/* ── Dimension line ────────────────────────────────────── */}
      <div
        className="relative my-md flex h-lg items-center"
        aria-hidden="true"
        data-testid="dimension-line"
      >
        {/* Ghost rule */}
        <div className="absolute inset-x-0 top-1/2 border-t-ghost border-ink-ghost" />

        {/* Tick — start */}
        <div className="absolute top-1/2 left-0 flex -translate-y-1/2 flex-col items-center">
          <div className="h-sm border-l-medium border-ink-ghost" />
          <span className="mt-xs label text-ink-ghost">{minLabel}</span>
        </div>

        {/* Tick — end */}
        <div className="absolute top-1/2 right-0 flex -translate-y-1/2 flex-col items-center">
          <div className="h-sm border-l-medium border-ink-ghost" />
          <span className="mt-xs label text-ink-ghost">{maxLabel}</span>
        </div>
      </div>
    </>
  )
}
