import { Breadcrumb } from "./Breadcrumb";

const twoLevel = [{ label: "Home", href: "/" }, { label: "Engineering" }];

const threeLevel = [
  { label: "Home", href: "/" },
  { label: "Engineering", href: "/engineering" },
  { label: "HiveMQ Edge" },
];

describe("<Breadcrumb />", () => {
  it("has no axe accessibility violations (two-level)", () => {
    cy.mountAccessible(
      <Breadcrumb items={twoLevel} navLabel="Breadcrumb" />
    );
    cy.checkA11y();
  });

  it("has no axe accessibility violations (three-level)", () => {
    cy.mountAccessible(
      <Breadcrumb items={threeLevel} navLabel="Breadcrumb" />
    );
    cy.checkA11y();
  });

  it("renders a nav landmark with the given aria-label", () => {
    cy.mount(<Breadcrumb items={twoLevel} navLabel="Breadcrumb" />);
    cy.get('nav[aria-label="Breadcrumb"]').should("exist");
  });

  it("renders an ordered list", () => {
    cy.mount(<Breadcrumb items={twoLevel} navLabel="Breadcrumb" />);
    cy.get("ol").should("exist");
    cy.get("li").should("have.length", 2);
  });

  it("renders links for items with href", () => {
    cy.mount(<Breadcrumb items={threeLevel} navLabel="Breadcrumb" />);
    cy.get('a[href="/"]').contains("Home");
    cy.get('a[href="/engineering"]').contains("Engineering");
  });

  it("renders the current page item without a link", () => {
    cy.mount(<Breadcrumb items={threeLevel} navLabel="Breadcrumb" />);
    cy.get('[aria-current="page"]').contains("HiveMQ Edge");
    cy.get('[aria-current="page"]').should("not.have.prop", "tagName", "A");
  });

  it("only the last item carries aria-current", () => {
    cy.mount(<Breadcrumb items={threeLevel} navLabel="Breadcrumb" />);
    cy.get('[aria-current="page"]').should("have.length", 1);
  });

  it("renders separators between items", () => {
    cy.mount(<Breadcrumb items={threeLevel} navLabel="Breadcrumb" />);
    cy.get('[aria-hidden="true"]').should("have.length", 2);
  });
});
