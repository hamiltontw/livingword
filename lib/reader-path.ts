import { cookies } from "next/headers";
import {
  READER_PATH_COOKIE,
  READER_PATH_MAX_AGE_SECONDS,
} from "@/components/reader/summary-card-constants";
import type { ReaderPath } from "./types";

export { READER_PATH_COOKIE, READER_PATH_MAX_AGE_SECONDS };

export function isReaderPath(value: unknown): value is ReaderPath {
  return value === "bahai" || value === "muslim";
}

export async function readReaderPath(
  fallback: ReaderPath = "bahai",
): Promise<ReaderPath> {
  const store = await cookies();
  const value = store.get(READER_PATH_COOKIE)?.value;
  return isReaderPath(value) ? value : fallback;
}
