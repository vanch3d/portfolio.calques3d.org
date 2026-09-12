import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

// Custom tailwind-merge instance aware of project-specific font-size tokens.
// Without this, twMerge groups all text-* classes together (color + size) and
// removes earlier ones when a later text-* class appears. The text-tag-w* scale
// (font-size tokens for the tag cloud) and the text-badge/text-micro sub-label
// sizes must be recognised as font-size classes so they coexist with color
// classes like text-ink-ghost without being dropped.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [
        'text-tag-w1',
        'text-tag-w2',
        'text-tag-w3',
        'text-tag-w4',
        'text-tag-w5',
        'text-badge',
        'text-badge-sm',
        'text-micro',
      ],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
