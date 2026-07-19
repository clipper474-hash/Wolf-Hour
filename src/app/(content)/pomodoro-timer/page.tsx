import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { articleLd } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Free Pomodoro Timer for Studying — Wolfhour",
  description:
    "Free online pomodoro timer for studying: 25/5 focus blocks, gentle break screens, ambient sounds and live scenes. No signup, works offline.",
  alternates: { canonical: "/pomodoro-timer" },
};

const FAQ = [
  {
    q: "How many pomodoros should I do in a day?",
    a: "Count blocks, not hours. Four focused blocks (about two hours of true focus) is a solid study day for most people; eight is a heavy one. Consistency across days beats a one-off marathon.",
  },
  {
    q: "What should I do during the 5-minute break?",
    a: "Stand up, stretch, get water, look out a window — anything that isn't a screen. The break's job is to reset your attention, and a feed scroll doesn't reset anything.",
  },
  {
    q: "Does the pomodoro technique help with ADHD or a wandering mind?",
    a: "Many people with attention difficulties find short, externally-timed blocks easier than open-ended sessions, because the timer carries the discipline. If 25 minutes feels long, finish smaller blocks and let the streak build — momentum matters more than block length.",
  },
  {
    q: "Is the Wolfhour pomodoro timer free?",
    a: "Yes — the timer, scenes, and sounds are all free, with no signup needed to start. It also works offline once installed as an app.",
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
  headline: "A pomodoro timer that feels like a ritual, not an alarm",
  description:
    "How to run real pomodoro sessions in Wolfhour: focus blocks, gentle breaks, and an ambience that makes returning to the desk easier.",
  path: "/pomodoro-timer",
  image: "/showcase/pomodoro-timer-ui.jpg",
  datePublished: "2026-07-11",
  dateModified: "2026-07-20",
});

export default function PomodoroTimerPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ARTICLE_LD) }}
      />
      <h1>A pomodoro timer that feels like a ritual, not an alarm</h1>
      <p>
        The pomodoro technique is simple: work in short, fully-committed
        blocks — classically 25 minutes — then take a 5-minute break. After
        four blocks, take a longer one. The magic isn&rsquo;t the numbers;
        it&rsquo;s the contract you make with yourself. For the next block,
        the work in front of you is the only thing that exists.
      </p>
      <p>
        Wolfhour&rsquo;s timer is built around that contract. Pick Focus,
        Short Break, Long Break, or a count-up Stopwatch; the scene keeps
        breathing behind the clock, and when time is up you get a soft
        two-note chime — no jarring buzzer, no red flashing zero. The room
        stays calm.
      </p>
      <Image
        src="/showcase/pomodoro-timer-ui.jpg"
        alt="The Wolfhour pomodoro timer in Focus mode — 25-minute countdown over a cinematic scene"
        width={1440}
        height={900}
        className="my-4 rounded-xl border border-white/10 shadow-xl"
        priority
      />

      <h2>What is the pomodoro technique?</h2>
      <p>
        Named after a tomato-shaped kitchen timer, the technique was developed
        by Francesco Cirillo in the late 1980s and has outlived a thousand
        productivity trends for one reason: it turns &ldquo;study all
        evening&rdquo; — a plan your brain quietly refuses — into a sequence
        of small, finishable promises. One block. Then a breath. Then another
        block. The timer holds the discipline so you don&rsquo;t have to.
      </p>

      <h2>Why does pomodoro work for studying?</h2>
      <ul>
        <li>
          <strong>It shrinks the start.</strong> &ldquo;Study organic
          chemistry&rdquo; is a wall. &ldquo;25 minutes on reaction
          mechanisms&rdquo; is a door. Small blocks beat willpower battles.
        </li>
        <li>
          <strong>Breaks are scheduled, not stolen.</strong> When rest is part
          of the plan, checking your phone stops being a guilty escape and
          starts being a timed pause.
        </li>
        <li>
          <strong>Blocks are countable.</strong> Six blocks is a good morning.
          You can see your effort, which is exactly what streaks and session
          stats in Wolfhour are for.
        </li>
      </ul>

      <h2>How long should a pomodoro be?</h2>
      <p>
        Start with the classic 25 minutes. It&rsquo;s short enough that
        starting never feels like a commitment, and long enough to get real
        reading or problem-solving done. Two honest adjustments worth
        knowing:
      </p>
      <ul>
        <li>
          <strong>Struggling to start at all?</strong> The 25 is the point —
          don&rsquo;t lengthen it. Finishing a small block rebuilds the habit
          faster than heroically failing a big one.
        </li>
        <li>
          <strong>Deep in a long proof or essay?</strong> Don&rsquo;t let the
          bell amputate real flow. Switch to the stopwatch and let the
          session run — the technique is a ladder into concentration, not a
          cage around it.
        </li>
      </ul>

      <h2>How Wolfhour runs it</h2>
      <p>
        Wolfhour keeps the classic shape: a 25-minute focus block, a 5-minute
        short break, and a 15-minute long break, one tap apart. No settings
        maze — the timer&rsquo;s job is to disappear behind the work. For
        open-ended deep work, the per-subject stopwatches in{" "}
        <Link href="/aspirant-mode">Aspirant mode</Link> run as long as you
        do. And unlike a bare timer tab, the block runs inside your scene —
        the backdrop and your sound mix keep going while you work.
      </p>

      <h2>The environment half of the technique</h2>
      <p>
        Most pomodoro advice ignores what your senses do during the block.
        A consistent backdrop — rain on glass, a quiet café hum, slow waves —
        acts as a cue: this sound means we&rsquo;re working. Layer your own
        mix from Wolfhour&rsquo;s{" "}
        <Link href="/study-sounds">study sounds</Link>, keep it identical
        across sessions, and starting a block begins to feel automatic.
      </p>
      <Image
        src="/showcase/scene-switcher.jpg"
        alt="Choosing a live cinematic scene in Wolfhour — the backdrop your pomodoro blocks run inside"
        width={1440}
        height={900}
        className="my-4 rounded-xl border border-white/10 shadow-xl"
      />

      <h2>Between blocks, the room rests with you</h2>
      <p>
        When a break starts, you&rsquo;re not staring at a dead settings
        screen. The dashboard returns to a greeting, a quote, and a big calm
        clock — in whichever face you&rsquo;ve picked, from flip clock to LED
        to ember. Five minutes later, one tap puts the next block on.
      </p>
      <Image
        src="/showcase/home-dashboard.jpg"
        alt="The Wolfhour home dashboard between pomodoro sessions — a large clock and greeting over a live scene"
        width={1440}
        height={900}
        className="my-4 rounded-xl border border-white/10 shadow-xl"
      />
      <p>
        If you&rsquo;re preparing for a competitive exam and want your blocks
        tracked per subject — with trends, streaks, and honest totals — that&rsquo;s
        what <Link href="/aspirant-mode">Aspirant mode</Link> was built for:
        a per-subject study tracker with goals, streaks, and a daily trend
        chart under an exam countdown.
      </p>

      <h2>Pomodoro questions, answered</h2>
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
