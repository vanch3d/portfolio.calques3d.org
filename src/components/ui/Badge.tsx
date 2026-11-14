/**
 * Badge — small filled count chip, for a number that qualifies a Tag.
 *
 * Same styling as the count chip inside TagFilterDrawer's tags (not yet
 * refactored to use this component, see
 * .docs/issues/case-studies-surface/02-generalise-tag-and-badge.md).
 */

import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

type BadgeProps = HTMLAttributes<HTMLSpanElement>

export function Badge({ className, ...rest }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center bg-ink-secondary font-label text-ground tabular-nums',
        'h-badge-sm min-w-badge-sm px-badge-pad-sm py-0 text-badge-sm',
        className
      )}
      {...rest}
    />
  )
}
