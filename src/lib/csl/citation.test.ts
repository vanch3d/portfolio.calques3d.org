/**
 * Unit tests for the server-side CSL formatter.
 *
 * These tests verify:
 *  - Author name formatting (compound surnames, multi-author)
 *  - Conference location rendering (publisher-place)
 *  - Style selection: umuai-nvl and apa-7 produce distinct output
 *  - getActiveCitationStyle() env var reading
 *  - Edge cases: no DOI, no abstract, no place
 *
 * Run: pnpm exec vitest run src/lib/csl/index.test.ts
 */
import { describe, it, expect, afterEach } from 'vitest'
import { formatCitation, formatCitations, getActiveCitationStyle } from './index'
import type { Publication } from '@/types/content'

// Authors in inverted "Family, Given" format — our canonical storage format
const confPaper: Publication = {
  key: 'AAAA0001',
  type: 'conferencePaper',
  title: 'Towards an Adaptive Feedback Framework for Open-Ended Writing',
  authors: ['Van Labeke, Nicolas', 'Whitelock, Denise'],
  year: 2016,
  venue: 'Proceedings of LAK 2016',
  place: 'Edinburgh, UK',
  doi: '10.1145/example.2016',
  abstract: 'This paper presents an adaptive feedback framework.',
  tags: ['safesea'],
}

const journalArticle: Publication = {
  key: 'AAAA0002',
  type: 'journalArticle',
  title: 'Formative e-Assessment of Essay Writing',
  authors: ['Whitelock, Denise', 'Van Labeke, Nicolas'],
  year: 2014,
  venue: 'Assessment & Evaluation in Higher Education',
  doi: '10.1016/example.2014',
  tags: [],
}

const confPaperNoPlace: Publication = {
  key: 'BBBB0001',
  type: 'conferencePaper',
  title: 'A 3D Dynamic Geometry Environment for Secondary School',
  authors: ['Van Labeke, Nicolas'],
  year: 2010,
  venue: 'Proceedings of ICTMT 2010',
  tags: [],
}

// ---------------------------------------------------------------
// umuai-nvl (default style)
// ---------------------------------------------------------------

// ---------------------------------------------------------------
// Author format contract guard
// Zotero API returns firstName + lastName separately; formatAuthors must
// produce "Family, Given" (comma-separated) so toCSLItem can split correctly.
// If this produces "Given Family" (space-only), every author becomes { literal }
// and initial abbreviation / compound-surname handling breaks silently.
// ---------------------------------------------------------------

describe('author format contract — Family, Given order', () => {
  it("'Van Labeke, Nicolas' splits to { family: 'Van Labeke', given: 'Nicolas' }", async () => {
    const html = await formatCitation(confPaper, 'umuai-nvl')
    // Abbreviated given: "N." confirms { family, given } was used, not { literal }
    expect(html).toMatch(/Van Labeke,\s*N\./)
  })

  it("space-only 'Nicolas Van Labeke' would produce a literal — fixture uses correct format", async () => {
    const spacePub: Publication = {
      ...confPaper,
      key: 'CONTRACT001',
      authors: ['Nicolas Van Labeke'], // space-only (wrong format)
    }
    const html = await formatCitation(spacePub, 'umuai-nvl')
    // Literal authors are not abbreviated — full name appears
    expect(html).toContain('Nicolas Van Labeke')
    // And the correct inverted format does abbreviate
    expect(html).not.toMatch(/Van Labeke,\s*N\./)
  })
})

describe('formatCitation [umuai-nvl] — compound surnames', () => {
  it("formats 'Van Labeke' as family name, not 'Labeke'", async () => {
    const html = await formatCitation(confPaper, 'umuai-nvl')
    expect(html).toContain('Van Labeke')
    expect(html).not.toMatch(/Labeke,\s*N\.V/) // misformatted split
  })

  it("initialises given name correctly: 'Van Labeke, N.'", async () => {
    const html = await formatCitation(confPaper, 'umuai-nvl')
    expect(html).toMatch(/Van Labeke,\s*N\./)
  })
})

describe('formatCitation [umuai-nvl] — conference papers', () => {
  it('includes conference location when place is present', async () => {
    const html = await formatCitation(confPaper, 'umuai-nvl')
    expect(html).toContain('Edinburgh')
  })

  it('does not error when place is absent', async () => {
    const html = await formatCitation(confPaperNoPlace, 'umuai-nvl')
    expect(html).toBeTruthy()
    expect(html).toContain('Van Labeke')
  })

  it('includes the proceedings venue', async () => {
    const html = await formatCitation(confPaper, 'umuai-nvl')
    expect(html).toContain('Proceedings of LAK 2016')
  })
})

describe('formatCitation [umuai-nvl] — journal articles', () => {
  it('includes journal name', async () => {
    const html = await formatCitation(journalArticle, 'umuai-nvl')
    expect(html).toContain('Assessment')
  })

  it('lists both authors', async () => {
    const html = await formatCitation(journalArticle, 'umuai-nvl')
    expect(html).toContain('Whitelock')
    expect(html).toContain('Van Labeke')
  })
})

// ---------------------------------------------------------------
// apa-7 style
// ---------------------------------------------------------------

describe('formatCitation [apa-7] — basic rendering', () => {
  it('renders without error', async () => {
    const html = await formatCitation(confPaper, 'apa-7')
    expect(html).toBeTruthy()
  })

  it('includes compound surname correctly', async () => {
    const html = await formatCitation(confPaper, 'apa-7')
    expect(html).toContain('Van Labeke')
  })

  it('includes year', async () => {
    const html = await formatCitation(confPaper, 'apa-7')
    expect(html).toContain('2016')
  })

  it("uses '&' (not 'and') as multi-author separator", async () => {
    const html = await formatCitation(journalArticle, 'apa-7')
    // citation-js HTML-encodes & as &#38;
    expect(html).toContain('&#38;')
    expect(html).not.toContain(', and ')
  })
})

// ---------------------------------------------------------------
// style distinctiveness
// ---------------------------------------------------------------

describe('style comparison — umuai-nvl vs apa-7', () => {
  it('produce different HTML for the same input', async () => {
    const umuai = await formatCitation(confPaper, 'umuai-nvl')
    const apa = await formatCitation(confPaper, 'apa-7')
    expect(umuai).not.toBe(apa)
  })

  it("umuai-nvl uses 'and' (not '&') as multi-author separator", async () => {
    // journalArticle: [Whitelock, Van Labeke] → "Whitelock, D., and Van Labeke, N."
    // (journal title also contains & — check the author separator specifically)
    const html = await formatCitation(journalArticle, 'umuai-nvl')
    expect(html).toContain(', and Van Labeke')
    expect(html).not.toMatch(/Whitelock.*&#38;.*Van Labeke/)
  })
})

// ---------------------------------------------------------------
// batch formatting
// ---------------------------------------------------------------

describe('formatCitations — batch', () => {
  it('returns a map with one entry per publication', async () => {
    const pubs = [confPaper, journalArticle, confPaperNoPlace]
    const map = await formatCitations(pubs)
    expect(map.size).toBe(3)
    expect(map.has('AAAA0001')).toBe(true)
    expect(map.has('AAAA0002')).toBe(true)
    expect(map.has('BBBB0001')).toBe(true)
  })

  it('each entry contains the correct author surname', async () => {
    const map = await formatCitations([confPaper, journalArticle])
    expect(map.get('AAAA0001')).toContain('Van Labeke')
    expect(map.get('AAAA0002')).toContain('Whitelock')
  })

  it('apa-7 batch produces a full map', async () => {
    const map = await formatCitations([confPaper, journalArticle], 'apa-7')
    expect(map.size).toBe(2)
    expect(map.get('AAAA0001')).toContain('Van Labeke')
  })
})

// ---------------------------------------------------------------
// getActiveCitationStyle — env var
// ---------------------------------------------------------------

describe('getActiveCitationStyle', () => {
  afterEach(() => {
    delete process.env.CITATION_STYLE
  })

  it('defaults to umuai-nvl when env var is unset', () => {
    delete process.env.CITATION_STYLE
    expect(getActiveCitationStyle()).toBe('umuai-nvl')
  })

  it('returns apa-7 when CITATION_STYLE=apa-7', () => {
    process.env.CITATION_STYLE = 'apa-7'
    expect(getActiveCitationStyle()).toBe('apa-7')
  })

  it('falls back to umuai-nvl for unrecognised values', () => {
    process.env.CITATION_STYLE = 'chicago-notes'
    expect(getActiveCitationStyle()).toBe('umuai-nvl')
  })
})
