/**
 * Shared box-geometry/border/interaction-state classes for Checkbox and Radio
 * (ADR 009) — identical state machine, only the shape differs (Radio adds
 * `rounded-full`).
 */
export const controlBoxClasses = [
  'flex h-control w-control shrink-0 items-center justify-center', // box geometry
  'border-medium border-ink-secondary bg-transparent transition-colors duration-150', // rest
  'hover:border-ink', // hover
  'active:border-heavy active:border-ink', // pressed
  'data-[checked]:border-ink data-[checked]:bg-ink', // checked / selected
  'data-[disabled]:pointer-events-none data-[disabled]:border-ink-ghost data-[disabled]:bg-transparent', // disabled
  'data-[disabled]:data-[checked]:border-ink-ghost data-[disabled]:data-[checked]:bg-ink-ghost', // disabled + checked
]
