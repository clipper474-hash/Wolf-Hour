import type { Metadata } from "next";

/** Dev diagnostic page — keep out of search. */
export const metadata: Metadata = {
  title: "Soundcheck",
  robots: { index: false, follow: false },
};

export default function SoundcheckLayout({ children }: { children: React.ReactNode }) {
  return children;
}
