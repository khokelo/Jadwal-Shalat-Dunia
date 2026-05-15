"use client";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { WORLD_CITIES } from "@/lib/cities";
import { getCurrentPrayer, PRAYER_CONFIG } from "@/lib/prayer-times";

type PrayerKey = keyof typeof PRAYER_CONFIG;

// Dynamically import the map component with SSR disabled
const WorldMap = dynamic(() => import("@/components/dashboard/WorldMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] rounded-xl flex items-center justify-center border border-white/10 glass">
      <div className="flex flex-col items-center space-y-4 text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
        <p>Initializing Global Map Visualization...</p>
      </div>
    </div>
  ),
});

function computePrayerStats() {
  const cnt: Partial<Record<PrayerKey, number>> = {};
  let none = 0;
  for (const city of WORLD_CITIES) {
    try {
      const p = getCurrentPrayer(city.lat, city.lng) as PrayerKey | null;
      if (p) cnt[p] = (cnt[p] ?? 0) + 1;
      else none++;
    } catch { none++; }
  }
  return { cnt, none };
}

export default function WorldMapPage() {
  const [prayerStats, setPrayerStats] = useState<{ cnt: Partial<Record<PrayerKey, number>>; none: number }>({ cnt: {}, none: 0 });

  useEffect(() => {
    setPrayerStats(computePrayerStats());
    const id = setInterval(() => setPrayerStats(computePrayerStats()), 60_000);
    return () => clearInterval(id);
  }, []);

  const totalActive = useMemo(
    () => Object.values(prayerStats.cnt).reduce((s, v) => s + (v ?? 0), 0),
    [prayerStats]
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Live Prayer Map</h1>
        <p className="text-slate-400 max-w-2xl">
          Realtime visualization of global prayer waves. Colors indicate the current active prayer in each region.
          <span className="text-cyan-400 font-semibold ml-1">{totalActive} of {WORLD_CITIES.length} cities</span> currently in an active prayer window.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Map — takes 3/4 width on large screens */}
        <div className="lg:col-span-3">
          <WorldMap />
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Prayer color legend */}
          <div className="glass rounded-xl border border-white/5 p-5">
            <h3 className="text-sm font-semibold text-white mb-4">Prayer Color Legend</h3>
            <div className="space-y-3">
              {(Object.entries(PRAYER_CONFIG) as [PrayerKey, (typeof PRAYER_CONFIG)[PrayerKey]][]).map(([key, cfg]) => (
                <LegendItem key={key} color={cfg.color} label={cfg.label} />
              ))}
              <div className="pt-2 border-t border-white/5">
                <LegendItem color="#1a2744" label="No data / Night" />
              </div>
            </div>
          </div>

          {/* Live distribution */}
          <div className="glass rounded-xl border border-white/5 p-5">
            <h3 className="text-sm font-semibold text-white mb-4">
              Live Prayer Distribution
              <span className="ml-2 text-xs font-normal text-slate-500">({WORLD_CITIES.length} cities)</span>
            </h3>
            <div className="space-y-2.5">
              {(Object.entries(PRAYER_CONFIG) as [PrayerKey, (typeof PRAYER_CONFIG)[PrayerKey]][]).map(([key, cfg]) => {
                const count = prayerStats.cnt[key] ?? 0;
                const pct = Math.round((count / WORLD_CITIES.length) * 100);
                return (
                  <div key={key}>
                    <div className="flex justify-between text-xs mb-1">
                      <span style={{ color: cfg.color }} className="font-medium">{cfg.label}</span>
                      <span className="text-slate-400 font-mono">{count} cities</span>
                    </div>
                    <div className="w-full bg-white/5 rounded-full h-1.5">
                      <div
                        className="h-1.5 rounded-full transition-all duration-700"
                        style={{ width: `${pct}%`, backgroundColor: cfg.color }}
                      />
                    </div>
                  </div>
                );
              })}
              {prayerStats.none > 0 && (
                <div className="text-xs text-slate-500 pt-1 border-t border-white/5">
                  {prayerStats.none} cities outside active prayer window
                </div>
              )}
            </div>
          </div>

          {/* Active hotspots — realtime */}
          <div className="glass rounded-xl border border-white/5 p-5">
            <h3 className="text-sm font-semibold text-white mb-4">Active Hotspots</h3>
            <div className="space-y-2 text-xs">
              {(Object.entries(prayerStats.cnt) as [PrayerKey, number][])
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
                .map(([prayer, count]) => {
                  const cfg = PRAYER_CONFIG[prayer];
                  return (
                    <div key={prayer} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ backgroundColor: cfg.color, boxShadow: `0 0 6px ${cfg.color}` }}
                        />
                        <span style={{ color: cfg.color }} className="font-medium">{cfg.label}</span>
                      </div>
                      <span className="text-slate-400 font-mono">{count} cities</span>
                    </div>
                  );
                })}
              {Object.keys(prayerStats.cnt).length === 0 && (
                <p className="text-slate-500">Calculating...</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center space-x-3">
      <span
        className="w-3 h-3 rounded-full flex-shrink-0"
        style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}60` }}
      />
      <span className="text-sm text-slate-300">{label}</span>
    </div>
  );
}
