/**
 * src/core/constants/config.ts
 * Centralized configuration for Game Engine, Environment, and Agent Behaviors.
 * Adjusting these values will directly impact the simulation's sociology and economy.
 */

import type { AgentType } from "../types";

// ==========================================
// 1. INTERFACES (Strict Typing)
// ==========================================

export interface GlobalMechanics {
  seekCost: number;
  memoryLimit: number;
  burdenWealthChunk: number;
  burdenMultiplier: number;
}

export interface EnvironmentSettings {
  spawnRateBoom: number;
  spawnRateNormal: number;
  spawnRateBust: number;
  resourceMinValue: number;
  resourceMaxValue: number;
  resourceLifetimeTicks: number;
}

export interface EncounterPayoffs {
  vipClubReward: number;
  robberyLootFraction: number;
  robberyFailPenalty: number;
  robberyTrustPenalty: number;
  cooperateReward: number;
  defectWinnerReward: number;
  defectLoserPenalty: number;
  mutualDefectPenalty: number;
  trustChangeCC: number;
  trustChangeDC: number;
  trustChangeDD: number;
}

export interface BaseStats {
  initialWealth: number;
  vision: number; // Radius of scanning for resources/agents
  baseMetabolism: number; // Energy consumed per tick
  defense: number; // Chance (0-100) to repel a robbery
}

// ==========================================
// 2. CONFIGURATION OBJECTS
// ==========================================

/**
 * Global physics and core mechanics applying to all entities.
 */
export const GLOBAL_MECHANICS: GlobalMechanics = {
  seekCost: 0.25, // Base energy cost for moving one cell (x or y)
  memoryLimit: 5, // Maximum recent encounters stored (prevents memory leaks)
  burdenWealthChunk: 10, // For every X cookies accumulated...
  burdenMultiplier: 0.1, // ...increase metabolism/movement cost by this percentage
};

/**
 * Map, Seasons, and Resource Spawning rates.
 */
export const ENVIRONMENT_CONFIG: EnvironmentSettings = {
  spawnRateBoom: 0.3, // 30% chance to spawn a cookie per tick during Boom
  spawnRateNormal: 0.1, // 10% chance during Normal economy
  spawnRateBust: 0.02, // 2% chance during Bust (Famine)
  resourceMinValue: 1, // Minimum nutritional value of a spawned cookie
  resourceMaxValue: 4, // Maximum nutritional value of a spawned cookie
  resourceLifetimeTicks: 40, // Ticks before an uncollected cookie rots and disappears
};

/**
 * Payoff Matrix for Encounters (Game Theory + Robbery + Rent).
 */
export const ENCOUNTER_PAYOFFS: EncounterPayoffs = {
  // VIP Rent System
  vipClubReward: 5, // Free wealth generated when two VIPs meet

  // Robbery Mechanics
  robberyLootFraction: 0.5, // Robber takes 50% of victim's wealth on success
  robberyFailPenalty: -3, // Energy lost by robber if victim successfully defends
  robberyTrustPenalty: -5, // Societal trust drop after a successful mugging

  // Prisoner's Dilemma (Trade & Betrayal)
  cooperateReward: 2, // Reward for mutual cooperation (C-C)
  defectWinnerReward: 4, // Reward for the betrayer (D-C)
  defectLoserPenalty: -2, // Loss for the betrayed (D-C)
  mutualDefectPenalty: -1, // Loss for both if they fight (D-D)

  // Societal Trust Impact
  trustChangeCC: 1, // Trust increases when agents cooperate
  trustChangeDC: -2, // Trust decreases on betrayal
  trustChangeDD: -3, // Trust plummets on mutual aggression
};

/**
 * Base physiological stats for all 6 Agent Types.
 */
export const AGENT_BASE_STATS: Record<AgentType, BaseStats> = {
  HARDWORKER_COPYCAT: { initialWealth: 12, vision: 1, baseMetabolism: 0.3, defense: 60 },
  CONTENTED_ALTRUIST: { initialWealth: 10, vision: 2, baseMetabolism: 0.3, defense: 20 },
  TALENTED_GRUDGER: { initialWealth: 12, vision: 3, baseMetabolism: 0.4, defense: 40 },
  ARISTOCRAT_VIP: { initialWealth: 40, vision: 0, baseMetabolism: 0.6, defense: 90 },
  OPTIMIZER_DETECTIVE: { initialWealth: 15, vision: 5, baseMetabolism: 0.15, defense: 50 },
  ROBBER_OPPORTUNIST: { initialWealth: 10, vision: 4, baseMetabolism: 0.35, defense: 70 },
} as const;

/**
 * Specific behavioral thresholds and logic gates for individual agent AI.
 */
export const AGENT_THRESHOLDS: Record<AgentType, Record<string, number>> = {
  CONTENTED_ALTRUIST: {
    depressionTrustLevel: 30, // Paralyzed if societal trust falls below this
    wealthSatisfaction: 15, // Stops seeking food if wealth exceeds this
  },
  TALENTED_GRUDGER: {
    minResourceValue: 3, // Perfectionist filter (ignores cheap resources)
  },
  ARISTOCRAT_VIP: {
    rentChance: 0.1, // 10% chance per tick to receive automatic rent
    rentAmount: 4, // Amount of automatic rent received
    randomMoveChance: 0.2, // Low chance to take a casual stroll
  },
  OPTIMIZER_DETECTIVE: {
    calculationTaxPerItem: 0.02, // Energy burned per item scanned (Thinking Tax)
    overloadItemCount: 8, // Suffers analysis paralysis if too many items are in vision
    minRoi: 0.5, // Minimum Return On Investment (Value - Travel Cost) to move
  },
  ROBBER_OPPORTUNIST: {
    greedWealthThreshold: 15, // If wealthier than this, targets the richest agents instead of the closest
    randomMoveChance: 0.4, // High chance to patrol alleys looking for victims
  },
  HARDWORKER_COPYCAT: {},
} as const;
