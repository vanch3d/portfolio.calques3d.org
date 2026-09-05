import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getAllInsights, getInsight, getInsightSlugs } from "@/lib/content/insights";
import { markdownToHtml } from "@/lib/content/markdown";
import { LabBreadcrumb } from "@/app/lab/_components/LabBreadcrumb";
import { InsightDocument } from "./_components/InsightDocument";

export const dynamic = "force-static";

type InsightDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await getInsightSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function InsightDetailPage({ params }: InsightDetailPageProps) {
  const { slug } = await params;
  const tNav = await getTranslations("LabNav");

  const [insight, allInsights] = await Promise.all([
    getInsight(slug),
    getAllInsights(),
  ]);

  if (!insight) notFound();

  const bodyHtml = await markdownToHtml(insight.body);
  const insightWithHtml = { ...insight, body: bodyHtml };

  const sortedByNumber = [...allInsights].sort((a, b) => a.number - b.number);
  const currentIndex = sortedByNumber.findIndex((i) => i.number === insight.number);
  const prevInsight = currentIndex > 0 ? sortedByNumber[currentIndex - 1] : null;
  const nextInsight =
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
        extra={[{ href: "/lab/insights", label: tNav("nav_insights") }]}
        current={String(insight.number).padStart(3, "0")}
      />
      <InsightDocument
        insight={insightWithHtml}
        prevInsight={prevInsight}
        nextInsight={nextInsight}
      />
    </div>
  );
}
