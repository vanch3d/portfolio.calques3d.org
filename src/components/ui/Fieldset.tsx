/**
 * Fieldset — Base UI-backed atom grouping a shared legend with related
 * controls (ADR 009). A nested `RadioGroup` inherits the legend as its
 * own accessible name — no redundant `aria-label` needed. `disabled`
 * does not cascade to descendant controls; pass it to each explicitly.
 */

'use client'

import { Fieldset as BaseFieldset } from '@base-ui/react/fieldset'
import { cn } from '@/lib/utils'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'

type FieldsetProps = ComponentPropsWithoutRef<typeof BaseFieldset.Root> & {
  legend: ReactNode
  description?: ReactNode
}

export function Fieldset({ legend, description, children, className, ...rest }: FieldsetProps) {
  return (
    <BaseFieldset.Root className={cn('flex flex-col', className)} {...rest}>
      <BaseFieldset.Legend className="mb-sm block label data-[disabled]:text-ink-ghost">
        {legend}
      </BaseFieldset.Legend>
      {description && (
        <p className="mb-md font-body text-caption leading-body text-ink-secondary">
          {description}
        </p>
      )}
      {children}
    </BaseFieldset.Root>
  )
}
