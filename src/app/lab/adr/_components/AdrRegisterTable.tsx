'use client'

import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'
import type { AdrMeta, AdrStatus } from '@/lib/content/adr'

type AdrRegisterTableProps = {
  adrs: AdrMeta[]
  mostRecentAcceptedNumber: number | null
}

/**
 * AdrRegisterTable — the revision register as a ruled technical table.
 *
 * Client Component — receives filtered adrs from AdrIndexClient.
 *
 * Columns (fixed widths from comp tokens):
 *   NO.    w-col-register-no     right-aligned, tabular figures
 *   TITLE  auto                  body font, ink colour
 *   STATUS w-col-register-status label uppercase
 *   DATE   w-col-register-date   label tabular figures
 *   TAGS   w-col-register-tags   label ghost colour, truncated
 *
 * The most recent accepted ADR row is marked with a red left border
 * and its number rendered in active (compass-arc red). Alternating
 * rows use bg-ground-alt.
 */
export function AdrRegisterTable({ adrs, mostRecentAcceptedNumber }: AdrRegisterTableProps) {
  const t = useTranslations('LabAdr')

  // Type-safe status label map — avoids dynamic key lookup
  const STATUS_LABELS: Record<AdrStatus, string> = {
    accepted: t('status_accepted'),
    proposed: t('status_proposed'),
    deprecated: t('status_deprecated'),
    superseded: t('status_superseded'),
  }

  if (adrs.length === 0) {
    return (
      <p className="py-lg text-center label text-ink-secondary" data-testid="no-results">
        {t('no_results')}
      </p>
    )
  }

  return (
    <table className="w-full table-fixed border-collapse" aria-label={t('register_aria')}>
      <colgroup>
        <col className="w-col-register-no" />
        <col />
        <col className="w-col-register-status" />
        <col className="w-col-register-date" />
        <col className="w-col-register-tags" />
      </colgroup>

      <thead>
        <tr className="border-b-heavy border-ink">
          <th scope="col" className="pr-md pb-sm text-right label font-normal text-ink-secondary">
            {t('col_number')}
          </th>
          <th scope="col" className="pb-sm text-left label font-normal text-ink-secondary">
            {t('col_title')}
          </th>
          <th scope="col" className="pb-sm pl-md text-left label font-normal text-ink-secondary">
            {t('col_status')}
          </th>
          <th scope="col" className="pb-sm pl-md text-left label font-normal text-ink-secondary">
            {t('col_date')}
          </th>
          <th scope="col" className="pb-sm pl-md text-left label font-normal text-ink-secondary">
            {t('col_tags')}
          </th>
        </tr>
      </thead>

      <tbody>
        {adrs.map((adr, i) => {
          const isActive = adr.number === mostRecentAcceptedNumber
          const isEven = i % 2 === 1
          const numLabel = String(adr.number).padStart(3, '0')

          return (
            <tr
              key={adr.slug}
              data-testid={`adr-row-${numLabel}`}
              className={cn(
                'border-b-ghost border-ink-ghost',
                isEven ? 'bg-ground-alt' : 'bg-ground',
                isActive && 'border-l-heavy border-active'
              )}
            >
              {/* NO. */}
              <td
                className={cn(
                  'py-sm pr-md text-right align-middle label text-ink-secondary',
                  isActive && 'text-active'
                )}
              >
                {numLabel}
                {isActive && <span className="sr-only"> — {t('most_recent_label')}</span>}
              </td>

              {/* TITLE */}
              <td className="py-sm align-middle font-body text-caption leading-title text-ink">
                {adr.title}
              </td>

              {/* STATUS */}
              <td className="py-sm pl-md align-middle label text-ink-secondary">
                {STATUS_LABELS[adr.status]}
              </td>

              {/* DATE */}
              <td className="py-sm pl-md align-middle label whitespace-nowrap text-ink-secondary">
                {adr.date}
              </td>

              {/* TAGS */}
              <td className="truncate py-sm pl-md align-middle label text-ink-secondary">
                {adr.tags.join(', ')}
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
