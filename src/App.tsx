/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Sector, ArchitectConfig, SimulationStats } from "./types";
import BootOverlay from "./components/BootOverlay";
import CreateWorld from "./components/CreateWorld";
import Sidebar from "./components/Sidebar";
import StatusBar from "./components/StatusBar";
import SectorEdu from "./components/SectorEdu";
import SectorRest from "./components/SectorRest";
import SectorAgri from "./components/SectorAgri";
import SectorHealth from "./components/SectorHealth";
import AIChatConsole from "./components/AIChatConsole";
import { Cpu, RotateCcw, Clock, ShieldCheck, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const [appState, setAppState] = useState<"BOOT" | "INIT" | "DASHBOARD">("BOOT");
  const [activeSector, setActiveSector] = useState<Sector>("EDUCATION");
  const [architect, setArchitect] = useState<ArchitectConfig>({
    name: "FOUNDER_772",
    uplink: "advisor@bizforge.ai",
    domain: "METRICS_EDU",
    landScale: 2500,
    verticalLimit: 1000,
    luaScript: "",
  });

  // Clock state for authentic system telemetry
  const [systemTime, setSystemTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setSystemTime(
        now.toISOString().replace("T", "  ❖  ").substring(0, 21) + " UTC"
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const [simulationStats, setSimulationStats] = useState<SimulationStats>({
    educationLiquidity: 84,
    educationRetention: 92,
    educationFinanceStrategy: "STRATEGY STATEMENT: REALLOCATE RESERVES TO SMART CLASSROOM INFRASTRUCTURE AND R&D CHIPSETS.",
    educationHrAdvisory: "ADVISORY FEEDBACK: STAFF RETENTION NOMINAL AT 92%. MONITOR BURNOUT VECTORS.",
    restaurantRevenueVelocity: 14280,
    restaurantProteinFreshness: 94,
    restaurantProduceFreshness: 88,
    restaurantKitchenLoad: 62,
    agricultureWaterReserves: 82.5,
    agricultureHydroponicCount: 1204,
    agricultureHarvestDronesCount: 42,
    agricultureCropYieldDelta: -2.1,
    healthcareBioAnalyzersEfficiency: 94,
    healthcareThroughputDaily: 1450,
    healthcareSterilityLevel: "Grade A+",
    healthcareResearchProgress: 78,
    healthcareActiveSyntheses: "Analyzing protein folding sequences for Beta-Variant treatment. Estimated completion: 04:12:00",
    healthcareNeuralSyncStatus: "OPTIMAL",
    totalEvaluation: "$42.8M",
  });

  const [eduLogs, setEduLogs] = useState<string[]>([
    "&gt; [14:02] INITIALIZING SMART CLASSROOM SENSORS...",
    "&gt; [13:58] LIQUIDITY MATRIX SECURED AT 84%.",
    "&gt; [13:45] RESEARCH COEFFICIENT NOMINAL [PEAK_OUTPUT_01].",
  ]);

  const [simulationLoading, setSimulationLoading] = useState(false);
  const [toasts, setToasts] = useState<{ id: number; message: string; type: "success" | "info" }[]>([]);

  const addToast = (message: string, type: "success" | "info" = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  // Set initial configuration parameters
  const handleWorldInitialization = (config: ArchitectConfig, sector: Sector) => {
    setArchitect(config);
    setActiveSector(sector);

    // Clear Clash of Clans states on world re-configuration for correct fresh reconstruction
    localStorage.removeItem("coc_credits_EDUCATION");
    localStorage.removeItem("coc_xp_EDUCATION");
    localStorage.removeItem("coc_hq_level_EDUCATION");

    localStorage.removeItem("coc_credits_AGRICULTURE");
    localStorage.removeItem("coc_xp_AGRICULTURE");
    localStorage.removeItem("coc_hq_level_AGRICULTURE");

    localStorage.removeItem("coc_credits_RESTAURANT");
    localStorage.removeItem("coc_xp_RESTAURANT");
    localStorage.removeItem("coc_hq_level_RESTAURANT");

    localStorage.removeItem("coc_credits_HEALTHCARE");
    localStorage.removeItem("coc_xp_HEALTHCARE");
    localStorage.removeItem("coc_hq_level_HEALTHCARE");

    setAppState("DASHBOARD");
    addToast("Simulation Initialized", "success");
  };

  // Live simulation update callback from the AI Chat Console model
  const handleSimulationUpdate = (data: {
    advisorComment: string;
    updatedStats: any;
    logs: string[];
    totalEvaluation: string;
  }) => {
    setSimulationStats((prev) => {
      const stats = { ...prev };
      if (data.totalEvaluation) {
        stats.totalEvaluation = data.totalEvaluation;
      }

      const updated = data.updatedStats || {};

      if (activeSector === "EDUCATION") {
        if (updated.liquidity !== undefined) stats.educationLiquidity = updated.liquidity;
        if (updated.retention !== undefined) stats.educationRetention = updated.retention;
        if (updated.financeStrategy !== undefined) stats.educationFinanceStrategy = updated.financeStrategy;
        if (updated.hrAdvisory !== undefined) stats.educationHrAdvisory = updated.hrAdvisory;
      } else if (activeSector === "RESTAURANT") {
        if (updated.revenueVelocity !== undefined) stats.restaurantRevenueVelocity = updated.revenueVelocity;
        if (updated.proteinFreshness !== undefined) stats.restaurantProteinFreshness = updated.proteinFreshness;
        if (updated.produceFreshness !== undefined) stats.restaurantProduceFreshness = updated.produceFreshness;
        if (updated.kitchenLoad !== undefined) stats.restaurantKitchenLoad = updated.kitchenLoad;
      } else if (activeSector === "AGRICULTURE") {
        if (updated.waterReserves !== undefined) stats.agricultureWaterReserves = updated.waterReserves;
        if (updated.hydroponicCount !== undefined) stats.agricultureHydroponicCount = updated.hydroponicCount;
        if (updated.harvestDronesCount !== undefined) stats.agricultureHarvestDronesCount = updated.harvestDronesCount;
        if (updated.cropYieldDelta !== undefined) stats.agricultureCropYieldDelta = updated.cropYieldDelta;
      } else if (activeSector === "HEALTHCARE") {
        if (updated.bioAnalyzersEfficiency !== undefined) stats.healthcareBioAnalyzersEfficiency = updated.bioAnalyzersEfficiency;
        if (updated.throughputDaily !== undefined) stats.healthcareThroughputDaily = updated.throughputDaily;
        if (updated.sterilityLevel !== undefined) stats.healthcareSterilityLevel = updated.sterilityLevel;
        if (updated.researchProgress !== undefined) stats.healthcareResearchProgress = updated.researchProgress;
        if (updated.activeSyntheses !== undefined) stats.healthcareActiveSyntheses = updated.activeSyntheses;
      }

      return stats;
    });

    if (data.logs && data.logs.length > 0) {
      setEduLogs((prev) => [...data.logs, ...prev].slice(0, 10));
    }
    addToast("Data Synchronized", "success");
  };

  const executeManualDirective = async (directiveText: string) => {
    setSimulationLoading(true);
    try {
      const response = await fetch("/api/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sector: activeSector,
          action: directiveText,
          architectName: architect.name,
          landScale: architect.landScale,
          verticalLimit: architect.verticalLimit,
          luaScript: architect.luaScript,
          currentStats: simulationStats,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        handleSimulationUpdate(result);
        addToast("Directive Executed", "info");
      }
    } catch (err) {
      console.error(err);
      addToast("Network Error", "info");
    } finally {
      setSimulationLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-obsidian text-neutral-200 font-sans antialiased overflow-x-hidden relative">
      {/* Toast System Container */}
      <div className="fixed top-20 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 20, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className="glass-panel-glow px-4 py-3 rounded-xl border border-brand-orange/30 flex items-center gap-3 pointer-events-auto"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-pulse" />
              <span className="text-[11px] font-bold text-white uppercase tracking-wider">{toast.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence mode="wait">
        {/* BOOTING STAGE */}
        {appState === "BOOT" && (
          <BootOverlay key="boot-stage" onComplete={() => setAppState("INIT")} />
        )}

        {/* SETUP INITIALIZATION STAGE */}
        {appState === "INIT" && (
          <motion.div
            key="init-stage"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <CreateWorld onInitialize={handleWorldInitialization} />
          </motion.div>
        )}

        {/* RUNNING SIMULATION SHELL */}
        {appState === "DASHBOARD" && (
          <motion.div
            key="dashboard-stage"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col min-h-screen"
          >
            {/* HUD Central Top Navigation Header */}
            <header className="fixed top-0 left-0 w-full h-16 bg-obsidian/60 backdrop-blur-xl border-b border-white/[0.04] flex items-center justify-between px-6 z-50 select-none">
              <div className="flex items-center gap-4">
                <div className="w-9 h-9 rounded-xl bg-brand-orange/10 flex items-center justify-center border border-brand-orange/20 relative group overflow-hidden">
                  <div className="absolute inset-0 bg-brand-orange/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  <Cpu className="w-5 h-5 text-brand-orange" />
                </div>
                <div>
                  <h1 className="text-sm font-display font-extrabold tracking-tight text-white uppercase leading-none">
                    BizForge Empire
                  </h1>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="w-1 h-1 rounded-full bg-brand-orange animate-pulse"></span>
                    <span className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest leading-none">
                      Engine v2.04
                    </span>
                  </div>
                </div>
              </div>

              {/* Center System Telemetry Metrics Info */}
              <div className="hidden lg:flex items-center gap-8 font-mono text-[10px] text-neutral-500">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-brand-orange/60" />
                  <span className="text-neutral-300">{systemTime || "CONNECTING..."}</span>
                </div>
                <div className="w-px h-3 bg-white/5"></div>
                <div className="flex gap-4">
                  <div>
                    <span className="text-neutral-600 mr-1.5 uppercase">Scale:</span> 
                    <span className="text-neutral-300">{architect.landScale.toLocaleString()} SQ_MI</span>
                  </div>
                  <div>
                    <span className="text-neutral-600 mr-1.5 uppercase">Depot:</span> 
                    <span className="text-neutral-300">{architect.verticalLimit.toLocaleString()} Units</span>
                  </div>
                </div>
              </div>

              {/* Header Right Command controls widgets */}
              <div className="flex items-center gap-4">
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                  <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-tight">{activeSector} ACTIVE</span>
                </div>

                <button
                  onClick={() => setAppState("INIT")}
                  className="px-4 py-2 bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 text-neutral-400 hover:text-white rounded-lg flex items-center gap-2 text-[11px] font-medium cursor-pointer transition-all active:scale-95 group"
                >
                  <RotateCcw className="w-3.5 h-3.5 group-hover:rotate-[-45deg] transition-transform" />
                  <span>Reconfigure</span>
                </button>
              </div>
            </header>

            {/* Layout core columns (Nav list side, view core dashboard, dynamic chatbot side) */}
            <div className="flex flex-1 pt-16 pb-10">
              {/* Responsive NAV Sidebar selectors */}
              <Sidebar
                activeSector={activeSector}
                onSectorChange={setActiveSector}
                onDeploy={executeManualDirective}
                architectName={architect.name}
              />

              {/* Primary Active Sector Dashboard View Container */}
              <main id="mainSimulationDashboard" className="flex-1 px-4 md:px-8 lg:ml-[280px] xl:mr-[340px] pt-8 max-w-7xl mx-auto w-full relative">
                {/* Skeleton Loading Overlay */}
                <AnimatePresence>
                  {simulationLoading && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 z-[45] px-4 md:px-8 pt-8 bg-obsidian/20 backdrop-blur-[2px] pointer-events-none"
                    >
                      <div className="w-full h-full flex flex-col gap-8">
                        <div className="h-16 w-1/2 bg-white/[0.03] rounded-2xl animate-pulse" />
                        <div className="flex-1 grid grid-cols-12 gap-8">
                           <div className="col-span-12 lg:col-span-3 space-y-6">
                              <div className="h-48 bg-white/[0.03] rounded-2xl animate-pulse" />
                              <div className="h-64 bg-white/[0.03] rounded-2xl animate-pulse" />
                           </div>
                           <div className="col-span-12 lg:col-span-6 h-[400px] lg:h-full bg-white/[0.03] rounded-3xl animate-pulse" />
                           <div className="col-span-12 lg:col-span-3 space-y-6">
                              <div className="h-32 bg-white/[0.03] rounded-2xl animate-pulse" />
                              <div className="h-32 bg-white/[0.03] rounded-2xl animate-pulse" />
                              <div className="h-32 bg-white/[0.03] rounded-2xl animate-pulse" />
                           </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence mode="wait">
                  {activeSector === "EDUCATION" && (
                    <motion.div
                      key="edu"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      className="h-full"
                    >
                      <SectorEdu
                        stats={{
                          liquidity: simulationStats.educationLiquidity,
                          retention: simulationStats.educationRetention,
                          financeStrategy: simulationStats.educationFinanceStrategy,
                          hrAdvisory: simulationStats.educationHrAdvisory,
                          totalEvaluation: simulationStats.totalEvaluation,
                        }}
                        logs={eduLogs}
                        loading={simulationLoading}
                        onChangeStat={(updater) =>
                          setSimulationStats((prev) => ({
                            ...prev,
                            educationLiquidity: updater.liquidity !== undefined ? updater.liquidity : prev.educationLiquidity,
                            educationRetention: updater.retention !== undefined ? updater.retention : prev.educationRetention,
                          }))
                        }
                      />
                    </motion.div>
                  )}

                  {activeSector === "RESTAURANT" && (
                    <motion.div
                      key="rest"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      className="h-full"
                    >
                      <SectorRest
                        stats={{
                          revenueVelocity: simulationStats.restaurantRevenueVelocity,
                          proteinFreshness: simulationStats.restaurantProteinFreshness,
                          produceFreshness: simulationStats.restaurantProduceFreshness,
                          kitchenLoad: simulationStats.restaurantKitchenLoad,
                          totalEvaluation: simulationStats.totalEvaluation,
                        }}
                        logs={eduLogs}
                        loading={simulationLoading}
                        onChangeStat={(updater) =>
                          setSimulationStats((prev) => ({
                            ...prev,
                            restaurantRevenueVelocity: updater.revenueVelocity !== undefined ? updater.revenueVelocity : prev.restaurantRevenueVelocity,
                            restaurantProteinFreshness: updater.proteinFreshness !== undefined ? updater.proteinFreshness : prev.restaurantProteinFreshness,
                            restaurantProduceFreshness: updater.produceFreshness !== undefined ? updater.produceFreshness : prev.restaurantProduceFreshness,
                            restaurantKitchenLoad: updater.kitchenLoad !== undefined ? updater.kitchenLoad : prev.restaurantKitchenLoad,
                          }))
                        }
                      />
                    </motion.div>
                  )}

                  {activeSector === "AGRICULTURE" && (
                    <motion.div
                      key="agri"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      className="h-full"
                    >
                      <SectorAgri
                        stats={{
                          waterReserves: simulationStats.agricultureWaterReserves,
                          hydroponicCount: simulationStats.agricultureHydroponicCount,
                          harvestDronesCount: simulationStats.agricultureHarvestDronesCount,
                          cropYieldDelta: simulationStats.agricultureCropYieldDelta,
                          totalEvaluation: simulationStats.totalEvaluation,
                        }}
                        logs={eduLogs}
                        loading={simulationLoading}
                        onChangeStat={(updater) =>
                          setSimulationStats((prev) => ({
                            ...prev,
                            agricultureWaterReserves: updater.waterReserves !== undefined ? updater.waterReserves : prev.agricultureWaterReserves,
                            agricultureHydroponicCount: updater.hydroponicCount !== undefined ? updater.hydroponicCount : prev.agricultureHydroponicCount,
                            agricultureHarvestDronesCount: updater.harvestDronesCount !== undefined ? updater.harvestDronesCount : prev.agricultureHarvestDronesCount,
                            cropYieldDelta: updater.cropYieldDelta !== undefined ? updater.cropYieldDelta : prev.agricultureCropYieldDelta,
                          }))
                        }
                      />
                    </motion.div>
                  )}

                  {activeSector === "HEALTHCARE" && (
                    <motion.div
                      key="health"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      className="h-full"
                    >
                      <SectorHealth
                        stats={{
                          bioAnalyzersEfficiency: simulationStats.healthcareBioAnalyzersEfficiency,
                          throughputDaily: simulationStats.healthcareThroughputDaily,
                          sterilityLevel: simulationStats.healthcareSterilityLevel,
                          researchProgress: simulationStats.healthcareResearchProgress,
                          activeSyntheses: simulationStats.healthcareActiveSyntheses,
                          neuralSyncStatus: simulationStats.healthcareNeuralSyncStatus,
                          totalEvaluation: simulationStats.totalEvaluation,
                        }}
                        loading={simulationLoading}
                        onChangeStat={(updater) =>
                          setSimulationStats((prev) => ({
                            ...prev,
                            healthcareBioAnalyzersEfficiency: updater.bioAnalyzersEfficiency !== undefined ? updater.bioAnalyzersEfficiency : prev.healthcareBioAnalyzersEfficiency,
                            healthcareThroughputDaily: updater.throughputDaily !== undefined ? updater.throughputDaily : prev.healthcareThroughputDaily,
                            healthcareSterilityLevel: updater.sterilityLevel !== undefined ? updater.sterilityLevel : prev.healthcareSterilityLevel,
                            healthcareResearchProgress: updater.researchProgress !== undefined ? updater.researchProgress : prev.healthcareResearchProgress,
                          }))
                        }
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </main>

              {/* Dynamic Gemini Chatbot interactive Advisory Terminal Side Panel */}
              <aside className="fixed right-6 top-20 h-[calc(100vh-140px)] w-[320px] z-30 hidden xl:flex flex-col justify-stretch">
                <AIChatConsole
                  activeSector={activeSector}
                  onSimulationUpdate={handleSimulationUpdate}
                  architectName={architect.name}
                  landScale={architect.landScale}
                  verticalLimit={architect.verticalLimit}
                  luaScript={architect.luaScript}
                  currentStats={simulationStats}
                />
              </aside>
            </div>

            {/* Bottom active status ticker */}
            <StatusBar />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

