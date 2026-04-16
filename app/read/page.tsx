import Link from "next/link";
import { getAllSections, getParagraph } from "@/lib/content";

export default function ReadIndexPage() {
  const sections = getAllSections();

  return (
    <div className="fade-in mx-auto max-w-reader px-6 pt-16 pb-20">
      <p className="ui mb-4 text-xs uppercase tracking-wide2 text-ink-faint">
        Contents
      </p>
      <h1 className="font-serif text-3xl text-ink">The Kitáb-i-Íqán</h1>
      <p className="ui mt-3 text-sm text-ink-muted">
        Translation by Shoghi Effendi. Paragraph numbering follows the standard
        published edition.
      </p>

      <div className="mt-12 space-y-12">
        {[1, 2].map((part) => {
          const partSections = sections.filter((s) => s.part === part);
          if (partSections.length === 0) return null;
          return (
            <section key={part}>
              <h2 className="ui text-xs uppercase tracking-wide2 text-ink-faint">
                Part {part}
              </h2>
              <ol className="mt-4 space-y-8">
                {partSections.map((section) => (
                  <li key={section.id}>
                    <h3 className="font-serif text-xl text-ink">
                      {section.title}
                    </h3>
                    <p className="ui mt-2 text-sm leading-relaxed text-ink-muted">
                      {section.description}
                    </p>
                    {section.paragraphIds.length > 0 ? (
                      <ul className="ui mt-3 flex flex-wrap gap-2">
                        {section.paragraphIds.map((pid) => {
                          const p = getParagraph(pid);
                          if (!p) return null;
                          return (
                            <li key={pid}>
                              <Link
                                href={`/read/${pid}`}
                                className="inline-flex rounded-sm border border-rule bg-paper-deep/50 px-2.5 py-1 text-xs text-ink-soft hover:border-accent-deep/60 hover:text-accent-deep"
                              >
                                ¶{p.index}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    ) : (
                      <p className="ui mt-3 text-xs italic text-ink-faint">
                        Paragraphs not yet ingested.
                      </p>
                    )}
                  </li>
                ))}
              </ol>
            </section>
          );
        })}
      </div>
    </div>
  );
}
