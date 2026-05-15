"use client";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useEffect, useState } from "react";

const baseData = [
  { time: "00:00", active: 2400, label: "Late Night" },
  { time: "02:00", active: 1800, label: "Pre-Fajr" },
  { time: "04:00", active: 8900, label: "Fajr Peak" },
  { time: "06:00", active: 4200, label: "Post-Fajr" },
  { time: "08:00", active: 3200, label: "Morning" },
  { time: "10:00", active: 2900, label: "Mid-Morning" },
  { time: "12:00", active: 7500, label: "Dhuhr Peak" },
  { time: "14:00", active: 5100, label: "Post-Dhuhr" },
  { time: "15:30", active: 6800, label: "Asr Peak" },
  { time: "17:00", active: 5400, label: "Post-Asr" },
  { time: "18:30", active: 9200, label: "Maghrib Peak" },
  { time: "19:30", active: 7800, label: "Isha Phase" },
  { time: "20:00", active: 8500, label: "Isha Peak" },
  { time: "22:00", active: 5200, label: "Late Isha" },
  { time: "23:59", active: 3400, label: "Night" },
];

export function ActivityChart() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-[300px] w-full mt-4 flex items-center justify-center">
        <div className="text-slate-500 text-sm">Loading chart...</div>
      </div>
    );
  }

  return (
    <div className="h-[300px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={baseData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <defs>
            <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="time"
            stroke="#334155"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#64748b" }}
          />
          <YAxis
            stroke="#334155"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#64748b" }}
            tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#0f172a",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "10px",
              boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
            }}
            labelStyle={{ color: "#94a3b8", fontSize: 12 }}
            itemStyle={{ color: "#06b6d4", fontSize: 12 }}
            formatter={(val) => [`${(Number(val) / 1000).toFixed(1)}k`, "Cities in Prayer"]}
          />
          <Area
            type="monotone"
            dataKey="active"
            stroke="#06b6d4"
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#colorActive)"
            dot={false}
            activeDot={{ r: 4, fill: "#06b6d4", stroke: "#fff", strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
