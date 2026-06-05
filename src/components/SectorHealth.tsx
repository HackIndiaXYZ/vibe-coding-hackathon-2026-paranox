import React, { useState, useEffect } from "react";
import { ZoomIn, ZoomOut, Layers, Eye, RefreshCw, Activity, HeartPulse, ShieldCheck, FlaskConical, Beaker } from "lucide-react";
import IsometricWorld from "./IsometricWorld";
import { motion } from "motion/react";
import CountUp from "./CountUp";

interface SectorHealthProps {
  stats: {
    bioAnalyzersEfficiency: number;
    throughputDaily: number;
    sterilityLevel: string;
    researchProgress: number;
    activeSyntheses: string;
    neuralSyncStatus: string;
    totalEvaluation: string;
  };
  onChangeStat: (updater: any) => void;
  loading: boolean;
}

export default function SectorHealth({ stats, onChangeStat, loading }: SectorHealthProps) {
  const [synthsCompleted, setSynthsCompleted] = useState(62);
  const [throughput, setThroughput] = useState(1.4);

  return (
    <div className="flex flex-col gap-8 h-full">
      {/* Header telemetry subtitle values */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-white/5 pb-6 shrink-0">
        <div className="space-y-1">
          <h1 className="text-3xl md:text-4xl font-extrabold font-display text-white tracking-tight uppercase">
            Biotech Medical Lab
          </h1>
          <p className="font-mono text-[10px] text-neutral-500 tracking-widest uppercase flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-orange"></span>
            R&D & Throughput Monitoring Active
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-4">
          <div className="px-4 py-2 bg-white/[0.03] border border-white/10 rounded-xl flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
             <span className="font-mono text-[10px] text-neutral-400 font-bold tracking-widest uppercase">System Core: Cloud-Alpha</span>
          </div>
          <div className="text-right">
             <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-0.5">Total Valuation</p>
             <p className="text-xl font-display font-extrabold text-brand-orange tracking-tight">{stats.totalEvaluation || "$42.8M"}</p>
          </div>
        </div>
      </div>

      {/* Main Medical Viewport & Key Metric Cards */}
      <div className="grid grid-cols-12 gap-8 items-stretch flex-1">
        {/* CENTER VIEWPORT: Biolab wing visualizer render */}
        <div className="col-span-12 lg:col-span-8 flex flex-col">
          <div className="flex-1 glass-panel rounded-3xl overflow-hidden relative border-white/[0.08]">
            <IsometricWorld sector="HEALTHCARE" stats={stats} onChangeStat={onChangeStat} />
          </div>
        </div>

        {/* RIGHT SIDEBAR PANEL: Biolab draggable status parameter cards */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-4">
          {/* Card 1: Bio-Analyzers Efficiency */}
          <div className="glass-panel p-5 rounded-2xl flex items-center justify-between card-hover-effect">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-brand-orange/10 flex items-center justify-center border border-brand-orange/20">
                <RefreshCw className="w-5 h-5 text-brand-orange" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest leading-none mb-1.5">
                  Bio-Analyzers
                </p>
                <p className="font-bold text-sm text-white">
                  {stats.bioAnalyzersEfficiency}% Efficiency
                </p>
              </div>
            </div>
            <input
              type="range"
              min="40"
              max="100"
              value={stats.bioAnalyzersEfficiency}
              onChange={(e) => onChangeStat({ bioAnalyzersEfficiency: parseInt(e.target.value) })}
              className="w-24 accent-brand-orange bg-transparent cursor-pointer"
            />
          </div>

          {/* Card 2: Patient Throughput stats index */}
          <div className="glass-panel p-5 rounded-2xl flex items-center justify-between card-hover-effect">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                <Eye className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest leading-none mb-1.5">
                  Throughput
                </p>
                <p className="font-bold text-sm text-white">
                  {throughput}k / Day
                </p>
              </div>
            </div>
            <input
              type="range"
              min="0.5"
              max="5.0"
              step="0.1"
              value={throughput}
              onChange={(e) => setThroughput(parseFloat(e.target.value))}
              className="w-24 accent-amber-500 bg-transparent cursor-pointer"
            />
          </div>

          {/* Card 3: Sterility parameters Grade levels */}
          <div className="glass-panel p-5 rounded-2xl flex items-center justify-between card-hover-effect">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest leading-none mb-1.5">
                  Sterility
                </p>
                <p className="font-bold text-sm text-white">
                  {stats.sterilityLevel}
                </p>
              </div>
            </div>
            <div className="flex gap-1.5">
              {["A+", "B", "C"].map((grade) => (
                <button
                  key={grade}
                  onClick={() => onChangeStat({ sterilityLevel: `Grade ${grade}` })}
                  className={`w-3.5 h-3.5 rounded-full transition-all border ${
                    stats.sterilityLevel.includes(grade) 
                      ? "bg-emerald-500 border-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.4)]" 
                      : "bg-white/5 border-white/10"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Card 4: Research Progress Index visual metric */}
          <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between flex-1 card-hover-effect">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                 <h3 className="text-[11px] font-bold text-neutral-500 uppercase tracking-widest">Research Progress</h3>
                 <FlaskConical className="w-4 h-4 text-brand-orange opacity-40" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-display font-extrabold text-white tracking-tight">
                  <CountUp value={stats.researchProgress} suffix="%" />
                </span>
              </div>
              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-brand-orange to-amber-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${stats.researchProgress}%` }}
                  transition={{ duration: 0.8 }}
                />
              </div>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              value={stats.researchProgress}
              onChange={(e) => onChangeStat({ researchProgress: parseInt(e.target.value) })}
              className="w-full accent-amber-500 bg-transparent cursor-pointer h-1.5 mt-4"
            />
          </div>
        </div>
      </div>

      {/* BOTTOM RIG AI DIAGNOSTICS & ACTIVE DRUG SYNTHESIS SUB-PANELS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 shrink-0">
        {/* DIAGNOSTIC CLINICAL SERVICES AI card */}
        <div className="glass-panel p-6 rounded-2xl border-l-4 border-brand-orange card-hover-effect flex flex-col justify-between h-[200px]">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-brand-orange/10 flex items-center justify-center border border-brand-orange/20">
                <Activity className="w-6 h-6 text-brand-orange" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white tracking-tight">Diagnostic Clinical AI</h3>
                <p className="text-[10px] font-mono text-neutral-500 uppercase mt-0.5">Instance: Core-7</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
               <span className="text-[10px] font-mono font-bold text-brand-orange">4MS</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center text-[10px] font-mono font-bold">
              <span className="text-neutral-500 uppercase tracking-widest">Neural Sync Status</span>
              <span className="text-brand-orange">{stats.neuralSyncStatus}</span>
            </div>
            <div className="h-14 flex items-end gap-1 px-4 bg-white/[0.02] border border-white/5 rounded-xl overflow-hidden">
              {[0.35, 0.75, 0.5, 0.92, 0.45, 0.8, 0.25, 0.6, 0.4, 0.85, 0.3, 0.7, 0.55].map((h, i) => (
                <motion.div 
                  key={i}
                  animate={{ height: [`${h * 20}%`, `${h * 100}%`, `${h * 20}%`] }}
                  transition={{ duration: 1 + Math.random(), repeat: Infinity, ease: "easeInOut" }}
                  className="flex-1 bg-brand-orange/40 rounded-t-sm"
                />
              ))}
            </div>
          </div>
        </div>

        {/* PHARMA AI LAB card */}
        <div className="glass-panel p-6 rounded-2xl border-l-4 border-amber-500 card-hover-effect flex flex-col justify-between h-[200px]">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                <Beaker className="w-6 h-6 text-amber-500" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white tracking-tight">Pharma Synthesis AI</h3>
                <p className="text-[10px] font-mono text-neutral-500 uppercase mt-0.5">Synthesis: Synth-X</p>
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold text-amber-500">LOAD: {synthsCompleted}%</span>
          </div>

          <div className="space-y-4">
             <div className="h-1.5 flex gap-1.5">
                {[25, 50, 75, 95].map(threshold => (
                  <div 
                    key={threshold}
                    className={`flex-1 rounded-full transition-all duration-500 ${
                      synthsCompleted >= threshold ? "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]" : "bg-white/5"
                    }`}
                  />
                ))}
             </div>
             <input
                type="range"
                min="10"
                max="100"
                value={synthsCompleted}
                onChange={(e) => setSynthsCompleted(parseInt(e.target.value))}
                className="accent-amber-500 w-full cursor-pointer h-1.5"
              />
            <p className="text-[11px] font-medium text-neutral-400 italic leading-relaxed line-clamp-2">
              &ldquo;{stats.activeSyntheses || "Analyzing protein sequences for Beta-Variant treatment."}&rdquo;
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
