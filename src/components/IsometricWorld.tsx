import React, { useState, useEffect } from "react";
import { 
  Building2, 
  Wrench, 
  Trash2, 
  Sparkles, 
  Cpu, 
  Zap, 
  Flame, 
  Coins, 
  Trophy, 
  Lock, 
  Plus, 
  ChevronRight, 
  ShoppingBag, 
  Navigation,
  CheckCircle,
  GraduationCap,
  Sprout,
  Utensils,
  HeartPulse,
  Compass,
  ArrowUpRight
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface IsometricWorldProps {
  sector: "EDUCATION" | "AGRICULTURE" | "RESTAURANT" | "HEALTHCARE";
  stats: any;
  onChangeStat?: (updater: any) => void;
  initialBudget?: number;
}

interface BuildingItem {
  id: string;
  gridX: number;
  gridY: number;
  type: string;
  name: string;
  level: number;
  status: "ONLINE" | "UPGRADING" | "BOOSTED";
  statYield: string;
  themeColor: string;
  cost: number;
  xpValue: number;
}

interface InventoryOption {
  type: string;
  name: string;
  description: string;
  cost: number;
  xpValue: number;
  unlockedAtLevel: number;
  themeColor: string;
  statModifier: string;
  icon: any;
}

export default function IsometricWorld({ sector, stats, onChangeStat, initialBudget = 250000 }: IsometricWorldProps) {
  // Game simulation economy
  const [credits, setCredits] = useState<number>(() => {
    const saved = localStorage.getItem(`coc_credits_${sector}`);
    if (saved) return parseInt(saved);
    const globalBudget = localStorage.getItem("coc_initial_budget");
    return globalBudget ? parseInt(globalBudget) : initialBudget;
  });
  
  const [xp, setXp] = useState<number>(() => {
    const saved = localStorage.getItem(`coc_xp_${sector}`);
    return saved ? parseInt(saved) : 1200;
  });

  const [level, setLevel] = useState<number>(() => {
    // Level formula: Level 1 has 0+ XP, Lvl 2: 1500 XP, Lvl 3: 4000 XP, Lvl 4: 8000 XP, Lvl 5: 15000 XP
    const savedXp = localStorage.getItem(`coc_xp_${sector}`);
    const cx = savedXp ? parseInt(savedXp) : 1200;
    if (cx >= 15000) return 5;
    if (cx >= 8000) return 4;
    if (cx >= 4000) return 3;
    if (cx >= 1500) return 2;
    return 1;
  });

  const [selectedTile, setSelectedTile] = useState<{ x: number; y: number } | null>(null);
  const [hoveredTile, setHoveredTile] = useState<{ x: number; y: number } | null>(null);
  const [selectedBuilding, setSelectedBuilding] = useState<BuildingItem | null>(null);
  const [buildings, setBuildings] = useState<BuildingItem[]>([]);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [activeConstructLog, setActiveConstructLog] = useState<string>("SYSTEM INITIATED - VENTURE GRID READY");
  const [floatingTexts, setFloatingTexts] = useState<{ id: string; x: number; y: number; text: string; color: string }[]>([]);
  
  // Drone simulation coords
  const [drones, setDrones] = useState<{ id: number; x: number; y: number; height: number; tx: number; ty: number }[]>([
    { id: 1, x: 2, y: 1, height: 45, tx: 5, ty: 7 },
    { id: 2, x: 6, y: 3, height: 38, tx: 1, ty: 2 },
  ]);

  const gridSize = 8; // Clash of Clans larger canvas (8x8)

  // Domain specific inventories
  const inventories: Record<string, InventoryOption[]> = {
    EDUCATION: [
      {
        type: "SCHOOL",
        name: "Elementary Academy Pod",
        description: "Standard primary education hub with biometric login and smart display matrices.",
        cost: 25000,
        xpValue: 1200,
        unlockedAtLevel: 1,
        themeColor: "#ff9a33",
        statModifier: "+12% Education Quality",
        icon: GraduationCap
      },
      {
        type: "LOCATION_BEACON",
        name: "Logistics Location Beacon",
        description: "Optimal geolocation emitter prioritizing student physical route efficiency.",
        cost: 12000,
        xpValue: 600,
        unlockedAtLevel: 1,
        themeColor: "#ff7a00",
        statModifier: "+5% Operational Speed",
        icon: Compass
      },
      {
        type: "STAFF_QUARTERS",
        name: "Executive Staff Quarters",
        description: "Luxury living modules for teachers, minimizing burnout vectors.",
        cost: 45000,
        xpValue: 2400,
        unlockedAtLevel: 1,
        themeColor: "#a855f7",
        statModifier: "+18% Staff Retention Rate",
        icon: Building2
      },
      {
        type: "AI_MATRIX",
        name: "Smart Instructor Array",
        description: "Real-time automated tutor module. Accelerates customized IQ growth.",
        cost: 65000,
        xpValue: 4000,
        unlockedAtLevel: 2,
        themeColor: "#ff5a00",
        statModifier: "+25% IQ Generation Boost",
        icon: Cpu
      },
      {
        type: "QUANTUM_LAB",
        name: "Advanced Brain Academy Lab",
        description: "Deep holographic simulation chambers unlocking ultimate spatial learning.",
        cost: 120000,
        xpValue: 9000,
        unlockedAtLevel: 3,
        themeColor: "#ec4899",
        statModifier: "+42% R&D Breakthroughs",
        icon: Sparkles
      },
      {
        type: "HOLO_LIBRARY",
        name: "Holographic Academy Library",
        description: "Meta-verse learning deck connected with galactic mainframe nodes.",
        cost: 220000,
        xpValue: 18000,
        unlockedAtLevel: 5,
        themeColor: "#f59e0b",
        statModifier: "+75% retention, unlock top perks",
        icon: ArrowUpRight
      }
    ],
    AGRICULTURE: [
      {
        type: "HYDRO_GREENHOUSE",
        name: "Hydroponic Bio-Dome",
        description: "Dual atmospheric grow chambers with direct automated crop feeding pipelines.",
        cost: 20000,
        xpValue: 1000,
        unlockedAtLevel: 1,
        themeColor: "#ff5a00",
        statModifier: "+150k Tons Harvest/sec",
        icon: Sprout
      },
      {
        type: "IRRIGATION",
        name: "Crystalline Sprinkler",
        description: "High pressure automatic atmospheric condenser dispersing nutrient cocktails.",
        cost: 15000,
        xpValue: 700,
        unlockedAtLevel: 1,
        themeColor: "#eab308",
        statModifier: "+14.2% Water Recycling Efficiency",
        icon: Compass
      },
      {
        type: "DRONE_HANGAR",
        name: "UAV Drone Launchport",
        description: "Autonomous flight bays housing rapid-scan crop monitor and harvester drones.",
        cost: 50000,
        xpValue: 2800,
        unlockedAtLevel: 1,
        themeColor: "#38bdf8",
        statModifier: "+30 Autonomous Drones Active",
        icon: Navigation
      },
      {
        type: "CO2_BUFFER",
        name: "Thermal CO2 Bio-Regulator",
        description: "Absorbs natural impurities while pumping optimized growth gases.",
        cost: 75000,
        xpValue: 5000,
        unlockedAtLevel: 2,
        themeColor: "#a855f7",
        statModifier: "+28% Speed Crop Ripen Timer",
        icon: Building2
      },
      {
        type: "GENETIC_LAB",
        name: "Genetic Seed Lab",
        description: "Gene-splicing deck producing frost-resistant star-shaped tomatoes and grains.",
        cost: 135000,
        xpValue: 10000,
        unlockedAtLevel: 3,
        themeColor: "#eab308",
        statModifier: "+65% Food Health Grades",
        icon: Sparkles
      },
      {
        type: "ATMOSPHERE_CONDENSER",
        name: "Hyper Condenser Tower",
        description: "Extracts deep moisture from thin air cloud layers. Infinite water output.",
        cost: 240000,
        xpValue: 20000,
        unlockedAtLevel: 5,
        themeColor: "#ec4899",
        statModifier: "+95% Water Reserves Delta",
        icon: ArrowUpRight
      }
    ],
    RESTAURANT: [
      {
        type: "ROBO_OVEN",
        name: "Robo-Thermal Super Oven",
        description: "Precise infrared light arrays cooking steaks to atomic level perfection.",
        cost: 18000,
        xpValue: 900,
        unlockedAtLevel: 1,
        themeColor: "#f97316",
        statModifier: "+24k Plates/Hr Prepared",
        icon: Utensils
      },
      {
        type: "VEGETABLE_STACK",
        name: "Vertical Hydro-Grow Deck",
        description: "Grown fresh inside the kitchen! Eliminates vendor delivery delay vectors.",
        cost: 14000,
        xpValue: 650,
        unlockedAtLevel: 1,
        themeColor: "#84cc16",
        statModifier: "+95% Direct Produce Freshness",
        icon: Sprout
      },
      {
        type: "CONVEYOR",
        name: "Kinetic Plate Delivery Deck",
        description: "Magnetic mag-lev conveyor ribbons serving meals directly to tables at speed.",
        cost: 32000,
        xpValue: 1800,
        unlockedAtLevel: 1,
        themeColor: "#3b82f6",
        statModifier: "-20% Kitchen Operational Load",
        icon: Compass
      },
      {
        type: "DIGI_COUNTER",
        name: "Holographic Cash Register",
        description: "Instant transaction payment scanner handling client checkout in 2 milliseconds.",
        cost: 60000,
        xpValue: 4500,
        unlockedAtLevel: 2,
        themeColor: "#ecc94b",
        statModifier: "+40% Revenue Velocity Boost",
        icon: Coins
      },
      {
        type: "FLAVOR_SYNTH",
        name: "Molecular Flavor Synthesizer",
        description: "Infuses culinary recipes with edible quantum memory, boosting user satisfaction.",
        cost: 110000,
        xpValue: 8500,
        unlockedAtLevel: 3,
        themeColor: "#a855f7",
        statModifier: "+55% Return Client Frequencies",
        icon: Sparkles
      },
      {
        type: "CRYO_HUB",
        name: "Cryogenic Vault Central",
        description: "Zero entropy preservation deck keeping biological produce immortalized.",
        cost: 210000,
        xpValue: 16000,
        unlockedAtLevel: 5,
        themeColor: "#22d3ee",
        statModifier: "Perfect 100% Chef Sterility",
        icon: ArrowUpRight
      }
    ],
    HEALTHCARE: [
      {
        type: "DIAGNOSTICS_DECK",
        name: "Medical Analyzer Scan Deck",
        description: "Scans patient organic structures for molecular dysfuntion in seconds.",
        cost: 22000,
        xpValue: 1100,
        unlockedAtLevel: 1,
        themeColor: "#eab308",
        statModifier: "+18% Diagnostics Capacity",
        icon: HeartPulse
      },
      {
        type: "SYNTH_MODULE",
        name: "Proteomic Catalyst Incubator",
        description: "Auto-folds molecules to print tailored peptide vaccines on-site.",
        cost: 19000,
        xpValue: 800,
        unlockedAtLevel: 1,
        themeColor: "#a855f7",
        statModifier: "+10% Synthetic Cure Synthesis",
        icon: Building2
      },
      {
        type: "EEG_CRADLE",
        name: "Medical Wave Cradle",
        description: "Mind wave synchronizer linking cognitive nodes for mental balancing.",
        cost: 48000,
        xpValue: 2600,
        unlockedAtLevel: 1,
        themeColor: "#ec4899",
        statModifier: "+22% Neural Wave Alignment",
        icon: Compass
      },
      {
        type: "NURSE_ANDROID",
        name: "Care Assistant Station",
        description: "Equipped with hyper-precision surgical syringes and compassionate voices.",
        cost: 85000,
        xpValue: 6000,
        unlockedAtLevel: 2,
        themeColor: "#10b981",
        statModifier: "+40% Patient Daily Throughput",
        icon: Sparkles
      },
      {
        type: "DNA_SYNTHESIZER",
        name: "DNA Synthesis Core",
        description: "Re-maps genetic codons to cure chronic damage, editing cells back to youth.",
        cost: 145000,
        xpValue: 11000,
        unlockedAtLevel: 3,
        themeColor: "#3b82f6",
        statModifier: "+75% Advanced Treatment Velocity",
        icon: Cpu
      },
      {
        type: "NANOBOT_DISPENSER",
        name: "Medical Dispenser Central",
        description: "Injects cell-sized medical drones for internal continuous vascular repairs.",
        cost: 260000,
        xpValue: 22000,
        unlockedAtLevel: 5,
        themeColor: "#f59e0b",
        statModifier: "Perfect Grade A+ Sterile Grade",
        icon: ArrowUpRight
      }
    ]
  };

  // Local storage save helpers to persist economy across tabs safely
  const saveGameState = (updatedCredits: number, updatedXp: number, updatedLevel: number) => {
    localStorage.setItem(`coc_credits_${sector}`, updatedCredits.toString());
    localStorage.setItem(`coc_xp_${sector}`, updatedXp.toString());
    localStorage.setItem(`coc_xp_${sector}`, updatedXp.toString());
  };

  // Grid reconstruction when active stats or sector changes
  useEffect(() => {
    const freshBuildings: BuildingItem[] = [];

    // All domains start with highly impressive main upgradable center HQ base!
    const mainBuildingThemes: Record<string, { name: string; color: string; val: string }> = {
      EDUCATION: { name: "BizForge Academy HQ", color: "#ff7a00", val: "Main Academic Center" },
      AGRICULTURE: { name: "Harvest Supply Chain HQ", color: "#ff5a00", val: "Global Agri-Yield Logistics Hub" },
      RESTAURANT: { name: "Gourmet Foods Main HQ", color: "#f97316", val: "Thermal Network Operational Center" },
      HEALTHCARE: { name: "Biotech Medical HQ", color: "#eab308", val: "Clinical Synthesis Control Hub" },
    };

    const currentHq = mainBuildingThemes[sector];

    // Read previous HQ level from state if exists
    const savedHqLevel = localStorage.getItem(`coc_hq_level_${sector}`);
    const hqLevel = savedHqLevel ? parseInt(savedHqLevel) : 1;

    freshBuildings.push({
      id: `HQ_MAIN_${sector}`,
      gridX: 3,
      gridY: 3,
      type: "HQ",
      name: currentHq.name,
      level: hqLevel,
      status: "ONLINE",
      statYield: currentHq.val,
      themeColor: currentHq.color,
      cost: 0,
      xpValue: 1000
    });

    // Populate standard structures based on initial inputs or stats values to synchronize state!
    if (sector === "EDUCATION") {
      const classCount = Math.max(1, Math.min(3, Math.floor((stats.liquidity || 50) / 30)));
      for (let i = 0; i < classCount; i++) {
        freshBuildings.push({
          id: `SCHOOL_${i}_${i}`,
          gridX: 1 + i,
          gridY: 5,
          type: "SCHOOL",
          name: `Elementary Pod B-${i+1}`,
          level: 1,
          status: "ONLINE",
          statYield: "+12% Education Quality",
          themeColor: "#ff9a33",
          cost: 25000,
          xpValue: 1200
        });
      }
    } else if (sector === "AGRICULTURE") {
      const domeCount = Math.max(1, Math.min(3, Math.floor((stats.hydroponicCount || 1000) / 600)));
      for (let i = 0; i < domeCount; i++) {
        freshBuildings.push({
          id: `HYDRO_GREENHOUSE_${i}`,
          gridX: 5,
          gridY: 1 + i,
          type: "HYDRO_GREENHOUSE",
          name: `Smart Bio-Dome A-${i+1}`,
          level: 1,
          status: "ONLINE",
          statYield: "+150k Tons Harvest/sec",
          themeColor: "#ff5a00",
          cost: 20000,
          xpValue: 1000
        });
      }
    } else if (sector === "RESTAURANT") {
      const ovenCount = Math.max(1, Math.min(3, Math.floor((stats.revenueVelocity || 14000) / 6000)));
      for (let i = 0; i < ovenCount; i++) {
        freshBuildings.push({
          id: `ROBO_OVEN_${i}`,
          gridX: 2,
          gridY: 1 + i,
          type: "ROBO_OVEN",
          name: `Atom Thermal Range L${i+1}`,
          level: 1,
          status: "ONLINE",
          statYield: "+24k Plates/Hr Prepared",
          themeColor: "#f97316",
          cost: 18000,
          xpValue: 900
        });
      }
    } else if (sector === "HEALTHCARE") {
      const diagnosticCount = Math.max(1, Math.min(2, Math.floor((stats.bioAnalyzersEfficiency || 90) / 45)));
      for (let i = 0; i < diagnosticCount; i++) {
        freshBuildings.push({
          id: `DIAGNOSTICS_DECK_${i}`,
          gridX: 1 + i,
          gridY: 2,
          type: "DIAGNOSTICS_DECK",
          name: `Diagnostics Stack Sector ${i+1}`,
          level: 1,
          status: "ONLINE",
          statYield: "+18% Diagnostics Capacity",
          themeColor: "#eab308",
          cost: 220000,
          xpValue: 1100
        });
      }
    }

    setBuildings(freshBuildings);
    setActiveConstructLog(`GRID RECONSTRUCTED: SYNCING ACCOUNT METRICS. POPULATED ${freshBuildings.length} GRAPHIC MODELS.`);
  }, [sector, stats]);

  // Periodic visual simulation (ticks for income + flying drones paths)
  useEffect(() => {
    const gameTimer = setInterval(() => {
      // Move drones closer to randomized targets like a live Clash of Clans bot!
      setDrones(prevDrones => prevDrones.map(drone => {
        const distance = Math.hypot(drone.tx - drone.x, drone.ty - drone.y);
        if (distance < 0.25) {
          return {
            ...drone,
            tx: Math.floor(Math.random() * gridSize),
            ty: Math.floor(Math.random() * gridSize),
          };
        } else {
          return {
            ...drone,
            x: drone.x + (drone.tx - drone.x) / distance * 0.18,
            y: drone.y + (drone.ty - drone.y) / distance * 0.18,
          };
        }
      }));

      // Generate passive local credit cash yields from placed structures
      if (buildings.length > 1) {
        const generationValue = buildings.length * 150;
        setCredits(prev => {
          const nextVal = prev + generationValue;
          localStorage.setItem(`coc_credits_${sector}`, nextVal.toString());
          return nextVal;
        });

        // Earn XP
        setXp(p => {
          const nextXp = p + 15;
          localStorage.setItem(`coc_xp_${sector}`, nextXp.toString());
          // Level up evaluation
          let newLvl = 1;
          if (nextXp >= 15000) newLvl = 5;
          else if (nextXp >= 8000) newLvl = 4;
          else if (nextXp >= 4000) newLvl = 3;
          else if (nextXp >= 1500) newLvl = 2;
          
          if (newLvl > level) {
            setLevel(newLvl);
            setActiveConstructLog(`LEVEL UP! VENTURE STAGE HAS DEPLOYED LEVEL ${newLvl} OUTLOOK.`);
            // Floating level text
            setFloatingTexts(ft => [...ft, {
              id: Math.random().toString(),
              x: 350,
              y: 80,
              text: `VENTURE LEVEL UP! ${newLvl}`,
              color: "#eab308"
            }]);
          }
          return nextXp;
        });

        // Display floating credit text on map
        const randB = buildings[Math.floor(Math.random() * buildings.length)];
        const cx = 350 + (randB.gridX - randB.gridY) * 36;
        const cy = 120 + (randB.gridX + randB.gridY) * 18 - 32;

        const fid = Math.random().toString();
        setFloatingTexts(prev => [...prev, {
          id: fid,
          x: cx,
          y: cy,
          text: `+$${generationValue} Credits`,
          color: "#ff5a00"
        }]);

        setTimeout(() => {
          setFloatingTexts(prev => prev.filter(t => t.id !== fid));
        }, 1800);
      }
    }, 2800);

    return () => clearInterval(gameTimer);
  }, [buildings, level, sector]);

  const handleTileClick = (x: number, y: number) => {
    setSelectedTile({ x, y });
    const bMatch = buildings.find(b => b.gridX === x && b.gridY === y);
    if (bMatch) {
      setSelectedBuilding(bMatch);
    } else {
      setSelectedBuilding(null);
      // Automatically prompt open inventory pop up to select dynamic items
      setIsShopOpen(true);
    }
  };

  // Handle purchasable placement
  const executeBuyAndBuild = (opt: InventoryOption) => {
    if (!selectedTile) return;
    const { x, y } = selectedTile;

    // Check overlaps
    if (buildings.some(b => b.gridX === x && b.gridY === y)) {
      setActiveConstructLog(`ERROR: PLACEMENT CRITICAL OUTBOUND FAULT. BLOCK OVERLAPPING AT [${x}, ${y}]`);
      return;
    }

    if (credits < opt.cost) {
      alert("Insufficient account credits! Farm some credits from passive structures over time.");
      return;
    }

    // Deduct money & add experience!
    const nextCredits = credits - opt.cost;
    const nextXp = xp + opt.xpValue;
    setCredits(nextCredits);
    setXp(nextXp);

    localStorage.setItem(`coc_credits_${sector}`, nextCredits.toString());
    localStorage.setItem(`coc_xp_${sector}`, nextXp.toString());

    // Calc next level
    let newLvl = level;
    if (nextXp >= 15000) newLvl = 5;
    else if (nextXp >= 8000) newLvl = 4;
    else if (nextXp >= 4000) newLvl = 3;
    else if (nextXp >= 1500) newLvl = 2;
    setLevel(newLvl);

    const newBuilding: BuildingItem = {
      id: `${opt.type}_${x}_${y}`,
      gridX: x,
      gridY: y,
      type: opt.type,
      name: opt.name,
      level: 1,
      status: "ONLINE",
      statYield: opt.statModifier,
      themeColor: opt.themeColor,
      cost: opt.cost,
      xpValue: opt.xpValue
    };

    setBuildings(prev => [...prev, newBuilding]);
    setSelectedBuilding(newBuilding);
    setIsShopOpen(false);

    // Apply stat changes parameters upstream to synchronize with left/right dashboard controllers!
    if (onChangeStat) {
      if (sector === "EDUCATION") {
        if (opt.type === "SCHOOL") {
          onChangeStat({ liquidity: Math.max(10, (stats.liquidity || 50) + 10) });
        } else if (opt.type === "STAFF_QUARTERS") {
          onChangeStat({ retention: Math.min(100, (stats.retention || 50) + 8) });
        }
      } else if (sector === "AGRICULTURE") {
        if (opt.type === "HYDRO_GREENHOUSE") {
          onChangeStat({ hydroponicCount: (stats.hydroponicCount || 1000) + 180 });
        } else if (opt.type === "DRONE_HANGAR") {
          onChangeStat({ harvestDronesCount: (stats.harvestDronesCount || 30) + 12 });
        }
      } else if (sector === "RESTAURANT") {
        if (opt.type === "DIGI_COUNTER") {
          onChangeStat({ revenueVelocity: (stats.revenueVelocity || 10000) + 2400 });
        } else if (opt.type === "VEGETABLE_STACK") {
          onChangeStat({ produceFreshness: Math.min(100, (stats.produceFreshness || 70) + 12) });
        }
      } else if (sector === "HEALTHCARE") {
        if (opt.type === "DIAGNOSTICS_DECK") {
          onChangeStat({ bioAnalyzersEfficiency: Math.min(100, (stats.bioAnalyzersEfficiency || 70) + 9) });
        }
      }
    }

    setActiveConstructLog(`SUCCESS: BOUGHT & DEPLOYED ${opt.name} AT FIELD COORDINATE [${x}, ${y}]`);
  };

  // Upgradable core main building (HQ level state) & items Leveling up
  const upgradeHQorBuilding = () => {
    if (!selectedBuilding) return;

    const upgradeCost = selectedBuilding.type === "HQ" ? selectedBuilding.level * 60000 : selectedBuilding.level * 15000;
    if (credits < upgradeCost) {
      alert(`Insufficient funds for Upgrade! Needs $${upgradeCost.toLocaleString()} Credits`);
      return;
    }

    const nextCredits = credits - upgradeCost;
    setCredits(nextCredits);
    localStorage.setItem(`coc_credits_${sector}`, nextCredits.toString());

    setBuildings(prev => prev.map(b => {
      if (b.id === selectedBuilding.id) {
        const nextLvl = Math.min(b.level + 1, 5);
        const updated = {
          ...b,
          level: nextLvl
        };
        setSelectedBuilding(updated);

        if (b.type === "HQ") {
          localStorage.setItem(`coc_hq_level_${sector}`, nextLvl.toString());
        }

        // Animated level success message details
        const cx = 350 + (b.gridX - b.gridY) * 36;
        const cy = 120 + (b.gridX + b.gridY) * 18 - 45;
        setFloatingTexts(ft => [...ft, {
          id: Math.random().toString(),
          x: cx,
          y: cy,
          text: `GRAPHIC BOOST LVL ${nextLvl}!`,
          color: "#ff7a00"
        }]);

        setActiveConstructLog(`UPGRADE COMPLETED: ${b.name} EVOLVED TO GRAPHICS LEVEL ${nextLvl}! BEAUTIFIED CORE SHELL.`);
        return updated;
      }
      return b;
    }));
  };

  // Scrap / Demolish Structure
  const scrapBuilding = () => {
    if (!selectedBuilding) return;
    if (selectedBuilding.type === "HQ") {
      alert("Cannot demolish Venture HQ Center!");
      return;
    }

    const refund = Math.floor(selectedBuilding.cost * 0.5);
    const nextCredits = credits + refund;
    setCredits(nextCredits);
    localStorage.setItem(`coc_credits_${sector}`, nextCredits.toString());

    setBuildings(prev => prev.filter(b => b.id !== selectedBuilding.id));
    setActiveConstructLog(`SCRAPPED: DECONSTRUCTED ${selectedBuilding.name}. REFUNDED +$${refund.toLocaleString()} CREDITS.`);
    setSelectedBuilding(null);
  };

  const getHqVisual = (lvl: number, themeColor: string, cx: number, cy: number) => {
    // Highly rendered metallic/glass gradients for game-like look and feel
    const clr = themeColor;
    
    // Level 1: Sleek core reactor pod with glowing structural frame
    if (lvl === 1) {
      return (
        <g>
          {/* Circular shadow backing the base structure */}
          <ellipse cx={cx} cy={cy + 5} rx="26" ry="12" fill="url(#real-shadow)" opacity="0.8" />
          
          {/* Solid 3D Base Plinth slab */}
          <polygon points={`${cx - 22},${cy + 2} ${cx},${cy + 11} ${cx + 22},${cy + 2} ${cx},${cy - 7}`} fill="url(#metal-gray-dark)" stroke="#334155" />
          <polygon points={`${cx - 22},${cy + 2} ${cx},${cy + 11} ${cx},${cy + 7} ${cx - 22},${cy - 2}`} fill="#1e293b" />
          <polygon points={`${cx},${cy + 11} ${cx + 22},${cy + 2} ${cx + 22},${cy - 2} ${cx},${cy + 7}`} fill="#0f172a" />
          
          {/* Main pyramid dome reactor housing */}
          <polygon points={`${cx - 18},${cy - 2} ${cx},${cy + 6} ${cx + 18},${cy - 2} ${cx},${cy - 12}`} fill="url(#metal-gray-light)" stroke="#475569" strokeWidth="0.5" />
          <polygon points={`${cx - 18},${cy - 2} ${cx},${cy + 6} ${cx},${cy - 22} ${cx - 18},${cy - 25}`} fill="url(#glass-cyan)" opacity="0.85" stroke={clr} strokeWidth="0.5" />
          <polygon points={`${cx},${cy + 6} ${cx + 18},${cy - 2} ${cx + 18},${cy - 25} ${cx},${cy - 22}`} fill="url(#glass-cyan-dark)" opacity="0.6" stroke={clr} strokeWidth="0.5" />
          
          {/* Diagonal copper pipelines feeding the main frame */}
          <line x1={cx - 12} y1={cy + 1} x2={cx - 6} y2={cy - 15} stroke="#b45309" strokeWidth="2.5" />
          <line x1={cx + 12} y1={cy + 1} x2={cx + 6} y2={cy - 15} stroke="#b45309" strokeWidth="2.5" />
          
          {/* Dynamic pulsing core orb */}
          <circle cx={cx} cy={cy - 22} r="4.5" fill="#ffffff" stroke={clr} strokeWidth="1" className="animate-pulse" />
          
          {/* Rotating transmission laser rod */}
          <line x1={cx} y1={cy - 22} x2={cx} y2={cy - 44} stroke="#cbd5e1" strokeWidth="1.5" />
          <circle cx={cx} cy={cy - 44} r="3" fill="#ef4444" className="animate-ping" />
          <circle cx={cx} cy={cy - 44} r="2" fill="#ef4444" />
        </g>
      );
    }

    // Level 2: Double glass tower matrix shell with connecting platform bridge
    if (lvl === 2) {
      return (
        <g>
          <ellipse cx={cx} cy={cy + 6} rx="28" ry="13" fill="url(#real-shadow)" opacity="0.85" />
          
          {/* High-end Plinth slab with glowing yellow alert stripes */}
          <polygon points={`${cx - 24},${cy + 3} ${cx},${cy + 13} ${cx + 24},${cy + 3} ${cx},${cy - 7}`} fill="url(#metal-gray-dark)" stroke="#475569" />
          <polygon points={`${cx - 24},${cy + 3} ${cx - 18},${cy + 5} ${cx - 18},${cy + 1} ${cx - 24},${cy - 1}`} fill="#eab308" />
          <polygon points={`${cx + 18},${cy + 5} ${cx + 24},${cy + 3} ${cx + 24},${cy - 1} ${cx + 18},${cy + 1}`} fill="#eab308" />
          
          {/* Left Tower column */}
          <g transform={`translate(-10, -5)`}>
            <polygon points={`${cx - 12},${cy} ${cx},${cy + 5} ${cx + 12},${cy} ${cx},${cy - 5}`} fill="#334155" />
            <polygon points={`${cx - 12},${cy} ${cx},${cy + 5} ${cx},${cy - 25} ${cx - 12},${cy - 28}`} fill="url(#metal-gray-light)" stroke="#475569" />
            <polygon points={`${cx},${cy + 5} ${cx + 12},${cy} ${cx + 12},${cy - 28} ${cx},${cy - 25}`} fill="url(#glass-cyan-dark)" opacity="0.8" stroke={clr} />
            <polygon points={`${cx - 12},${cy - 28} ${cx},${cy - 25} ${cx + 12},${cy - 28} ${cx},${cy - 33}`} fill="url(#metal-gray-shiny)" />
            {/* Windows grids */}
            <rect x={cx - 8} y={cy - 20} width="6" height="15" fill="rgba(255, 122, 0, 0.4)" rx="1" className="animate-pulse" />
          </g>

          {/* Right Tower column */}
          <g transform={`translate(10, -5)`}>
            <polygon points={`${cx - 12},${cy} ${cx},${cy + 5} ${cx + 12},${cy} ${cx},${cy - 5}`} fill="#334155" />
            <polygon points={`${cx - 12},${cy} ${cx},${cy + 5} ${cx},${cy - 25} ${cx - 12},${cy - 28}`} fill="url(#glass-cyan-dark)" opacity="0.8" stroke={clr} />
            <polygon points={`${cx},${cy + 5} ${cx + 12},${cy} ${cx + 12},${cy - 28} ${cx},${cy - 25}`} fill="url(#metal-gray-light)" stroke="#475569" />
            <polygon points={`${cx - 12},${cy - 28} ${cx},${cy - 25} ${cx + 12},${cy - 28} ${cx},${cy - 33}`} fill="url(#metal-gray-shiny)" />
            <rect x={cx + 2} y={cy - 20} width="6" height="15" fill="rgba(255, 122, 0, 0.4)" rx="1" className="animate-pulse" />
          </g>

          {/* Golden bridge spanning between the columns */}
          <polygon points={`${cx - 10},${cy - 18} ${cx + 10},${cy - 18} ${cx + 10},${cy - 13} ${cx - 10},${cy - 13}`} fill="url(#gold-shimmer)" stroke="#eab308" strokeWidth="0.5" />
          
          {/* Active rotating communication radar dish on top */}
          <path d={`M ${cx - 8} ${cy - 40} Q ${cx} ${cy - 50} ${cx + 8} ${cy - 40} L ${cx} ${cy - 36} Z`} fill="#475569" stroke="#94a3b8" />
          <line x1={cx} y1={cy - 42} x2={cx + 8} y2={cy - 52} stroke="#facc15" strokeWidth="1.5" className="animate-pulse" />
          <circle cx={cx + 8} cy={cy - 52} r="2" fill="#facc15" />
        </g>
      );
    }

    // Level 3: Dual tower wings with glowing solar grids & diagnostic antennas
    if (lvl === 3) {
      return (
        <g>
          <ellipse cx={cx} cy={cy + 8} rx="30" ry="14" fill="url(#real-shadow)" opacity="0.9" />
          
          {/* Heavy Beveled carbon composite base block */}
          <polygon points={`${cx - 26},${cy + 4} ${cx},${cy + 15} ${cx + 26},${cy + 4} ${cx},${cy - 7}`} fill="#0f172a" stroke="#1e293b" strokeWidth="2" />
          
          {/* Massive central main structural matrix tower */}
          <polygon points={`${cx - 14},${cy - 3} ${cx},${cy + 4} ${cx + 14},${cy - 3} ${cx},${cy - 10}`} fill="url(#metal-gray-dark)" />
          <polygon points={`${cx - 14},${cy - 3} ${cx},${cy + 4} ${cx},${cy - 48} ${cx - 14},${cy - 53}`} fill="url(#metal-gray-light)" stroke="#475569" />
          <polygon points={`${cx},${cy + 4} ${cx + 14},${cy - 3} ${cx + 14},${cy - 53} ${cx},${cy - 48}`} fill="url(#glass-cyan-dark)" stroke={clr} />
          
          {/* Radiant gold crown cap with helipad markings */}
          <polygon points={`${cx - 14},${cy - 53} ${cx},${cy - 48} ${cx + 14},${cy - 53} ${cx},${cy - 58}`} fill="url(#gold-shimmer)" stroke="#fbbf24" />
          <circle cx={cx} cy={cy - 53} r="6" fill="none" stroke="#ffffff" strokeWidth="1" strokeDasharray="2,2" />
          <text x={cx} y={cy - 51} textAnchor="middle" fill="#ffffff" fontSize="5" fontWeight="bold">H</text>

          {/* Sleek Solar Wing Panels jutting outwards from flanks */}
          {/* Left Wing */}
          <polygon points={`${cx - 14},${cy - 12} ${cx - 26},${cy - 16} ${cx - 26},${cy - 36} ${cx - 14},${cy - 32}`} fill="url(#glass-cyan)" stroke="#ffffff" strokeWidth="0.8" opacity="0.85" />
          <line x1={cx - 20} y1={cy - 14} x2={cx - 20} y2={cy - 34} stroke="rgba(255,255,255,0.4)" strokeWidth="0.5" />
          <line x1={cx - 24} y1={cy - 16} x2={cx - 16} y2={cy - 33} stroke="rgba(255,255,255,0.4)" strokeWidth="0.5" />

          {/* Right Wing */}
          <polygon points={`${cx + 14},${cy - 12} ${cx + 26},${cy - 16} ${cx + 26},${cy - 36} ${cx + 14},${cy - 32}`} fill="url(#glass-cyan)" stroke="#ffffff" strokeWidth="0.8" opacity="0.85" />
          <line x1={cx + 20} y1={cy - 14} x2={cx + 20} y2={cy - 34} stroke="rgba(255,255,255,0.4)" strokeWidth="0.5" />
          <line x1={cx + 16} y1={cy - 16} x2={cx + 24} y2={cy - 33} stroke="rgba(255,255,255,0.4)" strokeWidth="0.5" />

          {/* Dual lightning capacitor rods */}
          <line x1={cx - 8} y1={cy - 53} x2={cx - 14} y2={cy - 68} stroke="#ffffff" strokeWidth="1" />
          <circle cx={cx - 14} cy={cy - 68} r="2.5" fill="#ef4444" className="animate-ping" />
          <circle cx={cx - 14} cy={cy - 68} r="1.5" fill="#ef4444" />

          <line x1={cx + 8} y1={cy - 53} x2={cx + 14} y2={cy - 68} stroke="#ffffff" strokeWidth="1" />
          <circle cx={cx + 14} cy={cy - 68} r="2.5" fill="#ff7a00" className="animate-ping" />
          <circle cx={cx + 14} cy={cy - 68} r="1.5" fill="#ff7a00" />
        </g>
      );
    }

    // Level 4: Tower with shimmering force field dome & plasma loop conduits
    if (lvl === 4) {
      return (
        <g>
          <ellipse cx={cx} cy={cy + 8} rx="34" ry="16" fill="url(#real-shadow)" opacity="0.95" />
          
          {/* Shimmering Force Field Dome backing */}
          <ellipse cx={cx} cy={cy - 22} rx="38" ry="32" fill="none" stroke="rgba(255, 122, 0, 0.4)" strokeWidth="1.5" strokeDasharray="6,4" className="animate-[spin_24s_linear_infinite]" />
          <ellipse cx={cx} cy={cy - 22} rx="36" ry="30" fill="url(#holo-radial-glow)" opacity="0.18" />

          {/* Reinforced hex foundation */}
          <polygon points={`${cx - 28},${cy + 3} ${cx},${cy + 16} ${cx + 28},${cy + 3} ${cx + 18},${cy - 8} ${cx - 18},${cy - 8}`} fill="url(#metal-gray-dark)" stroke="#334155" />
          
          {/* Multi-tiered sci-fi tower skyscraper */}
          {/* Tier 1 base body */}
          <polygon points={`${cx - 20},${cy - 3} ${cx},${cy + 5} ${cx + 20},${cy - 3} ${cx},${cy - 11}`} fill="#0f172a" />
          <polygon points={`${cx - 20},${cy - 3} ${cx},${cy + 5} ${cx},${cy - 35} ${cx - 20},${cy - 41}`} fill="url(#metal-gray-light)" stroke="#475569" />
          <polygon points={`${cx},${cy + 5} ${cx + 20},${cy - 3} ${cx + 20},${cy - 41} ${cx},${cy - 35}`} fill="url(#glass-cyan-dark)" stroke={clr} />

          {/* Tier 2 upper spire core */}
          <g transform={`translate(0, -32)`}>
            <polygon points={`${cx - 12},${cy - 3} ${cx},${cy + 2} ${cx + 12},${cy - 3} ${cx},${cy - 8}`} fill="#334155" />
            <polygon points={`${cx - 12},${cy - 3} ${cx},${cy + 2} ${cx},${cy - 32} ${cx - 12},${cy - 35}`} fill="url(#metal-gray-shiny)" stroke="#94a3b8" />
            <polygon points={`${cx},${cy + 2} ${cx + 12},${cy - 3} ${cx + 12},${cy - 35} ${cx},${cy - 32}`} fill="url(#gold-shimmer)" stroke="#fbbf24" />
          </g>

          {/* Cybernetic side stabilizing arcs with neon nodes */}
          <path d={`M ${cx - 20} ${cy - 12} Q ${cx - 32} ${cy - 40} ${cx - 10} ${cy - 52}`} fill="none" stroke={clr} strokeWidth="2.5" />
          <line x1={cx - 25} y1={cy - 30} x2={cx - 18} y2={cy - 30} stroke="#ffffff" strokeWidth="1" />
          
          <path d={`M ${cx + 20} ${cy - 12} Q ${cx + 32} ${cy - 40} ${cx + 10} ${cy - 52}`} fill="none" stroke={clr} strokeWidth="2.5" />
          <line x1={cx + 25} y1={cy - 30} x2={cx + 18} y2={cy - 30} stroke="#ffffff" strokeWidth="1" />

          {/* Top hyper-frequency particle beam transmitter */}
          <line x1={cx} y1={cy - 67} x2={cx} y2={cy - 84} stroke="#ffffff" strokeWidth="2" />
          <circle cx={cx} cy={cy - 84} r="5" fill="#f43f5e" className="animate-ping" />
          <circle cx={cx} cy={cy - 84} r="3" fill="#f43f5e" />
        </g>
      );
    }

    // Level 5: Spectacular Tycoon Ultimate BRAND NEW Levitating Citadel Metropolis!
    // Floating graphics height animation powered by simple CSS bounce
    return (
      <g>
        {/* Soft shadow map projection beneath the levitating citadel base */}
        <ellipse cx={cx} cy={cy + 8} rx="45" ry="18" fill="url(#real-shadow)" opacity="0.9" />
        
        {/* Heavy magnetic anchors rooted in ground */}
        <polygon points={`${cx - 32},${cy + 2} ${cx},${cy + 16} ${cx + 32},${cy + 2} ${cx},${cy - 9}`} fill="#020617" stroke="#1e293b" strokeWidth="1.5" />
        
        {/* Continuous electrical tesla lightning bolts anchoring bottom to ground */}
        <line x1={cx - 16} y1={cy + 4} x2={cx - 16} y2={cy - 20} stroke="#a855f7" strokeWidth="1.5" strokeDasharray="3,3" className="animate-pulse" />
        <line x1={cx + 16} y1={cy + 4} x2={cx + 16} y2={cy - 20} stroke="#a855f7" strokeWidth="1.5" strokeDasharray="3,3" className="animate-pulse" />
        <line x1={cx} y1={cy + 10} x2={cx} y2={cy - 24} stroke="#ff7a00" strokeWidth="2" strokeDasharray="2,2" className="animate-pulse" />

        {/* Master Levitating Spire Citadel Structure - Animated with soft CSS bounce */}
        <g className="animate-[bounce_3.2s_ease-in-out_infinite]">
          
          {/* Gravitational thrust flare glow */}
          <ellipse cx={cx} cy={cy - 28} rx="18" ry="6" fill="#f97316" className="animate-pulse" opacity="0.6" />
          <polygon points={`${cx - 10},${cy - 28} ${cx + 10},${cy - 28} ${cx},${cy - 12}`} fill="url(#laser-beam)" opacity="0.75" />

          {/* Levitating base crown disk platform */}
          <polygon points={`${cx - 30},${cy - 30} ${cx},${cy - 18} ${cx + 30},${cy - 30} ${cx},${cy - 40}`} fill="url(#metal-gray-dark)" stroke={clr} strokeWidth="2" />
          <polygon points={`${cx - 30},${cy - 30} ${cx},${cy - 18} ${cx},${cy - 24} ${cx - 30},${cy - 34}`} fill="url(#gold-shimmer)" />
          <polygon points={`${cx},${cy - 18} ${cx + 30},${cy - 30} ${cx + 30},${cy - 34} ${cx},${cy - 24}`} fill="#b45308" />

          {/* Left Wing Citadel Reactor */}
          <g transform={`translate(-16, -34)`}>
            <rect x={cx - 10} y={cy - 24} width="16" height="22" fill="url(#metal-gray-light)" rx="1" stroke="#334155" />
            <polygon points={`${cx - 10},${cy - 24} ${cx - 2},${cy - 20} ${cx + 6},${cy - 24} ${cx - 2},${cy - 27}`} fill="url(#glass-cyan)" opacity="0.9" />
          </g>

          {/* Right Wing Citadel Reactor */}
          <g transform={`translate(16, -34)`}>
            <rect x={cx - 6} y={cy - 24} width="16" height="22" fill="url(#metal-gray-light)" rx="1" stroke="#334155" />
            <polygon points={`${cx - 6},${cy - 24} ${cx + 2},${cy - 20} ${cx + 10},${cy - 24} ${cx + 2},${cy - 27}`} fill="url(#glass-cyan)" opacity="0.9" />
          </g>

          {/* Centered High glass crystal matrix vault */}
          <polygon points={`${cx - 12},${cy - 42} ${cx},${cy - 37} ${cx + 12},${cy - 42} ${cx},${cy - 48}`} fill="#334155" />
          <polygon points={`${cx - 12},${cy - 42} ${cx},${cy - 37} ${cx},${cy - 85} ${cx - 12},${cy - 88}`} fill="url(#glass-cyan)" opacity="0.85" stroke="#ffffff" />
          <polygon points={`${cx},${cy - 37} ${cx + 12},${cy - 42} ${cx + 12},${cy - 88} ${cx},${cy - 85}`} fill="url(#glass-cyan-dark)" opacity="0.6" stroke="#ffffff" />

          {/* Liquid power cooling pipe details wrap */}
          <path d={`M ${cx - 12} ${cy - 52} C ${cx - 20} ${cy - 62}, ${cx - 20} ${cy - 72}, ${cx - 12} ${cy - 82}`} fill="none" stroke="#ff5a00" strokeWidth="2" className="animate-pulse" />
          <path d={`M ${cx + 12} ${cy - 52} C ${cx + 20} ${cy - 62}, ${cx + 20} ${cy - 72}, ${cx + 12} ${cy - 82}`} fill="none" stroke="#ff5a00" strokeWidth="2" className="animate-pulse" />

          {/* Levitating atomic energy core orbiting stabilizer ring */}
          <ellipse cx={cx} cy={cy - 66} rx="28" ry="10" fill="none" stroke="#ec4899" strokeWidth="2" strokeDasharray="6,6" className="animate-[spin_8s_linear_infinite]" />
          <circle cx={cx - 18} cy={cy - 62} r="3" fill="#ec4899" className="animate-ping" />

          {/* Top Crown solar nodes with multi spire antennas */}
          <polygon points={`${cx - 12},${cy - 88} ${cx},${cy - 85} ${cx + 12},${cy - 88} ${cx},${cy - 92}`} fill="url(#gold-shimmer)" stroke="#fbbf24" />
          <line x1={cx} y1={cy - 88} x2={cx} y2={cy - 114} stroke="#ffffff" strokeWidth="2.5" />
          <polygon points={`${cx - 5},${cy - 108} ${cx + 5},${cy - 108} ${cx},${cy - 122}`} fill="#a855f7" className="animate-pulse" />
          <circle cx={cx} cy={cy - 122} r="4.5" fill="#f43f5e" />
        </g>
      </g>
    );
  };

  const getBuildingSprite = (b: BuildingItem, cx: number, cy: number) => {
    if (b.type === "HQ") {
      return getHqVisual(b.level, b.themeColor, cx, cy);
    }

    const h = 24 + b.level * 8;
    const clr = b.themeColor;

    // Beautiful themed graphics depending on each building's exact type class
    if (b.type === "SCHOOL" || b.type === "HOLO_LIBRARY" || b.type === "STAFF_QUARTERS") {
      return (
        <g>
          {/* Base foundation slab with carbon pattern line */}
          <ellipse cx={cx} cy={cy + 5} rx="18" ry="8" fill="url(#real-shadow)" opacity="0.75" />
          <polygon points={`${cx - 16},${cy + 2} ${cx},${cy + 10} ${cx + 16},${cy + 2} ${cx},${cy - 6}`} fill="#1e293b" stroke={clr} strokeWidth="1" />
          
          {/* Left wall polished steel panel */}
          <polygon points={`${cx - 16},${cy + 2} ${cx},${cy + 10} ${cx},${cy + 10 - h} ${cx - 16},${cy + 2 - h}`} fill="url(#metal-gray-light)" />
          {/* Dual glass window stripes on left wall */}
          <polygon points={`${cx - 12},${cy - 2} ${cx - 4},${cy + 2} ${cx - 4},${cy + 2 - h + 8} ${cx - 12},${cy - 2 - h + 8}`} fill="url(#glass-cyan)" opacity="0.9" />

          {/* Right wall glowing cyber panel */}
          <polygon points={`${cx},${cy + 10} ${cx + 16},${cy + 2} ${cx + 16},${cy + 2 - h} ${cx},${cy + 10 - h}`} fill="url(#metal-gray-dark)" />
          {/* Window glowing grids on right wall */}
          <polygon points={`${cx + 4},${cy + 4} ${cx + 12},${cy} ${cx + 12},${cy - h + 10} ${cx + 4},${cy + 4 - h + 10}`} fill="url(#glass-cyan-dark)" opacity="0.8" />

          {/* Roof with solar micro-array and dynamic learning dome */}
          <polygon points={`${cx},${cy + 10 - h} ${cx + 16},${cy + 2 - h} ${cx},${cy - 6 - h} ${cx - 16},${cy + 2 - h}`} fill="#475569" stroke={clr} />
          
          {/* Dynamic glowing floating matrix sphere on top representing academy nodes */}
          <circle cx={cx} cy={cy - h - 1} r="4.5" fill="none" stroke="#eab308" strokeWidth="1.5" className="animate-ping" />
          <circle cx={cx} cy={cy - h - 1} r="3" fill="#eab308" />
          <line x1={cx} y1={cy + 10 - h} x2={cx} y2={cy - h - 1} stroke="#ffffff" strokeWidth="1" />
        </g>
      );
    }

    if (b.type === "HYDRO_GREENHOUSE" || b.type === "CO2_BUFFER" || b.type === "GENETIC_LAB") {
      return (
        <g>
          <ellipse cx={cx} cy={cy + 5} rx="20" ry="9" fill="url(#real-shadow)" opacity="0.8" />
          
          {/* Base titanium dirt border slab */}
          <polygon points={`${cx - 18},${cy + 2} ${cx},${cy + 11} ${cx + 18},${cy + 2} ${cx},${cy - 7}`} fill="#0f172a" stroke="#ff5a00" strokeWidth="1.5" />
          
          {/* Translucent Greenhouse 3D Dome - Left and Right */}
          <path d={`M ${cx - 16} ${cy} C ${cx - 16} ${cy - h}, ${cx} ${cy - h - 4}, ${cx} ${cy - h - 4} L ${cx} ${cy + 9} Z`} fill="url(#greenhouse-glass)" opacity="0.8" stroke="#86efac" strokeWidth="0.5" />
          
          <path d={`M ${cx} ${cy - h - 4} C ${cx} ${cy - h - 4}, ${cx + 16} ${cx - h}, ${cx + 16} ${cy} L ${cx} ${cy + 9} Z`} fill="url(#greenhouse-glass-dark)" opacity="0.75" stroke="#4ade80" strokeWidth="0.5" />

          {/* Lush bright green bio-plants visible growing inside! */}
          <ellipse cx={cx - 6} cy={cy + 2} rx="4" ry="7" fill="#15803d" opacity="0.9" />
          <ellipse cx={cx + 6} cy={cy + 2} rx="4" ry="7" fill="#166534" opacity="0.95" />
          <circle cx={cx} cy={cy - 2} r="4.5" fill="#4ade80" opacity="0.9" />

          {/* Carbon vent pipe releasing soft environmental steam puffs */}
          <line x1={cx - 10} y1={cy - h/2} x2={cx - 14} y2={cy - h/2 - 10} stroke="#64748b" strokeWidth="1.5" />
          <circle cx={cx - 14} cy={cy - h/2 - 10} r="3" fill="#ffffff" opacity="0.3" className="animate-ping" />
        </g>
      );
    }

    if (b.type === "ROBO_OVEN" || b.type === "FLAVOR_SYNTH" || b.type === "CRYO_HUB") {
      return (
        <g>
          {/* Solid heavy steel foundation */}
          <ellipse cx={cx} cy={cy + 5} rx="18" ry="8" fill="url(#real-shadow)" opacity="0.8" />
          <polygon points={`${cx - 16},${cy + 2} ${cx},${cy + 10} ${cx + 16},${cy + 2} ${cx},${cy - 6}`} fill="#374151" stroke="#ea580c" strokeWidth="1" />

          {/* Shaded heavy furnace brick walls */}
          <polygon points={`${cx - 16},${cy + 2} ${cx},${cy + 10} ${cx},${cy + 10 - h} ${cx - 16},${cy + 2 - h}`} fill="url(#metal-gray-shiny)" />
          <polygon points={`${cx},${cy + 10} ${cx + 16},${cy + 2} ${cx + 16},${cy + 2 - h} ${cx},${cy + 10 - h}`} fill="url(#metal-gray-dark)" />

          {/* Dynamic hot kinetic range grill burner window */}
          <polygon points={`${cx - 10},${cy + 3} ${cx - 2},${cy + 7} ${cx - 2},${cy + 7 - h/2} ${cx - 10},${cy + 3 - h/2}`} fill="#f97316" className="animate-pulse" />
          
          {/* Flat top roof and golden steaming smoke stack chimneys */}
          <polygon points={`${cx},${cy + 10 - h} ${cx + 16},${cy + 2 - h} ${cx},${cy - 6 - h} ${cx - 16},${cy + 2 - h}`} fill="#1f2937" stroke="#fb923c" />
          
          {/* Exhaust chimney vents with orange flare pulses */}
          <g transform={`translate(4, -5)`}>
            <rect x={cx - 3} y={cy - h - 6} width="6" height="8" fill="#475569" stroke="#ea580c" strokeWidth="0.5" />
            <circle cx={cx} cy={cy - h - 6} r="4" fill="#f97316" opacity="0.32" className="animate-ping" />
          </g>
        </g>
      );
    }

    if (b.type === "DIAGNOSTICS_DECK" || b.type === "SYNTH_MODULE" || b.type === "DNA_SYNTHESIZER") {
      return (
        <g>
          <ellipse cx={cx} cy={cy + 5} rx="18" ry="8" fill="url(#real-shadow)" opacity="0.75" />
          
          {/* Clinical clean room white polymer base plinth */}
          <polygon points={`${cx - 16},${cy + 2} ${cx},${cy + 10} ${cx + 16},${cy + 2} ${cx},${cy - 6}`} fill="#f1f5f9" stroke="#0891b2" />

          {/* Sterile clean glass walls */}
          <polygon points={`${cx - 16},${cy + 2} ${cx},${cy + 10} ${cx},${cy + 10 - h} ${cx - 16},${cy + 2 - h}`} fill="url(#glass-cyan)" opacity="0.9" />
          <polygon points={`${cx},${cy + 10} ${cx + 16},${cy + 2} ${cx + 16},${cy + 2 - h} ${cx},${cy + 10 - h}`} fill="url(#glass-cyan-dark)" opacity="0.75" />

          {/* Interior scanning medical laser beams and heart pulse graphics */}
          <path d={`M ${cx - 12} ${cy + 6 - h/2} L ${cx} ${cy + 11 - h/2} L ${cx + 12} ${cy + 6 - h/2}`} stroke="#22d3ee" strokeWidth="1.5" className="animate-pulse" fill="none" />

          {/* Roof bevel structures & surgical spot signals */}
          <polygon points={`${cx},${cy + 10 - h} ${cx + 16},${cy + 2 - h} ${cx},${cy - 6 - h} ${cx - 16},${cy + 2 - h}`} fill="#e2e8f0" stroke="#eab308" />
          <circle cx={cx} cy={cy - h - 3} r="3" fill="#0891b2" className="animate-pulse" />
          <line x1={cx} y1={cy - h} x2={cx} y2={cy - h - 16} stroke="#eab308" strokeWidth="1.5" strokeDasharray="3,3" />
        </g>
      );
    }

    // Default Fallback structure layout for minor structures
    return (
      <g>
        <ellipse cx={cx} cy={cy + 3} rx="16" ry="7" fill="url(#real-shadow)" opacity="0.7" />
        <polygon points={`${cx - 14},${cy + 2} ${cx},${cy + 9} ${cx + 14},${cy + 2} ${cx},${cy - 5}`} fill="#1e293b" stroke={clr} strokeWidth="1" />
        <polygon points={`${cx - 14},${cy + 2} ${cx},${cy + 9} ${cx},${cy + 9 - h} ${cx - 14},${cy + 2 - h}`} fill="url(#metal-gray-light)" />
        <polygon points={`${cx},${cy + 9} ${cx + 14},${cy + 2} ${cx + 14},${cy + 2 - h} ${cx},${cy + 9 - h}`} fill="url(#metal-gray-dark)" />
        <polygon points={`${cx},${cy + 9 - h} ${cx + 14},${cy + 2 - h} ${cx},${cy - 5 - h} ${cx - 14},${cy + 2 - h}`} fill={clr} opacity="0.85" />
        <line x1={cx} y1={cy - h} x2={cx} y2={cy - h - 8} stroke="#ffffff" strokeWidth="1" />
        <circle cx={cx} cy={cy - h - 8} r="1.5" fill="#ffffff" />
      </g>
    );
  };

  const domainInventory = inventories[sector] || [];

  return (
    <div className="flex flex-col h-full justify-between gap-4 font-mono select-none">
      
      {/* Clash of Clans Tactical Top HUD Scoreboard */}
      <div className="grid grid-cols-12 gap-3 mb-1 mt-1 shrink-0">
        
        {/* Level and XP progress bar left-top */}
        <div className="col-span-12 md:col-span-4 bg-neutral-900/90 border border-[#00ea8]/20 px-3 py-2 rounded-xl flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#eab308] to-[#facc15] flex items-center justify-center border-2 border-[#fff] text-[#1e1b4b] font-black text-sm shadow-[0_0_10px_rgba(234,179,8,0.4)] shrink-0">
              {level}
            </div>
            <div className="text-left">
              <span className="text-[9px] text-[#b9cacb] uppercase block font-bold leading-none select-none">SYSTEM XP LEVEL</span>
              <span className="text-xs font-extrabold text-[#fff] leading-none block mt-1">{xp.toLocaleString()} <span className="text-[10px] text-[#dee1f8]/40">pts</span></span>
            </div>
          </div>
          <div className="w-1/3 bg-[#1e293b] h-1.5 rounded-full overflow-hidden block">
            <div 
              className="bg-[#eab308] h-full transition-all duration-500" 
              style={{ width: `${Math.min(100, (xp % 4000) / 40)}%` }} 
            />
          </div>
        </div>

        {/* Dynamic commands feedback center */}
        <div className="col-span-12 md:col-span-4 bg-neutral-900/90 border border-[#ff7a00]/30 px-3 py-2 rounded-xl text-left text-[10px] text-[#ff7a00] flex items-center gap-2 shadow-lg">
          <span className="text-[#ff7a00] shrink-0 font-bold">&gt;_ SIM_FEED:</span>
          <span className="truncate text-white/90">{activeConstructLog}</span>
        </div>

        {/* Cash Credits Gold reserves tracker right-top */}
        <div className="col-span-12 md:col-span-4 bg-neutral-900/90 border border-[#ff5a00]/30 px-3 py-2 rounded-xl flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#ff5a00]/20 flex items-center justify-center border border-[#ff5a00]/40 shrink-0">
              <Coins className="w-4 h-4 text-[#ff5a00] animate-bounce" />
            </div>
            <div className="text-left">
              <span className="text-[9px] text-[#b9cacb] uppercase block font-bold leading-none">GOLD RESERVES</span>
              <span className="text-xs font-black text-[#ff5a00] block mt-0.5">${credits.toLocaleString()} USD</span>
            </div>
          </div>
          <button 
            onClick={() => setIsShopOpen(true)}
            className="px-2.5 py-1 bg-[#ff5a00]/25 text-[#ff5a00] border border-[#ff5a00]/50 hover:bg-[#ff5a00]/40 rounded text-[9px] font-bold tracking-wider cursor-pointer transition-all flex items-center gap-1 shrink-0"
          >
            <ShoppingBag className="w-3 h-3" />
            SHOP
          </button>
        </div>

      </div>

      {/* Main Isometric Real-time SVG Canvas Simulation Viewport */}
      <div className="relative flex-1 bg-[#090d20] border-2 border-[#1e293b] rounded-2xl overflow-hidden flex flex-col items-center justify-center min-h-[420px] p-2 shadow-inner">
        
        {/* Rich background grid tiles coordinates helper water reflections */}
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#1e293b_1.5px,transparent_1.5px)] [background-size:16px_16px] z-0" />

        {/* Animated dynamic watermark text elements in background */}
        <div className="absolute top-1/2 left-3 translate-y-[-50%] font-mono text-[60px] font-extrabold text-[#111827] pointer-events-none select-none tracking-[0.2em]">
          {sector}
        </div>

        {/* Outer Grid Render Engine */}
        <svg
          viewBox="0 0 700 400"
          className="w-full h-full max-w-full z-10 cursor-pointer"
        >
          {/* High-fidelity Vector Material Gradients Definitions */}
          <defs>
            <radialGradient id="real-shadow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(2, 6, 23, 0.75)" />
              <stop offset="100%" stopColor="rgba(2, 6, 23, 0)" />
            </radialGradient>
            <radialGradient id="holo-radial-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(255, 122, 0, 0.45)" />
              <stop offset="80%" stopColor="rgba(255, 122, 0, 0.1)" />
              <stop offset="100%" stopColor="rgba(255, 122, 0, 0)" />
            </radialGradient>
            <linearGradient id="metal-gray-light" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#64748b" />
              <stop offset="40%" stopColor="#475569" />
              <stop offset="70%" stopColor="#334155" />
              <stop offset="100%" stopColor="#1e293b" />
            </linearGradient>
            <linearGradient id="metal-gray-dark" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#313d4f" />
              <stop offset="60%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
            <linearGradient id="metal-gray-shiny" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#e2e8f0" />
              <stop offset="50%" stopColor="#cbd5e1" />
              <stop offset="100%" stopColor="#94a3b8" />
            </linearGradient>
            <linearGradient id="glass-cyan" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.85" />
              <stop offset="30%" stopColor="#0ea5e9" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#0369a1" stopOpacity="0.35" />
            </linearGradient>
            <linearGradient id="glass-cyan-dark" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0891b2" stopOpacity="0.75" />
              <stop offset="60%" stopColor="#0369a1" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient id="gold-shimmer" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="40%" stopColor="#facc15" />
              <stop offset="80%" stopColor="#ca8a04" />
              <stop offset="100%" stopColor="#854d0e" />
            </linearGradient>
            <linearGradient id="greenhouse-glass" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a7f3d0" stopOpacity="0.8" />
              <stop offset="45%" stopColor="#10b981" stopOpacity="0.65" />
              <stop offset="100%" stopColor="#047857" stopOpacity="0.3" />
            </linearGradient>
            <linearGradient id="greenhouse-glass-dark" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#34d399" stopOpacity="0.75" />
              <stop offset="60%" stopColor="#047857" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#064e3b" stopOpacity="0.25" />
            </linearGradient>
            <linearGradient id="laser-beam" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ea580c" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#f43f5e" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#a855f7" stopOpacity="0.2" />
            </linearGradient>
          </defs>

          {/* Static realistic shadows under terrain elements */}
          <ellipse cx="350" cy="220" rx="320" ry="150" fill="rgba(2, 6, 23, 0.5)" />

          {/* Render Flowing Energy River canal */}
          <g>
            {/* Underlying shadow channel bed for depth */}
            <path
              d="M 100 230 C 220 200, 480 320, 600 260 L 595 290 C 475 350, 215 230, 95 260 Z"
              fill="#062f4f"
              opacity="0.9"
            />
            {/* Primary deep crystal water body */}
            <path
              d="M 100 230 C 220 200, 480 320, 600 260 L 590 285 C 470 345, 210 225, 90 255 Z"
              fill="url(#glass-cyan-dark)"
              opacity="0.85"
              stroke="#22d3ee"
              strokeWidth="1.5"
            />
            {/* Specular vector current highlights layer */}
            <path
              d="M 108 232 C 224 203, 476 321, 592 263 L 588 274 C 472 332, 212 214, 94 244 Z"
              fill="url(#glass-cyan)"
              opacity="0.5"
            />
            {/* Glowing animated wave ripples */}
            <circle cx="180" cy="218" r="6" fill="#22d3ee" opacity="0.3" className="animate-ping" />
            <circle cx="180" cy="218" r="2.5" fill="#ffffff" opacity="0.8" />
            
            <circle cx="480" cy="290" r="8" fill="#22d3ee" opacity="0.25" className="animate-ping" />
            <circle cx="480" cy="290" r="3.5" fill="#ffffff" opacity="0.7" />

            <circle cx="320" cy="245" r="7" fill="#00ffe8" opacity="0.2" className="animate-ping" />
          </g>

          {/* Render Isometric Grid Tiles (8x8) */}
          <g>
            {Array.from({ length: gridSize }).map((_, y) => (
              <g key={y}>
                {Array.from({ length: gridSize }).map((_, x) => {
                  const cx = 350 + (x - y) * 36;
                  const cy = 120 + (x + y) * 18;
                  const isHovered = hoveredTile?.x === x && hoveredTile?.y === y;
                  const isSelected = selectedTile?.x === x && selectedTile?.y === y;
                  const matchB = buildings.find(b => b.gridX === x && b.gridY === y);

                  // Set environmental river intersection to prevent placements directly inside water!
                  const isRiverZone = (x === 0 && y === 5) || (x === 1 && y === 4) || (x === 4 && y === 7) || (x === 5 && y === 6);

                  return (
                    <polygon
                      key={x}
                      points={`${cx},${cy - 9} ${cx + 18},${cy} ${cx},${cy + 9} ${cx - 18},${cy}`}
                      fill={
                        isRiverZone ? "rgba(255, 122, 0, 0.25)" :
                        isSelected ? "rgba(255, 122, 0, 0.45)" :
                        isHovered ? "rgba(255, 154, 51, 0.3)" :
                        matchB ? "rgba(28, 25, 23, 0.9)" : "rgba(10, 10, 10, 0.7)"
                      }
                      stroke={
                        isRiverZone ? "rgba(255, 122, 0, 0.4)" :
                        isSelected ? "#ff7a00" :
                        isHovered ? "#ff7a00" : "rgba(255, 122, 0, 0.12)"
                      }
                      strokeWidth={isSelected || isHovered ? "1.5" : "0.75"}
                      onMouseEnter={() => setHoveredTile({ x, y })}
                      onMouseLeave={() => setHoveredTile(null)}
                      onClick={() => handleTileClick(x, y)}
                      className="transition-colors duration-150"
                    />
                  );
                })}
              </g>
            ))}
          </g>

          {/* Static Gorgeous Organic 3D Shaded Trees sprinkled around the coordinates map layout */}
          <g pointerEvents="none">
            {/* Draw 4 realistic multi-shaded heavy 3D trees */}
            {[
              { tx: 0, ty: 1, cx: 350 + (0 - 1)*36, cy: 120 + (0 + 1)*18 },
              { tx: 4, ty: 0, cx: 350 + (4 - 0)*36, cy: 120 + (4 + 0)*18 },
              { tx: 7, ty: 2, cx: 350 + (7 - 2)*36, cy: 120 + (7 + 2)*18 },
              { tx: 0, ty: 7, cx: 350 + (0 - 7)*36, cy: 120 + (0 + 7)*18 },
            ].map((t, idx) => (
              <g key={idx}>
                {/* Real-shadow drop beneath tree roots */}
                <ellipse cx={t.cx} cy={t.cy + 3} rx="14" ry="6" fill="url(#real-shadow)" opacity="0.85" />
                
                {/* Complex bark trunk with dual shaded branches */}
                <path d={`M ${t.cx - 2.5} ${t.cy} L ${t.cx - 1.5} ${t.cy - 14} L ${t.cx + 1} ${t.cy - 14} L ${t.cx + 2.5} ${t.cy} Z`} fill="#78350f" />
                <path d={`M ${t.cx + 0.5} ${t.cy} L ${t.cx + 2.5} ${t.cy} L ${t.cx + 1} ${t.cy - 14} L ${t.cx - 0.5} ${t.cy - 14} Z`} fill="#451a03" />
                {/* Small side branch */}
                <path d={`M ${t.cx - 1} ${t.cy - 7} L ${t.cx - 6} ${t.cy - 12} L ${t.cx - 4} ${t.cy - 13} L ${t.cx} ${t.cy - 9} Z`} fill="#78350f" />

                {/* Overlapping dense cloud-like foliage crowns */}
                {/* Back shadow layer */}
                <circle cx={t.cx} cy={t.cy - 16} r="10" fill="#064e3b" opacity="0.95" />
                <circle cx={t.cx - 7} cy={t.cy - 18} r="8" fill="#14532d" />
                <circle cx={t.cx + 7} cy={t.cy - 18} r="8" fill="#14532d" />

                {/* Mid layer deep green */}
                <circle cx={t.cx - 5} cy={t.cy - 21} r="9" fill="#15803d" />
                <circle cx={t.cx + 5} cy={t.cy - 21} r="9" fill="#15803d" />
                
                {/* Front shiny highlight layer */}
                <circle cx={t.cx} cy={t.cy - 26} r="10" fill="#ff5a00" opacity="0.95" />
                <circle cx={t.cx - 3} cy={t.cy - 27} r="6.5" fill="#4ade80" />
                <circle cx={t.cx + 3} cy={t.cy - 27} r="6.5" fill="#4ade80" />
                <circle cx={t.cx} cy={t.cy - 30} r="4.5" fill="#86efac" />
              </g>
            ))}
          </g>

          {/* Render Interactive Power Conduit lines connecting outer structures to Main HQ */}
          <g opacity="0.32" pointerEvents="none">
            {buildings.slice(1).map((b, i) => {
              const hqCX = 350;
              const hqCY = 120 + (3 + 3) * 18;
              const bx = 350 + (b.gridX - b.gridY) * 36;
              const by = 120 + (b.gridX + b.gridY) * 18;
              return (
                <line
                  key={i}
                  x1={hqCX}
                  y1={hqCY}
                  x2={bx}
                  y2={by}
                  stroke={b.themeColor}
                  strokeWidth="1.5"
                  strokeDasharray="5,5"
                  className="animate-[dash_10s_linear_infinite]"
                />
              );
            })}
          </g>

          {/* Render Isometric Buildings */}
          <g pointerEvents="none">
            {buildings.map((b) => {
              const cx = 350 + (b.gridX - b.gridY) * 36;
              const cy = 120 + (b.gridX + b.gridY) * 18;

              return (
                <g key={b.id} className="transition-transform duration-300">
                  {/* Subtle active base shadow drop */}
                  <ellipse
                    cx={cx}
                    cy={cy + 3}
                    rx="15"
                    ry="7"
                    fill="rgba(0,0,0,0.5)"
                  />

                  {/* Draw 3D Isometric building */}
                  {getBuildingSprite(b, cx, cy)}

                  {/* Text Level tags */}
                  <text
                    x={cx}
                    y={b.type === "HQ" ? cy - b.level * 22 - 25 : cy - b.level * 6 - 32}
                    textAnchor="middle"
                    fill="#dee1f8"
                    fontSize="7.5"
                    fontFamily="monospace"
                    fontWeight="extrabold"
                    opacity="0.8"
                  >
                    L{b.level}
                  </text>
                </g>
              );
            })}
          </g>

          {/* Hover Overlay Interactive Tooltip displays */}
          {hoveredTile && (
            <g pointerEvents="none">
              {(() => {
                const cx = 350 + (hoveredTile.x - hoveredTile.y) * 36;
                const cy = 120 + (hoveredTile.x + hoveredTile.y) * 18;
                const b = buildings.find(bi => bi.gridX === hoveredTile.x && bi.gridY === hoveredTile.y);
                const isRiverZone = (hoveredTile.x === 0 && hoveredTile.y === 5) || (hoveredTile.x === 1 && hoveredTile.y === 4) || (hoveredTile.x === 4 && hoveredTile.y === 7) || (hoveredTile.x === 5 && hoveredTile.y === 6);

                return (
                  <g>
                    <rect
                      x={cx - 55}
                      y={cy - 48}
                      width="110"
                      height="24"
                      rx="4"
                      fill="rgba(5, 12, 30, 0.95)"
                      stroke={b ? b.themeColor : isRiverZone ? "#eab308" : "#ff7a00"}
                      strokeWidth="1.2"
                    />
                    <text
                      x={cx}
                      y={cy - 38}
                      textAnchor="middle"
                      fill={b ? b.themeColor : "#fff"}
                      fontSize="7.2"
                      fontWeight="black"
                    >
                      {b ? b.name : isRiverZone ? "CYBER RILL (WATER)" : "EMPTY COCs PLOT"}
                    </text>
                    <text
                      x={cx}
                      y={cy - 29}
                      textAnchor="middle"
                      fill="#94a3b8"
                      fontSize="6"
                    >
                      {b ? `LVL ${b.level} | ${b.statYield}` : isRiverZone ? "No placements allowed" : "Click tile to construct"}
                    </text>
                  </g>
                );
              })()}
            </g>
          )}

          {/* Active flying scouting drones over grid */}
          <g pointerEvents="none">
            {drones.map((drone) => {
              const cx = 350 + (drone.x - drone.y) * 36;
              const cy = 120 + (drone.x + drone.y) * 18 - drone.height;

              return (
                <g key={drone.id}>
                  <line x1={cx} y1={cy} x2={cx} y2={cy + drone.height} stroke="#4ade80" strokeWidth="0.5" strokeDasharray="2,2" opacity="0.32" />
                  <circle cx={cx} cy={cy} r="3.5" fill="#334155" stroke="#4ade80" strokeWidth="1" />
                  <line x1={cx - 6} y1={cy} x2={cx + 6} y2={cy} stroke="#4ade80" strokeWidth="1" />
                  <circle cx={cx - 6} cy={cy} r="1" fill="#f43f5e" />
                  <circle cx={cx + 6} cy={cy} r="1" fill="#f43f5e" />
                </g>
              );
            })}
          </g>

          {/* Floating animated texts rewards overlays */}
          <g pointerEvents="none">
            {floatingTexts.map((txt) => (
              <text
                key={txt.id}
                x={txt.x}
                y={txt.y}
                textAnchor="middle"
                fill={txt.color}
                fontSize="8.5"
                fontWeight="extrabold"
                className="animate-[floatUp_1.8s_ease-out_forwards]"
                opacity="0.9"
                style={{
                  textShadow: `0 0 6px ${txt.color}`,
                }}
              >
                {txt.text}
              </text>
            ))}
          </g>

        </svg>

        {/* Dynamic Building Focus Selection Panel overlay */}
        <AnimatePresence>
          {selectedBuilding && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              className="absolute bottom-3 left-3 right-3 bg-[#0a0a0a]/95 backdrop-blur-md border border-[#ff7a00]/40 rounded-xl p-3 text-left flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-2xl z-20"
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded border flex items-center justify-center shrink-0"
                  style={{ borderColor: selectedBuilding.themeColor, backgroundColor: `${selectedBuilding.themeColor}15` }}
                >
                  <Cpu className="w-5 h-5" style={{ color: selectedBuilding.themeColor }} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white tracking-wide uppercase flex items-center gap-1.5 flex-wrap">
                    <span>{selectedBuilding.name}</span>
                    <span className="text-[8px] px-1.5 py-0.5 bg-neutral-900 rounded text-[#ff7a00] font-extrabold font-mono">
                      LVL {selectedBuilding.level} STRUCTURE
                    </span>
                    {selectedBuilding.type === "HQ" && (
                      <span className="text-[8px] px-1.5 py-0.5 bg-yellow-500/10 text-yellow-500 rounded font-bold font-mono">
                        MAIN FORTIFIED BASE COMMAND
                      </span>
                    )}
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    EFFECTS ACCUMULATION: <span className="text-[#ff7a00] font-bold">{selectedBuilding.statYield}</span>
                  </p>
                </div>
              </div>

              {/* Upgrade / Reclaim action keys controls */}
              <div className="flex gap-2 w-full md:w-auto shrink-0">
                <button
                  onClick={upgradeHQorBuilding}
                  disabled={selectedBuilding.level >= 5}
                  className="flex-1 md:flex-none px-3.5 py-1.5 bg-[#ff7a00]/20 hover:bg-[#ff7a00]/35 text-[#ff7a00] border border-[#ff7a00]/50 text-[10px] rounded font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all disabled:opacity-25"
                >
                  <Plus className="w-4 h-4" />
                  <span>UPGRADE (Costs ${selectedBuilding.type === "HQ" ? (selectedBuilding.level * 60000).toLocaleString() : (selectedBuilding.level * 15000).toLocaleString()})</span>
                </button>
                {selectedBuilding.type !== "HQ" && (
                  <button
                    onClick={scrapBuilding}
                    className="px-3 py-1.5 bg-red-500/25 text-red-400 hover:bg-red-500/40 border border-red-500/40 text-[10px] rounded font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>SCRAP (+${Math.floor(selectedBuilding.cost * 0.5).toLocaleString()})</span>
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Minimal environmental legends bottom overlays */}
        <div className="absolute right-3 top-3 bg-[#080d1e]/85 border border-slate-700/50 rounded-lg p-1.5 px-2.5 text-[9px] text-[#b9cacb]/80 flex flex-wrap gap-2 z-10">
          <span>● SELECT Vacant plot to open SHOP</span>
          <span>● Click structure to UPGRADE</span>
        </div>
      </div>

      {/* Dynamic Animated Inventory Shop Popup Screen */}
      <AnimatePresence>
        {isShopOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.93, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.93, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-[#0a0a0a] border-2 border-[#ff7a00]/40 rounded-2xl w-full max-w-2xl overflow-hidden shadow-[0_0_50px_rgba(255, 122, 0,0.2)] flex flex-col font-mono text-left"
            >
              <div className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#ff7a00]/20 flex items-center justify-center border border-[#ff7a00]/40">
                    <ShoppingBag className="w-5 h-5 text-[#ff7a00]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white uppercase tracking-wider">
                      {sector} STRUCTURAL INVENTORY
                    </h3>
                    <p className="text-[10px] text-[#ff7a00]">
                      BUY ASSETS WITH YOUR BALANCE • ACTIVE XP LEVEL {level}
                    </p>
                  </div>
                </div>
                
                {/* Gold indicator inside modal header */}
                <div className="flex gap-4 items-center">
                  <div className="text-right">
                    <span className="text-[8px] text-slate-400 block font-bold leading-none">RESERVES</span>
                    <span className="text-sm font-extrabold text-[#ff5a00]">${credits.toLocaleString()} USD</span>
                  </div>
                  <button 
                    onClick={() => setIsShopOpen(false)}
                    className="w-8 h-8 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center font-bold text-xs cursor-pointer transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Grid content blocks list of inventory choices */}
              <div className="p-6 overflow-y-auto max-h-[400px] grid grid-cols-1 md:grid-cols-2 gap-4 custom-scrollbar bg-[#0a0a0a]">
                {domainInventory.map((item) => {
                  const isGoldAffordable = credits >= item.cost;
                  const isLevelUnlocked = level >= item.unlockedAtLevel;
                  const IconComponent = item.icon;

                  return (
                    <div 
                      key={item.type}
                      className={`border rounded-xl p-4 flex flex-col justify-between transition-all relative group overflow-hidden ${
                        !isLevelUnlocked 
                          ? "bg-slate-950/40 border-dashed border-slate-800 text-slate-500 select-none opacity-45"
                          : "bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900"
                      }`}
                    >
                      {/* Interactive lock screens for unearned progress items */}
                      {!isLevelUnlocked && (
                        <div className="absolute inset-0 bg-[#020617]/55 backdrop-blur-[1px] z-10 flex flex-col items-center justify-center p-3 text-center">
                          <Lock className="w-6 h-6 text-red-500 mb-1" />
                          <span className="text-[10px] font-black text-red-400 uppercase tracking-widest leading-none">STRUCTURE LOCKED</span>
                          <span className="text-[9px] text-slate-400 mt-1 leading-tight">Unlocks at XP Level {item.unlockedAtLevel}</span>
                        </div>
                      )}

                      <div className="flex gap-3 justify-between items-start mb-2">
                        {/* Left side details */}
                        <div className="flex-1 min-w-0">
                          {/* Title line details */}
                          <div className="flex items-center gap-2 mb-2">
                            <div 
                              className="w-7 h-7 rounded border flex items-center justify-center shrink-0"
                              style={{ 
                                borderColor: isLevelUnlocked ? item.themeColor : "#334155", 
                                backgroundColor: isLevelUnlocked ? `${item.themeColor}12` : "transparent"
                              }}
                            >
                              <IconComponent className="w-4 h-4" style={{ color: isLevelUnlocked ? item.themeColor : "#475569" }} />
                            </div>
                            <div className="min-w-0">
                              <h4 className="text-[11px] font-black text-slate-100 uppercase group-hover:text-white leading-tight truncate">
                                {item.name}
                              </h4>
                              <span className="text-[8px] font-semibold tracking-wider uppercase block truncate" style={{ color: item.themeColor }}>
                                {item.statModifier}
                              </span>
                            </div>
                          </div>

                          {/* Description details */}
                          <p className="text-[9.5px] text-slate-400 leading-relaxed pr-1 h-12 overflow-hidden text-ellipsis">
                            {item.description}
                          </p>
                        </div>

                        {/* Right side live 3D isometric blueprints preview box */}
                        {isLevelUnlocked && (
                          <div className="w-[84px] h-[76px] bg-black/85 border border-[#ff7a00]/30 rounded-lg overflow-hidden shrink-0 relative flex items-center justify-center shadow-inner group-hover:border-[#ff7a00]/60">
                            {/* Technical grid markers */}
                            <div className="absolute top-1 left-1 w-1 h-1 bg-[#ff7a00] opacity-40"></div>
                            <div className="absolute top-1 right-1 w-1 h-1 bg-[#ff7a00] opacity-40"></div>
                            <div className="absolute bottom-1 left-1 w-1 h-1 bg-[#ff7a00] opacity-40"></div>
                            <div className="absolute bottom-1 right-1 w-1 h-1 bg-[#ff7a00] opacity-40"></div>
                            {/* Technical blueprints grid underlay */}
                            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ff7a00_1px,transparent_1px)] [background-size:8px_8px] pointer-events-none" />
                            
                            <svg className="w-full h-full" viewBox="0 0 80 80">
                              <g transform="translate(0, 15)">
                                {getBuildingSprite({ type: item.type, level: 1, themeColor: item.themeColor } as any, 40, 42)}
                              </g>
                            </svg>
                          </div>
                        )}
                      </div>

                      {/* Buy action fields button info */}
                      <div className="flex items-center justify-between border-t border-slate-800/60 pt-3 mt-1">
                        <div>
                          <span className="text-[7.5px] text-slate-500 block font-bold leading-none">PLACEM_COST</span>
                          <span className="text-xs font-black text-[#ff5a00]">${item.cost.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-[7.5px] text-slate-500 block font-bold leading-none">XP_YIELD</span>
                          <span className="text-[10.5px] font-bold text-[#eab308]">+{item.xpValue} XP</span>
                        </div>
                        
                        <button
                          disabled={!isLevelUnlocked || !isGoldAffordable}
                          onClick={() => executeBuyAndBuild(item)}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-wider uppercase transition-all flex items-center gap-1 cursor-pointer ${
                            !isGoldAffordable 
                              ? "bg-red-500/10 text-red-500/60 border border-red-500/20" 
                              : "bg-[#ff5a00]/20 text-[#ff5a00] hover:bg-[#ff5a00] hover:text-[#090d20] border border-[#ff5a00]/50"
                          }`}
                        >
                          {!isGoldAffordable ? "Too Expensive" : "BUY & BUILD"}
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>

              {/* Tips block at bottom of modals store catalog popup */}
              <div className="bg-slate-950 px-6 py-3 border-t border-slate-800 text-[9px] text-slate-400 flex items-center justify-between gap-2.5">
                <span>⚡ PLACED STRUCTURES passively generate Cash Reserves & XP points over time!</span>
                <span className="text-slate-500 font-bold max-sm:hidden">Coc-Engine 2.05</span>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes dash {
          to {
            stroke-dashoffset: -40;
          }
        }
        @keyframes floatUp {
          0% {
            transform: translateY(0);
            opacity: 1;
          }
          100% {
            transform: translateY(-55px);
            opacity: 0;
          }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.4);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 122, 0, 0.25);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 122, 0, 0.5);
        }
      `}</style>
    </div>
  );
}
