/**
 * ResourceBlockSection — the shared empty-guard-then-heading skeleton used by
 * every resource block (ArtefactsBlock, CaseStudiesBlock, ExternalLinksBlock,
 * GalleryBlock, HighlightsBlock, PublicationsBlock, RepositoryBlock,
 * SlidesBlock). Each caller still owns its own "hidden when empty" guard —
 * that condition differs per block — this only owns the repeated wrapper +
 * label-heading markup.
 */

import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type ResourceBlockSectionProps = {
  as?: 'section' | 'div'
  testId: string
  heading: string
  /** Optional link or control set at the end of the heading rule. */
  action?: ReactNode
  className?: string
  children: ReactNode
}

export function ResourceBlockSection({
  as: Tag = 'section',
  testId,
  heading,
  action,
  children,
  className,
}: ResourceBlockSectionProps) {
  return (
    <Tag data-testid={testId} className={cn(className, 'mb-lg')}>
      {action ? (
        <div className="mb-sm flex items-baseline justify-between border-b-heavy border-ink-ghost">
          <p className="mb-0 label text-ink-secondary">{heading}</p>
          {action}
        </div>
      ) : (
        <p className="mb-sm border-b-heavy border-ink-ghost label text-ink-secondary">{heading}</p>
      )}
      {children}
    </Tag>
  )
}
