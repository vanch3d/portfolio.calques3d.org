"use client";

import { useEffect, useRef, useState } from "react";

interface MermaidProps {
  chart: string;
}

/**
 * Renders a Mermaid diagram client-side.
 * Used via MDX component override — mermaid fenced code blocks in .mdx files
 * are mapped to this component in mdx-components.tsx.
 *
 * ID strategy: a per-invocation unique ID (timestamp + random suffix) avoids the
 * React Strict Mode double-invocation conflict. useId() returns the same value on
 * both runs — mermaid.render() appends a hidden element to document.body with that
 * ID, and the second call finds the orphan from the first and silently produces
 * nothing. A per-invocation ID prevents the collision; the cleanup removes the orphan.
 *
 * Note: build-time SVG rendering via rehype-mermaid is the preferred long-term
 * approach (no client JS, works with SSG). It requires Playwright, which will be
 * available once E2E tests are set up. See ADR 002, ADR 003.
 */
export function Mermaid({ chart }: MermaidProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    let cancelled = false;
    const renderId = `mermaid-${Date.now()}-${Math.random().toString(36).slice(2)}`;

    import("mermaid")
      .then(({ default: mermaid }) => {
        mermaid.initialize({
          startOnLoad: false,
          theme: "neutral",
          fontFamily: "inherit",
        });
        return mermaid.render(renderId, chart);
      })
      .then(({ svg }) => {
        if (!cancelled && ref.current) {
          ref.current.innerHTML = svg;
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : String(err);
          console.error("[Mermaid] render failed:", message);
          setError(message);
        }
      });

    return () => {
      cancelled = true;
      // Remove any orphaned hidden element mermaid left in document.body
      document.getElementById(renderId)?.remove();
    };
  }, [chart]);

  if (error) {
    return (
      <pre className="my-6 rounded border border-border bg-surface-raised p-4 text-sm text-foreground-secondary">
        {`[Diagram error] ${error}`}
      </pre>
    );
  }

  return (
    <div
      ref={ref}
      className="my-6 flex justify-center overflow-x-auto"
      role="img"
      aria-label="Diagram"
    />
  );
}
