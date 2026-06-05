import React, { useState } from "react";
import { Sector } from "../types";
import {
  GraduationCap,
  Sprout,
  UtensilsCrossed,
  HeartPulse,
  Rocket,
  HelpCircle,
  Terminal,
  Cpu,
  Lock,
  ChevronRight
} from "lucide-react";

interface SidebarProps {
  activeSector: Sector;
  onSectorChange: (sector: Sector) => void;
  onDeploy: (directive: string) => void;
  architectName: string;
}

export default function Sidebar({
  activeSector,
  onSectorChange,
  onDeploy,
  architectName,
}: SidebarProps) {
  const [showDeployInput, setShowDeployInput] = useState(false);
  const [directivePayload, setDirectivePayload] = useState("");

  const handleDeploySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!directivePayload.trim()) return;
    onDeploy(directivePayload);
    setDirectivePayload("");
    setShowDeployInput(false);
  };

  const navItems = [
    {
      id: "EDUCATION" as Sector,
      label: "Education Academy",
      icon: GraduationCap,
      description: "LTV & Retention"
    },
    {
      id: "AGRICULTURE" as Sector,
      label: "Harvest Supply Hub",
      icon: Sprout,
      description: "Yield & Logistics"
    },
    {
      id: "RESTAURANT" as Sector,
      label: "Gourmet Food Grid",
      icon: UtensilsCrossed,
      description: "Revenue & Freshness"
    },
    {
      id: "HEALTHCARE" as Sector,
      label: "Biotech Medical Lab",
      icon: HeartPulse,
      description: "R&D & Throughput"
    },
  ];

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-64px)] w-[280px] bg-obsidian/40 backdrop-blur-xl border-r border-white/[0.04] flex flex-col py-8 z-40 hidden lg:flex select-none">
      {/* Sector Control Dashboard Anchor Header */}
      <div className="px-6 mb-10">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-10 h-10 rounded-xl bg-brand-orange/10 flex items-center justify-center border border-brand-orange/20 shadow-lg shadow-brand-orange/5">
            <Cpu className="w-5 h-5 text-brand-orange" />
          </div>
          <div>
            <h2 className="text-[11px] font-bold tracking-widest text-neutral-500 uppercase">
              Venture Domains
            </h2>
            <p className="text-white font-display font-bold text-sm">
              Simulation Active
            </p>
          </div>
        </div>
        <div className="px-3 py-2 rounded-lg bg-white/[0.03] border border-white/5 flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
          <p className="text-[10px] text-neutral-400 font-mono uppercase tracking-tight">
            Founder: {architectName}
          </p>
        </div>
      </div>

      {/* Nav list sectors togglers */}
      <nav className="flex-1 space-y-1 px-3">
        {navItems.map((item) => {
          const isActive = activeSector === item.id;
          const Icon = item.icon;
          const isLocked = activeSector !== item.id;

          return (
            <button
              key={item.id}
              onClick={() => {
                if (isLocked) return;
                onSectorChange(item.id);
              }}
              style={{ cursor: isLocked ? "not-allowed" : "pointer" }}
              className={`w-full py-3 px-4 rounded-xl flex items-center justify-between transition-all duration-300 group relative ${
                isActive
                  ? "bg-brand-orange/5 text-white"
                  : "text-neutral-500 hover:bg-white/[0.03] hover:text-neutral-300"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                  isActive ? "bg-brand-orange/20 text-brand-orange" : "bg-white/[0.03] group-hover:bg-white/[0.06]"
                }`}>
                  <Icon className={`w-4 h-4 transition-transform ${isLocked ? "opacity-20" : "group-hover:scale-110"}`} />
                </div>
                <div className="text-left">
                  <span className={`block font-semibold text-[13px] tracking-tight ${isLocked ? "opacity-20" : ""}`}>
                    {item.label}
                  </span>
                  {!isLocked && (
                    <span className="block text-[10px] text-neutral-500 font-medium leading-none mt-0.5">
                      {item.description}
                    </span>
                  )}
                </div>
              </div>
              
              {isActive ? (
                <ChevronRight className="w-4 h-4 text-brand-orange animate-in slide-in-from-left-2 duration-300" />
              ) : isLocked ? (
                <Lock className="w-3 h-3 text-neutral-800" />
              ) : null}

              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-brand-orange rounded-r-full shadow-[0_0_12px_rgba(255,122,0,0.4)]"></div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Deploy Actions & parameters controllers */}
      <div className="px-6 mt-auto space-y-6 pt-6 border-t border-white/5">
        {showDeployInput ? (
          <form
            onSubmit={handleDeploySubmit}
            className="bg-obsidian border border-brand-orange/30 p-4 rounded-xl space-y-3 animate-in fade-in zoom-in duration-300 shadow-2xl shadow-brand-orange/5"
          >
            <label className="block text-[9px] font-bold text-brand-orange tracking-widest uppercase">
              Capital Directive
            </label>
            <input
              type="text"
              autoFocus
              placeholder="e.g. Upgrade facilities..."
              value={directivePayload}
              onChange={(e) => setDirectivePayload(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/10 rounded-lg text-xs px-3 py-2 text-white focus:border-brand-orange outline-none transition-all"
            />
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setShowDeployInput(false)}
                className="text-[10px] font-bold text-neutral-500 hover:text-white transition-colors"
              >
                CANCEL
              </button>
              <button
                type="submit"
                className="text-[10px] font-bold text-brand-orange hover:text-brand-orange-light transition-colors"
              >
                EXECUTE
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setShowDeployInput(true)}
            className="w-full py-4 bg-brand-orange hover:bg-brand-orange-light text-black font-bold rounded-xl transition-all flex items-center justify-center gap-2.5 text-[13px] shadow-lg shadow-brand-orange/20 active:scale-[0.98] group cursor-pointer"
          >
            <Rocket className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            <span>Deploy Capital</span>
          </button>
        )}

        <div className="flex items-center justify-between px-1">
          <button className="flex items-center gap-2 text-[11px] font-medium text-neutral-500 hover:text-white transition-colors cursor-pointer group">
            <HelpCircle className="w-3.5 h-3.5 text-brand-orange group-hover:scale-110 transition-transform" />
            <span>Advisory</span>
          </button>
          <button className="flex items-center gap-2 text-[11px] font-medium text-neutral-500 hover:text-white transition-colors cursor-pointer group">
            <Terminal className="w-3.5 h-3.5 text-brand-orange group-hover:scale-110 transition-transform" />
            <span>Logs</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
