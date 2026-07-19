import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { articleLd } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Study Tracker for Exam Aspirants — Aspirant Mode",
  description:
    "Free per-subject study tracker for UPSC, NEET, JEE and other exams: subject timers, goals, streaks, and a live trend chart showing where hours really go.",
  alternates: { canonical: "/aspirant-mode" },
};

const FAQ = [
  {
    q: "Which exams is Aspirant mode useful for?",
    a: "Any long, multi-subject preparation: UPSC and state PSCs, NEET, JEE, GATE, CA/CS, boards, bar and licensing exams, or a months-long certification. If your prep has more than one subject and a date attached, per-subject tracking applies.",
  },
  {
    q: "How many hours a day should an aspirant study?",
    a: "There's no magic number — toppers report anywhere from 5 to 10 focused hours, and a sustainable 6 beats an occasional 12. The more useful question, which a per-subject tracker answers, is where those hours actually went and which subject is being starved.",
  },
  {
    q: "Is Aspirant mode free?",
    a: "Yes. It ships with the free experience — subject timers, goals, streaks, calendar, and analytics. A free account adds cross-device sync so your stats follow you between phone and laptop.",
  },
  {
    q: "Does it work offline in a library with bad Wi-Fi?",
    a: "Yes. Install Wolfhour as an app and everything — timers, stats, goals — keeps working offline. Sync catches up when you're back online.",
  },
];

const FAQ_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

const ARTICLE_LD = articleLd({
  headline: "Aspirant mode: study tracking for people with an exam date",
  description:
    "Per-subject timers, streaks, and a live study-trend chart for serious exam candidates — so you know where your hours really go.",
  path: "/aspirant-mode",
  image: "/showcase/aspirant-mode-analytics.jpg",
  datePublished: "2026-07-11",
  dateModified: "2026-07-20",
});

export default function AspirantModePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ARTICLE_LD) }}
      />
      <h1>Aspirant mode: study tracking for people with an exam date</h1>
      <p>
        Most focus apps measure one thing: how long you sat there. That&rsquo;s
        fine for a workday. It falls apart when you&rsquo;re preparing for a
        competitive exam — UPSC, NEET, JEE, boards, a bar or licensing exam —
        because the question that decides your result isn&rsquo;t
        &ldquo;did I study today?&rdquo; It&rsquo;s &ldquo;did I study the
        right subject today?&rdquo;
      </p>
      <p>
        Aspirant mode is Wolfhour&rsquo;s answer. It splits your focus time
        by subject, so six hours stops being a single reassuring number and
        becomes something you can actually act on: three hours of polity,
        two of geography, one of the optional you&rsquo;ve been quietly
        avoiding for two weeks.
      </p>
      <Image
        src="/showcase/aspirant-mode-analytics.jpg"
        alt="Aspirant Mode analytics in Wolfhour — per-subject breakdown with a daily trend chart"
        width={1440}
        height={900}
        className="my-4 rounded-xl border border-white/10 shadow-xl"
        priority
      />

      <h2>Press play, minutes land where they should</h2>
      <p>
        The heart of Aspirant mode is a stack of per-subject stopwatches under
        a running exam countdown. Start Polity&rsquo;s timer when you open the
        book, stop it when you stop — the day&rsquo;s total and every
        subject&rsquo;s share build themselves while you work.
      </p>
      <Image
        src="/showcase/aspirant-subject-timers.jpg"
        alt="Aspirant Mode subject timers in Wolfhour — exam countdown, total studied, and per-subject stopwatches"
        width={1440}
        height={900}
        className="my-4 rounded-xl border border-white/10 shadow-xl"
      />

      <h2>What it tracks</h2>
      <ul>
        <li>
          <strong>Per-subject stopwatches.</strong> Add a subject, hit play,
          and every minute lands in that subject&rsquo;s total — with a live
          combined total for the day.
        </li>
        <li>
          <strong>Analytics with a trend chart.</strong> Total time, daily
          average, and active days over today, the week, the month, or all
          time — plotted day by day so a flatlining subject is visible, not
          hidden in a total.
        </li>
        <li>
          <strong>Subject goals.</strong> Set daily, weekly, and monthly
          targets per subject and tick them off as you hit them.
        </li>
        <li>
          <strong>An exam countdown.</strong> Name your exam, set the date,
          and the days remaining sit above your stats — a quiet deadline,
          always in view.
        </li>
        <li>
          <strong>A study calendar and streak.</strong> A month grid you mark
          day by day; the streak makes skipping visible and coming back
          rewarding.
        </li>
      </ul>

      <h2>Goals you can actually tick off</h2>
      <p>
        Each subject carries its own daily, weekly, and monthly target —
        written in your words (&ldquo;3h + 1 PYQ set&rdquo;, &ldquo;45 min
        practice&rdquo;), ticked off when done. Small enough to finish, visible
        enough to sting when skipped.
      </p>
      <Image
        src="/showcase/aspirant-goals.jpg"
        alt="Aspirant Mode goals in Wolfhour — daily, weekly and monthly targets per subject"
        width={1440}
        height={900}
        className="my-4 rounded-xl border border-white/10 shadow-xl"
      />

      <h2>A calendar that makes streaks visible</h2>
      <p>
        Tap a day to mark it studied. The month grid fills in, the streak
        counter climbs, and a missed day shows as exactly what it is — a hole
        in the row. Nothing motivates a Tuesday like an unbroken line of
        Mondays.
      </p>
      <Image
        src="/showcase/aspirant-calendar.jpg"
        alt="Aspirant Mode study calendar in Wolfhour — studied days marked with a running streak"
        width={1440}
        height={900}
        className="my-4 rounded-xl border border-white/10 shadow-xl"
      />

      <h2>Why does per-subject tracking beat a single total?</h2>
      <p>
        Every serious aspirant knows the trap: you drift toward the subjects
        you like. The hours feel productive because they <em>are</em> hours —
        but the weak subject stays weak, and no total-hours counter will ever
        tell you that. A per-subject view makes the avoidance visible in a
        chart you look at every day. That mild discomfort is the feature.
        Rebalancing happens naturally once you can see the imbalance.
      </p>

      <h2>A day in Aspirant mode</h2>
      <p>
        Pick the subject, pick a{" "}
        <Link href="/pomodoro-timer">pomodoro block</Link> that fits the work
        — 25/5 for revision, the stopwatch for long problem sets — and put
        your usual <Link href="/study-sounds">study mix</Link> behind it. When the block
        ends, the session is already filed under the right subject. At night,
        the trend chart tells you tomorrow&rsquo;s first subject better than
        any timetable: it&rsquo;s whichever bar looks embarrassed.
      </p>

      <h2>Built for long campaigns</h2>
      <p>
        Exam preparation is a months-long campaign, not a productivity
        sprint. Wolfhour keeps your stats synced across devices and works
        offline once installed as an app, so a library with bad Wi-Fi
        doesn&rsquo;t cost you a session. The scenes and soundscapes are there to make the desk a
        place you don&rsquo;t dread returning to — because the aspirants who
        clear these exams aren&rsquo;t the ones who studied hardest on their
        best day. They&rsquo;re the ones who came back every day.
      </p>

      <h2>Aspirant questions, answered</h2>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_LD) }}
      />
      {FAQ.map((f) => (
        <div key={f.q}>
          <h3>
            <strong>{f.q}</strong>
          </h3>
          <p>{f.a}</p>
        </div>
      ))}
    </>
  );
}
