/**
 * Converts Gregorian date to Hijri using the browser's Intl API
 * with the Umm al-Qura calendar system.
 */

const HIJRI_MONTHS = [
  "Muharram", "Safar", "Rabi' al-Awwal", "Rabi' al-Thani",
  "Jumada al-Awwal", "Jumada al-Thani", "Rajab", "Sha'ban",
  "Ramadan", "Shawwal", "Dhu al-Qi'dah", "Dhu al-Hijjah",
] as const;

export interface HijriDate {
  day: number;
  month: number;
  year: number;
  monthName: string;
  formatted: string;
}

const hijriFormatter = new Intl.DateTimeFormat("en-TN-u-ca-islamic-umalqura", {
  day: "numeric",
  month: "numeric",
  year: "numeric",
});

export function toHijri(date: Date = new Date()): HijriDate {
  const parts = hijriFormatter.formatToParts(date);
  const get = (t: string) => parseInt(parts.find((p) => p.type === t)?.value ?? "0", 10);
  const day = get("day");
  const month = get("month");
  const year = get("year");
  const monthName = HIJRI_MONTHS[month - 1] ?? "Unknown";
  return { day, month, year, monthName, formatted: `${day} ${monthName} ${year}H` };
}

export function isRamadan(date: Date = new Date()): boolean {
  return toHijri(date).month === 9;
}

export function getRamadanProgress(date: Date = new Date()): { day: number; total: number; percent: number } | null {
  const { month, day } = toHijri(date);
  if (month !== 9) return null;
  return { day, total: 30, percent: Math.round((day / 30) * 100) };
}
