import React from "react";

export default function StatusBar() {
  const marqueeItems = [
    "BTC +2.4% | NASDAQ +1.5% | VENTURE-INDEX: STABLE | GROWTH FORECASTS ACTIVE",
    "EFFICIENCY: +15.5% | HARVEST COEF: PEAK | INFRASTRUCTURE: 42% | SYNC: OPTIMAL",
    "ENCRYPTION: ACTIVE | SECTOR STATS: LIVE | ADVISORY UPLINKS: COMPLETED",
  ];

  return (
    <footer className="fixed bottom-0 left-0 w-full h-8 bg-obsidian/80 backdrop-blur-xl border-t border-white/[0.04] flex items-center px-6 overflow-hidden whitespace-nowrap z-50 select-none font-mono text-[9px]">
      <div className="flex items-center gap-3 mr-8 shrink-0 border-r border-white/5 pr-6 h-full">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
          <span className="text-neutral-500 font-bold uppercase tracking-[0.1em]">
            System Status
          </span>
        </div>
        <span className="text-emerald-500 font-bold uppercase tracking-widest">
          Active
        </span>
      </div>

      {/* Repeating scrolling marquee */}
      <div className="flex-1 overflow-hidden relative w-full h-full flex items-center">
        <div className="animate-marquee whitespace-nowrap flex gap-20 text-neutral-500 tracking-[0.15em] font-medium uppercase">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} className="flex items-center gap-3">
              {item}
              <span className="text-brand-orange opacity-30 text-[7px]">❖</span>
            </span>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
      `}</style>
    </footer>
  );
}
