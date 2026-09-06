import type { Metadata } from "next";
import { NavLink } from "@/components/ui/NavLink";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Research — Nicolas Van Labeke",
};

/**
 * /research — placeholder page.
 * Route registered so NavLink hrefs compile. Full implementation is a future step.
 */
export default function ResearchPage() {
  return (
    <main className="min-h-screen bg-ground text-ink">
      <header className="page-wrap">
        <nav
          aria-label="Breadcrumb"
          className="flex items-baseline gap-lg py-lg border-b-ghost border-ink-ghost"
        >
          <NavLink href="/">Nicolas Van&nbsp;Labeke</NavLink>
          <span className="label text-ink-ghost" aria-hidden="true">/</span>
          <span className="label active-mark" aria-current="page">Research</span>
        </nav>
      </header>

      <div className="page-wrap py-2xl">
        <p className="label text-ink-ghost mb-lg">ERA I · 1995–2017</p>
        <h1 className="font-display italic text-headline leading-headline text-ink mb-lg">
          Research
        </h1>
        <p className="font-body text-body leading-body text-ink-secondary max-w-prose mb-2xl">
          AI in Education · Human-Computer Interaction · Peer-reviewed scholarship
          across seven institutions. This section is under construction.
        </p>
        <NavLink href="/">← Return home</NavLink>
      </div>
    </main>
  );
}
