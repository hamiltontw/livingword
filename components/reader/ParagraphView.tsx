import Link from "next/link";
import type { IqanParagraph, IqanSection } from "@/lib/types";
import { MoveBadge } from "./MoveBadge";

export function ParagraphView({
  paragraph,
  section,
}: {
  paragraph: IqanParagraph;
  section?: IqanSection;
}) {
  return (
    <article>
      <header className="mb-8">
        <p className="ui text-xs uppercase tracking-wide2 text-ink-faint">
          Part {paragraph.part}
          {section && (
            <>
              {" · "}
              <Link
                href="/read"
                className="text-ink-muted hover:text-accent-deep"
              >
                {section.title}
              </Link>
            </>
          )}
        </p>
        <div className="mt-3 flex items-center gap-3">
          <h1 className="font-serif text-2xl text-ink">
            Paragraph {paragraph.index}
          </h1>
          <MoveBadge move={paragraph.move} />
        </div>
      </header>
      <div className="drop-initial font-serif text-[1.25rem] leading-[1.85] text-ink">
        {paragraph.text}
      </div>
      {paragraph.crossRefs.length > 0 && (
        <p className="ui mt-8 text-xs text-ink-faint">
          Related paragraphs:{" "}
          {paragraph.crossRefs.map((id, i) => (
            <span key={id}>
              {i > 0 && ", "}
              <Link
                href={`/read/${id}`}
                className="text-ink-muted hover:text-accent-deep"
              >
                ¶{id.replace(/^p/, "")}
              </Link>
            </span>
          ))}
        </p>
      )}
    </article>
  );
}
