import { Pause, Play } from "lucide-react";
import { useGameStore } from "../../../store/useGameStore";
import { trustBarColor } from "../../constants/theme";

export function GameHud() {
  const tick = useGameStore((s) => s.gameState?.tick ?? 0);
  const societalTrust = useGameStore((s) => s.gameState?.societalTrust ?? 0);
  const population = useGameStore(
    (s) => s.gameState?.agents.filter((a) => !a.isDead).length ?? 0,
  );
  const isRunning = useGameStore((s) => s.isRunning);
  const togglePlay = useGameStore((s) => s.togglePlay);

  return (
    <div className="pointer-events-none absolute top-5 left-1/2 z-50 w-[min(92vw,560px)] -translate-x-1/2">
      <div className="glass-panel pointer-events-auto flex items-center gap-6 rounded-2xl px-5 py-3 shadow-2xl shadow-black/40">
        <div className="flex flex-col">
          <span className="text-[10px] font-medium tracking-wider text-zinc-400 uppercase">
            Tick
          </span>
          <span className="font-mono text-xl font-bold text-white tabular-nums">
            {tick}
          </span>
        </div>

        <div className="flex flex-col border-l border-zinc-700/80 pl-5">
          <span className="text-[10px] font-medium tracking-wider text-zinc-400 uppercase">
            Societal Trust
          </span>
          <div className="mt-1 flex items-center gap-2">
            <div className="h-2 w-28 overflow-hidden rounded-full bg-zinc-800">
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

        <div className="flex flex-col border-l border-zinc-700/80 pl-5">
          <span className="text-[10px] font-medium tracking-wider text-zinc-400 uppercase">
            Population
          </span>
          <span className="font-mono text-sm font-bold text-zinc-100 tabular-nums">
            {population}
          </span>
        </div>

        <div className="ml-auto flex items-center border-l border-zinc-700/80 pl-5">
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
        </div>
      </div>
    </div>
  );
}
