import type { Publication } from "@/types/content";

function PublicationItem({ pub }: { pub: Publication }) {
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
          <summary>Abstract</summary>
          <p>{pub.abstract}</p>
        </details>
      )}
    </li>
  );
}

export function PublicationsList({
  publications,
}: {
  publications: Publication[];
}) {
  if (publications.length === 0) return null;

  return (
    <section aria-labelledby="publications-heading">
      <h2 id="publications-heading">Publications</h2>
      <ul>
        {publications.map((pub) => (
          <PublicationItem key={pub.key} pub={pub} />
        ))}
      </ul>
    </section>
  );
}
