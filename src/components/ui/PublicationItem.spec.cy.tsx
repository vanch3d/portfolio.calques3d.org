import { PublicationItem } from "./PublicationItem";
import type { PublicationItemLabels } from "./PublicationItem";
import type { Publication } from "@/types/content";

const labels: PublicationItemLabels = {
  abstract: "Abstract",
  viewPdfNewTab: "Download PDF",
};

const base: Publication = {
  key: "TEST0001",
  type: "conferencePaper",
  title: "Towards an Adaptive Feedback Framework",
  authors: ["Van Labeke, Nicolas", "Whitelock, Denise"],
  year: 2016,
  venue: "Proceedings of LAK 2016",
  tags: ["safesea"],
};

const full: Publication = {
  ...base,
  doi: "10.1145/example.2016",
  pdf: "2016.LAK.AdaptiveFeedback.pdf",
  abstract: "This paper presents an adaptive feedback framework for open-ended writing.",
};

describe("PublicationItem", () => {
  it("renders the CSL citation HTML", () => {
    cy.mountAccessible(
      <ul>
        <PublicationItem pub={base} citationHtml="<i>Van Labeke</i> (2016)" labels={labels} />
      </ul>
    );
    cy.get("li").contains("Van Labeke");
  });

  it("shows DOI link when pub.doi is defined", () => {
    cy.mountAccessible(
      <ul>
        <PublicationItem pub={full} citationHtml="Van Labeke (2016)" labels={labels} />
      </ul>
    );
    cy.get(`a[href="https://doi.org/10.1145/example.2016"]`).should("exist");
  });

  it("does not render DOI link when pub.doi is absent", () => {
    cy.mountAccessible(
      <ul>
        <PublicationItem pub={base} citationHtml="Van Labeke (2016)" labels={labels} />
      </ul>
    );
    cy.get(`a[href^="https://doi.org"]`).should("not.exist");
  });

  it("shows PDF download link when pub.pdf is defined", () => {
    cy.mountAccessible(
      <ul>
        <PublicationItem pub={full} citationHtml="Van Labeke (2016)" labels={labels} />
      </ul>
    );
    cy.get(`a[href="/api/pdf-proxy?file=2016.LAK.AdaptiveFeedback.pdf"]`).should("exist");
  });

  it("does not render PDF link when pub.pdf is undefined", () => {
    cy.mountAccessible(
      <ul>
        <PublicationItem pub={base} citationHtml="Van Labeke (2016)" labels={labels} />
      </ul>
    );
    cy.get(`a[href^="/api/pdf-proxy"]`).should("not.exist");
  });

  it("shows the abstract toggle when pub.abstract is defined", () => {
    cy.mountAccessible(
      <ul>
        <PublicationItem pub={full} citationHtml="Van Labeke (2016)" labels={labels} />
      </ul>
    );
    cy.get("details").should("exist");
    cy.get("summary").should("contain.text", "Abstract");
  });

  it("expands the abstract on click", () => {
    cy.mountAccessible(
      <ul>
        <PublicationItem pub={full} citationHtml="Van Labeke (2016)" labels={labels} />
      </ul>
    );
    cy.get("summary").click();
    cy.get("details[open]").should("exist");
  });

  it("has no axe accessibility violations with abstract expanded", () => {
    cy.mountAccessible(
      <ul>
        <PublicationItem pub={full} citationHtml="<span>Van Labeke (2016)</span>" labels={labels} />
      </ul>
    );
    cy.get("summary").click();
    cy.checkA11y();
  });

  it("does not render abstract section when pub.abstract is absent", () => {
    cy.mountAccessible(
      <ul>
        <PublicationItem pub={base} citationHtml="Van Labeke (2016)" labels={labels} />
      </ul>
    );
    cy.get("details").should("not.exist");
  });

  it("has no axe accessibility violations (minimal — no doi, no pdf, no abstract)", () => {
    cy.mountAccessible(
      <ul>
        <PublicationItem pub={base} citationHtml="<span>Van Labeke (2016)</span>" labels={labels} />
      </ul>
    );
    cy.checkA11y();
  });

  it("has no axe accessibility violations (all optional fields populated)", () => {
    cy.mountAccessible(
      <ul>
        <PublicationItem pub={full} citationHtml="<span>Van Labeke (2016)</span>" labels={labels} />
      </ul>
    );
    cy.checkA11y();
  });
});
