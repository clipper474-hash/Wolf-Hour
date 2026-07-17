"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { useAuthStore } from "@/lib/auth-store";

/** Landing spot for the Supabase recovery link. The browser client exchanges
 *  the token in the URL automatically, which signs the user in; this page
 *  then just sets the new password. Opened without a valid link → no session
 *  → we say so instead of showing a dead form.
 *  ponytail: PKCE ceiling — the link only completes in the browser that
 *  requested it (code_verifier lives there). Cross-device links show the
 *  expired message; upgrade path is the {{ .TokenHash }} email template +
 *  verifyOtp({ type: "recovery" }) if that ever matters. */
export default function ResetPasswordPage() {
  const router = useRouter();
  const { user, ready, updatePassword } = useAuthStore();
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    const msg = await updatePassword(password);
    setBusy(false);
    if (msg) { setErr(msg); return; }
    router.push("/app");
  };

  return (
    <main className="grid h-dvh place-items-center overflow-y-auto bg-void px-6 font-body text-snow">
      <div
        className="glass w-full max-w-sm rounded-3xl p-6"
        style={{ background: "rgba(15, 13, 20, 0.82)" }}
      >
        <h1 className="font-display text-2xl font-semibold text-white">Set a new password</h1>

        {!ready ? (
          <p className="mt-3 text-[13px] text-white/55">Checking your reset link…</p>
        ) : !user ? (
          <p className="mt-3 text-[13.5px] leading-relaxed text-white/60">
            This reset link is invalid or has expired. Head back and request a
            new one from &ldquo;Forgot password?&rdquo; on the sign-in screen.
          </p>
        ) : (
          <form onSubmit={submit} className="mt-5 space-y-3">
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="New password (min. 6 characters)"
                autoComplete="new-password"
                autoFocus
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
            {err && <p className="text-[12px] text-white/70">{err}</p>}
            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-xl bg-gradient-to-b from-[#22d3ee] to-[#2563eb] px-4 py-2.5 text-[14px] font-semibold text-white shadow-[0_10px_30px_rgba(56,189,248,0.4)] transition-opacity disabled:opacity-60"
            >
              {busy ? "…" : "Save password & open app"}
            </button>
          </form>
        )}

        <Link
          href="/"
          className="mt-4 block text-center text-[13px] text-white/60 transition-colors hover:text-white"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
