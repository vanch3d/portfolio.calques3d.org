import { PublicationsList, type PublicationsListLabels } from "./PublicationsList";
import type { Publication } from "@/types/content";

const labels: PublicationsListLabels = {
  abstract: "Abstract",
  showAbstract: "Show abstract",
  hideAbstract: "Hide abstract",
  doiLinkLabel: "DOI",
  pdf: {
    pdfLinkLabel: "PDF",
    pdfDownloadLabel: "Download PDF",
    viewPdf: "View",
    closePdf: "Close viewer",
    pdfLoading: "Loading PDF…",
    pdfError: "Could not load PDF.",
    pdfPageTemplate: "Page %current% of %total%",
    pdfPrevious: "Previous page",
    pdfNext: "Next page",
  },
  typeLabel: (type) =>
    ({
      conferencePaper: "Conference paper",
      journalArticle: "Journal article",
      bookChapter: "Book chapter",
      thesis: "Thesis",
      report: "Report",
      patent: "Patent",
    })[type] ?? type,
  count: (n) => `${n} publication${n === 1 ? "" : "s"}`,
};

const pub2016a: Publication = {
  key: "AAA2016",
  type: "conferencePaper",
  title: "Adaptive Feedback Framework",
  authors: ["Van Labeke, Nicolas", "Whitelock, Denise"],
  year: 2016,
  venue: "Proceedings of LAK 2016",
  tags: [],
};

const pub2016b: Publication = {
  key: "BBB2016",
  type: "journalArticle",
  title: "Formative e-Assessment",
  authors: ["Whitelock, Denise"],
  year: 2016,
  venue: "Assessment & Evaluation in Higher Education",
  tags: [],
};

const pub2014: Publication = {
  key: "AAA2014",
  type: "conferencePaper",
  title: "3D Geometry Environment",
  authors: ["Van Labeke, Nicolas"],
  year: 2014,
  venue: "Proceedings of ICTMT 2014",
  tags: [],
};

const citations = new Map([
  ["AAA2016", "Van Labeke, N., and Whitelock, D. (2016). Adaptive Feedback Framework. In <i>Proceedings of LAK 2016</i>."],
  ["BBB2016", "Whitelock, D. (2016). Formative e-Assessment. <i>Assessment &amp; Evaluation in Higher Education</i>."],
  ["AAA2014", "Van Labeke, N. (2014). 3D Geometry Environment. In <i>Proceedings of ICTMT 2014</i>."],
]);

function mount(
  publications: Publication[],
  cits: Map<string, string> = citations,
) {
  cy.mountAccessible(
    <PublicationsList
      publications={publications}
      citations={cits}
      labels={labels}
    />,
  );
}

describe("PublicationsList", () => {
  it("renders nothing when the publications array is empty", () => {
    mount([]);
    cy.get("section").should("not.exist");
  });

  it("has no axe accessibility violations", () => {
    mount([pub2016a, pub2016b, pub2014]);
    cy.checkA11y();
  });

  it("renders one section per distinct year", () => {
    mount([pub2016a, pub2016b, pub2014]);
    cy.get("section").should("have.length", 2);
  });

  it("renders year headers in descending order", () => {
    mount([pub2016a, pub2014]);
    cy.get("section h2").then(($headers) => {
      const years = [...$headers].map((el) =>
        parseInt(el.textContent ?? "", 10),
      );
      expect(years[0]).to.be.greaterThan(years[1]);
    });
  });

  it("shows the correct count label for a year with one publication", () => {
    mount([pub2014]);
    cy.get("section").contains("1 publication").should("exist");
  });

  it("shows the correct count label for a year with multiple publications", () => {
    mount([pub2016a, pub2016b]);
    cy.get("section").contains("2 publications").should("exist");
  });

  it("places each publication under the correct year heading", () => {
    mount([pub2016a, pub2016b, pub2014]);

    cy.get("section")
      .contains("h2", "2016")
      .closest("section")
      .within(() => {
        cy.contains("Adaptive Feedback Framework").should("exist");
        cy.contains("Formative e-Assessment").should("exist");
        cy.contains("3D Geometry Environment").should("not.exist");
      });

    cy.get("section")
      .contains("h2", "2014")
      .closest("section")
      .within(() => {
        cy.contains("3D Geometry Environment").should("exist");
        cy.contains("Adaptive Feedback Framework").should("not.exist");
      });
  });

  it("falls back to the publication title when citation is missing from the map", () => {
    mount([pub2016a], new Map()); // empty citations map
    cy.contains(pub2016a.title).should("exist");
  });
});
