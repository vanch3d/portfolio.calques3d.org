import { BackLink } from "./BackLink";

describe("<BackLink />", () => {
  it("has no axe accessibility violations", () => {
    cy.mountAccessible(
      <BackLink
        href="/engineering"
        label="← Engineering"
        navLabel="Page navigation"
      />
    );
    cy.checkA11y();
  });

  it("renders a nav landmark with the given aria-label", () => {
    cy.mount(
      <BackLink
        href="/engineering"
        label="← Engineering"
        navLabel="Page navigation"
      />
    );
    cy.get('nav[aria-label="Page navigation"]').should("exist");
  });

  it("renders a link with the correct href", () => {
    cy.mount(
      <BackLink
        href="/engineering"
        label="← Engineering"
        navLabel="Page navigation"
      />
    );
    cy.get('a[href="/engineering"]').should("exist");
  });

  it("renders the label text", () => {
    cy.mount(
      <BackLink
        href="/engineering"
        label="← Engineering"
        navLabel="Page navigation"
      />
    );
    cy.contains("← Engineering");
  });
});
