"use client";
import createGlobe from "cobe";
import { useEffect, useRef, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { WORLD_CITIES } from "@/lib/cities";
import { getCurrentPrayer, PRAYER_CONFIG } from "@/lib/prayer-times";

// ─── Prayer color map → COBE [r,g,b] (0..1) ─────────────────────────────────
const PRAYER_RGB: Record<string, [number, number, number]> = {
  fajr:    [0.024, 0.714, 0.831],   // #06b6d4 cyan
  sunrise: [0.961, 0.620, 0.043],   // #f59e0b amber
  dhuhr:   [0.918, 0.702, 0.031],   // #eab308 yellow
  asr:     [0.976, 0.451, 0.086],   // #f97316 orange
  maghrib: [0.937, 0.267, 0.267],   // #ef4444 red
  isha:    [0.388, 0.400, 0.945],   // #6366f1 indigo
  none:    [0.220, 0.741, 0.973],   // #38bdf8 sky blue (fallback)
};

type PrayerKey = keyof typeof PRAYER_CONFIG;

function buildMarkers() {
  return WORLD_CITIES.map((city) => {
    let prayer: PrayerKey | null = null;
    try {
      prayer = getCurrentPrayer(city.lat, city.lng) as PrayerKey | null;
    } catch { /* safe fallback */ }

    const color = PRAYER_RGB[prayer ?? "none"];
    const size = city.muslimPopulation >= 70
      ? 0.09
      : city.muslimPopulation >= 30
      ? 0.065
      : 0.045;

    return {
      location: [city.lat, city.lng] as [number, number],
      size,
      color,
    };
  });
}

// ─── Component ────────────────────────────────────────────────────────────────
export function Earth({ className }: { className?: string }) {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const globeRef   = useRef<ReturnType<typeof createGlobe> | null>(null);
  const animRef    = useRef<number | undefined>(undefined);
  const phiRef     = useRef(0);

  // Expose current legend (prayer → color) for the mini-legend below globe
  const [legend, setLegend] = useState<{ label: string; color: string; count: number }[]>([]);

  // Build legend from WORLD_CITIES prayer states
  const refreshLegend = useCallback(() => {
    const counts: Partial<Record<string, number>> = {};
    for (const city of WORLD_CITIES) {
      try {
        const p = getCurrentPrayer(city.lat, city.lng) as string | null;
        const key = p ?? "none";
        counts[key] = (counts[key] ?? 0) + 1;
      } catch { /**/ }
    }
    const result = (Object.entries(PRAYER_CONFIG) as [PrayerKey, typeof PRAYER_CONFIG[PrayerKey]][])
      .filter(([k]) => (counts[k] ?? 0) > 0)
      .map(([k, cfg]) => ({ label: cfg.label, color: cfg.color, count: counts[k] ?? 0 }));
    setLegend(result);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const globe = createGlobe(canvas, {
      devicePixelRatio: 2,
      width:  canvas.offsetWidth * 2,
      height: canvas.offsetWidth * 2,
      phi:    0,
      theta:  0.3,
      dark:   1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor:  [0.06, 0.06, 0.10] as [number, number, number],
      glowColor:  [0.08, 0.08, 0.25] as [number, number, number],
      // markerColor is overridden per-marker below
      markerColor: [0.38, 0.40, 0.94] as [number, number, number],
      opacity: 0.92,
      markers: buildMarkers(),
    });
    globeRef.current = globe;

    // Animation loop
    function animate() {
      phiRef.current += 0.003;
      globe.update({ phi: phiRef.current });
      animRef.current = requestAnimationFrame(animate);
    }

    setTimeout(() => {
      canvas.style.opacity = "1";
      animate();
    }, 100);

    // Resize
    const onResize = () => {
      if (!canvas) return;
      const w = canvas.offsetWidth;
      globe.update({ width: w * 2, height: w * 2 });
    };
    window.addEventListener("resize", onResize);

    // Initial legend
    refreshLegend();

    // Refresh marker colors & legend every 60 seconds
    const colorInterval = setInterval(() => {
      globe.update({ markers: buildMarkers() });
      refreshLegend();
    }, 60_000);

    return () => {
      cancelAnimationFrame(animRef.current ?? 0);
      clearInterval(colorInterval);
      globe.destroy();
      window.removeEventListener("resize", onResize);
    };
  }, [refreshLegend]);

  return (
    <div className={cn("relative w-full max-w-[600px] m-auto", className)}>
      {/* Globe canvas */}
      <div className="aspect-square w-full">
        <canvas
          ref={canvasRef}
          className="w-full h-full opacity-0 transition-opacity duration-1000 ease-in-out"
          style={{ width: "100%", height: "100%", contain: "layout paint size" }}
        />
      </div>

      {/* Live color legend */}
      {legend.length > 0 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-wrap justify-center gap-x-3 gap-y-1 pointer-events-none">
          {legend.map(({ label, color, count }) => (
            <div key={label} className="flex items-center gap-1 text-[10px]">
              <span
                className="w-2 h-2 rounded-full inline-block"
                style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}` }}
              />
              <span style={{ color }} className="font-medium">
                {label}
              </span>
              <span className="text-slate-500">·{count}</span>
            </div>
          ))}
        </div>
      )}

      {/* Rotating label */}
      <div className="absolute top-2 right-2 text-[9px] text-slate-600 font-mono select-none">
        LIVE · {WORLD_CITIES.length} CITIES
      </div>
    </div>
  );
}
