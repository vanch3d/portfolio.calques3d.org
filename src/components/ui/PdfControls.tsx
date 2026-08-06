/**
 * PdfControls — the Client Component island for PDF interaction.
 *
 * ┌─────────────────────────────────────────────────────────────────┐
 * │  ISLAND BOUNDARY                                                │
 * │                                                                 │
 * │  PublicationCard (Server Component)                             │
 * │    └── <PdfControls />  ← "use client" boundary starts here    │
 * │          ├── useFeatureFlag()  reads localStorage               │
 * │          ├── useState()        manages open/closed state        │
 * │          └── dynamic(PdfViewer) lazy-loads ~3 MB of pdf.js     │
 * │                                                                 │
 * │  Everything ABOVE this component is static server-rendered HTML.│
 * │  Only PdfControls and its imports are hydrated in the browser.  │
 * └─────────────────────────────────────────────────────────────────┘
 *
 * Props crossing the server→client boundary must be serialisable
 * (string, number, boolean, plain object — no functions, no JSX).
 */

"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useFeatureFlag } from "@/hooks/useFeatureFlag";
import { DownloadIcon } from "@/components/ui/icons";

// Dynamic import with ssr: false:
//  - pdf.js (~3 MB) is excluded from the initial bundle, loaded on demand
//  - ssr: false prevents the server from rendering <canvas> (not meaningful SSR)
//  - The loading fallback is shown while the chunk is being fetched
const PdfViewer = dynamic(
  () => import("./PdfViewer").then((m) => m.PdfViewer),
  {
    ssr: false,
    loading: () => (
      <p className="text-sm text-foreground-secondary animate-pulse py-4">
        Loading viewer…
      </p>
    ),
  },
);

export interface PdfControlsLabels {
  pdfLinkLabel: string;
  pdfDownloadLabel: string;
  viewPdf: string;
  closePdf: string;
  pdfLoading: string;
  pdfError: string;
  // Template string with {current} and {total} placeholders — substituted
  // client-side. Functions cannot cross the server→client boundary.
  pdfPageTemplate: string;
  pdfPrevious: string;
  pdfNext: string;
}

interface PdfControlsProps {
  pdf: string;       // serialisable: plain URL string
  title: string;     // serialisable: plain string
  labels: PdfControlsLabels;  // serialisable: object of strings
}

export function PdfControls({ pdf, title, labels }: PdfControlsProps) {
  // Reads localStorage — only works in the browser, hence the island
  const viewerEnabled = useFeatureFlag("pdf-viewer");
  const [viewerOpen, setViewerOpen] = useState(false);

  // Server-side proxy URL: pdf.js fetches this instead of the direct GitHub
  // URL, which is blocked by CORS. The proxy route forwards the bytes from
  // the server where there are no CORS restrictions.
  const proxyUrl = `/api/pdf-proxy?url=${encodeURIComponent(pdf)}`;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        {/* Download link — always shown, uses direct URL (CORS doesn't
            apply to navigation/download, only to fetch()) */}
        <a
          href={pdf}
          aria-label={`${labels.pdfDownloadLabel}: ${title}`}
          className="inline-flex items-center gap-1 text-xs text-accent-hover hover:underline focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          <DownloadIcon size={12} />
          {labels.pdfLinkLabel}
        </a>

        {/* View button — only rendered when feature flag is enabled */}
        {viewerEnabled && !viewerOpen && (
          <button
            type="button"
            onClick={() => setViewerOpen(true)}
            className="text-xs text-accent-hover hover:underline focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            {labels.viewPdf}
          </button>
        )}

        {viewerEnabled && viewerOpen && (
          <button
            type="button"
            onClick={() => setViewerOpen(false)}
            className="text-xs text-foreground-secondary hover:text-foreground hover:underline focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            {labels.closePdf}
          </button>
        )}
      </div>

      {/* Viewer panel — lazy-loaded only when opened, uses proxy URL */}
      {viewerEnabled && viewerOpen && (
        <div className="mt-2 rounded border border-border overflow-auto">
          <PdfViewer
            url={proxyUrl}
            title={title}
            labels={{
              loading: labels.pdfLoading,
              error: labels.pdfError,
              pageTemplate: labels.pdfPageTemplate,
              previous: labels.pdfPrevious,
              next: labels.pdfNext,
            }}
          />
        </div>
      )}
    </div>
  );
}
