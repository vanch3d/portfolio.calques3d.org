import { PublicationDetail, type PublicationDetailLabels } from "./PublicationDetail";
import type { Publication } from "@/types/content";

const labels: PublicationDetailLabels = {
  doiLinkLabel: "DOI",
  pdfLinkLabel: "PDF",
  pdfDownloadLabel: "Download PDF",
  typeLabel: (type) =>
    ({
      conferencePaper: "Conference paper",
      journalArticle: "Journal article",
      bookChapter: "Book chapter",
      thesis: "Thesis",
      report: "Report",
      patent: "Patent",
    })[type] ?? type,
  viewer: {
    pdfLinkLabel: "PDF",
    pdfDownloadLabel: "Download PDF",
    pdfLoading: "Loading PDF…",
    pdfError: "Could not load PDF.",
    pdfPageTemplate: "Page %current% of %total%",
    pdfPrevious: "Previous page",
    pdfNext: "Next page",
  },
};

const base: Publication = {
  key: "AAAA0001",
  type: "conferencePaper",
  title: "Towards an Adaptive Feedback Framework for Open-Ended Writing",
  authors: ["Van Labeke, Nicolas", "Whitelock, Denise"],
  year: 2016,
  venue: "Proceedings of LAK 2016",
  doi: "10.1145/example.2016",
  abstract: "This paper presents an adaptive feedback framework.",
  tags: ["safesea"],
};

const citation =
  'Van Labeke, N., and Whitelock, D. (2016). Towards an Adaptive Feedback Framework. In <i>Proceedings of LAK 2016</i>.';

const pdfUrl =
  "https://github.com/vanch3d/portfolio.calques3d.org/releases/download/publications-pdfs/2016.LAK.pdf";

function mount(pub: Publication = base, cit: string = citation) {
  cy.mountAccessible(
    <PublicationDetail publication={pub} citation={cit} labels={labels} />,
  );
}

describe("PublicationDetail", () => {
  it("has no axe accessibility violations (no pdf)", () => {
    mount();
    cy.checkA11y();
  });

  it("has no axe accessibility violations (with pdf)", () => {
    mount({ ...base, pdf: pdfUrl });
    cy.checkA11y();
  });

  it("renders the type badge in the metadata panel", () => {
    mount();
    cy.get("[aria-label='Publication metadata']").contains("Conference paper").should("exist");
  });

  it("renders the CSL citation in the metadata panel", () => {
    mount();
    cy.get("[aria-label='Publication metadata']").find("i").should("contain.text", "Proceedings of LAK 2016");
  });

  it("renders a DOI link in the metadata panel when doi is present", () => {
    mount();
    cy.get("[aria-label='Publication metadata']")
      .find(`a[href='https://doi.org/${base.doi}']`)
      .should("exist")
      .and("have.attr", "target", "_blank");
  });

  it("does not render a DOI link when doi is absent", () => {
    mount({ ...base, doi: undefined });
    cy.get("a[href^='https://doi.org']").should("not.exist");
  });

  it("renders a PDF download link in the metadata panel when pdf is present", () => {
    mount({ ...base, pdf: pdfUrl });
    cy.get("[aria-label='Publication metadata']")
      .find(`a[href='${pdfUrl}']`)
      .should("exist")
      .and("contain.text", "PDF");
  });

  it("does not render a PDF download link when pdf is absent", () => {
    mount({ ...base, pdf: undefined });
    cy.get("a[href*='releases/download']").should("not.exist");
  });

  it("renders the 'No PDF available' placeholder when pdf is absent", () => {
    mount({ ...base, pdf: undefined });
    cy.contains("No PDF available").should("exist");
  });

  it("does not render the abstract (it is in the paper)", () => {
    mount();
    cy.contains(base.abstract!).should("not.exist");
    cy.get("details").should("not.exist");
  });

  it("renders the PdfViewerPanel when pdf is present (flag disabled by default shows fallback)", () => {
    mount({ ...base, pdf: pdfUrl });
    // Feature flag defaults to false in tests — viewer not shown, download fallback shown instead
    cy.get(`a[href='${pdfUrl}']`).should("exist");
  });
});
