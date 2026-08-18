import { PdfPanelProvider } from "./PdfPanelProvider";
import { PdfTriggerButton } from "./PdfTriggerButton";

const labels = {
  close: "Close PDF viewer",
  loading: "Loading PDF…",
  iframeTitle: "PDF document viewer",
};

const triggerLabels = { viewPdf: "View PDF" };

function Harness({ pubs }: { pubs: Array<{ key: string; title: string }> }) {
  return (
    <PdfPanelProvider labels={labels}>
      <ul>
        {pubs.map((pub) => (
          <li key={pub.key}>
            <span>{pub.title}</span>
            <PdfTriggerButton pubKey={pub.key} footer={pub.title} labels={triggerLabels} />
          </li>
        ))}
      </ul>
    </PdfPanelProvider>
  );
}

const pubs = [
  { key: "AAAA0001", title: "Towards an Adaptive Feedback Framework" },
  { key: "AAAA0002", title: "Formative e-Assessment of Essay Writing" },
];

describe("PdfPanel", () => {
  it("renders trigger buttons", () => {
    cy.mountAccessible(<Harness pubs={pubs} />);
    cy.get("button").filter(':contains("View PDF")').should("have.length", 2);
  });

  it("opens the panel on trigger click", () => {
    cy.mountAccessible(<Harness pubs={pubs} />);
    cy.get("button").first().click();
    cy.get('[aria-label="Close PDF viewer"]').should("exist");
  });

  it("panel contains an iframe after opening", () => {
    cy.mountAccessible(<Harness pubs={pubs} />);
    cy.get("button").first().click();
    cy.get("iframe").should("exist");
  });

  it("iframe src includes the pub key", () => {
    cy.mountAccessible(<Harness pubs={pubs} />);
    cy.get("button").first().click();
    cy.get("iframe").should("have.attr", "src", `/publications/${pubs[0].key}/pdf`);
  });

  it("shows the footer with the pub title", () => {
    cy.mountAccessible(<Harness pubs={pubs} />);
    cy.get("button").first().click();
    cy.contains(pubs[0].title);
  });

  it("clicking a second trigger replaces the iframe src without closing", () => {
    cy.mountAccessible(<Harness pubs={pubs} />);
    cy.get("button").first().click();
    cy.get("iframe").should("have.attr", "src", `/publications/${pubs[0].key}/pdf`);
    cy.get("button").filter(':contains("View PDF")').eq(1).click();
    // Panel still open
    cy.get('[aria-label="Close PDF viewer"]').should("exist");
    // Src has changed
    cy.get("iframe").should("have.attr", "src", `/publications/${pubs[1].key}/pdf`);
  });

  it("clicking the same trigger twice is a no-op", () => {
    cy.mountAccessible(<Harness pubs={pubs} />);
    cy.get("button").first().click();
    cy.get("iframe").invoke("attr", "src").as("firstSrc");
    cy.get("button").first().click();
    cy.get("iframe").invoke("attr", "src").then((src) => {
      cy.get("@firstSrc").should("eq", src);
    });
  });

  it("closes on close button click", () => {
    cy.mountAccessible(<Harness pubs={pubs} />);
    cy.get("button").first().click();
    cy.get('[aria-label="Close PDF viewer"]').click();
    cy.get("iframe").should("not.exist");
  });

  it("has no axe accessibility violations (panel closed)", () => {
    cy.mountAccessible(<Harness pubs={pubs} />);
    cy.checkA11y();
  });

  it("has no axe accessibility violations (panel open)", () => {
    cy.mountAccessible(<Harness pubs={pubs} />);
    cy.get("button").first().click();
    cy.get('[aria-label="Close PDF viewer"]').should("exist");
    cy.checkA11y();
  });
});
