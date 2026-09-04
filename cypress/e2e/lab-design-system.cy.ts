/**
 * /lab/design-system — computed-style assertions and accessibility checks
 *
 * Verifies that CSS custom property token chains resolve to their expected
 * computed values in the browser. A failure here means a token is broken,
 * a font is not loading, or a colour swatch is hardcoded rather than token-driven.
 *
 * Rendering mode: SSG — content is baked into HTML at build time.
 * Run against: pnpm build && pnpm start (or dev server).
 */

describe("/lab/design-system (index)", () => {
  beforeEach(() => {
    cy.visit("/lab/design-system");
    cy.injectAxe();
  });

  it("has no axe accessibility violations", () => {
    cy.checkA11y();
  });

  it("renders the page title", () => {
    cy.get("h1").should("contain", "The Construction on Tracing Paper");
  });

  it("renders exactly one red element — the active breadcrumb", () => {
    cy.get('[aria-current="page"]').should("have.length", 1);
    cy.get('[aria-current="page"]').should(($el) => {
      const color = window.getComputedStyle($el[0]).color;
      expect(color).to.equal("rgb(192, 57, 43)");
    });
  });

  it("renders the three named invariant cards", () => {
    cy.get("article").should("have.length", 3);
    cy.get("article").eq(0).should("contain", "The One Red Rule");
    cy.get("article").eq(1).should("contain", "The No-Decoration Rule");
    cy.get("article").eq(2).should("contain", "The Flat-by-Construction Rule");
  });

  it("links to the colors sub-page", () => {
    cy.get('a[href="/lab/design-system/colors"]').should("exist");
  });

  it("links to the typography sub-page", () => {
    cy.get('a[href="/lab/design-system/typography"]').should("exist");
  });
});

describe("/lab/design-system/colors", () => {
  beforeEach(() => {
    cy.visit("/lab/design-system/colors");
    cy.injectAxe();
  });

  it("has no axe accessibility violations", () => {
    cy.checkA11y();
  });

  it("renders the page heading", () => {
    cy.get("h1").should("contain", "Colours");
  });

  it("renders exactly one red element — the active breadcrumb", () => {
    cy.get('[aria-current="page"]').should("have.length", 1);
    cy.get('[aria-current="page"]').should(($el) => {
      const color = window.getComputedStyle($el[0]).color;
      expect(color).to.equal("rgb(192, 57, 43)");
    });
  });

  it("Draughting Paper swatch resolves to rgb(248, 244, 237)", () => {
    cy.get('[data-token="color-ground"]').should(($el) => {
      const bg = window.getComputedStyle($el[0]).backgroundColor;
      expect(bg).to.equal("rgb(248, 244, 237)");
    });
  });

  it("Construction Graphite swatch resolves to rgb(42, 42, 42)", () => {
    cy.get('[data-token="color-ink"]').should(($el) => {
      const bg = window.getComputedStyle($el[0]).backgroundColor;
      expect(bg).to.equal("rgb(42, 42, 42)");
    });
  });

  it("Faded Graphite swatch resolves to rgb(107, 107, 107)", () => {
    cy.get('[data-token="color-ink-secondary"]').should(($el) => {
      const bg = window.getComputedStyle($el[0]).backgroundColor;
      expect(bg).to.equal("rgb(107, 107, 107)");
    });
  });

  it("Ghost Line swatch resolves to rgb(200, 196, 188)", () => {
    cy.get('[data-token="color-ink-ghost"]').should(($el) => {
      const bg = window.getComputedStyle($el[0]).backgroundColor;
      expect(bg).to.equal("rgb(200, 196, 188)");
    });
  });

  it("Compass-Arc Red swatch resolves to rgb(192, 57, 43)", () => {
    cy.get('[data-token="color-active"]').should(($el) => {
      const bg = window.getComputedStyle($el[0]).backgroundColor;
      expect(bg).to.equal("rgb(192, 57, 43)");
    });
  });

  it("all five swatches are present", () => {
    cy.get('[data-token]').should("have.length", 5);
  });
});

describe("/lab/design-system/typography", () => {
  beforeEach(() => {
    cy.visit("/lab/design-system/typography");
    cy.injectAxe();
  });

  it("has no axe accessibility violations", () => {
    cy.checkA11y();
  });

  it("renders the page heading", () => {
    cy.get("h1").should("contain", "Typography");
  });

  it("renders exactly one red element — the active breadcrumb", () => {
    cy.get('[aria-current="page"]').should("have.length", 1);
    cy.get('[aria-current="page"]').should(($el) => {
      const color = window.getComputedStyle($el[0]).color;
      expect(color).to.equal("rgb(192, 57, 43)");
    });
  });

  it("Display specimen uses STIX Two Text font family", () => {
    cy.get('[data-testid="specimen-display"]').should(($el) => {
      const fontFamily = window.getComputedStyle($el[0]).fontFamily;
      expect(fontFamily).to.include("STIX Two Text");
    });
  });

  it("Headline specimen uses STIX Two Text font family", () => {
    cy.get('[data-testid="specimen-headline"]').should(($el) => {
      const fontFamily = window.getComputedStyle($el[0]).fontFamily;
      expect(fontFamily).to.include("STIX Two Text");
    });
  });

  it("Body specimen uses Spectral font family", () => {
    cy.get('[data-testid="specimen-body"]').should(($el) => {
      const fontFamily = window.getComputedStyle($el[0]).fontFamily;
      expect(fontFamily).to.include("Spectral");
    });
  });

  it("Title specimen uses Spectral font family", () => {
    cy.get('[data-testid="specimen-title"]').should(($el) => {
      const fontFamily = window.getComputedStyle($el[0]).fontFamily;
      expect(fontFamily).to.include("Spectral");
    });
  });

  it("Label specimen uses Departure Mono font family", () => {
    cy.get('[data-testid="specimen-label"]').should(($el) => {
      const fontFamily = window.getComputedStyle($el[0]).fontFamily;
      expect(fontFamily).to.include("Departure Mono");
    });
  });

  it("Label specimen has text-transform uppercase", () => {
    cy.get('[data-testid="specimen-label"]').should(
      "have.css",
      "text-transform",
      "uppercase"
    );
  });

  it("Label specimen has letter-spacing 0.1em", () => {
    cy.get('[data-testid="specimen-label"]').should(($el) => {
      const computed = window.getComputedStyle($el[0]);
      const fontSize = parseFloat(computed.fontSize);
      const letterSpacing = parseFloat(computed.letterSpacing);
      const ratio = letterSpacing / fontSize;
      expect(ratio).to.be.closeTo(0.1, 0.01);
    });
  });

  it("renders five type specimens", () => {
    cy.get("li").should("have.length", 5);
  });

  it("renders The Incline Rule card", () => {
    cy.get("article").should("contain", "The Incline Rule");
  });
});
