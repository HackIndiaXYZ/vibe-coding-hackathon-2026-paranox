import express, { Request, Response } from "express";
import path from "path";
import fs from "fs";
import ExcelJS from "exceljs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import * as dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with custom User-Agent
let ai: GoogleGenAI | null = null;
try {
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey) {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
} catch (error) {
  console.error("Failed to initialize GoogleGenAI:", error);
}

// Helper function to simulate realistic metrics and telemetry locally when GEMINI_API_KEY is not provided
function generateMockSimulation(
  sector: string,
  action: string,
  currentStats: any,
  parameters: any
) {
  const timeStr = new Date().toUTCString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
  const logs: string[] = [];
  const updatedStats: any = {};
  let advisorComment = "";
  let totalVal = 42.8;

  if (currentStats && currentStats.totalEvaluation) {
    const match = currentStats.totalEvaluation.match(/\$?([0-9.]+)/);
    if (match) {
      totalVal = parseFloat(match[1]);
    }
  }

  // Adjust total valuation slightly
  const delta = (Math.random() * 0.4 - 0.1); // -0.1M to +0.3M
  const nextTotalEvaluation = `$${(totalVal + delta).toFixed(1)}M`;

  const actionUpper = (action || "").toUpperCase();

  if (sector === "EDUCATION") {
    const currentLiq = currentStats?.educationLiquidity ?? 84;
    const currentRet = currentStats?.educationRetention ?? 92;

    const liqChange = actionUpper.includes("REALLOCATE") ? -5 : (Math.random() > 0.5 ? 2 : -2);
    const retChange = actionUpper.includes("UPGRADE") || actionUpper.includes("INFRASTRUCTURE") ? 3 : (Math.random() > 0.5 ? 1 : -1);

    updatedStats.liquidity = Math.min(100, Math.max(0, currentLiq + liqChange));
    updatedStats.retention = Math.min(100, Math.max(0, currentRet + retChange));
    updatedStats.financeStrategy = `STRATEGY UPDATE: DIRECTIVE "${actionUpper}" APPLIED. ADJUSTING CAPITAL ALLOCATION IN ACADEMIC R&D CHIPSETS.`;
    updatedStats.hrAdvisory = `ADVISORY UPDATE: STAFF RETENTION NOMINAL AT ${updatedStats.retention}%. VECTOR ANALYSIS IN PROGRESS.`;

    advisorComment = `EDUCATION COGNITIVE CORE: EXECUTED COMMAND "${actionUpper}". INFRASTRUCTURE MODIFICATION REGISTRY DETECTED. LIQUIDITY BALANCED AT ${updatedStats.liquidity}%.`;

    logs.push(`> [${timeStr}] APPLIED STRATEGIC DIRECTIVE: ${actionUpper}`);
    logs.push(`> [${timeStr}] COGNITIVE LIQUIDITY MATRIX READJUSTED TO ${updatedStats.liquidity}%.`);
    logs.push(`> [${timeStr}] CLASSROOM RETENTION METRIC VERIFIED AT ${updatedStats.retention}%.`);
  } else if (sector === "RESTAURANT") {
    const currentRev = currentStats?.restaurantRevenueVelocity ?? 14280;
    const currentProt = currentStats?.restaurantProteinFreshness ?? 94;
    const currentProd = currentStats?.restaurantProduceFreshness ?? 88;
    const currentLoad = currentStats?.restaurantKitchenLoad ?? 62;

    const revChange = actionUpper.includes("OPTIMIZE") ? 500 : Math.floor(Math.random() * 400 - 150);
    const loadChange = actionUpper.includes("OPTIMIZE") ? -10 : Math.floor(Math.random() * 10 - 5);

    updatedStats.revenueVelocity = Math.max(1000, currentRev + revChange);
    updatedStats.proteinFreshness = Math.min(100, Math.max(0, currentProt + (Math.random() > 0.5 ? 1 : -1)));
    updatedStats.produceFreshness = Math.min(100, Math.max(0, currentProd + (Math.random() > 0.5 ? 1 : -1)));
    updatedStats.kitchenLoad = Math.min(100, Math.max(0, currentLoad + loadChange));

    advisorComment = `CULINARY EXECUTIVE ADVISOR: OPTIMIZATION PROTOCOL "${actionUpper}" LOADED. REVENUE VELOCITY ADJUSTED TO $${updatedStats.revenueVelocity}/HR.`;

    logs.push(`> [${timeStr}] INITIATED KITCHEN DIRECTIVE: ${actionUpper}`);
    logs.push(`> [${timeStr}] FRESHNESS CORRELATION INDEX SECURED: PROTEIN ${updatedStats.proteinFreshness}%, PRODUCE ${updatedStats.produceFreshness}%.`);
    logs.push(`> [${timeStr}] ACTIVE LOAD SHEDDING MODULATOR AT ${updatedStats.kitchenLoad}%.`);
  } else if (sector === "AGRICULTURE") {
    const currentWater = currentStats?.agricultureWaterReserves ?? 82.5;
    const currentHydro = currentStats?.agricultureHydroponicCount ?? 1204;
    const currentDrones = currentStats?.agricultureHarvestDronesCount ?? 42;
    const currentYield = currentStats?.agricultureCropYieldDelta ?? -2.1;

    updatedStats.waterReserves = Math.min(100, Math.max(0, currentWater + (actionUpper.includes("WATER") || actionUpper.includes("REALLOCATE") ? 2.5 : -0.5)));
    updatedStats.hydroponicCount = Math.max(100, currentHydro + (actionUpper.includes("SCALE") ? 50 : Math.floor(Math.random() * 10 - 5)));
    updatedStats.harvestDronesCount = Math.max(10, currentDrones + (actionUpper.includes("SCALE") ? 4 : (Math.random() > 0.7 ? 1 : 0)));
    updatedStats.cropYieldDelta = Math.min(20, Math.max(-10, currentYield + (Math.random() * 0.8 - 0.2)));

    advisorComment = `BIOSYSTEMS ANALYSIS BOT: ARABLE EXPANSION VIA "${actionUpper}" LOGGED. SOIL AND WATER COEFFICIENTS WITHIN ADMISSIBLE ERROR WINDOW.`;

    logs.push(`> [${timeStr}] BIOSYSTEMS UPGRADE TRIGGERED: ${actionUpper}`);
    logs.push(`> [${timeStr}] HYDROPONIC ARRAYS CONNECTED: ${updatedStats.hydroponicCount} ACTIVE.`);
    logs.push(`> [${timeStr}] HARVEST DRONE TELEMETRY: ${updatedStats.harvestDronesCount} UNITS NOMINAL.`);
  } else if (sector === "HEALTHCARE") {
    const currentEff = currentStats?.healthcareBioAnalyzersEfficiency ?? 94;
    const currentThrough = currentStats?.healthcareThroughputDaily ?? 1450;
    const currentProgress = currentStats?.healthcareResearchProgress ?? 78;

    updatedStats.bioAnalyzersEfficiency = Math.min(100, Math.max(0, currentEff + (actionUpper.includes("OPTIMIZE") ? 2 : Math.floor(Math.random() * 2 - 1))));
    updatedStats.throughputDaily = Math.max(100, currentThrough + Math.floor(Math.random() * 40 - 20));
    updatedStats.sterilityLevel = "Grade A" + (Math.random() > 0.5 ? "+" : "");
    updatedStats.researchProgress = Math.min(100, currentProgress + (actionUpper.includes("RESEARCH") || actionUpper.includes("FORECAST") ? 2 : 1));
    updatedStats.activeSyntheses = `Active protein synth matrix ${Math.random() > 0.5 ? 'A' : 'B'}-${Math.floor(Math.random() * 100)}. Completion: ${Math.floor(Math.random() * 10) + 1} hours.`;
    updatedStats.neutralSyncOptimal = Math.random() > 0.2;

    advisorComment = `DIAGNOSTIC NEURAL SYNC: MEDICAL DIRECTIVE "${actionUpper}" COMPLETED. STERILITY THRESHOLD NOMINAL AT ${updatedStats.sterilityLevel}.`;

    logs.push(`> [${timeStr}] PHARMA-COGNITIVE SYNC: ${actionUpper}`);
    logs.push(`> [${timeStr}] DIAGNOSTIC SYSTEM TELEMETRY: BIO-ANALYZER EFFECTIVENESS AT ${updatedStats.bioAnalyzersEfficiency}%.`);
    logs.push(`> [${timeStr}] NEURAL LINK: SYNC ${updatedStats.neutralSyncOptimal ? "OPTIMAL" : "STABLE"}.`);
  } else {
    // Default sector init or fallback
    advisorComment = `COMMAND ADVISOR: DIRECTIVE "${actionUpper}" RECOGNIZED. SYSTEM STATUS NOMINAL.`;
    logs.push(`> [${timeStr}] PROCESS SYSTEM COMMAND: ${actionUpper}`);
    logs.push(`> [${timeStr}] ALL CORES REPORTING NORMAL SYNC STATUS.`);
  }

  return {
    advisorComment,
    updatedStats,
    logs,
    totalEvaluation: nextTotalEvaluation
  };
}

// Path to the persistent sessions Excel file
const SESSIONS_FILE = path.join(process.cwd(), "sessions.xlsx");

// Ensure the sessions Excel file exists with headers on first run
async function ensureSessionsFile() {
  const wb = new ExcelJS.Workbook();

  if (fs.existsSync(SESSIONS_FILE)) {
    await wb.xlsx.readFile(SESSIONS_FILE);
  } else {
    const ws = wb.addWorksheet("Simulation Sessions");

    // Style helpers
    const headerFill: ExcelJS.Fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF1F4E78" }, // Deep blue
    };
    const headerFont: Partial<ExcelJS.Font> = { bold: true, color: { argb: "FFFFFFFF" }, size: 11, name: "Segoe UI" };
    const centerAlign: Partial<ExcelJS.Alignment> = { horizontal: "center", vertical: "middle" };
    const thinBorder: Partial<ExcelJS.Border> = { style: "thin", color: { argb: "FFD9D9D9" } };
    const allBorders = { top: thinBorder, left: thinBorder, bottom: thinBorder, right: thinBorder };

    // Title row
    ws.mergeCells("A1:H1");
    const titleCell = ws.getCell("A1");
    titleCell.value = "BIZFORGE — SIMULATION SESSION LOG";
    titleCell.font = { bold: true, size: 14, color: { argb: "FFFFFFFF" }, name: "Segoe UI" };
    titleCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF111111" } };
    titleCell.alignment = { horizontal: "center", vertical: "middle" };
    ws.getRow(1).height = 38;

    // Header row
    const headers = ["#", "Company Name", "CEO Email", "Industry Sector", "Initial Budget (USD)", "Land Scale (sq mi)", "Vertical Limit (units)", "Launched At"];
    ws.addRow(headers);
    const headerRow = ws.getRow(2);
    headerRow.height = 24;
    headerRow.eachCell((cell) => {
      cell.font = headerFont;
      cell.fill = headerFill;
      cell.alignment = centerAlign;
      cell.border = allBorders;
    });

    // Column widths
    ws.columns = [
      { width: 5 },
      { width: 24 },
      { width: 30 },
      { width: 32 },
      { width: 22 },
      { width: 20 },
      { width: 22 },
      { width: 24 },
    ];

    await wb.xlsx.writeFile(SESSIONS_FILE);
  }
}

// Save a new session row to sessions.xlsx
async function appendSessionRow(data: {
  companyName: string;
  ceoEmail: string;
  industrySector: string;
  initialBudget: number;
  landScale: number;
  verticalLimit: number;
}) {
  const wb = new ExcelJS.Workbook();

  if (fs.existsSync(SESSIONS_FILE)) {
    await wb.xlsx.readFile(SESSIONS_FILE);
  } else {
    await ensureSessionsFile();
    await wb.xlsx.readFile(SESSIONS_FILE);
  }

  const ws = wb.getWorksheet("Simulation Sessions");
  if (!ws) return;

  const rowCount = ws.rowCount; // current rows including title + header
  const sessionIndex = rowCount - 1; // offset for title + header rows

  const thinBorder: Partial<ExcelJS.Border> = { style: "thin", color: { argb: "FFD9D9D9" } };
  const allBorders = { top: thinBorder, left: thinBorder, bottom: thinBorder, right: thinBorder };
  const isEven = sessionIndex % 2 === 0;
  const altFill: ExcelJS.Fill = { type: "pattern", pattern: "solid", fgColor: { argb: isEven ? "FFF2F5F8" : "FFFFFFFF" } };

  const newRow = ws.addRow([
    sessionIndex,
    data.companyName || "Unnamed Venture",
    data.ceoEmail || "—",
    data.industrySector,
    data.initialBudget,
    data.landScale,
    data.verticalLimit,
    new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
  ]);

  newRow.height = 20;
  newRow.eachCell((cell, colNum) => {
    cell.border = allBorders;
    cell.fill = altFill;
    cell.font = { name: "Segoe UI", size: 10 };
    cell.alignment = { vertical: "middle", horizontal: colNum === 1 ? "center" : "left" };
    // Format budget as currency
    if (colNum === 5) {
      cell.numFmt = '"$"#,##0';
    }
  });

  await wb.xlsx.writeFile(SESSIONS_FILE);
}

// Initialize the sessions file on startup
ensureSessionsFile().catch(console.error);

// Endpoint to save simulation session details to Excel
app.post("/api/save-session", async (req: Request, res: Response) => {
  try {
    const { companyName, ceoEmail, industrySector, initialBudget, landScale, verticalLimit } = req.body;
    await appendSessionRow({ companyName, ceoEmail, industrySector, initialBudget, landScale, verticalLimit });
    return res.json({ success: true, message: "Session saved to sessions.xlsx" });
  } catch (error: any) {
    console.error("Failed to save session:", error);
    return res.status(500).json({ success: false, error: error?.message || "Unknown error" });
  }
});

// Endpoint to simulate tactical state updates using Gemini
app.post("/api/simulate", async (req: Request, res: Response) => {
  const {
    sector,
    action,
    architectName,
    landScale,
    verticalLimit,
    luaScript,
    currentStats,
    parameters,
  } = req.body;

  if (!ai) {
    console.warn("GEMINI_API_KEY is not configured. Falling back to local simulated response.");
    const mockResponse = generateMockSimulation(sector, action, currentStats, parameters);
    return res.json(mockResponse);
  }

  const prompt = `
    You are the central core simulated super-intelligence for "OMNI-SIM TACTICAL" command center.
    You are simulating the sector: "${sector}".
    Architect Name: "${architectName || "Default Node"}"
    Land Scale setting: ${landScale || "2500"} KM²
    Vertical Limit setting: ${verticalLimit || "1000"} METERS
    Custom Simulation Lua Logic script:
    \`\`\`lua
    ${luaScript || "-- none"}
    \`\`\`

    Current Stats of the simulation:
    ${JSON.stringify(currentStats, null, 2)}

    Parameters/Assets list:
    ${JSON.stringify(parameters, null, 2)}

    The architect has initiated a custom action/command: "${action || "DEPLOY CAPITAL"}"

    TASKS:
    Evaluate the effect of this action and the configuration on the simulation.
    Return a realistic, data-dense, highly technical, immersive response matching the theme of our cyberpunk tactical dashboard.
    Do NOT state you are an AI. Sound like a complex terminal system telemetry and core AI advisors (e.g. Finance AI, HR AI, Diagnostic AI, Soil AI, Climate AI, active Synthesis bots, etc.).

    Generate:
    1. A short, technical advice speech (1-2 sentences) from the relevant AI advisor (e.g. Finance AI advises on money/efficiency, HR AI advises on staffing/satisfaction, Soil/Climate AI on environmental variables, Diagnostic/Pharma AI on biolab metrics).
    2. Dynamic, updated numerical stats for the dashboard (appropriate for the current selector). Provide them with realistic modifications (plus or minus based on the user's action).
       - For Education: financeStrategy (e.g. Strategy summary text), liquidity % (number from 0 to 100), hrAdvisory (text), retention % (number), live telemetry logs (array of 3-4 strings).
       - For Restaurant: revenueVelocity (number/hr), freshnessIndex (protein % and produce % numbers), kitchenLoad % (number), live telemetry logs (array).
       - For Agriculture: waterReserves % (number), hydroponicCount (number), harvestDronesCount (number), cropYieldDelta % (number), live telemetry logs (array).
       - For Healthcare: bioAnalyzersEfficiency (number), throughputDaily (number), sterilityLevel (text like "Grade A+", "Grade A-", etc.), researchProgress % (number), activeSyntheses (text), diagnosticNeuralSyncStatus (text like "OPTIMAL", "STABLE"), live telemetry logs (array).
    3. Live feed / status updates matching the user action.
    4. Total evaluation monetary value update (e.g., "$42.8M" style or similar, but just return the raw estimated decimal or string like "$43.2M").

    Return the result strictly as a valid JSON object matching the requested schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["advisorComment", "updatedStats", "logs", "totalEvaluation"],
          properties: {
            advisorComment: {
              type: Type.STRING,
              description: "A highly immersive, technical piece of advisory feedback from the AI system advisors in uppercase.",
            },
            updatedStats: {
              type: Type.OBJECT,
              description: "Dynamic updated statistics mapping to the current sector.",
              properties: {
                liquidity: { type: Type.NUMBER },
                retention: { type: Type.NUMBER },
                revenueVelocity: { type: Type.NUMBER },
                proteinFreshness: { type: Type.NUMBER },
                produceFreshness: { type: Type.NUMBER },
                kitchenLoad: { type: Type.NUMBER },
                waterReserves: { type: Type.NUMBER },
                hydroponicCount: { type: Type.NUMBER },
                harvestDronesCount: { type: Type.NUMBER },
                cropYieldDelta: { type: Type.NUMBER },
                bioAnalyzersEfficiency: { type: Type.NUMBER },
                throughputDaily: { type: Type.NUMBER },
                sterilityLevel: { type: Type.STRING },
                researchProgress: { type: Type.NUMBER },
                neutralSyncOptimal: { type: Type.BOOLEAN },
                financeStrategy: { type: Type.STRING },
                hrAdvisory: { type: Type.STRING },
                activeSyntheses: { type: Type.STRING },
              },
            },
            logs: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3 to 5 simulated system logs starting with '>' or technical timestamps.",
            },
            totalEvaluation: {
              type: Type.STRING,
              description: "The total valuation formatted currency string, e.g. '$45.1M'.",
            },
          },
        },
      },
    });

    const text = response.text || "{}";
    const data = JSON.parse(text);
    return res.json(data);
  } catch (error: any) {
    console.error("Simulation error:", error);
    return res.status(500).json({
      error: "Simulation execution failed. Please check standard telemetry logs.",
      details: error?.message || error,
    });
  }
});

// Start routing for client-side resources
async function bootstrap() {
  const isProd = process.env.NODE_ENV === "production";

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Command Core initialized at http://localhost:${PORT}`);
  });
}

bootstrap();
