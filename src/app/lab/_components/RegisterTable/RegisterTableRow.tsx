type RegisterTableRowProps = {
  isActive?: boolean;
  "aria-label"?: string;
  "data-testid"?: string;
  children: React.ReactNode;
};

export function RegisterTableRow({
  isActive,
  "aria-label": ariaLabel,
  "data-testid": testId,
  children,
}: RegisterTableRowProps) {
  return (
    <tr
      className={`register-row${isActive ? " register-row-active" : ""}`}
      aria-label={ariaLabel}
      data-testid={testId}
    >
      {children}
    </tr>
  );
}
