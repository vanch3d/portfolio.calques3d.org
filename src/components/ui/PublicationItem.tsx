import type { Publication } from "@/types/content";
import { PdfPanel, type PdfPanelLabels } from "./PdfPanel";

export interface PublicationItemLabels extends PdfPanelLabels {
  abstract: string;
}

export interface PublicationItemProps {
  pub: Publication;
  citationHtml: string;
  labels: PublicationItemLabels;
}

export function PublicationItem({ pub, citationHtml, labels }: PublicationItemProps) {
  const { abstract, ...pdfLabels } = labels;

  return (
    <li className="py-5">
      <div
        className="text-sm text-text leading-relaxed [&_i]:italic [&_a]:text-accent [&_a]:hover:underline"
        /* biome-ignore lint/security/noDangerouslySetInnerHtml: CSL-formatted HTML is generated server-side from structured Zotero data, never from user input */
        dangerouslySetInnerHTML={{ __html: citationHtml }}
      />
      <div className="mt-1 flex flex-wrap items-center gap-x-4">
        {pub.doi && (
          <a
            href={`https://doi.org/${pub.doi}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs text-text-muted hover:text-accent transition-colors duration-150"
            aria-label={`DOI: ${pub.doi}`}
          >
            ↗ {pub.doi}
          </a>
        )}
        {pub.pdf && <PdfPanel filename={pub.pdf} labels={pdfLabels} />}
      </div>
      {pub.abstract && (
        <details className="mt-2">
          <summary className="cursor-pointer text-xs text-text-muted hover:text-accent transition-colors duration-150">
            {abstract}
          </summary>
          <p className="mt-2 text-xs text-text-muted leading-relaxed">{pub.abstract}</p>
        </details>
      )}
    </li>
  );
}
