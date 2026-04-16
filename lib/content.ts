import paragraphsData from "@/content/iqan/paragraphs.json";
import sectionsData from "@/content/iqan/sections.json";
import argumentMapData from "@/content/iqan/argument-map.json";
import quranData from "@/content/quran/yusuf-ali.json";
import type {
  ArgumentMap,
  IqanParagraph,
  IqanSection,
  QuranVerse,
} from "./types";

const paragraphs = paragraphsData as IqanParagraph[];
const sections = sectionsData as IqanSection[];
const argumentMap = argumentMapData as ArgumentMap;
const quran = quranData as QuranVerse[];

export function getAllParagraphs(): IqanParagraph[] {
  return paragraphs.slice().sort((a, b) => a.index - b.index);
}

export function getParagraph(id: string): IqanParagraph | undefined {
  return paragraphs.find((p) => p.id === id);
}

export function getAdjacentParagraphs(id: string): {
  prev?: IqanParagraph;
  next?: IqanParagraph;
} {
  const ordered = getAllParagraphs();
  const i = ordered.findIndex((p) => p.id === id);
  if (i === -1) return {};
  return {
    prev: i > 0 ? ordered[i - 1] : undefined,
    next: i < ordered.length - 1 ? ordered[i + 1] : undefined,
  };
}

export function getAllSections(): IqanSection[] {
  return sections.slice().sort((a, b) => a.part - b.part || a.order - b.order);
}

export function getSection(id: string): IqanSection | undefined {
  return sections.find((s) => s.id === id);
}

export function getArgumentMap(): ArgumentMap {
  return argumentMap;
}

export function getVerse(
  surah: number,
  ayah: number,
): QuranVerse | undefined {
  return quran.find((v) => v.surah === surah && v.ayah === ayah);
}

export function verseKey(surah: number, ayah: number): string {
  return `${surah}:${ayah}`;
}
