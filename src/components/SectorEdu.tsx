import React, { useState, useEffect } from "react";
import { ZoomIn, ZoomOut, Layers, School, Award, Terminal, Users, GraduationCap, TrendingUp, ShieldCheck } from "lucide-react";
import IsometricWorld from "./IsometricWorld";
import { motion } from "motion/react";
import CountUp from "./CountUp";

interface SectorEduProps {
  stats: {
    liquidity: number;
    retention: number;
    financeStrategy: string;
    hrAdvisory: string;
    totalEvaluation: string;
  };
  logs: string[];
  onChangeStat: (updater: any) => void;
  loading: boolean;
}

export default function SectorEdu({ stats, logs, onChangeStat, loading }: SectorEduProps) {
  const [classroomsActive, setClassroomsActive] = useState(42);
  const [busesActive, setBusesActive] = useState(12);
  const [workstationsActive, setWorkstationsActive] = useState(850);
  const [staffActive, setStaffActive] = useState(142);

  return (
    <div className="flex flex-col gap-8 h-full">
      {/* Header telemetry subtitle values */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-white/5 pb-6 shrink-0">
        <div className="space-y-1">
          <h1 className="text-3xl md:text-4xl font-extrabold font-display text-white tracking-tight uppercase">
            Education Academy
          </h1>
          <p className="font-mono text-[10px] text-neutral-500 tracking-widest uppercase flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-orange"></span>
            LTV & Retention Monitoring Active
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-4">
          <div className="px-4 py-2 bg-white/[0.03] border border-white/10 rounded-xl flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
             <span className="font-mono text-[10px] text-neutral-400 font-bold tracking-widest uppercase">Real-time Sync</span>
          </div>
          <div className="text-right">
             <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-0.5">Total Valuation</p>
             <p className="text-xl font-display font-extrabold text-brand-orange tracking-tight">{stats.totalEvaluation || "$42.8M"}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8 items-stretch flex-1">
        {/* LEFT PANEL: Core KPIs */}
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-6">
           {/* Card 1: Student Retention */}
           <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between h-[200px] card-hover-effect">
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-xl bg-brand-orange/10 flex items-center justify-center border border-brand-orange/20">
                  <Users className="w-5 h-5 text-brand-orange" />
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded tracking-tighter">+4.2%</span>
                </div>
              </div>
              <div>
                <h3 className="text-[11px] font-bold text-neutral-500 uppercase tracking-widest leading-none mb-2">Student Retention</h3>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-4xl font-display font-extrabold text-white tracking-tight">
                    <CountUp value={stats.retention} suffix="%" />
                  </span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={stats.retention}
                  onChange={(e) => onChangeStat({ retention: parseInt(e.target.value) })}
                  className="w-full accent-brand-orange h-1.5 bg-transparent cursor-pointer"
                />
              </div>
           </div>

           {/* Card 2: Liquidity Reserve */}
           <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between h-[200px] card-hover-effect">
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                  <TrendingUp className="w-5 h-5 text-amber-500" />
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded tracking-tighter">OPTIMAL</span>
                </div>
              </div>
              <div>
                <h3 className="text-[11px] font-bold text-neutral-500 uppercase tracking-widest leading-none mb-2">Liquidity Reserve</h3>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-4xl font-display font-extrabold text-white tracking-tight">
                    <CountUp value={stats.liquidity} suffix="%" />
                  </span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={stats.liquidity}
                  onChange={(e) => onChangeStat({ liquidity: parseInt(e.target.value) })}
                  className="w-full accent-amber-500 h-1.5 bg-transparent cursor-pointer"
                />
              </div>
           </div>

           {/* Advisor Status */}
           <div className="glass-panel p-6 rounded-2xl flex-1 bg-gradient-to-br from-brand-orange/[0.03] to-transparent">
              <div className="flex items-center gap-3 mb-6">
                 <ShieldCheck className="w-5 h-5 text-brand-orange" />
                 <h3 className="text-[11px] font-bold text-white uppercase tracking-widest">Strategy Overview</h3>
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-tighter">
                    Finance Advisory
                  </p>

                  <div
                    className={`p-3 rounded-xl border ${
                      stats.financeStrategy?.includes("CRITICAL")
                        ? "border-red-500 bg-red-500/10 animate-pulse"
                        : stats.financeStrategy?.includes("HEALTHY")
                        ? "border-emerald-500 bg-emerald-500/10"
                        : "border-yellow-500 bg-yellow-500/10"
                    }`}
                  >
                    <p className="text-xs text-white leading-relaxed font-medium">
                      {stats.financeStrategy ||
                        "Liquidity levels stable. Maintain current strategy."}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-tighter">HR Insights</p>
                  <p className="text-xs text-neutral-300 leading-relaxed italic border-l-2 border-amber-500/30 pl-3">
                    &ldquo;{stats.hrAdvisory || "Talent acquisition benchmarks met for Q4."}&rdquo;
                  </p>
                </div>
              </div>
           </div>
        </div>

        {/* CENTER PANEL: Simulation Viewport */}
        <div className="col-span-12 lg:col-span-9 flex flex-col gap-8">
           <div className="flex-1 glass-panel rounded-3xl overflow-hidden relative border-white/[0.08]">
              <IsometricWorld sector="EDUCATION" stats={stats} onChangeStat={onChangeStat} />
           </div>

           {/* Bottom Details */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 shrink-0 h-[180px]">
              <div className="glass-panel p-6 rounded-2xl flex flex-col">
                <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
                  <span className="text-[10px] font-bold text-white uppercase tracking-widest">Active Assets</span>
                  <Layers className="w-4 h-4 text-brand-orange opacity-50" />
                </div>
                <div className="grid grid-cols-2 gap-4 flex-1">
                   {[
                     { label: "Research Hubs", val: `${classroomsActive} units` },
                     { label: "Lecture Nodes", val: `${workstationsActive} units` }
                   ].map((a, i) => (
                     <div key={i} className="bg-white/[0.02] p-3 rounded-xl border border-white/5 flex flex-col justify-center">
                       <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-tighter mb-1">{a.label}</span>
                       <span className="text-sm font-bold text-white">{a.val}</span>
                     </div>
                   ))}
                </div>
              </div>

              <div className="glass-panel p-6 rounded-2xl flex flex-col overflow-hidden">
                <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
                  <span className="text-[10px] font-bold text-white uppercase tracking-widest">Sector Logs</span>
                  <Terminal className="w-4 h-4 text-brand-orange opacity-50" />
                </div>
                <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar pr-2">
                   {loading ? (
                     <p className="text-[10px] font-mono text-brand-orange animate-pulse">SYSTEM_SYNCING...</p>
                   ) : (
                     logs.map((l, i) => (
                       <div key={i} className="flex gap-2 text-[10px] font-mono text-neutral-400 border-b border-white/[0.03] pb-1.5 last:border-0">
                         <span className="text-brand-orange/50 shrink-0">&gt;</span>
                         <span className="text-neutral-300">{l}</span>
                       </div>
                     ))
                   )}
                </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
