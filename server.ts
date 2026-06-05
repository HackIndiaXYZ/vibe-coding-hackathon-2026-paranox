import express, { Request, Response } from "express";
import path from "path";
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
    return res.status(500).json({
      error: "Gemini API key is not configured or initialized on the server.",
    });
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
