import { cn } from '@/lib/utils'

// Map token name → Tailwind bg class. Dynamic style avoided by exhaustive
// compile-time mapping — all five system colours are known at build time.
const TOKEN_BG: Record<string, string> = {
  'color-ground': 'bg-ground',
  'color-ink': 'bg-ink',
  'color-ink-secondary': 'bg-ink-secondary',
  'color-ink-ghost': 'bg-ink-ghost',
  'color-active': 'bg-active',
}

type NamedRule = {
  name: string
  body: string
}

type ColorSwatchProps = {
  token: string // e.g. "color-ground"
  name: string // e.g. "Draughting Paper"
  hex: string // e.g. "#f8f4ed"
  usage: string
  ariaLabel: string
  namedRule?: NamedRule
  className?: string
}

/**
 * Full colour documentation row: swatch block + name, token, hex, usage copy,
 * and optional named-rule callout. One row per system colour.
 */
export function ColorSwatch({
  token,
  name,
  hex,
  usage,
  ariaLabel,
  namedRule,
  className,
}: ColorSwatchProps) {
  const bgClass = TOKEN_BG[token] ?? 'bg-ink-ghost'

  return (
    <div
      className={cn('grid items-start gap-lg', 'grid-cols-1 sm:grid-cols-[120px_1fr]', className)}
    >
      {/* Swatch */}
      <div
        role="img"
        aria-label={ariaLabel}
        className={cn(
          'h-swatch-h w-full flex-shrink-0 border-ghost border-ink-ghost sm:w-swatch-w',
          bgClass
        )}
      />

      {/* Metadata */}
      <div className="flex flex-col gap-xs">
        <p className="font-display text-title leading-title font-medium text-ink">{name}</p>

        <div className="flex flex-wrap gap-md">
          <span className="label tracking-tight">--{token}</span>
          <span className="label tracking-tight tabular">{hex}</span>
        </div>

        <p className="max-w-swatch-copy font-body text-caption leading-body text-ink-secondary">
          {usage}
        </p>

        {namedRule && (
          <div className="mt-sm border-l-heavy border-ink-ghost pl-md">
            <p className="mb-xs label text-ink">{namedRule.name}</p>
            <p className="font-body text-caption leading-body text-ink-secondary">
              {namedRule.body}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
