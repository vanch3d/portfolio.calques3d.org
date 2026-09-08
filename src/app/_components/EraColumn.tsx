/**
 * EraColumn — a single era column in the below-fold timeline.
 *
 * Structure (from approved comp homepage-comp-v4b-r2.html):
 *   Dimension ruler (aria-hidden): span line + start tick + end tick + year labels
 *   Era badge (label class, ink-secondary)
 *   Era name (STIX italic, text-headline)
 *   Era summary (Spectral, text-caption)
 *   Position list (role="list"): year col (6ch, tabular, ink-ghost) + institution
 *   One or more NavLink atoms
 *
 * The ruler end tick for research (right side) and start tick for engineering
 * (left side) are both styled active — they mark the shared 2018 inflection.
 *
 * Position data is hardcoded for now (deferred D-03: wire to src/content/positions/).
 *
 * i18n: all strings from HomePage namespace, resolved by the parent server component.
 */

import type { ReactNode } from "react";
import type { Route } from "next";
import { cn } from "@/lib/utils";
import { NavLink } from "@/components/ui/NavLink";
import type { ProjectType } from "@/types/content";

export type EraEntry = {
  year: string;
  institution: string;
};

type EraLink = {
  href: Route;
  label: string;
};

type EraColumnProps = {
  era: ProjectType;
  badge: string;
  name: string;
  summary: string;
  positions: EraEntry[];
  positionsAriaLabel: string;
  links: EraLink[];
};

function RulerTick({ side, active }: { side: "start" | "end"; active: boolean }) {
  return (
    <span
      className={cn(
        "absolute top-1/2 -translate-y-1/2",
        "w-line-heavy h-2.25",
        side === "start" ? "left-0" : "right-0",
        active ? "bg-active" : "bg-ink-secondary",
      )}
    />
  );
}

function RulerYear({
  side,
  active,
  children,
}: {
  side: "start" | "end";
  active: boolean;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "absolute label",
        side === "start" ? "left-0" : "right-0 text-right",
        active ? "text-active" : "text-ink-secondary",
      )}
      style={{ top: "calc(50% - 1.5rem)" }}
    >
      {children}
    </span>
  );
}

export function EraColumn({
  era,
  badge,
  name,
  summary,
  positions,
  positionsAriaLabel,
  links,
}: EraColumnProps) {
  const isResearch = era === "research";

  return (
    <div
      className={cn(
        "relative pb-xl",
        isResearch
          ? "pr-lg border-r-ghost border-ink-ghost max-md:border-r-0 max-md:border-t-ghost max-md:pt-lg max-md:pr-0 max-md:order-2"
          : "pl-lg max-md:pl-0 max-md:order-1",
      )}
    >
      <div
        className="relative h-lg mb-md before:content-[''] before:absolute before:top-1/2 before:-translate-y-1/2 before:left-0 before:right-0 before:h-line-medium before:bg-ink-secondary"
        aria-hidden="true"
        data-testid="era-ruler"
      >
        {isResearch ? (
          <>
            <RulerTick side="start" active={false} />
            <RulerTick side="end" active={true} />
            <RulerYear side="start" active={false}>1995</RulerYear>
            <RulerYear side="end" active={true}>2018</RulerYear>
          </>
        ) : (
          <>
            <RulerTick side="start" active={true} />
            <RulerTick side="end" active={false} />
            <RulerYear side="start" active={true}>2018</RulerYear>
            <RulerYear side="end" active={false}>2026</RulerYear>
          </>
        )}
      </div>

      <p className="label text-ink-secondary mb-sm">{badge}</p>

      <h2 className="font-display italic text-headline leading-headline text-ink mb-sm">
        {name}
      </h2>

      <p className="font-body text-caption leading-body text-ink-secondary max-w-era-summary mb-md">
        {summary}
      </p>

      <div
        role="list"
        aria-label={positionsAriaLabel}
        className="flex flex-col mb-md"
        data-testid="positions-list"
      >
        {positions.map((pos, i) => (
          <div
            key={`${pos.year}-${pos.institution}`}
            role="listitem"
            className={cn(
              "grid gap-x-sm items-baseline py-sm",
              "grid-cols-[6ch_1fr]",
              i > 0 ? "border-t-ghost border-ink-ghost" : "",
            )}
          >
            <span className="label text-ink-ghost tabular pt-xs">{pos.year}</span>
            <span className="font-body text-caption text-ink-secondary leading-body">
              {pos.institution}
            </span>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-x-md">
        {links.map((link) => (
          <NavLink
            key={link.href}
            href={link.href}
            className="inline-block mb-xs border-b-medium border-ink pb-xs hover:text-active hover:border-active"
          >
            {link.label}
          </NavLink>
        ))}
      </div>
    </div>
  );
}
