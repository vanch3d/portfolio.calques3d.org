/**
 * ProjectTitle — Server, sync — pure layout, no i18n
 *
 * Flex row: display title + subtitle on the left, SpecimenIllustration
 * (Client Component) top-right. Pure arrangement — every string here is
 * project content (title/subtitle), not UI copy, so no useTranslations call
 * is needed at this level.
 */

import { SpecimenIllustration } from './SpecimenIllustration'

type ProjectTitleProps = {
  title: string
  subtitle: string
  coverUrl?: string
}

export function ProjectTitle({ title, subtitle, coverUrl }: ProjectTitleProps) {
  return (
    <div
      data-testid="project-title"
      className="flex items-start justify-between gap-lg border-b-ghost border-ink-ghost py-lg"
    >
      <div className="flex-1">
        <h1 className="max-w-title font-display text-display leading-display text-ink italic">
          {title}
        </h1>
        <p className="mt-sm font-body text-title text-ink-secondary">{subtitle}</p>
      </div>
      <SpecimenIllustration coverUrl={coverUrl} alt={title} />
    </div>
  )
}
