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
    <li>
      <p>
        {pub.authors.join(", ")} ({pub.year})
      </p>
      <p>
        {pub.doi ? (
          <a
            href={`https://doi.org/${pub.doi}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {pub.title}
          </a>
        ) : (
          pub.title
        )}
      </p>
      {pub.venue && <p>{pub.venue}</p>}
      {pub.abstract && (
        <details>
          <summary>{abstractLabel}</summary>
          <p>{pub.abstract}</p>
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
    <section aria-labelledby="publications-heading">
      <h2 id="publications-heading">{labels.heading}</h2>
      <ul>
        {publications.map((pub) => (
          <PublicationItem
            key={pub.key}
            pub={pub}
            abstractLabel={labels.abstract}
          />
        ))}
      </ul>
    </section>
  );
}
