/**
 * Checkbox — Base UI-backed atom with a real hidden ARIA state machine (ADR 009).
 * States driven by Base UI's `data-checked`/`data-disabled` attributes (Live Line Rule, DESIGN.md).
 */

'use client'

import { Checkbox as BaseCheckbox } from '@base-ui/react/checkbox'
import { cn } from '@/lib/utils'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'

type CheckboxProps = Omit<ComponentPropsWithoutRef<typeof BaseCheckbox.Root>, 'children'> & {
  label: ReactNode
}

export function Checkbox({ label, className, ...rest }: CheckboxProps) {
  return (
    <label className="group inline-flex cursor-pointer items-center gap-sm has-[[data-disabled]]:cursor-not-allowed">
      <BaseCheckbox.Root
        className={cn(
          'flex h-control w-control shrink-0 items-center justify-center', // box geometry
          'border-medium border-ink-secondary bg-transparent transition-colors duration-150', // rest
          'hover:border-ink', // hover
          'active:border-heavy active:border-ink', // pressed
          'data-[checked]:border-ink data-[checked]:bg-ink', // checked / selected
          'data-[disabled]:pointer-events-none data-[disabled]:border-ink-ghost data-[disabled]:bg-transparent', // disabled
          'data-[disabled]:data-[checked]:border-ink-ghost data-[disabled]:data-[checked]:bg-ink-ghost', // disabled + checked
          className
        )}
        {...rest}
      >
        <BaseCheckbox.Indicator
          className="font-label text-caption leading-none text-ground"
          aria-hidden="true"
        >
          ✓
        </BaseCheckbox.Indicator>
      </BaseCheckbox.Root>
      <span className="font-body text-caption text-ink group-has-[[data-disabled]]:text-ink-ghost">
        {label}
      </span>
    </label>
  )
}
