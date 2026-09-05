type RegisterTableHeadColumn = {
  key: string;
  label: string;
  align?: "left" | "right" | "center";
};

type RegisterTableHeadProps = {
  columns: RegisterTableHeadColumn[];
};

export function RegisterTableHead({ columns }: RegisterTableHeadProps) {
  return (
    <thead>
      <tr style={{ borderBottom: "var(--line-heavy) solid var(--color-ink)" }}>
        {columns.map((col) => (
          <th
            key={col.key}
            scope="col"
            className="label"
            style={{
              fontWeight: 400,
              textAlign: col.align ?? "left",
              padding: "var(--space-sm) var(--space-sm) var(--space-sm) 0",
              verticalAlign: "bottom",
            }}
          >
            {col.label}
          </th>
        ))}
      </tr>
    </thead>
  );
}
