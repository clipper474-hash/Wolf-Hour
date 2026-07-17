"use client";

import { create } from "zustand";
import type { AuthChangeEvent, Session, User } from "@supabase/supabase-js";
import { getSupabaseBrowser, isSupabaseConfigured } from "@/lib/supabase/client";
import { syncFor } from "@/lib/cloud-sync";

type AuthState = {
  user: User | null;
  /** false until the first session check resolves (avoids UI flash). */
  ready: boolean;
  signInWithPassword: (email: string, password: string) => Promise<string | null>;
  signUp: (email: string, password: string) => Promise<string | null>;
  /** Emails a recovery link that lands on /reset-password. */
  resetPassword: (email: string) => Promise<string | null>;
  /** Sets a new password for the current (recovery) session. */
  updatePassword: (password: string) => Promise<string | null>;
  signOut: () => Promise<void>;
};

/** Auth is cookie-backed by Supabase; this store just mirrors the user for UI.
 *  Returns an error string (or null on success) so the panel can show it. */
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  ready: !isSupabaseConfigured, // no auth configured → nothing to wait for
  signInWithPassword: async (email, password) => {
    const sb = getSupabaseBrowser();
    if (!sb) return "Auth is not configured.";
    const { error } = await sb.auth.signInWithPassword({ email, password });
    return error?.message ?? null;
  },
  signUp: async (email, password) => {
    const sb = getSupabaseBrowser();
    if (!sb) return "Auth is not configured.";
    const { data, error } = await sb.auth.signUp({ email, password });
    if (error) return error.message;
    // Anti-enumeration: for an already-registered email Supabase "succeeds"
    // with a ghost user that has no identities. Surface it as a sentinel so
    // the modal can route to sign-in instead of a dead verify screen.
    if ((data.user?.identities?.length ?? 0) === 0) return "__exists__";
    return null;
  },
  // ponytail: link flow (default templates — no custom SMTP). PKCE means the
  // reset link only completes in the browser that requested it; the signup
  // modal covers the cross-device case by polling sign-in instead.
  resetPassword: async (email) => {
    const sb = getSupabaseBrowser();
    if (!sb) return "Auth is not configured.";
    const { error } = await sb.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    return error?.message ?? null;
  },
  updatePassword: async (password) => {
    const sb = getSupabaseBrowser();
    if (!sb) return "Auth is not configured.";
    const { error } = await sb.auth.updateUser({ password });
    return error?.message ?? null;
  },
  signOut: async () => {
    const sb = getSupabaseBrowser();
    if (sb) await sb.auth.signOut();
  },
}));

// Wire session → store once, on the client. onAuthStateChange fires immediately
// with the current session, then on every login/logout/token refresh.
if (typeof window !== "undefined" && isSupabaseConfigured) {
  const sb = getSupabaseBrowser()!;
  let lastUserId: string | null = null;
  sb.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
    const user = session?.user ?? null;
    useAuthStore.setState({ user, ready: true });
    // Only (re)start sync when the identity actually changes, not on every
    // token refresh (which fires this listener too).
    if ((user?.id ?? null) !== lastUserId) {
      lastUserId = user?.id ?? null;
      void syncFor(lastUserId);
    }
  });
}
