import type { IqanSection } from "@/lib/types";

export function SectionIntro({ section }: { section: IqanSection }) {
  if (!section.argumentContext) return null;
  return (
    <aside className="ui rounded-sm border-l-2 border-accent-deep/70 bg-paper-deep/40 px-5 py-4">
      <p className="text-[0.68rem] uppercase tracking-wide2 text-ink-faint">
        How this argument fits
      </p>
      <p className="mt-2 font-serif text-[1.02rem] leading-relaxed text-ink-soft">
        {section.argumentContext}
      </p>
    </aside>
  );
}
