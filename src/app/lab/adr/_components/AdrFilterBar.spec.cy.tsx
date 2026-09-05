import { AdrFilterBar } from "./AdrFilterBar";

const tags = ["infrastructure", "testing", "components", "i18n", "accessibility"];

describe("AdrFilterBar", () => {
  it("renders the search input with placeholder text", () => {
    cy.mountAccessible(
      <AdrFilterBar
        tags={tags}
        activeTag={null}
        searchQuery=""
        onTagToggle={cy.stub()}
        onSearchChange={cy.stub()}
      />
    );
    cy.findByTestId("adr-filter-bar").should("be.visible");
    cy.get("input[type='search']").should("have.attr", "placeholder");
  });

  it("renders all tag chips", () => {
    cy.mountAccessible(
      <AdrFilterBar
        tags={tags}
        activeTag={null}
        searchQuery=""
        onTagToggle={cy.stub()}
        onSearchChange={cy.stub()}
      />
    );
    tags.forEach((tag) => {
      cy.findByTestId(`tag-chip-${tag}`).should("be.visible");
    });
  });

  it("marks the active tag chip with aria-pressed=true", () => {
    cy.mountAccessible(
      <AdrFilterBar
        tags={tags}
        activeTag="testing"
        searchQuery=""
        onTagToggle={cy.stub()}
        onSearchChange={cy.stub()}
      />
    );
    cy.findByTestId("tag-chip-testing").should("have.attr", "aria-pressed", "true");
    cy.findByTestId("tag-chip-infrastructure").should("have.attr", "aria-pressed", "false");
  });

  it("calls onTagToggle with the tag when a chip is clicked", () => {
    const onTagToggle = cy.stub().as("onTagToggle");
    cy.mountAccessible(
      <AdrFilterBar
        tags={tags}
        activeTag={null}
        searchQuery=""
        onTagToggle={onTagToggle}
        onSearchChange={cy.stub()}
      />
    );
    cy.findByTestId("tag-chip-components").click();
    cy.get("@onTagToggle").should("have.been.calledWith", "components");
  });

  it("calls onSearchChange when the search input value changes", () => {
    const onSearchChange = cy.stub().as("onSearchChange");
    cy.mountAccessible(
      <AdrFilterBar
        tags={tags}
        activeTag={null}
        searchQuery=""
        onTagToggle={cy.stub()}
        onSearchChange={onSearchChange}
      />
    );
    cy.get("input[type='search']").type("infra");
    cy.get("@onSearchChange").should("have.been.called");
  });

  it("reflects the current searchQuery value in the input", () => {
    cy.mountAccessible(
      <AdrFilterBar
        tags={tags}
        activeTag={null}
        searchQuery="my query"
        onTagToggle={cy.stub()}
        onSearchChange={cy.stub()}
      />
    );
    cy.get("input[type='search']").should("have.value", "my query");
  });

  it("has no axe accessibility violations (no active tag)", () => {
    cy.mountAccessible(
      <AdrFilterBar
        tags={tags}
        activeTag={null}
        searchQuery=""
        onTagToggle={cy.stub()}
        onSearchChange={cy.stub()}
      />
    );
    cy.checkA11y();
  });

  it("has no axe accessibility violations (with active tag)", () => {
    cy.mountAccessible(
      <AdrFilterBar
        tags={tags}
        activeTag="i18n"
        searchQuery=""
        onTagToggle={cy.stub()}
        onSearchChange={cy.stub()}
      />
    );
    cy.checkA11y();
  });
});
