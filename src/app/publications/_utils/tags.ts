import { Publication } from '@/types/content'
import { TagWithCount } from '@/lib/content/adr'

export function getPublicationTags(publications: Publication[]): TagWithCount[] {
  const tagCounts = new Map<string, number>()
  for (const pub of publications) {
    for (const tag of pub.tags) {
      tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1)
    }
  }
  return Array.from(tagCounts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag))
}
