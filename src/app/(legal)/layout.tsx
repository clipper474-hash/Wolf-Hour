import Link from "next/link";

/** Shared shell for /privacy and /terms — plain prose on the void background. */
export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    // body is overflow:hidden globally (immersive app canvas) — legal pages
    // scroll inside their own dvh container, same as the landing.
    <main className="h-dvh overflow-y-auto bg-void px-6 py-16 font-body text-snow">
      <div className="mx-auto max-w-2xl">
        <Link href="/" className="text-[13px] text-white/50 transition-colors hover:text-white/85">
          ← Wolfhour
        </Link>
        <article
          className="mt-8 space-y-4 text-[15px] leading-relaxed text-white/70
            [&_h1]:font-display [&_h1]:text-3xl [&_h1]:font-semibold [&_h1]:tracking-tight [&_h1]:text-white
            [&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-white
            [&_li]:ml-5 [&_li]:list-disc [&_a]:text-cyan-300 [&_a]:underline-offset-2 hover:[&_a]:underline"
        >
          {children}
        </article>
      </div>
    </main>
  );
}
