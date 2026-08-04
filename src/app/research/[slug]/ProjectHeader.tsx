import type { ResearchProject } from "@/types/content";

export function ProjectHeader({ project }: { project: ResearchProject }) {
  const endLabel = project.period.end ?? "ongoing";

  return (
    <header>
      <h1>{project.title}</h1>
      {project.abbr && <p>{project.abbr}</p>}

      <dl>
        <dt>Period</dt>
        <dd>
          {project.period.start}–{endLabel}
        </dd>

        {project.institution && (
          <>
            <dt>Institution</dt>
            <dd>{project.institution}</dd>
          </>
        )}

        {project.funding && (
          <>
            <dt>Funding</dt>
            <dd>{project.funding}</dd>
          </>
        )}
      </dl>

      {project.tags.length > 0 && (
        <ul aria-label="Topics">
          {project.tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
      )}

      {project.links.github && project.links.github.length > 0 && (
        <section aria-label="Repositories">
          <ul>
            {project.links.github.map((repo) => (
              <li key={repo}>
                <a
                  href={`https://github.com/${repo}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {repo}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
    </header>
  );
}
