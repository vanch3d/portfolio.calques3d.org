/**
 * PdfViewerPanel — client island for the publication detail page.
 *
 * Unlike PdfControls (which has a toggle button), this island renders the
 * viewer immediately. It is designed to be the main content of a page, not
 * an expandable card element.
 *
 * ┌─ ISLAND BOUNDARY ──────────────────────────────────────────────┐
 * │  PublicationDetail (Server Component)                           │
 * │    └── <PdfViewerPanel />  ← "use client" boundary             │
 * │          ├── useFeatureFlag()  reads localStorage               │
 * │          └── dynamic(PdfViewer) lazy-loads pdf.js              │
 * └─────────────────────────────────────────────────────────────────┘
 *
 * When the pdf-viewer feature flag is disabled, a download-only fallback
 * is shown. Props crossing the server→client boundary are serialisable strings.
 */

"use client";

import dynamic from "next/dynamic";
import { useFeatureFlag } from "@/hooks/useFeatureFlag";
import { DownloadIcon } from "@/components/ui/icons";

const PdfViewer = dynamic(
  () => import("./PdfViewer").then((m) => m.PdfViewer),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-64 text-sm text-foreground animate-pulse">
        Loading viewer…
      </div>
    ),
  },
);

export interface PdfViewerPanelLabels {
  pdfLoading: string;
  pdfError: string;
  pdfPageTemplate: string;
  pdfPrevious: string;
  pdfNext: string;
  // Fallback shown when the feature flag is disabled
  pdfDownloadLabel: string;
  pdfLinkLabel: string;
}

interface PdfViewerPanelProps {
  pdf: string;
  title: string;
  labels: PdfViewerPanelLabels;
}

export function PdfViewerPanel({ pdf, title, labels }: PdfViewerPanelProps) {
  const viewerEnabled = useFeatureFlag("pdf-viewer");

  // Proxy URL: pdf.js fetches this instead of the GitHub URL directly.
  // The /api/pdf-proxy route downloads the asset server-side (authenticated)
  // and streams the bytes to the browser — no CORS issue.
  const proxyUrl = `/api/pdf-proxy?url=${encodeURIComponent(pdf)}`;

  if (!viewerEnabled) {
    // Feature flag off — show a prominent download link as fallback
    return (
      <div className="flex items-center justify-center h-48 rounded border border-border bg-surface-raised">
        <a
          href={pdf}
          aria-label={`${labels.pdfDownloadLabel}: ${title}`}
          className="inline-flex items-center gap-2 text-sm text-accent-hover hover:underline focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          <DownloadIcon size={16} />
          {labels.pdfLinkLabel}
        </a>
      </div>
    );
  }

  return (
    <div className="rounded border border-border overflow-auto bg-surface-raised">
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
  );
}
