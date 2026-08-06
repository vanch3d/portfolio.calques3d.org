/**
 * SiteFooter
 *
 * Minimal footer: copyright, current role, GitHub, email.
 * Server Component — no client interactivity needed.
 */

import { ObfuscatedEmail } from "./ui/ObfuscatedEmail";

export interface SiteFooterLabels {
  role: string;
  githubLabel: string;
  emailLabel: string;
}

export function SiteFooter({ labels }: { labels: SiteFooterLabels }) {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border">
      <div className="mx-auto flex max-w-screen-xl flex-col gap-2 px-4 py-6 text-xs text-foreground-secondary sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p>
          © {year} Nicolas Van Labeke · {labels.role}
        </p>
        <nav aria-label="Footer links" className="flex items-center gap-4">
          <a
            href="https://github.com/vanch3d"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            {labels.githubLabel}
          </a>
          <ObfuscatedEmail
            email="nicolas@calques3d.org"
            label={labels.emailLabel}
            className="hover:text-foreground transition-colors"
          />
        </nav>
      </div>
    </footer>
  );
}
