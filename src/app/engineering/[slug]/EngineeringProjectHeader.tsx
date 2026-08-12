import type { EngineeringProject } from "@/types/content";

export interface EngineeringProjectHeaderLabels {
  ongoing: string;
}

export function EngineeringProjectHeader({
  project,
  labels,
}: {
  project: EngineeringProject;
  labels: EngineeringProjectHeaderLabels;
}) {
  const endLabel = project.period.end ?? labels.ongoing;
  const period = `${project.period.start}–${endLabel}`;

  return (
    <header className="mt-8 border-b border-border pb-6">
      <h1 className="text-3xl font-semibold tracking-tight text-foreground">
        {project.title}
      </h1>
      {(project.role_title ?? project.client) && (
        <p className="mt-1 text-base text-foreground-secondary">
          {[project.role_title, project.client].filter(Boolean).join(" · ")}
        </p>
      )}
      <p className="mt-3 text-sm text-foreground-secondary">{period}</p>
    </header>
  );
}
