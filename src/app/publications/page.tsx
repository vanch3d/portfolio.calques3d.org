/**
 * /publications — route file.
 *
 * Per ADR 023 (rendering strategy for /publications): this page.tsx is the
 * ONLY async Server Component on this surface. It resolves the full,
 * unfiltered publication list once via `getCachedPublications()` — SSG page
 * shell + `unstable_cache` for the Zotero read, sharing the `publications`
 * revalidation tag with the per-project lists from ADR 020 — and passes it
 * down to the Client Components (`PublicationHeader`, `PublicationMainClient`,
 * `PublicationSearchBar`) that own the client-side tag filtering.
 */

import type { Metadata, Route } from 'next'

import { getTranslations } from 'next-intl/server'
import { getCachedPublications } from '@/lib/publications'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { PublicationHeader } from '@/app/publications/_components/PublicationHeader'
import PublicationMainClient from '@/app/publications/_components/PublicationMainClient'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Publications')

  return {
    title: t('publications_heading'),
  }
}

export default async function PublicationsPage() {
  const publications = await getCachedPublications()
  const t = await getTranslations('Publications')

  return (
    <div className="page-wrap min-h-screen bg-ground py-xl text-ink">
      <header>
        <Breadcrumb
          items={[{ label: t('breadcrumb_home'), href: '/' as Route }]}
          current={t('publications_heading')}
        />
        <PublicationHeader pubCount={publications.length} minYear={1995} maxYear={2016} />
      </header>
      <PublicationMainClient publications={publications} />
    </div>
  )
}
