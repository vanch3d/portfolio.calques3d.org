/**
 * ClassificationHeader — Client, needs ProjectDetail.* strings
 *
 * Full-width band: era label + type/primary line on the left, period strip
 * + status stamp on the right. Per the One Red Rule, only an `ongoing`
 * project's status stamp and period-strip end tick take the active colour —
 * everything else stays graphite.
 */

'use client'

import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'
import { PeriodStrip } from '@/components/ui/PeriodStrip'
import type { ProjectType, ProjectStatus } from '@/types/content'

type ClassificationHeaderProps = {
  type: ProjectType
  status: ProjectStatus
  primary?: boolean
  period: { start: number; end: number }
  contextLabel: string
}

export function ClassificationHeader({
  type,
  status,
  primary = false,
  period,
  contextLabel,
}: ClassificationHeaderProps) {
  const t = useTranslations('ProjectDetail')
  const ongoing = status === 'ongoing'

  const eraLabel = type === 'research' ? t('era_research_label') : t('era_engineering_label')
  const typeLabel = type === 'research' ? t('type_research') : t('type_engineering')
  const statusLabel = t(`status_${status}`)

  return (
    <header
      data-testid="classification-header"
      className="flex flex-col items-start justify-between gap-md border-t-heavy border-ink pt-lg sm:flex-row sm:items-center"
    >
      <div className="flex flex-col gap-xs">
        <span className="label">{eraLabel}</span>
        <span className="label text-ink-ghost" data-testid="type-line">
          {typeLabel}
          {primary && ` · ${t('primary_suffix')}`}
        </span>
      </div>

      <div className="flex items-center gap-lg">
        <PeriodStrip domain={period} ongoing={ongoing} contextLabel={contextLabel} />
        <span
          data-testid="status-stamp"
          className={cn(
            'border-medium px-sm py-xs label',
            ongoing ? 'border-active text-active' : 'border-ink-ghost text-ink-ghost'
          )}
        >
          {statusLabel}
        </span>
      </div>
    </header>
  )
}
