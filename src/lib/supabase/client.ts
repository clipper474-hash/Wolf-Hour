"use client";

import { createBrowserClient } from "@supabase/ssr";

// Env-gated: when creds are absent the whole auth layer no-ops so the
// local-first app keeps working. Drop creds in .env.local to switch it on.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && key);

let cached: ReturnType<typeof createBrowserClient> | null = null;

/** Browser Supabase client, or null when auth isn't configured. Singleton. */
export function getSupabaseBrowser() {
  if (!isSupabaseConfigured) return null;
  if (!cached) cached = createBrowserClient(url!, key!);
  return cached;
}
