type LabTagProps = {
  children: React.ReactNode;
  /** Optional semantic label — used as aria-label when the tag is context-specific */
  label?: string;
};

export function LabTag({ children, label }: LabTagProps) {
  return (
    <span
      className="label"
      aria-label={label}
      style={{
        display: "inline-block",
        border: "var(--line-ghost) solid var(--color-ink-ghost)",
        padding: "var(--space-2xs) var(--space-xs)",
        cursor: "default",
        background: "transparent",
      }}
    >
      {children}
    </span>
  );
}
