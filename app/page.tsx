"use client";
import { Earth } from "@/components/ui/earth";
import { motion } from "framer-motion";
import { Activity, Clock, Globe2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { WORLD_CITIES } from "@/lib/cities";
import { getCurrentPrayer, PRAYER_CONFIG } from "@/lib/prayer-times";

export default function Home() {
  const [utcTime, setUtcTime] = useState("");
  const [activePrayerInfo, setActivePrayerInfo] = useState<{ label: string; city: string } | null>(null);

  // UTC clock
  useEffect(() => {
    const tick = () =>
      setUtcTime(
        new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          timeZone: "UTC",
          hour12: false,
        }) + " UTC"
      );
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Find a representative active prayer from a major city
  useEffect(() => {
    const majorCities = WORLD_CITIES.filter((c) =>
      ["mecca", "istanbul", "jakarta", "london", "karachi"].includes(c.id)
    );
    for (const city of majorCities) {
      try {
        const prayer = getCurrentPrayer(city.lat, city.lng);
        if (prayer) {
          setActivePrayerInfo({ label: PRAYER_CONFIG[prayer].label, city: city.name });
          break;
        }
      } catch { /**/ }
    }
  }, []);

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center overflow-hidden">
      <div className="container mx-auto px-4 z-10 flex flex-col lg:flex-row items-center gap-12 pt-10">

        {/* ── Left: Hero text ──────────────────────────────────────────────── */}
        <motion.div
          className="flex-1 text-center lg:text-left space-y-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Live badge */}
          <div className="inline-flex items-center space-x-2 glass px-4 py-2 rounded-full border border-cyan-500/30 text-cyan-400 text-sm font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
            </span>
            <span>Live · {WORLD_CITIES.length} cities · 1.8B+ Muslims</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-tight">
            Global Prayer <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500">
              Intelligence
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto lg:mx-0">
            Realtime monitoring, visualization, and analysis of prayer times across{" "}
            <span className="text-white font-semibold">{WORLD_CITIES.length} cities</span> worldwide.
            Experience the continuous wave of prayers in a futuristic command center.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start pt-4">
            <Link
              href="/dashboard"
              className="px-8 py-4 rounded-lg bg-white text-slate-900 font-semibold hover:bg-slate-200 transition-colors flex items-center space-x-2 w-full sm:w-auto justify-center"
            >
              <span>Open Live Dashboard</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/world-map"
              className="px-8 py-4 rounded-lg glass border border-white/10 text-white font-semibold hover:bg-white/5 transition-colors flex items-center space-x-2 w-full sm:w-auto justify-center"
            >
              <Globe2 className="w-5 h-5" />
              <span>View World Map</span>
            </Link>
          </div>
        </motion.div>

        {/* ── Right: Globe ──────────────────────────────────────────────────── */}
        <motion.div
          className="flex-1 relative w-full"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 to-indigo-500/20 rounded-full blur-[100px] -z-10" />
          <Earth />

          {/* Floating card: UTC time */}
          <motion.div
            className="absolute top-10 -left-10 glass p-4 rounded-xl border border-white/10 shadow-2xl backdrop-blur-xl hidden md:block"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-cyan-500/20 rounded-lg">
                <Clock className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Global Sync Time</p>
                <p className="text-sm font-mono font-bold text-white">{utcTime || "00:00:00 UTC"}</p>
              </div>
            </div>
          </motion.div>

          {/* Floating card: Active prayer */}
          <motion.div
            className="absolute bottom-20 -right-4 glass p-4 rounded-xl border border-white/10 shadow-2xl backdrop-blur-xl hidden md:block"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-indigo-500/20 rounded-lg">
                <Activity className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Active Prayer Wave</p>
                <p className="text-sm font-semibold text-white">
                  {activePrayerInfo
                    ? `${activePrayerInfo.label} · ${activePrayerInfo.city}`
                    : "Calculating…"}
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </div>
  );
}
