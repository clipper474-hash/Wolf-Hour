import { Howl, Howler } from "howler";
import { SOUNDS, type SoundDef, type SynthKind } from "./sounds";
import type { Channel } from "./sound-store";

/**
 * Imperative audio engine. Reconciles mixer store state into live audio:
 *  • synth sounds → generated live with Web Audio (filtered noise + LFOs), no
 *    asset needed. Original, seamless, legally clean.
 *  • file sounds  → Howler Howl (looped, fade in/out). Greys out on 404.
 *
 * A single hidden <SoundEngine/> mounted at the app root drives reconcile() so
 * playback continues while the mixer panel is closed.
 */

const FADE_MS = 420;
const TC = FADE_MS / 3000; // setTargetAtTime time-constant

type FileNode = { howl: Howl; error: boolean; target: number };
type SynthNode = {
  output: GainNode; // the per-channel volume node (reconcile drives this)
  base: number; // perceived-loudness scale for this texture
  started: boolean;
  start: () => void;
};

const files = new Map<string, FileNode>();
const synths = new Map<string, SynthNode>();

let ctx: AudioContext | null = null;
let masterVol = 0.8;
const errored = new Set<string>();
const errorListeners = new Set<() => void>();
const lastChannels = new Map<string, Channel>();

function notifyError() {
  for (const fn of errorListeners) fn();
}

/** Subscribe to "a file failed to load" so the UI can grey it out. */
export function onSoundError(fn: () => void): () => void {
  errorListeners.add(fn);
  return () => errorListeners.delete(fn);
}
export function isUnavailable(id: string): boolean {
  return errored.has(id);
}

/**
 * Soft two-note chime for timer completion. Quiet by design and scaled by the
 * master volume so it never startles over (or under) a running soundscape.
 */
export function playChime() {
  const audio = getCtx();
  if (!audio) return;
  const t = audio.currentTime;
  [880, 1174.66].forEach((freq, i) => {
    const osc = audio.createOscillator();
    const gain = audio.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    const start = t + i * 0.18;
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(0.12 * masterVol, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.9);
    osc.connect(gain).connect(audio.destination);
    osc.start(start);
    osc.stop(start + 1);
  });
}

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    if (process.env.NODE_ENV !== "production") {
      (window as unknown as { __polarisCtx?: AudioContext }).__polarisCtx = ctx;
    }
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

// ---- noise generation ------------------------------------------------------
function fillNoise(out: Float32Array, kind: "white" | "pink" | "brown") {
  const len = out.length;
  if (kind === "white") {
    for (let i = 0; i < len; i++) out[i] = Math.random() * 2 - 1;
  } else if (kind === "pink") {
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < len; i++) {
      const w = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + w * 0.0555179;
      b1 = 0.99332 * b1 + w * 0.0750759;
      b2 = 0.969 * b2 + w * 0.153852;
      b3 = 0.8665 * b3 + w * 0.3104856;
      b4 = 0.55 * b4 + w * 0.5329522;
      b5 = -0.7616 * b5 - w * 0.016898;
      out[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * 0.5362) * 0.11;
      b6 = w * 0.115926;
    }
  } else {
    let last = 0;
    for (let i = 0; i < len; i++) {
      const w = Math.random() * 2 - 1;
      last = (last + 0.02 * w) / 1.02;
      out[i] = last * 3.5;
    }
  }
}

function noiseSource(
  audio: AudioContext,
  kind: "white" | "pink" | "brown",
  seconds = 3
): AudioBufferSourceNode {
  const buffer = audio.createBuffer(1, audio.sampleRate * seconds, audio.sampleRate);
  fillNoise(buffer.getChannelData(0), kind);
  const src = audio.createBufferSource();
  src.buffer = buffer;
  src.loop = true;
  return src;
}

// LFO helper: modulate `param` around its base by ±amount at `freq` Hz.
function lfo(
  audio: AudioContext,
  freq: number,
  amount: number,
  param: AudioParam,
  type: OscillatorType = "sine"
): OscillatorNode {
  const osc = audio.createOscillator();
  osc.type = type;
  osc.frequency.value = freq;
  const g = audio.createGain();
  g.gain.value = amount;
  osc.connect(g).connect(param);
  return osc;
}

// ---- synth builders --------------------------------------------------------
function buildSynth(audio: AudioContext, def: SoundDef & { kind: "synth" }): SynthNode {
  const output = audio.createGain();
  output.gain.value = 0;
  output.connect(audio.destination);
  const oscs: OscillatorNode[] = [];
  const srcs: AudioBufferSourceNode[] = [];
  let extraStart: (() => void) | null = null;

  const k: SynthKind = def.synth;
  let base = 0.5;

  if (k === "white" || k === "pink" || k === "brown") {
    const src = noiseSource(audio, k, 2);
    src.connect(output);
    srcs.push(src);
    base = 0.5;
  } else if (k === "rain") {
    // Two beds per the layered-rain recipe: soft pink "body" below, and the
    // 4–8 kHz hiss that actually reads as rain, kept smooth (soft, not harsh).
    const body = noiseSource(audio, "pink", 3);
    const blp = audio.createBiquadFilter();
    blp.type = "lowpass";
    blp.frequency.value = 2000;
    const bodyG = audio.createGain();
    bodyG.gain.value = 0.6;
    body.connect(blp).connect(bodyG).connect(output);
    const hiss = noiseSource(audio, "white", 3);
    const hbp = audio.createBiquadFilter();
    hbp.type = "bandpass";
    hbp.frequency.value = 5500;
    hbp.Q.value = 0.35; // wide 4–8 kHz band
    const hissG = audio.createGain();
    hissG.gain.value = 0.5;
    hiss.connect(hbp).connect(hissG).connect(output);
    oscs.push(lfo(audio, 0.13, 0.1, hissG.gain)); // slow density drift
    srcs.push(body, hiss);
    base = 0.5;
    // …plus pitched droplet "bloips" (rising sine chirps — the bubble sound)
    extraStart = () => startDrips(audio, output);
  } else if (k === "ocean") {
    const src = noiseSource(audio, "brown", 5);
    const lp = audio.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 650;
    lp.Q.value = 0.4;
    const swell = audio.createGain();
    swell.gain.value = 0.82; // high floor so waves never fall to silence
    src.connect(lp).connect(swell).connect(output);
    oscs.push(lfo(audio, 0.1, 0.15, swell.gain)); // gentle swell around the floor
    oscs.push(lfo(audio, 0.1, 190, lp.frequency));
    srcs.push(src);
    base = 0.82;
    // periodic wave breaks — a hissy wash rolling over the low swell
    extraStart = () => startWaves(audio, output);
  } else if (k === "wind") {
    const src = noiseSource(audio, "brown", 5);
    const lp = audio.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 640;
    lp.Q.value = 1.2;
    const gust = audio.createGain();
    gust.gain.value = 0.55;
    src.connect(lp).connect(gust).connect(output);
    oscs.push(lfo(audio, 0.11, 0.35, gust.gain)); // gusts
    oscs.push(lfo(audio, 0.07, 420, lp.frequency));
    srcs.push(src);
    // the "air": breathy mid band that swells with its own slow cycle
    const air = noiseSource(audio, "white", 4);
    const abp = audio.createBiquadFilter();
    abp.type = "bandpass";
    abp.frequency.value = 1100;
    abp.Q.value = 0.8;
    const airG = audio.createGain();
    airG.gain.value = 0.07;
    air.connect(abp).connect(airG).connect(output);
    oscs.push(lfo(audio, 0.13, 0.05, airG.gain));
    oscs.push(lfo(audio, 0.09, 500, abp.frequency));
    srcs.push(air);
    base = 0.6;
  } else if (k === "stream") {
    const src = noiseSource(audio, "white", 4);
    const bp = audio.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = 1600;
    bp.Q.value = 0.7;
    const bub = audio.createGain();
    bub.gain.value = 0.85;
    src.connect(bp).connect(bub).connect(output);
    oscs.push(lfo(audio, 5.5, 0.14, bub.gain)); // shallow bubbling
    oscs.push(lfo(audio, 0.8, 500, bp.frequency));
    srcs.push(src);
    base = 0.5;
  } else if (k === "fireplace") {
    // Warm low rumble bed…
    const src = noiseSource(audio, "brown", 4);
    const lp = audio.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 380;
    const bed = audio.createGain();
    bed.gain.value = 0.7;
    src.connect(lp).connect(bed).connect(output);
    oscs.push(lfo(audio, 0.4, 0.2, bed.gain));
    srcs.push(src);
    base = 0.75;
    // …plus scheduled crackle pops.
    extraStart = () => startCrackle(audio, output);
  } else if (k === "cafe") {
    const src = noiseSource(audio, "brown", 5);
    const bp = audio.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = 500;
    bp.Q.value = 0.5;
    const murmur = audio.createGain();
    murmur.gain.value = 0.95;
    src.connect(bp).connect(murmur).connect(output);
    const src2 = noiseSource(audio, "white", 4);
    const bp2 = audio.createBiquadFilter();
    bp2.type = "bandpass";
    bp2.frequency.value = 1900;
    bp2.Q.value = 0.8;
    const chat = audio.createGain();
    chat.gain.value = 0.045;
    src2.connect(bp2).connect(chat).connect(output);
    oscs.push(lfo(audio, 0.16, 0.28, murmur.gain));
    oscs.push(lfo(audio, 0.22, 180, bp.frequency));
    srcs.push(src, src2);
    base = 0.62;
    // sparse cup/saucer clinks — the "things" that make a room a café
    extraStart = () =>
      startCrackle(audio, output, {
        minGap: 1800,
        rndGap: 6500,
        peakLo: 0.05,
        peakHi: 0.14,
        hpLo: 2400,
        hpHi: 4200,
      });
  } else if (k === "keyboard") {
    base = 0.85;
    extraStart = () => startTyping(audio, output);
  } else if (k === "pad") {
    const lp = audio.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 900;
    lp.Q.value = 0.3;
    const chord = audio.createGain();
    chord.gain.value = 0.5;
    lp.connect(chord).connect(output);
    const notes = [110, 164.81, 220, 329.63]; // A2 · E3 · A3 · E4 — open, calm
    notes.forEach((f, i) => {
      for (const cents of [-6, 6]) {
        const o = audio.createOscillator();
        o.type = i < 2 ? "triangle" : "sine";
        o.frequency.value = f;
        o.detune.value = cents;
        const g = audio.createGain();
        g.gain.value = 0.18 / (i * 0.35 + 1);
        o.connect(g).connect(lp);
        oscs.push(o);
      }
    });
    oscs.push(lfo(audio, 0.05, 260, lp.frequency));
    base = 0.55;
  } else if (k === "drone") {
    const lp = audio.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 420;
    const g0 = audio.createGain();
    g0.gain.value = 0.85;
    lp.connect(g0).connect(output);
    const voices: [number, number][] = [[55, 0], [82.41, 0], [110, 0], [55, 5]];
    for (const [f, d] of voices) {
      const o = audio.createOscillator();
      o.type = "sine";
      o.frequency.value = f;
      o.detune.value = d;
      const g = audio.createGain();
      g.gain.value = 0.28;
      o.connect(g).connect(lp);
      oscs.push(o);
    }
    oscs.push(lfo(audio, 0.05, 0.12, g0.gain));
    base = 0.6;
  } else if (k === "chimes") {
    base = 0.85;
    extraStart = () =>
      startTones(audio, output, {
        scale: [329.63, 392, 440, 523.25, 587.33, 659.25, 783.99],
        minGap: 1300,
        rndGap: 3200,
        chordChance: 0.18,
        tone: {
          type: "sine",
          attack: 0.005,
          decay: 2.6,
          peak: 0.5,
          partials: [[1, 1], [2.01, 0.5], [3.03, 0.24], [4.7, 0.1]],
        },
      });
  } else if (k === "piano") {
    base = 0.9;
    extraStart = () =>
      startTones(audio, output, {
        scale: [220, 261.63, 293.66, 329.63, 392, 440, 523.25],
        minGap: 1800,
        rndGap: 3400,
        chordChance: 0.28,
        lowpass: 2600,
        tone: {
          type: "triangle",
          attack: 0.008,
          decay: 1.9,
          peak: 0.5,
          partials: [[1, 1], [2, 0.32], [3, 0.12]],
        },
      });
  } else if (k === "vinyl") {
    // Warm low bed + sparse pops/clicks — that lo-fi record surface.
    const src = noiseSource(audio, "brown", 4);
    const lp = audio.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 220;
    const bed = audio.createGain();
    bed.gain.value = 0.25;
    src.connect(lp).connect(bed).connect(output);
    srcs.push(src);
    base = 0.8;
    extraStart = () =>
      startCrackle(audio, output, {
        minGap: 25,
        rndGap: 120,
        peakLo: 0.12,
        peakHi: 0.45,
        hpLo: 1000,
        hpHi: 2200,
      });
  } else if (k === "tapehiss") {
    const src = noiseSource(audio, "pink", 3);
    const hp = audio.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = 1400;
    const lp = audio.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 8000;
    const g = audio.createGain();
    g.gain.value = 0.5;
    src.connect(hp).connect(lp).connect(g).connect(output);
    oscs.push(lfo(audio, 0.3, 0.06, g.gain)); // subtle wow/flutter
    srcs.push(src);
    base = 0.4;
  } else if (k === "lofikeys") {
    base = 0.9;
    extraStart = () =>
      startTones(audio, output, {
        scale: [220, 261.63, 293.66, 349.23, 392, 440],
        minGap: 2000,
        rndGap: 3600,
        chordChance: 0.5,
        lowpass: 1400,
        detune: 12, // warm + a touch out of tune
        tone: {
          type: "triangle",
          attack: 0.02,
          decay: 2.2,
          peak: 0.45,
          partials: [[1, 1], [2, 0.25], [3, 0.08]],
        },
      });
  } else if (k === "thunder") {
    // Soft rain-ish bed + scheduled distant rumbles.
    const src = noiseSource(audio, "white", 3);
    const hp = audio.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = 1400;
    const rainG = audio.createGain();
    rainG.gain.value = 0.18;
    src.connect(hp).connect(rainG).connect(output);
    srcs.push(src);
    base = 0.7;
    extraStart = () => startThunder(audio, output);
  } else if (k === "birds") {
    base = 0.8;
    extraStart = () => startBirds(audio, output, { minGap: 700, rndGap: 2600 });
  } else if (k === "forest") {
    // The whole clearing: trees (wind bed) + a brook + birdsong.
    const src = noiseSource(audio, "brown", 5);
    const lp = audio.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 480;
    lp.Q.value = 1;
    const windG = audio.createGain();
    windG.gain.value = 0.5;
    src.connect(lp).connect(windG).connect(output);
    oscs.push(lfo(audio, 0.09, 0.28, windG.gain));
    oscs.push(lfo(audio, 0.06, 260, lp.frequency));
    srcs.push(src);
    // brook: quiet bubbling water off to one side
    const water = noiseSource(audio, "white", 4);
    const wbp = audio.createBiquadFilter();
    wbp.type = "bandpass";
    wbp.frequency.value = 1500;
    wbp.Q.value = 0.8;
    const brook = audio.createGain();
    brook.gain.value = 0.16;
    water.connect(wbp).connect(brook).connect(output);
    oscs.push(lfo(audio, 5.2, 0.04, brook.gain)); // bubbling
    oscs.push(lfo(audio, 0.7, 380, wbp.frequency));
    srcs.push(water);
    base = 0.6;
    extraStart = () => startBirds(audio, output, { minGap: 900, rndGap: 2800, gain: 0.6 });
  } else if (k === "night") {
    // Low night pad + a shimmering cricket chorus.
    const pad = noiseSource(audio, "brown", 4);
    const plp = audio.createBiquadFilter();
    plp.type = "lowpass";
    plp.frequency.value = 240;
    const padG = audio.createGain();
    padG.gain.value = 0.25;
    pad.connect(plp).connect(padG).connect(output);
    srcs.push(pad);
    // crickets: two detuned high tones, trilled fast by a tremolo gain
    const cricketG = audio.createGain();
    cricketG.gain.value = 0.0;
    const bp = audio.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = 4600;
    bp.Q.value = 8;
    cricketG.connect(bp).connect(output);
    for (const f of [4600, 4630]) {
      const o = audio.createOscillator();
      o.type = "square";
      o.frequency.value = f;
      const og = audio.createGain();
      og.gain.value = 0.09;
      o.connect(og).connect(cricketG);
      oscs.push(o);
    }
    // trill: 24 Hz on/off shaping of the cricket gain
    const trill = audio.createOscillator();
    trill.type = "sine";
    trill.frequency.value = 24;
    const trillAmt = audio.createGain();
    trillAmt.gain.value = 0.5;
    const trillBias = audio.createConstantSource();
    trillBias.offset.value = 0.5;
    trill.connect(trillAmt).connect(cricketG.gain);
    trillBias.connect(cricketG.gain);
    oscs.push(trill);
    extraStart = () => trillBias.start(0);
    base = 0.68;
  }

  const start = () => {
    for (const s of srcs) s.start(0);
    for (const o of oscs) o.start(0);
    extraStart?.();
  };

  return { output, base, started: false, start };
}

// Crackle: short enveloped noise bursts at random intervals (fireplace pops /
// vinyl surface). Gated by the channel's output gain, so it costs nothing while
// the channel is muted.
type CrackleOpts = {
  minGap: number;
  rndGap: number;
  peakLo: number;
  peakHi: number;
  hpLo: number;
  hpHi: number;
};
const FIRE_CRACKLE: CrackleOpts = {
  minGap: 45,
  rndGap: 260,
  peakLo: 0.4,
  peakHi: 1.0,
  hpLo: 1800,
  hpHi: 3300,
};
function startCrackle(audio: AudioContext, out: GainNode, opts?: Partial<CrackleOpts>) {
  const o = { ...FIRE_CRACKLE, ...opts };
  let alive = true;
  const pop = () => {
    if (!alive) return;
    if (out.gain.value > 0.002) {
      const dur = 0.015 + Math.random() * 0.05;
      const b = audio.createBuffer(1, Math.ceil(audio.sampleRate * dur), audio.sampleRate);
      fillNoise(b.getChannelData(0), "white");
      const src = audio.createBufferSource();
      src.buffer = b;
      const hp = audio.createBiquadFilter();
      hp.type = "highpass";
      hp.frequency.value = o.hpLo + Math.random() * (o.hpHi - o.hpLo);
      const env = audio.createGain();
      const now = audio.currentTime;
      const peak = o.peakLo + Math.random() * (o.peakHi - o.peakLo);
      env.gain.setValueAtTime(0.0001, now);
      env.gain.exponentialRampToValueAtTime(peak, now + 0.004);
      env.gain.exponentialRampToValueAtTime(0.0001, now + dur);
      src.connect(hp).connect(env).connect(out);
      src.start(now);
      src.stop(now + dur + 0.02);
    }
    window.setTimeout(pop, o.minGap + Math.random() * o.rndGap);
  };
  pop();
  return () => {
    alive = false;
  };
}

// Mechanical keyboard: scheduled key clicks (bright transient + low thock) in a
// loose typing rhythm with occasional pauses.
function startTyping(audio: AudioContext, out: GainNode) {
  let alive = true;
  const key = (t: number) => {
    const dur = 0.012 + Math.random() * 0.02;
    const b = audio.createBuffer(1, Math.ceil(audio.sampleRate * dur), audio.sampleRate);
    fillNoise(b.getChannelData(0), "white");
    const src = audio.createBufferSource();
    src.buffer = b;
    const bp = audio.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = 2200 + Math.random() * 1600;
    bp.Q.value = 0.9;
    const env = audio.createGain();
    env.gain.setValueAtTime(0.0001, t);
    env.gain.exponentialRampToValueAtTime(0.4 + Math.random() * 0.5, t + 0.002);
    env.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(bp).connect(env).connect(out);
    src.start(t);
    src.stop(t + dur + 0.02);
    const o = audio.createOscillator();
    o.type = "sine";
    o.frequency.value = 130 + Math.random() * 70;
    const oe = audio.createGain();
    oe.gain.setValueAtTime(0.0001, t);
    oe.gain.exponentialRampToValueAtTime(0.22, t + 0.003);
    oe.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
    o.connect(oe).connect(out);
    o.start(t);
    o.stop(t + 0.07);
  };
  const step = () => {
    if (!alive) return;
    if (out.gain.value > 0.002) key(audio.currentTime);
    let gap = 70 + Math.random() * 130;
    if (Math.random() < 0.12) gap += 300 + Math.random() * 700; // thinking pause
    window.setTimeout(step, gap);
  };
  step();
  return () => {
    alive = false;
  };
}

// Tonal note scheduler for the Instrumental voices (chimes / piano / lo-fi keys).
type ToneCfg = {
  scale: number[];
  minGap: number;
  rndGap: number;
  chordChance: number;
  lowpass?: number;
  detune?: number;
  tone: {
    type: OscillatorType;
    attack: number;
    decay: number;
    peak: number;
    partials: [number, number][];
  };
};
function playTone(audio: AudioContext, out: GainNode, freq: number, cfg: ToneCfg) {
  const t = audio.currentTime;
  let dest: AudioNode = out;
  if (cfg.lowpass) {
    const lp = audio.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = cfg.lowpass;
    lp.connect(out);
    dest = lp;
  }
  const amp = audio.createGain();
  amp.gain.setValueAtTime(0.0001, t);
  amp.gain.exponentialRampToValueAtTime(cfg.tone.peak, t + cfg.tone.attack);
  amp.gain.exponentialRampToValueAtTime(0.0001, t + cfg.tone.decay);
  amp.connect(dest);
  const stopAt = t + cfg.tone.decay + 0.1;
  for (const [mult, g] of cfg.tone.partials) {
    const o = audio.createOscillator();
    o.type = cfg.tone.type;
    o.frequency.value = freq * mult;
    if (cfg.detune) o.detune.value = (Math.random() * 2 - 1) * cfg.detune;
    const pg = audio.createGain();
    pg.gain.value = g;
    o.connect(pg).connect(amp);
    o.start(t);
    o.stop(stopAt);
  }
}
function startTones(audio: AudioContext, out: GainNode, cfg: ToneCfg) {
  let alive = true;
  const pick = () => cfg.scale[(Math.random() * cfg.scale.length) | 0];
  const step = () => {
    if (!alive) return;
    if (out.gain.value > 0.002) {
      playTone(audio, out, pick(), cfg);
      if (Math.random() < cfg.chordChance) playTone(audio, out, pick(), cfg);
    }
    window.setTimeout(step, cfg.minGap + Math.random() * cfg.rndGap);
  };
  step();
  return () => {
    alive = false;
  };
}

// Birdsong: short pitched chirps (2–4 notes) at random intervals.
function startBirds(
  audio: AudioContext,
  out: GainNode,
  opts?: { minGap?: number; rndGap?: number; gain?: number }
) {
  const o = { minGap: 500, rndGap: 2000, gain: 1, ...opts };
  let alive = true;
  const chirp = (t: number) => {
    const notes = 2 + Math.floor(Math.random() * 3);
    let tt = t;
    for (let i = 0; i < notes; i++) {
      const dur = 0.05 + Math.random() * 0.08;
      const osc = audio.createOscillator();
      osc.type = "sine";
      const f0 = 2200 + Math.random() * 1800;
      osc.frequency.setValueAtTime(f0, tt);
      osc.frequency.linearRampToValueAtTime(f0 * (1.2 + Math.random() * 0.4), tt + dur * 0.5);
      osc.frequency.linearRampToValueAtTime(f0 * 0.9, tt + dur);
      const env = audio.createGain();
      env.gain.setValueAtTime(0.0001, tt);
      env.gain.exponentialRampToValueAtTime(0.3 * o.gain, tt + 0.01);
      env.gain.exponentialRampToValueAtTime(0.0001, tt + dur);
      osc.connect(env).connect(out);
      osc.start(tt);
      osc.stop(tt + dur + 0.02);
      tt += dur + 0.02 + Math.random() * 0.05;
    }
  };
  const step = () => {
    if (!alive) return;
    if (out.gain.value > 0.002) chirp(audio.currentTime);
    window.setTimeout(step, o.minGap + Math.random() * o.rndGap);
  };
  step();
  return () => {
    alive = false;
  };
}

// Raindrops: short sine "bloips" with a rising pitch envelope — the bubble
// resonance a drop makes hitting water. Randomized pitch/level/timing.
function startDrips(audio: AudioContext, out: GainNode) {
  let alive = true;
  const drip = (t: number) => {
    const f0 = 900 + Math.random() * 1100;
    const dur = 0.03 + Math.random() * 0.04;
    const o = audio.createOscillator();
    o.type = "sine";
    o.frequency.setValueAtTime(f0, t);
    o.frequency.exponentialRampToValueAtTime(f0 * 1.45, t + dur); // bubble rise
    const env = audio.createGain();
    env.gain.setValueAtTime(0.0001, t);
    env.gain.exponentialRampToValueAtTime(0.09 + Math.random() * 0.09, t + 0.004);
    env.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(env).connect(out);
    o.start(t);
    o.stop(t + dur + 0.02);
  };
  const step = () => {
    if (!alive) return;
    if (out.gain.value > 0.002) drip(audio.currentTime);
    window.setTimeout(step, 90 + Math.random() * 320);
  };
  step();
  return () => {
    alive = false;
  };
}

// Waves: a breaking wave every 7–15s — white-noise wash that swells in,
// crests bright, and rolls off darker (filter sweeps down as it fades).
function startWaves(audio: AudioContext, out: GainNode) {
  let alive = true;
  const wave = (t: number) => {
    const dur = 3.5 + Math.random() * 2.5;
    const b = audio.createBuffer(1, Math.ceil(audio.sampleRate * dur), audio.sampleRate);
    fillNoise(b.getChannelData(0), "white");
    const src = audio.createBufferSource();
    src.buffer = b;
    const lp = audio.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.setValueAtTime(900, t);
    lp.frequency.linearRampToValueAtTime(2600, t + dur * 0.35); // crest brightens
    lp.frequency.linearRampToValueAtTime(500, t + dur); // rolls off dark
    const env = audio.createGain();
    const peak = 0.16 + Math.random() * 0.1;
    env.gain.setValueAtTime(0.0001, t);
    env.gain.exponentialRampToValueAtTime(peak, t + dur * 0.35);
    env.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(lp).connect(env).connect(out);
    src.start(t);
    src.stop(t + dur + 0.1);
  };
  const step = () => {
    if (!alive) return;
    if (out.gain.value > 0.002) wave(audio.currentTime);
    window.setTimeout(step, 7000 + Math.random() * 8000);
  };
  step();
  return () => {
    alive = false;
  };
}

// Thunder: real strikes. Big ones open with a bright crack, then a long
// rumble whose filter sweeps down as it dies — the "rolling away" sound.
// Distant ones are rumble only.
function startThunder(audio: AudioContext, out: GainNode) {
  let alive = true;
  const strike = (t: number) => {
    const big = Math.random() < 0.45;
    if (big) {
      // the crack: short bright noise rip
      const cd = 0.25 + Math.random() * 0.2;
      const cb = audio.createBuffer(1, Math.ceil(audio.sampleRate * cd), audio.sampleRate);
      fillNoise(cb.getChannelData(0), "white");
      const crack = audio.createBufferSource();
      crack.buffer = cb;
      const cbp = audio.createBiquadFilter();
      cbp.type = "bandpass";
      cbp.frequency.value = 1400 + Math.random() * 1400;
      cbp.Q.value = 0.6;
      const ce = audio.createGain();
      ce.gain.setValueAtTime(0.0001, t);
      ce.gain.exponentialRampToValueAtTime(1.0 + Math.random() * 0.3, t + 0.012);
      ce.gain.exponentialRampToValueAtTime(0.0001, t + cd);
      crack.connect(cbp).connect(ce).connect(out);
      crack.start(t);
      crack.stop(t + cd + 0.05);
    }
    // the rumble: long brown-noise roll, filter sweeping dark as it fades
    const dur = big ? 3.5 + Math.random() * 3 : 1.8 + Math.random() * 2;
    const b = audio.createBuffer(1, Math.ceil(audio.sampleRate * dur), audio.sampleRate);
    fillNoise(b.getChannelData(0), "brown");
    const src = audio.createBufferSource();
    src.buffer = b;
    const lp = audio.createBiquadFilter();
    lp.type = "lowpass";
    const f0 = big ? 520 : 260;
    lp.frequency.setValueAtTime(f0, t);
    lp.frequency.exponentialRampToValueAtTime(70, t + dur); // rolls away
    const env = audio.createGain();
    const peak = big ? 2.2 + Math.random() * 0.5 : 1.1 + Math.random() * 0.5;
    const attack = big ? 0.04 : 0.25 + Math.random() * 0.3;
    env.gain.setValueAtTime(0.0001, t);
    env.gain.exponentialRampToValueAtTime(peak, t + attack);
    // rolling decay: the rumble re-swells once or twice as it dies away
    // (reflections smearing) instead of one straight fade
    const dip1 = t + dur * (0.35 + Math.random() * 0.1);
    const swell = t + dur * (0.55 + Math.random() * 0.1);
    env.gain.exponentialRampToValueAtTime(peak * 0.3, dip1);
    env.gain.exponentialRampToValueAtTime(peak * (0.5 + Math.random() * 0.2), swell);
    env.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(lp).connect(env).connect(out);
    src.start(t);
    src.stop(t + dur + 0.1);
  };
  const step = () => {
    if (!alive) return;
    if (out.gain.value > 0.002) strike(audio.currentTime);
    window.setTimeout(step, 6000 + Math.random() * 10000);
  };
  // don't leave the listener waiting 6-16s: first strike lands ~1.5s in
  window.setTimeout(() => {
    if (alive && out.gain.value > 0.002) strike(audio.currentTime);
  }, 1500);
  window.setTimeout(step, 6000 + Math.random() * 10000);
  return () => {
    alive = false;
  };
}

function ensureSynth(def: SoundDef & { kind: "synth" }): SynthNode | null {
  const existing = synths.get(def.id);
  if (existing) return existing;
  const audio = getCtx();
  if (!audio) return null;
  const node = buildSynth(audio, def);
  synths.set(def.id, node);
  if (process.env.NODE_ENV !== "production") {
    (window as unknown as { __polarisSynth?: typeof synths }).__polarisSynth = synths;
  }
  return node;
}

// ---- file sounds -----------------------------------------------------------
function ensureFile(def: SoundDef & { kind: "file" }): FileNode {
  const existing = files.get(def.id);
  if (existing) return existing;
  const node: FileNode = { howl: null as unknown as Howl, error: false, target: 0 };
  node.howl = new Howl({
    src: [def.src],
    loop: true,
    volume: 0,
    html5: true,
    onloaderror: () => {
      node.error = true;
      errored.add(def.id);
      notifyError();
    },
    onplayerror: () => {
      node.howl.once("unlock", () => {
        if (node.target > 0) node.howl.play();
      });
    },
  });
  files.set(def.id, node);
  return node;
}

// ---- public API ------------------------------------------------------------
export function setMaster(v: number) {
  masterVol = v;
  Howler.volume(v);
  const audio = ctx;
  if (!audio) return;
  for (const [id, n] of synths) {
    const ch = lastChannels.get(id);
    const target = ch?.active ? ch.volume * masterVol * n.base : 0;
    n.output.gain.setTargetAtTime(target, audio.currentTime, TC);
  }
}

/** Reconcile the full mixer state into live audio nodes. */
export function reconcile(master: number, channels: Record<string, Channel>) {
  if (typeof window === "undefined") return;
  masterVol = master;
  Howler.volume(master);

  for (const def of SOUNDS) {
    const ch: Channel = channels[def.id] ?? { volume: 0.6, active: false };
    lastChannels.set(def.id, ch);
    const on = ch.active && ch.volume > 0;

    if (def.kind === "synth") {
      if (!on && !synths.has(def.id)) continue; // don't build until first used
      const node = ensureSynth(def);
      if (!node) continue;
      const audio = getCtx()!;
      if (on && !node.started) {
        node.start();
        node.started = true;
      }
      const target = on ? ch.volume * masterVol * node.base : 0;
      node.output.gain.setTargetAtTime(target, audio.currentTime, TC);
    } else {
      if (!on && !files.has(def.id)) continue;
      const node = ensureFile(def);
      if (node.error) continue;
      node.target = on ? ch.volume : 0;
      if (on) {
        if (!node.howl.playing()) node.howl.play();
        node.howl.fade(node.howl.volume(), ch.volume, FADE_MS);
      } else if (node.howl.playing()) {
        node.howl.fade(node.howl.volume(), 0, FADE_MS);
        window.setTimeout(() => {
          if (node.target === 0 && node.howl.playing()) node.howl.pause();
        }, FADE_MS + 40);
      }
    }
  }
}

/** Diagnostic tap for /soundcheck: the live per-channel output node. */
export function _synthNode(id: string): { output: GainNode } | null {
  return synths.get(id) ?? null;
}

/** First user gesture — unlock/resume the audio context (autoplay policy). */
export function unlockAudio() {
  const audio = getCtx();
  if (audio && audio.state === "suspended") void audio.resume();
}
