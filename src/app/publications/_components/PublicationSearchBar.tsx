'use client'

import { useTranslations } from 'next-intl'
import { TagFilterDrawer } from '@/components/ui/TagFilterDrawer'
import type { Publication } from '@/types/content'
import { getPublicationTags } from '@/app/publications/_utils/tags'
import { cn } from '@/lib/utils'

type PublicationSearchBarProps = {
  className?: string
  publications: Publication[]
  activeTags: string[]
  onTagsChange: (newTags: string[]) => void
}

function PublicationSearchBar({
  className,
  publications,
  activeTags,
  onTagsChange,
}: PublicationSearchBarProps) {
  const t = useTranslations('Publications')
  const tags = getPublicationTags(publications)
  return (
    <search aria-label={t('search_bar_aria')} className={cn(className)}>
      <TagFilterDrawer tags={tags} activeTags={activeTags} onTagsChange={onTagsChange} />
    </search>
  )
}

export default PublicationSearchBar
