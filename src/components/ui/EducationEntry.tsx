import { cn } from "@/lib/utils";
import { joinParts, formatPeriod } from "@/lib/format";
import type { EducationRecord } from "@/types/content";

export interface EducationEntryProps {
  entry: EducationRecord;
  className?: string;
}

export function EducationEntry({ entry, className }: EducationEntryProps) {
  const { degree, institution, location, period, description } = entry;

  return (
    <div className={cn("py-6 first:pt-0 last:pb-0", className)}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-semibold text-text">{degree}</h3>
          <p className="mt-0.5 text-sm text-text-muted">
            {joinParts([institution, location])}
          </p>
        </div>
        <p className="shrink-0 font-mono text-xs tabular-nums text-text-muted">
          {formatPeriod(period.start.slice(0, 4), period.end.slice(0, 4), "")}
        </p>
      </div>
      {description && (
        <p className="mt-2 text-sm text-text-muted leading-relaxed">{description}</p>
      )}
    </div>
  );
}
