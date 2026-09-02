import Link from "next/link";
import { notFound } from "next/navigation";
import { getCaseStudyBySlug, getCaseStudyParams, importCaseStudyMDX } from "@/lib/content";

export async function generateStaticParams() {
  return getCaseStudyParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ project: string; slug: string }>;
}) {
  const { project, slug } = await params;
  const cs = getCaseStudyBySlug(project, slug);
  return { title: cs ? `Test — ${cs.title}` : "Test — Case study" };
}

export default async function TestCaseStudyDetailPage({
  params,
}: {
  params: Promise<{ project: string; slug: string }>;
}) {
  const { project, slug } = await params;

  const cs = getCaseStudyBySlug(project, slug);
  if (!cs) notFound();

  const CaseStudyContent = await importCaseStudyMDX(project, slug);

  return (
    <main style={{ fontFamily: "sans-serif", maxWidth: 720, margin: "2rem auto", padding: "0 1rem" }}>
      <p style={{ fontFamily: "monospace", fontSize: "0.85rem" }}>
        <Link href="/test/case-studies">← Case studies</Link>
      </p>

      <p style={{ fontFamily: "monospace", fontSize: "0.8rem", color: "#888" }}>
        {cs.project} / {cs.slug} · {cs.status}{cs.featured ? " · featured" : ""}
      </p>

      <h1 style={{ fontSize: "1.4rem", marginBottom: "1.5rem" }}>{cs.title}</h1>

      <article>
        <CaseStudyContent />
      </article>
    </main>
  );
}
