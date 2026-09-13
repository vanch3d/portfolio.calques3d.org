/**
 * Engineering projects content layer
 *
 * Mirrors the research content layer — reads frontmatter from all .mdx files
 * using gray-matter. Used by the /engineering listing and detail pages.
 *
 * Server-side only — uses Node.js fs module.
 * Rendering: SSG
 */

import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import matter from 'gray-matter'
import type { ComponentType } from 'react'
import type { EngineeringProject } from '@/types/content'

const ENGINEERING_DIR = join(process.cwd(), 'src/content/engineering')

function parseFrontmatter(filename: string): EngineeringProject {
  const raw = readFileSync(join(ENGINEERING_DIR, filename), 'utf-8')
  const { data } = matter(raw)
  const slug = filename.replace(/\.mdx$/, '')

  return {
    slug,
    ...(data as Omit<EngineeringProject, 'slug'>),
  }
}

// See the matching cache in research.ts for the rationale — content is frozen
// per build/dev process, and callers never mutate the cached elements.
let allEngineeringProjectsCache: EngineeringProject[] | null = null

/**
 * Returns all engineering projects sorted by featured first, then most recent.
 */
export function getAllEngineeringProjects(): EngineeringProject[] {
  if (allEngineeringProjectsCache) return allEngineeringProjectsCache

  const files = readdirSync(ENGINEERING_DIR).filter((f) => f.endsWith('.mdx'))
  const projects = files.map((f) => parseFrontmatter(f))

  allEngineeringProjectsCache = projects.sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1

    const aEnd = a.period.end ?? '9999'
    const bEnd = b.period.end ?? '9999'
    if (bEnd !== aEnd) return bEnd.localeCompare(aEnd)

    return b.period.start.localeCompare(a.period.start)
  })
  return allEngineeringProjectsCache
}

export function getEngineeringProjectBySlug(slug: string): EngineeringProject | null {
  try {
    return parseFrontmatter(`${slug}.mdx`)
  } catch {
    return null
  }
}

export function getEngineeringSlugs(): string[] {
  return readdirSync(ENGINEERING_DIR)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => f.replace(/\.mdx$/, ''))
}

export async function importEngineeringMDX(slug: string) {
  const mod = await import(`@/content/engineering/${slug}.mdx`)
  return mod.default as ComponentType
}
