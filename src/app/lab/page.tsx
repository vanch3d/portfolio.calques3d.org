import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("LabPage");
  return {
    title: t("heading"),
    description: t("description"),
  };
}

// Stub page — full implementation in Phase C.
export default async function LabPage() {
  const t = await getTranslations("LabPage");
  return (
    <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold text-foreground">{t("heading")}</h1>
      <p className="mt-4 text-foreground-secondary">{t("coming_soon")}</p>
    </div>
  );
}
