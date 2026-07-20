import {
  CloudRain,
  CloudLightning,
  Waves,
  Trees,
  Bird,
  Wind,
  Droplets,
  Moon,
  Flame,
  Coffee,
  Keyboard,
  TrainFront,
  Radio,
  AudioLines,
  Fan,
  Music,
  AudioWaveform,
  Bell,
  Piano,
  Disc3,
  Podcast,
  Headphones,
  type LucideIcon,
} from "lucide-react";

export type SoundCategory =
  | "Nature"
  | "Places"
  | "Instrumental"
  | "Lo-Fi"
  | "Noise";

export type SynthKind =
  | "white"
  | "pink"
  | "brown"
  | "rain"
  | "ocean"
  | "wind"
  | "stream"
  | "fireplace"
  | "cafe"
  | "keyboard"
  | "pad"
  | "drone"
  | "chimes"
  | "piano"
  | "vinyl"
  | "tapehiss"
  | "lofikeys"
  | "thunder"
  | "forest"
  | "birds"
  | "night";

export type SoundDef = {
  id: string;
  label: string;
  category: SoundCategory;
  icon: LucideIcon;
} & (
  | { kind: "file"; src: string; synth?: never }
  | { kind: "synth"; synth: SynthKind; src?: never }
);

/**
 * Ambient soundscape catalog.
 *  • kind: "synth" → generated live in the Web Audio engine (original, seamless,
 *                    zero-asset, legally clean). Always playable.
 *  • kind: "file"  → loads a loop from `/public/sounds/*` (drop-in). The
 *                    genuinely recording-dependent sounds; greyed until present.
 */
export const SOUNDS: SoundDef[] = [
  // Nature — synthesised textures
  { id: "rain", label: "Rain", category: "Nature", icon: CloudRain, kind: "synth", synth: "rain" },
  { id: "waves", label: "Ocean", category: "Nature", icon: Waves, kind: "synth", synth: "ocean" },
  { id: "wind", label: "Wind", category: "Nature", icon: Wind, kind: "synth", synth: "wind" },
  { id: "stream", label: "Stream", category: "Nature", icon: Droplets, kind: "synth", synth: "stream" },
  // Nature — synthesised
  { id: "thunder", label: "Distant Thunder", category: "Nature", icon: CloudLightning, kind: "synth", synth: "thunder" },
  { id: "forest", label: "Forest Wind", category: "Nature", icon: Trees, kind: "synth", synth: "forest" },
  { id: "birds", label: "Dawn Chirps", category: "Nature", icon: Bird, kind: "synth", synth: "birds" },
  { id: "night", label: "Crickets", category: "Nature", icon: Moon, kind: "synth", synth: "night" },

  // Places
  { id: "fireplace", label: "Fireplace", category: "Places", icon: Flame, kind: "synth", synth: "fireplace" },
  { id: "cafe", label: "Café", category: "Places", icon: Coffee, kind: "synth", synth: "cafe" },
  { id: "keyboard", label: "Typing", category: "Places", icon: Keyboard, kind: "synth", synth: "keyboard" },
  { id: "train", label: "Train", category: "Places", icon: TrainFront, kind: "file", src: "/sounds/train.mp3" },

  // Instrumental — synthesised ambient voices
  { id: "pad", label: "Warm Pad", category: "Instrumental", icon: Music, kind: "synth", synth: "pad" },
  { id: "drone", label: "Deep Drone", category: "Instrumental", icon: AudioWaveform, kind: "synth", synth: "drone" },
  { id: "chimes", label: "Chimes", category: "Instrumental", icon: Bell, kind: "synth", synth: "chimes" },
  { id: "piano", label: "Dream Piano", category: "Instrumental", icon: Piano, kind: "synth", synth: "piano" },

  // Lo-Fi — synthesised textures
  { id: "vinyl", label: "Vinyl", category: "Lo-Fi", icon: Disc3, kind: "synth", synth: "vinyl" },
  { id: "tapehiss", label: "Tape Hiss", category: "Lo-Fi", icon: Podcast, kind: "synth", synth: "tapehiss" },
  { id: "lofikeys", label: "Lo-Fi Keys", category: "Lo-Fi", icon: Headphones, kind: "synth", synth: "lofikeys" },

  // Noise — synthesised, always available
  { id: "white", label: "White Noise", category: "Noise", icon: Radio, kind: "synth", synth: "white" },
  { id: "pink", label: "Pink Noise", category: "Noise", icon: AudioLines, kind: "synth", synth: "pink" },
  { id: "brown", label: "Brown Noise", category: "Noise", icon: Fan, kind: "synth", synth: "brown" },
];

export const soundById = (id: string): SoundDef | undefined =>
  SOUNDS.find((s) => s.id === id);

export const SOUND_CATEGORIES: SoundCategory[] = [
  "Nature",
  "Places",
  "Instrumental",
  "Lo-Fi",
  "Noise",
];
