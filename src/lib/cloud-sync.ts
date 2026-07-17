"use client";

import { getSupabaseBrowser } from "@/lib/supabase/client";
import { usePrefsStore } from "@/lib/prefs-store";
import { useAspirantStore } from "@/lib/aspirant-store";
import { useSoundStore } from "@/lib/sound-store";
import { useSceneStore, useClockStore } from "@/lib/store";
import { useTasksStore } from "@/lib/tasks-store";

// A zustand persist store, seen structurally (avoids leaking each store's type).
type SyncableStore = {
  subscribe: (listener: () => void) => () => void;
  persist: { rehydrate: () => void | Promise<void> };
};

// localStorage key (set by each store's persist `name`) → its store.
const STORES: { key: string; store: SyncableStore }[] = [
  { key: "af-prefs", store: usePrefsStore as unknown as SyncableStore },
  { key: "polaris-aspirant", store: useAspirantStore as unknown as SyncableStore },
  { key: "polaris-sounds", store: useSoundStore as unknown as SyncableStore },
  { key: "polaris-scene", store: useSceneStore as unknown as SyncableStore },
  { key: "polaris-clock", store: useClockStore as unknown as SyncableStore },
  { key: "polaris-tasks", store: useTasksStore as unknown as SyncableStore },
];

const PUSH_DEBOUNCE_MS = 800;

// While we're writing cloud→local, suppress the change-listeners so a pull
// doesn't immediately echo back up as a push.
let suppressing = false;

/** Pull each store's blob from the cloud and rehydrate. Cloud wins on login. */
async function pullAll(userId: string) {
  const sb = getSupabaseBrowser();
  if (!sb) return;
  const { data, error } = await sb
    .from("user_state")
    .select("store_key, data")
    .eq("user_id", userId);
  if (error || !data) return;

  const byKey = new Map(
    (data as { store_key: string; data: unknown }[]).map((r) => [r.store_key, r.data]),
  );
  suppressing = true;
  for (const { key, store } of STORES) {
    const cloud = byKey.get(key);
    if (cloud === undefined) continue;
    // persist stores the raw `{state, version}` envelope under `key`.
    localStorage.setItem(key, JSON.stringify(cloud));
    await store.persist.rehydrate();
  }
  suppressing = false;
}

/** Subscribe to every store; push its localStorage blob to the cloud on change. */
function startPush(userId: string): () => void {
  const sb = getSupabaseBrowser();
  if (!sb) return () => {};
  const timers = new Map<string, ReturnType<typeof setTimeout>>();
  // Last blob pushed per key — zustand fires on every set(), including ones
  // that don't change persisted state, so skip identical payloads. Fewer
  // writes per user = server load stays flat as users grow.
  const lastPushed = new Map<string, string>();

  const unsubs = STORES.map(({ key, store }) =>
    store.subscribe(() => {
      if (suppressing) return;
      clearTimeout(timers.get(key));
      timers.set(
        key,
        setTimeout(async () => {
          const raw = localStorage.getItem(key);
          if (raw == null || raw === lastPushed.get(key)) return;
          lastPushed.set(key, raw);
          await sb
            .from("user_state")
            .upsert({ user_id: userId, store_key: key, data: JSON.parse(raw) });
        }, PUSH_DEBOUNCE_MS),
      );
    }),
  );

  return () => {
    for (const t of timers.values()) clearTimeout(t);
    for (const u of unsubs) u();
  };
}

let stop: (() => void) | null = null;

/** Start syncing for a signed-in user. Call again with null on sign-out. */
export async function syncFor(userId: string | null) {
  stop?.();
  stop = null;
  if (!userId) return;
  await pullAll(userId);
  stop = startPush(userId);
}
