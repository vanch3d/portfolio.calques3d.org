'use client'

/**
 * SiteNav — fixed top navigation bar, scroll-revealed.
 *
 * Hidden by default (translateY(-100%)), slides in when the `nav-visible` CSS class
 * is added by HomepageScrollHandler at 30% hero scroll progress.
 *
 * Layout (from approved comp homepage-comp-v4b-r2.html):
 *   STIX italic name (aria-hidden, fades in with 0.2s delay) ·
 *   flex spacer rule · nav link list
 *
 * One Red Rule: the contact link ("···") is the single active element — border
 * and text in --color-active.
 *
 * i18n: all strings from HomePage namespace.
 */

import Link from 'next/link'
import type { Route } from 'next'
import { useTranslations } from 'next-intl'

type SiteNavProps = {
  id?: string
}

export function SiteNav({ id }: SiteNavProps) {
  const t = useTranslations('HomePage')

  return (
    <nav
      id={id}
      aria-label={t('nav_aria_label')}
      className="fixed top-0 right-0 left-0 z-nav flex h-nav nav-hidden items-center gap-lg border-b-medium border-ink-ghost bg-ground px-page"
    >
      <span
        aria-hidden="true"
        className="shrink-0 font-display text-body whitespace-nowrap text-ink italic opacity-0 transition-opacity delay-nav-name duration-nav-fade ease-linear [.nav-visible_&]:opacity-100"
      >
        {t('name')}
      </span>

      <span aria-hidden="true" className="flex-1 border-t-ghost border-ink-ghost" />

      <ul className="flex list-none items-center gap-dense">
        <li>
          <Link
            href="/research"
            className="label text-ink-secondary transition-colors hover:text-ink"
          >
            {t('nav_research')}
          </Link>
        </li>
        <li>
          <Link
            href="/engineering"
            className="label text-ink-secondary transition-colors hover:text-ink"
          >
            {t('nav_engineering')}
          </Link>
        </li>
        <li>
          <Link
            href={'/publications' as Route}
            className="label text-ink-secondary transition-colors hover:text-ink"
          >
            {t('nav_publications')}
          </Link>
        </li>
        <li>
          <Link href="/lab" className="label text-ink-secondary transition-colors hover:text-ink">
            {t('nav_lab')}
          </Link>
        </li>
        <li>
          <Link
            href={'/contact' as Route}
            aria-label={t('nav_contact_aria')}
            className="border-medium border-active px-sm py-xs label text-active transition-colors hover:border-ink hover:text-ink"
          >
            {t('nav_contact')}
          </Link>
        </li>
      </ul>
    </nav>
  )
}
