import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { articleLd } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Study Sounds & Ambience for Deep Focus — Free Mixer",
  description:
    "Free study sounds for focus: rain, waves, café hum and 22 layerable ambient sounds with a live mixer. How to pick a mix that holds your attention.",
  alternates: { canonical: "/study-sounds" },
};

const FAQ = [
  {
    q: "Is ambient sound better than music for studying?",
    a: "For most reading and writing, yes. Lyrics and melodies compete for the language and pattern circuits you're trying to study with; steady ambience masks distractions without asking for attention. Save the playlist for mechanical tasks like copying notes.",
  },
  {
    q: "How loud should study sounds be?",
    a: "Just above the noise you're trying to mask, and no louder. If you notice the sound itself, turn it down — the goal is for your brain to stop listening entirely.",
  },
  {
    q: "Do I need headphones?",
    a: "No, speakers work fine in a quiet room. Headphones help in shared spaces — a library, a hostel, a family living room — where the noise you're masking is close by.",
  },
  {
    q: "Are Wolfhour's sounds free?",
    a: "Yes — all 22 sounds, the mixer, and every scene are free, with no signup needed to start. Nearly all sounds are synthesised live in your browser, so nothing downloads and nothing loops.",
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
  headline: "Study sounds that hold your attention instead of stealing it",
  description:
    "Rain, waves, café hum and layered ambience: how to pick and mix study sounds that hold your attention instead of stealing it.",
  path: "/study-sounds",
  image: "/showcase/study-sounds-mixer.jpg",
  datePublished: "2026-07-11",
  dateModified: "2026-07-20",
});

export default function StudySoundsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ARTICLE_LD) }}
      />
      <h1>Study sounds that hold your attention instead of stealing it</h1>
      <p>
        The right study sound isn&rsquo;t entertainment — it&rsquo;s
        insulation. Its job is to mask the unpredictable noises around you
        (doors, traffic, other people&rsquo;s conversations) with something
        steady enough that your brain stops listening altogether. That&rsquo;s
        why rain works and your favourite playlist often doesn&rsquo;t: lyrics
        and hooks ask for attention; weather never does.
      </p>

      <h2>What&rsquo;s in the mixer</h2>
      <p>
        Wolfhour ships 22 sounds across five groups — Nature (rain, ocean,
        wind, stream, thunder, forest, birds, night), Places (fireplace,
        café, keyboard, train), Instrumental (warm pad, deep drone, chimes,
        dream piano), Lo-Fi (vinyl, tape hiss, lo-fi keys) and Noise (white,
        pink, brown). Nearly all are synthesised live in your browser rather
        than played from a looped file — so there&rsquo;s no loop seam to
        catch your ear at minute nine, and no audio files to download before
        focus starts.
      </p>
      <Image
        src="/showcase/study-sounds-mixer.jpg"
        alt="The Wolfhour soundscape mixer — layered sounds with independent volume sliders over a live scene"
        width={1440}
        height={900}
        className="my-4 rounded-xl border border-white/10 shadow-xl"
        priority
      />

      <h2>Which study sounds actually work, and when?</h2>
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

      <h2>White, pink, or brown noise — which one?</h2>
      <p>
        The noise colours differ in where their energy sits. <strong>White
        noise</strong> spreads evenly across all frequencies — bright,
        hissy, the strongest masker for sharp interruptions like clattering
        keyboards or voices through a wall. <strong>Pink noise</strong> tilts
        toward the low end — softer, closer to steady rainfall, the easiest
        to leave on for hours. <strong>Brown noise</strong> goes lower still —
        a deep rumble like distant surf or a plane cabin, which many people
        find the most physically calming. There&rsquo;s no winner; there&rsquo;s
        a match for your room and your ears. Wolfhour ships all three, so the
        cheap experiment is to try each for one study block and keep whichever
        one you stopped noticing first — disappearing is the job.
      </p>

      <h2>Layering: the difference between a sound and a place</h2>
      <p>
        A single loop can turn repetitive. Layering fixes that: rain as the
        base, distant thunder for depth, a faint fire crackle for warmth.
        Wolfhour&rsquo;s mixer lets you stack sounds with independent volumes
        and save the blend — your own room, rebuilt in ten seconds, on any
        device. The scene behind the clock moves with it, so the whole screen
        agrees about where you are.
      </p>

      <h2>Match the sound to a scene</h2>
      <p>
        Sound is half the room; the picture is the other half. Wolfhour pairs
        your mix with eleven live cinematic scenes — a misty shrine for rain,
        a lake cabin for waves, neon rain for late-night lo-fi. Pick once and
        both halves persist together, so opening the app drops you straight
        back into your place.
      </p>
      <Image
        src="/showcase/scene-switcher.jpg"
        alt="The Wolfhour scene switcher — pairing a live cinematic scene with your study sound mix"
        width={1440}
        height={900}
        className="my-4 rounded-xl border border-white/10 shadow-xl"
      />

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
        <li>Wolfhour works offline once installed as an app, so your mix survives a dead connection.</li>
        <li>All sounds are royalty-free and included in the free experience.</li>
      </ul>

      <h2>Study sound questions, answered</h2>
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
