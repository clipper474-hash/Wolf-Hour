import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Wolfhour — Who Builds It and Why",
  description:
    "Wolfhour is a free study timer built by an indie developer who needed one — live scenes, ambient sounds, and per-subject tracking. The story, the principles, and how to reach us.",
  alternates: { canonical: "/about" },
};

const ABOUT_LD = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "About Wolfhour",
  url: `${SITE_URL}/about`,
  mainEntity: {
    "@type": "Organization",
    name: "Wolfhour",
    url: `${SITE_URL}/`,
    logo: `${SITE_URL}/brand/icon-512-maskable.png`,
    email: "wolfhourapp@gmail.com",
    sameAs: ["https://github.com/clipper474-hash/Wolf-Hour"],
  },
};

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ABOUT_LD) }}
      />
      <h1>About Wolfhour</h1>
      <p>
        Wolfhour is a free study timer built by one independent developer —
        not a startup, not a growth team. It exists because the tools I tried
        while preparing for long exams all measured the same thing: how long
        I sat there. None of them made the desk a place I wanted to return
        to, and none of them told me the thing that actually decides an exam
        — <em>which subject</em> my hours were going to.
      </p>

      <h2>What it is</h2>
      <p>
        A focus environment that runs in your browser: eleven live cinematic
        scenes, 22 layerable ambient sounds (almost all synthesised in real
        time — no loops, no downloads), a{" "}
        <Link href="/pomodoro-timer">pomodoro timer</Link>, a light task
        list, and <Link href="/aspirant-mode">Aspirant mode</Link> — per-subject
        stopwatches, goals, streaks, and trend charts for people with an
        exam date.
      </p>

      <h2>Principles</h2>
      <ul>
        <li>
          <strong>Free to use.</strong> Every scene, sound, and timer is
          included. No trial walls.
        </li>
        <li>
          <strong>No signup to start.</strong> Your data lives on your device
          first; an account only adds cross-device sync.
        </li>
        <li>
          <strong>No tracking.</strong> No analytics scripts, no ads, no
          marketing cookies. See the{" "}
          <Link href="/privacy">Privacy Policy</Link> — it&rsquo;s short
          because there&rsquo;s little to disclose.
        </li>
        <li>
          <strong>Open development.</strong> The source code is public on
          GitHub — you can read exactly what the app does.
        </li>
      </ul>

      <h2>Contact</h2>
      <p>
        For bugs, feature requests, account-deletion requests, or anything
        else, email{" "}
        <a href="mailto:wolfhourapp@gmail.com">wolfhourapp@gmail.com</a> — or,
        if you prefer GitHub,{" "}
        <a
          href="https://github.com/clipper474-hash/Wolf-Hour/issues"
          target="_blank"
          rel="noopener"
        >
          open an issue on the Wolfhour repository
        </a>
        . I read everything.
      </p>
    </>
  );
}
