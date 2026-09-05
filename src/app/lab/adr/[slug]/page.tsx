import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getAllAdrs, getAdr, getAdrSlugs } from "@/lib/content/adr";
import { getAllInsights, getInsight } from "@/lib/content/insights";
import { markdownToHtml } from "@/lib/content/markdown";
import { LabBreadcrumb } from "@/app/lab/_components/LabBreadcrumb";
import { AdrDocument } from "./_components/AdrDocument";

export const dynamic = "force-static";

type AdrDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await getAdrSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function AdrDetailPage({ params }: AdrDetailPageProps) {
  const { slug } = await params;
  const tNav = await getTranslations("LabNav");

  const [adr, allAdrs, allInsights] = await Promise.all([
    getAdr(slug),
    getAllAdrs(),
    getAllInsights(),
  ]);

  if (!adr) notFound();

  const bodyHtml = await markdownToHtml(adr.body);
  const adrWithHtml = { ...adr, body: bodyHtml };

  const relatedInsightMeta =
    allInsights.find((i) => i.relatedAdr === adr.number) ?? null;

  const relatedInsightBody = relatedInsightMeta
    ? (await getInsight(relatedInsightMeta.slug))?.body ?? null
    : null;

  const sortedByNumber = [...allAdrs].sort((a, b) => a.number - b.number);
  const currentIndex = sortedByNumber.findIndex((a) => a.number === adr.number);
  const prevAdr = currentIndex > 0 ? sortedByNumber[currentIndex - 1] : null;
  const nextAdr =
    currentIndex < sortedByNumber.length - 1
      ? sortedByNumber[currentIndex + 1]
      : null;

  return (
    <div
      style={{
        maxWidth: "1080px",
        margin: "0 auto",
        padding: "var(--space-xl) var(--page-margin) var(--space-3xl)",
      }}
    >
      <LabBreadcrumb
        extra={[{ href: "/lab/adr", label: tNav("nav_adr") }]}
        current={String(adr.number).padStart(3, "0")}
      />
      <AdrDocument
        adr={adrWithHtml}
        relatedInsight={relatedInsightMeta}
        relatedInsightBody={relatedInsightBody}
        prevAdr={prevAdr}
        nextAdr={nextAdr}
      />
    </div>
  );
}
