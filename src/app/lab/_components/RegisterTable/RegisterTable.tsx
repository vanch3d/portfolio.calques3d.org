type RegisterTableProps = {
  ariaLabel: string;
  columnWidths?: string[];
  children: React.ReactNode;
};

export function RegisterTable({ ariaLabel, columnWidths, children }: RegisterTableProps) {
  return (
    <div role="region" aria-label={ariaLabel} tabIndex={0} className="register-table-container">
      <table aria-label={ariaLabel} className="register-table">
        {columnWidths && (
          <colgroup>
            {columnWidths.map((w, i) => (
              <col key={i} style={{ width: w }} />
            ))}
          </colgroup>
        )}
        {children}
      </table>
    </div>
  );
}
