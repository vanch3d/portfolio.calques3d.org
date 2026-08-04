import type { ResearchProject } from "@/types/content";

export interface ProjectHeaderLabels {
  ongoing: string;
  periodLabel: string;
  institutionLabel: string;
  fundingLabel: string;
  topicsLabel: string;
  repositoriesLabel: string;
}

export function ProjectHeader({
  project,
  labels,
}: {
  project: ResearchProject;
  labels: ProjectHeaderLabels;
}) {
  const endLabel = project.period.end ?? labels.ongoing;

  return (
    <header>
      <h1>{project.title}</h1>
      {project.abbr && <p>{project.abbr}</p>}

      <dl>
        <dt>{labels.periodLabel}</dt>
        <dd>
          {project.period.start}–{endLabel}
        </dd>

        {project.institution && (
          <>
            <dt>{labels.institutionLabel}</dt>
            <dd>{project.institution}</dd>
          </>
        )}

        {project.funding && (
          <>
            <dt>{labels.fundingLabel}</dt>
            <dd>{project.funding}</dd>
          </>
        )}
      </dl>

      {project.tags.length > 0 && (
        <ul aria-label={labels.topicsLabel}>
          {project.tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
      )}

      {project.links.github && project.links.github.length > 0 && (
        <section aria-label={labels.repositoriesLabel}>
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
