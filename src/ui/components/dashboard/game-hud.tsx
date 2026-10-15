import { BarChart3, Pause, Play, Settings2 } from "lucide-react";
import type { ReactNode } from "react";
import { useGameStore, type LeftPanel } from "../../../store/useGameStore";
import {
  seasonChipClass,
  seasonEmoji,
  trustBarColor,
  trustMood,
} from "../../constants/theme";

function PanelToggle({
  panel,
  active,
  label,
  children,
}: {
  panel: Exclude<LeftPanel, null>;
  active: boolean;
  label: string;
  children: ReactNode;
}) {
  const setLeftPanel = useGameStore((s) => s.setLeftPanel);

  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      title={label}
      onClick={() => setLeftPanel(panel)}
      className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition duration-200 hover:scale-105 active:scale-95 ${
        active
          ? "bg-white text-slate-900"
          : "bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}

function StatChip({ emoji, label, children }: { emoji: string; label: string; children: ReactNode }) {
  return (
    <div
      title={label}
      className="flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1.5 text-sm font-extrabold text-slate-100 tabular-nums"
    >
      <span aria-hidden>{emoji}</span>
      <span className="sr-only">{label}</span>
      {children}
    </div>
  );
}

export function GameHud() {
  const tick = useGameStore((s) => s.gameState?.tick ?? 0);
  const societalTrust = useGameStore((s) => s.gameState?.societalTrust ?? 0);
  const population = useGameStore(
    (s) => s.gameState?.agents.filter((a) => !a.isDead).length ?? 0,
  );
  const cookieCount = useGameStore((s) => s.gameState?.resources.length ?? 0);
  const season = useGameStore((s) => s.gameState?.season ?? "NORMAL");
  const isRunning = useGameStore((s) => s.isRunning);
  const leftPanel = useGameStore((s) => s.leftPanel);
  const togglePlay = useGameStore((s) => s.togglePlay);

  const trust = Math.min(100, Math.max(0, societalTrust));

  return (
    <div className="pointer-events-none absolute top-5 left-1/2 z-50 w-max max-w-[96vw] -translate-x-1/2">
      <div className="glass-panel pointer-events-auto flex flex-wrap items-center justify-center gap-2 rounded-[2rem] py-2 pr-2 pl-2 shadow-2xl shadow-black/40 sm:gap-3 sm:rounded-full">
        <button
          type="button"
          onClick={togglePlay}
          aria-label={isRunning ? "Pause simulation" : "Start simulation"}
          className={`flex h-12 w-12 cursor-pointer items-center justify-center rounded-full shadow-lg transition duration-200 hover:scale-105 active:scale-95 ${
            isRunning
              ? "bg-amber-300 text-amber-950 shadow-amber-500/20"
              : "bg-emerald-400 text-emerald-950 shadow-emerald-500/25"
          }`}
        >
          {isRunning ? (
            <Pause className="h-5 w-5" fill="currentColor" />
          ) : (
            <Play className="ml-0.5 h-5 w-5" fill="currentColor" />
          )}
        </button>

        <StatChip emoji="⏱" label="Tick">
          {tick}
        </StatChip>

        <div
          title="Societal trust"
          className="flex items-center gap-2 rounded-full bg-white/5 py-1.5 pr-3 pl-2"
        >
          <span className="text-lg leading-none" aria-hidden>
            {trustMood(trust)}
          </span>
          <div className="h-3 w-24 overflow-hidden rounded-full bg-slate-950/60 sm:w-32">
            <div
              className={`h-full rounded-full transition-[width,background-color] duration-500 ease-out ${trustBarColor(trust)}`}
              style={{ width: `${trust}%` }}
            />
          </div>
          <span className="min-w-9 text-right text-sm font-extrabold text-slate-100 tabular-nums">
            {Math.round(trust)}%
          </span>
          <span className="sr-only">Societal trust</span>
        </div>

        <StatChip emoji="👥" label="Population">
          {population}
        </StatChip>

        <StatChip emoji="🍪" label="Cookies">
          {cookieCount}
        </StatChip>

        <span
          className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-extrabold tracking-wide ${seasonChipClass(season)}`}
        >
          <span aria-hidden>{seasonEmoji(season)}</span>
          {season.charAt(0) + season.slice(1).toLowerCase()}
        </span>

        <div className="flex items-center gap-1.5">
          <PanelToggle panel="settings" active={leftPanel === "settings"} label="Settings">
            <Settings2 className="h-[18px] w-[18px]" />
          </PanelToggle>
          <PanelToggle panel="analytics" active={leftPanel === "analytics"} label="Analytics">
            <BarChart3 className="h-[18px] w-[18px]" />
          </PanelToggle>
        </div>
      </div>
    </div>
  );
}
