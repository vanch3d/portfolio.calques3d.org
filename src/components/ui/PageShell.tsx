/**
 * PageShell — Server-safe, no i18n strings of its own
 *
 * The one page frame for every route except the homepage (which has its own
 * fixed SiteNav): a single `page-wrap` container with the landmarks every page
 * must carry — <header> (the Breadcrumb, plus an optional `headerExtra`),
 * <main id="main-content"> (the SkipNav target) and <footer>.
 *
 * The footer is a structural landmark. It renders empty unless the page has
 * something that obviously belongs at the bottom (e.g. the project page's
 * prev/next navigation).
 */

import type { ReactNode } from 'react'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import type { BreadcrumbItem } from '@/components/ui/Breadcrumb'
import { MAIN_CONTENT_ID } from '@/components/ui/main-content-id'
import { cn } from '@/lib/utils'

type PageShellProps = {
  breadcrumb: { items: BreadcrumbItem[]; current: string }
  /** Extra header content under the breadcrumb (e.g. a section nav). */
  headerExtra?: ReactNode
  /** Bottom-of-page content. The <footer> landmark renders either way. */
  footer?: ReactNode
  className?: string
  children: ReactNode
}

export function PageShell({
  breadcrumb,
  headerExtra,
  footer,
  className,
  children,
}: PageShellProps) {
  return (
    <div className={cn('page-wrap flex min-h-screen flex-col bg-ground py-xl text-ink', className)}>
      <header>
        <Breadcrumb items={breadcrumb.items} current={breadcrumb.current} />
        {headerExtra}
      </header>
      <main id={MAIN_CONTENT_ID} className="flex-1">
        {children}
      </main>
      <footer>{footer}</footer>
    </div>
  )
}
