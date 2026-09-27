/**
 * Checkbox — Base UI-backed atom with a real hidden ARIA state machine (ADR 009).
 * States driven by Base UI's `data-checked`/`data-disabled` attributes (Live Line Rule, DESIGN.md).
 */

'use client'

import { useId } from 'react'
import { Checkbox as BaseCheckbox } from '@base-ui/react/checkbox'
import { cn } from '@/lib/utils'
import { controlBoxClasses } from './controlBoxClasses'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'

type CheckboxProps = Omit<ComponentPropsWithoutRef<typeof BaseCheckbox.Root>, 'children'> & {
  label: ReactNode
}

export function Checkbox({ label, className, ...rest }: CheckboxProps) {
  const labelId = useId()

  return (
    <label className="group inline-flex cursor-pointer items-center gap-sm has-[[data-disabled]]:cursor-not-allowed">
      <BaseCheckbox.Root
        aria-labelledby={labelId}
        className={cn(controlBoxClasses, className)}
        {...rest}
      >
        <BaseCheckbox.Indicator
          className="font-label text-caption leading-none text-ground"
          aria-hidden="true"
        >
          ✓
        </BaseCheckbox.Indicator>
      </BaseCheckbox.Root>
      <span
        id={labelId}
        className="font-body text-caption text-ink group-has-[[data-disabled]]:text-ink-ghost"
      >
        {label}
      </span>
    </label>
  )
}
