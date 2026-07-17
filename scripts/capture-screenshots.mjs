/**
 * Captures marketing screenshots for feature pages.
 * Run: node scripts/capture-screenshots.mjs
 * Requires dev server at localhost:3000 (no Supabase env).
 */
import { chromium } from "playwright";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const OUT = "public/showcase";
mkdirSync(OUT, { recursive: true });

const SEED = {
  examName: "UPSC CSE Prelims",
  examDate: (() => { const d = new Date(); d.setDate(d.getDate() + 214); return d.toISOString().slice(0, 10); })(),
  subjects: [
    { id: "sub-polity", name: "Polity",    color: "#6366f1", totalSeconds: 68400, goals: { daily: "3h + 1 PYQ set", weekly: "", monthly: "" }, done: { daily: true,  weekly: false, monthly: false } },
    { id: "sub-geo",    name: "Geography", color: "#22c55e", totalSeconds: 51300, goals: { daily: "2h notes",       weekly: "", monthly: "" }, done: { daily: true,  weekly: false, monthly: false } },
    { id: "sub-hist",   name: "History",   color: "#3b82f6", totalSeconds: 38700, goals: { daily: "2h notes",       weekly: "", monthly: "" }, done: { daily: true,  weekly: false, monthly: false } },
    { id: "sub-csat",   name: "CSAT",      color: "#f97316", totalSeconds: 12600, goals: { daily: "45 min practice",weekly: "", monthly: "" }, done: { daily: false, weekly: false, monthly: false } },
  ],
  sessions: (() => {
    const rows = [];
    const weights = { "sub-polity": 3200, "sub-geo": 2400, "sub-hist": 1800, "sub-csat": 600 };
    const today = new Date();
    for (let back = 20; back >= 0; back--) {
      if (back % 7 === 3) continue;
      const d = new Date(today); d.setDate(d.getDate() - back);
      const day = d.toISOString().slice(0, 10);
      for (const [id, base] of Object.entries(weights)) {
        const secs = Math.round(base * (0.7 + ((back * 7 + id.length) % 10) / 15) * 0.35);
        if (secs < 900) continue;
        rows.push({ id: `sess-${id}-${back}`, subjectId: id, date: day, seconds: secs });
      }
    }
    return rows;
  })(),
  studiedDays: (() => {
    const days = [];
    const today = new Date();
    for (let back = 20; back >= 0; back--) {
      if (back % 7 === 3) continue;
      const d = new Date(today); d.setDate(d.getDate() - back);
      days.push(d.toISOString().slice(0, 10));
    }
    return days;
  })(),
  running: null,
  timerDesign: "minimal",
};

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

// ── /app ────────────────────────────────────────────────────────────────────
await page.goto("http://localhost:3000/app", { waitUntil: "networkidle" });
await page.evaluate((state) => {
  localStorage.setItem("polaris-aspirant", JSON.stringify({ state, version: 0 }));
}, SEED);
await page.reload({ waitUntil: "networkidle" });
await page.waitForTimeout(1500);

// ── TIMER screenshot (normal dock: label = "Focus") ──────────────────────────
await page.locator('[aria-label="Focus"]').click({ timeout: 5000 });
await page.waitForTimeout(1200);
await page.screenshot({ path: join(OUT, "pomodoro-timer-ui.jpg"), type: "jpeg", quality: 82, fullPage: false });
console.log("✓ pomodoro-timer-ui.jpg");

// ── Enter ASPIRANT MODE, then show Statistics (analytics) ────────────────────
await page.locator('[aria-label="Aspirant Mode"]').click({ timeout: 5000 });
await page.waitForTimeout(1500); // aspirant mode renders subjects + timer
// Switch to the analytics/stats panel
await page.locator('[aria-label="Statistics"]').click({ timeout: 5000 });
await page.waitForTimeout(1200);
await page.screenshot({ path: join(OUT, "aspirant-mode-analytics.jpg"), type: "jpeg", quality: 82, fullPage: false });
console.log("✓ aspirant-mode-analytics.jpg");

await browser.close();
console.log("Done. Saved to", OUT);
