import { Onest, Caveat, Archivo, Space_Grotesk, Doto, Orbitron, Share_Tech_Mono } from "next/font/google";
import { cn } from "@/lib/utils";

// Clock & Font Style picker faces — rendered only inside /app, so their
// @font-face CSS stays out of the marketing page bundle. All load on demand
// (preload: false), self-hosted by next/font.
const onest = Onest({ variable: "--font-onest", subsets: ["latin"], display: "swap", preload: false });
const caveat = Caveat({ variable: "--font-caveat", subsets: ["latin"], display: "swap", preload: false });
const archivo = Archivo({ variable: "--font-archivo", subsets: ["latin"], display: "swap", preload: false });
const spaceGrotesk = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});
const doto = Doto({ variable: "--font-doto", subsets: ["latin"], weight: ["700"], display: "swap", preload: false });
const orbitron = Orbitron({ variable: "--font-orbitron", subsets: ["latin"], display: "swap", preload: false });
const shareTechMono = Share_Tech_Mono({ variable: "--font-lcd", subsets: ["latin"], weight: "400", display: "swap", preload: false });

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{ display: "contents" }}
      className={cn(
        onest.variable,
        caveat.variable,
        archivo.variable,
        spaceGrotesk.variable,
        doto.variable,
        orbitron.variable,
        shareTechMono.variable
      )}
    >
      {children}
    </div>
  );
}
