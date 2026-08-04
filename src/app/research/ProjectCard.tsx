import type { ResearchProject } from "@/types/content";

export function ProjectCard({ project }: { project: ResearchProject }) {
  const endLabel = project.period.end ?? "ongoing";

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
      {project.funding && <p>Funded by {project.funding}</p>}
      <ul>
        {project.tags.map((tag) => (
          <li key={tag}>{tag}</li>
        ))}
      </ul>
    </article>
  );
}
