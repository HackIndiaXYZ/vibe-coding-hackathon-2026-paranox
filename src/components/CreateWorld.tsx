import React, { useState, useMemo } from "react";
import { ArchitectConfig, Sector } from "../types";
import { 
  ArrowRight, 
  HelpCircle, 
  Settings, 
  ChevronDown, 
  TrendingUp, 
  Users, 
  Wallet, 
  Sparkles, 
  Cpu, 
  BarChart3,
  PieChart,
  Target,
  ShieldCheck,
  Zap,
  Globe,
  Rocket,
  Layers,
  ArrowUpRight,
  ChevronRight,
  CircleDot
} from "lucide-react";
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import CountUp from "./CountUp";

interface CreateWorldProps {
  onInitialize: (config: ArchitectConfig, sector: Sector) => void;
}

// Sub-component for a tiny sparkline chart
const Sparkline = ({ color = "#ff7a00" }: { color?: string }) => {
  return (
    <div className="w-16 h-8 overflow-hidden opacity-50">
      <svg viewBox="0 0 100 40" className="w-full h-full">
        <path
          d="M0,35 Q10,30 20,32 T40,25 T60,28 T80,15 T100,20"
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};

// Sub-component for a professional growth chart visual
const GrowthChart = () => {
  return (
    <div className="relative w-full h-full p-4 flex flex-col justify-between">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="text-[10px] font-semibold text-neutral-500 uppercase tracking-widest">Revenue Growth</h4>
          <p className="text-xl font-bold text-white">+$1.2M <span className="text-[10px] text-emerald-400 font-normal ml-1">↑ 24%</span></p>
        </div>
        <div className="flex gap-1">
          {[1, 2, 3].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-neutral-800" />)}
        </div>
      </div>
      <div className="flex-1 relative mt-2">
        <svg viewBox="0 0 400 150" className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ff7a00" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#ff7a00" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M0,120 Q50,110 80,80 T150,90 T220,40 T300,60 T400,10"
            fill="none"
            stroke="#ff7a00"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M0,120 Q50,110 80,80 T150,90 T220,40 T300,60 T400,10 V150 H0 Z"
            fill="url(#chartGradient)"
          />
          {/* Pulsing data points */}
          <circle cx="220" cy="40" r="4" fill="#ff7a00">
            <animate attributeName="r" values="4;6;4" dur="2s" repeatCount="indefinite" />
          </circle>
        </svg>
      </div>
      <div className="flex justify-between mt-4 border-t border-white/5 pt-3">
        <div className="flex gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-[#ff7a00]"></div>
            <span className="text-[9px] text-neutral-400 font-medium">Actual</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-neutral-700"></div>
            <span className="text-[9px] text-neutral-400 font-medium">Projected</span>
          </div>
        </div>
        <span className="text-[9px] text-neutral-500 font-mono tracking-tighter">Q4 FORECAST ACTIVE</span>
      </div>
    </div>
  );
};

export default function CreateWorld({ onInitialize }: CreateWorldProps) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const { scrollY } = useScroll();

  // Scroll-based transforms for the cinematic sun
  const sunOpacity = useTransform(scrollY, [0, 800], [1, 0.2]);
  const sunScale = useTransform(scrollY, [0, 800], [1, 1.1]);
  const sunY = useTransform(scrollY, [0, 800], [0, 100]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    setMousePos({
      x: (clientX / innerWidth) - 0.5,
      y: (clientY / innerHeight) - 0.5
    });
  };

  const [name, setName] = useState("");
  const [uplink, setUplink] = useState("");
  const [domain, setDomain] = useState("METRICS_EDU");
  const [initialBudget, setInitialBudget] = useState(250000);
  const [landScale, setLandScale] = useState(2500);
  const [verticalLimit, setVerticalLimit] = useState(1000);
  const [luaScript, setLuaScript] = useState(`-- Venture Strategy & Guardrails
function onInitialize()
  -- Target 18% ROI for first fiscal year
  setTargetROI(0.18)
  
  -- Automate capital reinvestment for scaling
  enableAutonomousReinvestment(true)
  
  -- Maintain efficiency buffer
  setOperationalLoadLimit(0.85)
end`);

  const [formStep, setFormStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const nextStep = () => setFormStep((s) => Math.min(s + 1, 3));
  const prevStep = () => setFormStep((s) => Math.max(s - 1, 1));

  const domainLabels: Record<string, string> = {
    METRICS_EDU: "Education (BizForge Academy)",
    METRICS_AGRI: "Agriculture (Harvest Synergy)",
    METRICS_GASTRO: "Restaurant (Gastro-Net)",
    METRICS_BIO: "Healthcare (Biotech Systems)",
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      let nextSector: Sector = "EDUCATION";
      if (domain === "METRICS_AGRI") nextSector = "AGRICULTURE";
      if (domain === "METRICS_GASTRO") nextSector = "RESTAURANT";
      if (domain === "METRICS_BIO") nextSector = "HEALTHCARE";

      localStorage.setItem("coc_initial_budget", initialBudget.toString());

      onInitialize(
        {
          name: name || "FOUNDER_772",
          uplink: uplink || "ceo@bizforge.ai",
          domain,
          landScale,
          verticalLimit,
          luaScript,
          initialBudget,
        },
        nextSector
      );
      setLoading(false);
    }, 1500);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div 
      onMouseMove={handleMouseMove}
      className="relative min-h-screen bg-[#050505] text-neutral-200 font-sans selection:bg-[#ff7a00]/30 selection:text-white overflow-hidden"
    >
      {/* 1. CINEMATIC PLANETARY HORIZON BACKGROUND */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#050505]">
        {/* Subliminal Space Dust & Particles */}
        <div className="absolute inset-0 z-20 opacity-40">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-px h-px bg-white rounded-full"
              initial={{ 
                x: Math.random() * 100 + "%", 
                y: Math.random() * 100 + "%",
                opacity: Math.random() * 0.4
              }}
              animate={{ 
                y: [null, "-25%"],
                opacity: [0, 0.6, 0]
              }}
              transition={{ 
                duration: 20 + Math.random() * 30, 
                repeat: Infinity, 
                ease: "linear",
                delay: Math.random() * 15
              }}
            />
          ))}
        </div>

        {/* Volumetric Clouds / Fog (Lower Left & Right) */}
        <div className="absolute bottom-0 left-0 w-[50%] h-[40%] bg-[radial-gradient(circle_at_0%_100%,rgba(255,94,0,0.03)_0%,transparent_70%)] blur-[100px] z-20"></div>
        <div className="absolute bottom-0 right-0 w-[50%] h-[40%] bg-[radial-gradient(circle_at_100%_100%,rgba(255,51,0,0.02)_0%,transparent_70%)] blur-[120px] z-20"></div>

        {/* The Gigantic Planetary Horizon */}
        <motion.div 
          style={{ 
            opacity: sunOpacity,
            scale: sunScale,
            y: sunY,
            x: mousePos.x * 50,
            rotate: mousePos.x * 0.5
          }}
          className="absolute top-[-25%] left-1/2 -translate-x-1/2 w-[70vw] min-w-[1000px] max-w-[1800px] aspect-square pointer-events-none z-10"
        >
          {/* Planet Body with Surface Texture */}
          <div className="absolute inset-0 rounded-full bg-[#050505] overflow-hidden border border-white/[0.02]">
             {/* Deep Red/Orange Atmospheric Haze */}
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,51,0,0.08)_0%,transparent_60%)]"></div>
             
             {/* Subtle Surface Texture */}
             <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] brightness-75 contrast-125 mix-blend-overlay"></div>
             
             {/* Deep Core Shadow for Maximum Text Contrast */}
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.9)_0%,transparent_100%)]"></div>
          </div>
          
          {/* Intense Atmospheric Rim Glow (#ff7a00 / #ff3300) */}
          <div className="absolute inset-0 rounded-full border border-brand-orange/20 shadow-[inset_0_120px_160px_-40px_rgba(255,122,0,0.7),0_0_180px_rgba(255,51,0,0.15)]"></div>
          
          {/* Volumetric Horizon Bloom */}
          <div className="absolute top-[-5%] left-[-10%] w-[120%] h-[40%] bg-[radial-gradient(ellipse_at_50%_50%,rgba(255,94,0,0.15)_0%,transparent_75%)] blur-[140px]"></div>
          
          {/* Precision Sharp Horizon Arc Highlight */}
          <div className="absolute top-[0px] left-1/2 -translate-x-1/2 w-[90%] h-[3px] bg-gradient-to-r from-transparent via-brand-orange to-transparent opacity-90 blur-[0.5px]"></div>
        </motion.div>

        {/* Global Space Depth Fog */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/40 to-[#050505] z-15"></div>
        
        {/* Grainy Film Texture Overlay */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] brightness-125 contrast-125 z-30 pointer-events-none"></div>
      </div>

      {/* Modern Header Navigation */}
      <header className="sticky top-0 w-full z-50 bg-[#050505]/40 backdrop-blur-xl border-b border-white/5 py-4 px-6 md:px-12 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#ff7a00] to-[#ff9a33] flex items-center justify-center shadow-2xl shadow-[#ff7a00]/20">
            <Zap className="w-5 h-5 text-black fill-black" />
          </div>
          <span className="font-display font-bold text-xl text-white tracking-tight">BizForge</span>
        </div>
        
        <nav className="hidden lg:flex items-center gap-10 text-[13px] font-medium text-neutral-400">
          <button onClick={() => scrollToSection("features")} className="hover:text-white transition-all cursor-pointer">Advisors</button>
          <button onClick={() => scrollToSection("simulation")} className="hover:text-white transition-all cursor-pointer">Simulation</button>
          <button onClick={() => scrollToSection("metrics")} className="hover:text-white transition-all cursor-pointer">Metrics</button>
          <button onClick={() => scrollToSection("creation-form")} className="hover:text-white transition-all cursor-pointer">Launch</button>
        </nav>

        <div className="flex items-center gap-4">
          <button className="hidden sm:block text-[13px] font-medium text-neutral-400 hover:text-white transition-colors cursor-pointer mr-2">Log In</button>
          <button 
            onClick={() => scrollToSection("creation-form")}
            className="px-5 py-2.5 text-[13px] font-semibold bg-white text-black hover:bg-[#ff7a00] hover:text-black rounded-full transition-all cursor-pointer shadow-lg shadow-white/5 active:scale-95"
          >
            Start Building
          </button>
        </div>
      </header>

      {/* 1. HERO SECTION */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-20 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center space-y-6 max-w-4xl relative z-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[12px] font-medium text-[#ff7a00]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Scale your venture with AI Precision</span>
          </div>
          
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-display font-extrabold text-white tracking-tight leading-[1.02] text-balance">
            Build Your Business <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff7a00] via-[#ff9a33] to-[#eab308]">Empire with AI</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-neutral-400 max-w-2xl mx-auto leading-relaxed font-medium opacity-90">
            Launch a virtual startup, allocate funding, manage operations, receive AI guidance,and watch your company grow or fail based on every decision you make.
          </p>

          {/* 3-Step Visual Process */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl mx-auto pt-10 pb-4 relative">
            {[
                {
                  title: "Choose Industry",
                  desc: "Select Education, Agriculture, Healthcare, or Restaurant and define your startup vision.",
                  icon: Layers
                },
                {
                  title: "Make Decisions",
                  desc: "Allocate funding, expand operations, hire teams, and manage business growth.",
                  icon: Users
                },
                {
                 title: "See Outcomes",
                  desc: "Track valuation, profits, market share, and receive AI-driven recommendations.",
                  icon: TrendingUp
                }
            ].map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * i }}
                className="relative group"
              >
                <div className="glass-panel p-5 rounded-2xl border-white/5 h-full hover:border-brand-orange/20 transition-all text-left flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-white/[0.03] flex items-center justify-center border border-white/5 group-hover:border-brand-orange/20 transition-colors">
                      <step.icon className="w-5 h-5 text-neutral-400 group-hover:text-brand-orange transition-colors" />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-neutral-600 group-hover:text-brand-orange/60 transition-colors">STEP_0{i + 1}</span>
                  </div>
                  <h3 className="text-white font-bold text-[13px] mb-1.5 uppercase tracking-wide">{step.title}</h3>
                  <p className="text-neutral-500 text-[11px] leading-relaxed font-medium">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-5">
            <button
              onClick={() => scrollToSection("creation-form")}
              className="w-full sm:w-auto px-10 py-5 bg-[#ff7a00] hover:bg-[#ff9a33] text-black font-bold rounded-full shadow-2xl shadow-[#ff7a00]/30 transition-all flex items-center justify-center gap-2 cursor-pointer group active:scale-[0.97]"
            >
              <span>Initialize Simulation</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
            <button
              onClick={() => scrollToSection("business-scenarios")}
              className="w-full sm:w-auto px-10 py-5 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold rounded-full transition-all cursor-pointer"
            >
              How it works
            </button>
          </div>
        </motion.div>

        {/* Hero Visual: Premium Dashboard Preview */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="mt-8 w-full max-w-6xl relative z-10"
        >
          <div className="absolute -inset-4 bg-gradient-to-r from-[#ff7a00]/10 to-[#eab308]/10 blur-3xl opacity-20 rounded-3xl"></div>
          <div className="relative glass-panel rounded-3xl overflow-hidden border border-white/10 shadow-3xl flex flex-col lg:flex-row h-auto lg:h-[420px]">
            {/* Main Content Area */}
            <div className="flex-[3] p-1 border-r border-white/5 bg-gradient-to-br from-white/[0.03] to-transparent">
              <div className="h-full w-full rounded-[20px] overflow-hidden flex flex-col">
                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-black/20">
                  <div className="flex gap-4">
                    <div className="px-3 py-1 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-neutral-400 uppercase tracking-tighter">Model v2.04</div>
                    <div className="px-3 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono text-emerald-400 uppercase tracking-tighter">Live Syncing</div>
                  </div>
                  <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">Global Market Area Reach</div>
                </div>
                <div className="flex-1 bg-black/40">
                  <GrowthChart />
                </div>
              </div>
            </div>
            
            {/* Sidebar Stats Area */}
            <div className="flex-1 p-8 flex flex-col gap-8 bg-black/40">
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Active Valuation</span>
                <p className="text-3xl font-display font-extrabold text-white tracking-tight">$42.8M</p>
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-[#ff7a00] w-[65%]"></div>
                </div>
              </div>
              
              <div className="space-y-6">
                {[
                  { label: "Market Share", value: "24.5%", color: "text-[#ff7a00]" },
                  { label: "Efficiency", value: "92%", color: "text-amber-400" },
                  { label: "Growth Rate", value: "+14.2%", color: "text-emerald-400" }
                ].map((stat, i) => (
                  <div key={i} className="flex justify-between items-center group cursor-default">
                    <span className="text-sm font-medium text-neutral-400 group-hover:text-neutral-300 transition-colors">{stat.label}</span>
                    <span className={`text-sm font-bold ${stat.color}`}>{stat.value}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-auto p-4 rounded-2xl bg-[#ff7a00]/5 border border-[#ff7a00]/20">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck className="w-4 h-4 text-[#ff7a00]" />
                  <span className="text-[10px] font-bold text-[#ff7a00] uppercase">Advisor Insight</span>
                </div>
                <p className="text-[11px] text-neutral-400 leading-relaxed font-medium">
                  Market demand increased by 18%. Recommendation: Invest $50,000 in expansion to capture new customers before competitors.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 1.2 CREDIBILITY SECTION */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-16 border-b border-white/5">
        <div className="flex flex-col items-center gap-16">
          {/* Logo Cloud: Industry Leaders */}
          <div className="w-full space-y-10">
            <p className="text-center text-[10px] font-bold text-neutral-600 uppercase tracking-[0.3em]">Trusted by ambitious founders at global scale-ups</p>
            <div className="flex flex-wrap justify-center items-center gap-x-12 md:gap-x-20 gap-y-10 opacity-30 grayscale hover:opacity-60 hover:grayscale-0 transition-all duration-1000">
               {[
                 { name: "AETHER", icon: Rocket },
                 { name: "NEURAL", icon: CircleDot },
                 { name: "QUANTUM", icon: Cpu },
                 { name: "BIO-SYNTH", icon: ShieldCheck },
                 { name: "GLOBAL", icon: Globe }
               ].map((logo, i) => (
                 <div key={i} className="flex items-center gap-2.5 cursor-default">
                    <logo.icon className="w-5 h-5 text-white" />
                    <span className="font-display font-black text-xl text-white tracking-tighter uppercase">{logo.name}</span>
                 </div>
               ))}
            </div>
          </div>

          {/* Core Strategic Pillars Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5 border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
             {[
               { label: "Ventures Initialized", val: 2400, suffix: "+", desc: "Active simulation containers" },
               { label: "Prediction Accuracy", val: 98.4, suffix: "%", desc: "AI-driven strategy validation" },
               { label: "Capital Optimized", val: 2.4, prefix: "$", suffix: "B", desc: "Autonomous reserve management" },
               { label: "Execution Latency", val: 12, suffix: "ms", desc: "Real-time telemetry sync" }
             ].map((stat, i) => (
               <div key={i} className="p-10 bg-[#050505] space-y-4 hover:bg-white/[0.01] transition-colors group">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest leading-none group-hover:text-brand-orange transition-colors">{stat.label}</span>
                    <p className="text-4xl font-display font-extrabold text-white tracking-tight">
                      <CountUp value={stat.val} prefix={stat.prefix} suffix={stat.suffix} />
                    </p>
                  </div>
                  <p className="text-[11px] font-medium text-neutral-500 leading-relaxed max-w-[180px]">{stat.desc}</p>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* 1.5 LIVE DASHBOARD PREVIEW SECTION */}
      <section id="simulation" className="relative z-10 py-32 overflow-hidden border-y border-white/5 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-orange/10 border border-brand-orange/20 text-[11px] font-bold text-brand-orange uppercase tracking-wider">
              Live Engine Preview
            </div>
            <h2 className="text-4xl sm:text-5xl font-display font-extrabold text-white tracking-tight leading-tight">
              Experience Autonomous <br />
              <span className="text-neutral-500">Business Orchestration</span>
            </h2>
            <p className="text-lg text-neutral-400 max-w-xl mx-auto font-medium">
              Interact with our mock simulation engine. See how the AI Board reallocates resources and tracks growth in real-time.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Left: Treasury AI Mock */}
            <div className="lg:col-span-4 flex flex-col gap-8">
              <div className="glass-panel p-8 rounded-3xl flex-1 flex flex-col justify-between group hover:border-brand-orange/30 transition-all duration-500">
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <div className="w-12 h-12 rounded-2xl bg-brand-orange/10 flex items-center justify-center border border-brand-orange/20 group-hover:scale-110 transition-transform">
                      <Wallet className="w-6 h-6 text-brand-orange" />
                    </div>
                    <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-bold text-emerald-500 uppercase tracking-widest">
                      Optimal
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Treasury AI</h3>
                    <p className="text-sm text-neutral-400 leading-relaxed font-medium">
                      Autonomous liquidity management. Reallocating $2.4M for Q4 expansion.
                    </p>
                  </div>
                </div>
                <div className="pt-8 space-y-4">
                  <div className="flex justify-between items-center text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                    <span>Reserve Ratio</span>
                    <span className="text-white">84.2%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: "0%" }}
                      whileInView={{ width: "84.2%" }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="h-full bg-brand-orange shadow-[0_0_10px_rgba(255,122,0,0.5)]"
                    />
                  </div>
                </div>
              </div>

              <div className="glass-panel p-8 rounded-3xl bg-emerald-500/[0.02] border-emerald-500/10 group hover:border-emerald-500/30 transition-all duration-500">
                <div className="flex items-center gap-4 mb-4">
                   <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                    <TrendingUp className="w-5 h-5 text-emerald-500" />
                   </div>
                   <div>
                    <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest leading-none mb-1">Growth Forecast</p>
                    <p className="text-white font-bold text-sm">+18.4% YoY</p>
                   </div>
                </div>
                <div className="h-16 flex items-end gap-1 px-4 bg-black/20 rounded-2xl overflow-hidden">
                  {[0.4, 0.6, 0.45, 0.8, 0.55, 0.95, 0.7, 0.9, 0.85].map((h, i) => (
                    <motion.div 
                      key={i}
                      initial={{ height: 0 }}
                      whileInView={{ height: `${h * 100}%` }}
                      transition={{ duration: 0.5, delay: i * 0.05 }}
                      className="flex-1 bg-emerald-500/40 rounded-t-sm"
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Center: Main Preview Console */}
            <div className="lg:col-span-5 flex flex-col">
              <div className="glass-panel rounded-3xl overflow-hidden flex-1 relative group bg-[#080808]">
                 <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-orange/30 to-transparent"></div>
                 <div className="p-8 h-full flex flex-col">
                    <div className="flex justify-between items-center mb-10">
                       <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-brand-orange animate-pulse"></div>
                          <span className="text-[10px] font-mono font-bold text-neutral-500 uppercase tracking-[0.2em]">Simulation Container Live</span>
                       </div>
                       <Cpu className="w-4 h-4 text-neutral-700" />
                    </div>

                    <div className="flex-1 flex flex-col justify-center items-center text-center space-y-8">
                       <div className="space-y-2">
                          <p className="text-[11px] font-bold text-neutral-500 uppercase tracking-widest">Active Venture Valuation</p>
                          <p className="text-6xl sm:text-7xl font-display font-extrabold text-white tracking-tighter">
                            <CountUp value={42.8} prefix="$" suffix="M" duration={2000} />
                          </p>
                       </div>
                       
                       <div className="w-full h-[200px] relative">
                          <div className="absolute inset-0 bg-brand-orange/5 blur-3xl rounded-full opacity-50"></div>
                          <GrowthChart />
                       </div>
                    </div>

                    <div className="mt-auto grid grid-cols-2 gap-4">
                       <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col items-center justify-center text-center">
                          <span className="text-[9px] font-bold text-neutral-600 uppercase tracking-tighter mb-1">Efficiency</span>
                          <span className="text-lg font-bold text-white tracking-tight">94.2%</span>
                       </div>
                       <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col items-center justify-center text-center">
                          <span className="text-[9px] font-bold text-neutral-600 uppercase tracking-tighter mb-1">Stability</span>
                          <span className="text-lg font-bold text-emerald-500 tracking-tight">Optimal</span>
                       </div>
                    </div>
                 </div>
              </div>
            </div>

            {/* Right: AI Recommendations Interactive List */}
            <div className="lg:col-span-3 flex flex-col gap-6">
               <div className="glass-panel p-8 rounded-3xl flex-1 flex flex-col bg-brand-orange/[0.01] hover:border-brand-orange/30 transition-all duration-500">
                  <div className="flex items-center gap-3 mb-8">
                     <Sparkles className="w-5 h-5 text-brand-orange" />
                     <h3 className="text-[11px] font-bold text-white uppercase tracking-widest">AI Board Insight</h3>
                  </div>
                  
                  <div className="space-y-6">
                    {[
                      {
                        title: "Capital Reallocation",
                        desc: "Redirecting 12% of liquidity to R&D hubs for yield optimization.",
                        active: true
                      },
                      {
                        title: "Logistics Sync",
                        desc: "Synchronizing supply chain drones for peak throughput efficiency.",
                        active: false
                      },
                      {
                        title: "Market Velocity",
                        desc: "Scaling regional footprint to meet unserved demand forecast.",
                        active: false
                      }
                    ].map((rec, i) => (
                      <div key={i} className={`p-5 rounded-2xl border transition-all cursor-default ${
                        rec.active 
                          ? "bg-brand-orange/5 border-brand-orange/20 shadow-lg shadow-brand-orange/5" 
                          : "bg-white/[0.01] border-white/5 opacity-50 hover:opacity-100 hover:bg-white/[0.03]"
                      }`}>
                         <div className="flex justify-between items-center mb-2">
                           <h4 className="text-xs font-bold text-white">{rec.title}</h4>
                           {rec.active && <div className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-pulse"></div>}
                         </div>
                         <p className="text-[11px] text-neutral-400 leading-relaxed font-medium">{rec.desc}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-auto pt-8">
                     <button className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-white text-[11px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all">
                        View All Directives
                     </button>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. BUSINESS METRICS SECTION */}
      <section id="metrics" className="relative z-10 py-32 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="order-2 lg:order-1">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { 
                    label: "Customer LTV", 
                    val: 4250, 
                    prefix: "$",
                    change: "+12.4%", 
                    trend: "up",
                    status: "Optimized"
                  },
                  { 
                    label: "Acquisition CAC", 
                    val: 280, 
                    prefix: "$",
                    change: "-8.2%", 
                    trend: "down",
                    status: "Healthy"
                  },
                  { 
                    label: "Burn Velocity", 
                    val: 12000, 
                    prefix: "$",
                    suffix: "/mo",
                    change: "STABLE", 
                    trend: "neutral",
                    status: "Nominal"
                  },
                  { 
                    label: "Net Margin", 
                    val: 32, 
                    suffix: "%",
                    change: "+4.1%", 
                    trend: "up",
                    status: "Growing"
                  }
                ].map((metric, i) => (
                  <div key={i} className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4 hover:border-brand-orange/20 transition-all group">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest leading-none">{metric.label}</span>
                      <div className="flex items-center gap-1.5">
                        <div className={`w-1 h-1 rounded-full ${metric.trend === 'up' ? 'bg-emerald-500' : metric.trend === 'down' ? 'bg-brand-orange' : 'bg-amber-500'} animate-pulse`}></div>
                        <span className="text-[9px] font-bold text-neutral-600 uppercase tracking-tighter">{metric.status}</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-end">
                      <div>
                        <span className="text-3xl font-display font-extrabold text-white tracking-tight">
                          <CountUp value={metric.val} prefix={metric.prefix} suffix={metric.suffix} />
                        </span>
                        <div className="mt-1 flex items-center gap-1.5">
                          <span className={`text-[10px] font-bold font-mono ${metric.trend === 'up' ? 'text-emerald-500' : metric.trend === 'neutral' ? 'text-amber-500' : 'text-emerald-500'}`}>
                            {metric.change}
                          </span>
                          <span className="text-[9px] text-neutral-600 font-medium tracking-tighter uppercase">vs last month</span>
                        </div>
                      </div>
                      <Sparkline color={metric.trend === 'up' ? '#10b981' : metric.trend === 'down' ? '#ff7a00' : '#f59e0b'} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="order-1 lg:order-2 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-bold text-emerald-500 uppercase tracking-wider">
                Real-Time Intel
              </div>
              <h2 className="text-4xl sm:text-5xl font-display font-extrabold text-white leading-[1.05] tracking-tight text-balance">
                Make Data-Driven Decisions, <br />
                <span className="text-neutral-500">Not Strategy Guesses.</span>
              </h2>
              <p className="text-lg text-neutral-400 leading-relaxed font-medium">
                Track every dollar and every customer. Our simulation engine provides deeper visibility into your business metrics than any traditional static dashboard.
              </p>
              <ul className="space-y-5 pt-4">
                {[
                  "Predictive cash flow modeling with AI",
                  "Automated cohort retention analysis",
                  "Market saturation & velocity forecasting"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-4 text-neutral-300 font-medium text-sm group">
                    <div className="w-6 h-6 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-brand-orange/30 transition-colors">
                      <ShieldCheck className="w-3.5 h-3.5 text-brand-orange" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* NEW BUSINESS SCENARIOS SECTION */}
      <section 
      id="business-scenarios"
      className="relative z-10 max-w-7xl mx-auto px-6 py-24">
  <div className="text-center mb-16">
    <h2 className="text-4xl font-bold text-white mb-4">
      Explore Business Scenarios
    </h2>
    <p className="text-neutral-400">
      Simulate different industries and discover how your decisions impact growth.
    </p>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

    <motion.div
  whileHover={{ y: -8 }}
  className="glass-panel p-6 rounded-2xl cursor-pointer hover:border-brand-orange/30 transition-all duration-300"
>
  <h3 className="text-white font-bold mb-2">🎓 Education Startup</h3>
  <p className="text-neutral-400 text-sm">
    Manage student growth, retention, and infrastructure investments.
  </p>
</motion.div>

    <motion.div
  whileHover={{ y: -8 }}
  className="glass-panel p-6 rounded-2xl cursor-pointer hover:border-brand-orange/30 transition-all duration-300"
>
  <h3 className="text-white font-bold mb-2">🌾 Agriculture Company</h3>
  <p className="text-neutral-400 text-sm">
    Optimize crop yields, water reserves, and automation systems.
  </p>
</motion.div>

    <motion.div
  whileHover={{ y: -8 }}
  className="glass-panel p-6 rounded-2xl cursor-pointer hover:border-brand-orange/30 transition-all duration-300"
>
  <h3 className="text-white font-bold mb-2">🍽 Restaurant Chain</h3>
  <p className="text-neutral-400 text-sm">
    Balance customer demand, staffing, and operational efficiency.
  </p>
</motion.div>

    <motion.div
  whileHover={{ y: -8 }}
  className="glass-panel p-6 rounded-2xl cursor-pointer hover:border-brand-orange/30 transition-all duration-300"
>
  <h3 className="text-white font-bold mb-2">🏥 Healthcare Venture</h3>
  <p className="text-neutral-400 text-sm">
    Improve patient throughput, research progress, and healthcare outcomes.
  </p>
</motion.div>

  </div>
</section>

      {/* 4. CREATION FORM SECTION */}
      <section id="creation-form" className="relative z-10 max-w-5xl mx-auto px-6 py-32">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl sm:text-5xl font-display font-extrabold text-white tracking-tight">Initialize Your Venture</h2>
          <p className="text-lg text-neutral-400 max-w-xl mx-auto font-medium">
            Configure your strategic parameters. Your AI board will take it from there.
          </p>
        </div>

        {/* Multi-Step Onboarding Form */}
        <div className="glass-panel rounded-3xl overflow-hidden shadow-2xl border border-white/10 flex flex-col">
          {/* Progress Indicator */}
          <div className="bg-white/[0.02] border-b border-white/5 px-8 md:px-12 py-6 flex items-center justify-between">
            <div className="flex items-center gap-8">
              {[
                { s: 1, label: "Identity" },
                { s: 2, label: "Configuration" },
                { s: 3, label: "Strategy" }
              ].map((step) => (
                <div key={step.s} className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                    formStep === step.s 
                      ? "bg-[#ff7a00] text-black shadow-lg shadow-[#ff7a00]/20" 
                      : formStep > step.s 
                        ? "bg-emerald-500 text-black" 
                        : "bg-white/5 text-neutral-500 border border-white/10"
                  }`}>
                    {formStep > step.s ? "✓" : step.s}
                  </div>
                  <span className={`text-[11px] font-bold uppercase tracking-widest ${formStep >= step.s ? "text-white" : "text-neutral-600"}`}>
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
            <div className="hidden sm:block text-[10px] font-mono text-neutral-500 uppercase tracking-tighter">
              Secure Initialization Protocol v2.0
            </div>
          </div>

          <div className="flex flex-col md:flex-row min-h-[500px]">
            {/* Form Left Side: Content */}
            <div className="flex-[1.5] p-8 md:p-12 bg-black/40 flex flex-col">
              <AnimatePresence mode="wait">
                {formStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="space-y-8 flex-1"
                  >
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-white">Founder Identity</h3>
                      <p className="text-sm text-neutral-400">Establish your credentials within the BizForge simulation network.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-widest ml-1">Company Name</label>
                        <input
                          className="w-full bg-white/[0.03] border border-white/10 focus:border-[#ff7a00] rounded-xl px-4 py-3.5 text-sm text-white outline-none transition-all placeholder:text-neutral-600"
                          placeholder="e.g. Acme Ventures"
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-widest ml-1">CEO Identity</label>
                        <input
                          className="w-full bg-white/[0.03] border border-white/10 focus:border-[#ff7a00] rounded-xl px-4 py-3.5 text-sm text-white outline-none transition-all placeholder:text-neutral-600"
                          placeholder="ceo@domain.ai"
                          type="email"
                          value={uplink}
                          onChange={(e) => setUplink(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-brand-orange/5 border border-brand-orange/10 flex items-start gap-4">
                      <HelpCircle className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                      <p className="text-xs text-neutral-400 leading-relaxed">
                        These details will be used to calibrate your AI Board's communication style and legal venture structures.
                      </p>
                    </div>
                  </motion.div>
                )}

                {formStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="space-y-8 flex-1"
                  >
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-white">Venture Configuration</h3>
                      <p className="text-sm text-neutral-400">Select your industry segment and initialize core capital reserves.</p>
                    </div>

                    <div className="space-y-2 pt-4">
                      <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-widest ml-1">Industry Segment</label>
                      <div className="relative">
                        <select
                          className="w-full bg-white/[0.03] border border-white/10 focus:border-[#ff7a00] rounded-xl px-4 py-3.5 text-sm text-white outline-none transition-all appearance-none cursor-pointer"
                          value={domain}
                          onChange={(e) => setDomain(e.target.value)}
                        >
                          <option className="bg-[#121212]" value="METRICS_EDU">Education (BizForge Academy)</option>
                          <option className="bg-[#121212]" value="METRICS_AGRI">Agriculture (Harvest Synergy)</option>
                          <option className="bg-[#121212]" value="METRICS_GASTRO">Restaurant (Gastro-Net)</option>
                          <option className="bg-[#121212]" value="METRICS_BIO">Healthcare (Biotech Systems)</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none" />
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="flex justify-between items-center px-1">
                        <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-widest">Initial Funding</label>
                        <span className="text-sm font-bold text-white">${initialBudget.toLocaleString()} USD</span>
                      </div>
                      <input
                        type="range"
                        min="50000"
                        max="1000000"
                        step="50000"
                        value={initialBudget}
                        onChange={(e) => setInitialBudget(parseInt(e.target.value))}
                        className="w-full h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer accent-[#ff7a00]"
                      />
                      <div className="flex justify-between text-[10px] font-bold text-neutral-600 px-1 uppercase tracking-tighter">
                        <span>Bootstrap</span>
                        <span>Seed</span>
                        <span>Unicorn</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {formStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="space-y-8 flex-1"
                  >
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-white">Strategy Finalization</h3>
                      <p className="text-sm text-neutral-400">Review your venture strategy before deploying to the simulation grid.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4">
                       <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                          <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest">Company</span>
                          <p className="text-sm font-bold text-white truncate">{name || "Unnamed Venture"}</p>
                       </div>
                       <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                          <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest">Industry</span>
                          <p className="text-sm font-bold text-white truncate">{domainLabels[domain] || "Education"}</p>
                       </div>
                       <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                          <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest">Budget</span>
                          <p className="text-sm font-bold text-brand-orange">${initialBudget.toLocaleString()}</p>
                       </div>
                       <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                          <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest">Status</span>
                          <p className="text-sm font-bold text-emerald-500 uppercase tracking-tighter">Ready</p>
                       </div>
                    </div>

                    <div className="space-y-3">
                       <h4 className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">AI Advisor Recommendations</h4>
                       <div className="space-y-2">
                          {[
                            "Increase liquidity buffers for Q1 volatility.",
                            "Prioritize high-LTV customer nodes first.",
                            "Enable autonomous scaling for R&D hubs."
                          ].map((rec, i) => (
                            <div key={i} className="flex gap-3 items-center text-xs text-neutral-300 font-medium">
                               <div className="w-1.5 h-1.5 rounded-full bg-brand-orange/40" />
                               {rec}
                            </div>
                          ))}
                       </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="pt-12 flex gap-4 mt-auto">
                {formStep > 1 && (
                  <button
                    onClick={prevStep}
                    className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl border border-white/10 transition-all active:scale-[0.98] cursor-pointer"
                  >
                    Back
                  </button>
                )}
                
                {formStep < 3 ? (
                  <button
                    onClick={nextStep}
                    className="flex-[2] py-4 bg-white text-black hover:bg-[#ff7a00] hover:text-black font-extrabold rounded-2xl shadow-xl shadow-white/5 transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
                  >
                    Continue to {formStep === 1 ? "Configuration" : "Strategy"}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex-[2] py-4 bg-[#ff7a00] hover:bg-[#ff9a33] text-black font-extrabold rounded-2xl shadow-xl shadow-[#ff7a00]/20 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 text-base cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                        <span>Initializing Grid...</span>
                      </>
                    ) : (
                      <>
                        <span>Launch Simulation</span>
                        <Rocket className="w-5 h-5" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Form Right Side: Tech Summary */}
            <div className="flex-1 p-8 md:p-12 bg-white/[0.02] border-l border-white/5 flex flex-col justify-between">
              <div className="space-y-8">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-[11px] font-bold text-[#ff7a00] uppercase tracking-widest">Autonomous Logic</h4>
                    <span className="text-[9px] font-mono text-emerald-500 font-bold tracking-tighter">LUA Engine Active</span>
                  </div>
                  <div className="bg-black/60 rounded-2xl border border-white/5 overflow-hidden flex flex-col h-[280px]">
                    <div className="bg-white/5 px-4 py-2 border-b border-white/5 flex items-center gap-2">
                       <div className="flex gap-1">
                          <div className="w-2 h-2 rounded-full bg-white/10" />
                          <div className="w-2 h-2 rounded-full bg-white/10" />
                       </div>
                       <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-tighter">venture_strategy.lua</span>
                    </div>
                    <textarea
                      className="flex-1 bg-transparent border-none outline-none font-mono text-[11px] leading-relaxed text-neutral-400 p-5 resize-none custom-scrollbar"
                      spellCheck="false"
                      value={luaScript}
                      onChange={(e) => setLuaScript(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[11px] font-bold text-neutral-500 uppercase tracking-widest">Strategic Guardrails</h4>
                  <div className="space-y-3">
                    {[
                      { icon: ShieldCheck, label: "Market Scale Buffer", val: "ACTIVE" },
                      { icon: BarChart3, label: "ROI Optimization", val: "NOMINAL" },
                      { icon: PieChart, label: "Asset Allocation", val: "DYNAMIC" }
                    ].map((g, i) => (
                      <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0 opacity-60">
                        <div className="flex items-center gap-3">
                          <g.icon className="w-3.5 h-3.5 text-neutral-500" />
                          <span className="text-[11px] font-medium text-neutral-400">{g.label}</span>
                        </div>
                        <span className="text-[9px] font-bold text-neutral-200 uppercase tracking-tighter">{g.val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-8">
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                  <p className="text-[11px] text-neutral-500 leading-relaxed italic">
                    "This initialization will create a persistent simulation container. You can adjust constraints at any time from the board terminal."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-16 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-start gap-12">
          <div className="space-y-4 max-w-xs">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#ff7a00] flex items-center justify-center">
                <Zap className="w-4 h-4 text-black fill-black" />
              </div>
              <span className="font-display font-bold text-lg text-white">BizForge</span>
            </div>
            <p className="text-sm text-neutral-500 leading-relaxed font-medium">
              The world's first autonomous venture simulation platform. Build, test, and scale with AI.
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-16">
            <div className="space-y-4">
              <h5 className="text-[11px] font-bold text-white uppercase tracking-widest">Platform</h5>
              <ul className="space-y-2 text-sm text-neutral-500 font-medium">
                <li><a href="#" className="hover:text-white transition-colors">Simulations</a></li>
                <li><a href="#" className="hover:text-white transition-colors">AI Advisors</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h5 className="text-[11px] font-bold text-white uppercase tracking-widest">Company</h5>
              <ul className="space-y-2 text-sm text-neutral-500 font-medium">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h5 className="text-[11px] font-bold text-white uppercase tracking-widest">Connect</h5>
              <ul className="space-y-2 text-sm text-neutral-500 font-medium flex flex-col">
                <li className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer">
                  <Globe className="w-3.5 h-3.5" />
                  <span>Twitter</span>
                </li>
                <li className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer">
                  <Settings className="w-3.5 h-3.5" />
                  <span>LinkedIn</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between gap-4 text-[11px] font-medium text-neutral-600">
          <p>© 2026 BizForge Simulation Platform. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-neutral-400">Privacy Policy</a>
            <a href="#" className="hover:text-neutral-400">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
