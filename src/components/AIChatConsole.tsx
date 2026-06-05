import React, { useState } from "react";
import { Send, Terminal, Loader2, Sparkles, ChevronRight, MessageSquare } from "lucide-react";
import { Sector } from "../types";

interface AIChatConsoleProps {
  activeSector: Sector;
  onSimulationUpdate: (simulationData: {
    advisorComment: string;
    updatedStats: any;
    logs: string[];
    totalEvaluation: string;
  }) => void;
  architectName: string;
  landScale: number;
  verticalLimit: number;
  luaScript: string;
  currentStats: any;
}

export default function AIChatConsole({
  activeSector,
  onSimulationUpdate,
  architectName,
  landScale,
  verticalLimit,
  luaScript,
  currentStats,
}: AIChatConsoleProps) {
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [adviceHistory, setAdviceHistory] = useState<string[]>([
    "ADVISORY NETWORK INITIALIZED. STANDING BY FOR STRATEGIC DIRECTIVES.",
  ]);

  const presetDirectives = [
    "REALLOCATE RESERVES",
    "OPTIMIZE LOAD",
    "SCALE ASSETS",
    "FORECAST DEMAND",
  ];

  const handleDirectiveSubmit = async (e: React.FormEvent, customAction?: string) => {
    if (e) e.preventDefault();
    const action = customAction || inputText;
    if (!action.trim()) return;

    setLoading(true);
    setInputText("");

    try {
      const response = await fetch("/api/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sector: activeSector,
          action,
          architectName,
          landScale,
          verticalLimit,
          luaScript,
          currentStats,
        }),
      });

      if (!response.ok) {
        throw new Error("Simulation link error");
      }

      const data = await response.json();
      onSimulationUpdate(data);

      if (data.advisorComment) {
        setAdviceHistory((prev) => [data.advisorComment, ...prev]);
      }
    } catch (err) {
      console.error(err);
      setAdviceHistory((prev) => [
        "> [ERROR] ADVISORY LINK UNSTABLE. ATTEMPTING RECOVERY...",
        ...prev,
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-5 flex flex-col h-full hover:shadow-[0_0_30px_rgba(255,122,0,0.05)] transition-all relative overflow-hidden group">
      {/* Subtle top glow */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-orange/20 to-transparent"></div>
      
      <div className="flex flex-col flex-1">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-orange/10 flex items-center justify-center border border-brand-orange/20">
              <MessageSquare className="w-4 h-4 text-brand-orange" />
            </div>
            <div>
              <h3 className="text-[11px] font-bold tracking-widest text-neutral-500 uppercase leading-none mb-1">
                Advisory Board
              </h3>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-tighter">Terminal Live</span>
              </div>
            </div>
          </div>
          <Sparkles className="w-4 h-4 text-brand-orange animate-pulse" />
        </div>

        {/* Preset directive tag buttons */}
        <div className="grid grid-cols-2 gap-2 mb-6">
          {presetDirectives.map((preset, index) => (
            <button
              key={index}
              disabled={loading}
              onClick={(e) => handleDirectiveSubmit(e, preset)}
              className="text-[9px] font-bold text-neutral-400 bg-white/[0.03] border border-white/5 px-3 py-2.5 rounded-lg hover:bg-brand-orange/10 hover:text-brand-orange hover:border-brand-orange/30 transition-all cursor-pointer truncate disabled:opacity-50"
            >
              {preset}
            </button>
          ))}
        </div>

        {/* Advisory history terminal outputs */}
        <div className="flex-1 bg-black/40 p-4 rounded-xl border border-white/[0.03] overflow-hidden flex flex-col mb-5">
          <div className="flex items-center justify-between mb-3 px-1">
             <span className="text-[8px] font-bold text-neutral-600 uppercase tracking-[0.2em]">Telemetry History</span>
             <Terminal className="w-3 h-3 text-neutral-600" />
          </div>
          <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar pr-2">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-full gap-3 text-brand-orange">
                <Loader2 className="w-8 h-8 animate-spin opacity-50" />
                <span className="text-[9px] uppercase tracking-[0.3em] animate-pulse font-bold">
                  Evaluating...
                </span>
              </div>
            ) : (
              adviceHistory.map((adv, index) => (
                <div key={index} className="flex gap-3 items-start animate-fade-in-up">
                  <div className="mt-1 w-1.5 h-1.5 rounded-full bg-brand-orange/30 shrink-0" />
                  <span className="text-[11px] text-neutral-300 leading-relaxed font-mono selection:bg-brand-orange/30">
                    {adv}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Floating prompt interactive inputs form */}
      <form onSubmit={(e) => handleDirectiveSubmit(e)} className="flex gap-3 relative z-10">
        <div className="flex-1 bg-white/[0.03] border border-white/10 focus-within:border-brand-orange/40 rounded-xl transition-all flex items-center px-4 gap-3 group/input">
          <span className="text-brand-orange font-bold font-mono text-sm opacity-50 group-focus-within/input:opacity-100 transition-opacity">&gt;</span>
          <input
            type="text"
            className="w-full bg-transparent border-none text-[12px] py-4 outline-none font-mono text-white placeholder:text-neutral-600"
            placeholder="Send directive..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={loading}
          />
        </div>
        <button
          type="submit"
          disabled={loading || !inputText.trim()}
          className="bg-brand-orange text-black w-14 rounded-xl hover:bg-brand-orange-light transition-all flex items-center justify-center font-bold active:scale-90 disabled:opacity-50 disabled:active:scale-100 cursor-pointer shadow-lg shadow-brand-orange/10"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}
