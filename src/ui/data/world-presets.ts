import type { AgentType } from "../../core/types";
import { AGENT_TYPES } from "../../core/types";
import type { AgentCounts } from "../../store/useGameStore";

export const POPULATION_MIN = 100;
export const POPULATION_MAX = 500;
export const POPULATION_DEFAULT = 300;
export const POPULATION_STEP = 10;

export type WorldPresetId = "gotham" | "cutthroat" | "welfare" | "class-war";
export const CUSTOM_WORLD_ID = "custom" as const;
export type WorldChoiceId = WorldPresetId | typeof CUSTOM_WORLD_ID;

export interface WorldChoice {
  id: WorldChoiceId;
  accent: string;
}

export const CUSTOM_WORLD: WorldChoice = {
  id: CUSTOM_WORLD_ID,
  accent: "#C4B5FD",
};

/** Percentage share of each agent type. Values are weights and should sum to 100. */
export type PopulationShare = Record<AgentType, number>;

export interface WorldPreset {
  id: WorldPresetId;
  /** Card glow and primary action color. */
  accent: string;
  distribution: PopulationShare;
}

export const WORLD_PRESETS: readonly WorldPreset[] = [
  {
    id: "gotham",
    accent: "#FB7185",
    distribution: {
      ROBBER_OPPORTUNIST: 40,
      OPTIMIZER_DETECTIVE: 20,
      ARISTOCRAT_VIP: 15,
      TALENTED_GRUDGER: 15,
      HARDWORKER_COPYCAT: 5,
      CONTENTED_ALTRUIST: 5,
    },
  },
  {
    id: "cutthroat",
    accent: "#22D3EE",
    distribution: {
      OPTIMIZER_DETECTIVE: 40,
      TALENTED_GRUDGER: 30,
      HARDWORKER_COPYCAT: 15,
      ARISTOCRAT_VIP: 10,
      ROBBER_OPPORTUNIST: 3,
      CONTENTED_ALTRUIST: 2,
    },
  },
  {
    id: "welfare",
    accent: "#34D399",
    distribution: {
      HARDWORKER_COPYCAT: 45,
      CONTENTED_ALTRUIST: 30,
      TALENTED_GRUDGER: 15,
      OPTIMIZER_DETECTIVE: 5,
      ARISTOCRAT_VIP: 3,
      ROBBER_OPPORTUNIST: 2,
    },
  },
  {
    id: "class-war",
    accent: "#FBBF24",
    distribution: {
      HARDWORKER_COPYCAT: 50,
      ARISTOCRAT_VIP: 25,
      ROBBER_OPPORTUNIST: 15,
      TALENTED_GRUDGER: 5,
      OPTIMIZER_DETECTIVE: 3,
      CONTENTED_ALTRUIST: 2,
    },
  },
] as const;

export interface RankedShare {
  type: AgentType;
  percent: number;
}

export interface CountMixEntry {
  type: AgentType;
  count: number;
  /** Share of the current total, from 0 to 100. */
  percent: number;
}

export function sumAgentCounts(counts: AgentCounts): number {
  return AGENT_TYPES.reduce((sum, type) => sum + Math.max(0, Math.floor(counts[type] ?? 0)), 0);
}

/** Even split of the default population. Leftover heads go to the earliest types. */
export function defaultCustomCounts(): AgentCounts {
  const each = Math.floor(POPULATION_DEFAULT / AGENT_TYPES.length);
  const counts = Object.fromEntries(AGENT_TYPES.map((type) => [type, each])) as AgentCounts;
  let leftover = POPULATION_DEFAULT - each * AGENT_TYPES.length;
  for (const type of AGENT_TYPES) {
    if (leftover <= 0) break;
    counts[type] += 1;
    leftover -= 1;
  }
  return counts;
}

export function rankedCountMix(counts: AgentCounts): CountMixEntry[] {
  const total = sumAgentCounts(counts);
  return AGENT_TYPES.map((type) => {
    const count = Math.max(0, Math.floor(counts[type] ?? 0));
    return {
      type,
      count,
      percent: total === 0 ? 0 : (count / total) * 100,
    };
  })
    .filter((entry) => entry.count > 0)
    .sort((a, b) => b.count - a.count || a.type.localeCompare(b.type));
}

/** Keep every type at zero or above, and the whole society inside the population cap. */
export function withAgentCount(counts: AgentCounts, type: AgentType, raw: number): AgentCounts {
  const current = Math.max(0, Math.floor(counts[type] ?? 0));
  const others = sumAgentCounts(counts) - current;
  const room = Math.max(0, POPULATION_MAX - others);
  const requested = Number.isFinite(raw) ? Math.floor(raw) : 0;
  return {
    ...counts,
    [type]: Math.max(0, Math.min(room, requested)),
  };
}

export function rankedShares(shares: PopulationShare): RankedShare[] {
  return AGENT_TYPES.map((type) => ({ type, percent: shares[type] ?? 0 }))
    .filter((entry) => entry.percent > 0)
    .sort((a, b) => b.percent - a.percent || a.type.localeCompare(b.type));
}

/**
 * Turn percentage weights into integer headcounts that sum to `total`
 * using the largest-remainder method.
 */
export function allocatePopulation(shares: PopulationShare, total: number): AgentCounts {
  const safeTotal = Math.max(0, Math.floor(total));
  const weights = AGENT_TYPES.map((type) => ({
    type,
    weight: Math.max(0, shares[type] ?? 0),
  }));
  const weightSum = weights.reduce((sum, entry) => sum + entry.weight, 0);

  const counts = Object.fromEntries(AGENT_TYPES.map((type) => [type, 0])) as AgentCounts;
  if (safeTotal === 0 || weightSum === 0) return counts;

  const portions = weights.map((entry) => {
    const exact = (entry.weight / weightSum) * safeTotal;
    const count = Math.floor(exact);
    return { type: entry.type, count, remainder: exact - count };
  });

  let leftover = safeTotal - portions.reduce((sum, entry) => sum + entry.count, 0);
  const byRemainder = [...portions].sort(
    (a, b) => b.remainder - a.remainder || a.type.localeCompare(b.type),
  );

  for (const entry of byRemainder) {
    if (leftover <= 0) break;
    entry.count += 1;
    leftover -= 1;
  }

  for (const entry of portions) {
    counts[entry.type] = entry.count;
  }

  return counts;
}
