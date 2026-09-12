import type { MDXComponents } from 'mdx/types'
import type { ComponentPropsWithoutRef } from 'react'
import { Mermaid } from '@/components/ui/Mermaid'

/**
 * Global MDX component overrides.
 * Maps HTML elements and custom components for all MDX files site-wide.
 *
 * Mermaid: fenced code blocks tagged ```mermaid are intercepted at the <pre>
 * level and routed to the client-side <Mermaid> component.
 * Long-term: migrate to rehype-mermaid (build-time SVG) once Playwright is
 * installed for E2E tests. See ADR 002, ADR 003.
 */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    pre(props: ComponentPropsWithoutRef<'pre'>) {
      const child = props.children as React.ReactElement<ComponentPropsWithoutRef<'code'>> | null

      if (
        child?.type === 'code' &&
        typeof child.props.className === 'string' &&
        child.props.className.includes('language-mermaid')
      ) {
        const chart = String(child.props.children).trim()
        return <Mermaid chart={chart} />
      }

      return <pre {...props} />
    },
    ...components,
  }
}
