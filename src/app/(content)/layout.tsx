import Link from "next/link";

/** Shared shell for the supporting content pages (/pomodoro-timer,
 *  /study-sounds, /aspirant-mode) — same prose treatment as the legal
 *  pages, plus a soft CTA back to the landing page. */
export default function ContentLayout({ children }: { children: React.ReactNode }) {
  return (
    // body is overflow:hidden globally (immersive app canvas) — these pages
    // scroll inside their own dvh container, same as the landing.
    <main className="h-dvh overflow-y-auto bg-void px-6 py-16 font-body text-snow">
      <div className="mx-auto max-w-2xl">
        <nav className="flex items-center gap-4 text-[13px] text-white/50">
          <Link href="/" className="transition-colors hover:text-white/85">
            ← Wolfhour
          </Link>
          <Link href="/#features" className="transition-colors hover:text-white/85">
            All features
          </Link>
        </nav>
        <article
          className="mt-8 space-y-4 text-[15px] leading-relaxed text-white/70
            [&_h1]:font-display [&_h1]:text-3xl [&_h1]:font-semibold [&_h1]:tracking-tight [&_h1]:text-white
            [&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-white
            [&_li]:ml-5 [&_li]:list-disc [&_a]:text-cyan-300 [&_a]:underline-offset-2 hover:[&_a]:underline"
        >
          {children}
        </article>
        <p className="mt-12 border-t border-white/10 pt-6 text-[14px] text-white/50">
          Wolfhour is free to use and runs in your browser —{" "}
          <Link href="/" className="text-cyan-300 underline-offset-2 hover:underline">
            open the landing page
          </Link>{" "}
          and start focusing in seconds.
        </p>
      </div>
    </main>
  );
}
