import { BentoGrid, BentoCard } from "./BentoGrid";

const baseCard = { heading: "Research", body: "Academic R&D · 1996–2017" };

describe("BentoCard", () => {
  it("renders heading and body", () => {
    cy.mountAccessible(<BentoCard {...baseCard} />);
    cy.contains("Research").should("exist");
    cy.contains("Academic R&D · 1996–2017").should("exist");
  });

  it("renders a link when href and linkLabel are provided", () => {
    cy.mountAccessible(
      <BentoCard {...baseCard} href="/research" linkLabel="Explore Research" />
    );
    cy.contains("a", "Explore Research →").should("have.attr", "href", "/research");
  });

  it("omits link when href is not provided", () => {
    cy.mountAccessible(<BentoCard {...baseCard} />);
    cy.get("a").should("not.exist");
  });

  it("renders label when provided", () => {
    cy.mountAccessible(<BentoCard {...baseCard} label="1996 – 2017" />);
    cy.contains("1996 – 2017").should("exist");
  });

  it("applies tall size class for row-span", () => {
    cy.mountAccessible(<BentoCard {...baseCard} size="tall" />);
    cy.get("[class*='row-span']").should("exist");
  });

  it("renders children slot", () => {
    cy.mountAccessible(
      <BentoCard {...baseCard}>
        <span data-testid="child">inner content</span>
      </BentoCard>
    );
    cy.get("[data-testid='child']").should("exist");
  });

  it("has no axe accessibility violations (base)", () => {
    cy.mountAccessible(<BentoCard {...baseCard} />);
    cy.checkA11y();
  });

  it("has no axe accessibility violations (with link)", () => {
    cy.mountAccessible(
      <BentoCard {...baseCard} href="/research" linkLabel="Explore Research" />
    );
    cy.checkA11y();
  });
});

describe("BentoGrid", () => {
  it("renders children in a grid", () => {
    cy.mountAccessible(
      <BentoGrid>
        <BentoCard heading="Card 1" />
        <BentoCard heading="Card 2" />
      </BentoGrid>
    );
    cy.contains("Card 1").should("exist");
    cy.contains("Card 2").should("exist");
  });

  it("has no axe accessibility violations", () => {
    cy.mountAccessible(
      <BentoGrid>
        <BentoCard heading="Research" body="Academic R&D" href="/research" linkLabel="Explore" />
        <BentoCard heading="Engineering" body="Frontend work" href="/engineering" linkLabel="Explore" />
      </BentoGrid>
    );
    cy.checkA11y();
  });
});
