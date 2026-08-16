import { PublicationCard } from "./PublicationCard";
import type { Publication, PublicationType } from "@/types/content";

const types: Record<PublicationType, string> = {
  conferencePaper: "conf.",
  journalArticle: "journal",
  bookChapter: "chapter",
  thesis: "thesis",
  report: "report",
  patent: "patent",
};

const labels = { doi: "DOI", types };

const confPub: Publication = {
  key: "PUB001",
  type: "conferencePaper",
  title: "Towards an Adaptive Feedback Framework",
  authors: ["Van Labeke, Nicolas", "Whitelock, Denise"],
  year: 2016,
  venue: "Proceedings of LAK 2016",
  doi: "10.1145/2883851.2883950",
  tags: ["safesea"],
};

const reportPub: Publication = {
  key: "PUB002",
  type: "report",
  title: "Preliminary Evaluation Report",
  authors: ["Van Labeke, Nicolas"],
  year: 2008,
  tags: [],
};

const citationHtml =
  "Van Labeke, N., and Whitelock, D. (2016). Towards an Adaptive Feedback Framework. In <i>Proceedings of LAK 2016</i>.";

const simpleCitationHtml = "Van Labeke, N. (2008). Preliminary Evaluation Report.";

describe("PublicationCard — rendered citation", () => {
  it("renders the CSL-formatted citation HTML", () => {
    cy.mountAccessible(
      <ul>
        <li>
          <PublicationCard pub={confPub} citationHtml={citationHtml} labels={labels} />
        </li>
      </ul>
    );
    cy.contains("Van Labeke, N., and Whitelock, D.").should("exist");
  });

  it("renders italic venue text from citation HTML", () => {
    cy.mountAccessible(
      <ul>
        <li>
          <PublicationCard pub={confPub} citationHtml={citationHtml} labels={labels} />
        </li>
      </ul>
    );
    cy.get("i").contains("Proceedings of LAK 2016").should("exist");
  });
});

describe("PublicationCard — type badge", () => {
  it("shows the correct type label for a conference paper", () => {
    cy.mountAccessible(
      <ul>
        <li>
          <PublicationCard pub={confPub} citationHtml={citationHtml} labels={labels} />
        </li>
      </ul>
    );
    cy.contains("conf.").should("exist");
  });

  it("shows the correct type label for a report", () => {
    cy.mountAccessible(
      <ul>
        <li>
          <PublicationCard pub={reportPub} citationHtml={simpleCitationHtml} labels={labels} />
        </li>
      </ul>
    );
    cy.contains("report").should("exist");
  });
});

describe("PublicationCard — DOI link", () => {
  it("renders DOI link when doi is present", () => {
    cy.mountAccessible(
      <ul>
        <li>
          <PublicationCard pub={confPub} citationHtml={citationHtml} labels={labels} />
        </li>
      </ul>
    );
    cy.get(`a[href="https://doi.org/10.1145/2883851.2883950"]`)
      .should("exist")
      .and("have.attr", "target", "_blank")
      .and("have.attr", "rel", "noopener noreferrer");
  });

  it("omits DOI link when doi is absent", () => {
    cy.mountAccessible(
      <ul>
        <li>
          <PublicationCard pub={reportPub} citationHtml={simpleCitationHtml} labels={labels} />
        </li>
      </ul>
    );
    cy.get("a[href*='doi.org']").should("not.exist");
  });
});

describe("PublicationCard — accessibility", () => {
  it("has no axe violations (conference paper with DOI)", () => {
    cy.mountAccessible(
      <ul>
        <li>
          <PublicationCard pub={confPub} citationHtml={citationHtml} labels={labels} />
        </li>
      </ul>
    );
    cy.checkA11y();
  });

  it("has no axe violations (report without DOI)", () => {
    cy.mountAccessible(
      <ul>
        <li>
          <PublicationCard pub={reportPub} citationHtml={simpleCitationHtml} labels={labels} />
        </li>
      </ul>
    );
    cy.checkA11y();
  });
});
