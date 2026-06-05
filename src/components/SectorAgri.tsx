import React, { useState, useEffect } from "react";
import { Camera, RefreshCw, Layers, Server, Sparkles, Droplets, Box, Plane, TrendingUp } from "lucide-react";
import IsometricWorld from "./IsometricWorld";
import { motion, AnimatePresence } from "motion/react";
import CountUp from "./CountUp";

interface SectorAgriProps {
  stats: {
    waterReserves: number;
    hydroponicCount: number;
    harvestDronesCount: number;
    cropYieldDelta: number;
    totalEvaluation: string;
  };
  logs: string[];
  onChangeStat: (updater: any) => void;
  loading: boolean;
}

export default function SectorAgri({ stats, logs, onChangeStat, loading }: SectorAgriProps) {
  const [soilAlpha, setSoilAlpha] = useState(75);
  const [atmosphereDrafts, setAtmosphereDrafts] = useState(50);

  // Simulated events pool
  const [systemLogs, setSystemLogs] = useState([
    { time: "14:02", msg: "Drone_04 initialized nutrient irrigation.", type: "info" },
    { time: "13:58", msg: "Water quality index optimal in Reservoir B.", type: "success" },
    { time: "13:45", msg: "Venture harvest forecast updated: 94% yield.", type: "system" },
    { time: "13:40", msg: "Soil moisture values calibrated.", type: "info" },
  ]);

  // Periodic random logs insertion to feel highly telemetry dense
  useEffect(() => {
    const randomMsgs = [
      "Micro-nutrient injection completed.",
      "Root zone oxygen index: OPTIMAL.",
      "Photosynthetic index stabilizing.",
      "Atmospheric humidity calibrated.",
      "Drone fleet automated recharge."
    ];

    const interval = setInterval(() => {
      const randomMsg = randomMsgs[Math.floor(Math.random() * randomMsgs.length)];
      setSystemLogs((prev) => {
        const now = new Date();
        const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(
          now.getMinutes()
        ).padStart(2, "0")}`;
        return [
          { time: timeStr, msg: randomMsg, type: "info" },
          ...prev.slice(0, 5),
        ];
      });
    }, 9000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-12 gap-8 h-full">
      {/* LEFT COLUMN: AI Control & Water Index */}
      <div className="col-span-12 lg:col-span-3 flex flex-col gap-8">
        {/* Advisor Control Panel */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col h-fit">
          <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
            <div>
              <h3 className="text-[11px] font-bold text-neutral-500 uppercase tracking-widest leading-none mb-1">Advisor Center</h3>
              <p className="text-white font-display font-bold text-sm">Agri-Strategy AI</p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-brand-orange/10 flex items-center justify-center border border-brand-orange/20">
              <Sparkles className="w-4 h-4 text-brand-orange" />
            </div>
          </div>

          <div className="space-y-6">
            {/* Strategy CARD 1: Soil AI */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-orange"></div>
                  <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-tight">Irrigation Load</span>
                </div>
                <span className="text-[11px] font-mono font-bold text-brand-orange">{soilAlpha}%</span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-brand-orange"
                  initial={{ width: 0 }}
                  animate={{ width: `${soilAlpha}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <input
                type="range"
                min="20"
                max="100"
                value={soilAlpha}
                onChange={(e) => setSoilAlpha(parseInt(e.target.value))}
                className="w-full accent-brand-orange h-1 bg-transparent cursor-pointer"
              />
            </div>

            {/* Strategy CARD 2: Climate AI */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                  <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-tight">Market Forecast</span>
                </div>
                <span className="text-[11px] font-mono font-bold text-amber-500">{atmosphereDrafts}%</span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-amber-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${atmosphereDrafts}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <input
                type="range"
                min="20"
                max="100"
                value={atmosphereDrafts}
                onChange={(e) => setAtmosphereDrafts(parseInt(e.target.value))}
                className="w-full accent-amber-500 h-1 bg-transparent cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Reservoirs Index */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col flex-1">
          <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
            <div>
              <h3 className="text-[11px] font-bold text-neutral-500 uppercase tracking-widest leading-none mb-1">Reservoirs</h3>
              <p className="text-white font-display font-bold text-sm">Storage Index</p>
            </div>
            <Droplets className="w-4 h-4 text-brand-orange opacity-40" />
          </div>

          <div className="flex-1 flex flex-col justify-between">
            <div className="flex items-baseline justify-between mb-8">
              <span className="text-4xl font-display font-extrabold text-white tracking-tight leading-none">
                <CountUp value={stats.waterReserves} suffix="%" />
              </span>
              <input
                type="range"
                min="20"
                max="100"
                value={Math.round(stats.waterReserves)}
                onChange={(e) => onChangeStat({ waterReserves: parseFloat(e.target.value) })}
                className="accent-brand-orange w-24 cursor-pointer outline-none"
              />
            </div>

            {/* Visualizer bars */}
            <div className="h-32 w-full flex items-end gap-2">
              {[0.4, 0.6, 0.8, 0.95, 0.5].map((h, i) => (
                <div key={i} className="flex-1 relative group">
                   <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${h * 100}%` }}
                    className={`w-full rounded-t-lg transition-all duration-500 ${
                      i === 3 ? "bg-brand-orange shadow-[0_0_15px_rgba(255,122,0,0.3)]" : "bg-white/[0.04] group-hover:bg-white/[0.08]"
                    }`}
                   />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CENTER COLUMN: Main Simulation View */}
      <div className="col-span-12 lg:col-span-6 flex flex-col">
        <div className="flex-1 glass-panel rounded-3xl overflow-hidden relative">
          <IsometricWorld sector="AGRICULTURE" stats={stats} onChangeStat={onChangeStat} />
        </div>
      </div>

      {/* RIGHT COLUMN: KPIs & Logs */}
      <div className="col-span-12 lg:col-span-3 flex flex-col gap-8">
        <div className="grid grid-cols-1 gap-4">
          {/* KPI Card: Hydroponic Count */}
          <div className="glass-panel p-5 rounded-2xl card-hover-effect">
            <div className="flex items-center justify-between mb-4">
               <div className="w-8 h-8 rounded-lg bg-white/[0.03] flex items-center justify-center border border-white/5">
                <Box className="w-4 h-4 text-neutral-400" />
               </div>
               <span className="text-[10px] font-mono font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded tracking-tighter">+12.4%</span>
            </div>
            <div className="space-y-1 mb-4">
              <h3 className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest leading-none">Hydroponic Units</h3>
              <p className="text-2xl font-display font-extrabold text-white">
                <CountUp value={stats.hydroponicCount.toLocaleString()} />
              </p>
            </div>
            <input
              type="range"
              min="500"
              max="3000"
              step="50"
              value={stats.hydroponicCount}
              onChange={(e) => onChangeStat({ hydroponicCount: parseInt(e.target.value) })}
              className="w-full accent-brand-orange bg-transparent cursor-pointer"
            />
          </div>

          {/* KPI Card: Harvest Drones */}
          <div className="glass-panel p-5 rounded-2xl card-hover-effect">
            <div className="flex items-center justify-between mb-4">
               <div className="w-8 h-8 rounded-lg bg-white/[0.03] flex items-center justify-center border border-white/5">
                <Plane className="w-4 h-4 text-neutral-400" />
               </div>
               <span className="text-[10px] font-mono font-bold text-brand-orange bg-brand-orange/10 px-2 py-0.5 rounded tracking-tighter">ONLINE</span>
            </div>
            <div className="space-y-1 mb-4">
              <h3 className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest leading-none">Logistics Drones</h3>
              <p className="text-2xl font-display font-extrabold text-white">
                <CountUp value={stats.harvestDronesCount} />
              </p>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              value={stats.harvestDronesCount}
              onChange={(e) => onChangeStat({ harvestDronesCount: parseInt(e.target.value) })}
              className="w-full accent-amber-500 bg-transparent cursor-pointer"
            />
          </div>

          {/* KPI Card: Crop Yield */}
          <div className="glass-panel p-5 rounded-2xl card-hover-effect">
            <div className="flex items-center justify-between mb-4">
               <div className="w-8 h-8 rounded-lg bg-white/[0.03] flex items-center justify-center border border-white/5">
                <TrendingUp className="w-4 h-4 text-neutral-400" />
               </div>
               <span className="text-[10px] font-mono font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded tracking-tighter">{stats.cropYieldDelta}%</span>
            </div>
            <div className="space-y-1 mb-4">
              <h3 className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest leading-none">Current Yield</h3>
              <p className="text-2xl font-display font-extrabold text-white">14.8 T</p>
            </div>
            <input
              type="range"
              min="-10"
              max="15"
              step="0.5"
              value={stats.cropYieldDelta}
              onChange={(e) => onChangeStat({ cropYieldDelta: parseFloat(e.target.value) })}
              className="w-full accent-amber-600 bg-transparent cursor-pointer"
            />
          </div>
        </div>

        {/* Telemetry Logs */}
        <div className="flex-1 glass-panel rounded-2xl flex flex-col overflow-hidden min-h-[180px]">
          <div className="px-5 py-4 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
            <span className="text-[10px] font-bold text-white uppercase tracking-widest">Live Telemetry</span>
            <Server className="w-3.5 h-3.5 text-brand-orange" />
          </div>
          <div className="p-5 space-y-3 font-mono text-[10px] overflow-y-auto flex-1 custom-scrollbar">
            {loading ? (
              <p className="animate-pulse text-brand-orange font-bold uppercase tracking-widest">Syncing Grids...</p>
            ) : (
              systemLogs.map((log, index) => (
                <div key={index} className="flex gap-3 text-neutral-400 border-b border-white/[0.03] pb-2 last:border-0">
                  <span className="text-brand-orange/60 font-bold shrink-0">[{log.time}]</span>
                  <span className="text-neutral-300 leading-tight">{log.msg}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
