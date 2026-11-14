/**
 * CaseStudiesLeadBody — plain sync Server Component
 *
 * Renders the collection index.mdx as the landing lead: its H2 becomes the
 * page title (the page's only h1) and the authoring H1 is dropped.
 */

import type { ComponentType, ReactNode } from 'react'
import type { MDXComponents } from 'mdx/types'

type ChildrenProps = { children?: ReactNode }

function DroppedHeading() {
  return null
}

function LeadTitle({ children }: ChildrenProps) {
  return <h1 className="mt-sm mb-md max-w-prose text-headline leading-headline">{children}</h1>
}

type CaseStudiesLeadBodyProps = {
  Content: ComponentType<{ components?: MDXComponents }>
}

export function CaseStudiesLeadBody({ Content }: CaseStudiesLeadBodyProps) {
  return <Content components={{ h1: DroppedHeading, h2: LeadTitle }} />
}
