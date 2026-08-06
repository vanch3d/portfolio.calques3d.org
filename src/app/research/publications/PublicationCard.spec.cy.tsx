import { PublicationCard, type PublicationCardLabels } from "./PublicationCard";
import type { Publication } from "@/types/content";

const labels: PublicationCardLabels = {
  abstract: "Abstract",
  showAbstract: "Show abstract",
  hideAbstract: "Hide abstract",
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

function mount(pub: Publication = base, cit: string = citation) {
  cy.mountAccessible(<PublicationCard publication={pub} citation={cit} labels={labels} />);
}

describe("PublicationCard", () => {
  it("has no axe accessibility violations", () => {
    mount();
    cy.checkA11y();
  });

  it("renders the type badge", () => {
    mount();
    cy.contains("Conference paper").should("exist");
  });

  it("renders the CSL-formatted citation as HTML", () => {
    mount();
    cy.get("article").find("i").should("contain.text", "Proceedings of LAK 2016");
  });

  it("renders a DOI link when doi is present", () => {
    mount();
    cy.get(`a[href='https://doi.org/${base.doi}']`)
      .should("exist")
      .and("have.attr", "target", "_blank")
      .and("have.attr", "rel", "noopener noreferrer");
  });

  it("does not render a DOI link when doi is absent", () => {
    mount({ ...base, doi: undefined });
    cy.get("a[href^='https://doi.org']").should("not.exist");
  });

  it("renders the abstract toggle when abstract is present", () => {
    mount();
    cy.get("details").should("exist");
    cy.contains("Show abstract").should("exist");
  });

  it("does not render the abstract toggle when abstract is absent", () => {
    mount({ ...base, abstract: undefined });
    cy.get("details").should("not.exist");
  });

  it("has no axe violations for a journal article without abstract or doi", () => {
    mount({
      ...base,
      type: "journalArticle",
      doi: undefined,
      abstract: undefined,
    });
    cy.checkA11y();
  });

  describe("PDF link", () => {
    const pdfUrl =
      "https://github.com/vanch3d/portfolio.calques3d.org/releases/download/publications-pdfs/2016.LAK.pdf";

    it("renders a PDF link when pdf is present", () => {
      mount({ ...base, pdf: pdfUrl });
      cy.get(`a[href='${pdfUrl}']`)
        .should("exist")
        .and("have.attr", "target", "_blank")
        .and("have.attr", "rel", "noopener noreferrer")
        .and("contain.text", "PDF");
    });

    it("does not render a PDF link when pdf is absent", () => {
      mount({ ...base, pdf: undefined });
      cy.get("a[href*='releases/download']").should("not.exist");
    });

    it("renders both DOI and PDF links when both are present", () => {
      mount({ ...base, pdf: pdfUrl });
      cy.get(`a[href^='https://doi.org']`).should("exist");
      cy.get(`a[href='${pdfUrl}']`).should("exist");
    });

    it("has no axe violations when pdf link is present", () => {
      mount({ ...base, pdf: pdfUrl });
      cy.checkA11y();
    });
  });

  /**
   * Integration-style check: uses a citation string that matches the umuai-nvl
   * CSL output (verified by the Vitest suite in src/lib/csl/index.test.ts).
   * Confirms that CSL-formatted HTML renders correctly through the component —
   * compound surname intact, conference location visible, italic venue.
   */
  describe("CSL-formatted citation rendering", () => {
    const cslCitation =
      'Van Labeke, N., and Whitelock, D. (2016). Towards an Adaptive Feedback Framework for Open-Ended Writing. In <i>Proceedings of LAK 2016</i> (Edinburgh, UK).';

    it("renders the compound surname 'Van Labeke' intact", () => {
      mount(base, cslCitation);
      cy.get("article").contains("Van Labeke, N.").should("exist");
    });

    it("renders the conference location from the CSL output", () => {
      mount(base, cslCitation);
      cy.get("article").contains("Edinburgh").should("exist");
    });

    it("renders the venue in italic", () => {
      mount(base, cslCitation);
      cy.get("article").find("i").should("contain.text", "Proceedings of LAK 2016");
    });
  });
});
