export type PropRow = {
  name: string;
  type: string;
  required: boolean;
  defaultValue?: string;
  notes: string;
};

type PropsTableProps = { rows: PropRow[] };

export function PropsTable({ rows }: PropsTableProps) {
  return (
    <div className="overflow-x-auto" role="region" aria-label="Props API table" tabIndex={0}>
      <table
        className="table-fixed w-full border-collapse font-label"
        data-testid="props-table"
      >
        <thead>
          <tr className="border-b-heavy border-ink text-left">
            <th
              scope="col"
              className="label text-ink-secondary font-normal w-32 py-sm pr-md"
            >
              NAME
            </th>
            <th
              scope="col"
              className="label text-ink-secondary font-normal w-56 py-sm pr-md"
            >
              TYPE
            </th>
            <th
              scope="col"
              className="label text-ink-secondary font-normal w-16 py-sm pr-md"
            >
              REQ
            </th>
            <th
              scope="col"
              className="label text-ink-secondary font-normal w-24 py-sm pr-md"
            >
              DEFAULT
            </th>
            <th
              scope="col"
              className="label text-ink-secondary font-normal py-sm"
            >
              NOTES
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.name}
              className="border-b-ghost border-ink-ghost"
              data-testid={`prop-row-${row.name}`}
            >
              <td className="label text-ink py-sm pr-md">{row.name}</td>
              <td className="label text-ink-secondary py-sm pr-md break-all">{row.type}</td>
              <td
                className={row.required ? "label active-mark py-sm pr-md" : "label text-ink-ghost py-sm pr-md"}
                data-testid={`prop-req-${row.name}`}
                aria-label={row.required ? "required" : "optional"}
              >
                {row.required ? "YES" : "—"}
              </td>
              <td className="label text-ink-secondary py-sm pr-md">
                {row.defaultValue ?? "—"}
              </td>
              <td className="font-body text-caption leading-body text-ink-secondary py-sm">
                {row.notes}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
