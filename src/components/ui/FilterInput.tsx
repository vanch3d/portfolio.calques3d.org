'use client'

/**
 * FilterInput — a labelled text input with an optional leading add-on.
 *
 * Design:
 *   - Default: medium-weight border in ghost colour — 1px is always visible
 *     on any display. Ghost-weight (0.5px) borders round to zero on 1× screens.
 *   - Focus-within: border colour shifts to active (compass-arc red), matching
 *     the system focus ring colour. Weight stays constant (no layout shift).
 *     The whole container reacts, not just the inner <input> caret.
 *   - Behaviour encapsulated in the `filter-input` utility (see utilities/index.css)
 *     so it is not fragmented across cn() and variant prefixes.
 *   - The startAddon slot accepts text glyphs or small icons. It is
 *     `select-none` and `aria-hidden` — purely decorative.
 *
 * The component is unsized. Width is controlled by the parent layout.
 */

import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

type FilterInputProps = {
  value: string
  onChange: (value: string) => void
  placeholder: string
  ariaLabel: string
  startAddon?: ReactNode
  className?: string
}

export function FilterInput({
  value,
  onChange,
  placeholder,
  ariaLabel,
  startAddon,
  className,
}: FilterInputProps) {
  return (
    <div
      className={cn('flex items-center gap-xs filter-input px-sm py-xs', className)}
      data-testid="filter-input"
    >
      {startAddon !== undefined && (
        <span className="label leading-none text-ink-ghost select-none" aria-hidden="true">
          {startAddon}
        </span>
      )}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel}
        className="min-w-0 flex-1 border-none bg-transparent label text-ink-secondary outline-none placeholder:text-ink-ghost focus:outline-none"
        spellCheck={false}
      />
    </div>
  )
}
