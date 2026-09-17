import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

// Custom tailwind-merge instance aware of project-specific font-size and
// border-weight tokens.
//
// Without the font-size entry, twMerge groups all text-* classes together
// (color + size) and removes earlier ones when a later text-* class appears.
// The text-tag-w* scale (font-size tokens for the tag cloud) and the
// text-badge/text-micro sub-label sizes must be recognised as font-size
// classes so they coexist with color classes like text-ink-ghost without
// being dropped.
//
// Without the border-w entries, the same failure mode hits the graphite
// line-weight scale: twMerge doesn't recognise border-heavy/border-medium/
// border-ghost as border-*width* classes (they don't match its built-in
// numeric/arbitrary-value pattern), so it falls back to treating them as
// border-*color* classes — the same group as border-ink/border-ink-secondary
// etc. That silently drops the width utility whenever a color utility for the
// same side appears later in the class string (e.g. `border-medium border-ink`
// merges down to just `border-ink`, leaving no border-width applied at all).
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
      'border-w': ['border-heavy', 'border-medium', 'border-ghost'],
      'border-w-t': ['border-t-heavy', 'border-t-medium', 'border-t-ghost'],
      'border-w-b': ['border-b-heavy', 'border-b-medium', 'border-b-ghost'],
      'border-w-l': ['border-l-heavy', 'border-l-medium', 'border-l-ghost'],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
