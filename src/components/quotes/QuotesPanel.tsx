"use client";

import { AnimatePresence, motion } from "motion/react";
import { X, Quote as QuoteIcon, Shuffle } from "lucide-react";
import { usePrefsStore } from "@/lib/prefs-store";
import { HOME_QUOTES } from "@/components/home/Quote";
import { cn } from "@/lib/utils";

/** Quotes control — shows the current line, shuffles it, toggles it on Home. */
export function QuotesPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const quoteIdx = usePrefsStore((s) => s.quoteIdx);
  const showQuote = usePrefsStore((s) => s.showQuote);
  const nextQuote = usePrefsStore((s) => s.nextQuote);
  const setShowQuote = usePrefsStore((s) => s.setShowQuote);

  return (
    <AnimatePresence>
      {open && (
        <>
          <button aria-label="Close quotes" className="fixed inset-0 z-30 cursor-default" onClick={onClose} />
          <motion.div
            role="dialog"
            aria-label="Quotes"
            initial={{ opacity: 0, y: 24, scale: 0.94, x: "-50%" }}
            animate={{ opacity: 1, y: 0, scale: 1, x: "-50%" }}
            exit={{ opacity: 0, y: 20, scale: 0.94, x: "-50%" }}
            transition={{ type: "spring", stiffness: 340, damping: 30 }}
            style={{
              position: "fixed", left: "50%", bottom: 92, transformOrigin: "bottom center",
              borderRadius: 24, width: "min(94vw, 440px)",
              background: "rgba(15, 13, 20, 0.74)",
              backdropFilter: "blur(20px) saturate(150%)", WebkitBackdropFilter: "blur(20px) saturate(150%)",
            }}
            className="glass z-40 p-4"
          >
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <QuoteIcon size={16} className="text-white/70" />
                <h2 className="text-[15px] font-semibold text-white">Quotes</h2>
              </div>
              <button onClick={onClose} aria-label="Close"
                className="grid h-8 w-8 place-items-center rounded-full text-white/60 transition-colors hover:bg-white/10 hover:text-white">
                <X size={16} />
              </button>
            </div>

            <div className="rounded-2xl bg-white/[0.05] p-5 text-center">
              <AnimatePresence mode="wait">
                <motion.p
                  key={quoteIdx}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25 }}
                  className="font-body text-[17px] leading-relaxed text-white/90"
                >
                  “{HOME_QUOTES[quoteIdx % HOME_QUOTES.length]}”
                </motion.p>
              </AnimatePresence>
            </div>

            <div className="mt-3 flex items-center gap-2">
              <button
                onClick={nextQuote}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-white/90 py-2.5 text-[14px] font-semibold text-black transition hover:bg-white"
              >
                <Shuffle size={15} /> New quote
              </button>
              <button
                onClick={() => setShowQuote(!showQuote)}
                className={cn(
                  "rounded-xl px-4 py-2.5 text-[13px] font-medium ring-1 transition",
                  showQuote
                    ? "bg-white/10 text-white ring-white/20 hover:bg-white/16"
                    : "text-white/55 ring-white/12 hover:text-white"
                )}
              >
                {showQuote ? "Shown on Home" : "Hidden"}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
