import { cn } from "@/lib/utils";

type DecisionRow = { label: string; note: string };

type MoleculeFrameProps = {
  name: string;
  description: string;
  decisions: DecisionRow[];
  children: React.ReactNode;
  className?: string;
};

export function MoleculeFrame({
  name,
  description,
  decisions,
  children,
  className,
}: MoleculeFrameProps) {
  return (
    <div className={cn("mb-2xl", className)} data-testid="molecule-frame">
      <p className="label text-ink-secondary mb-xs" data-testid="molecule-frame-name">
        {name}
      </p>

      <div className="border-t-heavy border-ink">
        <div className="py-lg border-b-medium border-ink-ghost" data-testid="molecule-frame-specimen">
          {children}
        </div>
      </div>

      <p
        className="font-body text-caption leading-body text-ink-secondary mt-md mb-sm"
        data-testid="molecule-frame-description"
      >
        {description}
      </p>

      {decisions.length > 0 && (
        <ul
          className="flex flex-col gap-xs mt-sm"
          data-testid="molecule-frame-decisions"
          aria-label="Key design decisions"
        >
          {decisions.map(({ label, note }) => (
            <li key={label} className="flex gap-sm items-baseline">
              <span className="label text-ink-secondary shrink-0" data-testid="decision-label">
                {"\u2192"} {label}:
              </span>
              <span
                className="font-body text-caption leading-body text-ink-secondary"
                data-testid="decision-note"
              >
                {note}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
