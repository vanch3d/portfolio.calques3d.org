import { describe, it, expect } from 'vitest'
import { buildResourceCounts } from './project-resources'
import type { EngineeringProject, ResearchProject } from '@/types/content'

const ENGINEERING_BASE: EngineeringProject = {
  slug: 'hivemq-edge',
  title: 'HiveMQ Edge',
  type: 'engineering',
  status: 'ongoing',
  visibility: 'public',
  featured: true,
  position: 'hivemq',
  period: { start: '2023-04', end: null },
  links: { github: ['hivemq/hivemq-edge'], external: ['https://hivemq.com'] },
  media: { cover: '', gallery: '', slides: '' },
  tags: ['React'],
}

const RESEARCH_BASE: ResearchProject = {
  slug: 'calques3d',
  title: 'Calques 3D',
  type: 'research',
  status: 'archived',
  visibility: 'public',
  featured: true,
  position: 'nancy',
  period: { start: '1995', end: '2010' },
  links: { github: [], external: ['https://nvl.calques3d.org/'] },
  media: { cover: '', gallery: 'calques3d', slides: '' },
  tags: ['3D geometry'],
}

describe('buildResourceCounts', () => {
  it('counts github links as repositories', () => {
    const counts = buildResourceCounts(ENGINEERING_BASE, {
      publicationsCount: 0,
      caseStudiesCount: 1,
    })
    expect(counts.repositories).toBe(1)
  })

  it('counts external links (no live URL)', () => {
    const counts = buildResourceCounts(ENGINEERING_BASE, {
      publicationsCount: 0,
      caseStudiesCount: 0,
    })
    expect(counts.external).toBe(1)
  })

  it('adds a live-deployment link to the external count', () => {
    const withLive = {
      ...ENGINEERING_BASE,
      links: { ...ENGINEERING_BASE.links, live: 'https://x.com' },
    }
    const counts = buildResourceCounts(withLive, { publicationsCount: 0, caseStudiesCount: 0 })
    expect(counts.external).toBe(2)
  })

  it('treats an empty media.gallery string as zero', () => {
    const counts = buildResourceCounts(ENGINEERING_BASE, {
      publicationsCount: 0,
      caseStudiesCount: 0,
    })
    expect(counts.gallery).toBe(0)
  })

  it('treats a non-empty media.gallery string as one', () => {
    const counts = buildResourceCounts(RESEARCH_BASE, {
      publicationsCount: 5,
      caseStudiesCount: 0,
    })
    expect(counts.gallery).toBe(1)
  })

  it('passes through the publications and case-studies counts unchanged', () => {
    const counts = buildResourceCounts(RESEARCH_BASE, {
      publicationsCount: 12,
      caseStudiesCount: 3,
    })
    expect(counts.publications).toBe(12)
    expect(counts.caseStudies).toBe(3)
  })

  it('handles a project with no media field at all', () => {
    const { media: _media, ...withoutMedia } = ENGINEERING_BASE
    void _media
    const counts = buildResourceCounts(withoutMedia as EngineeringProject, {
      publicationsCount: 0,
      caseStudiesCount: 0,
    })
    expect(counts.slides).toBe(0)
    expect(counts.gallery).toBe(0)
  })
})
