import { SiteHeader, type SiteHeaderLabels } from "./SiteHeader";
import { ThemeContext, type ThemeContextValue } from "./ThemeProvider";

/**
 * Lightweight mock — provides the ThemeContext value without involving
 * next-themes or any browser DOM side-effects (class/colorScheme writes).
 * CT tests are about component markup and accessibility, not theme mechanics.
 */
const mockTheme: ThemeContextValue = {
  colorMode: "light",
  resolvedMode: "light",
  setColorMode: () => {},
  accent: "teal",
  setAccent: () => {},
};

const labels: SiteHeaderLabels = {
  siteName: "Nicolas Van Labeke",
  research: "Research",
  engineering: "Engineering",
  publications: "Publications",
  cv: "CV",
  lab: "Lab",
  openMenu: "Open navigation menu",
  closeMenu: "Close navigation menu",
  toggleTheme: "Toggle colour theme",
};

function mount() {
  cy.mountAccessible(
    <ThemeContext.Provider value={mockTheme}>
      <SiteHeader labels={labels} />
    </ThemeContext.Provider>
  );
}

describe("SiteHeader", () => {
  it("has no axe accessibility violations (default state)", () => {
    mount();
    cy.checkA11y();
  });

  it("renders all navigation links", () => {
    mount();
    cy.get("nav[aria-label='Primary navigation']").within(() => {
      cy.contains("a", labels.research).should("exist");
      cy.contains("a", labels.engineering).should("exist");
      cy.contains("a", labels.publications).should("exist");
      cy.contains("a", labels.cv).should("exist");
      cy.contains("a", labels.lab).should("exist");
    });
  });

  it("renders the site name as a home link", () => {
    mount();
    cy.contains("a", labels.siteName)
      .should("have.attr", "href", "/");
  });

  it("has a dark mode toggle button with accessible label", () => {
    mount();
    cy.get(`button[aria-label="${labels.toggleTheme}"]`).should("exist");
  });

  it("has a hamburger menu button with accessible label (mobile)", () => {
    mount();
    cy.viewport("iphone-x");
    cy.get(`button[aria-label="${labels.openMenu}"]`).should("exist");
  });

  it("opens the mobile menu dialog and has no axe violations", () => {
    cy.viewport("iphone-x");
    mount();
    cy.get(`button[aria-label="${labels.openMenu}"]`).click();
    cy.get('[role="dialog"]').should("be.visible");
    cy.checkA11y();
  });

  it("closes the mobile menu when close button is activated", () => {
    cy.viewport("iphone-x");
    mount();
    cy.get(`button[aria-label="${labels.openMenu}"]`).click();
    cy.get('[role="dialog"]').should("be.visible");
    cy.get(`button[aria-label="${labels.closeMenu}"]`).click();
    cy.get('[role="dialog"]').should("not.exist");
  });
});
