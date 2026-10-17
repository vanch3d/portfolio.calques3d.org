import Link from 'next/link'

export interface ChapterItem {
  number: number
  slug: string // short segment — used as anchor id or route segment
  title: string

  teaser?: string
}

interface ChapterListProps {
  chapters: ChapterItem[]
  /**
   * anchor — links to #slug on the current page (single-page hub)
   * route  — links to basePath/slug (separate route per chapter)
   * Default: anchor
   */
  mode?: 'anchor' | 'route'
  /** Required when mode="route". E.g. "/case-studies/hivemq-edge/design-retro" */
  basePath?: string
}

export function ChapterList({ chapters, mode = 'anchor', basePath }: ChapterListProps) {
  function href(slug: string): { pathname: string } | string {
    if (mode === 'route') {
      return { pathname: `${basePath ?? ''}/${slug}` }
    }
    return `#${slug}`
  }

  return (
    <nav aria-label="Chapter list">
      <ol>
        {chapters.map((chapter) => (
          <li key={chapter.slug}>
            <Link href={href(chapter.slug) as never}>
              <span aria-hidden="true">{chapter.number}.</span> {chapter.title}
            </Link>
            {chapter.teaser && <p>{chapter.teaser}</p>}
          </li>
        ))}
      </ol>
    </nav>
  )
}
