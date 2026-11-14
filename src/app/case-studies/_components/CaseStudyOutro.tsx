/** CaseStudyOutro — Client, owns CaseStudyOutro.* strings. The hub's closing block; target of the rail's END node. */

'use client'

import { useTranslations } from 'next-intl'

type CaseStudyOutroProps = {
  children: React.ReactNode
}

export function CaseStudyOutro({ children }: CaseStudyOutroProps) {
  const t = useTranslations('CaseStudyOutro')
  return (
    <section
      id="closing"
      aria-label={t('label')}
      className="mt-xl max-w-prose border-t-medium border-ink-ghost pt-md"
      data-testid="case-outro"
    >
      <span className="mb-sm block label">{t('label')}</span>
      {children}
    </section>
  )
}
