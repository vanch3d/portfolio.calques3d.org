"use client";

import { useEffect, useId, useRef } from "react";

type MermaidProps = {
  chart: string;
};

export function Mermaid({ chart }: MermaidProps) {
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;

    async function render() {
      const mermaid = (await import("mermaid")).default;
      mermaid.initialize({ startOnLoad: false, theme: "neutral" });

      if (!ref.current || cancelled) return;
      const { svg } = await mermaid.render(
        `mermaid-${id.replace(/:/g, "")}`,
        chart,
      );
      if (!cancelled && ref.current) {
        ref.current.innerHTML = svg;
      }
    }

    render();
    return () => {
      cancelled = true;
    };
  }, [chart, id]);

  return (
    <div
      ref={ref}
      role="img"
      aria-label="Mermaid diagram"
      className="overflow-x-auto py-md"
    />
  );
}
