import type { Publication, PublicationType } from "@/types/content";
import { Badge } from "@/components/ui/Badge";
import { DownloadIcon } from "@/components/ui/icons";

export interface PublicationCardLabels {
  abstract: string;
  showAbstract: string;
  hideAbstract: string;
  doiLinkLabel: string;
  pdfLinkLabel: string;
  pdfDownloadLabel: string;
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
        {(publication.doi || publication.pdf) && (
          <div className="flex items-center gap-3 text-xs">
            {publication.doi && (
              <a
                href={`https://doi.org/${publication.doi}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${labels.doiLinkLabel}: ${publication.title}`}
                className="text-accent-hover hover:underline focus-visible:outline-2 focus-visible:outline-offset-2"
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
        )}

        {/* Abstract */}
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
