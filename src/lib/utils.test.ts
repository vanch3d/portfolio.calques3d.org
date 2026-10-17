import { describe, it, expect } from 'vitest'
import { cn } from './utils'

describe('cn', () => {
  it('keeps a later border-color class alongside an earlier border-width token', () => {
    expect(cn('border-medium border-ink')).toBe('border-medium border-ink')
  })

  it('drops an earlier border-width token when a later one for the same side wins', () => {
    expect(cn('border-t-heavy', 'border-t-medium')).toBe('border-t-medium')
  })

  it('keeps directional border-width tokens independent of border color merges', () => {
    expect(cn('border-t-heavy border-t-ink', 'border-r-medium border-r-ink-secondary')).toBe(
      'border-t-heavy border-t-ink border-r-medium border-r-ink-secondary'
    )
  })

  it('lets a plain Tailwind zero border-width override a directional weight token', () => {
    expect(cn('border-l-medium', 'border-l-0')).toBe('border-l-0')
  })

  it('keeps a font-size tag-scale token alongside a text color class', () => {
    expect(cn('text-tag-w1 text-ink-ghost')).toBe('text-tag-w1 text-ink-ghost')
  })
})
