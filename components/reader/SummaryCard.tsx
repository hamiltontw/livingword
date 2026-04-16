"use client";

import { useState } from "react";
import type { IqanParagraph, ReaderPath } from "@/lib/types";

export function SummaryCard({
  paragraph,
  initialPath = "bahai",
}: {
  paragraph: IqanParagraph;
  initialPath?: ReaderPath;
}) {
  const [path, setPath] = useState<ReaderPath>(initialPath);
  const summary = paragraph.summary[path];

  return (
    <aside className="ui rounded-sm border border-rule bg-paper-deep/50 p-5">
      <header className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-wide2 text-ink-faint">
          Section summary
        </p>
        <div
          role="tablist"
          aria-label="Reading path"
          className="flex overflow-hidden rounded-sm border border-rule"
        >
          <PathTab active={path === "bahai"} onClick={() => setPath("bahai")}>
            Bahá'í
          </PathTab>
          <PathTab active={path === "muslim"} onClick={() => setPath("muslim")}>
            Muslim
          </PathTab>
        </div>
      </header>
      <p className="mt-4 text-sm leading-relaxed text-ink-soft">{summary}</p>
    </aside>
  );
}

function PathTab({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`px-3 py-1 text-xs ${
        active
          ? "bg-accent-deep text-paper"
          : "bg-paper text-ink-muted hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}
