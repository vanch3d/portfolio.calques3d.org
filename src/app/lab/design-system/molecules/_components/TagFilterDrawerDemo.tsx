'use client'

import { useState } from 'react'
import { TagFilterDrawer, type TagWithCount } from '@/components/ui/TagFilterDrawer'

type TagFilterDrawerDemoProps = {
  tags: TagWithCount[]
  initialActiveTags?: string[]
}

export function TagFilterDrawerDemo({ tags, initialActiveTags }: TagFilterDrawerDemoProps) {
  const [activeTags, setActiveTags] = useState<string[]>(initialActiveTags ?? [])

  return <TagFilterDrawer tags={tags} activeTags={activeTags} onTagsChange={setActiveTags} />
}
