import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { z } from "zod";
import {
  getAllParagraphs,
  getAllSections,
  getArgumentMap,
  getParagraph,
  getSection,
  getVerse,
  verseKey,
} from "./content";
import type {
  CompanionCitation,
  CompanionReply,
  IqanParagraph,
  QuranVerse,
} from "./types";

const CompanionReplySchema = z.object({
  answer: z
    .string()
    .describe(
      "The answer, in careful and reverent prose. It MUST be grounded entirely in the provided corpus. If the question cannot be answered from the corpus, say so plainly instead of speculating.",
    ),
  citations: z
    .array(
      z.object({
        kind: z.enum(["iqan", "quran"]),
        ref: z
          .string()
          .describe(
            "A short human-readable citation. For paragraphs: 'Kitáb-i-Íqán ¶N'. For Qur'an: 'Qur'an S:A (Sūrah Name)'.",
          ),
        excerpt: z
          .string()
          .describe(
            "The exact source text being cited, quoted verbatim from the corpus. Do not paraphrase.",
          ),
      }),
    )
    .describe(
      "Every claim in the answer MUST be supported by at least one citation. If no citation is possible, return an empty citations array and explain in the answer that the question falls outside the corpus.",
    ),
  disclaimers: z
    .array(z.string())
    .describe(
      "Short honest notes: places where Bahá'u'lláh's reading diverges from mainstream tafsīr, places where the question exceeds what the corpus can answer, and similar caveats. Never smooth over difficult differences — name them.",
    ),
});

const MODEL: `claude-${string}` = "claude-opus-4-7";
const MAX_TOKENS = 2048;

export async function askCompanion(
  paragraphId: string,
  question: string,
): Promise<CompanionReply> {
  const paragraph = getParagraph(paragraphId);
  if (!paragraph) {
    throw new Error(`Unknown paragraph: ${paragraphId}`);
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return stubReply(paragraphId, question);
  }

  const client = new Anthropic({ apiKey });
  const systemPrompt = buildSystemPrompt();
  const userMessage = buildUserMessage(paragraph, question);

  const response = await client.messages.parse({
    model: MODEL,
    max_tokens: MAX_TOKENS,
    thinking: { type: "adaptive" },
    system: [
      {
        type: "text",
        text: systemPrompt,
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: [{ role: "user", content: userMessage }],
    output_config: {
      format: zodOutputFormat(CompanionReplySchema),
    },
  });

  const parsed = response.parsed_output;
  if (!parsed) {
    throw new Error(
      "The companion could not produce a validly structured reply.",
    );
  }
  return parsed;
}

function buildUserMessage(
  paragraph: IqanParagraph,
  question: string,
): string {
  const section = getSection(paragraph.sectionId);
  const header = [
    `The reader is studying Kitáb-i-Íqán ¶${paragraph.index} (Part ${paragraph.part}).`,
    section
      ? `This paragraph sits in the section "${section.title}" — ${section.description}`
      : "This paragraph has not yet been assigned to a section.",
    `Rhetorical move tagged by the editors: ${paragraph.move}.`,
  ].join("\n");

  return [
    header,
    "",
    "Paragraph text:",
    `"${paragraph.text}"`,
    "",
    `Reader's question: ${question}`,
  ].join("\n");
}

function buildSystemPrompt(): string {
  return [
    buildRoleSection(),
    buildConstraintsSection(),
    buildCorpusSection(),
  ].join("\n\n");
}

function buildRoleSection(): string {
  return [
    "<role>",
    "You are a bounded study companion for Bahá'u'lláh's Kitáb-i-Íqán (The Book of Certitude). You serve two kinds of readers — Bahá'ís who want to follow the Qur'anic logic of the book, and Muslims who want to understand what Bahá'u'lláh is arguing without being asked to accept his conclusions. You are not an arbiter of doctrine. You help the reader follow the text's reasoning by pointing precisely to what it says, what it cites, and how it argues.",
    "</role>",
  ].join("\n");
}

function buildConstraintsSection(): string {
  return [
    "<constraints>",
    "1. Answer ONLY from the corpus provided below. The corpus contains Shoghi Effendi's translation of the Íqán, Yusuf Ali's translation of cited Qur'anic verses, editorial section summaries, and the argument map. Do not draw on outside sources, outside interpretations, or your own training memory.",
    "2. EVERY substantive claim in your answer must be supported by at least one citation from the corpus. Quote excerpts verbatim — do not paraphrase inside the excerpt field.",
    "3. If the reader's question cannot be answered from the corpus, say so plainly in the answer and return an empty citations array. Do not invent, speculate, or fill gaps.",
    "4. Do not act as a religious authority. Do not pronounce on what is true, what the reader should believe, or what Bahá'u'lláh 'really means' beyond what the text and its references can support.",
    "5. Where Bahá'u'lláh's reading of a Qur'anic verse diverges from mainstream tafsīr, or where a point is theologically contested, name the divergence honestly in the disclaimers. Do not smooth it over.",
    "6. Write in calm, reverent prose. Use the transliterations the corpus uses (Bahá'u'lláh, Íqán, Muḥammad, Qur'an, etc.). Do not use emojis.",
    "7. Keep answers focused. One tight paragraph is usually enough. Longer answers are permitted only when the question genuinely requires them.",
    "</constraints>",
  ].join("\n");
}

function buildCorpusSection(): string {
  const sections = getAllSections()
    .map(
      (s) =>
        `  <section id="${s.id}" part="${s.part}" title="${escapeAttr(s.title)}">\n    <description>${escapeText(s.description)}</description>\n    <paragraph_ids>${s.paragraphIds.join(", ") || "(none yet)"}</paragraph_ids>\n  </section>`,
    )
    .join("\n");

  const paragraphs = getAllParagraphs()
    .map((p) => {
      const refs = p.quranRefs.map((r) => `${r.surah}:${r.ayah}`).join(", ");
      return [
        `  <paragraph id="${p.id}" index="${p.index}" section="${p.sectionId}" part="${p.part}" move="${p.move}">`,
        `    <text>${escapeText(p.text)}</text>`,
        `    <summary_bahai>${escapeText(p.summary.bahai)}</summary_bahai>`,
        `    <summary_muslim>${escapeText(p.summary.muslim)}</summary_muslim>`,
        refs ? `    <quran_refs>${refs}</quran_refs>` : "",
        `  </paragraph>`,
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n");

  const verses = uniqueVerses()
    .map(
      (v) =>
        `  <verse ref="${v.surah}:${v.ayah}" surah="${escapeAttr(v.surahName)}">\n    <translation>${escapeText(v.translation)}</translation>\n    <context_note>${escapeText(v.contextNote ?? "")}</context_note>\n  </verse>`,
    )
    .join("\n");

  const map = getArgumentMap();
  const nodes = map.nodes
    .map(
      (n) =>
        `  <node id="${n.id}" kind="${n.kind}" label="${escapeAttr(n.label)}">\n    <summary>${escapeText(n.summary)}</summary>\n    <paragraph_ids>${n.paragraphIds.join(", ") || "(none yet)"}</paragraph_ids>\n    <parents>${n.parents.join(", ") || "(root)"}</parents>\n  </node>`,
    )
    .join("\n");

  return [
    "<corpus>",
    "  <note>Some sections and argument-map nodes are labeled placeholders — their paragraph_ids list may be empty while the text is still being ingested. Do not invent content for a placeholder section.</note>",
    "  <sections>",
    sections,
    "  </sections>",
    "  <paragraphs>",
    paragraphs,
    "  </paragraphs>",
    "  <quran_verses translator=\"Yusuf Ali\">",
    verses,
    "  </quran_verses>",
    "  <argument_map>",
    nodes,
    "  </argument_map>",
    "</corpus>",
  ].join("\n");
}

function uniqueVerses(): QuranVerse[] {
  const seen = new Set<string>();
  const result: QuranVerse[] = [];
  for (const p of getAllParagraphs()) {
    for (const r of p.quranRefs) {
      const k = verseKey(r.surah, r.ayah);
      if (seen.has(k)) continue;
      const v = getVerse(r.surah, r.ayah);
      if (v) {
        seen.add(k);
        result.push(v);
      }
    }
  }
  return result;
}

function escapeText(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function escapeAttr(s: string): string {
  return escapeText(s).replace(/"/g, "&quot;");
}

function stubReply(paragraphId: string, _question: string): CompanionReply {
  const paragraph = getParagraph(paragraphId);
  if (!paragraph) {
    throw new Error(`Unknown paragraph: ${paragraphId}`);
  }
  const section = getSection(paragraph.sectionId);
  const citations: CompanionCitation[] = [
    {
      kind: "iqan",
      ref: `Kitáb-i-Íqán ¶${paragraph.index}`,
      excerpt:
        paragraph.text.slice(0, 220) +
        (paragraph.text.length > 220 ? "…" : ""),
    },
    ...paragraph.quranRefs
      .map((r) => {
        const v = getVerse(r.surah, r.ayah);
        if (!v) return undefined;
        return {
          kind: "quran" as const,
          ref: `Qur'an ${verseKey(v.surah, v.ayah)} (${v.surahName})`,
          excerpt: v.translation,
        };
      })
      .filter((c): c is CompanionCitation => Boolean(c)),
  ];

  const answer = [
    section
      ? `Paragraph ${paragraph.index} sits within the section "${section.title}" (Part ${paragraph.part}).`
      : `Paragraph ${paragraph.index} is in Part ${paragraph.part}.`,
    `Its rhetorical move is a ${paragraph.move}: ${paragraph.summary.bahai}`,
    paragraph.quranRefs.length > 0
      ? `The Qur'anic reference(s) surfaced here — ${paragraph.quranRefs
          .map((r) => `${r.surah}:${r.ayah}`)
          .join(", ")} — ground this move in the Qur'an.`
      : "No direct Qur'anic verse is cited inside this paragraph; the reasoning here draws on the broader Qur'anic pattern of prophecy and recognition.",
  ].join(" ");

  return {
    answer,
    citations,
    disclaimers: [
      "This response came from the offline stub because ANTHROPIC_API_KEY is not set. Set the key to receive a real, Claude-generated, citation-only answer.",
    ],
  };
}
