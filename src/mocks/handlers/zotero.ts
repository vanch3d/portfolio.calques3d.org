/**
 * MSW handler for the Zotero API.
 * Models the single endpoint used by src/lib/api/zotero.ts.
 * Response shapes match src/openapi/zotero.yaml.
 */

import { http, HttpResponse } from "msw";

const ZOTERO_BASE = "https://api.zotero.org";

// Minimal fixture items — enough to exercise transformation logic
const MOCK_ITEMS = [
  {
    key: "AAAA0001",
    meta: { parsedDate: "2016-04-01", numChildren: 1 },
    data: {
      key: "AAAA0001",
      itemType: "conferencePaper",
      title: "Towards an Adaptive Feedback Framework for Open-Ended Writing",
      creators: [
        { creatorType: "author", firstName: "Nicolas", lastName: "Van Labeke" },
        { creatorType: "author", firstName: "Denise", lastName: "Whitelock" },
      ],
      abstractNote: "This paper presents an adaptive feedback framework.",
      date: "2016",
      DOI: "10.1145/example.2016",
      url: "",
      tags: [{ tag: "nvl.safesea" }, { tag: "Essay writing" }],
      proceedingsTitle: "Proceedings of LAK 2016",
      conferenceName: "LAK 2016",
      place: "Edinburgh",
    },
  },
  {
    key: "AAAA0002",
    meta: { parsedDate: "2014-03-24", numChildren: 0 },
    data: {
      key: "AAAA0002",
      itemType: "journalArticle",
      title: "Formative e-Assessment of Essay Writing",
      creators: [
        { creatorType: "author", firstName: "Denise", lastName: "Whitelock" },
        { creatorType: "author", firstName: "Nicolas", lastName: "Van Labeke" },
      ],
      abstractNote: "This article explores formative e-assessment.",
      date: "2014",
      DOI: "10.1016/example.2014",
      url: "",
      tags: [{ tag: "nvl.safesea" }],
      publicationTitle: "Assessment & Evaluation in Higher Education",
      volume: "39",
      issue: "5",
    },
  },
  {
    key: "BBBB0001",
    meta: { parsedDate: "2010-07-01", numChildren: 0 },
    data: {
      key: "BBBB0001",
      itemType: "conferencePaper",
      title: "A 3D Dynamic Geometry Environment for Secondary School",
      creators: [
        { creatorType: "author", firstName: "Nicolas", lastName: "Van Labeke" },
      ],
      abstractNote: "Calques 3D is a dynamic geometry environment.",
      date: "2010",
      DOI: "",
      url: "",
      tags: [{ tag: "nvl.calques3d" }],
      proceedingsTitle: "Proceedings of ICTMT 2010",
    },
  },
];

export const zoteroHandlers = [
  http.get(
    `${ZOTERO_BASE}/users/:userId/collections/:collectionId/items/top`,
    ({ request }) => {
      const url = new URL(request.url);
      const tag = url.searchParams.get("tag");

      const items = tag
        ? MOCK_ITEMS.filter((item) =>
            item.data.tags.some((t) => t.tag === tag)
          )
        : MOCK_ITEMS;

      return HttpResponse.json(items, {
        headers: { "Total-Results": String(items.length) },
      });
    }
  ),
];
