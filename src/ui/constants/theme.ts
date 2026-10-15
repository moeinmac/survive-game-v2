import type { AgentType, GameEventKind } from "../../core/types";
import type { LucideIcon } from "lucide-react";
import {
  Bug,
  Bird,
  VenetianMask,
  Crown,
  ScanEye,
  Skull,
} from "lucide-react";

export const CELL_SIZE = 32;

export type AgentShape = "circle" | "squircle" | "diamond" | "hex" | "pill" | "blob";

export interface AgentVisualConfig {
  label: string;
  Icon: LucideIcon;
  /** Accent color used by panels and charts. */
  color: string;
  /** Solid body color for the on-map avatar. */
  fill: string;
  shape: AgentShape;
  badgeBg: string;
}

export const AGENT_THEME: Record<AgentType, AgentVisualConfig> = {
  HARDWORKER_COPYCAT: {
    label: "HardWorker Copycat",
    Icon: Bug,
    color: "#7DB4FF",
    fill: "#7DB4FF",
    shape: "squircle",
    badgeBg: "bg-blue-400/15 text-blue-300 border-blue-400/30",
  },
  CONTENTED_ALTRUIST: {
    label: "Contented Altruist",
    Icon: Bird,
    color: "#6EE7B7",
    fill: "#6EE7B7",
    shape: "circle",
    badgeBg: "bg-emerald-400/15 text-emerald-300 border-emerald-400/30",
  },
  TALENTED_GRUDGER: {
    label: "Talented Grudger",
    Icon: VenetianMask,
    color: "#C4B5FD",
    fill: "#C4B5FD",
    shape: "hex",
    badgeBg: "bg-violet-400/15 text-violet-300 border-violet-400/30",
  },
  ARISTOCRAT_VIP: {
    label: "Aristocrat VIP",
    Icon: Crown,
    color: "#FCD34D",
    fill: "#FCD34D",
    shape: "pill",
    badgeBg: "bg-amber-400/15 text-amber-200 border-amber-400/30",
  },
  OPTIMIZER_DETECTIVE: {
    label: "Optimizer Detective",
    Icon: ScanEye,
    color: "#67E8F9",
    fill: "#67E8F9",
    shape: "blob",
    badgeBg: "bg-cyan-400/15 text-cyan-300 border-cyan-400/30",
  },
  ROBBER_OPPORTUNIST: {
    label: "Robber Opportunist",
    Icon: Skull,
    color: "#FF8A80",
    fill: "#FF8A80",
    shape: "diamond",
    badgeBg: "bg-rose-400/15 text-rose-300 border-rose-400/30",
  },
};

export interface FloatStyle {
  emoji: string;
  /** Tailwind classes for the floating pill. */
  tone: string;
  shake?: boolean;
}

export const FLOAT_STYLE: Record<GameEventKind, FloatStyle | null> = {
  COOPERATE: { emoji: "🤝", tone: "bg-emerald-400 text-emerald-950" },
  BETRAY: { emoji: "🗡️", tone: "bg-fuchsia-400 text-fuchsia-950" },
  FIGHT: { emoji: "💢", tone: "bg-rose-400 text-rose-950", shake: true },
  ROBBERY_SUCCESS: { emoji: "💥", tone: "bg-red-500 text-white", shake: true },
  ROBBERY_FAIL: { emoji: "🛡️", tone: "bg-slate-200 text-slate-900" },
  VIP_CLUB: { emoji: "👑", tone: "bg-amber-300 text-amber-950" },
  COOKIE_PICKUP: { emoji: "🍪", tone: "bg-amber-200 text-amber-950" },
  DEATH: { emoji: "💀", tone: "bg-slate-500 text-white" },
  OPTIMIZER_OVERLOAD: { emoji: "😵", tone: "bg-cyan-300 text-cyan-950" },
  COOKIE_SPAWN: null,
};

export function trustBarColor(trust: number): string {
  if (trust < 40) return "bg-rose-400";
  if (trust > 80) return "bg-emerald-400";
  return "bg-amber-300";
}

export function trustMood(trust: number): string {
  if (trust < 40) return "😟";
  if (trust > 80) return "😊";
  return "😐";
}

export function seasonChipClass(season: string): string {
  if (season === "BOOM") return "bg-emerald-400/15 text-emerald-200 border-emerald-400/25";
  if (season === "BUST") return "bg-rose-400/15 text-rose-200 border-rose-400/25";
  return "bg-sky-400/15 text-sky-200 border-sky-400/25";
}

export function seasonEmoji(season: string): string {
  if (season === "BOOM") return "🌞";
  if (season === "BUST") return "🥶";
  return "🌤️";
}
