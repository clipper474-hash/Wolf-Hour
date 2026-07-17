import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "What Wolfhour stores, where it lives, and how to remove it. Local-first, no trackers.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <>
      <h1>Privacy Policy</h1>
      <p>Effective date: 15 July 2026</p>
      <p>
        Wolfhour is a local-first focus and ambience app. Your data lives on
        your device first, and we collect the minimum needed to run accounts
        and sync.
      </p>

      <h2>What we collect</h2>
      <ul>
        <li>
          <strong>Account:</strong> your email address and password. Passwords
          are hashed and managed by our authentication provider (Supabase) —
          we never see or store them in plain text.
        </li>
        <li>
          <strong>App settings:</strong> your chosen scene, sound mix, clock
          style, timers, tasks, and study statistics. These are stored in your
          browser and, when you are signed in, synced to the cloud so your
          setup follows you across devices.
        </li>
      </ul>

      <h2>What we don&rsquo;t do</h2>
      <ul>
        <li>No advertising and no ad networks today.</li>
        <li>No third-party analytics or tracking scripts.</li>
        <li>No selling, renting, or sharing of your data with anyone.</li>
      </ul>
      <p>
        To cover the cost of keeping Wolfhour running, we may in the future
        show ads or offer a paid subscription for certain features. If ads are
        ever introduced, this policy will be updated first to describe exactly
        what an ad provider could collect, before anything changes.
      </p>

      <h2>Where your data lives</h2>
      <p>
        Settings are kept in your browser&rsquo;s local storage. The synced
        copy is stored in a Supabase database in a row that is locked to your
        account — database access rules prevent any other account (or
        anonymous visitor) from reading or writing it.
      </p>

      <h2>Cookies</h2>
      <p>
        We use only the session cookies required to keep you signed in. No
        marketing or cross-site cookies.
      </p>

      <h2>Deleting your data</h2>
      <p>
        Signing out leaves your local data on your device; clearing your
        browser storage removes it. To delete your account and all synced
        data, contact us through the app&rsquo;s store listing — deleting the
        account removes every synced row automatically.
      </p>

      <h2>Changes</h2>
      <p>
        If this policy changes, we will update this page and its effective
        date. See also the <Link href="/terms">Terms of Service</Link>.
      </p>
    </>
  );
}
