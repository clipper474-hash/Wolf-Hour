import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Study Sounds & Ambience for Deep Focus",
  description:
    "Rain, waves, café hum and layered ambience: how to pick and mix study sounds that hold your attention instead of stealing it.",
  alternates: { canonical: "/study-sounds" },
};

export default function StudySoundsPage() {
  return (
    <>
      <h1>Study sounds that hold your attention instead of stealing it</h1>
      <p>
        The right study sound isn&rsquo;t entertainment — it&rsquo;s
        insulation. Its job is to mask the unpredictable noises around you
        (doors, traffic, other people&rsquo;s conversations) with something
        steady enough that your brain stops listening altogether. That&rsquo;s
        why rain works and your favourite playlist often doesn&rsquo;t: lyrics
        and hooks ask for attention; weather never does.
      </p>

      <h2>What actually works, and when</h2>
      <ul>
        <li>
          <strong>Rain &amp; storms</strong> — broad-spectrum, irregular but
          patternless. The safest default for reading and writing.
        </li>
        <li>
          <strong>Waves</strong> — slower rhythm, good for long revision
          sessions where you want calm more than drive.
        </li>
        <li>
          <strong>Café &amp; room tone</strong> — a low murmur of activity
          that recreates the &ldquo;working alongside others&rdquo; effect;
          many people focus better with mild social hum than in silence.
        </li>
        <li>
          <strong>Fire &amp; night ambience</strong> — best for winding down
          or low-pressure review, when a harsher soundscape would feel like
          pressure.
        </li>
      </ul>

      <h2>Layering: the difference between a sound and a place</h2>
      <p>
        A single loop can turn repetitive. Layering fixes that: rain as the
        base, distant thunder for depth, a faint fire crackle for warmth.
        Wolfhour&rsquo;s mixer lets you stack sounds with independent volumes
        and save the blend — your own room, rebuilt in ten seconds, on any
        device. The scene behind the clock moves with it, so the whole screen
        agrees about where you are.
      </p>

      <h2>Using sound as a start cue</h2>
      <p>
        Keep one mix for work and only for work. Press play, and after a week
        or two the sound itself starts your session — the same way a gym
        playlist gets you lifting. Pair the mix with a{" "}
        <Link href="/pomodoro-timer">pomodoro block</Link> and the beginning
        of focus stops being a decision at all. If you&rsquo;re tracking
        serious study hours across subjects, run your mixes inside{" "}
        <Link href="/aspirant-mode">Aspirant mode</Link> so every session
        lands in your stats.
      </p>

      <h2>Practical notes</h2>
      <ul>
        <li>Keep volume just above room noise — masking, not blasting.</li>
        <li>Wolfhour works offline as a PWA, so your mix survives a dead connection.</li>
        <li>All sounds are royalty-free and included in the free experience.</li>
      </ul>
    </>
  );
}
