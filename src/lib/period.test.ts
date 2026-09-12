import { describe, it, expect } from 'vitest'
import { extractYear, formatPeriod } from './period'

describe('extractYear', () => {
  it('extracts year from YYYY string', () => {
    expect(extractYear('1995')).toBe('1995')
  })

  it('extracts year from YYYY-MM string', () => {
    expect(extractYear('2023-04')).toBe('2023')
  })

  it('extracts year from YYYY-MM-DD string', () => {
    expect(extractYear('2010-09-01')).toBe('2010')
  })

  it('throws for an empty string', () => {
    expect(() => extractYear('')).toThrow('Invalid period date string: ""')
  })

  it('throws when the string does not start with four digits', () => {
    expect(() => extractYear('abc-04')).toThrow('Invalid period date string: "abc-04"')
  })
})

describe('formatPeriod', () => {
  it('formats a closed period as YYYY–YYYY', () => {
    expect(formatPeriod('1995', '2010', 'present')).toBe('1995–2010')
  })

  it('formats a closed period with YYYY-MM start and end', () => {
    expect(formatPeriod('2023-04', '2024-12', 'present')).toBe('2023–2024')
  })

  it('formats an open-ended period using the presentLabel', () => {
    expect(formatPeriod('2023-04', null, 'present')).toBe('2023–present')
  })

  it('uses the supplied presentLabel verbatim', () => {
    expect(formatPeriod('2018', null, "aujourd'hui")).toBe("2018–aujourd'hui")
  })

  it('throws when start is invalid', () => {
    expect(() => formatPeriod('not-a-date', null, 'present')).toThrow()
  })

  it('throws when end is invalid', () => {
    expect(() => formatPeriod('2020', 'bad', 'present')).toThrow()
  })
})
