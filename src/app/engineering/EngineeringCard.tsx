import type { EngineeringProject } from "@/types/content";
import { Badge } from "@/components/ui/Badge";

export interface EngineeringCardLabels {
  ongoing: string;
  visibilityPublic: string;
  visibilityProprietary: string;
  visibilityRedacted: string;
  cardLinkLabel: string;
}

export function EngineeringCard({
  project,
  labels,
}: {
  project: EngineeringProject;
  labels: EngineeringCardLabels;
}) {
  const endLabel = project.period.end ?? labels.ongoing;
  const period = `${project.period.start}–${endLabel}`;
  const linkable = project.visibility !== "redacted";
  const href = `/engineering/${project.slug}`;

  const visibilityLabel =
    project.visibility === "public"
      ? labels.visibilityPublic
      : project.visibility === "proprietary"
        ? labels.visibilityProprietary
        : labels.visibilityRedacted;

  const visibilityVariant: "default" | "type" =
    project.visibility === "public" ? "default" : "type";

  return (
    <article className="flex flex-col gap-3 rounded border border-border bg-surface-raised p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          {linkable ? (
            <a
              href={href}
              className="group text-foreground hover:text-accent-hover"
            >
              <h2 className="text-xl font-semibold group-hover:underline">
                {project.title}
              </h2>
            </a>
          ) : (
            <h2 className="text-xl font-semibold text-foreground">
              {project.title}
            </h2>
          )}
          {(project.role_title ?? project.client) && (
            <p className="mt-0.5 text-sm text-foreground-secondary">
              {[project.role_title, project.client].filter(Boolean).join(" · ")}
            </p>
          )}
        </div>
        <Badge variant={visibilityVariant}>{visibilityLabel}</Badge>
      </div>

      <p className="text-sm text-foreground-secondary">{period}</p>

      {project.highlights && project.highlights.length > 0 && (
        <ul className="flex flex-col gap-1">
          {project.highlights.slice(0, 3).map((h) => (
            <li
              key={h}
              className="flex items-start gap-2 text-sm text-foreground-secondary"
            >
              <span aria-hidden="true" className="mt-1 shrink-0 text-accent">
                ›
              </span>
              {h}
            </li>
          ))}
        </ul>
      )}

      <ul className="flex flex-wrap gap-1.5">
        {project.tags.map((tag) => (
          <li key={tag}>
            <Badge>{tag}</Badge>
          </li>
        ))}
      </ul>

      {linkable && (
        <a
          href={href}
          className="self-start text-sm font-medium text-accent-hover hover:underline"
        >
          {labels.cardLinkLabel} →
        </a>
      )}
    </article>
  );
}
