"use client";

import { useEffect, useId, useRef } from "react";

interface MermaidProps {
  chart: string;
}

/**
 * Renders a Mermaid diagram client-side.
 * Used via MDX component override — mermaid fenced code blocks in .mdx files
 * are mapped to this component in mdx-components.tsx.
 *
 * Note: build-time SVG rendering via rehype-mermaid is the preferred long-term
 * approach (no client JS, works with SSG). It requires Playwright, which will be
 * available once E2E tests are set up. See ADR 002, ADR 003.
 */
export function Mermaid({ chart }: MermaidProps) {
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    import("mermaid").then(({ default: mermaid }) => {
      mermaid.initialize({
        startOnLoad: false,
        theme: "neutral",
        fontFamily: "inherit",
      });

      const safeId = `mermaid-${id.replace(/:/g, "")}`;
      mermaid.render(safeId, chart).then(({ svg }) => {
        if (ref.current) {
          ref.current.innerHTML = svg;
        }
      });
    });
  }, [chart, id]);

  return (
    <div
      ref={ref}
      className="my-6 flex justify-center overflow-x-auto"
      role="img"
      aria-label="Diagram"
    />
  );
}
