import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export const ROOT = join(__dirname, "..", "..");

export function log(msg) {
  const line = `[daily-blog ${new Date().toISOString()}] ${msg}`;
  console.log(line);
}

export function loadJson(name) {
  return JSON.parse(readFileSync(join(__dirname, name), "utf8"));
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

export function words(text) {
  return text.split(/\s+/).filter(Boolean).length;
}

export function readMinutesFor(text) {
  const mins = Math.round(clamp(words(text), 200, 5200) / 220);
  return clamp(mins, 3, 25);
}

export function excerptFor(blocks) {
  const parts = [];
  for (const b of blocks) {
    if (b.t === "p") parts.push(b.text);
    if (b.t === "list") {
      parts.push(b.items[0] || "");
      break;
    }
  }
  const cleaned = parts
    .join(" ")
    .replace(/\*\*/g, "")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
  const cut = cleaned.slice(0, 172);
  const end = cut.lastIndexOf(" ");
  return end > 110 ? `${cut.slice(0, end)}.` : cleaned.slice(0, 220);
}

export function stripMarkdownInline(text) {
  return text
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*\s][^*]*)\*/g, "$1")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1");
}

export function splitSentences(text) {
  return text
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 30);
}

export function uniq(items) {
  return [...new Set(items)];
}