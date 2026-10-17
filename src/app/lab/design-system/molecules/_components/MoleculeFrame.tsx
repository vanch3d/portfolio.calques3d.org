import { cn } from '@/lib/utils'

type DecisionRow = { label: string; note: string }

type MoleculeFrameProps = {
  name: string
  description: string
  decisions: DecisionRow[]
  children: React.ReactNode
  className?: string
}

export function MoleculeFrame({
  name,
  description,
  decisions,
  children,
  className,
}: MoleculeFrameProps) {
  return (
    <div className={cn('mb-2xl', className)} data-testid="molecule-frame">
      <p className="mb-xs label text-ink-secondary" data-testid="molecule-frame-name">
        {name}
      </p>

      <div className="border-t-heavy border-ink">
        <div
          className="border-b-medium border-ink-ghost py-lg"
          data-testid="molecule-frame-specimen"
        >
          {children}
        </div>
      </div>

      <p
        className="mt-md mb-sm font-body text-caption leading-body text-ink-secondary"
        data-testid="molecule-frame-description"
      >
        {description}
      </p>

      {decisions.length > 0 && (
        <ul
          className="mt-sm flex flex-col gap-xs"
          data-testid="molecule-frame-decisions"
          aria-label="Key design decisions"
        >
          {decisions.map(({ label, note }) => (
            <li key={label} className="flex items-baseline gap-sm">
              <span className="shrink-0 label text-ink-secondary" data-testid="decision-label">
                {'\u2192'} {label}:
              </span>
              <span
                className="font-body text-caption leading-body text-ink-secondary"
                data-testid="decision-note"
              >
                {note}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
