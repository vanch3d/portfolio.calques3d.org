/** CaseStudiesLead — Client, owns CaseStudiesIndex.* strings. The landing page's ruled lead block around the index text. */

'use client'

import { useTranslations } from 'next-intl'

type CaseStudiesLeadProps = {
  children: React.ReactNode
}

export function CaseStudiesLead({ children }: CaseStudiesLeadProps) {
  const t = useTranslations('CaseStudiesIndex')
  return (
    <header className="mt-lg border-t-heavy border-ink pt-md" data-testid="case-studies-lead">
      <span className="block label">{t('heading')}</span>
      {children}
    </header>
  )
}
