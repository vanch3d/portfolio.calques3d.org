import { afterEach, describe, expect, it, vi } from 'vitest'
import { FLAGS, isFlagEnabled, parseFlagValue } from './flags'

afterEach(() => {
  vi.unstubAllEnvs()
})

describe('parseFlagValue', () => {
  it.each(['true', '1', 'on', 'YES', ' True '])('reads %j as on', (raw) => {
    expect(parseFlagValue(raw)).toBe(true)
  })

  it.each(['false', '0', 'off', 'NO'])('reads %j as off', (raw) => {
    expect(parseFlagValue(raw)).toBe(false)
  })

  it('returns undefined for unset or unrecognised values', () => {
    expect(parseFlagValue(undefined)).toBeUndefined()
    expect(parseFlagValue('maybe')).toBeUndefined()
    expect(parseFlagValue('')).toBeUndefined()
  })
})

describe('isFlagEnabled', () => {
  it('falls back to the registry default when the env var is unset', () => {
    vi.stubEnv('NEXT_PUBLIC_FLAG_CHAPTER_RAIL', '')
    expect(isFlagEnabled('chapterRail')).toBe(FLAGS.chapterRail.default)
  })

  it('lets the env var switch the chapter rail off', () => {
    vi.stubEnv('NEXT_PUBLIC_FLAG_CHAPTER_RAIL', 'false')
    expect(isFlagEnabled('chapterRail')).toBe(false)
  })

  it('lets the env var switch the chapter rail on', () => {
    vi.stubEnv('NEXT_PUBLIC_FLAG_CHAPTER_RAIL', '1')
    expect(isFlagEnabled('chapterRail')).toBe(true)
  })

  it('ignores an unparseable env value', () => {
    vi.stubEnv('NEXT_PUBLIC_FLAG_CHAPTER_RAIL', 'banana')
    expect(isFlagEnabled('chapterRail')).toBe(FLAGS.chapterRail.default)
  })
})
