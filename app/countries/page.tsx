"use client";
import { useMemo, useState, useEffect } from "react";
import { WORLD_CITIES } from "@/lib/cities";
import { Search, Globe2, MapPin } from "lucide-react";
import Link from "next/link";
import { getCurrentPrayer, PRAYER_CONFIG } from "@/lib/prayer-times";

type SortKey = "name" | "cities" | "muslimPop";
type PrayerKey = keyof typeof PRAYER_CONFIG;

const groupedByCountry = WORLD_CITIES.reduce<Record<string, typeof WORLD_CITIES>>((acc, city) => {
  if (!acc[city.country]) acc[city.country] = [];
  acc[city.country].push(city);
  return acc;
}, {});

// Get the best representative city per country (highest muslimPopulation)
function getRepCity(cities: typeof WORLD_CITIES) {
  return cities.reduce((a, b) => (b.muslimPopulation > a.muslimPopulation ? b : a));
}

function computeCountryPrayers(): Record<string, PrayerKey | null> {
  const map: Record<string, PrayerKey | null> = {};
  for (const [country, cities] of Object.entries(groupedByCountry)) {
    const rep = getRepCity(cities);
    try {
      map[country] = getCurrentPrayer(rep.lat, rep.lng) as PrayerKey | null;
    } catch {
      map[country] = null;
    }
  }
  return map;
}

export default function CountriesPage() {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [countryPrayers, setCountryPrayers] = useState<Record<string, PrayerKey | null>>({});

  // Refresh live prayer badges every 60s
  useEffect(() => {
    setCountryPrayers(computeCountryPrayers());
    const id = setInterval(() => setCountryPrayers(computeCountryPrayers()), 60_000);
    return () => clearInterval(id);
  }, []);

  const countryList = useMemo(() => {
    const entries = Object.entries(groupedByCountry)
      .filter(([country]) =>
        country.toLowerCase().includes(search.toLowerCase()) ||
        groupedByCountry[country].some((c) => c.name.toLowerCase().includes(search.toLowerCase()))
      )
      .sort(([nameA, citiesA], [nameB, citiesB]) => {
        if (sortKey === "name")       return nameA.localeCompare(nameB);
        if (sortKey === "cities")     return citiesB.length - citiesA.length;
        if (sortKey === "muslimPop") {
          const avgA = citiesA.reduce((s, c) => s + c.muslimPopulation, 0) / citiesA.length;
          const avgB = citiesB.reduce((s, c) => s + c.muslimPopulation, 0) / citiesB.length;
          return avgB - avgA;
        }
        return 0;
      });
    return entries;
  }, [search, sortKey]);

  const totalCountries = Object.keys(groupedByCountry).length;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Countries Directory</h1>
        <p className="text-slate-400 max-w-2xl">
          Browse prayer times by country across{" "}
          <span className="text-cyan-400 font-semibold">{totalCountries} countries</span> and{" "}
          <span className="text-indigo-400 font-semibold">{WORLD_CITIES.length} cities</span> worldwide.
          Live prayer badge shows the current prayer for each country&apos;s representative city.
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search country or city…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full glass border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 bg-transparent"
          />
        </div>
        <div className="flex gap-2">
          {(["name", "cities", "muslimPop"] as SortKey[]).map((k) => (
            <button
              key={k}
              onClick={() => setSortKey(k)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                sortKey === k
                  ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                  : "glass border border-white/10 text-slate-400 hover:text-white"
              }`}
            >
              {k === "name" ? "A–Z" : k === "cities" ? "Cities ↓" : "Muslim % ↓"}
            </button>
          ))}
        </div>
      </div>

      {countryList.length === 0 ? (
        <p className="text-slate-500 text-center py-16">No results for &quot;{search}&quot;</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {countryList.map(([country, cities]) => {
            const avgMuslim = Math.round(cities.reduce((s, c) => s + c.muslimPopulation, 0) / cities.length);
            const code = cities[0].countryCode;
            const activePrayer = countryPrayers[country];
            const prayerCfg = activePrayer ? PRAYER_CONFIG[activePrayer] : null;

            return (
              <div key={country} className="glass rounded-xl border border-white/5 p-5 hover:border-white/10 transition-all hover:shadow-[0_0_30px_rgba(6,182,212,0.05)] group">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-cyan-500/10 rounded-lg group-hover:bg-cyan-500/15 transition-colors">
                      <Globe2 className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                      <h2 className="font-semibold text-white">{country}</h2>
                      <p className="text-xs text-slate-400">
                        {code} · {cities.length} {cities.length === 1 ? "city" : "cities"} · {avgMuslim}% Muslim
                      </p>
                    </div>
                  </div>

                  {/* Live prayer badge */}
                  {prayerCfg ? (
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1 flex-shrink-0"
                      style={{
                        color: prayerCfg.color,
                        backgroundColor: prayerCfg.color + "20",
                        border: `1px solid ${prayerCfg.color}40`,
                      }}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full animate-pulse flex-shrink-0"
                        style={{ backgroundColor: prayerCfg.color }}
                      />
                      {prayerCfg.label}
                    </span>
                  ) : (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-slate-500">{avgMuslim}%</span>
                  )}
                </div>

                {/* Muslim population bar */}
                <div className="mb-3">
                  <div className="w-full bg-white/5 rounded-full h-1">
                    <div
                      className="h-1 rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500 transition-all"
                      style={{ width: `${Math.min(avgMuslim, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  {cities.slice(0, 4).map((city) => (
                    <div key={city.id} className="flex justify-between items-center text-sm py-1 border-t border-white/3">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3 h-3 text-slate-500" />
                        <span className="text-slate-300">{city.name}</span>
                      </div>
                      <span className="text-slate-500 text-xs font-mono">
                        {city.timezone.split("/").pop()?.replace(/_/g, " ")}
                      </span>
                    </div>
                  ))}
                  {cities.length > 4 && (
                    <p className="text-xs text-slate-500 pt-1">+{cities.length - 4} more cities</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {search && (
        <p className="text-xs text-slate-600 text-center mt-6">
          Showing {countryList.length} of {totalCountries} countries
        </p>
      )}
    </div>
  );
}
