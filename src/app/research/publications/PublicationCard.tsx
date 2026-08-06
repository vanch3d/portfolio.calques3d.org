/**
 * PublicationCard — Server Component.
 *
 * This component has NO "use client" directive. It runs on the server,
 * produces static HTML, and is never included in the client JS bundle.
 *
 * ┌─ OCEAN (server-rendered static HTML) ──────────────────────────┐
 * │  <article>                                                      │
 * │    <Badge />             ← Server Component                    │
 * │    <div html />          ← dangerouslySetInnerHTML, static      │
 * │    <a href=doi />        ← plain anchor, no JS                 │
 * │    <PdfControls />       ← ISLAND (imported below)             │
 * │    <details>/<summary>   ← HTML-native toggle, no JS           │
 * │  </article>                                                     │
 * └─────────────────────────────────────────────────────────────────┘
 *
 * PdfControls is the only interactive part. It is a separate "use client"
 * file. Importing it here does NOT make this file client-side — the boundary
 * is drawn at the "use client" declaration inside PdfControls.tsx.
 *
 * Props passed to PdfControls cross the server→client boundary and must
 * be serialisable (strings only — no functions, no JSX, no class instances).
 * PdfControlsLabels is a flat object of strings for this reason.
 */

import type { Publication, PublicationType } from "@/types/content";
import { Badge } from "@/components/ui/Badge";
import { PdfControls, type PdfControlsLabels } from "@/components/ui/PdfControls";

export interface PublicationCardLabels {
  abstract: string;
  showAbstract: string;
  hideAbstract: string;
  doiLinkLabel: string;
  // PDF labels are passed through to the PdfControls island
  pdf: PdfControlsLabels;
  typeLabel: (type: PublicationType) => string;
}

export function PublicationCard({
  publication,
  citation,
  labels,
}: {
  publication: Publication;
  citation: string;
  labels: PublicationCardLabels;
}) {
  return (
    <article
      aria-label={publication.title}
      className="border-b border-border-subtle py-6 last:border-0"
    >
      <div className="flex flex-col gap-3">
        {/* Type badge — Server Component */}
        <div>
          <Badge variant="type">{labels.typeLabel(publication.type)}</Badge>
        </div>

        {/* CSL-formatted citation — static HTML, server only */}
        <div
          className="text-sm text-foreground leading-relaxed [&_i]:italic"
          dangerouslySetInnerHTML={{ __html: citation }}
        />

        {/* DOI link — plain anchor, no JS, server rendered */}
        {publication.doi && (
          <div className="flex items-center gap-3 text-xs">
            <a
              href={`https://doi.org/${publication.doi}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${labels.doiLinkLabel}: ${publication.title}`}
              className="text-accent-hover hover:underline focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              {labels.doiLinkLabel}: {publication.doi}
            </a>
          </div>
        )}

        {/*
          PdfControls — CLIENT ISLAND.
          Only rendered when a PDF URL exists. The island boundary is here:
          this JSX tag is where server-rendered HTML hands off to client-hydrated
          React. Only serialisable props are passed across.
        */}
        {publication.pdf && (
          <PdfControls
            pdf={publication.pdf}
            title={publication.title}
            labels={labels.pdf}
          />
        )}

        {/* Abstract toggle — <details>/<summary> is HTML-native, zero JS */}
        {publication.abstract && (
          <details className="group">
            <summary className="cursor-pointer list-none text-xs text-foreground-secondary hover:text-foreground transition-colors">
              <span className="group-open:hidden">{labels.showAbstract}</span>
              <span className="hidden group-open:inline">{labels.hideAbstract}</span>
            </summary>
            <p className="mt-2 text-sm text-foreground-secondary leading-relaxed">
              {publication.abstract}
            </p>
          </details>
        )}
      </div>
    </article>
  );
}
