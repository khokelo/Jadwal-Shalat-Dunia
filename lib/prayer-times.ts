import { Coordinates, CalculationMethod, PrayerTimes, Prayer, Qibla, HighLatitudeRule } from "adhan";

// ─── Types ────────────────────────────────────────────────────────────────────
export type PrayerName = "fajr" | "sunrise" | "dhuhr" | "asr" | "maghrib" | "isha";

export interface PrayerInfo {
  name: PrayerName;
  label: string;
  time: Date;
  color: string;
  glowColor: string;
}

export interface PrayerTimesResult {
  fajr: Date;
  sunrise: Date;
  dhuhr: Date;
  asr: Date;
  maghrib: Date;
  isha: Date;
  date: Date;
  coords: { lat: number; lng: number };
}

export interface NextPrayerResult {
  prayer: PrayerName;
  time: Date;
  countdown: string;
  milliseconds: number;
}

// ─── Config ───────────────────────────────────────────────────────────────────
export const PRAYER_CONFIG = {
  fajr:    { label: "Fajr",    color: "#06b6d4", glowColor: "rgba(6,182,212,0.4)" },
  sunrise: { label: "Sunrise", color: "#f59e0b", glowColor: "rgba(245,158,11,0.4)" },
  dhuhr:   { label: "Dhuhr",   color: "#eab308", glowColor: "rgba(234,179,8,0.4)" },
  asr:     { label: "Asr",     color: "#f97316", glowColor: "rgba(249,115,22,0.4)" },
  maghrib: { label: "Maghrib", color: "#ef4444", glowColor: "rgba(239,68,68,0.4)" },
  isha:    { label: "Isha",    color: "#6366f1", glowColor: "rgba(99,102,241,0.4)" },
} as const satisfies Record<PrayerName, { label: string; color: string; glowColor: string }>;

// ─── Internal helpers ─────────────────────────────────────────────────────────
function makeParams() {
  const p = CalculationMethod.MoonsightingCommittee();
  // Required for high-latitude regions (Norway, Greenland, Russia, Canada)
  p.highLatitudeRule = HighLatitudeRule.SeventhOfTheNight;
  return p;
}

function msToCountdown(ms: number): string {
  const h = Math.floor(ms / 3_600_000);
  const m = Math.floor((ms % 3_600_000) / 60_000);
  const s = Math.floor((ms % 60_000) / 1000);
  return [h, m, s].map((n) => String(n).padStart(2, "0")).join(":");
}

// ─── Public API ───────────────────────────────────────────────────────────────
export function calculatePrayerTimes(lat: number, lng: number, date: Date = new Date()): PrayerTimesResult {
  const coords = new Coordinates(lat, lng);
  const t = new PrayerTimes(coords, date, makeParams());
  return {
    fajr: t.fajr, sunrise: t.sunrise, dhuhr: t.dhuhr,
    asr: t.asr, maghrib: t.maghrib, isha: t.isha,
    date, coords: { lat, lng },
  };
}

export function getNextPrayer(lat: number, lng: number): NextPrayerResult | null {
  const now = new Date();
  const t = new PrayerTimes(new Coordinates(lat, lng), now, makeParams());
  const next = t.nextPrayer();
  if (!next || next === Prayer.None) return null;
  const time = t.timeForPrayer(next);
  if (!time) return null;
  const ms = time.getTime() - now.getTime();
  return { prayer: next as PrayerName, time, countdown: msToCountdown(ms), milliseconds: ms };
}

export function getCurrentPrayer(lat: number, lng: number): PrayerName | null {
  const now = new Date();
  const t = new PrayerTimes(new Coordinates(lat, lng), now, makeParams());
  const current = t.currentPrayer();
  if (!current || current === Prayer.None) return null;
  return current as PrayerName;
}

export function getQiblaDirection(lat: number, lng: number): number {
  return Qibla(new Coordinates(lat, lng));
}

export function formatPrayerTime(date: Date, timezone?: string): string {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit", minute: "2-digit", hour12: true,
    ...(timezone ? { timeZone: timezone } : {}),
  });
}

export function getAllPrayersAsArray(times: PrayerTimesResult): PrayerInfo[] {
  return (["fajr", "sunrise", "dhuhr", "asr", "maghrib", "isha"] as PrayerName[]).map((name) => ({
    name,
    label: PRAYER_CONFIG[name].label,
    time: times[name],
    color: PRAYER_CONFIG[name].color,
    glowColor: PRAYER_CONFIG[name].glowColor,
  }));
}
