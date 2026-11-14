/**
 * Turns the top-level nodes of a compiled case-study MDX document into render
 * blocks: numbered headings, "beats" (a paragraph grouped with the figures
 * that trail it), standalone plates, a lead paragraph and authoring-state
 * blocks. Pure — no JSX; the renderer lives in CaseStudyBody.
 *
 * Markdown conventions understood here:
 *  - `# H1` is the title; it is dropped (the page renders the title block).
 *  - `> [!NOTE] …` is a screenshot placeholder: it becomes a pending plate and
 *    its body (an authoring instruction) is never rendered.
 *  - `> [!TODO] …` is a work-in-progress block; its body is rendered.
 */

import { Children, Fragment, isValidElement, type ElementType, type ReactNode } from 'react'

type PlateBody =
  { kind: 'figure'; src?: string; alt?: string; title?: string } | { kind: 'pending' }

export type Plate = PlateBody & { no: number }

export type CaseBlock =
  | { kind: 'lead'; content: ReactNode }
  | {
      kind: 'heading'
      tag: 'h2' | 'h3'
      size: 'section' | 'subsection'
      number: string
      content: ReactNode
    }
  | { kind: 'beat'; content: ReactNode; plates: Plate[] }
  | { kind: 'plate'; plate: Plate }
  | { kind: 'wip'; text: string }
  | { kind: 'other'; node: ReactNode }

export interface BlockMarkers {
  h1: ElementType
  h2: ElementType
  h3: ElementType
  p: ElementType
  img: ElementType
  blockquote: ElementType
}

export interface BuildOptions {
  /** Render the first paragraph before any heading as the lead. */
  lead?: boolean
  /** Chapter number; prefixes subsection numbers ("3.1"). */
  chapterNo?: number
}

type ElementWithProps = { type: unknown; props: Record<string, unknown> }

function asElement(node: ReactNode): ElementWithProps | null {
  return isValidElement(node) ? (node as unknown as ElementWithProps) : null
}

export function textOf(node: ReactNode): string {
  if (node === null || node === undefined || typeof node === 'boolean') return ''
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(textOf).join('')
  const el = asElement(node)
  return el ? textOf(el.props.children as ReactNode) : ''
}

/** First `# H1` line of a markdown source, if any. */
export function extractH1(source: string): string | null {
  const match = /^#[ \t]+(.+?)[ \t]*$/m.exec(source)
  return match ? match[1] : null
}

type Alert = { kind: 'NOTE' | 'TODO'; rest: string }

function parseAlert(text: string): Alert | null {
  const match = /^\s*\[!(NOTE|TODO)\]\s*([\s\S]*)$/.exec(text)
  return match ? { kind: match[1] as Alert['kind'], rest: match[2].trim() } : null
}

type Classified =
  | { type: 'title' }
  | { type: 'h2'; content: ReactNode }
  | { type: 'h3'; content: ReactNode }
  | { type: 'paragraph'; content: ReactNode }
  | { type: 'plate'; plate: PlateBody }
  | { type: 'wip'; text: string }
  | { type: 'other'; node: ReactNode }

function classify(node: ReactNode, markers: BlockMarkers): Classified {
  const el = asElement(node)
  if (!el) return { type: 'other', node }
  const children = el.props.children as ReactNode

  if (el.type === markers.h1) return { type: 'title' }
  if (el.type === markers.h2) return { type: 'h2', content: children }
  if (el.type === markers.h3) return { type: 'h3', content: children }

  if (el.type === markers.p) {
    const parts = Children.toArray(children).filter(
      (c) => !(typeof c === 'string' && c.trim() === '')
    )
    const only = parts.length === 1 ? asElement(parts[0]) : null
    if (only && only.type === markers.img) {
      const { src, alt, title } = only.props as { src?: string; alt?: string; title?: string }
      return { type: 'plate', plate: { kind: 'figure', src, alt, title } }
    }
    return { type: 'paragraph', content: children }
  }

  if (el.type === markers.blockquote) {
    const alert = parseAlert(textOf(children))
    if (alert?.kind === 'NOTE') return { type: 'plate', plate: { kind: 'pending' } }
    if (alert?.kind === 'TODO') return { type: 'wip', text: alert.rest }
  }

  return { type: 'other', node }
}

export function buildCaseBlocks(
  children: ReactNode,
  markers: BlockMarkers,
  options: BuildOptions = {}
): CaseBlock[] {
  const items = Children.toArray(children)
    .filter((c) => !(typeof c === 'string' && c.trim() === ''))
    .map((c) => classify(c, markers))

  const hasH2 = items.some((i) => i.type === 'h2')
  const blocks: CaseBlock[] = []
  let plateNo = 0
  let section = 0
  let subsection = 0
  let seenHeading = false
  let leadTaken = false

  const nextPlate = (plate: PlateBody): Plate => ({ ...plate, no: ++plateNo })

  for (let i = 0; i < items.length; i++) {
    const item = items[i]

    if (item.type === 'title') continue

    if (item.type === 'h2' || item.type === 'h3') {
      seenHeading = true
      if (item.type === 'h2') {
        section++
        subsection = 0
        blocks.push({
          kind: 'heading',
          tag: 'h2',
          size: 'section',
          number: String(section),
          content: item.content,
        })
      } else if (hasH2) {
        subsection++
        blocks.push({
          kind: 'heading',
          tag: 'h3',
          size: 'subsection',
          number: `${section}.${subsection}`,
          content: item.content,
        })
      } else {
        subsection++
        const chapterNo = options.chapterNo
        blocks.push({
          kind: 'heading',
          tag: 'h2',
          size: chapterNo === undefined ? 'section' : 'subsection',
          number: chapterNo === undefined ? String(subsection) : `${chapterNo}.${subsection}`,
          content: item.content,
        })
      }
      continue
    }

    if (item.type === 'paragraph') {
      if (options.lead && !seenHeading && !leadTaken) {
        leadTaken = true
        blocks.push({ kind: 'lead', content: item.content })
        continue
      }
      const plates: Plate[] = []
      while (i + 1 < items.length) {
        const next = items[i + 1]
        if (next.type !== 'plate') break
        plates.push(nextPlate(next.plate))
        i++
      }
      blocks.push({ kind: 'beat', content: item.content, plates })
      continue
    }

    if (item.type === 'plate') {
      blocks.push({ kind: 'plate', plate: nextPlate(item.plate) })
      continue
    }

    if (item.type === 'wip') {
      blocks.push({ kind: 'wip', text: item.text })
      continue
    }

    blocks.push({ kind: 'other', node: item.node })
  }

  return blocks
}

/**
 * Compiled MDX hands its `wrapper` a single child: the internal content
 * component, not the document nodes. Calls it once and unwraps the fragment it
 * returns so the nodes can be classified. Anything else passes through.
 */
export function unwrapMdxChildren(children: ReactNode): ReactNode {
  const el = asElement(children)
  if (!el) return children
  const rendered =
    typeof el.type === 'function' ? (el.type as (props: unknown) => ReactNode)(el.props) : children
  const inner = asElement(rendered)
  return inner && inner.type === Fragment ? (inner.props.children as ReactNode) : rendered
}
