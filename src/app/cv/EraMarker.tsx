export interface EraMarkerProps {
  label: string;
  period: string;
}

export function EraMarker({ label, period }: EraMarkerProps) {
  return (
    <li
      className="grid grid-cols-[1px_1fr] items-center gap-x-4 py-6 sm:grid-cols-[6rem_1px_1fr] sm:gap-x-6"
      aria-label={`${label} — ${period}`}
    >
      {/* Empty date column — desktop only */}
      <div className="hidden sm:block" />

      {/* Accent rule column */}
      <div className="self-stretch border-l-2 border-accent" />

      {/* Label */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-xs font-semibold uppercase tracking-widest text-accent-hover">
          {label}
        </span>
        <span className="flex-1 border-t border-border" aria-hidden="true" />
        <span className="text-xs tabular-nums text-foreground-secondary">
          {period}
        </span>
      </div>
    </li>
  );
}
