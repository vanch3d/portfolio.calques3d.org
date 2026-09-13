/**
 * ProjectNarrative — Server, sync — pure layout, no i18n
 *
 * Wraps the MDX body (already resolved and passed as `children` by page.tsx,
 * per ADR 021 — no _components/ file resolves MDX itself). On engineering
 * projects, HighlightsBlock renders first, above the prose.
 */

import type { ReactNode } from 'react'
import { HighlightsBlock } from './HighlightsBlock'

type ProjectNarrativeProps = {
  highlights?: string[]
  children: ReactNode
}

export function ProjectNarrative({ highlights, children }: ProjectNarrativeProps) {
  return (
    <div data-testid="project-narrative" className="max-w-prose">
      {highlights && highlights.length > 0 && <HighlightsBlock highlights={highlights} />}
      <div className="font-body text-body leading-body text-ink-secondary">{children}</div>
    </div>
  )
}
