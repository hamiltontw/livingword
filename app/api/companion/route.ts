import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { askCompanion } from "@/lib/companion";

interface CompanionRequest {
  paragraphId: string;
  question: string;
}

const MAX_QUESTION_LENGTH = 500;

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: CompanionRequest;
  try {
    body = (await req.json()) as CompanionRequest;
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body." },
      { status: 400 },
    );
  }

  const paragraphId =
    typeof body.paragraphId === "string" ? body.paragraphId : "";
  const question =
    typeof body.question === "string" ? body.question.trim() : "";

  if (!paragraphId || !question) {
    return NextResponse.json(
      { error: "paragraphId and question are required." },
      { status: 400 },
    );
  }

  if (question.length > MAX_QUESTION_LENGTH) {
    return NextResponse.json(
      { error: `Question must be ${MAX_QUESTION_LENGTH} characters or fewer.` },
      { status: 400 },
    );
  }

  try {
    const reply = await askCompanion(paragraphId, question);
    return NextResponse.json(reply);
  } catch (err) {
    if (err instanceof Anthropic.RateLimitError) {
      return NextResponse.json(
        { error: "The companion is rate-limited right now. Please try again in a moment." },
        { status: 429 },
      );
    }
    if (err instanceof Anthropic.AuthenticationError) {
      return NextResponse.json(
        { error: "The companion is not authenticated. Check ANTHROPIC_API_KEY on the server." },
        { status: 500 },
      );
    }
    if (err instanceof Anthropic.APIError) {
      return NextResponse.json(
        { error: `Companion API error (${err.status}): ${err.message}` },
        { status: 502 },
      );
    }
    if (err instanceof Error && err.message.startsWith("Unknown paragraph")) {
      return NextResponse.json(
        { error: "Unknown paragraph." },
        { status: 404 },
      );
    }
    const message = err instanceof Error ? err.message : "Unknown error.";
    return NextResponse.json(
      { error: `Companion error: ${message}` },
      { status: 500 },
    );
  }
}
