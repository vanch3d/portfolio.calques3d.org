/**
 * Tag — framed micro-label for a category or content type (project tags, "Case studies").
 *
 * Passive: never interactive. The ghost frame separates it from the surrounding
 * row text; the type size is the smallest token (--text-label), which is also
 * the accessibility floor. May hold a Badge (a count) as a child.
 */

import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

type TagProps = HTMLAttributes<HTMLSpanElement>

export function Tag({ className, ...rest }: TagProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-xs border-ghost border-ink-ghost px-xs py-2xs label whitespace-nowrap',
        className
      )}
      {...rest}
    />
  )
}
