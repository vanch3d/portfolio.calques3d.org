/**
 * Radio / RadioGroup — Base UI-backed atoms with a real hidden ARIA state machine (ADR 009).
 * Circular marker — the one bounded Compass Grammar exception (DESIGN.md Shapes).
 */

'use client'

import { useId } from 'react'
import { RadioGroup as BaseRadioGroup } from '@base-ui/react/radio-group'
import { Radio as BaseRadio } from '@base-ui/react/radio'
import { cn } from '@/lib/utils'
import { controlBoxClasses } from './controlBoxClasses'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'

type RadioGroupProps = ComponentPropsWithoutRef<typeof BaseRadioGroup>

export function RadioGroup({ className, ...rest }: RadioGroupProps) {
  return <BaseRadioGroup className={cn('flex flex-col gap-sm', className)} {...rest} />
}

type RadioProps = Omit<ComponentPropsWithoutRef<typeof BaseRadio.Root>, 'children'> & {
  label: ReactNode
}

export function Radio({ label, className, ...rest }: RadioProps) {
  const labelId = useId()

  return (
    <label className="group inline-flex cursor-pointer items-center gap-sm has-[[data-disabled]]:cursor-not-allowed">
      <BaseRadio.Root
        aria-labelledby={labelId}
        className={cn(controlBoxClasses, 'rounded-full', className)}
        {...rest}
      >
        <BaseRadio.Indicator
          className="h-control-dot w-control-dot rounded-full bg-ground"
          aria-hidden="true"
        />
      </BaseRadio.Root>
      <span
        id={labelId}
        className="font-body text-caption text-ink group-has-[[data-disabled]]:text-ink-ghost"
      >
        {label}
      </span>
    </label>
  )
}
