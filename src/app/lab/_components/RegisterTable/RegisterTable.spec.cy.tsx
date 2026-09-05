import { RegisterTable } from "./RegisterTable";
import { RegisterTableHead } from "./RegisterTableHead";
import { RegisterTableBody } from "./RegisterTableBody";
import { RegisterTableRow } from "./RegisterTableRow";

const columns = [
  { key: "no", label: "NO.", align: "right" as const },
  { key: "title", label: "TITLE" },
  { key: "status", label: "STATUS" },
];

function BasicTable({ isActive = false }: { isActive?: boolean }) {
  return (
    <RegisterTable ariaLabel="Test register" columnWidths={["56px", "1fr", "100px"]}>
      <RegisterTableHead columns={columns} />
      <RegisterTableBody>
        <RegisterTableRow
          isActive={isActive}
          data-testid="row-001"
          aria-label={isActive ? "ADR 001 — most recent" : undefined}
        >
          <td>001</td>
          <td>Decision title</td>
          <td>Accepted</td>
        </RegisterTableRow>
      </RegisterTableBody>
    </RegisterTable>
  );
}

describe("RegisterTable", () => {
  it("renders column headers", () => {
    cy.mountAccessible(<BasicTable />);
    cy.get("th").should("have.length", 3);
    cy.get("th").first().should("contain.text", "NO.");
  });

  it("renders a table row", () => {
    cy.mountAccessible(<BasicTable />);
    cy.get("[data-testid='row-001']").should("exist");
    cy.get("[data-testid='row-001'] td").should("have.length", 3);
  });

  it("active row has register-row-active class", () => {
    cy.mountAccessible(<BasicTable isActive />);
    cy.get("[data-testid='row-001']").should("have.class", "register-row-active");
  });

  it("active row has aria-label", () => {
    cy.mountAccessible(<BasicTable isActive />);
    cy.get("[aria-label='ADR 001 — most recent']").should("exist");
  });

  it("non-active row does not have register-row-active class", () => {
    cy.mountAccessible(<BasicTable />);
    cy.get("[data-testid='row-001']").should("not.have.class", "register-row-active");
  });

  it("has no axe accessibility violations", () => {
    cy.mountAccessible(<BasicTable />);
    cy.checkA11y();
  });

  it("has no axe violations with active row", () => {
    cy.mountAccessible(<BasicTable isActive />);
    cy.checkA11y();
  });
});
