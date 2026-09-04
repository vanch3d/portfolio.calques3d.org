import Link from "next/link";
import type { Route } from "next";

type LabLinkProps = {
  href: Route;
  children: React.ReactNode;
};

export function LabLink({ href, children }: LabLinkProps) {
  return (
    <Link
      href={href}
      className="label no-underline"
      style={{ borderBottom: "var(--line-ghost) solid var(--color-ink-ghost)" }}
    >
      {children}
    </Link>
  );
}
