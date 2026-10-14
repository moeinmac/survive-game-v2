import { BarChart3, Brain, Cookie, Pause, Play, Settings2 } from "lucide-react";
import type { ReactNode } from "react";
import { useGameStore, type LeftPanel } from "../../../store/useGameStore";
import { seasonChipClass, trustBarColor } from "../../constants/theme";

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
      onClick={() => setLeftPanel(panel)}
      className={`flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl transition-colors duration-200 ${
        active
          ? "bg-cyan-500/25 text-cyan-300"
          : "bg-zinc-800/60 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
      }`}
    >
      {children}
    </button>
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

  return (
    <div className="pointer-events-none absolute top-5 left-1/2 z-50 w-[min(96vw,780px)] -translate-x-1/2">
      <div className="glass-panel pointer-events-auto flex flex-wrap items-center gap-4 rounded-2xl px-4 py-3 shadow-2xl shadow-black/40 sm:gap-5 sm:px-5">
        <div className="flex flex-col">
          <span className="text-[10px] font-medium tracking-wider text-zinc-400 uppercase">
            Tick
          </span>
          <span className="font-mono text-xl font-bold text-white tabular-nums">{tick}</span>
        </div>

        <div className="flex flex-col border-l border-zinc-700/80 pl-4">
          <span className="text-[10px] font-medium tracking-wider text-zinc-400 uppercase">
            Societal Trust
          </span>
          <div className="mt-1 flex items-center gap-2">
            <div className="h-2 w-24 overflow-hidden rounded-full bg-zinc-800 sm:w-28">
              <div
                className={`h-full rounded-full transition-[width,background-color] duration-200 ${trustBarColor(societalTrust)}`}
                style={{ width: `${Math.min(100, Math.max(0, societalTrust))}%` }}
              />
            </div>
            <span className="font-mono text-sm font-semibold text-zinc-100 tabular-nums">
              {Math.round(societalTrust)}%
            </span>
          </div>
        </div>

        <div className="flex flex-col border-l border-zinc-700/80 pl-4">
          <span className="text-[10px] font-medium tracking-wider text-zinc-400 uppercase">
            Population
          </span>
          <span className="font-mono text-sm font-bold text-zinc-100 tabular-nums">
            {population}
          </span>
        </div>

        <div className="flex flex-col border-l border-zinc-700/80 pl-4">
          <span className="text-[10px] font-medium tracking-wider text-zinc-400 uppercase">
            Cookies
          </span>
          <span className="inline-flex items-center gap-1 font-mono text-sm font-bold text-amber-300 tabular-nums">
            <Cookie className="h-3.5 w-3.5" />
            {cookieCount}
          </span>
        </div>

        <div className="flex flex-col border-l border-zinc-700/80 pl-4">
          <span className="text-[10px] font-medium tracking-wider text-zinc-400 uppercase">
            Season
          </span>
          <span
            className={`mt-0.5 inline-flex w-fit rounded border px-1.5 py-0.5 text-[10px] font-bold tracking-wide ${seasonChipClass(season)}`}
          >
            {season}
          </span>
        </div>

        <div className="ml-auto flex items-center gap-2 border-l border-zinc-700/80 pl-4">
          <button
            type="button"
            onClick={togglePlay}
            aria-label={isRunning ? "Stop simulation" : "Start simulation"}
            className={`flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl transition-colors duration-200 ${
              isRunning
                ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                : "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
            }`}
          >
            {isRunning ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </button>

          <PanelToggle panel="log" active={leftPanel === "log"} label="Activity log">
            <Brain className="h-5 w-5" />
          </PanelToggle>
          <PanelToggle panel="settings" active={leftPanel === "settings"} label="Settings">
            <Settings2 className="h-5 w-5" />
          </PanelToggle>
          <PanelToggle panel="analytics" active={leftPanel === "analytics"} label="Analytics">
            <BarChart3 className="h-5 w-5" />
          </PanelToggle>
        </div>
      </div>
    </div>
  );
}
