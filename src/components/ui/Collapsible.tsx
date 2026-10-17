/**
 * Collapsible — thin Base UI wrapper (Root/Trigger/Panel), no owned styling or
 * hardcoded trigger/panel content. Callers own the DOM contents and any
 * data-[open]/data-[closed] styling.
 */

'use client'

import { Collapsible as BaseCollapsible } from '@base-ui/react/collapsible'
import type { ComponentPropsWithoutRef } from 'react'

type CollapsibleRootProps = ComponentPropsWithoutRef<typeof BaseCollapsible.Root>

export function CollapsibleRoot(props: CollapsibleRootProps) {
  return <BaseCollapsible.Root {...props} />
}

type CollapsibleTriggerProps = ComponentPropsWithoutRef<typeof BaseCollapsible.Trigger>

export function CollapsibleTrigger(props: CollapsibleTriggerProps) {
  return <BaseCollapsible.Trigger {...props} />
}

type CollapsiblePanelProps = ComponentPropsWithoutRef<typeof BaseCollapsible.Panel>

export function CollapsiblePanel(props: CollapsiblePanelProps) {
  return <BaseCollapsible.Panel {...props} />
}
