type SectionLabelProps = {
  children: React.ReactNode;
  id?: string;
};

export function SectionLabel({ children, id }: SectionLabelProps) {
  return (
    <p
      id={id}
      className="label"
      style={{ marginBottom: "var(--space-sm)" }}
    >
      {children}
    </p>
  );
}
