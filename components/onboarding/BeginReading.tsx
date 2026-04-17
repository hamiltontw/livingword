"use client";

import Link from "next/link";
import type { ReaderPath } from "@/lib/types";
import {
  READER_PATH_COOKIE,
  READER_PATH_MAX_AGE_SECONDS,
} from "@/components/reader/summary-card-constants";

export function BeginReading({
  path,
  href = "/read/p1",
  label = "Begin with paragraph 1",
}: {
  path: ReaderPath;
  href?: string;
  label?: string;
}) {
  function onClick() {
    if (typeof document !== "undefined") {
      document.cookie = `${READER_PATH_COOKIE}=${path}; Path=/; Max-Age=${READER_PATH_MAX_AGE_SECONDS}; SameSite=Lax`;
    }
  }
  return (
    <Link
      href={href}
      onClick={onClick}
      className="ui inline-flex items-center rounded-sm border border-accent-deep/70 bg-accent-deep px-5 py-2.5 text-sm text-paper hover:bg-accent-deep/90"
    >
      {label}
    </Link>
  );
}
