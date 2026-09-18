/**
 * Field — Base UI-backed atom wiring label/description/error around a text
 * control (ADR 009). Error state is `border-heavy` plus an ink-filled,
 * sharp-cornered badge holding an inline SVG glyph — never a text character,
 * never `active` red (this surface's One Red Rule budget is already spent).
 */

'use client'

import { Field as BaseField } from '@base-ui/react/field'
import { cn } from '@/lib/utils'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'

function FieldErrorIcon() {
  return (
    <span
      aria-hidden="true"
      className="inline-flex h-control-dot w-control-dot shrink-0 items-center justify-center bg-ink"
    >
      <svg viewBox="0 0 10 10" className="h-full w-full">
        <rect x="4" y="0.5" width="2" height="5.5" className="fill-ground" />
        <rect x="4" y="8" width="2" height="2" className="fill-ground" />
      </svg>
    </span>
  )
}

type FieldProps = Omit<ComponentPropsWithoutRef<typeof BaseField.Root>, 'children'> & {
  label: ReactNode
  description?: ReactNode
  errorMessage?: ReactNode
  inputProps?: Omit<ComponentPropsWithoutRef<typeof BaseField.Control>, 'id'>
}

export function Field({
  label,
  description,
  errorMessage,
  invalid,
  className,
  inputProps,
  ...rest
}: FieldProps) {
  const isInvalid = invalid ?? Boolean(errorMessage)

  return (
    <BaseField.Root
      invalid={isInvalid}
      className={cn('flex w-full max-w-field flex-col gap-xs', className)}
      {...rest}
    >
      <BaseField.Label className="label text-ink-secondary data-[disabled]:text-ink-ghost">
        {label}
      </BaseField.Label>
      <BaseField.Control
        className={cn(
          'border-medium border-ink-secondary bg-transparent px-sm py-sm', // rest — structure
          'font-body text-caption text-ink transition-colors duration-150', // rest — type
          'hover:border-ink', // hover
          'active:border-heavy active:border-ink', // pressed
          'data-[invalid]:border-heavy data-[invalid]:border-ink', // error
          'disabled:cursor-not-allowed disabled:border-ink-ghost disabled:text-ink-ghost' // disabled
        )}
        {...inputProps}
      />
      {errorMessage ? (
        <BaseField.Error
          match
          className="flex items-center gap-xs font-body text-micro leading-label text-ink"
        >
          <FieldErrorIcon />
          {errorMessage}
        </BaseField.Error>
      ) : (
        description && (
          <BaseField.Description className="font-body text-micro leading-label text-ink-secondary">
            {description}
          </BaseField.Description>
        )
      )}
    </BaseField.Root>
  )
}
