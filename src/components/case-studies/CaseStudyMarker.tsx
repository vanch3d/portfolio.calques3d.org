/** CaseStudyMarker — Client, owns CaseStudyMarker.* strings. Passive tag: the project has case studies, with their number. */

'use client'

import { useTranslations } from 'next-intl'
import { Badge } from '@/components/ui/Badge'
import { Tag } from '@/components/ui/Tag'

type CaseStudyMarkerProps = {
  count: number
}

export function CaseStudyMarker({ count }: CaseStudyMarkerProps) {
  const t = useTranslations('CaseStudyMarker')
  return (
    <Tag data-testid="case-study-marker">
      {t('label')}
      <Badge data-testid="case-study-count">{count}</Badge>
    </Tag>
  )
}
