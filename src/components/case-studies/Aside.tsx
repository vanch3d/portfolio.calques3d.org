/**
 * Aside — plain sync Server Component
 *
 * Margin note: a ruled block for annotations that sit beside the reading
 * column. Rendered as a labelled note rather than a complementary landmark,
 * because it lives inside <main> where a landmark would be invalid.
 */

type AsideProps = {
  children: React.ReactNode
  label?: string
}

export function Aside({ children, label }: AsideProps) {
  return (
    <div
      role="note"
      aria-label={label}
      className="border-t-medium border-ink pt-sm text-caption leading-label text-ink"
      data-testid="aside"
    >
      {label ? <span className="mb-xs block label">{label}</span> : null}
      {children}
    </div>
  )
}
