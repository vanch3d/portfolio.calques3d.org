import { cn } from "@/lib/utils";

export interface SectionHeaderProps {
  heading: string;
  ruled?: boolean;
  mono?: boolean;
  className?: string;
}

export function SectionHeader({ heading, ruled = false, mono = false, className }: SectionHeaderProps) {
  return (
    <div className={cn("flex items-center gap-4", className)}>
      <h2
        className={cn(
          "shrink-0",
          mono
            ? "font-mono text-xs uppercase tracking-widest text-text-muted"
            : "text-lg font-semibold text-text"
        )}
      >
        {heading}
      </h2>
      {ruled && <div className="flex-1 h-px bg-border" aria-hidden="true" />}
    </div>
  );
}
