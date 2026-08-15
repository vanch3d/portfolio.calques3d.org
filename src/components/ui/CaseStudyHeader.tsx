import { joinParts, formatPeriod } from "@/lib/format";
import { DeliverableBadge } from "./DeliverableBadge";
import type { EngineeringProject } from "@/types/content";

export interface CaseStudyHeaderLabels {
  ongoing: string;
  visibilityLabel: string;
}

export function CaseStudyHeader({
  project,
  labels,
}: {
  project: EngineeringProject;
  labels: CaseStudyHeaderLabels;
}) {
  const periodStr = formatPeriod(
    project.period.start.slice(0, 7),
    project.period.end?.slice(0, 7),
    labels.ongoing
  );

  return (
    <header className="border-b border-border">
      <div className="container-page py-10 sm:py-14">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="mb-2 font-mono text-xs uppercase tracking-widest text-text-muted tabular-nums">
              {periodStr}
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-text sm:text-4xl">
              {project.title}
            </h1>
            {(project.role_title || project.client) && (
              <p className="mt-2 text-base text-text-muted">
                {joinParts([project.role_title, project.client])}
              </p>
            )}
          </div>
          <DeliverableBadge
            visibility={project.visibility}
            label={labels.visibilityLabel}
            className="mt-1 shrink-0"
          />
        </div>
        {project.description && (
          <p className="mt-4 max-w-[60ch] text-base text-text-muted sm:text-lg">
            {project.description}
          </p>
        )}
      </div>
    </header>
  );
}
