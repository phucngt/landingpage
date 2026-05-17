import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/chat
 * Body: { context: string, question: string }
 *
 * Calls OpenRouter's OpenAI-compatible Chat Completions endpoint. Reads
 * OPENROUTER_API_KEY from env. Set it in Vercel → Project Settings →
 * Environment Variables.
 *
 * Model is anthropic/claude-haiku-4.5 — swap MODEL below for any OpenRouter
 * model (e.g. anthropic/claude-sonnet-4.5, openai/gpt-5, etc.).
 *
 * The Chatbot client does the keyword-based routing and KB lookup; this
 * route just stuffs the matched context + question into a prompt and
 * forwards to the LLM. Keeping the rules client-side is intentional —
 * mirrors the LangChain Router PoC where decision tables live in YAML
 * and the model layer is swappable.
 */
export const runtime = "edge";

const MODEL = "anthropic/claude-haiku-4.5";

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "OPENROUTER_API_KEY is not configured." },
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
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${apiKey}`,
        // Optional — shows up in OpenRouter analytics dashboard
        "http-referer": "https://landingpage-phucngt.vercel.app",
        "x-title": "Phuc Nguyen — Portfolio",
      },
      body: JSON.stringify({
        model: MODEL,
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

    const data: {
      choices?: { message?: { content?: string } }[];
    } = await res.json();
    const answer = data.choices?.[0]?.message?.content?.trim() ?? "";

    return NextResponse.json({ answer });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to reach LLM.", detail: String(err) },
      { status: 502 }
    );
  }
}
