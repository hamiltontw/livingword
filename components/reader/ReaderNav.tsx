import Link from "next/link";
import type { IqanParagraph } from "@/lib/types";

export function ReaderNav({
  prev,
  next,
}: {
  prev?: IqanParagraph;
  next?: IqanParagraph;
}) {
  return (
    <nav
      aria-label="Paragraph navigation"
      className="ui mt-16 flex items-stretch justify-between gap-4 border-t border-rule pt-6"
    >
      <NavLink paragraph={prev} direction="prev" />
      <NavLink paragraph={next} direction="next" />
    </nav>
  );
}

function NavLink({
  paragraph,
  direction,
}: {
  paragraph?: IqanParagraph;
  direction: "prev" | "next";
}) {
  if (!paragraph) {
    return <span aria-hidden className="w-1/2" />;
  }
  const label = direction === "prev" ? "Previous" : "Next";
  const align = direction === "prev" ? "text-left" : "text-right ml-auto";
  const arrow = direction === "prev" ? "←" : "→";
  return (
    <Link
      href={`/read/${paragraph.id}`}
      className={`group flex w-1/2 flex-col ${align} text-ink-muted hover:text-accent-deep`}
    >
      <span className="text-[0.7rem] uppercase tracking-wide2 text-ink-faint">
        {direction === "prev" ? `${arrow} ${label}` : `${label} ${arrow}`}
      </span>
      <span className="mt-1 font-serif text-base text-ink group-hover:text-accent-deep">
        ¶{paragraph.index}
      </span>
    </Link>
  );
}
