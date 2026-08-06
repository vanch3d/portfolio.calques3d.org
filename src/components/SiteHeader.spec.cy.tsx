import { PathnameContext } from "next/dist/shared/lib/hooks-client-context.shared-runtime";
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

/** Mount at a given pathname. Defaults to "/" (no active nav link). */
function mount(pathname = "/") {
  cy.mountAccessible(
    <PathnameContext.Provider value={pathname}>
      <ThemeContext.Provider value={mockTheme}>
        <SiteHeader labels={labels} />
      </ThemeContext.Provider>
    </PathnameContext.Provider>
  );
}

describe("SiteHeader", () => {
  describe("desktop layout", () => {
    beforeEach(() => cy.viewport(1280, 720));

    it("has no axe accessibility violations", () => {
      mount();
      cy.checkA11y();
    });

    it("renders all navigation links in the primary nav", () => {
      mount();
      cy.get("nav[aria-label='Primary navigation']").within(() => {
        cy.contains("a", labels.research).should("be.visible");
        cy.contains("a", labels.engineering).should("be.visible");
        cy.contains("a", labels.publications).should("be.visible");
        cy.contains("a", labels.cv).should("be.visible");
        cy.contains("a", labels.lab).should("be.visible");
      });
    });

    it("does not show the hamburger menu button", () => {
      mount();
      cy.get(`button[aria-label="${labels.openMenu}"]`).should("not.be.visible");
    });

    it("renders the site name as a home link", () => {
      mount();
      cy.contains("a", labels.siteName).should("have.attr", "href", "/");
    });

    it("has a dark mode toggle button with accessible label", () => {
      mount();
      cy.get(`button[aria-label="${labels.toggleTheme}"]`).should("be.visible");
    });
  });

  describe("active link (aria-current)", () => {
    beforeEach(() => cy.viewport(1280, 720));

    it("marks /research as current on /research", () => {
      mount("/research");
      cy.contains("a", labels.research).should("have.attr", "aria-current", "page");
      cy.contains("a", labels.publications).should("not.have.attr", "aria-current");
    });

    it("marks /research as current on a research detail page", () => {
      mount("/research/safesea");
      cy.contains("a", labels.research).should("have.attr", "aria-current", "page");
      cy.contains("a", labels.publications).should("not.have.attr", "aria-current");
    });

    it("marks /research/publications as current (not /research) on /research/publications", () => {
      mount("/research/publications");
      cy.contains("a", labels.publications).should("have.attr", "aria-current", "page");
      cy.contains("a", labels.research).should("not.have.attr", "aria-current");
    });

    it("marks /cv as current on /cv", () => {
      mount("/cv");
      cy.contains("a", labels.cv).should("have.attr", "aria-current", "page");
    });

    it("marks no link as current on /", () => {
      mount("/");
      cy.get("nav[aria-label='Primary navigation']")
        .find("a[aria-current='page']")
        .should("not.exist");
    });
  });

  describe("mobile layout", () => {
    beforeEach(() => cy.viewport("iphone-x"));

    it("has no axe accessibility violations", () => {
      mount();
      cy.checkA11y();
    });

    it("shows the hamburger menu button", () => {
      mount();
      cy.get(`button[aria-label="${labels.openMenu}"]`).should("be.visible");
    });

    it("does not show the primary nav links", () => {
      mount();
      cy.get("nav[aria-label='Primary navigation']").should("not.be.visible");
    });

    it("opens the mobile menu dialog and has no axe violations", () => {
      mount();
      cy.get(`button[aria-label="${labels.openMenu}"]`).click();
      cy.get('[role="dialog"]').should("be.visible");
      cy.checkA11y();
    });

    it("closes the mobile menu when close button is activated", () => {
      mount();
      cy.get(`button[aria-label="${labels.openMenu}"]`).click();
      cy.get('[role="dialog"]').should("be.visible");
      cy.get(`button[aria-label="${labels.closeMenu}"]`).click();
      cy.get('[role="dialog"]').should("not.exist");
    });
  });
});
