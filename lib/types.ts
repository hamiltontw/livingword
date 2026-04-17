export type ReaderPath = "bahai" | "muslim";

export type RhetoricalMove =
  | "claim"
  | "objection"
  | "response"
  | "evidence"
  | "interpretation"
  | "exhortation"
  | "transition";

export interface QuranReferenceCitation {
  surah: number;
  ayah: number;
  note?: string;
}

export interface IqanParagraph {
  id: string;
  index: number;
  sectionId: string;
  part: 1 | 2;
  text: string;
  summary: {
    bahai: string;
    muslim: string;
  };
  move: RhetoricalMove;
  argumentNodeId?: string;
  quranRefs: QuranReferenceCitation[];
  crossRefs: string[];
}

export interface IqanSection {
  id: string;
  part: 1 | 2;
  order: number;
  title: string;
  description: string;
  argumentContext?: string;
  paragraphIds: string[];
}

export interface ArgumentNode {
  id: string;
  kind: RhetoricalMove;
  label: string;
  summary: string;
  parents: string[];
  paragraphIds: string[];
}

export interface ArgumentMap {
  rootIds: string[];
  nodes: ArgumentNode[];
}

export interface QuranVerse {
  surah: number;
  ayah: number;
  surahName: string;
  arabic?: string;
  translation: string;
  translator: "Yusuf Ali";
  contextNote?: string;
}

export interface CompanionCitation {
  kind: "iqan" | "quran";
  ref: string;
  excerpt: string;
}

export interface CompanionReply {
  answer: string;
  citations: CompanionCitation[];
  disclaimers: string[];
}
