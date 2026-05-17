import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/chat
 * Body: { context: string, question: string }
 *
 * Calls Anthropic's Messages API directly (no SDK). Reads ANTHROPIC_API_KEY
 * from env. Set it in Vercel → Project Settings → Environment Variables.
 *
 * The Chatbot client does the keyword-based routing and KB lookup; this
 * route just stuffs the matched context + question into a prompt and
 * forwards to Claude. Keeping the rules client-side is intentional —
 * mirrors the LangChain Router PoC where decision tables live in YAML
 * and the model layer is swappable.
 */
export const runtime = "edge";

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY is not configured." },
      { status: 500 }
    );
  }

  let body: { context?: string; question?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { context = "", question = "" } = body;
  if (!question.trim()) {
    return NextResponse.json({ error: "Question is required." }, { status: 400 });
  }

  const prompt = `You are an assistant on Nguyen Tuan Phuc's portfolio site. Answer the user's question concisely (2–4 sentences max), grounded ONLY in the context below. If the answer is not in the context, say "I don't have that detail — best to email Phuc directly at phucngt.me@gmail.com." Be friendly but professional. Never invent numbers, dates, or company details.

Context:
${context}

Question: ${question}`;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5",
        max_tokens: 512,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      return NextResponse.json(
        { error: "Upstream LLM error.", detail },
        { status: 502 }
      );
    }

    const data: { content?: { type: string; text: string }[] } = await res.json();
    const answer =
      data.content
        ?.filter((c) => c.type === "text")
        .map((c) => c.text)
        .join("\n")
        .trim() ?? "";

    return NextResponse.json({ answer });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to reach LLM.", detail: String(err) },
      { status: 502 }
    );
  }
}
