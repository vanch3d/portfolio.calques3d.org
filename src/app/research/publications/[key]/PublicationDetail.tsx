/**
 * PublicationDetail — full-page publication view.
 *
 * Layout: PDF viewer as the primary content (main), metadata in a narrow
 * aside. On mobile the aside stacks above the viewer.
 *
 * ┌─────────────────────────────────┬──────────────┐
 * │  PDF Viewer (main)              │  Type badge  │
 * │                                 │  Citation    │
 * │  ← PdfViewerPanel island        │  DOI link    │
 * │                                 │  Download    │
 * └─────────────────────────────────┴──────────────┘
 *
 * The abstract is intentionally omitted — it is in the paper itself.
 * PdfViewerPanel is the only "use client" island; everything else is static
 * server-rendered HTML.
 */

import type { Publication, PublicationType } from "@/types/content";
import { Badge } from "@/components/ui/Badge";
import { DownloadIcon } from "@/components/ui/icons";
import {
  PdfViewerPanel,
  type PdfViewerPanelLabels,
} from "@/components/ui/PdfViewerPanel";

export interface PublicationDetailLabels {
  doiLinkLabel: string;
  pdfLinkLabel: string;
  pdfDownloadLabel: string;
  typeLabel: (type: PublicationType) => string;
  viewer: PdfViewerPanelLabels;
}

export function PublicationDetail({
  publication,
  citation,
  labels,
}: {
  publication: Publication;
  citation: string;
  labels: PublicationDetailLabels;
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8 items-start">
      {/* PDF viewer — the primary content of this page */}
      <div>
        {publication.pdf ? (
          <PdfViewerPanel
            pdf={publication.pdf}
            title={publication.title}
            labels={labels.viewer}
          />
        ) : (
          <div className="flex items-center justify-center h-48 rounded border border-border text-sm text-foreground-secondary">
            No PDF available.
          </div>
        )}
      </div>

      {/* Publication metadata */}
      <div className="flex flex-col gap-4 lg:sticky lg:top-8" aria-label="Publication metadata">
        {/* Type badge */}
        <div>
          <Badge variant="type">{labels.typeLabel(publication.type)}</Badge>
        </div>

        {/* CSL-formatted citation */}
        <div
          className="text-sm text-foreground leading-relaxed [&_i]:italic"
          dangerouslySetInnerHTML={{ __html: citation }}
        />

        {/* Links */}
        <div className="flex flex-col gap-2 text-xs">
          {publication.doi && (
            <a
              href={`https://doi.org/${publication.doi}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${labels.doiLinkLabel}: ${publication.title}`}
              className="text-accent-hover hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 break-all"
            >
              {labels.doiLinkLabel}: {publication.doi}
            </a>
          )}

          {publication.pdf && (
            <a
              href={publication.pdf}
              aria-label={`${labels.pdfDownloadLabel}: ${publication.title}`}
              className="inline-flex items-center gap-1 text-accent-hover hover:underline focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              <DownloadIcon size={12} />
              {labels.pdfLinkLabel}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
