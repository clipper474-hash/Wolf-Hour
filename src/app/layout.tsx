import type { Metadata, Viewport } from "next";
import {
  Inter,
  Geist_Mono,
  Hanken_Grotesk,
  Geist,
  Onest,
  Lora,
  Caveat,
  Archivo,
  Space_Grotesk,
  Doto,
  Orbitron,
  Share_Tech_Mono,
} from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
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

// Clock & Font Style picker faces — only used inside /app, so don't preload
// them on the landing critical path (they still self-host, load on demand).
const onest = Onest({ variable: "--font-onest", subsets: ["latin"], display: "swap", preload: false });
const lora = Lora({ variable: "--font-lora", subsets: ["latin"], display: "swap", preload: false });
const caveat = Caveat({ variable: "--font-caveat", subsets: ["latin"], display: "swap", preload: false });
const archivo = Archivo({ variable: "--font-archivo", subsets: ["latin"], display: "swap", preload: false });
const spaceGrotesk = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});
// New clock faces (LED Matrix / Glitch / LCD) — app-only, no preload.
const doto = Doto({ variable: "--font-doto", subsets: ["latin"], weight: ["700"], display: "swap", preload: false });
const orbitron = Orbitron({ variable: "--font-orbitron", subsets: ["latin"], display: "swap", preload: false });
const shareTechMono = Share_Tech_Mono({ variable: "--font-lcd", subsets: ["latin"], weight: "400", display: "swap", preload: false });

export const metadata: Metadata = {
  // Absolute base for OG/twitter/canonical URLs. Swap when a custom domain lands.
  metadataBase: new URL("https://wolfhour.vercel.app"),
  title: {
    default: "Wolfhour — Focus & Ambience",
    template: "%s · Wolfhour",
  },
  description:
    "A calm, premium focus & ambience dashboard. Live animated backgrounds, soundscapes, and timers.",
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
        onest.variable,
        lora.variable,
        caveat.variable,
        archivo.variable,
        spaceGrotesk.variable,
        doto.variable,
        orbitron.variable,
        shareTechMono.variable
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
