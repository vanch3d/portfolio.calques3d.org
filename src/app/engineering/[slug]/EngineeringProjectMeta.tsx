import type { EngineeringProject } from "@/types/content";
import { Badge } from "@/components/ui/Badge";

export interface EngineeringProjectMetaLabels {
  tagsLabel: string;
  repositoriesLabel: string;
  externalLinksLabel: string;
  liveLabel: string;
}

export function EngineeringProjectMeta({
  project,
  labels,
}: {
  project: EngineeringProject;
  labels: EngineeringProjectMetaLabels;
}) {
  const isPublic = project.visibility === "public";
  const hasGithub = project.links.github && project.links.github.length > 0;
  const hasExternal =
    isPublic && project.links.external && project.links.external.length > 0;
  const hasLive = isPublic && !!project.links.live;

  return (
    <div className="flex flex-col gap-6">
      {project.tags.length > 0 && (
        <section aria-labelledby="meta-tags-heading">
          <h2
            id="meta-tags-heading"
            className="mb-2 text-xs font-medium uppercase tracking-widest text-foreground-secondary"
          >
            {labels.tagsLabel}
          </h2>
          <ul className="flex flex-wrap gap-1.5">
            {project.tags.map((tag) => (
              <li key={tag}>
                <Badge>{tag}</Badge>
              </li>
            ))}
          </ul>
        </section>
      )}

      {hasGithub && (
        <section aria-labelledby="meta-repos-heading">
          <h2
            id="meta-repos-heading"
            className="mb-2 text-xs font-medium uppercase tracking-widest text-foreground-secondary"
          >
            {labels.repositoriesLabel}
          </h2>
          <ul className="flex flex-col gap-1">
            {project.links.github!.map((repo) => (
              <li key={repo}>
                <a
                  href={`https://github.com/${repo}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-accent-hover hover:underline"
                >
                  {repo}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {hasExternal && (
        <section aria-labelledby="meta-links-heading">
          <h2
            id="meta-links-heading"
            className="mb-2 text-xs font-medium uppercase tracking-widest text-foreground-secondary"
          >
            {labels.externalLinksLabel}
          </h2>
          <ul className="flex flex-col gap-1">
            {project.links.external!.map((url) => (
              <li key={url}>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-accent-hover hover:underline"
                >
                  {url}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {hasLive && (
        <section aria-labelledby="meta-live-heading">
          <h2
            id="meta-live-heading"
            className="mb-2 text-xs font-medium uppercase tracking-widest text-foreground-secondary"
          >
            {labels.liveLabel}
          </h2>
          <a
            href={project.links.live}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-accent-hover hover:underline"
          >
            {project.links.live}
          </a>
        </section>
      )}
    </div>
  );
}
