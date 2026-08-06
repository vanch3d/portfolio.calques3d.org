/**
 * Streaming skeleton for /research/publications.
 *
 * Next.js App Router auto-wraps the page.tsx in a Suspense boundary and
 * renders this component immediately while the server fetches from Zotero
 * and runs the CSL formatter. Layout mirrors page.tsx exactly to avoid
 * cumulative layout shift when the real content streams in.
 *
 * Rendering: ISR — this is the fallback shown during the first uncached load.
 */

function SkeletonLine({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded bg-surface-raised ${className ?? ""}`}
      aria-hidden="true"
    />
  );
}

function SkeletonCard() {
  return (
    <div className="border-b border-border-subtle py-6 last:border-0">
      <div className="flex flex-col gap-3">
        <SkeletonLine className="h-5 w-28" />
        <SkeletonLine className="h-4 w-full" />
        <SkeletonLine className="h-4 w-4/5" />
      </div>
    </div>
  );
}

function SkeletonYearGroup({ cardCount }: { cardCount: number }) {
  return (
    <section aria-hidden="true">
      <SkeletonLine className="mb-4 h-3 w-12 pb-2" />
      <div>
        {Array.from({ length: cardCount }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </section>
  );
}

export default function PublicationsLoading() {
  return (
    <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
      <header className="mb-12">
        <SkeletonLine className="h-10 w-56" />
        <SkeletonLine className="mt-4 h-4 w-full max-w-2xl" />
        <SkeletonLine className="mt-2 h-4 w-3/4 max-w-xl" />
      </header>

      <div className="flex flex-col gap-10" aria-busy="true" aria-label="Loading publications">
        <SkeletonYearGroup cardCount={4} />
        <SkeletonYearGroup cardCount={3} />
        <SkeletonYearGroup cardCount={5} />
      </div>
    </div>
  );
}
