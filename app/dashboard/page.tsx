"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import { ActivityChart } from "@/components/dashboard/ActivityChart";
import { Users, Globe2, Zap, ArrowUpRight, Activity, MapPin, ChevronDown, Clock } from "lucide-react";
import { WORLD_CITIES } from "@/lib/cities";
import {
  calculatePrayerTimes, getNextPrayer, getCurrentPrayer,
  formatPrayerTime, getAllPrayersAsArray, PRAYER_CONFIG, PrayerName,
} from "@/lib/prayer-times";
import { toHijri } from "@/lib/hijri";
import { cn } from "@/lib/utils";

const DEFAULT_CITY_ID = "mecca";

// Live timeline entries derived from WORLD_CITIES (top 5 by muslim population)
const TOP_CITIES = [...WORLD_CITIES]
  .sort((a, b) => b.muslimPopulation - a.muslimPopulation)
  .slice(0, 5);

export default function DashboardPage() {
  const [selectedCityId, setSelectedCityId] = useState(DEFAULT_CITY_ID);
  const [countdown, setCountdown] = useState("--:--:--");
  const [nextPrayer, setNextPrayer] = useState<PrayerName | null>(null);
  const [currentPrayer, setCurrentPrayer] = useState<PrayerName | null>(null);
  const [prayerTimes, setPrayerTimes] = useState<ReturnType<typeof getAllPrayersAsArray>>([]);
  const [hijriDate, setHijriDate] = useState("");
  const [localTime, setLocalTime] = useState("");
  const [topCityPrayers, setTopCityPrayers] = useState<Record<string, { prayer: PrayerName | null; localTime: string }>>({});
  const [citiesPraying, setCitiesPraying] = useState(0);

  const city = useMemo(
    () => WORLD_CITIES.find((c) => c.id === selectedCityId) ?? WORLD_CITIES[0],
    [selectedCityId],
  );

  // Recalculate prayer times (only needed ~once per minute — times don't change more often)
  const refreshPrayers = useCallback(() => {
    try {
      const times = calculatePrayerTimes(city.lat, city.lng);
      setPrayerTimes(getAllPrayersAsArray(times));
      setCurrentPrayer(getCurrentPrayer(city.lat, city.lng));
      setNextPrayer(getNextPrayer(city.lat, city.lng)?.prayer ?? null);
    } catch { /* edge case coords */ }
  }, [city.lat, city.lng]);

  // Tick countdown every second (lightweight — just string format from next prayer time)
  const tickCountdown = useCallback(() => {
    try {
      const next = getNextPrayer(city.lat, city.lng);
      if (next) setCountdown(next.countdown);
    } catch { /**/ }
  }, [city.lat, city.lng]);

  // Count cities currently in an active prayer window
  const refreshCitiesPraying = useCallback(() => {
    let count = 0;
    for (const c of WORLD_CITIES) {
      try { if (getCurrentPrayer(c.lat, c.lng)) count++; } catch { /**/ }
    }
    setCitiesPraying(count);
  }, []);

  useEffect(() => {
    setHijriDate(toHijri().formatted);
    refreshPrayers();
    refreshCitiesPraying();
    // Prayer times: refresh every 60s
    const prayerInterval = setInterval(() => { refreshPrayers(); refreshCitiesPraying(); }, 60_000);
    // Countdown: refresh every second (fast but cheap)
    const countdownInterval = setInterval(tickCountdown, 1000);
    return () => { clearInterval(prayerInterval); clearInterval(countdownInterval); };
  }, [refreshPrayers, tickCountdown, refreshCitiesPraying]);

  // Local time clock for selected city
  useEffect(() => {
    const tick = () => {
      setLocalTime(new Date().toLocaleTimeString("en-US", {
        timeZone: city.timezone, hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
      }));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [city.timezone]);

  // Top-city live states (refresh every 30s)
  const refreshTopCities = useCallback(() => {
    const map: typeof topCityPrayers = {};
    for (const c of TOP_CITIES) {
      try {
        const prayer = getCurrentPrayer(c.lat, c.lng);
        const localTime = new Date().toLocaleTimeString("en-US", {
          timeZone: c.timezone, hour: "2-digit", minute: "2-digit", hour12: true,
        });
        map[c.id] = { prayer, localTime };
      } catch {
        map[c.id] = { prayer: null, localTime: "--" };
      }
    }
    setTopCityPrayers(map);
  }, []);

  useEffect(() => {
    refreshTopCities();
    const id = setInterval(refreshTopCities, 30_000);
    return () => clearInterval(id);
  }, [refreshTopCities]);

  const nextPrayerColor = nextPrayer ? PRAYER_CONFIG[nextPrayer].color : "#06b6d4";

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Global Command Center</h1>
          <p className="text-slate-400 mt-1">{hijriDate} · Realtime prayer intelligence worldwide</p>
        </div>
        <div className="flex items-center gap-3">
          {/* City selector */}
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <select
              value={selectedCityId}
              onChange={(e) => setSelectedCityId(e.target.value)}
              className="glass border border-white/10 rounded-lg pl-9 pr-8 py-2 text-sm text-white bg-transparent appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-cyan-500"
            >
              {WORLD_CITIES.map((c) => (
                <option key={c.id} value={c.id} className="bg-slate-900">
                  {c.name}, {c.country}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
          <div className="flex items-center space-x-2 bg-indigo-500/10 text-indigo-400 px-4 py-2 rounded-lg border border-indigo-500/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" />
            </span>
            <span className="text-sm font-medium">Live</span>
          </div>
        </div>
      </div>

      {/* Prayer Times Strip */}
      <div className="glass rounded-xl border border-white/5 p-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400" />
            <p className="text-sm font-medium text-slate-400">Prayer Times — {city.name}, {city.country}</p>
          </div>
          <p className="font-mono text-sm text-cyan-400">{localTime}</p>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
          {prayerTimes.filter((p) => p.name !== "sunrise").map((p) => {
            const isActive = currentPrayer === p.name;
            const isNext = nextPrayer === p.name;
            return (
              <div
                key={p.name}
                className="rounded-lg p-3 text-center border transition-all"
                style={
                  isActive
                    ? { borderColor: p.color + "55", backgroundColor: p.color + "18", boxShadow: `0 0 20px ${p.color}20` }
                    : { borderColor: "rgba(255,255,255,0.05)", backgroundColor: "rgba(255,255,255,0.02)" }
                }
              >
                <p className="text-xs text-slate-400 mb-1">{p.label}</p>
                <p className="text-sm font-bold font-mono" style={{ color: p.color }}>
                  {formatPrayerTime(p.time, city.timezone)}
                </p>
                {isNext && <p className="text-xs text-slate-500 mt-1 font-mono">{countdown}</p>}
                {isActive && <p className="text-xs mt-1 font-semibold" style={{ color: p.color }}>● Now</p>}
              </div>
            );
          })}
        </div>

        {/* Next prayer indicator */}
        {nextPrayer && (
          <div className="mt-3 pt-3 border-t border-white/5 flex items-center gap-3 text-sm">
            <span className="text-slate-400">Next prayer:</span>
            <span className="font-semibold" style={{ color: nextPrayerColor }}>
              {PRAYER_CONFIG[nextPrayer].label}
            </span>
            <span className="font-mono text-slate-400">in {countdown}</span>
          </div>
        )}
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard title="Cities Monitored" value={String(WORLD_CITIES.length)} trend={`+${WORLD_CITIES.length - 50}`} icon={<Globe2 className="w-5 h-5 text-cyan-400" />} borderColor="border-cyan-500/20" glowColor="bg-cyan-500/5" />
        <MetricCard title="Global Sync Rate" value="99.9%" trend="+0.1%" icon={<Zap className="w-5 h-5 text-indigo-400" />} borderColor="border-indigo-500/20" glowColor="bg-indigo-500/5" />
        <MetricCard title="Countries Active" value={String(new Set(WORLD_CITIES.map(c => c.countryCode)).size)} trend="+9" icon={<Users className="w-5 h-5 text-cyan-400" />} borderColor="border-cyan-500/20" glowColor="bg-cyan-500/5" />
        <MetricCard
          title="Cities Praying Now"
          value={String(citiesPraying)}
          trend={`${Math.round((citiesPraying / WORLD_CITIES.length) * 100)}%`}
          icon={<Activity className="w-5 h-5 text-emerald-400" />}
          borderColor="border-emerald-500/20"
          glowColor="bg-emerald-500/5"
        />
      </div>

      {/* Charts + Live Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass rounded-xl border border-white/5 p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 blur-[100px] rounded-full" />
          <div className="flex items-center justify-between mb-4 relative z-10">
            <h2 className="text-lg font-semibold text-white">Global Prayer Activity (24h)</h2>
          </div>
          <ActivityChart />
        </div>

        <div className="glass rounded-xl border border-white/5 p-6 flex flex-col">
          <h2 className="text-lg font-semibold text-white mb-4">Live Prayer Feed</h2>
          <div className="flex-1 space-y-2">
            {TOP_CITIES.map((c) => {
              const state = topCityPrayers[c.id];
              const prayer = state?.prayer;
              const color = prayer ? PRAYER_CONFIG[prayer].color : "#64748b";
              const label = prayer ? PRAYER_CONFIG[prayer].label : "—";
              return (
                <div key={c.id} className="flex items-center justify-between p-3 rounded-lg bg-white/3 border border-white/5 hover:bg-white/5 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 rounded-full flex-shrink-0 animate-pulse" style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}` }} />
                    <div>
                      <p className="text-sm font-medium text-white">{label}</p>
                      <p className="text-xs text-slate-400">{c.name}, {c.country}</p>
                    </div>
                  </div>
                  <span className="text-xs text-slate-500 font-mono">{state?.localTime ?? "--"}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function MetricCard({
  title, value, trend, icon, borderColor, glowColor,
}: {
  title: string; value: string; trend: string; icon: React.ReactNode;
  borderColor: string; glowColor: string;
}) {
  return (
    <div className={cn("glass rounded-xl border p-6 relative overflow-hidden group hover:border-white/10 transition-colors", borderColor)}>
      <div className={cn("absolute top-0 right-0 w-32 h-32 blur-[60px] rounded-full transition-opacity group-hover:opacity-100 opacity-0", glowColor)} />
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 rounded-lg bg-white/5">{icon}</div>
        <div className="flex items-center space-x-1 text-emerald-400 text-sm font-medium">
          <ArrowUpRight className="w-4 h-4" />
          <span>{trend}</span>
        </div>
      </div>
      <p className="text-slate-400 text-sm mb-1">{title}</p>
      <p className="text-3xl font-bold text-white tracking-tight">{value}</p>
    </div>
  );
}
