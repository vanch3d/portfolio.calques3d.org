type LabRegisterHeaderProps = {
  /** Left column — Departure Mono uppercase label (e.g. "ARCHITECTURE DECISION RECORDS") */
  leftLabel: string;
  /** Centre column — STIX Two italic register title (e.g. "Revision Register — Portfolio Build") */
  title: string;
  /** Right column — lines of Departure Mono tabular metadata */
  metadata: string[];
};

export function LabRegisterHeader({ leftLabel, title, metadata }: LabRegisterHeaderProps) {
  return (
    <header
      role="banner"
      className="rule-heavy-x"
      style={{
        padding: "var(--space-sm) 0",
        marginBottom: "var(--space-xl)",
        display: "grid",
        gridTemplateColumns: "1fr auto 1fr",
        alignItems: "center",
        gap: "var(--space-lg)",
      }}
    >
      <p className="label" style={{ margin: 0, lineHeight: "var(--leading-label)" }}>
        {leftLabel}
      </p>

      <h1
        className="title-italic text-ink"
        style={{
          fontSize: "var(--text-title)",
          whiteSpace: "nowrap",
          textAlign: "center",
          margin: 0,
        }}
      >
        {title}
      </h1>

      <div
        className="label"
        style={{
          textAlign: "right",
          lineHeight: "var(--leading-label)",
        }}
      >
        {metadata.map((line, i) => (
          <span key={i} style={{ display: "block" }}>
            {line}
          </span>
        ))}
      </div>
    </header>
  );
}
