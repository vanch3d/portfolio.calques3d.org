import type { Publication } from "@/types/content";

export interface PublicationsListLabels {
  heading: string;
  abstract: string;
}

function PublicationItem({
  pub,
  abstractLabel,
}: {
  pub: Publication;
  abstractLabel: string;
}) {
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
            {abstractLabel}
          </summary>
          <p className="mt-2 text-xs text-text-muted leading-relaxed">{pub.abstract}</p>
        </details>
      )}
    </li>
  );
}

export function PublicationsList({
  publications,
  labels,
}: {
  publications: Publication[];
  labels: PublicationsListLabels;
}) {
  if (publications.length === 0) return null;

  return (
    <section
      aria-labelledby="publications-heading"
      className="border-t border-border"
    >
      <div className="container-page py-10">
        <h2
          id="publications-heading"
          className="text-xl font-semibold text-text"
        >
          {labels.heading}
        </h2>
        <ul className="mt-4 divide-y divide-border">
          {publications.map((pub) => (
            <PublicationItem
              key={pub.key}
              pub={pub}
              abstractLabel={labels.abstract}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}
