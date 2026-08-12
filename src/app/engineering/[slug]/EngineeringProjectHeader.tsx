import type { EngineeringProject } from "@/types/content";
import { Badge } from "@/components/ui/Badge";

export interface EngineeringProjectHeaderLabels {
  ongoing: string;
  periodLabel: string;
  roleLabel: string;
  clientLabel: string;
  tagsLabel: string;
  repositoriesLabel: string;
  externalLinksLabel: string;
  liveLabel: string;
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
  const isPublic = project.visibility === "public";

  const hasGithub = project.links.github && project.links.github.length > 0;
  const hasExternal = isPublic && project.links.external && project.links.external.length > 0;
  const hasLive = isPublic && !!project.links.live;
  const hasLinks = hasGithub || hasExternal || hasLive;

  return (
    <header className="mt-8 border-b border-border pb-8">
      <h1 className="text-3xl font-semibold tracking-tight text-foreground">
        {project.title}
      </h1>

      {(project.role_title ?? project.client) && (
        <p className="mt-1 text-base text-foreground-secondary">
          {[project.role_title, project.client].filter(Boolean).join(" · ")}
        </p>
      )}

      <dl className="mt-4 flex flex-wrap gap-x-8 gap-y-2 text-sm">
        <div className="flex gap-2">
          <dt className="font-medium text-foreground">{labels.periodLabel}</dt>
          <dd className="text-foreground-secondary">{period}</dd>
        </div>
        {project.role_title && (
          <div className="flex gap-2">
            <dt className="font-medium text-foreground">{labels.roleLabel}</dt>
            <dd className="text-foreground-secondary">{project.role_title}</dd>
          </div>
        )}
        {project.client && (
          <div className="flex gap-2">
            <dt className="font-medium text-foreground">{labels.clientLabel}</dt>
            <dd className="text-foreground-secondary">{project.client}</dd>
          </div>
        )}
      </dl>

      {project.tags.length > 0 && (
        <div className="mt-4">
          <p className="mb-2 text-xs font-medium uppercase tracking-widest text-foreground-secondary">
            {labels.tagsLabel}
          </p>
          <ul className="flex flex-wrap gap-1.5">
            {project.tags.map((tag) => (
              <li key={tag}>
                <Badge>{tag}</Badge>
              </li>
            ))}
          </ul>
        </div>
      )}

      {hasLinks && (
        <div className="mt-6 flex flex-wrap gap-6 text-sm">
          {hasGithub && (
            <div>
              <p className="mb-1.5 text-xs font-medium uppercase tracking-widest text-foreground-secondary">
                {labels.repositoriesLabel}
              </p>
              <ul className="flex flex-col gap-1">
                {project.links.github!.map((repo) => (
                  <li key={repo}>
                    <a
                      href={`https://github.com/${repo}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-accent-hover hover:underline"
                    >
                      {repo}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {hasExternal && (
            <div>
              <p className="mb-1.5 text-xs font-medium uppercase tracking-widest text-foreground-secondary">
                {labels.externalLinksLabel}
              </p>
              <ul className="flex flex-col gap-1">
                {project.links.external!.map((url) => (
                  <li key={url}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-accent-hover hover:underline"
                    >
                      {url}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {hasLive && (
            <div>
              <p className="mb-1.5 text-xs font-medium uppercase tracking-widest text-foreground-secondary">
                {labels.liveLabel}
              </p>
              <a
                href={project.links.live}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-accent-hover hover:underline"
              >
                {project.links.live}
              </a>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
