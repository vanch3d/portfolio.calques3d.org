import type { ResearchProject } from "@/types/content";

export interface ProjectHeaderLabels {
  period: string;
}

export function ProjectHeader({
  project,
  labels,
}: {
  project: ResearchProject;
  labels: ProjectHeaderLabels;
}) {
  return (
    <header className="border-b border-border">
      <div className="container-page py-10 sm:py-14">
        <p className="mb-2 font-mono text-xs uppercase tracking-widest text-text-muted tabular-nums">
          {labels.period}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-text sm:text-4xl">
          {project.title}
        </h1>
        {project.abbr && (
          <p className="mt-1 font-mono text-sm text-text-muted">{project.abbr}</p>
        )}
        {project.description && (
          <p className="mt-3 max-w-[60ch] text-base text-text-muted sm:text-lg">
            {project.description}
          </p>
        )}
      </div>
    </header>
  );
}
