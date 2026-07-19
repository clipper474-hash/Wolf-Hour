import { SITE_URL } from "@/lib/site";

/** /llms.txt as a route (not a public/ file) so links follow
 *  NEXT_PUBLIC_SITE_URL on domain migration. Static at build time. */
export const dynamic = "force-static";

const BODY = `# Wolfhour

> Wolfhour is a calm, free study timer and focus app for studying and deep work: live cinematic backgrounds, layered ambient sounds, study/pomodoro timers, and an Aspirant study mode with per-subject analytics. No signup is needed to start; it works offline as an installable web app and syncs across devices with a free account.

## Pages

- [Free Study Timer with Ambient Sounds & Live Scenes](${SITE_URL}/): 11 live cinematic scenes, 22 ambient sounds, pomodoro timer, task list, streaks; free, no signup to start, offline-capable PWA, FAQ included
- [Pomodoro Timer for Studying](${SITE_URL}/pomodoro-timer): classic 25/5/15 focus blocks plus a count-up stopwatch, soft two-note end chime, break dashboard; explains what the pomodoro technique is and how long blocks should be
- [Study Sounds & Ambience](${SITE_URL}/study-sounds): 22 sounds in 5 groups (Nature, Places, Instrumental, Lo-Fi, Noise), 21 synthesised live in-browser (no loop seams, no downloads), layerable mixer with saved blends; covers white vs pink vs brown noise
- [Aspirant Mode — per-subject study tracker](${SITE_URL}/aspirant-mode): per-subject stopwatches, exam countdown, daily/weekly/monthly goals, streak calendar, daily trend chart; built for UPSC, NEET, JEE, GATE, boards and licensing exams
- [About Wolfhour](${SITE_URL}/about): built by one independent developer; free, no tracking or analytics scripts, open source on GitHub (github.com/clipper474-hash/Wolf-Hour)
- [Privacy Policy](${SITE_URL}/privacy): local-first data model — data lives on-device, optional account syncs to a private row; session cookies only
- [Terms of Service](${SITE_URL}/terms): usage terms

## Optional

- [GitHub repository](https://github.com/clipper474-hash/Wolf-Hour): full source code — Next.js, Zustand, Supabase, Web Audio API synthesis engine
`;

export function GET() {
  return new Response(BODY, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
