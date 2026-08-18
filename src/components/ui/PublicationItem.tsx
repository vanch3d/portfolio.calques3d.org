import type { Publication } from "@/types/content";
import { PdfTriggerButton } from "./pdf-panel/PdfTriggerButton";

export interface PublicationItemLabels {
  abstract: string;
  viewPdfNewTab: string;
  viewPdf?: string;
}

export function PublicationItem({
  pub,
  citationHtml,
  labels,
  pdfMode = "link",
}: {
  pub: Publication;
  citationHtml: string;
  labels: PublicationItemLabels;
  pdfMode?: "link" | "panel";
}) {
  return (
    <li className="py-5">
      <div
        className="text-sm text-text leading-relaxed [&_i]:italic [&_a]:text-accent [&_a]:hover:underline"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: CSL-formatted HTML is generated server-side from structured Zotero data, never from user input
        dangerouslySetInnerHTML={{ __html: citationHtml }}
      />
      <div className="mt-2 flex flex-wrap items-center gap-x-4">
        {pub.doi && (
          <a
            href={`https://doi.org/${pub.doi}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-mono text-xs text-text-muted hover:text-accent transition-colors duration-150"
            aria-label={`DOI: ${pub.doi}`}
          >
            <span aria-hidden="true">↗</span>
            {pub.doi}
          </a>
        )}
        {pub.pdf && pdfMode === "link" && (
          <a
            href={`/publications/${pub.key}/pdf`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-mono text-xs text-text-muted hover:text-accent transition-colors duration-150"
            aria-label={labels.viewPdfNewTab}
          >
            <span aria-hidden="true">↓</span>
            {labels.viewPdfNewTab}
          </a>
        )}
        {pub.pdf && pdfMode === "panel" && labels.viewPdf && (
          <PdfTriggerButton
            pubKey={pub.key}
            footer={pub.title}
            labels={{ viewPdf: labels.viewPdf }}
          />
        )}
      </div>
      {pub.abstract && (
        <details className="mt-2">
          <summary className="cursor-pointer text-xs text-text-muted hover:text-accent transition-colors duration-150">
            {labels.abstract}
          </summary>
          <p className="mt-2 text-xs text-text-muted leading-relaxed">{pub.abstract}</p>
        </details>
      )}
    </li>
  );
}
