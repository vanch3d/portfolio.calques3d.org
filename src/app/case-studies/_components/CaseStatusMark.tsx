/** CaseStatusMark — Client, owns CaseStatusMark.* strings. Renders nothing for published cases. */

'use client'

import { useTranslations } from 'next-intl'
import { Tag } from '@/components/ui/Tag'
import type { CaseStudyStatus } from '@/types/content'

type CaseStatusMarkProps = {
  status: CaseStudyStatus
}

export function CaseStatusMark({ status }: CaseStatusMarkProps) {
  const t = useTranslations('CaseStatusMark')
  if (status !== 'draft') return null
  return <Tag data-testid="case-status-mark">{t('draft')}</Tag>
}
