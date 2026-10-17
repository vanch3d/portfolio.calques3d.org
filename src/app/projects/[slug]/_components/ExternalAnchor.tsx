/**
 * ExternalAnchor — shared `target="_blank" rel="noopener noreferrer"` link
 * markup duplicated across ArtefactsBlock, RepositoryBlock, ExternalLinksBlock
 * (live + external variants), and SlidesBlock. Callers pass the colour class
 * (e.g. `text-ink-secondary`, `text-active`) since that varies per use.
 */

import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type ExternalAnchorProps = {
  href: string
  className?: string
  children: ReactNode
}

export function ExternalAnchor({ href, className, children }: ExternalAnchorProps) {
  return (
    <a
      href={href}
      className={cn('label nav-link hover:text-ink', className)}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  )
}
