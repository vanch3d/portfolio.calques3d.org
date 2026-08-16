import { cn } from "@/lib/utils";

export interface PageHeaderProps {
  heading: string;
  tagline?: string;
  meta?: string;
  className?: string;
}

export function PageHeader({ heading, tagline, meta, className }: PageHeaderProps) {
  return (
    <div className={cn("border-b border-border animate-fade-in", className)}>
      <div className="container-page py-10 sm:py-14">
        {meta && (
          <p className="mb-2 font-mono text-xs uppercase tracking-widest text-text-muted tabular-nums">
            {meta}
          </p>
        )}
        <h1 className="text-3xl font-semibold tracking-tight text-text sm:text-4xl">
          {heading}
        </h1>
        {tagline && (
          <p className="mt-3 max-w-[60ch] text-base text-text-muted sm:text-lg">
            {tagline}
          </p>
        )}
      </div>
    </div>
  );
}
