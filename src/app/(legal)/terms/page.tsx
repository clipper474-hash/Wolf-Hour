import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The short, fair terms for using Wolfhour.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <>
      <h1>Terms of Service</h1>
      <p>Effective date: 15 July 2026</p>
      <p>
        By using Wolfhour you agree to these terms. They are intentionally
        short and fair.
      </p>

      <h2>The service</h2>
      <p>
        Wolfhour is a focus and ambience app for personal use, currently
        free. We work to keep it available and reliable, but it is provided
        &ldquo;as is&rdquo;, without warranties, and availability is not
        guaranteed.
      </p>

      <h2>Pricing &amp; ads</h2>
      <p>
        To fund maintenance of the service, we may in the future show ads or
        move certain features behind a paid subscription. Any such change will
        be announced in the app, reflected on this page with a new effective
        date, and will never apply retroactively to charge you for past use.
      </p>

      <h2>Your account</h2>
      <ul>
        <li>Keep your credentials to yourself; you are responsible for activity on your account.</li>
        <li>You can reset a lost password from the sign-in screen at any time.</li>
        <li>We may suspend accounts that abuse the service (e.g. attempts to access other users&rsquo; data).</li>
      </ul>

      <h2>Content</h2>
      <p>
        All backgrounds and sounds in Wolfhour are royalty-free and
        licensed for use inside the app. Please don&rsquo;t extract or
        redistribute them as standalone media.
      </p>

      <h2>Your data</h2>
      <p>
        What we store and how to delete it is covered by the{" "}
        <Link href="/privacy">Privacy Policy</Link>.
      </p>

      <h2>Liability</h2>
      <p>
        To the maximum extent permitted by law, we are not liable for indirect
        or consequential damages arising from use of the app. Nothing in these
        terms limits rights you have under mandatory local law.
      </p>

      <h2>Changes</h2>
      <p>
        We may update these terms; material changes will be reflected on this
        page with a new effective date. Continuing to use the app after a
        change means you accept the updated terms.
      </p>
    </>
  );
}
