import type { Metadata, Viewport } from "next";
import { Inter, Geist_Mono, Hanken_Grotesk, Geist, Lora } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { SITE_URL } from "@/lib/site";
import { LiquidCursor } from "@/components/cursor/LiquidCursor";
import { BrandMark } from "@/components/brand/BrandMark";
import { ThemeApplier } from "@/components/theme/ThemeApplier";

// Runs before paint: restores the persisted theme so light-mode users don't
// see a dark flash. Reads the same zustand-persist blob ("af-prefs").
const THEME_INIT = `try{var t=JSON.parse(localStorage.getItem("af-prefs")).state.theme;if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// Display / clock face (default). Loaded via next/font (self-hosted, no layout shift).
const hanken = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-mono-geist",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

// Lora renders on the landing zen section (and the Serif clock face), so it
// stays global; the app-only clock faces live in src/app/app/layout.tsx.
const lora = Lora({ variable: "--font-lora", subsets: ["latin"], display: "swap", preload: false });

export const metadata: Metadata = {
  // Absolute base for OG/twitter/canonical URLs — driven by NEXT_PUBLIC_SITE_URL.
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Wolfhour — Focus & Ambience",
    template: "%s · Wolfhour",
  },
  description:
    "A calm, free focus app — study timer, ambient sounds, and live animated backgrounds.",
  applicationName: "Wolfhour",
  appleWebApp: { capable: true, title: "Wolfhour", statusBarStyle: "black-translucent" },
};

export const viewport: Viewport = {
  themeColor: "#14101a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-motion="full"
      suppressHydrationWarning
      className={cn(
        "dark h-full font-sans",
        inter.variable,
        hanken.variable,
        geistMono.variable,
        geist.variable,
        lora.variable
      )}
    >
      <body className="min-h-full antialiased">
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT }} />
        <ThemeApplier />
        {children}
        <BrandMark />
        <LiquidCursor />
      </body>
    </html>
  );
}
