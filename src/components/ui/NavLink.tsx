import Link from "next/link";
import type { Route } from "next";

type AppLinkProps = {
  href: string;
  children: React.ReactNode;
};

export function NavLink({ href, children }: AppLinkProps) {
  return (
    <Link
      href={href as Route}
      className="label text-ink-secondary underline decoration-ink-ghost hover:text-ink hover:decoration-ink"
      style={{
        textUnderlineOffset: "3px",
        transition: "color 0.15s, text-decoration-color 0.15s",
      }}
    >
      {children}
    </Link>
  );
}
