import type { Route } from 'next'
import { getTranslations } from 'next-intl/server'
import { PageShell } from '@/components/ui/PageShell'
import { getAllAdrs, getAllAdrTags, getMostRecentAcceptedAdrNumber } from '@/lib/content/adr'
import { getAllInsights } from '@/lib/content/insights'
import { AdrRegisterHeader } from './_components/AdrRegisterHeader'
import { InsightCalloutStrip } from './_components/InsightCalloutStrip'
import { AdrIndexClient } from './_components/AdrIndexClient'

export const metadata = {
  title: 'ADR',
}

// SSG — content is static markdown files, no runtime data fetching required.
export const dynamic = 'force-static'

export default async function AdrIndexPage() {
  const t = await getTranslations('LabAdr')

  const [adrs, insights, tags, mostRecentAcceptedNumber] = await Promise.all([
    getAllAdrs(),
    getAllInsights(),
    getAllAdrTags(),
    getMostRecentAcceptedAdrNumber(),
  ])

  const mostRecentInsight = insights[0] ?? null
  const minNumber = adrs.length > 0 ? Math.min(...adrs.map((a) => a.number)) : 1
  const maxNumber = adrs.length > 0 ? Math.max(...adrs.map((a) => a.number)) : 1
  const asOf = adrs.length > 0 ? adrs[0].date : new Date().toISOString().slice(0, 10)

  return (
    <PageShell
      breadcrumb={{
        items: [
          { label: t('breadcrumb_home'), href: '/' as Route },
          { label: t('breadcrumb_lab'), href: '/lab' as Route },
        ],
        current: t('breadcrumb_adr'),
      }}
    >
      <div>
        {/* ── Register header (3-col title block + dimension line) */}
        <AdrRegisterHeader
          adrCount={adrs.length}
          insightCount={insights.length}
          asOf={asOf}
          minNumber={minNumber}
          maxNumber={maxNumber}
        />

        {/* ── Most recent insight callout ────────────────────── */}
        {mostRecentInsight && <InsightCalloutStrip insight={mostRecentInsight} />}

        {/* ── Interactive register (filter + table + load more) */}
        <AdrIndexClient
          adrs={adrs}
          tags={tags}
          mostRecentAcceptedNumber={mostRecentAcceptedNumber}
        />
      </div>
    </PageShell>
  )
}
