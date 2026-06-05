/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Sector = "INIT" | "EDUCATION" | "RESTAURANT" | "AGRICULTURE" | "HEALTHCARE";

export interface ArchitectConfig {
  name: string;
  uplink: string;
  domain: string;
  landScale: number;
  verticalLimit: number;
  luaScript: string;
  initialBudget?: number;
}

export interface SimulationStats {
  // Education Stats
  educationLiquidity: number;
  educationRetention: number;
  educationFinanceStrategy: string;
  educationHrAdvisory: string;

  // Restaurant Stats
  restaurantRevenueVelocity: number;
  restaurantProteinFreshness: number;
  restaurantProduceFreshness: number;
  restaurantKitchenLoad: number;

  // Agriculture Stats
  agricultureWaterReserves: number;
  agricultureHydroponicCount: number;
  agricultureHarvestDronesCount: number;
  agricultureCropYieldDelta: number;

  // Healthcare Stats
  healthcareBioAnalyzersEfficiency: number;
  healthcareThroughputDaily: number;
  healthcareSterilityLevel: string;
  healthcareResearchProgress: number;
  healthcareActiveSyntheses: string;
  healthcareNeuralSyncStatus: "OPTIMAL" | "STABLE" | "UNSTABLE";

  // Common high-level evaluation metric
  totalEvaluation: string;
}

export interface LiveLog {
  timestamp: string;
  message: string;
  type: "info" | "warn" | "exec" | "error";
}
