/**
 * Radio / RadioGroup — Base UI-backed atoms with a real hidden ARIA state machine (ADR 009).
 * Circular marker — the one bounded Compass Grammar exception (DESIGN.md Shapes).
 */

'use client'

import { RadioGroup as BaseRadioGroup } from '@base-ui/react/radio-group'
import { Radio as BaseRadio } from '@base-ui/react/radio'
import { cn } from '@/lib/utils'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'

type RadioGroupProps = ComponentPropsWithoutRef<typeof BaseRadioGroup>

export function RadioGroup({ className, ...rest }: RadioGroupProps) {
  return <BaseRadioGroup className={cn('flex flex-col gap-sm', className)} {...rest} />
}

type RadioProps = Omit<ComponentPropsWithoutRef<typeof BaseRadio.Root>, 'children'> & {
  label: ReactNode
}

export function Radio({ label, className, ...rest }: RadioProps) {
  return (
    <label className="group inline-flex cursor-pointer items-center gap-sm has-[[data-disabled]]:cursor-not-allowed">
      <BaseRadio.Root
        className={cn(
          'flex h-control w-control shrink-0 items-center justify-center rounded-full', // box geometry
          'border-medium border-ink-secondary bg-transparent transition-colors duration-150', // rest
          'hover:border-ink', // hover
          'active:border-heavy active:border-ink', // pressed
          'data-[checked]:border-ink data-[checked]:bg-ink', // checked / selected — solid fill, matches Checkbox
          'data-[disabled]:pointer-events-none data-[disabled]:border-ink-ghost data-[disabled]:bg-transparent', // disabled
          'data-[disabled]:data-[checked]:border-ink-ghost data-[disabled]:data-[checked]:bg-ink-ghost', // disabled + checked
          className
        )}
        {...rest}
      >
        <BaseRadio.Indicator
          className="h-control-dot w-control-dot rounded-full bg-ground"
          aria-hidden="true"
        />
      </BaseRadio.Root>
      <span className="font-body text-caption text-ink group-has-[[data-disabled]]:text-ink-ghost">
        {label}
      </span>
    </label>
  )
}
