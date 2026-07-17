"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X, Eye, EyeOff, Check } from "lucide-react";
import { useAuthStore } from "@/lib/auth-store";

/** Password rules, shown as a live checklist during sign-up. */
const PASS_RULES: { label: string; test: (p: string) => boolean }[] = [
  { label: "At least 8 characters", test: (p) => p.length >= 8 },
  { label: "One uppercase letter (A–Z)", test: (p) => /[A-Z]/.test(p) },
  { label: "One lowercase letter (a–z)", test: (p) => /[a-z]/.test(p) },
  { label: "One number (0–9)", test: (p) => /[0-9]/.test(p) },
  { label: "One special character (!@#$…)", test: (p) => /[^A-Za-z0-9]/.test(p) },
];

function PasswordChecklist({ password }: { password: string }) {
  return (
    <ul className="space-y-1 px-1">
      {PASS_RULES.map((r) => {
        const ok = r.test(password);
        return (
          <li
            key={r.label}
            className={`flex items-center gap-2 text-[12px] transition-colors ${ok ? "text-emerald-400/90" : "text-white/40"}`}
          >
            <span className={`grid size-3.5 place-items-center rounded-full ${ok ? "bg-emerald-400/20" : "bg-white/10"}`}>
              {ok && <Check size={9} strokeWidth={3} />}
            </span>
            {r.label}
          </li>
        );
      })}
    </ul>
  );
}

/** Landing sign-in / sign-up modal. On success the caller routes into /app. */
export function AuthModal({
  open,
  onClose,
  onSignedIn,
}: {
  open: boolean;
  onClose: () => void;
  onSignedIn: () => void;
}) {
  const { signInWithPassword, signUp, resetPassword } = useAuthStore();
  // await-confirm = "click the link we emailed you" (this tab polls sign-in,
  // so the device that signed up gets in even if the link is opened on
  // another one); forgot-sent = reset link on its way.
  const [mode, setMode] = useState<"in" | "up" | "forgot" | "await-confirm" | "forgot-sent">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // Cross-device confirm: the confirmation link may be tapped on the phone
  // while the account was created here. Supabase refuses password sign-in
  // until the email is confirmed, so polling it doubles as a "confirmed yet?"
  // check — the first success signs THIS device in. 10s spacing stays well
  // under the auth rate limit.
  useEffect(() => {
    if (!open || mode !== "await-confirm") return;
    // Cap at 30 tries (~5 min) so an abandoned tab stops hitting the auth API.
    let tries = 0;
    const id = setInterval(async () => {
      if (++tries > 30) {
        clearInterval(id);
        setMode("in");
        setErr("Confirmed already? Sign in below.");
        return;
      }
      const msg = await signInWithPassword(email.trim(), password);
      if (!msg) onSignedIn();
    }, 10000);
    return () => clearInterval(id);
  }, [open, mode, email, password, signInWithPassword, onSignedIn]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    const addr = email.trim();
    let msg: string | null = null;
    switch (mode) {
      case "in":
        msg = await signInWithPassword(addr, password);
        if (!msg) { setBusy(false); onSignedIn(); return; }
        // Wrong credentials can also mean "no account yet" (Supabase hides
        // which, anti-enumeration). If the password passes signup rules, try
        // creating the account: new user → auto sign-up + confirm screen;
        // "__exists__" ghost → account exists, so it's just a wrong password.
        if (/invalid login credentials/i.test(msg) && PASS_RULES.every((r) => r.test(password))) {
          const upMsg = await signUp(addr, password);
          if (!upMsg) {
            setMode("await-confirm"); setBusy(false);
            setErr("No account existed for this email, so we created one.");
            return;
          }
          if (upMsg === "__exists__") msg = "Wrong password for this account. Try again or use “Forgot password?”.";
        }
        break;
      case "up":
        msg = await signUp(addr, password);
        if (msg === "__exists__") {
          setMode("in"); setBusy(false);
          setErr("This email already has an account — sign in instead.");
          return;
        }
        if (!msg) setMode("await-confirm");
        break;
      case "forgot":
        msg = await resetPassword(addr);
        if (!msg) setMode("forgot-sent");
        break;
    }
    setBusy(false);
    if (msg) setErr(msg);
  };

  const waiting = mode === "await-confirm" || mode === "forgot-sent";
  const showEmail = mode === "in" || mode === "up" || mode === "forgot";
  const showPassword = mode === "in" || mode === "up";
  // Creating a password → show the checklist and require all rules.
  const needsStrongPass = mode === "up";
  const passOk = !needsStrongPass || PASS_RULES.every((r) => r.test(password));

  const TITLES: Record<typeof mode, [string, string]> = {
    in: ["Welcome back", "Sign in to open Wolfhour."],
    up: ["Create your account", "Sign up to sync across your devices."],
    forgot: ["Reset your password", "We'll email you a reset link."],
    "await-confirm": [
      "Check your email",
      `We sent a confirmation link to ${email.trim()}. Open it on any device — this screen signs in by itself once you do.`,
    ],
    "forgot-sent": [
      "Check your email",
      `We sent a password reset link to ${email.trim()}. Open it to choose a new password.`,
    ],
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center px-6">
          <motion.button
            aria-label="Close"
            onClick={onClose}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 cursor-default bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            role="dialog" aria-label="Sign in"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="glass relative z-10 w-full max-w-sm rounded-3xl p-6"
            style={{
              background: "rgba(15, 13, 20, 0.82)",
              backdropFilter: "blur(22px) saturate(150%)",
              WebkitBackdropFilter: "blur(22px) saturate(150%)",
            }}
          >
            <button
              onClick={onClose} aria-label="Close"
              className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full text-white/60 transition-colors hover:bg-white/10 hover:text-white"
            >
              <X size={16} />
            </button>

            <h2 className="font-display text-2xl font-semibold text-white">{TITLES[mode][0]}</h2>
            <p className="mt-1 text-[13px] text-white/55">{TITLES[mode][1]}</p>

            {mode === "await-confirm" && (
              <p className="mt-4 flex items-center gap-2 text-[13px] text-white/60">
                <span className="size-2 shrink-0 animate-pulse rounded-full bg-emerald-400/80" aria-hidden />
                Waiting for you to confirm…
              </p>
            )}

            {!waiting && (
              <form onSubmit={submit} className="mt-5 space-y-3">
                {showEmail && (
                  <input
                    type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@email.com" autoComplete="email" autoFocus
                    className="w-full rounded-xl bg-white/[0.06] px-3.5 py-2.5 text-[14px] text-white outline-none ring-1 ring-white/12 placeholder:text-white/30 focus:ring-white/30"
                  />
                )}
                {showPassword && (
                  <div className="relative">
                    <input
                      type={showPass ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      autoComplete={mode === "in" ? "current-password" : "new-password"}
                      className="w-full rounded-xl bg-white/[0.06] px-3.5 py-2.5 pr-11 text-[14px] text-white outline-none ring-1 ring-white/12 placeholder:text-white/30 focus:ring-white/30"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass((v) => !v)}
                      aria-label={showPass ? "Hide password" : "Show password"}
                      className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-white/45 transition-colors hover:text-white/85"
                    >
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                )}
                {needsStrongPass && <PasswordChecklist password={password} />}
                {mode === "in" && (
                  <button
                    type="button"
                    onClick={() => { setMode("forgot"); setErr(null); }}
                    className="block w-full text-right text-[12px] text-white/50 transition-colors hover:text-white/85"
                  >
                    Forgot password?
                  </button>
                )}
                {err && <p className="text-[12px] text-white/70">{err}</p>}
                <button
                  type="submit" disabled={busy || !passOk}
                  className="w-full rounded-xl bg-gradient-to-b from-[#22d3ee] to-[#2563eb] px-4 py-2.5 text-[14px] font-semibold text-white shadow-[0_10px_30px_rgba(56,189,248,0.4)] transition-opacity disabled:opacity-60"
                >
                  {busy
                    ? "…"
                    : mode === "in" ? "Sign in"
                    : mode === "up" ? "Sign up"
                    : "Send link"}
                </button>
              </form>
            )}
            {waiting && err && <p className="mt-3 text-[12px] text-white/70">{err}</p>}

            <button
              type="button"
              onClick={() => { setMode(mode === "in" ? "up" : "in"); setErr(null); }}
              className="mt-4 w-full text-center text-[13px] text-white/60 transition-colors hover:text-white"
            >
              {mode === "in" ? "No account? Sign up" : mode === "up" ? "Have an account? Sign in" : "Back to sign in"}
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
