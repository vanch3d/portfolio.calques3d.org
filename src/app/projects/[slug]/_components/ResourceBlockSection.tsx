/**
 * ResourceBlockSection — the shared empty-guard-then-heading skeleton used by
 * every resource block (ArtefactsBlock, CaseStudiesBlock, ExternalLinksBlock,
 * GalleryBlock, HighlightsBlock, PublicationsBlock, RepositoryBlock,
 * SlidesBlock). Each caller still owns its own "hidden when empty" guard —
 * that condition differs per block — this only owns the repeated wrapper +
 * label-heading markup.
 */

import type { ReactNode } from 'react'

type ResourceBlockSectionProps = {
  as?: 'section' | 'div'
  testId: string
  heading: string
  children: ReactNode
}

export function ResourceBlockSection({
  as: Tag = 'section',
  testId,
  heading,
  children,
}: ResourceBlockSectionProps) {
  return (
    <Tag data-testid={testId} className="mb-lg">
      <p className="mb-sm label text-ink-ghost">{heading}</p>
      {children}
    </Tag>
  )
}
