import type { AgentType } from "../../core/types";
import type { LucideIcon } from "lucide-react";
import {
  Bug,
  Bird,
  Nut,
  VenetianMask,
  Crown,
  Feather,
  ScanEye,
  Skull,
} from "lucide-react";

export const CELL_SIZE = 32;

export interface AgentVisualConfig {
  label: string;
  Icon: LucideIcon;
  color: string;
  badgeBg: string;
}

export const AGENT_THEME: Record<AgentType, AgentVisualConfig> = {
  HARDWORKER_COPYCAT: {
    label: "HardWorker Copycat",
    Icon: Bug,
    color: "#3B82F6",
    badgeBg: "bg-blue-500/20 text-blue-400 border-blue-500/40",
  },
  CONTENTED_ALTRUIST: {
    label: "Contented Altruist",
    Icon: Bird,
    color: "#10B981",
    badgeBg: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40",
  },
  HOARDER_CAUTIOUS: {
    label: "Hoarder Cautious",
    Icon: Nut,
    color: "#F59E0B",
    badgeBg: "bg-amber-500/20 text-amber-400 border-amber-500/40",
  },
  TALENTED_GRUDGER: {
    label: "Talented Grudger",
    Icon: VenetianMask,
    color: "#8B5CF6",
    badgeBg: "bg-purple-500/20 text-purple-400 border-purple-500/40",
  },
  ARISTOCRAT_VIP: {
    label: "Aristocrat VIP",
    Icon: Crown,
    color: "#FBBF24",
    badgeBg: "bg-yellow-500/20 text-yellow-300 border-yellow-500/40",
  },
  SCAVENGER_VULTURE: {
    label: "Scavenger Vulture",
    Icon: Feather,
    color: "#6B7280",
    badgeBg: "bg-zinc-500/20 text-zinc-300 border-zinc-500/40",
  },
  OPTIMIZER_DETECTIVE: {
    label: "Optimizer Detective",
    Icon: ScanEye,
    color: "#06B6D4",
    badgeBg: "bg-cyan-500/20 text-cyan-400 border-cyan-500/40",
  },
  ROBBER_OPPORTUNIST: {
    label: "Robber Opportunist",
    Icon: Skull,
    color: "#EF4444",
    badgeBg: "bg-red-500/20 text-red-400 border-red-500/40",
  },
};

export function trustBarColor(trust: number): string {
  if (trust < 40) return "bg-red-500";
  if (trust > 80) return "bg-emerald-500";
  return "bg-amber-500";
}

export function seasonChipClass(season: string): string {
  if (season === "BOOM") return "bg-emerald-500/20 text-emerald-300 border-emerald-500/40";
  if (season === "BUST") return "bg-red-500/20 text-red-300 border-red-500/40";
  return "bg-cyan-500/20 text-cyan-300 border-cyan-500/40";
}
