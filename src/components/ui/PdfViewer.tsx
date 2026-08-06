/**
 * PdfViewer — client-side PDF canvas renderer.
 *
 * ISLAND INTERNALS — this file is "use client" (inherited from the dynamic
 * import in PdfControls). react-pdf uses pdf.js under the hood; it fetches
 * the PDF bytes via the Fetch API (bypassing X-Frame-Options) and renders
 * each page to a <canvas>. No iframe involved.
 *
 * This component is never imported directly. PdfControls loads it via:
 *   dynamic(() => import("./PdfViewer"), { ssr: false })
 *
 * The dynamic import does two things:
 *  1. Excludes ~3 MB of pdf.js from the initial bundle (loaded on demand)
 *  2. ssr: false — prevents the server from attempting to render canvas
 */

"use client";

import { useState, useCallback } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// pdf.js worker — must be served as a static file. Next.js copies files from
// public/ automatically; we point pdfjs at the versioned worker bundle.
// The worker runs in a separate thread so PDF parsing doesn't block the UI.
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

interface PdfViewerProps {
  url: string;
  title: string;
  labels: {
    loading: string;
    error: string;
    pageTemplate: string; // e.g. "Page {current} of {total}"
    previous: string;
    next: string;
  };
}

export function PdfViewer({ url, title, labels }: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [error, setError] = useState(false);

  const onDocumentLoadSuccess = useCallback(
    ({ numPages }: { numPages: number }) => {
      setNumPages(numPages);
      setPageNumber(1);
    },
    [],
  );

  return (
    <div className="flex flex-col items-center gap-4">
      <Document
        file={url}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={() => setError(true)}
        loading={
          <p className="text-sm text-foreground-secondary animate-pulse">
            {labels.loading}
          </p>
        }
        error={
          <p className="text-sm text-red-500">{labels.error}</p>
        }
        aria-label={title}
      >
        {!error && (
          <Page
            pageNumber={pageNumber}
            width={Math.min(680, typeof window !== "undefined" ? window.innerWidth - 48 : 680)}
            renderAnnotationLayer
            renderTextLayer
          />
        )}
      </Document>

      {numPages && numPages > 1 && (
        <nav
          aria-label="PDF page navigation"
          className="flex items-center gap-3 text-sm text-foreground-secondary"
        >
          <button
            type="button"
            onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
            disabled={pageNumber <= 1}
            aria-label={labels.previous}
            className="px-2 py-1 rounded hover:bg-surface-raised disabled:opacity-40 transition-colors"
          >
            ‹
          </button>
          <span>
            {labels.pageTemplate
              .replace("%current%", String(pageNumber))
              .replace("%total%", String(numPages))}
          </span>
          <button
            type="button"
            onClick={() => setPageNumber((p) => Math.min(numPages, p + 1))}
            disabled={pageNumber >= numPages}
            aria-label={labels.next}
            className="px-2 py-1 rounded hover:bg-surface-raised disabled:opacity-40 transition-colors"
          >
            ›
          </button>
        </nav>
      )}
    </div>
  );
}
