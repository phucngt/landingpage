import { NextRequest } from "next/server";
import knowledge from "@/data/knowledge.json";
import { retrieve, SYSTEM_PROMPT, type Chunk } from "@/lib/retrieve";

/**
 * POST /api/chat
 * Body: { question: string }
 *
 * Streams plain-text deltas back to the client. Retrieved chunk titles are
 * sent in the `X-Sources` response header (base64-safe URI-encoded JSON) so
 * the UI can show them before the first token lands.
 *
 *   Response headers:
 *     content-type: text/plain; charset=utf-8
 *     x-sources:    encodeURIComponent(JSON.stringify([{id,title},...]))
 *   Response body: plain UTF-8, no framing
 *
 * Uses OpenRouter SSE (OpenAI-compatible). Reads OPENROUTER_API_KEY from env.
 */
export const runtime = "edge";

const MODEL = "anthropic/claude-haiku-4.5";
const CHUNKS = knowledge as Chunk[];

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return new Response("OPENROUTER_API_KEY is not configured.", { status: 500 });
  }

  let body: { question?: string };
  try {
    body = await req.json();
  } catch {
    return new Response("Invalid JSON body.", { status: 400 });
  }

  const { question = "" } = body;
  if (!question.trim()) {
    return new Response("Question is required.", { status: 400 });
  }

  // ── Retrieve ─────────────────────────────────────────────
  const top = retrieve(question, CHUNKS, 5);
  const sources = top.map((c) => ({ id: c.id, title: c.title }));
  const context = top
    .map((c, i) => `[doc ${i + 1} — ${c.title}]\n${c.content}`)
    .join("\n\n---\n\n");

  const userContent = `Retrieved context (use only this to answer):

${context || "(no relevant chunks found — decline politely and suggest emailing phucngt.me@gmail.com)"}

────────────────────
User question: ${question}`;

  // ── Stream from OpenRouter ─────────────────────────────────────────────
  let upstream: Response;
  try {
    upstream = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${apiKey}`,
        "http-referer": "https://landingpage-phucngt.vercel.app",
        "x-title": "Phuc Nguyen — Portfolio",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 1024,
        stream: true,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userContent },
        ],
      }),
    });
  } catch (err) {
    return new Response(`Failed to reach LLM: ${String(err)}`, { status: 502 });
  }

  if (!upstream.ok || !upstream.body) {
    const detail = await upstream.text();
    return new Response(`Upstream LLM error: ${detail}`, { status: 502 });
  }

  // Parse SSE → plain-text deltas
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  const reader = upstream.body.getReader();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      let buffer = "";
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          // SSE messages are separated by blank lines, lines start with "data: "
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const raw of lines) {
            const line = raw.trim();
            if (!line.startsWith("data:")) continue;
            const payload = line.slice(5).trim();
            if (payload === "[DONE]") {
              controller.close();
              return;
            }
            try {
              const json: {
                choices?: { delta?: { content?: string } }[];
              } = JSON.parse(payload);
              const delta = json.choices?.[0]?.delta?.content;
              if (delta) controller.enqueue(encoder.encode(delta));
            } catch {
              // ignore parse errors (e.g. keep-alive comments)
            }
          }
        }
      } catch (err) {
        controller.error(err);
        return;
      }
      controller.close();
    },
    cancel() {
      reader.cancel().catch(() => {});
    },
  });

  return new Response(stream, {
    headers: {
      // text/event-stream is the strongest hint to Vercel / proxies to flush
      // each chunk as it arrives. We still emit plain text (no SSE framing)
      // since the client just appends bytes, but the type forces no buffering.
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "no-store, no-transform",
      "content-encoding": "identity",
      "x-accel-buffering": "no",
      "x-sources": encodeURIComponent(JSON.stringify(sources)),
      "access-control-expose-headers": "x-sources",
    },
  });
}
