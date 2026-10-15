import type { AgentType, GameEventKind } from "../../core/types";
import type { LucideIcon } from "lucide-react";
import {
  HardHat,
  Heart,
  Sparkles,
  Crown,
  ScanEye,
  VenetianMask,
} from "lucide-react";

export const CELL_SIZE = 32;

export interface AgentVisualConfig {
  label: string;
  Icon: LucideIcon;
  /** Accent color used by panels and charts. */
  color: string;
  /** Body color for the on-map avatar. */
  fill: string;
  badgeBg: string;
}

export const AGENT_THEME: Record<AgentType, AgentVisualConfig> = {
  HARDWORKER_COPYCAT: {
    label: "HardWorker Copycat",
    Icon: HardHat,
    color: "#18D6C6",
    fill: "#18D6C6",
    badgeBg: "bg-[#18D6C6]/15 text-[#18D6C6] border-[#18D6C6]/30",
  },
  CONTENTED_ALTRUIST: {
    label: "Contented Altruist",
    Icon: Heart,
    color: "#F43075",
    fill: "#F43075",
    badgeBg: "bg-[#F43075]/15 text-[#FF6B9E] border-[#F43075]/30",
  },
  TALENTED_GRUDGER: {
    label: "Talented Grudger",
    Icon: Sparkles,
    color: "#E2791C",
    fill: "#E2791C",
    badgeBg: "bg-[#E2791C]/15 text-[#F59E4B] border-[#E2791C]/30",
  },
  ARISTOCRAT_VIP: {
    label: "Aristocrat VIP",
    Icon: Crown,
    color: "#F60609",
    fill: "#F60609",
    badgeBg: "bg-[#F60609]/15 text-[#FF5A5C] border-[#F60609]/30",
  },
  OPTIMIZER_DETECTIVE: {
    label: "Optimizer Detective",
    Icon: ScanEye,
    color: "#7C6CFF",
    fill: "#7C6CFF",
    badgeBg: "bg-[#7C6CFF]/15 text-[#A89DFF] border-[#7C6CFF]/30",
  },
  ROBBER_OPPORTUNIST: {
    label: "Robber Opportunist",
    Icon: VenetianMask,
    color: "#E2E8F0",
    fill: "#F1F5F9",
    badgeBg: "bg-white/10 text-slate-100 border-white/25",
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
