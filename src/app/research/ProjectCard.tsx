import type { ResearchProject } from "@/types/content";

export interface ProjectCardLabels {
  fundedBy: (funder: string) => string;
  ongoing: string;
}

export function ProjectCard({
  project,
  labels,
}: {
  project: ResearchProject;
  labels: ProjectCardLabels;
}) {
  const endLabel = project.period.end ?? labels.ongoing;

  return (
    <article>
      <a href={`/research/${project.slug}`}>
        <h2>{project.title}</h2>
        {project.abbr && <span>{project.abbr}</span>}
      </a>
      <p>
        {project.period.start}–{endLabel}
        {project.institution && ` · ${project.institution}`}
      </p>
      {project.funding && <p>{labels.fundedBy(project.funding)}</p>}
      <ul>
        {project.tags.map((tag) => (
          <li key={tag}>{tag}</li>
        ))}
      </ul>
    </article>
  );
}
