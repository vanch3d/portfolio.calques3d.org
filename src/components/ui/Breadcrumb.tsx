/**
 * Breadcrumb — Client, needs i18n (useTranslations('Breadcrumb'))
 *
 * Generic breadcrumb trail: an ordered list of navigable crumbs followed by
 * the current page label (not a link). Owns only its own aria-label copy —
 * every crumb's label/href is page-specific data supplied by the caller.
 */

'use client'

import { useTranslations } from 'next-intl'
import type { Route } from 'next'
import { NavLink } from '@/components/ui/NavLink'

export type BreadcrumbItem = {
  label: string
  href: Route
}

type BreadcrumbProps = {
  items: BreadcrumbItem[]
  current: string
}

export function Breadcrumb({ items, current }: BreadcrumbProps) {
  const t = useTranslations('Breadcrumb')

  return (
    <nav
      aria-label={t('aria_label')}
      data-testid="breadcrumb"
      className="mb-lg flex items-baseline gap-sm border-b-ghost border-ink-ghost pb-lg"
    >
      {items.map((item) => (
        <span key={item.href.toString()} className="flex items-baseline gap-sm">
          <NavLink href={item.href}>{item.label}</NavLink>
          <span className="label text-ink-ghost" aria-hidden="true">
            /
          </span>
        </span>
      ))}
      <span className="label active-mark" aria-current="page" data-testid="breadcrumb-current">
        {current}
      </span>
    </nav>
  )
}
