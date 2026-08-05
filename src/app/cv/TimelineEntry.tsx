import { Badge } from "@/components/ui/Badge";
import type { Position, PositionType } from "@/types/content";

export interface TimelineEntryLabels {
  ongoing: string;
  typeLabel: (type: PositionType) => string;
}

export interface TimelineEntryProps {
  position: Position;
  labels: TimelineEntryLabels;
}

function formatPeriod(start: string, end: string | null, ongoing: string): string {
  const startYear = start.slice(0, 4);
  const endLabel = end ? end.slice(0, 4) : ongoing;
  return `${startYear}–${endLabel}`;
}

export function TimelineEntry({ position, labels }: TimelineEntryProps) {
  const period = formatPeriod(position.period.start, position.period.end, labels.ongoing);

  return (
    <li className="grid grid-cols-[1px_1fr] items-start gap-x-4 sm:grid-cols-[6rem_1px_1fr] sm:gap-x-6">
      {/* Period column — desktop only */}
      <div className="hidden pt-0.5 text-right sm:block">
        <span className="text-sm tabular-nums text-foreground-secondary">
          {period}
        </span>
      </div>

      {/* Vertical rule + dot */}
      <div className="relative flex flex-col items-center self-stretch">
        <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full border-2 border-accent bg-background" />
        <div className="mt-1 flex-1 border-l border-border" />
      </div>

      {/* Content column */}
      <div className="pb-10">
        {/* Period inline — mobile only */}
        <p className="mb-1 text-xs tabular-nums text-foreground-secondary sm:hidden">
          {period}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="type">{labels.typeLabel(position.type)}</Badge>
        </div>
        <h3 className="mt-2 text-base font-semibold text-foreground">
          {position.title}
        </h3>
        <p className="mt-0.5 text-sm text-foreground-secondary">
          {position.organisation}
          {position.department ? ` · ${position.department}` : ""}
        </p>
        <p className="text-sm text-foreground-secondary">{position.location}</p>
        {position.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {position.tags.map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>
        )}
      </div>
    </li>
  );
}
