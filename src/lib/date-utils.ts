/** Small date helpers for Aspirant Mode. All local-time, no external deps. */

/** Local YYYY-MM-DD for a Date (no UTC shift). */
export function toISO(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** The current "study day" — the day rolls over at 5am local, not midnight,
 *  so a late-night session (00:00–04:59) still counts toward the previous day. */
export function todayISO(): string {
  const d = new Date();
  if (d.getHours() < 5) d.setDate(d.getDate() - 1);
  return toISO(d);
}

/** Parse a YYYY-MM-DD string to a local Date at midnight. */
export function fromISO(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

/** Whole days from today (local midnight) to the target date. Future → positive. */
export function daysUntil(iso: string): number {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = fromISO(iso);
  return Math.round((target.getTime() - today.getTime()) / 86_400_000);
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
export const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

export function monthLabel(year: number, month0: number): string {
  return `${MONTHS[month0]} ${year}`;
}

export function prettyDate(iso: string): string {
  const d = fromISO(iso);
  return `${MONTHS[d.getMonth()].slice(0, 3)} ${d.getDate()}, ${d.getFullYear()}`;
}

/**
 * A 6-row month grid (42 cells) of ISO dates, Sunday-first, including the
 * leading/trailing days from adjacent months so the grid is always full.
 */
export function monthGrid(year: number, month0: number): { iso: string; inMonth: boolean }[] {
  const first = new Date(year, month0, 1);
  const startDow = first.getDay(); // 0 = Sunday
  const start = new Date(year, month0, 1 - startDow);
  const cells: { iso: string; inMonth: boolean }[] = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
    cells.push({ iso: toISO(d), inMonth: d.getMonth() === month0 });
  }
  return cells;
}
