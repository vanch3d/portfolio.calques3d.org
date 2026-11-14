/**
 * CaseStudyBody — plain sync Server Component
 *
 * Renders a compiled MDX module in the case-study grammar. The MDX `wrapper`
 * override receives the document nodes, classifies them (case-study-blocks.ts)
 * and lays them out: numbered headings, beats (paragraph + trailing plates),
 * standalone plates, authoring-state blocks. Everything else keeps its element
 * with the case-study prose styling below.
 */

import type { ComponentType, ReactNode } from 'react'
import type { MDXComponents } from 'mdx/types'
import Link from 'next/link'
import type { Route } from 'next'
import {
  buildCaseBlocks,
  unwrapMdxChildren,
  type BlockMarkers,
  type CaseBlock,
} from '@/lib/case-study-blocks'
import type { CaseStudyImageMap } from '@/lib/content/case-study-images'
import { CaseBeat } from './CaseBeat'
import { CaseFigure } from './CaseFigure'
import { CaseSectionHeading } from './CaseSectionHeading'
import { CaseWip } from './CaseWip'

type ChildrenProps = { children?: ReactNode }

function CaseH1({ children }: ChildrenProps) {
  return <h1>{children}</h1>
}
function CaseH2({ children }: ChildrenProps) {
  return <h2>{children}</h2>
}
function CaseH3({ children }: ChildrenProps) {
  return <h3>{children}</h3>
}
function CaseParagraph({ children }: ChildrenProps) {
  return <p>{children}</p>
}
function CaseImage({ alt }: { alt?: string }) {
  return <span role="img" aria-label={alt} />
}
function CaseBlockquote({ children }: ChildrenProps) {
  return (
    <blockquote className="my-md max-w-prose border-l-medium border-ink-ghost pl-md not-italic [&_em]:not-italic">
      {children}
    </blockquote>
  )
}
function CaseList({ children }: ChildrenProps) {
  return <ul className="mb-md max-w-prose list-disc pl-md">{children}</ul>
}
function CaseOrderedList({ children }: ChildrenProps) {
  return <ol className="mb-md max-w-prose list-decimal pl-md">{children}</ol>
}
function CaseListItem({ children }: ChildrenProps) {
  return <li className="pl-xs [&+&]:mt-sm">{children}</li>
}
function CaseRule() {
  return <hr className="max-w-prose" />
}
function CaseLink({ href = '', children }: { href?: string; children?: ReactNode }) {
  const className = 'nav-link text-ink'
  return href.startsWith('/') ? (
    <Link href={href as Route} className={className}>
      {children}
    </Link>
  ) : (
    <a href={href} className={className}>
      {children}
    </a>
  )
}

const MARKERS: BlockMarkers = {
  h1: CaseH1,
  h2: CaseH2,
  h3: CaseH3,
  p: CaseParagraph,
  img: CaseImage,
  blockquote: CaseBlockquote,
}

type CaseStudyBodyProps = {
  Content: ComponentType<{ components?: MDXComponents }>
  images?: CaseStudyImageMap
  /** Render the first paragraph before any heading as the lead (flat cases). */
  lead?: boolean
  /** Chapter number: prefixes subsection numbers ("3.1"). */
  chapterNo?: number
  /** Margin note attached to the first paragraph's beat (the hub's reading guide). */
  aside?: ReactNode
  /** Renders the title block; receives the lead paragraph when `lead` is set. */
  renderTitleBlock?: (lead: ReactNode | null) => ReactNode
}

export function CaseStudyBody({
  Content,
  images = {},
  lead = false,
  chapterNo,
  aside,
  renderTitleBlock,
}: CaseStudyBodyProps) {
  function Wrapper({ children }: ChildrenProps) {
    const blocks = buildCaseBlocks(unwrapMdxChildren(children), MARKERS, { lead, chapterNo })
    const leadBlock = blocks.find((b) => b.kind === 'lead')
    const leadNode = leadBlock?.kind === 'lead' ? <p>{leadBlock.content}</p> : null
    const firstBeat = blocks.findIndex((b) => b.kind === 'beat')

    return (
      <>
        {renderTitleBlock ? renderTitleBlock(leadNode) : leadNode}
        <div data-testid="case-body">
          {blocks.map((block, i) => (
            <BlockView
              key={i}
              block={block}
              images={images}
              aside={i === firstBeat ? aside : undefined}
            />
          ))}
          {firstBeat === -1 ? aside : null}
        </div>
      </>
    )
  }

  return (
    <Content
      components={{
        wrapper: Wrapper,
        h1: CaseH1,
        h2: CaseH2,
        h3: CaseH3,
        p: CaseParagraph,
        img: CaseImage,
        blockquote: CaseBlockquote,
        ul: CaseList,
        ol: CaseOrderedList,
        li: CaseListItem,
        hr: CaseRule,
        a: CaseLink,
      }}
    />
  )
}

type BlockViewProps = {
  block: CaseBlock
  images: CaseStudyImageMap
  aside?: ReactNode
}

function BlockView({ block, images, aside }: BlockViewProps) {
  switch (block.kind) {
    case 'lead':
      return null
    case 'heading':
      return (
        <CaseSectionHeading tag={block.tag} size={block.size} number={block.number}>
          {block.content}
        </CaseSectionHeading>
      )
    case 'beat':
      return (
        <CaseBeat plates={block.plates} images={images} aside={aside}>
          {block.content}
        </CaseBeat>
      )
    case 'plate':
      return (
        <div className="my-lg max-w-prose">
          <CaseFigure plate={block.plate} images={images} />
        </div>
      )
    case 'wip':
      return <CaseWip text={block.text} />
    case 'other':
      return <div className="max-w-prose">{block.node}</div>
  }
}
