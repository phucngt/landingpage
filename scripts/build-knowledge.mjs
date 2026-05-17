#!/usr/bin/env node
/**
 * build-knowledge.mjs
 * ─────────────────────────────────────────────────────────────────────
 * Merges the hand-maintained RAG base with any extra Markdown files
 * dropped into `data/sources/`.
 *
 *   data/knowledge.base.json   ← primary chunks (the original JSONL)
 *   data/sources/*.md          ← drop additional knowledge here
 *   data/knowledge.json        ← auto-generated runtime file  (do NOT edit)
 *
 * Each .md file is split on level-2 headings (`## …`). Each section becomes
 * one chunk with id = `md_<filename>_<index>`. Files without `##` headings
 * become one whole chunk per file.
 *
 * Runs automatically before `next dev` and `next build` (see package.json
 * "predev" / "prebuild" scripts).
 * ───────────────────────────────────────────────────────────────────── */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __root = path.resolve(path.dirname(__filename), "..");
const dataDir = path.join(__root, "data");
const sourcesDir = path.join(dataDir, "sources");
const baseFile = path.join(dataDir, "knowledge.base.json");
const outFile = path.join(dataDir, "knowledge.json");

function splitMarkdown(text, filename) {
  const sections = [];
  const lines = text.split("\n");
  let current = null;

  for (const line of lines) {
    const h2 = line.match(/^##\s+(.+?)\s*$/);
    if (h2) {
      if (current) sections.push(current);
      current = { title: h2[1].trim(), body: [line] };
    } else if (current) {
      current.body.push(line);
    }
  }
  if (current) sections.push(current);

  // Whole-file fallback if no `##` headings present
  if (sections.length === 0) {
    sections.push({
      title: path
        .basename(filename, ".md")
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase()),
      body: lines,
    });
  }

  return sections.map((s) => ({
    title: s.title,
    content: s.body.join("\n").trim(),
  }));
}

function chunksFromFile(file) {
  const text = fs.readFileSync(file, "utf8");
  const filename = path.basename(file);
  const sections = splitMarkdown(text, filename);
  const slug = filename.replace(/\.md$/i, "").replace(/[^a-z0-9]+/gi, "_").toLowerCase();
  return sections.map((s, i) => ({
    id: `md_${slug}_${String(i).padStart(2, "0")}`,
    title: s.title,
    content: s.content,
    metadata: {
      source_file: filename,
      generated: true,
    },
  }));
}

function main() {
  const base = JSON.parse(fs.readFileSync(baseFile, "utf8"));
  const extra = [];

  if (fs.existsSync(sourcesDir)) {
    const files = fs
      .readdirSync(sourcesDir)
      .filter((f) => f.toLowerCase().endsWith(".md"))
      .sort();
    for (const f of files) {
      const fullPath = path.join(sourcesDir, f);
      const chunks = chunksFromFile(fullPath);
      extra.push(...chunks);
      console.log(`  + ${f.padEnd(40)} → ${chunks.length} chunk(s)`);
    }
  } else {
    fs.mkdirSync(sourcesDir, { recursive: true });
  }

  const merged = [...base, ...extra];
  fs.writeFileSync(outFile, JSON.stringify(merged, null, 2));
  console.log(
    `\n  knowledge.json built: ${base.length} base + ${extra.length} extra = ${merged.length} total chunks`
  );
}

try {
  main();
} catch (err) {
  console.error("build-knowledge failed:", err);
  process.exit(1);
}
