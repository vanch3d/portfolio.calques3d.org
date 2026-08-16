import type { Publication } from "@/types/content";

export interface PublicationItemLabels {
  abstract: string;
}

export interface PublicationItemProps {
  pub: Publication;
  labels: PublicationItemLabels;
}

export function PublicationItem({ pub, labels }: PublicationItemProps) {
  return (
    <li className="py-5">
      <p className="text-xs font-mono text-text-muted tabular-nums">
        {pub.authors.join(", ")} · {pub.year}
      </p>
      <p className="mt-1 text-sm font-medium text-text leading-snug">
        {pub.doi ? (
          <a
            href={`https://doi.org/${pub.doi}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-accent transition-colors duration-150"
          >
            {pub.title}
          </a>
        ) : (
          pub.title
        )}
      </p>
      {pub.venue && (
        <p className="mt-0.5 text-xs text-text-muted italic">{pub.venue}</p>
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
