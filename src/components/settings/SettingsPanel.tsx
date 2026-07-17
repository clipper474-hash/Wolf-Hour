"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X, Settings as Cog, LogOut } from "lucide-react";
import { useClockStore } from "@/lib/store";
import { usePrefsStore } from "@/lib/prefs-store";
import { useAuthStore } from "@/lib/auth-store";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

/** Central settings — frosted popover above the dock. Reuses existing state
 *  (clock prefs + personal prefs). */
export function SettingsPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { hour12, showSeconds, setHour12, setShowSeconds } = useClockStore();
  const { name, cursor, theme, setName, setCursor, setTheme } = usePrefsStore();

  return (
    <AnimatePresence>
      {open && (
        <>
          <button aria-label="Close settings" className="fixed inset-0 z-30 cursor-default" onClick={onClose} />
          <motion.div
            role="dialog"
            aria-label="Settings"
            initial={{ opacity: 0, y: 24, scale: 0.94, x: "-50%" }}
            animate={{ opacity: 1, y: 0, scale: 1, x: "-50%" }}
            exit={{ opacity: 0, y: 20, scale: 0.94, x: "-50%" }}
            transition={{ type: "spring", stiffness: 340, damping: 30 }}
            style={{
              position: "fixed", left: "50%", bottom: 92, transformOrigin: "bottom center",
              borderRadius: 24, width: "min(94vw, 420px)",
              background: "rgba(15, 13, 20, 0.74)",
              backdropFilter: "blur(20px) saturate(150%)", WebkitBackdropFilter: "blur(20px) saturate(150%)",
            }}
            className="glass z-40 p-4"
          >
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cog size={16} className="text-white/70" />
                <h2 className="text-[15px] font-semibold text-white">Settings</h2>
              </div>
              <button onClick={onClose} aria-label="Close"
                className="grid h-8 w-8 place-items-center rounded-full text-white/60 transition-colors hover:bg-white/10 hover:text-white">
                <X size={16} />
              </button>
            </div>

            <div className="space-y-2.5">
              {isSupabaseConfigured && <AccountRow />}
              <Row label="Your name" hint="Shown in the greeting">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value.slice(0, 24))}
                  placeholder="there"
                  className="w-32 rounded-lg bg-white/[0.06] px-2.5 py-1.5 text-right text-[13px] text-white outline-none ring-1 ring-white/12 placeholder:text-white/30 focus:ring-white/30"
                />
              </Row>
              <Row label="Time format">
                <Segmented value={hour12 ? "12" : "24"} onChange={(k) => setHour12(k === "12")}
                  options={[{ k: "24", label: "24h" }, { k: "12", label: "12h" }]} />
              </Row>
              <Row label="Seconds">
                <Segmented value={showSeconds ? "on" : "off"} onChange={(k) => setShowSeconds(k === "on")}
                  options={[{ k: "off", label: "Off" }, { k: "on", label: "On" }]} />
              </Row>
              <Row label="Theme" hint="Landing page & app">
                <Segmented value={theme} onChange={setTheme}
                  options={[{ k: "dark" as const, label: "Dark" }, { k: "light" as const, label: "Light" }]} />
              </Row>
              <Row label="Custom cursor" hint="Liquid-glass pointer (desktop)">
                <Segmented value={cursor ? "on" : "off"} onChange={(k) => setCursor(k === "on")}
                  options={[{ k: "on", label: "On" }, { k: "off", label: "Off" }]} />
              </Row>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function AccountRow() {
  const { user, ready, signInWithPassword, signUp, signOut } = useAuthStore();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (!ready) return null;

  if (user) {
    return (
      <div className="flex items-center justify-between gap-3 rounded-2xl bg-white/[0.05] px-3.5 py-2.5">
        <div className="min-w-0">
          <p className="text-[13px] font-medium text-white/90">Signed in</p>
          <p className="truncate text-[11px] text-white/40">{user.email}</p>
        </div>
        <button
          onClick={() => signOut()}
          className="flex items-center gap-1.5 rounded-full bg-white/8 px-3 py-1.5 text-xs font-medium text-white/70 transition-colors hover:bg-white/12 hover:text-white"
        >
          <LogOut size={13} /> Sign out
        </button>
      </div>
    );
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    const run = mode === "in" ? signInWithPassword : signUp;
    const msg = await run(email.trim(), password);
    setBusy(false);
    if (msg) setErr(msg);
    else if (mode === "up") setErr("Check your email to confirm, then sign in.");
  };

  return (
    <form onSubmit={submit} className="space-y-2 rounded-2xl bg-white/[0.05] px-3.5 py-3">
      <div className="flex items-center justify-between">
        <p className="text-[13px] font-medium text-white/90">
          {mode === "in" ? "Sign in to sync" : "Create an account"}
        </p>
        <button
          type="button"
          onClick={() => { setMode(mode === "in" ? "up" : "in"); setErr(null); }}
          className="text-[11px] text-[#38bdf8] hover:underline"
        >
          {mode === "in" ? "Sign up" : "Have an account?"}
        </button>
      </div>
      <input
        type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
        placeholder="you@email.com" autoComplete="email"
        className="w-full rounded-lg bg-white/[0.06] px-2.5 py-1.5 text-[13px] text-white outline-none ring-1 ring-white/12 placeholder:text-white/30 focus:ring-white/30"
      />
      <input
        type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
        placeholder="Password" autoComplete={mode === "in" ? "current-password" : "new-password"}
        className="w-full rounded-lg bg-white/[0.06] px-2.5 py-1.5 text-[13px] text-white outline-none ring-1 ring-white/12 placeholder:text-white/30 focus:ring-white/30"
      />
      {err && <p className="text-[11px] text-white/60">{err}</p>}
      <button
        type="submit" disabled={busy}
        className="w-full rounded-lg bg-gradient-to-b from-[#22d3ee] to-[#2563eb] px-3 py-1.5 text-[13px] font-semibold text-white transition-opacity disabled:opacity-60"
      >
        {busy ? "…" : mode === "in" ? "Sign in" : "Sign up"}
      </button>
    </form>
  );
}

function Row({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl bg-white/[0.05] px-3.5 py-2.5">
      <div>
        <p className="text-[13px] font-medium text-white/90">{label}</p>
        {hint && <p className="text-[11px] text-white/40">{hint}</p>}
      </div>
      {children}
    </div>
  );
}

function Segmented<T extends string>({ options, value, onChange }: {
  options: { k: T; label: string }[]; value: T; onChange: (k: T) => void;
}) {
  return (
    <div className="flex items-center gap-1 rounded-full bg-white/8 p-0.5">
      {options.map((o) => (
        <button key={o.k} onClick={() => onChange(o.k)}
          className={cn("rounded-full px-3 py-1 text-xs font-medium transition-colors",
            o.k === value ? "bg-white/20 text-white ring-1 ring-white/20" : "text-white/55 hover:text-white")}>
          {o.label}
        </button>
      ))}
    </div>
  );
}
