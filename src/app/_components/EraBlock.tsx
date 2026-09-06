/**
 * EraBlock — a single era card in the below-fold section.
 *
 * Structure (from comp):
 *   Header row: era label left + date span right, separated by a medium border bottom
 *   Era name: display italic
 *   Summary: body text
 *   Nav link: label-style link using NavLink atom
 *
 * Used twice: Research (Era I) and Engineering (Era II).
 */

import Link from "next/link";
import type { ComponentProps } from "react";
import { NavLink } from "@/components/ui/NavLink";

type EraBlockProps = {
  label: string;
  span: string;
  name: string;
  summary: string;
  linkHref: ComponentProps<typeof Link>["href"];
  linkLabel: string;
};

export function EraBlock({ label, span, name, summary, linkHref, linkLabel }: EraBlockProps) {
  return (
    <div>
      {/* Header row */}
      <div className="flex items-baseline gap-md pb-sm mb-sm border-b-medium border-ink-ghost">
        <span className="label text-ink-secondary">{label}</span>
        <span className="label text-ink-secondary ml-auto">{span}</span>
      </div>

      {/* Era name */}
      <h2 className="font-display italic text-headline leading-headline text-ink mb-xs">
        {name}
      </h2>

      {/* Summary */}
      <p className="font-body text-caption leading-body text-ink-secondary mb-md">
        {summary}
      </p>

      <NavLink href={linkHref}>{linkLabel}</NavLink>
    </div>
  );
}
