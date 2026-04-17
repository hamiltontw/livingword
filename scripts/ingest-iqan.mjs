#!/usr/bin/env node
// Ingest paragraphs of the Kitáb-i-Íqán into content/iqan/paragraphs.json.
//
// Input: a plain text file, one paragraph per block, blocks separated by at
// least one blank line. Leading paragraph numbers like "1." or "¶1" are
// stripped if present. The order of paragraphs in the file is treated as
// canonical.
//
// Usage:
//   node scripts/ingest-iqan.mjs <input.txt> [--start-index N] [--part 1|2]
//
// Behavior:
//   - Merges with existing content/iqan/paragraphs.json.
//   - For paragraphs whose id already exists, ONLY the `text` field is
//     updated; hand-curated summaries, move tags, section assignments,
//     quranRefs, and crossRefs are preserved.
//   - New paragraphs are written with editorial fields marked "pending"
//     so it is visible in the reader that they have not been reviewed.
//
// The source text must be supplied by the operator (Shoghi Effendi's
// translation, from bahai.org or an authorized publication). This script
// does not fetch any text over the network.

import { readFile, writeFile } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "..");
const TARGET = resolve(ROOT, "content/iqan/paragraphs.json");

function parseArgs(argv) {
  const args = { input: undefined, startIndex: 1, part: 1 };
  const rest = argv.slice(2);
  while (rest.length) {
    const arg = rest.shift();
    if (arg === "--start-index") args.startIndex = Number(rest.shift());
    else if (arg === "--part") args.part = Number(rest.shift());
    else if (!args.input) args.input = arg;
    else throw new Error(`Unexpected argument: ${arg}`);
  }
  if (!args.input) {
    throw new Error("Usage: ingest-iqan.mjs <input.txt> [--start-index N] [--part 1|2]");
  }
  if (![1, 2].includes(args.part)) {
    throw new Error("--part must be 1 or 2");
  }
  return args;
}

function splitParagraphs(raw) {
  return raw
    .replace(/\r\n/g, "\n")
    .split(/\n{2,}/g)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => block.replace(/^(?:¶?\s*\d+\.?\s+)/, "").trim());
}

function defaultSummary(text) {
  const excerpt = text.length > 140 ? text.slice(0, 140).trim() + "…" : text;
  return {
    bahai: `Editorial summary pending review. Opens: "${excerpt}"`,
    muslim: `Editorial summary pending review. Opens: "${excerpt}"`,
  };
}

async function readExisting() {
  try {
    const raw = await readFile(TARGET, "utf8");
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) throw new Error("paragraphs.json is not an array");
    return parsed;
  } catch (err) {
    if (err && err.code === "ENOENT") return [];
    throw err;
  }
}

async function main() {
  const { input, startIndex, part } = parseArgs(process.argv);
  const raw = await readFile(resolve(process.cwd(), input), "utf8");
  const paragraphs = splitParagraphs(raw);
  if (paragraphs.length === 0) {
    throw new Error("No paragraphs detected in input.");
  }

  const existing = await readExisting();
  const byId = new Map(existing.map((p) => [p.id, p]));

  let updated = 0;
  let added = 0;

  paragraphs.forEach((text, i) => {
    const index = startIndex + i;
    const id = `p${index}`;
    const prior = byId.get(id);
    if (prior) {
      byId.set(id, { ...prior, text, index, part });
      updated += 1;
    } else {
      byId.set(id, {
        id,
        index,
        sectionId: "unassigned",
        part,
        text,
        summary: defaultSummary(text),
        move: "transition",
        quranRefs: [],
        crossRefs: [],
      });
      added += 1;
    }
  });

  const merged = Array.from(byId.values()).sort((a, b) => a.index - b.index);
  await writeFile(TARGET, JSON.stringify(merged, null, 2) + "\n", "utf8");

  console.log(
    `Ingested ${paragraphs.length} paragraphs into ${TARGET}: ${added} new, ${updated} updated. Total now ${merged.length}.`,
  );
  if (added > 0) {
    console.log(
      `${added} new paragraph(s) are marked sectionId="unassigned" and move="transition" — assign sections and moves editorially before shipping.`,
    );
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exitCode = 1;
});
