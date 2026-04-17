import { notFound } from "next/navigation";
import {
  getAdjacentParagraphs,
  getAllParagraphs,
  getParagraph,
  getSection,
} from "@/lib/content";
import { readReaderPath } from "@/lib/reader-path";
import { ParagraphView } from "@/components/reader/ParagraphView";
import { SummaryCard } from "@/components/reader/SummaryCard";
import { SectionIntro } from "@/components/reader/SectionIntro";
import { VerseSidecar } from "@/components/quran/VerseSidecar";
import { ReaderNav } from "@/components/reader/ReaderNav";
import { CompanionPanel } from "@/components/companion/CompanionPanel";

type RouteParams = { paragraphId: string };

export function generateStaticParams() {
  return getAllParagraphs().map((p) => ({ paragraphId: p.id }));
}

export default async function ParagraphPage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { paragraphId } = await params;
  const paragraph = getParagraph(paragraphId);
  if (!paragraph) notFound();

  const section = getSection(paragraph.sectionId);
  const { prev, next } = getAdjacentParagraphs(paragraph.id);
  const path = await readReaderPath();

  return (
    <div className="fade-in mx-auto grid max-w-6xl gap-12 px-6 pt-14 pb-12 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <div className="min-w-0">
        <ParagraphView paragraph={paragraph} section={section} />
        {section && (
          <div className="mt-10">
            <SectionIntro section={section} />
          </div>
        )}
        <div className="mt-10 lg:hidden">
          <SummaryCard paragraph={paragraph} initialPath={path} />
        </div>
        <div className="mt-10 lg:hidden">
          <VerseSidecar refs={paragraph.quranRefs} />
        </div>
        <ReaderNav prev={prev} next={next} />
      </div>
      <aside className="hidden space-y-8 lg:block">
        <SummaryCard paragraph={paragraph} initialPath={path} />
        <VerseSidecar refs={paragraph.quranRefs} />
        <CompanionPanel paragraphId={paragraph.id} />
      </aside>
      <div className="lg:hidden">
        <CompanionPanel paragraphId={paragraph.id} />
      </div>
    </div>
  );
}
