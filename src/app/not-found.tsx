/**
 * 404 Not Found
 *
 * Rendering: static — no data fetching.
 * Inherits the root layout (NavigationBar, SiteFooter, theme, fonts).
 */

import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/layout";

export const metadata = { title: "404 — Page not found" };

export default async function NotFound() {
  const t = await getTranslations("NotFound");

  return (
    <div>
      <PageHeader heading={t("heading")} tagline={t("tagline")} />
      <div className="container-page py-10">
        <Link
          href="/"
          className="font-mono text-sm text-accent hover:underline"
        >
          {t("back")}
        </Link>
      </div>
    </div>
  );
}
