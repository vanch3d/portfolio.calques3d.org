/**
 * CaseSectionHeading — plain sync Server Component
 *
 * Numbered section heading. The number hangs in the page margin on lg and sits
 * above the title below it; it is decoration for sighted readers, so it is
 * hidden from assistive technology.
 */

import { cn } from '@/lib/utils'

type CaseSectionHeadingProps = {
  tag: 'h2' | 'h3'
  size: 'section' | 'subsection'
  number: string
  children: React.ReactNode
}

export function CaseSectionHeading({ tag: Tag, size, number, children }: CaseSectionHeadingProps) {
  return (
    <Tag
      className={cn(
        'relative max-w-prose font-body font-medium text-ink not-italic',
        size === 'section'
          ? 'mt-xl mb-md text-title leading-title'
          : 'mt-lg mb-sm text-body leading-body'
      )}
    >
      <span
        aria-hidden="true"
        className="mb-xs block label lg:absolute lg:top-xs lg:-left-lg lg:mb-0"
      >
        {number}
      </span>
      {children}
    </Tag>
  )
}
