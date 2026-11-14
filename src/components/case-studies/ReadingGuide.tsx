/** ReadingGuide — Client, owns ReadingGuide.* strings. The hub's margin note, supplied by the index body. */

'use client'

import { useTranslations } from 'next-intl'
import { Aside } from './Aside'

type ReadingGuideProps = {
  children: React.ReactNode
}

export function ReadingGuide({ children }: ReadingGuideProps) {
  const t = useTranslations('ReadingGuide')
  return <Aside label={t('label')}>{children}</Aside>
}
