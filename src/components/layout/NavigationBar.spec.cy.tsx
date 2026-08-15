import React from "react";
import { NavigationBar } from "./NavigationBar";

// NavigationBar uses usePathname() — Next.js App Router hook.
// In CT there is no router, so we stub it via cy.stub on the next/navigation module.
// The sentinel element (id="nav-sentinel") must exist in the DOM for the
// IntersectionObserver store to initialise; the CT scaffold provides a plain DOM.

describe("NavigationBar", () => {
  beforeEach(() => {
    // Provide a minimal sentinel so the scroll store observer can attach.
    cy.document().then((doc) => {
      if (!doc.getElementById("nav-sentinel")) {
        const sentinel = doc.createElement("div");
        sentinel.id = "nav-sentinel";
        doc.body.prepend(sentinel);
      }
    });
  });

  it("renders without a11y violations", () => {
    cy.mountAccessible(<NavigationBar />);
    cy.checkA11y();
  });

  it("renders the wordmark", () => {
    cy.mountAccessible(<NavigationBar />);
    cy.get("header a[href='/']").should("exist");
  });

  it("renders the main nav landmark on desktop", () => {
    cy.viewport(1280, 800);
    cy.mountAccessible(<NavigationBar />);
    cy.get("nav[aria-label='Main navigation']").should("exist");
  });

  it("marks the active link with aria-current=page", () => {
    cy.mountAccessible(<NavigationBar />, { pathname: "/research" });
    cy.get("nav[aria-label='Main navigation'] a[href='/research']")
      .should("have.attr", "aria-current", "page");
  });

  it("renders the theme toggle", () => {
    cy.mountAccessible(<NavigationBar />);
    cy.get("header button[aria-label]").should("exist");
  });

  it("hides desktop nav and shows mobile trigger below md breakpoint", () => {
    cy.viewport(375, 812);
    cy.mountAccessible(<NavigationBar />);
    cy.get("nav[aria-label='Main navigation']").should("not.be.visible");
    cy.get("button[aria-label='Open navigation menu']").should("be.visible");
  });
});
