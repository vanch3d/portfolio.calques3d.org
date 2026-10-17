/**
 * Engineering Insights content layer
 *
 * Reads and parses all Engineering Insight documents from .docs/insights/*.md.
 * Server-side only — uses Node.js fs module.
 * Rendering: SSG (force-static on /lab/insights routes)
 */

import 'server-only'
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import matter from 'gray-matter'

const INSIGHTS_DIR = join(process.cwd(), '.docs/insights')

export type InsightMeta = {
  number: number
  title: string
  date: string
  discoveredDuring: string
  relatedAdr?: number
  tags: string[]
  slug: string
}

export type Insight = InsightMeta & {
  body: string
}

type InsightFrontmatter = {
  number: number
  title: string
  date: string
  'discovered-during': string
  'related-adr'?: number
  tags?: string[]
}

function slugFromFilename(filename: string): string {
  return filename.replace(/\.md$/, '')
}

function parseInsightFile(filename: string): Insight {
  const raw = readFileSync(join(INSIGHTS_DIR, filename), 'utf-8')
  const { data, content } = matter(raw)
  const fm = data as InsightFrontmatter

  return {
    number: fm.number,
    title: fm.title,
    date: typeof fm.date === 'string' ? fm.date : String(fm.date),
    discoveredDuring: fm['discovered-during'] ?? '',
    relatedAdr: fm['related-adr'],
    tags: Array.isArray(fm.tags) ? fm.tags : [],
    slug: slugFromFilename(filename),
    body: content.trim(),
  }
}

function getInsightFilenames(): string[] {
  try {
    return readdirSync(INSIGHTS_DIR)
      .filter((f) => f.endsWith('.md'))
      .sort()
  } catch {
    return []
  }
}

/**
 * Returns all Insight metadata, sorted by number descending (most recent first).
 */
export async function getAllInsights(): Promise<InsightMeta[]> {
  const filenames = getInsightFilenames()
  const insights = filenames.map((f) => {
    const { body: _body, ...meta } = parseInsightFile(f)
    void _body
    return meta
  })
  return insights.sort((a, b) => b.number - a.number)
}

/**
 * Returns a single Insight by slug, or null if not found.
 */
export async function getInsight(slug: string): Promise<Insight | null> {
  const filename = `${slug}.md`
  try {
    return parseInsightFile(filename)
  } catch {
    return null
  }
}

/**
 * Returns all Insight slugs, for use with generateStaticParams.
 */
export async function getInsightSlugs(): Promise<string[]> {
  return getInsightFilenames().map(slugFromFilename)
}

/**
 * Returns all unique tags across all Insights, sorted alphabetically.
 */
export async function getAllInsightTags(): Promise<string[]> {
  const insights = await getAllInsights()
  const tagSet = new Set<string>()
  for (const insight of insights) {
    for (const tag of insight.tags) {
      tagSet.add(tag)
    }
  }
  return Array.from(tagSet).sort()
}

/**
 * Returns the most recent insight number, or null if none.
 */
export async function getMostRecentInsightNumber(): Promise<number | null> {
  const insights = await getAllInsights()
  if (insights.length === 0) return null
  return insights[0].number
}
