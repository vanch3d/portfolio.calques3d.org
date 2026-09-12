import type { NextConfig } from 'next'
import createMDX from '@next/mdx'
import createNextIntlPlugin from 'next-intl/plugin'

const nextConfig: NextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  // Generates a Route type from the app/ tree — <Link href> and redirect()
  // calls with unknown routes become TypeScript errors. Run next dev or
  // next build to refresh .next/types/link.d.ts after adding/removing routes.
  typedRoutes: true,
  webpack: (config) => {
    // Ignore the specific cypress-axe dynamic require warning
    config.ignoreWarnings = [
      (warning: { message: string | string[]; module: { resource?: string | string[] } }) => {
        return (
          warning.message.includes('Critical dependency: require function is used') &&
          warning.module.resource?.includes('cypress-axe')
        )
      },
    ]
    return config
  },
}

const withMDX = createMDX({
  extension: /\.(md|mdx)$/,
  options: {
    // String-based plugin names required for Turbopack serialization.
    // See: https://nextjs.org/docs/app/guides/mdx#using-plugins-with-turbopack
    remarkPlugins: ['remark-frontmatter', 'remark-gfm'],
    // Mermaid diagrams are rendered client-side via the <Mermaid> component
    // registered in mdx-components.tsx. rehype-mermaid (build-time SVG) requires
    // Playwright at build time — deferred until Playwright is installed for E2E tests.
    // See ADR 002, ADR 003.
    rehypePlugins: [],
  },
})

// next-intl plugin — points to the request config for server-side locale resolution.
// See: src/i18n/request.ts and ADR 006.
const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

export default withNextIntl(withMDX(nextConfig))
