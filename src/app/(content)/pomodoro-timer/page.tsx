import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pomodoro Timer for Studying",
  description:
    "How to run real pomodoro sessions in Wolfhour: focus blocks, gentle breaks, and an ambience that makes returning to the desk easier.",
  alternates: { canonical: "/pomodoro-timer" },
};

export default function PomodoroTimerPage() {
  return (
    <>
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
        breathing behind the clock, and when time is up there&rsquo;s no
        jarring buzzer, no red flashing zero — the room stays calm.
      </p>
      <Image
        src="/showcase/pomodoro-timer-ui.jpg"
        alt="The Wolfhour pomodoro timer in Focus mode — 25-minute countdown over a cinematic scene"
        width={1440}
        height={900}
        className="my-4 rounded-xl border border-white/10 shadow-xl"
        priority
      />

      <h2>Why pomodoro works for studying</h2>
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
      <p>
        If you&rsquo;re preparing for a competitive exam and want your blocks
        tracked per subject — with trends, streaks, and honest totals — that&rsquo;s
        what <Link href="/aspirant-mode">Aspirant mode</Link> was built for.
      </p>
    </>
  );
}
