export type PropRow = {
  name: string
  type: string
  required: boolean
  defaultValue?: string
  notes: string
}

type PropsTableProps = { rows: PropRow[] }

export function PropsTable({ rows }: PropsTableProps) {
  return (
    <div className="overflow-x-auto" role="region" aria-label="Props API table" tabIndex={0}>
      <table className="w-full table-fixed border-collapse font-label" data-testid="props-table">
        <thead>
          <tr className="border-b-heavy border-ink text-left">
            <th scope="col" className="w-32 py-sm pr-md label font-normal text-ink-secondary">
              NAME
            </th>
            <th scope="col" className="w-56 py-sm pr-md label font-normal text-ink-secondary">
              TYPE
            </th>
            <th scope="col" className="w-16 py-sm pr-md label font-normal text-ink-secondary">
              REQ
            </th>
            <th scope="col" className="w-24 py-sm pr-md label font-normal text-ink-secondary">
              DEFAULT
            </th>
            <th scope="col" className="py-sm label font-normal text-ink-secondary">
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
              <td className="py-sm pr-md label text-ink">{row.name}</td>
              <td className="py-sm pr-md label break-all text-ink-secondary">{row.type}</td>
              <td
                className={
                  row.required
                    ? 'py-sm pr-md label active-mark'
                    : 'py-sm pr-md label text-ink-ghost'
                }
                data-testid={`prop-req-${row.name}`}
                aria-label={row.required ? 'required' : 'optional'}
              >
                {row.required ? 'YES' : '—'}
              </td>
              <td className="py-sm pr-md label text-ink-secondary">{row.defaultValue ?? '—'}</td>
              <td className="py-sm font-body text-caption leading-body text-ink-secondary">
                {row.notes}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
