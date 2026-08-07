/**
 * Streaming skeleton for /research/publications/[key].
 *
 * Co-located here so Next.js picks this up instead of the parent list
 * skeleton (src/app/research/publications/loading.tsx). Layout mirrors
 * PublicationDetail exactly — main/aside grid — to avoid CLS when the
 * real content streams in after the Zotero fetch and CSL format.
 *
 * Rendering: SSG — this is the Suspense fallback during the initial
 * server render of generateMetadata / page data fetching.
 */

function SkeletonLine({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded bg-surface-raised ${className ?? ""}`}
      aria-hidden="true"
    />
  );
}

function SkeletonViewer() {
  return (
    <div
      className="rounded border border-border bg-surface-raised animate-pulse"
      style={{ minHeight: "70vh" }}
      aria-hidden="true"
    />
  );
}

function SkeletonAside() {
  return (
    <div className="flex flex-col gap-4" aria-hidden="true">
      {/* Type badge */}
      <SkeletonLine className="h-5 w-32" />
      {/* Citation — 3 lines */}
      <div className="flex flex-col gap-1.5">
        <SkeletonLine className="h-3.5 w-full" />
        <SkeletonLine className="h-3.5 w-full" />
        <SkeletonLine className="h-3.5 w-3/4" />
      </div>
      {/* Links */}
      <div className="flex flex-col gap-2">
        <SkeletonLine className="h-3 w-48" />
        <SkeletonLine className="h-3 w-16" />
      </div>
    </div>
  );
}

export default function PublicationDetailLoading() {
  return (
    <div className="mx-auto max-w-screen-lg px-4 py-16 sm:px-6 lg:px-8">
      {/* Back link */}
      <SkeletonLine className="mb-8 h-4 w-28" />

      <div
        className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8 items-start"
        aria-busy="true"
        aria-label="Loading publication"
      >
        <SkeletonViewer />
        <SkeletonAside />
      </div>
    </div>
  );
}
