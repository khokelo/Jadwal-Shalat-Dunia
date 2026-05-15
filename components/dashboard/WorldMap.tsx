"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, TileLayer, GeoJSON, CircleMarker, Popup, useMapEvents } from "react-leaflet";
import { feature as topoFeature } from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";
import type { GeoJsonObject, Feature, FeatureCollection } from "geojson";
import type L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Search, Layers } from "lucide-react";
import { WORLD_CITIES } from "@/lib/cities";
import { getCurrentPrayer, formatPrayerTime, calculatePrayerTimes, PRAYER_CONFIG } from "@/lib/prayer-times";

type PrayerKey = keyof typeof PRAYER_CONFIG;
const FALLBACK_COLOR = "#1a2744";
const REFRESH_MS = 60_000;
const ZOOM_DOTS = 4;

// ISO numeric → alpha-2
const ISO_TO_A2: Record<string, string> = {
  "004":"AF","012":"DZ","024":"AO","032":"AR","036":"AU","048":"BH",
  "050":"BD","056":"BE","076":"BR","096":"BN","124":"CA","144":"LK",
  "152":"CL","156":"CN","170":"CO","250":"FR","276":"DE","288":"GH",
  "304":"GL","356":"IN","360":"ID","364":"IR","368":"IQ","372":"IE",
  "392":"JP","400":"JO","398":"KZ","404":"KE","414":"KW","422":"LB",
  "434":"LY","458":"MY","466":"ML","478":"MR","484":"MX","496":"MN",
  "504":"MA","512":"OM","524":"NP","528":"NL","554":"NZ","562":"NE",
  "566":"NG","578":"NO","586":"PK","604":"PE","608":"PH","634":"QA",
  "643":"RU","682":"SA","686":"SN","702":"SG","706":"SO","724":"ES",
  "729":"SD","752":"SE","764":"TH","788":"TN","792":"TR","784":"AE",
  "800":"UG","804":"UA","818":"EG","826":"GB","840":"US","858":"UY",
  "860":"UZ","704":"VN","887":"YE","231":"ET","232":"ER",
};

// Country name lookup from WORLD_CITIES
const COUNTRY_NAMES: Record<string, string> = {};
for (const c of WORLD_CITIES) COUNTRY_NAMES[c.countryCode] = c.country;

// Best representative coord per country (city with highest Muslim %)
const COUNTRY_REP: Record<string, { lat: number; lng: number }> = {};
for (const countryCode of new Set(WORLD_CITIES.map((c) => c.countryCode))) {
  const citiesInCountry = WORLD_CITIES.filter((c) => c.countryCode === countryCode);
  const best = citiesInCountry.reduce((a, b) => (b.muslimPopulation > a.muslimPopulation ? b : a));
  COUNTRY_REP[countryCode] = { lat: best.lat, lng: best.lng };
}

function centroid(feature: Feature): [number, number] {
  const g = feature.geometry;
  if (!g) return [0, 0];
  const rings = g.type === "Polygon" ? [g.coordinates[0]]
    : g.type === "MultiPolygon" ? g.coordinates.map(p => p[0]) : [];
  let best = rings[0] ?? []; let maxL = 0;
  for (const r of rings) if (r.length > maxL) { maxL = r.length; best = r; }
  return [
    best.reduce((s, c) => s + c[1], 0) / (best.length || 1),
    best.reduce((s, c) => s + c[0], 0) / (best.length || 1),
  ];
}

function buildColors(features: Feature[]) {
  const out: Record<string, { color: string; prayer: PrayerKey | null; name: string }> = {};
  for (const f of features) {
    const id = String(f.id ?? "");
    const a2 = ISO_TO_A2[id] ?? "";
    const rep = COUNTRY_REP[a2];
    const [lat, lng] = rep ? [rep.lat, rep.lng] : centroid(f);
    let prayer: PrayerKey | null = null, color = FALLBACK_COLOR;
    try { prayer = getCurrentPrayer(lat, lng) as PrayerKey | null; if (prayer) color = PRAYER_CONFIG[prayer].color; } catch { /**/ }
    out[id] = { color, prayer, name: COUNTRY_NAMES[a2] || a2 || "" };
  }
  return out;
}

function computeCity() {
  const now = new Date();
  const out: Record<string, { prayer: PrayerKey | null; color: string; time: string }> = {};
  for (const city of WORLD_CITIES) {
    try {
      const prayer = getCurrentPrayer(city.lat, city.lng) as PrayerKey | null;
      const color = prayer ? PRAYER_CONFIG[prayer].color : "#38bdf8";
      let time = "--:--";
      try { time = now.toLocaleTimeString("en-US", { timeZone: city.timezone, hour: "2-digit", minute: "2-digit", hour12: true }); } catch { /**/ }
      out[city.id] = { prayer, color, time };
    } catch { out[city.id] = { prayer: null, color: "#38bdf8", time: "--:--" }; }
  }
  return out;
}

function ZoomWatcher({ onZoom }: { onZoom: (z: number) => void }) {
  useMapEvents({ zoomend: e => onZoom(e.target.getZoom()) });
  return null;
}

export default function WorldMap() {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [colors, setColors] = useState<ReturnType<typeof buildColors>>({});
  const [cityStates, setCityStates] = useState(computeCity);
  const [mounted, setMounted] = useState(false);
  const [search, setSearch] = useState("");
  const [zoom, setZoom] = useState(2);
  const [geoKey, setGeoKey] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const refresh = (feats: Feature[]) => {
    const c = buildColors(feats); setColors(c);
    setCityStates(computeCity()); setGeoKey(k => k + 1);
  };

  useEffect(() => {
    setMounted(true);
    import("world-atlas/countries-110m.json").then(mod => {
      const topo = mod.default as unknown as Topology<{ countries: GeometryCollection }>;
      const geo = topoFeature(topo, topo.objects.countries) as unknown as FeatureCollection;
      setFeatures(geo.features); refresh(geo.features);
    });
    timer.current = setInterval(() => setFeatures(f => { refresh(f); return f; }), REFRESH_MS);
    return () => { if (timer.current) clearInterval(timer.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return q ? WORLD_CITIES.filter(c => c.name.toLowerCase().includes(q) || c.country.toLowerCase().includes(q)) : WORLD_CITIES;
  }, [search]);

  const prayerStats = useMemo(() => {
    const cnt: Record<string, number> = {};
    for (const s of Object.values(cityStates)) if (s.prayer) cnt[s.prayer] = (cnt[s.prayer] ?? 0) + 1;
    return cnt;
  }, [cityStates]);

  const showDots = zoom >= ZOOM_DOTS;

  const geoStyle = (f?: Feature): L.PathOptions => {
    const entry = colors[String(f?.id ?? "")];
    const color = entry?.color ?? FALLBACK_COLOR;
    return {
      fillColor: color,
      fillOpacity: color === FALLBACK_COLOR ? 0.2 : 0.72,
      weight: 1,
      color: "#0a1628",
      opacity: 1,
    };
  };

  const onEachFeature = (f: Feature, layer: L.Layer) => {
    const id = String(f.id ?? "");
    const a2 = ISO_TO_A2[id] ?? "";
    const entry = colors[id];
    const color = entry?.color ?? FALLBACK_COLOR;
    const name = entry?.name || a2;
    const prayer = entry?.prayer;
    const prayerLabel = prayer ? PRAYER_CONFIG[prayer].label : "";
    const rep = COUNTRY_REP[a2];

    // Permanent label inside region (like Ohio county map)
    const tooltipHtml = name
      ? `<span class="ct-name">${name}</span>${prayerLabel ? `<br/><span class="ct-prayer">${prayerLabel}</span>` : ""}`
      : "";
    if (tooltipHtml) {
      (layer as L.Path).bindTooltip(tooltipHtml, {
        permanent: true, direction: "center", className: "ct-label",
      });
    }

    // Click popup with prayer schedule
    let timesHtml = "";
    if (rep) {
      try {
        const t = calculatePrayerTimes(rep.lat, rep.lng);
        const tz = WORLD_CITIES.find(c => c.countryCode === a2)?.timezone ?? "UTC";
        const rows = (["fajr","dhuhr","asr","maghrib","isha"] as PrayerKey[]).map(p =>
          `<tr><td style="color:#94a3b8;padding:2px 10px 2px 0;text-transform:capitalize">${p}</td><td style="font-family:monospace;text-align:right;color:white">${formatPrayerTime(t[p], tz)}</td></tr>`
        ).join("");
        timesHtml = `<table style="width:100%;font-size:11px;border-collapse:collapse">${rows}</table>`;
      } catch { /**/ }
    }

    (layer as L.Path).bindPopup(
      `<div style="font-family:inherit;padding:2px">
        <div style="font-weight:700;font-size:13px;color:${color};margin-bottom:4px">${name}</div>
        <div style="font-size:12px;font-weight:600;color:${color};margin-bottom:6px">${prayerLabel || "—"}</div>
        ${timesHtml || `<div style="color:#475569;font-size:11px">No city data</div>`}
      </div>`,
      { maxWidth: 200 }
    );
  };

  if (!mounted) return null;

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-center">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search city or country…"
            className="w-full glass border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 bg-transparent" />
        </div>
        <div className="flex items-center gap-2 glass border border-white/10 px-3 py-2 rounded-lg text-xs text-slate-400">
          <Layers className="w-3.5 h-3.5" />
          Zoom {zoom} ·{" "}
          <span className={showDots ? "text-cyan-400" : "text-amber-400"}>
            {showDots ? "City dots" : "Region labels"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Map */}
        <div className="lg:col-span-3 rounded-xl overflow-hidden border border-white/10 relative" style={{ height: 580 }}>
          <MapContainer center={[20, 20]} zoom={2} style={{ height: "100%", width: "100%", background: "#09090b" }} minZoom={2} maxZoom={14} worldCopyJump>
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
            />
            <ZoomWatcher onZoom={setZoom} />

            {features.length > 0 && (
              <GeoJSON
                key={geoKey}
                data={{ type: "FeatureCollection", features } as GeoJsonObject}
                style={geoStyle}
                onEachFeature={onEachFeature}
              />
            )}

            {showDots && filtered.map(city => {
              const s = cityStates[city.id];
              const color = s?.color ?? "#38bdf8";
              const prayer = s?.prayer;
              const pLabel = prayer ? PRAYER_CONFIG[prayer].label : "—";
              const times = (() => { try { return calculatePrayerTimes(city.lat, city.lng); } catch { return null; } })();
              return (
                <CircleMarker key={city.id} center={[city.lat, city.lng]}
                  radius={city.muslimPopulation >= 60 ? 7 : city.muslimPopulation >= 20 ? 5 : 4}
                  pathOptions={{ color: "#000", fillColor: color, fillOpacity: 0.95, weight: 1.5 }}>
                  <Popup minWidth={175}>
                    <div style={{ fontFamily: "inherit", padding: "2px" }}>
                      <div style={{ fontWeight: 700, fontSize: 13, color, marginBottom: 2 }}>{city.name}</div>
                      <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 6 }}>{city.country}</div>
                      <table style={{ width: "100%", fontSize: 11, borderCollapse: "collapse" }}>
                        <tbody>
                          <tr><td style={{ color: "#94a3b8", paddingBottom: 3, paddingRight: 10 }}>Prayer</td><td style={{ textAlign: "right", color, fontWeight: 600 }}>{pLabel}</td></tr>
                          <tr><td style={{ color: "#94a3b8", paddingBottom: 3, paddingRight: 10 }}>Local</td><td style={{ textAlign: "right", fontFamily: "monospace", color: "white" }}>{s?.time ?? "—"}</td></tr>
                          {times && (["fajr","dhuhr","asr","maghrib","isha"] as PrayerKey[]).map(p => (
                            <tr key={p}><td style={{ color: "#94a3b8", paddingBottom: 2, paddingRight: 10, textTransform: "capitalize" }}>{p}</td><td style={{ textAlign: "right", fontFamily: "monospace", color: "white" }}>{formatPrayerTime(times[p], city.timezone)}</td></tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Popup>
                </CircleMarker>
              );
            })}
          </MapContainer>

          {/* Live badge */}
          <div className="absolute bottom-3 left-3 z-[1000] glass px-3 py-1.5 rounded-full text-xs text-cyan-400 border border-cyan-500/20 font-medium flex items-center gap-2 select-none">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-cyan-500" />
            </span>
            {features.length} countries · Live
          </div>

          {/* Legend */}
          <div className="absolute top-3 right-3 z-[1000] glass px-3 py-2 rounded-lg text-xs border border-white/10 space-y-1.5 select-none">
            <p className="text-slate-400 font-semibold mb-2">Prayer Colors</p>
            {(Object.entries(PRAYER_CONFIG) as [PrayerKey, (typeof PRAYER_CONFIG)[PrayerKey]][]).map(([key, cfg]) => (
              <div key={key} className="flex items-center gap-2">
                <span className="w-4 h-3 rounded-sm inline-block flex-shrink-0" style={{ backgroundColor: cfg.color, opacity: 0.8 }} />
                <span style={{ color: cfg.color }} className="font-medium">{cfg.label}</span>
              </div>
            ))}
            <p className="text-slate-600 pt-1 border-t border-white/5 text-[10px]">Zoom ≥{ZOOM_DOTS} for city dots</p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-3">
          <div className="glass rounded-xl border border-white/5 p-4">
            <h3 className="text-sm font-semibold text-white mb-3">Prayer Distribution</h3>
            <div className="space-y-2">
              {(Object.entries(PRAYER_CONFIG) as [PrayerKey, (typeof PRAYER_CONFIG)[PrayerKey]][]).map(([key, cfg]) => {
                const count = prayerStats[key] ?? 0;
                const pct = Math.round((count / WORLD_CITIES.length) * 100);
                return (
                  <div key={key}>
                    <div className="flex justify-between text-xs mb-1">
                      <span style={{ color: cfg.color }} className="font-medium">{cfg.label}</span>
                      <span className="text-slate-400">{count}</span>
                    </div>
                    <div className="w-full bg-white/5 rounded-full h-1.5">
                      <div className="h-1.5 rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: cfg.color }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="glass rounded-xl border border-white/5 p-4">
            <h3 className="text-sm font-semibold text-white mb-3">Global Coverage</h3>
            <div className="space-y-1.5 text-xs">
              {([
                { label: "Middle East",     codes: ["SA","AE","IQ","IR","JO","KW","QA","OM","BH","LB"] },
                { label: "South & SE Asia", codes: ["PK","BD","IN","ID","MY","SG","PH","TH","BN"] },
                { label: "Africa",          codes: ["EG","NG","SN","KE","ET","MA","LY","TN","DZ","SD","SO","GH"] },
                { label: "Europe",          codes: ["TR","GB","FR","DE","NO","SE","NL","BE"] },
                { label: "Russia",          codes: ["RU"] },
                { label: "C. Asia",         codes: ["UZ","KZ","MN"] },
                { label: "Americas",        codes: ["US","CA","BR","AR","CL","PE"] },
                { label: "Oceania",         codes: ["AU","NZ","GL"] },
              ] as const).map(({ label, codes }) => {
                const cnt = WORLD_CITIES.filter(c => (codes as readonly string[]).includes(c.countryCode)).length;
                return (
                  <div key={label} className="flex justify-between text-slate-300">
                    <span>{label}</span>
                    <span className="text-cyan-400 font-mono">{cnt}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .leaflet-container { font-family: inherit; background: #09090b !important; }
        /* Country label tooltips — like Ohio county map */
        .ct-label {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
          padding: 0 !important;
          text-align: center;
          pointer-events: none;
        }
        .ct-label::before { display: none !important; }
        .ct-name {
          display: block;
          font-size: 9px;
          font-weight: 700;
          color: rgba(255,255,255,0.92);
          text-shadow: 0 1px 3px rgba(0,0,0,0.9), 0 -1px 3px rgba(0,0,0,0.9),
                       1px 0 3px rgba(0,0,0,0.9), -1px 0 3px rgba(0,0,0,0.9);
          white-space: nowrap;
          letter-spacing: 0.3px;
          line-height: 1.2;
        }
        .ct-prayer {
          display: block;
          font-size: 8px;
          font-weight: 600;
          color: rgba(255,255,255,0.7);
          text-shadow: 0 1px 2px rgba(0,0,0,0.9), 0 -1px 2px rgba(0,0,0,0.9);
          white-space: nowrap;
          line-height: 1.2;
        }
        /* Popup */
        .leaflet-popup-content-wrapper, .leaflet-popup-tip {
          background: rgba(9,9,11,0.97) !important;
          backdrop-filter: blur(16px) !important;
          border: 1px solid rgba(255,255,255,0.12) !important;
          color: white !important;
          box-shadow: 0 25px 50px -12px rgba(0,0,0,0.9) !important;
          border-radius: 12px !important;
        }
        .leaflet-popup-content { margin: 12px !important; }
        .leaflet-popup-close-button { color: #64748b !important; top: 6px !important; right: 8px !important; }
        .leaflet-control-zoom { background: rgba(9,9,11,0.85) !important; border: 1px solid rgba(255,255,255,0.1) !important; border-radius: 8px !important; overflow: hidden; }
        .leaflet-control-zoom a { color: #94a3b8 !important; background: transparent !important; }
        .leaflet-control-attribution { background: rgba(9,9,11,0.7) !important; color: #334155 !important; font-size: 9px !important; }
      `}} />
    </div>
  );
}
