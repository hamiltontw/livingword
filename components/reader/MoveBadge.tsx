import type { RhetoricalMove } from "@/lib/types";

const LABELS: Record<RhetoricalMove, string> = {
  claim: "Claim",
  objection: "Objection",
  response: "Response",
  evidence: "Evidence",
  interpretation: "Interpretive move",
  exhortation: "Exhortation",
  transition: "Transition",
};

const TONES: Record<RhetoricalMove, string> = {
  claim: "bg-accent-deep/10 text-accent-deep border-accent-deep/30",
  objection: "bg-ink/5 text-ink border-ink/20",
  response: "bg-accent/10 text-accent-deep border-accent/30",
  evidence: "bg-paper-warm text-ink-soft border-rule",
  interpretation: "bg-accent/10 text-accent-deep border-accent/30",
  exhortation: "bg-paper-deep text-ink-soft border-rule",
  transition: "bg-paper-warm text-ink-muted border-rule",
};

export function MoveBadge({ move }: { move: RhetoricalMove }) {
  return (
    <span
      className={`ui inline-flex items-center rounded-sm border px-2 py-0.5 text-[0.68rem] uppercase tracking-wide2 ${TONES[move]}`}
    >
      {LABELS[move]}
    </span>
  );
}
