import { applyTheme } from "./themeScript";

describe("applyTheme", () => {
  beforeEach(() => {
    cy.document().then((doc) => doc.documentElement.classList.remove("dark"));
    cy.wrap(null).then(() => localStorage.removeItem("theme"));
  });

  it("adds dark class when stored theme is 'dark'", () => {
    cy.wrap(null).then(() => {
      localStorage.setItem("theme", "dark");
      applyTheme();
    });
    cy.get("html").should("have.class", "dark");
  });

  it("does not add dark class when stored theme is 'light'", () => {
    cy.wrap(null).then(() => {
      localStorage.setItem("theme", "light");
      applyTheme();
    });
    cy.get("html").should("not.have.class", "dark");
  });

  it("applies system dark preference when no stored theme", () => {
    cy.wrap(null).then((win) => {
      Object.defineProperty(window, "matchMedia", {
        writable: true,
        value: (query: string) => ({
          matches: query === "(prefers-color-scheme: dark)",
          media: query,
          onchange: null,
          addListener: () => {},
          removeListener: () => {},
          addEventListener: () => {},
          removeEventListener: () => {},
          dispatchEvent: () => false,
        }),
      });
      applyTheme();
    });
    cy.get("html").should("have.class", "dark");
  });

  it("does not add dark class when system prefers light and no stored theme", () => {
    cy.wrap(null).then(() => {
      Object.defineProperty(window, "matchMedia", {
        writable: true,
        value: (_query: string) => ({
          matches: false,
          media: _query,
          onchange: null,
          addListener: () => {},
          removeListener: () => {},
          addEventListener: () => {},
          removeEventListener: () => {},
          dispatchEvent: () => false,
        }),
      });
      applyTheme();
    });
    cy.get("html").should("not.have.class", "dark");
  });

  it("does not throw when localStorage is unavailable", () => {
    cy.wrap(null).then(() => {
      const original = Object.getOwnPropertyDescriptor(window, "localStorage");
      Object.defineProperty(window, "localStorage", {
        get() { throw new Error("SecurityError"); },
        configurable: true,
      });
      expect(() => applyTheme()).not.to.throw();
      if (original) Object.defineProperty(window, "localStorage", original);
    });
  });
});
