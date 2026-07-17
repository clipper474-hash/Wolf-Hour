import Link from "next/link";

export default function NotFound() {
  return (
    <main className="relative flex h-dvh flex-col items-center justify-center gap-5 bg-void px-6 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.08em] text-ash">Wolfhour</p>
      <h1
        className="font-display text-snow"
        style={{ fontSize: "clamp(2rem, 6vw, 3.5rem)", letterSpacing: "-0.03em" }}
      >
        404 — lost in the quiet.
      </h1>
      <Link
        href="/"
        className="rounded-full bg-accent-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-400"
      >
        Back to focus
      </Link>
    </main>
  );
}
