import { cn } from '@/lib/utils'

type SpecimenVariant = 'display' | 'headline' | 'title' | 'body' | 'label'

// Tailwind classes per variant — all tokens, no arbitrary values except
// the type-spec annotation size (0.625rem, one-off sub-label).
const SPECIMEN_CLASSES: Record<SpecimenVariant, string> = {
  display: 'font-display italic font-normal text-display leading-display text-ink',
  headline: 'font-display italic font-normal text-headline leading-headline text-ink',
  title: 'font-body font-medium text-title leading-title text-ink',
  body: 'font-body font-normal text-body leading-body text-ink max-w-prose',
  label: 'label',
}

type TypeSpecimenProps = {
  role: string
  variant: SpecimenVariant
  specimenText: string
  specs: string[] // e.g. ["STIX Two Text", "Italic · 400", "56–72px fluid", "Leading 1.10"]
  rationale?: string
  className?: string
}

/**
 * One row in the typography specimen table.
 * Left column: role label + dimension annotations.
 * Right column: live specimen text rendered in the actual token.
 */
export function TypeSpecimen({
  role,
  variant,
  specimenText,
  specs,
  rationale,
  className,
}: TypeSpecimenProps) {
  return (
    <div
      className={cn(
        'grid items-start gap-lg border-t-ghost border-ink-ghost pt-lg',
        'grid-cols-1 md:grid-cols-[180px_1fr]',
        className
      )}
    >
      {/* Meta column */}
      <div className="flex flex-col gap-xs pt-[0.2em]">
        <p className="mb-sm label">{role}</p>
        {specs.map((spec) => (
          <p
            key={spec}
            className="font-label text-[0.625rem] leading-label tracking-label text-ink-secondary uppercase tabular"
          >
            {spec}
          </p>
        ))}
      </div>

      {/* Specimen column */}
      <div className="flex flex-col gap-md">
        <p className={SPECIMEN_CLASSES[variant]}>{specimenText}</p>
        {rationale && (
          <p className="max-w-prose font-body text-caption leading-body text-ink-secondary">
            {rationale}
          </p>
        )}
      </div>
    </div>
  )
}
