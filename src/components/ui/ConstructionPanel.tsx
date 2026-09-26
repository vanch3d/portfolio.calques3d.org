/**
 * ConstructionPanel — containment pattern for a region that opens/closes (drawer,
 * disclosure). Composes the Collapsible atom; the trigger carries the Button
 * atom's text-action visual styling directly (Base UI owns aria-expanded/
 * aria-controls/click wiring). Panel is hard mount/unmount, not CSS-hidden.
 *
 * The `trigger` render-prop, when supplied, fully replaces the built-in toggle
 * row — the caller's returned JSX must render its own `CollapsibleTrigger` for
 * the actual clickable/keyboard-reachable element. `open`/`onOpenChange` layer
 * controlled mode on top of the default uncontrolled `defaultOpen` path.
 * `ariaLabel` overrides the panel body's `aria-label` (defaults to `toggleLabel`)
 * for callers whose `trigger` makes `toggleLabel` a non-visible fallback string.
 */

'use client'

import { useState } from 'react'
import { CollapsibleRoot, CollapsibleTrigger, CollapsiblePanel } from './Collapsible'
import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

type ConstructionPanelProps = {
  toggleLabel: string
  closedHint?: ReactNode
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
  trigger?: (state: { open: boolean }) => ReactNode
  ariaLabel?: string
  children: ReactNode
  className?: string
}

const baseBoxClasses =
  'mt-md border-t-heavy border-r-medium border-b-medium border-l-medium border-t-ink border-r-ink-secondary border-b-ink-secondary border-l-ink-secondary bg-ground-warm px-lg py-md'

export function ConstructionPanel({
  toggleLabel,
  closedHint,
  defaultOpen = false,
  open: openProp,
  onOpenChange,
  trigger,
  ariaLabel,
  children,
  className,
}: ConstructionPanelProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen)
  const open = openProp ?? internalOpen

  function handleOpenChange(nextOpen: boolean) {
    setInternalOpen(nextOpen)
    onOpenChange?.(nextOpen)
  }

  return (
    <CollapsibleRoot
      open={openProp}
      defaultOpen={defaultOpen}
      onOpenChange={handleOpenChange}
      data-testid="construction-panel"
    >
      {trigger ? (
        trigger({ open })
      ) : (
        <div className="flex items-center gap-md" data-testid="construction-panel-toggle-row">
          <CollapsibleTrigger
            className={cn(
              'cursor-pointer appearance-none py-sm label transition-colors duration-150', // shared button base
              'disabled:pointer-events-none disabled:cursor-not-allowed', // disabled base
              'border-none bg-transparent px-0 text-ink-secondary underline decoration-transparent underline-offset-2', // text-action structure
              'hover:text-ink hover:decoration-ink', // hover
              'active:font-medium active:text-ink', // pressed
              'disabled:text-ink-ghost disabled:no-underline disabled:decoration-transparent' // disabled
            )}
            data-testid="construction-panel-toggle"
          >
            {toggleLabel} <span aria-hidden="true">{open ? '▴' : '▾'}</span>
          </CollapsibleTrigger>
          {!open && closedHint && (
            <span
              className="font-body text-caption leading-body text-ink-secondary"
              data-testid="construction-panel-hint"
            >
              {closedHint}
            </span>
          )}
        </div>
      )}

      <CollapsiblePanel
        role="region"
        aria-label={ariaLabel ?? toggleLabel}
        className={cn(baseBoxClasses, className)}
        data-testid="construction-panel-body"
      >
        {children}
      </CollapsiblePanel>
    </CollapsibleRoot>
  )
}
