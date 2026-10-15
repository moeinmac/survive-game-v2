import type { AgentType } from "../../core/types";
import { AGENT_TYPES } from "../../core/types";
import type { AgentCounts } from "../../store/useGameStore";

export const POPULATION_MIN = 100;
export const POPULATION_MAX = 500;
export const POPULATION_DEFAULT = 300;
export const POPULATION_STEP = 10;

export type WorldPresetId = "gotham" | "cutthroat" | "welfare" | "class-war";

/** Percentage share of each agent type. Values are weights and should sum to 100. */
export type PopulationShare = Record<AgentType, number>;

export interface WorldPreset {
  id: WorldPresetId;
  name: string;
  epithet: string;
  description: string;
  /** Card glow and primary action color. */
  accent: string;
  distribution: PopulationShare;
}

export const WORLD_PRESETS: readonly WorldPreset[] = [
  {
    id: "gotham",
    name: "Gotham City",
    epithet: "Social Collapse",
    description:
      "A dying city overrun by crime and corruption. The working class is nearly extinct, while the elites hide behind high walls.",
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
    name: "Cutthroat Capitalism",
    epithet: "Ruthless Competition",
    description:
      "A cold, hyper-efficient market. Everyone calculates ROI. Trust is low, but the economy thrives on ruthless competition.",
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
    name: "The Welfare State",
    epithet: "High Trust",
    description:
      "A highly trusting, prosperous society. However, this naive optimism makes it a perfect breeding ground for a few hidden parasites.",
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
    name: "Class War",
    epithet: "Polarized Economy",
    description:
      "A heavily polarized economy. The masses toil relentlessly while a massive aristocratic class hoards the wealth, sparking constant rebellions.",
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
