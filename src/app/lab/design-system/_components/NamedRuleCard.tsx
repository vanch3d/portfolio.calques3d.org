import { cn } from '@/lib/utils'

type NamedRuleCardProps = {
  name: string
  statement: string
  rationale?: string
  className?: string
}

/**
 * One of the three design-system invariants rendered as a bordered card.
 * Border weight: medium (1px). No shadows — flat by construction.
 */
export function NamedRuleCard({ name, statement, rationale, className }: NamedRuleCardProps) {
  return (
    <article className={cn('border-medium border-ink-ghost px-lg py-md', className)}>
      <p className="mb-sm label">{name}</p>
      <p className="mb-xs font-body text-body leading-label font-medium text-ink">{statement}</p>
      {rationale && (
        <p
          className="font-body text-caption leading-body text-ink-secondary"
          data-testid="named-rule-rationale"
        >
          {rationale}
        </p>
      )}
    </article>
  )
}
