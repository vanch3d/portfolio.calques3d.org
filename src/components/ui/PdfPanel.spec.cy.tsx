import { PdfPanel } from "./PdfPanel";

const labels = { view: "View PDF", close: "Close PDF viewer" };
const filename = "paper-2016.pdf";
const proxyUrl = `/api/pdf-proxy?file=${encodeURIComponent(filename)}`;

describe("PdfPanel — mobile link", () => {
  it("renders a new-tab link with the proxy URL", () => {
    cy.mountAccessible(<PdfPanel filename={filename} labels={labels} />);
    cy.get(`a[href="${proxyUrl}"]`)
      .should("have.attr", "target", "_blank")
      .and("have.attr", "rel", "noopener noreferrer");
  });

  it("displays the view label in the mobile link", () => {
    cy.mountAccessible(<PdfPanel filename={filename} labels={labels} />);
    cy.get("a").contains("View PDF").should("exist");
  });

  it("has a distinct aria-label from the desktop button", () => {
    cy.mountAccessible(<PdfPanel filename={filename} labels={labels} />);
    cy.get("a").should("have.attr", "aria-label").and("include", "new tab");
  });
});

// Desktop tests run at md+ viewport so the slide-over button is visible
describe("PdfPanel — desktop button", () => {
  beforeEach(() => {
    cy.viewport(1024, 768);
  });

  it("renders the open button with a distinct aria-label", () => {
    cy.mountAccessible(<PdfPanel filename={filename} labels={labels} />);
    cy.get("button[aria-label*='panel']").should("exist");
  });

  it("opens the native dialog on button click", () => {
    cy.mountAccessible(<PdfPanel filename={filename} labels={labels} />);
    cy.get("button[aria-label*='panel']").click();
    cy.get("dialog").should("have.attr", "open");
  });

  it("renders the iframe with the proxy URL when open", () => {
    cy.mountAccessible(<PdfPanel filename={filename} labels={labels} />);
    cy.get("button[aria-label*='panel']").click();
    cy.get("iframe").should("have.attr", "src", proxyUrl);
  });

  it("closes the dialog on close button click", () => {
    cy.mountAccessible(<PdfPanel filename={filename} labels={labels} />);
    cy.get("button[aria-label*='panel']").click();
    cy.get("dialog").should("have.attr", "open");
    cy.get("button[aria-label='Close PDF viewer']").click();
    cy.get("dialog").should("not.have.attr", "open");
  });

  it("closes the dialog on Escape key", () => {
    cy.mountAccessible(<PdfPanel filename={filename} labels={labels} />);
    cy.get("button[aria-label*='panel']").click();
    cy.get("dialog").should("have.attr", "open");
    // Focus is on the close button after open; Escape bubbles to window listener
    cy.focused().trigger("keydown", { key: "Escape", bubbles: true, cancelable: true });
    cy.get("dialog").should("not.have.attr", "open");
  });

  it("displays the close label in the close button", () => {
    cy.mountAccessible(<PdfPanel filename={filename} labels={labels} />);
    cy.get("button[aria-label*='panel']").click();
    cy.contains("Close PDF viewer").should("exist");
  });
});

describe("PdfPanel — accessibility", () => {
  it("has no axe violations (closed state)", () => {
    cy.mountAccessible(<PdfPanel filename={filename} labels={labels} />);
    cy.checkA11y();
  });

  it("has no axe violations (open state)", () => {
    cy.viewport(1024, 768);
    cy.mountAccessible(<PdfPanel filename={filename} labels={labels} />);
    cy.get("button[aria-label*='panel']").click();
    cy.get("dialog").should("have.attr", "open");
    cy.checkA11y();
  });
});
