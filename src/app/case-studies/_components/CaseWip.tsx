/** CaseWip — Client, owns CaseWip.* strings. Work-in-progress block for provisional passages. */

'use client'

import { useTranslations } from 'next-intl'

type CaseWipProps = {
  text: string
}

export function CaseWip({ text }: CaseWipProps) {
  const t = useTranslations('CaseWip')
  return (
    <div
      role="note"
      className="my-lg max-w-prose border-medium border-dashed border-ink-secondary p-md"
      data-testid="case-wip"
    >
      <span className="mb-sm block label text-ink">{t('label')}</span>
      {text ? <p className="mb-0 text-caption leading-label text-ink-secondary">{text}</p> : null}
    </div>
  )
}
