import type { Publication } from "@/types/content";

export interface PublicationItemLabels {
  abstract: string;
}

export interface PublicationItemProps {
  pub: Publication;
  citationHtml: string;
  labels: PublicationItemLabels;
}

export function PublicationItem({ pub, citationHtml, labels }: PublicationItemProps) {
  return (
    <li className="py-5">
      <div
        className="text-sm text-text leading-relaxed [&_i]:italic [&_a]:text-accent [&_a]:hover:underline"
        /* biome-ignore lint/security/noDangerouslySetInnerHtml: CSL-formatted HTML is generated server-side from structured Zotero data, never from user input */
        dangerouslySetInnerHTML={{ __html: citationHtml }}
      />
      {pub.doi && (
        <a
          href={`https://doi.org/${pub.doi}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 inline-block font-mono text-xs text-text-muted hover:text-accent transition-colors duration-150"
          aria-label={`DOI: ${pub.doi}`}
        >
          ↗ {pub.doi}
        </a>
      )}
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
