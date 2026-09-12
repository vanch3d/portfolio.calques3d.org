import { describe, it, expect } from 'vitest'
import { markdownToHtml } from './markdown'

describe('markdownToHtml', () => {
  it('returns a string', async () => {
    const result = await markdownToHtml('hello')
    expect(typeof result).toBe('string')
  })

  it('handles an empty string', async () => {
    const result = await markdownToHtml('')
    expect(result.trim()).toBe('')
  })

  it('converts plain text to a paragraph', async () => {
    const result = await markdownToHtml('Hello world.')
    expect(result).toContain('<p>')
    expect(result).toContain('Hello world.')
  })

  it('converts a level-1 heading', async () => {
    const result = await markdownToHtml('# Section Title')
    expect(result).toContain('<h1>')
    expect(result).toContain('Section Title')
  })

  it('converts a level-2 heading', async () => {
    const result = await markdownToHtml('## Subsection')
    expect(result).toContain('<h2>')
    expect(result).toContain('Subsection')
  })

  it('converts bold text', async () => {
    const result = await markdownToHtml('This is **bold** text.')
    expect(result).toContain('<strong>')
    expect(result).toContain('bold')
  })

  it('converts inline code', async () => {
    const result = await markdownToHtml('Use `markdownToHtml()` here.')
    expect(result).toContain('<code>')
    expect(result).toContain('markdownToHtml()')
  })

  it('converts hyperlinks', async () => {
    const result = await markdownToHtml('[ADR 019](https://example.com/019)')
    expect(result).toContain('<a href="https://example.com/019"')
    expect(result).toContain('ADR 019')
  })

  it('converts unordered lists', async () => {
    const result = await markdownToHtml('- Item one\n- Item two\n- Item three')
    expect(result).toContain('<ul>')
    expect(result).toContain('<li>')
    expect(result).toContain('Item one')
    expect(result).toContain('Item three')
  })

  it('converts ordered lists', async () => {
    const result = await markdownToHtml('1. First\n2. Second\n3. Third')
    expect(result).toContain('<ol>')
    expect(result).toContain('<li>')
    expect(result).toContain('First')
  })

  it('converts GFM tables', async () => {
    const table = [
      '| Option | Decision |',
      '| --- | --- |',
      '| A | Rejected |',
      '| B | Accepted |',
    ].join('\n')
    const result = await markdownToHtml(table)
    expect(result).toContain('<table>')
    expect(result).toContain('<th>')
    expect(result).toContain('Option')
    expect(result).toContain('Accepted')
  })

  it('does not include raw markdown syntax in output', async () => {
    const result = await markdownToHtml('# Heading\n\nSome **bold** text.')
    expect(result).not.toContain('# Heading')
    expect(result).not.toContain('**bold**')
  })

  it('preserves content across heading and paragraph', async () => {
    const md = '# Title\n\nFirst paragraph.\n\nSecond paragraph.'
    const result = await markdownToHtml(md)
    expect(result).toContain('Title')
    expect(result).toContain('First paragraph.')
    expect(result).toContain('Second paragraph.')
  })
})
