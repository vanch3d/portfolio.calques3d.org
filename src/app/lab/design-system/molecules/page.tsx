import { getTranslations } from "next-intl/server";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { MoleculeFrame } from "./_components/MoleculeFrame";
import { PropsTable } from "./_components/PropsTable";
import { TagFilterDrawerDemo } from "./_components/TagFilterDrawerDemo";
import type { PropRow } from "./_components/PropsTable";
import type { TagWithCount } from "@/components/ui/TagFilterDrawer";

export const metadata = {
  title: "Molecules · Design System",
};

const SAMPLE_TAGS: TagWithCount[] = [
  { tag: "testing",       count: 5 },
  { tag: "workflow",      count: 4 },
  { tag: "agents",        count: 3 },
  { tag: "architecture",  count: 3 },
  { tag: "mdx",           count: 3 },
  { tag: "a11y",          count: 2 },
  { tag: "cypress",       count: 2 },
  { tag: "design-system", count: 2 },
  { tag: "ci-cd",         count: 1 },
  { tag: "i18n",          count: 1 },
  { tag: "routing",       count: 1 },
  { tag: "wcag",          count: 1 },
];

const TAG_FILTER_DRAWER_PROPS: PropRow[] = [
  {
    name: "tags",
    type: "TagWithCount[]",
    required: true,
    notes: "Full list of tags with frequency counts. Rendered in three tier groups: high frequency (≥3), multiple references (2), single reference (1).",
  },
  {
    name: "activeTags",
    type: "string[]",
    required: true,
    notes: "Currently selected tag values. Controls chip display and pressed state on drawer tag buttons.",
  },
  {
    name: "onTagsChange",
    type: "(tags: string[]) => void",
    required: true,
    notes: "Callback invoked whenever the selection changes — via chip remove, drawer toggle, or NONE.",
  },
];

export default async function MoleculesPage() {
  const t = await getTranslations("LabMolecules");

  const decisions = [
    { label: t("decision_layout_label"),      note: t("decision_layout_note") },
    { label: t("decision_chips_hide_label"),  note: t("decision_chips_hide_note") },
    { label: t("decision_none_label"),        note: t("decision_none_note") },
    { label: t("decision_frequency_label"),   note: t("decision_frequency_note") },
  ];

  return (
    <main className="page-wrap py-xl">

      <header className="mb-2xl">
        <SectionLabel className="mb-sm">{t("page_section_label")}</SectionLabel>
        <h1 className="font-display italic text-headline leading-headline text-ink mb-md">
          {t("page_title")}
        </h1>
        <p className="font-body text-body leading-body text-ink-secondary max-w-prose">
          {t("page_intro")}
        </p>
      </header>

      <section aria-labelledby="molecule-tag-filter-heading">
        <SectionLabel as="h2" id="molecule-tag-filter-heading" className="mb-md">
          {t("tag_filter_drawer_heading")}
        </SectionLabel>
        <p className="font-body text-body leading-body text-ink-secondary max-w-prose mb-2xl">
          {t("tag_filter_drawer_intro")}
        </p>

        <MoleculeFrame
          name={t("frame_empty_label")}
          description={t("frame_empty_desc")}
          decisions={[]}
        >
          <TagFilterDrawerDemo tags={SAMPLE_TAGS} initialActiveTags={[]} />
        </MoleculeFrame>

        <MoleculeFrame
          name={t("frame_active_label")}
          description={t("frame_active_desc")}
          decisions={decisions}
        >
          <TagFilterDrawerDemo
            tags={SAMPLE_TAGS}
            initialActiveTags={["testing", "a11y"]}
          />
        </MoleculeFrame>

        <div className="mt-2xl">
          <SectionLabel className="mb-md">Props</SectionLabel>
          <PropsTable rows={TAG_FILTER_DRAWER_PROPS} />
        </div>
      </section>

    </main>
  );
}
