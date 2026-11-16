/**
 * ResourceBlockSection — the shared empty-guard-then-heading skeleton used by
 * every resource block (ArtefactsBlock, CaseStudiesBlock, ExternalLinksBlock,
 * GalleryBlock, HighlightsBlock, PublicationsBlock, RepositoryBlock,
 * SlidesBlock). Each caller still owns its own "hidden when empty" guard —
 * that condition differs per block — this only owns the repeated wrapper +
 * label-heading markup.
 *
 * The label is a real `h2` (the page title is the `h1`), styled as a label.
 * A `section` is named by it via `aria-labelledby`; the `div` variant is not a
 * landmark, so it carries no label reference.
 */

import { useId } from 'react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { SectionLabel } from '@/components/ui/SectionLabel'

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
  const headingId = useId()
  const labelledBy = Tag === 'section' ? headingId : undefined

  return (
    <Tag data-testid={testId} aria-labelledby={labelledBy} className={cn(className, 'mb-lg')}>
      {action ? (
        <div className="mb-sm flex items-baseline justify-between border-b-heavy border-ink-ghost">
          <SectionLabel as="h2" id={headingId} className="mb-0">
            {heading}
          </SectionLabel>
          {action}
        </div>
      ) : (
        <SectionLabel as="h2" id={headingId} className="mb-sm border-b-heavy border-ink-ghost">
          {heading}
        </SectionLabel>
      )}
      {children}
    </Tag>
  )
}
