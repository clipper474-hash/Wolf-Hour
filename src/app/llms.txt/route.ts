import { SITE_URL } from "@/lib/site";

/** /llms.txt as a route (not a public/ file) so links follow
 *  NEXT_PUBLIC_SITE_URL on domain migration. Static at build time. */
export const dynamic = "force-static";

const BODY = `# Wolfhour

> Wolfhour is a calm, free-to-use focus and ambience dashboard for studying and deep work: live cinematic backgrounds, layered soundscapes, study/pomodoro timers, and an Aspirant study mode with per-subject analytics. It runs as an offline-capable PWA and syncs across devices.

## Pages

- [Wolfhour — A beautiful place to focus & study](${SITE_URL}/): marketing landing page with features and FAQ
- [Pomodoro Timer for Studying](${SITE_URL}/pomodoro-timer): running focus blocks and breaks in Wolfhour
- [Study Sounds & Ambience](${SITE_URL}/study-sounds): picking and layering ambience for deep focus
- [Aspirant Mode](${SITE_URL}/aspirant-mode): per-subject study tracking for competitive-exam candidates
- [Privacy Policy](${SITE_URL}/privacy): what Wolfhour stores, local-first data model
- [Terms of Service](${SITE_URL}/terms): usage terms
`;

export function GET() {
  return new Response(BODY, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
