import { createElement, Fragment, type ReactNode } from 'react'
import { describe, expect, it } from 'vitest'
import {
  buildCaseBlocks,
  extractH1,
  textOf,
  unwrapMdxChildren,
  type BlockMarkers,
} from './case-study-blocks'

const M: BlockMarkers = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  p: 'p',
  img: 'img',
  blockquote: 'blockquote',
}

const h1 = (t: string) => createElement('h1', null, t)
const h2 = (t: string) => createElement('h2', null, t)
const h3 = (t: string) => createElement('h3', null, t)
const p = (t: string) => createElement('p', null, t)
const fig = (src: string) => createElement('p', null, createElement('img', { src, alt: 'a' }))
const quote = (t: string) => createElement('blockquote', null, createElement('p', null, t))

function build(nodes: ReactNode[], opts = {}) {
  return buildCaseBlocks(nodes, M, opts)
}

describe('buildCaseBlocks', () => {
  it('drops the H1', () => {
    expect(build([h1('Title'), p('Body')])).toEqual([{ kind: 'beat', content: 'Body', plates: [] }])
  })

  it('treats the first paragraph before any heading as the lead when asked', () => {
    const blocks = build([h1('T'), p('Lead'), h2('One'), p('Body')], { lead: true })
    expect(blocks.map((b) => b.kind)).toEqual(['lead', 'heading', 'beat'])
  })

  it('does not take a lead by default', () => {
    expect(build([p('First')])[0].kind).toBe('beat')
  })

  it('numbers h2 sections 1, 2, 3', () => {
    const blocks = build([h2('A'), h2('B')])
    expect(blocks).toMatchObject([
      { kind: 'heading', tag: 'h2', size: 'section', number: '1' },
      { kind: 'heading', tag: 'h2', size: 'section', number: '2' },
    ])
  })

  it('demotes h3-only documents to h2 and scopes numbers to the chapter', () => {
    const blocks = build([h3('A'), h3('B')], { chapterNo: 3 })
    expect(blocks).toMatchObject([
      { kind: 'heading', tag: 'h2', size: 'subsection', number: '3.1' },
      { kind: 'heading', tag: 'h2', size: 'subsection', number: '3.2' },
    ])
  })

  it('keeps h3 under h2 and numbers it section.sub', () => {
    const blocks = build([h2('A'), h3('a'), h3('b'), h2('B'), h3('c')])
    expect(blocks.map((b) => (b.kind === 'heading' ? b.number : ''))).toEqual([
      '1',
      '1.1',
      '1.2',
      '2',
      '2.1',
    ])
    expect(blocks[1]).toMatchObject({ tag: 'h3' })
  })

  it('groups a paragraph with all figures that trail it', () => {
    const blocks = build([p('Text'), fig('images/1-a.png'), fig('images/2-b.png'), p('Next')])
    expect(blocks).toHaveLength(2)
    expect(blocks[0]).toMatchObject({
      kind: 'beat',
      plates: [
        { kind: 'figure', no: 1, src: 'images/1-a.png' },
        { kind: 'figure', no: 2, src: 'images/2-b.png' },
      ],
    })
    expect(blocks[1]).toMatchObject({ kind: 'beat', plates: [] })
  })

  it('renders a figure with no preceding paragraph as a standalone plate', () => {
    const blocks = build([h2('A'), fig('images/1-a.png')])
    expect(blocks[1]).toMatchObject({ kind: 'plate', plate: { kind: 'figure', no: 1 } })
  })

  it('turns [!NOTE] into a pending plate and never keeps its body', () => {
    const blocks = build([p('Text'), quote('[!NOTE]\nA screenshot of the canvas would help')])
    expect(blocks).toHaveLength(1)
    expect(blocks[0]).toMatchObject({ kind: 'beat', plates: [{ kind: 'pending', no: 1 }] })
    expect(JSON.stringify(blocks)).not.toContain('canvas')
  })

  it('numbers real and pending plates in one sequence', () => {
    const blocks = build([p('One'), quote('[!NOTE] x'), p('Two'), fig('images/1-a.png')])
    expect(blocks.flatMap((b) => (b.kind === 'beat' ? b.plates.map((pl) => pl.no) : []))).toEqual([
      1, 2,
    ])
  })

  it('turns [!TODO] into a work-in-progress block that keeps its body', () => {
    expect(build([quote('[!TODO]\nComparison goes here')])).toEqual([
      { kind: 'wip', text: 'Comparison goes here' },
    ])
  })

  it('leaves an ordinary blockquote alone', () => {
    expect(build([quote('"Legacy code."')])[0].kind).toBe('other')
  })

  it('ignores whitespace-only text between nodes', () => {
    expect(build(['\n', p('A'), '\n'])).toHaveLength(1)
  })
})

describe('textOf', () => {
  it('flattens nested elements and arrays', () => {
    expect(textOf(createElement('p', null, 'a', createElement('b', null, 'b'), ['c']))).toBe('abc')
  })
})

describe('extractH1', () => {
  it('returns the first level-1 heading', () => {
    expect(extractH1('intro\n# The Title: Sub\n\n## Not this')).toBe('The Title: Sub')
  })

  it('returns null without one', () => {
    expect(extractH1('## only h2')).toBeNull()
  })
})

describe('unwrapMdxChildren', () => {
  it('calls the content component once and unwraps its fragment', () => {
    const Content = () => createElement(Fragment, null, p('A'), p('B'))
    const out = unwrapMdxChildren(createElement(Content))
    expect(buildCaseBlocks(out, M)).toHaveLength(2)
  })

  it('passes non-component children through', () => {
    expect(unwrapMdxChildren('text')).toBe('text')
    const node = p('x')
    expect(unwrapMdxChildren(node)).toBe(node)
  })
})
