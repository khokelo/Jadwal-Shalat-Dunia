"use client";
import { useEffect, useState } from "react";
import { toHijri, isRamadan, getRamadanProgress } from "@/lib/hijri";
import { WORLD_CITIES } from "@/lib/cities";
import { calculatePrayerTimes, formatPrayerTime } from "@/lib/prayer-times";
import { Moon, Sun, Clock, Star, Sunrise } from "lucide-react";

// Cities to show fasting info — broad geographic coverage
const FASTING_CITY_IDS = [
  "mecca", "istanbul", "jakarta", "london", "karachi",
  "cairo", "kualalumpur", "moscow", "delhi", "lagos",
  "casablanca", "newyork",
];

interface FastingEntry {
  city: string;
  country: string;
  suhoor: string;   // Fajr time
  iftar: string;    // Maghrib time
  hours: number;
  mins: number;
}

export default function RamadanPage() {
  const [hijri, setHijri] = useState({ formatted: "Loading...", month: 0, day: 0, year: 0, monthName: "" });
  const [ramadanInfo, setRamadanInfo] = useState<{ day: number; total: number; percent: number } | null>(null);
  const [fastingDurations, setFastingDurations] = useState<FastingEntry[]>([]);

  useEffect(() => {
    const h = toHijri();
    setHijri(h);
    setRamadanInfo(getRamadanProgress());

    const cities = WORLD_CITIES.filter((c) => FASTING_CITY_IDS.includes(c.id));
    const now = new Date();

    const durations: FastingEntry[] = cities.map((city) => {
      try {
        const times = calculatePrayerTimes(city.lat, city.lng, now);
        const diffMs = times.maghrib.getTime() - times.fajr.getTime();
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        return {
          city: city.name,
          country: city.country,
          suhoor: formatPrayerTime(times.fajr, city.timezone),
          iftar: formatPrayerTime(times.maghrib, city.timezone),
          hours,
          mins,
        };
      } catch {
        return { city: city.name, country: city.country, suhoor: "—", iftar: "—", hours: 0, mins: 0 };
      }
    });

    // Sort longest fasting first
    durations.sort((a, b) => b.hours * 60 + b.mins - (a.hours * 60 + a.mins));
    setFastingDurations(durations);
  }, []);

  const inRamadan = isRamadan();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Ramadan Analytics</h1>
        <p className="text-slate-400 max-w-2xl">
          Global fasting hours, Suhoor &amp; Iftar times by city, and Hijri calendar information.
          Data is calculated for today&apos;s date using precise astronomical methods.
        </p>
      </div>

      {/* Hijri date cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="glass rounded-xl border border-indigo-500/30 p-6 md:col-span-2">
          <div className="flex items-center space-x-3 mb-4">
            <Star className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-semibold text-white">Hijri Calendar</h2>
          </div>
          <p className="text-4xl font-bold text-white tracking-tight mb-2">{hijri.formatted}</p>
          <p className="text-slate-400 text-sm">
            {inRamadan ? (
              <span className="text-indigo-400 font-medium">🌙 You are in the holy month of Ramadan</span>
            ) : (
              "The holy month of Ramadan falls in the 9th month of the Islamic calendar"
            )}
          </p>
        </div>

        <div className="glass rounded-xl border border-white/5 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Moon className="w-5 h-5 text-slate-400" />
            <h2 className="text-lg font-semibold text-white">Current Month</h2>
          </div>
          <p className="text-2xl font-bold text-white mb-1">{hijri.monthName}</p>
          <p className="text-slate-400 text-sm">Month {hijri.month} of 12</p>
          {ramadanInfo && (
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-400">Ramadan Day</span>
                <span className="text-white font-medium">{ramadanInfo.day} / {ramadanInfo.total}</span>
              </div>
              <div className="w-full bg-white/5 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all"
                  style={{ width: `${ramadanInfo.percent}%` }}
                />
              </div>
              <p className="text-xs text-slate-500 mt-1">{ramadanInfo.percent}% complete</p>
            </div>
          )}
        </div>
      </div>

      {/* Fasting hours table */}
      <div className="glass rounded-xl border border-white/5 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Clock className="w-5 h-5 text-cyan-400" />
          <h2 className="text-lg font-semibold text-white">
            Fasting Hours by City (Today)
            <span className="ml-2 text-sm font-normal text-slate-500">Sorted by longest fast</span>
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left text-slate-400 font-medium pb-3 pr-4">City</th>
                <th className="text-left text-slate-400 font-medium pb-3 pr-4">Country</th>
                <th className="text-left text-slate-400 font-medium pb-3 pr-4">
                  <span className="flex items-center gap-1">
                    <Sunrise className="w-3.5 h-3.5 text-cyan-400" /> Suhoor (Fajr)
                  </span>
                </th>
                <th className="text-left text-slate-400 font-medium pb-3 pr-4">
                  <span className="flex items-center gap-1">
                    <Sun className="w-3.5 h-3.5 text-orange-400" /> Iftar (Maghrib)
                  </span>
                </th>
                <th className="text-left text-slate-400 font-medium pb-3">Duration</th>
              </tr>
            </thead>
            <tbody>
              {fastingDurations.map(({ city, country, suhoor, iftar, hours, mins }, i) => (
                <tr key={i} className="border-b border-white/3 hover:bg-white/3 transition-colors">
                  <td className="py-3 pr-4 text-white font-medium">{city}</td>
                  <td className="py-3 pr-4 text-slate-400">{country}</td>
                  <td className="py-3 pr-4 font-mono text-cyan-400 text-xs">{suhoor}</td>
                  <td className="py-3 pr-4 font-mono text-orange-400 text-xs">{iftar}</td>
                  <td className="py-3">
                    {hours > 0 || mins > 0 ? (
                      <span
                        className="font-mono text-xs font-semibold"
                        style={{
                          color: hours >= 18 ? "#ef4444" : hours >= 15 ? "#f97316" : "#06b6d4",
                        }}
                      >
                        {hours}h {mins}m
                      </span>
                    ) : (
                      <span className="text-slate-500">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-600 mt-4">
          * Fasting begins at Fajr (Suhoor ends) and breaks at Maghrib (Iftar). Duration color: 🔴 ≥18h  🟠 ≥15h  🔵 &lt;15h
        </p>
      </div>
    </div>
  );
}
