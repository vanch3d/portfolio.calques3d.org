import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
};

const withMDX = createMDX({
  extension: /\.(md|mdx)$/,
  options: {
    // String-based plugin names required for Turbopack serialization.
    // See: https://nextjs.org/docs/app/guides/mdx#using-plugins-with-turbopack
    remarkPlugins: ["remark-gfm"],
    // Mermaid diagrams are rendered client-side via the <Mermaid> component
    // registered in mdx-components.tsx. rehype-mermaid (build-time SVG) requires
    // Playwright at build time — deferred until Playwright is installed for E2E tests.
    // See ADR 002, ADR 003.
    rehypePlugins: [],
  },
});

export default withMDX(nextConfig);
