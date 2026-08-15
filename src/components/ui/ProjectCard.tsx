import Link from "next/link";
import { cn } from "@/lib/utils";
import { Tag } from "./Tag";
import { Badge } from "./Badge";
import type { ProjectBase, ProjectVisibility } from "@/types/content";

// ─── Labels ──────────────────────────────────────────────────────────────────

export interface ProjectCardLabels {
  ongoing: string;
  visibilityPublic?: string;
  visibilityProprietary?: string;
  visibilityRedacted?: string;
}

// ─── Variant ─────────────────────────────────────────────────────────────────

const PROJECT_CARD_VARIANT = {
  default: "default",
  mini: "mini",
} as const;

export type ProjectCardVariant = keyof typeof PROJECT_CARD_VARIANT;

// ─── Visibility tier styling ──────────────────────────────────────────────────

const VISIBILITY_BORDER: Record<ProjectVisibility, string> = {
  public: "border-l-2 border-l-accent",
  proprietary: "border-l-2 border-l-border",
  redacted: "border-l-2 border-l-border opacity-70",
};

const VISIBILITY_LABEL_KEY: Record<ProjectVisibility, keyof ProjectCardLabels> = {
  public: "visibilityPublic",
  proprietary: "visibilityProprietary",
  redacted: "visibilityRedacted",
};

function visibilityLabel(
  visibility: ProjectVisibility,
  labels: ProjectCardLabels
): string | undefined {
  return labels[VISIBILITY_LABEL_KEY[visibility]];
}

// ─── Component ───────────────────────────────────────────────────────────────

export interface ProjectCardProps {
  project: ProjectBase;
  variant?: ProjectCardVariant;
  basePath: string; // "/research" or "/engineering"
  labels: ProjectCardLabels;
  className?: string;
}

export function ProjectCard({
  project,
  variant = "default",
  basePath,
  labels,
  className,
}: ProjectCardProps) {
  const { slug, title, abbr, period, tags, description, visibility } = project;
  const endLabel = period.end ?? labels.ongoing;
  const href = visibility !== "redacted" ? `${basePath}/${slug}` : undefined;
  const vLabel = visibilityLabel(visibility, labels);
  const displayTags = tags.slice(0, variant === "mini" ? 2 : 3);

  if (variant === "mini") {
    return (
      <article
        className={cn(
          "flex flex-col gap-2 rounded-md border border-border bg-surface p-4",
          VISIBILITY_BORDER[visibility],
          className
        )}
      >
        <div className="flex items-start justify-between gap-2">
          <div>
            {href ? (
              <Link
                href={href}
                className="font-semibold text-text hover:text-accent hover:underline"
              >
                {abbr ?? title}
              </Link>
            ) : (
              <span className="font-semibold text-text">{abbr ?? title}</span>
            )}
            <p className="font-mono text-xs tabular-nums text-text-muted">
              {period.start}–{endLabel}
            </p>
          </div>
          {vLabel && (
            <Badge variant="outline" className="shrink-0 text-xs">
              {vLabel}
            </Badge>
          )}
        </div>
        {displayTags.length > 0 && (
          <ul className="flex flex-wrap gap-1" aria-label="Tags">
            {displayTags.map((tag) => (
              <li key={tag}>
                <Tag variant="mono">{tag}</Tag>
              </li>
            ))}
          </ul>
        )}
      </article>
    );
  }

  // default variant
  return (
    <article
      className={cn(
        "flex flex-col gap-3 rounded-lg border border-border bg-surface p-6",
        VISIBILITY_BORDER[visibility],
        className
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          {href ? (
            <Link
              href={href}
              className="text-lg font-semibold text-text hover:text-accent hover:underline"
            >
              {title}
            </Link>
          ) : (
            <span className="text-lg font-semibold text-text">{title}</span>
          )}
          {abbr && abbr !== title && (
            <span className="ml-2 font-mono text-xs text-text-muted">{abbr}</span>
          )}
        </div>
        {vLabel && (
          <Badge variant="outline" className="shrink-0">
            {vLabel}
          </Badge>
        )}
      </div>

      <p className="font-mono text-xs tabular-nums text-text-muted">
        {period.start}–{endLabel}
      </p>

      {description && (
        <p className="text-sm text-text-muted">{description}</p>
      )}

      {displayTags.length > 0 && (
        <ul className="flex flex-wrap gap-1.5" aria-label="Tags">
          {displayTags.map((tag) => (
            <li key={tag}>
              <Tag variant="default">{tag}</Tag>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
