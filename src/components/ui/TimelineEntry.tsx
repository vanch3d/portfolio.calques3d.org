import { cn } from "@/lib/utils";
import { joinParts, formatPeriod } from "@/lib/format";
import { Tag } from "./Tag";
import { Badge } from "./Badge";
import type { Position } from "@/types/content";

export interface TimelineEntryLabels {
  ongoing: string;
  typeLabel: string;
}

export interface TimelineEntryProps {
  position: Position;
  labels: TimelineEntryLabels;
  className?: string;
}

export function TimelineEntry({ position, labels, className }: TimelineEntryProps) {
  const { title, organisation, department, location, period, tags, description, sites } =
    position;

  const periodStr = formatPeriod(
    period.start.slice(0, 7),
    period.end?.slice(0, 7),
    labels.ongoing
  );

  return (
    <li className={cn("relative pl-8", className)}>
      <div
        aria-hidden="true"
        className="absolute -left-[7px] top-1.5 h-3 w-3 rounded-full bg-accent ring-2 ring-bg"
      />

      <div className="flex items-start justify-between gap-4">
        <h3 className="font-semibold text-text leading-snug">{title}</h3>
        <Badge variant="outline" className="shrink-0 text-xs">
          {labels.typeLabel}
        </Badge>
      </div>

      <p className="mt-0.5 text-sm text-text-muted">
        {joinParts([organisation, department])}
      </p>

      <p className="mt-0.5 font-mono text-xs tabular-nums text-text-muted">
        {joinParts([periodStr, location])}
      </p>

      {sites && sites.length > 0 && (
        <ul className="mt-1 space-y-0.5" aria-label="Sites">
          {sites.map((site) => (
            <li key={site.institution} className="font-mono text-xs text-text-muted">
              {joinParts([
                site.institution,
                site.location,
                formatPeriod(
                  site.period.start.slice(0, 7),
                  site.period.end?.slice(0, 7),
                  labels.ongoing
                ),
              ])}
            </li>
          ))}
        </ul>
      )}

      {description && (
        <p className="mt-2 text-sm text-text-muted leading-relaxed">{description}</p>
      )}

      {tags.length > 0 && (
        <ul className="mt-2 flex flex-wrap gap-1" aria-label="Skills used">
          {tags.map((tag) => (
            <li key={tag}>
              <Tag variant="mono">{tag}</Tag>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}
