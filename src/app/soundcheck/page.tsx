"use client";

import { useState } from "react";
import { SOUNDS } from "@/lib/sounds";
import { reconcile, unlockAudio, _synthNode } from "@/lib/audio-engine";

/** Dev diagnostic: plays every synth sound in isolation for a few seconds,
 *  taps its output through an AnalyserNode, and reports objective metrics —
 *  average level, peak, dynamics ratio, transient events, spectral centroid.
 *  Not linked anywhere; noindex lives in metadata of the layout defaults. */

type Row = {
  id: string;
  label: string;
  rms: number;
  peak: number;
  dyn: number;
  transients: number;
  centroid: number;
};

const WINDOW_MS = 7000;
const FRAME_MS = 50;

async function measure(id: string): Promise<Row | null> {
  reconcile(0.8, { [id]: { volume: 0.8, active: true } });
  await new Promise((r) => setTimeout(r, 350)); // let fade-in land
  const node = _synthNode(id);
  if (!node) return null;
  const ctx = node.output.context as AudioContext;
  const an = ctx.createAnalyser();
  an.fftSize = 2048;
  node.output.connect(an);

  const td = new Uint8Array(an.fftSize);
  const fd = new Float32Array(an.frequencyBinCount);
  const frames: number[] = [];
  let peak = 0;
  let centroidSum = 0;
  let centroidN = 0;

  const t0 = performance.now();
  while (performance.now() - t0 < WINDOW_MS) {
    an.getByteTimeDomainData(td);
    let sum = 0;
    let framePeak = 0;
    for (let i = 0; i < td.length; i++) {
      const v = (td[i] - 128) / 128;
      sum += v * v;
      const a = Math.abs(v);
      if (a > framePeak) framePeak = a;
    }
    frames.push(Math.sqrt(sum / td.length));
    if (framePeak > peak) peak = framePeak;

    if (frames.length % 20 === 0) {
      an.getFloatFrequencyData(fd);
      let num = 0;
      let den = 0;
      const hzPerBin = ctx.sampleRate / an.fftSize;
      for (let i = 1; i < fd.length; i++) {
        const mag = Math.pow(10, fd[i] / 20);
        num += mag * i * hzPerBin;
        den += mag;
      }
      if (den > 0) {
        centroidSum += num / den;
        centroidN++;
      }
    }
    await new Promise((r) => setTimeout(r, FRAME_MS));
  }

  node.output.disconnect(an);
  reconcile(0.8, { [id]: { volume: 0.8, active: false } });
  await new Promise((r) => setTimeout(r, 500)); // fade out before next

  const sorted = [...frames].sort((a, b) => a - b);
  const median = sorted[Math.floor(sorted.length / 2)] || 0.0001;
  const rms = frames.reduce((a, b) => a + b, 0) / frames.length;
  // transient = frame jumping well above the running texture
  let transients = 0;
  let above = false;
  for (const f of frames) {
    const hot = f > Math.max(median * 2.2, median + 0.02);
    if (hot && !above) transients++;
    above = hot;
  }
  return {
    id,
    label: SOUNDS.find((s) => s.id === id)?.label ?? id,
    rms,
    peak,
    dyn: rms > 0 ? peak / rms : 0,
    transients,
    centroid: centroidN ? centroidSum / centroidN : 0,
  };
}

export default function SoundCheck() {
  const [rows, setRows] = useState<Row[]>([]);
  const [running, setRunning] = useState<string | null>(null);

  const run = async () => {
    unlockAudio();
    setRows([]);
    for (const s of SOUNDS) {
      if (s.kind !== "synth") continue;
      setRunning(s.id);
      const row = await measure(s.id);
      if (row) setRows((prev) => [...prev, row]);
    }
    setRunning(null);
  };

  return (
    <main style={{ minHeight: "100dvh", overflowY: "auto", background: "#111", color: "#eee", fontFamily: "monospace", padding: 24 }}>
      <h1>soundcheck</h1>
      <button onClick={run} style={{ padding: "10px 20px", margin: "12px 0", cursor: "pointer" }}>
        {running ? `measuring ${running}…` : "Run check (≈2.5 min)"}
      </button>
      <table style={{ borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr>
            {["sound", "rms", "peak", "dyn", "events/7s", "centroid Hz"].map((h) => (
              <th key={h} style={{ border: "1px solid #444", padding: "4px 10px", textAlign: "left" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody id="results">
          {rows.map((r) => (
            <tr key={r.id}>
              <td style={{ border: "1px solid #444", padding: "4px 10px" }}>{r.id} ({r.label})</td>
              <td style={{ border: "1px solid #444", padding: "4px 10px" }}>{r.rms.toFixed(3)}</td>
              <td style={{ border: "1px solid #444", padding: "4px 10px" }}>{r.peak.toFixed(3)}</td>
              <td style={{ border: "1px solid #444", padding: "4px 10px" }}>{r.dyn.toFixed(1)}</td>
              <td style={{ border: "1px solid #444", padding: "4px 10px" }}>{r.transients}</td>
              <td style={{ border: "1px solid #444", padding: "4px 10px" }}>{Math.round(r.centroid)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length === 21 && <p id="done">DONE — all 21 synths measured</p>}
    </main>
  );
}
