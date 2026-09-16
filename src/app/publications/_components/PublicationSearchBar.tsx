'use client'

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
  const tags = getPublicationTags(publications)
  return (
    <search aria-label="Site search and filters" className={cn(className)}>
      <TagFilterDrawer tags={tags} activeTags={activeTags} onTagsChange={onTagsChange} />
    </search>
  )
}

export default PublicationSearchBar
