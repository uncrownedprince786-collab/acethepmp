import { accessSync } from "node:fs";
import { loadJson, log } from "./core.mjs";

const BROWSER_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36";

export function loadSources() {
  return loadJson("sources.json");
}

function candidateChromePaths() {
  const paths = [];
  if (process.env.CHROME_BIN && process.env.CHROME_BIN.length) paths.push(process.env.CHROME_BIN);
  paths.push(
    "/usr/bin/google-chrome-stable",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium-browser",
    "/usr/bin/chromium",
    "/opt/google/chrome/chrome",
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    `${process.env.LOCALAPPDATA || ""}\\Google\\Chrome\\Application\\chrome.exe`,
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium"
  );
  return paths.filter(Boolean);
}

export function findChrome() {
  for (const p of candidateChromePaths()) {
    try {
      accessSync(p);
      return p;
    } catch {
      // keep looking
    }
  }
  return null;
}

function stripHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

function looksBlocked(text) {
  const head = text.slice(0, 600).toLowerCase();
  return head.includes("access denied") || head.includes("captcha") || head.includes("attention required");
}

export async function fetchPageText(source) {
  const chrome = findChrome();
  if (!chrome) {
    return fetchPlain(source);
  }
  try {
    const { default: puppeteer } = await import("puppeteer-core");
    const browser = await puppeteer.launch({
      executablePath: chrome,
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu"],
    });
    try {
      const page = await browser.newPage();
      await page.setUserAgent(BROWSER_UA);
      await page.setExtraHTTPHeaders({ "Accept-Language": "en-US,en;q=0.9" });
      await page.goto(source.url, { waitUntil: "domcontentloaded", timeout: 30000 });
      const data = await page.evaluate(() => {
        return {
          title: document.title || "",
          text: document.body ? document.body.innerText : "",
        };
      });
      const text = (data.text || "").replace(/\s+/g, " ").trim().slice(0, 160000);
      if (text.length < 200 || looksBlocked(text)) {
        return { source, ok: false, blocked: true, error: "rendered page looked empty or bot-gated", live: [] };
      }
      return { source, ok: true, title: data.title, text, live: [] };
    } finally {
      await browser.close();
    }
  } catch (err) {
    log(`puppeteer failed for ${source.url}: ${err.message}`);
    return fetchPlain(source);
  }
}

async function fetchPlain(source) {
  try {
    const res = await fetch(source.url, {
      headers: { "User-Agent": BROWSER_UA, Accept: "text/html" },
      signal: AbortSignal.timeout(25000),
    });
    if (!res.ok) {
      return { source, ok: false, blocked: res.status === 403 || res.status === 429, error: `HTTP ${res.status}`, live: [] };
    }
    const html = await res.text();
    const text = stripHtml(html).slice(0, 160000);
    if (text.length < 200 || looksBlocked(text)) {
      return { source, ok: false, blocked: true, error: "page returned no readable content", live: [] };
    }
    return { source, ok: true, title: "", text, live: [] };
  } catch (err) {
    return { source, ok: false, error: err.message, live: [] };
  }
}

export function harvestLiveFacts(result, topic, limit = 4) {
  if (!result || !result.ok) return [];
  const hints = (topic.factHints || []).map((h) => h.toLowerCase());
  const sentences = result.text.split(/(?<=[.!?])\s+/).map((s) => s.trim());
  const picked = [];
  for (const s of sentences) {
    if (s.length < 60 || s.length > 320) continue;
    const lower = s.toLowerCase();
    const hasNumber = /\d/.test(s) || /percent|%|\$|minutes|questions|months|hours/i.test(s);
    const hintHit = hints.length === 0 || hints.some((h) => lower.includes(h));
    if (hasNumber && hintHit) {
      picked.push(s.replace(/\s+/g, " ").trim());
    }
    if (picked.length >= limit) break;
  }
  return picked;
}

export async function ingest(topic) {
  const sources = loadSources();
  log(`ingesting ${sources.length} source pages (chrome: ${findChrome() ? "yes" : "no"})`);
  const results = [];
  for (const source of sources) {
    const res = await fetchPageText(source);
    if (res.ok) {
      const live = harvestLiveFacts(res, topic);
      log(`ok   ${source.url} (${(res.text.length / 1024).toFixed(0)} KB, ${live.length} facts)`);
      results.push({ source, live, text: res.text });
    } else {
      log(`skip ${source.url} (${res.error || "blocked"})`);
    }
  }
  return results;
}