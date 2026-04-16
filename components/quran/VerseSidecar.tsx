import type { QuranReferenceCitation } from "@/lib/types";
import { getVerse } from "@/lib/content";

export function VerseSidecar({
  refs,
}: {
  refs: QuranReferenceCitation[];
}) {
  if (refs.length === 0) {
    return (
      <aside className="ui rounded-sm border border-dashed border-rule p-5 text-xs text-ink-faint">
        No direct Qur'anic citation in this paragraph. The context here draws
        on the broader Qur'anic pattern of prophecy and recognition.
      </aside>
    );
  }

  return (
    <aside className="ui space-y-5">
      <p className="text-xs uppercase tracking-wide2 text-ink-faint">
        Qur'anic references
      </p>
      <ul className="space-y-5">
        {refs.map((ref) => {
          const verse = getVerse(ref.surah, ref.ayah);
          if (!verse) {
            return (
              <li
                key={`${ref.surah}:${ref.ayah}`}
                className="rounded-sm border border-dashed border-rule p-4 text-xs text-ink-faint"
              >
                Qur'an {ref.surah}:{ref.ayah} — verse not yet ingested.
              </li>
            );
          }
          return (
            <li
              key={`${ref.surah}:${ref.ayah}`}
              className="rounded-sm border border-rule bg-paper-deep/40 p-4"
            >
              <p className="text-xs uppercase tracking-wide2 text-accent-deep">
                Qur'an {verse.surah}:{verse.ayah}
                <span className="ml-2 normal-case tracking-normal text-ink-faint">
                  Sūrat {verse.surahName}
                </span>
              </p>
              <blockquote className="mt-3 font-serif text-[1.05rem] leading-relaxed text-ink">
                “{verse.translation}”
              </blockquote>
              <p className="mt-2 text-[0.72rem] text-ink-faint">
                Yusuf Ali, translation
              </p>
              {(ref.note || verse.contextNote) && (
                <p className="mt-4 text-sm leading-relaxed text-ink-soft">
                  {ref.note ?? verse.contextNote}
                </p>
              )}
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
