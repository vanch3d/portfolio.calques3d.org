import type { Publication, PublicationType } from "@/types/content";

export interface PublicationCardLabels {
  doi: string;
  types: Record<PublicationType, string>;
}

export interface PublicationCardProps {
  pub: Publication;
  citationHtml: string;
  labels: PublicationCardLabels;
}

export function PublicationCard({ pub, citationHtml, labels }: PublicationCardProps) {
  return (
    <article
      aria-label={pub.title}
      className="py-5 animate-reveal-up"
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 shrink-0 font-mono text-xs uppercase tracking-widest text-text-muted">
          {labels.types[pub.type]}
        </span>
      </div>
      <div
        className="mt-1 text-sm text-text leading-relaxed [&_i]:italic [&_a]:text-accent [&_a]:hover:underline"
        /* biome-ignore lint/security/noDangerouslySetInnerHtml: CSL-formatted HTML is generated server-side from structured data, never from user input */
        dangerouslySetInnerHTML={{ __html: citationHtml }}
      />
      {pub.doi && (
        <a
          href={`https://doi.org/${pub.doi}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex items-center gap-1 font-mono text-xs text-text-muted hover:text-accent transition-colors duration-150"
          aria-label={`${labels.doi}: ${pub.doi}`}
        >
          <span aria-hidden="true">↗</span>
          {pub.doi}
        </a>
      )}
    </article>
  );
}
