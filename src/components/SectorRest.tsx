import React, { useState, useEffect } from "react";
import { ZoomIn, ZoomOut, Thermometer, ShieldAlert, Zap, Layers, RefreshCw, ChefHat, Truck, TrendingUp, Sparkles } from "lucide-react";
import IsometricWorld from "./IsometricWorld";
import { motion } from "motion/react";
import CountUp from "./CountUp";

interface SectorRestProps {
  stats: {
    revenueVelocity: number;
    proteinFreshness: number;
    produceFreshness: number;
    kitchenLoad: number;
    totalEvaluation: string;
  };
  logs: string[];
  onChangeStat: (updater: any) => void;
  loading: boolean;
}

export default function SectorRest({ stats, logs, onChangeStat, loading }: SectorRestProps) {
  const [activeDrones, setActiveDrones] = useState([
    { id: 1, ok: true },
    { id: 2, ok: true },
    { id: 3, ok: true },
    { id: 4, ok: true },
    { id: 5, ok: true },
    { id: 6, ok: false }, // warning
    { id: 7, ok: true },
    { id: 8, ok: true },
  ]);

  const [efficiencyRating, setEfficiencyRating] = useState(98.4);

  // Slowly fluctuate efficiency vector to feel highly alive!
  useEffect(() => {
    const interval = setInterval(() => {
      setEfficiencyRating((prev) => {
        const delta = (Math.random() - 0.5) * 0.4;
        return parseFloat(Math.min(Math.max(prev + delta, 96.0), 99.9).toFixed(1));
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col gap-8 h-full">
      {/* Header telemetry */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-white/5 pb-6 shrink-0">
        <div className="space-y-1">
          <h1 className="text-3xl md:text-4xl font-extrabold font-display text-white tracking-tight uppercase">
            Gourmet Food Grid
          </h1>
          <p className="font-mono text-[10px] text-neutral-500 tracking-widest uppercase flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-orange"></span>
            Revenue & Freshness Monitoring Active
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-4">
          <div className="px-4 py-2 bg-white/[0.03] border border-white/10 rounded-xl flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
             <span className="font-mono text-[10px] text-neutral-400 font-bold tracking-widest uppercase">Nodes Online</span>
          </div>
          <div className="text-right">
             <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-0.5">Total Valuation</p>
             <p className="text-xl font-display font-extrabold text-brand-orange tracking-tight">{stats.totalEvaluation || "$42.8M"}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8 items-stretch flex-1">
        {/* LEFT PANEL: AI & Drones */}
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-6">
           <div className="glass-panel p-6 rounded-2xl flex flex-col gap-6">
              <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                 <Sparkles className="w-5 h-5 text-brand-orange" />
                 <h3 className="text-[11px] font-bold text-white uppercase tracking-widest">Culinary AI</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                  <div className="w-9 h-9 rounded-lg bg-brand-orange/10 flex items-center justify-center border border-brand-orange/20">
                    <Thermometer className="w-4 h-4 text-brand-orange" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-neutral-500 uppercase">Thermal Load</p>
                    <p className="text-xs font-bold text-white">92.4% Optimal</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                  <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                    <Zap className="w-4 h-4 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-neutral-500 uppercase">Energy Sync</p>
                    <p className="text-xs font-bold text-white">Grid Active</p>
                  </div>
                </div>
              </div>
           </div>

           <div className="glass-panel p-6 rounded-2xl flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
                 <h3 className="text-[11px] font-bold text-white uppercase tracking-widest">Service Array</h3>
                 <Truck className="w-4 h-4 text-neutral-500" />
              </div>
              <div className="flex flex-wrap gap-2.5">
                {activeDrones.map((drone) => (
                  <div
                    key={drone.id}
                    className={`w-4 h-4 rounded-full transition-all duration-500 ${
                      drone.ok 
                        ? "bg-brand-orange shadow-[0_0_10px_rgba(255,122,0,0.4)]" 
                        : "bg-neutral-800"
                    }`}
                  />
                ))}
              </div>
              <div className="mt-auto pt-6 border-t border-white/5">
                 <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-1">Efficiency Rating</p>
                 <p className="text-2xl font-display font-extrabold text-white">{efficiencyRating}%</p>
              </div>
           </div>
        </div>

        {/* CENTER PANEL: Dashboard Viewport */}
        <div className="col-span-12 lg:col-span-6 flex flex-col">
           <div className="flex-1 glass-panel rounded-3xl overflow-hidden relative border-white/[0.08]">
              <IsometricWorld sector="RESTAURANT" stats={stats} onChangeStat={onChangeStat} />
           </div>
        </div>

        {/* RIGHT PANEL: KPIs */}
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-6">
           {/* Card 1: Revenue Velocity */}
           <div className="glass-panel p-6 rounded-2xl card-hover-effect">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-xl bg-brand-orange/10 flex items-center justify-center border border-brand-orange/20">
                  <TrendingUp className="w-5 h-5 text-brand-orange" />
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">LIVE</span>
                </div>
              </div>
              <div className="space-y-1 mb-4">
                <h3 className="text-[11px] font-bold text-neutral-500 uppercase tracking-widest leading-none">Revenue Velocity</h3>
                <p className="text-3xl font-display font-extrabold text-white tracking-tight">
                  <CountUp value={stats.revenueVelocity.toLocaleString()} prefix="$" suffix="/hr" />
                </p>
              </div>
              <input
                type="range"
                min="2000"
                max="20000"
                step="500"
                value={stats.revenueVelocity}
                onChange={(e) => onChangeStat({ revenueVelocity: parseInt(e.target.value) })}
                className="w-full accent-brand-orange h-1.5 bg-transparent cursor-pointer"
              />
           </div>

           {/* Card 2: Freshness Indices */}
           <div className="glass-panel p-6 rounded-2xl card-hover-effect">
              <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
                 <ChefHat className="w-5 h-5 text-amber-500" />
                 <h3 className="text-[11px] font-bold text-white uppercase tracking-widest">Freshness Index</h3>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white/[0.02] border border-white/5 p-3 rounded-xl">
                  <span className="text-[9px] font-bold text-neutral-500 uppercase block mb-1">Protein</span>
                  <span className="text-xl font-display font-extrabold text-white">{stats.proteinFreshness}%</span>
                </div>
                <div className="bg-white/[0.02] border border-white/5 p-3 rounded-xl">
                  <span className="text-[9px] font-bold text-neutral-500 uppercase block mb-1">Produce</span>
                  <span className="text-xl font-display font-extrabold text-white">{stats.produceFreshness}%</span>
                </div>
              </div>
              <div className="space-y-3">
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={stats.proteinFreshness}
                  onChange={(e) => onChangeStat({ proteinFreshness: parseInt(e.target.value) })}
                  className="w-full accent-amber-500 h-1.5 bg-transparent cursor-pointer"
                />
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={stats.produceFreshness}
                  onChange={(e) => onChangeStat({ produceFreshness: parseInt(e.target.value) })}
                  className="w-full accent-amber-500 h-1.5 bg-transparent cursor-pointer"
                />
              </div>
           </div>

           {/* Card 3: Kitchen Load */}
           <div className="glass-panel p-6 rounded-2xl border-l-4 border-amber-600 card-hover-effect">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-[11px] font-bold text-neutral-500 uppercase tracking-widest">Kitchen Load</h3>
                <ShieldAlert className="w-4 h-4 text-amber-600" />
              </div>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-4xl font-display font-extrabold text-white tracking-tight">
                  <CountUp value={stats.kitchenLoad} suffix="%" />
                </span>
                {stats.kitchenLoad >= 80 && (
                  <span className="text-[10px] font-bold text-amber-600 animate-pulse uppercase tracking-tighter">Warning</span>
                )}
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={stats.kitchenLoad}
                onChange={(e) => onChangeStat({ kitchenLoad: parseInt(e.target.value) })}
                className="w-full accent-amber-600 h-1.5 bg-transparent cursor-pointer"
              />
           </div>
        </div>
      </div>
    </div>
  );
}
