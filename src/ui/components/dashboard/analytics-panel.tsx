import { X } from "lucide-react";
import { AGENT_TYPES } from "../../../core/types";
import { useGameStore } from "../../../store/useGameStore";
import { AGENT_THEME } from "../../constants/theme";

export function AnalyticsPanel() {
  const open = useGameStore((s) => s.leftPanel === "analytics");
  const setLeftPanel = useGameStore((s) => s.setLeftPanel);
  const agents = useGameStore((s) => s.gameState?.agents ?? []);

  const living = agents.filter((a) => !a.isDead);
  const totalWealth = living.reduce((sum, a) => sum + Math.max(0, a.wealth), 0);
  const totalCount = living.length;

  const byType = AGENT_TYPES.map((type) => {
    const members = living.filter((a) => a.type === type);
    const count = members.length;
    const wealth = members.reduce((sum, a) => sum + Math.max(0, a.wealth), 0);
    return {
      type,
      count,
      wealth,
      countPct: totalCount > 0 ? (count / totalCount) * 100 : 0,
      wealthPct: totalWealth > 0 ? (wealth / totalWealth) * 100 : 0,
    };
  });

  const leaderCount = [...byType].sort((a, b) => b.count - a.count)[0];
  const leaderWealth = [...byType].sort((a, b) => b.wealth - a.wealth)[0];

  return (
    <aside
      className={`absolute inset-y-0 left-0 z-50 flex w-[min(100vw,400px)] flex-col transition-transform duration-300 ease-out ${
        open ? "translate-x-0" : "pointer-events-none -translate-x-full"
      }`}
      aria-hidden={!open}
    >
      <div className="glass-panel m-4 flex h-[calc(100%-2rem)] flex-col overflow-hidden rounded-2xl shadow-2xl shadow-black/50">
        <header className="flex items-center justify-between border-b border-zinc-800 px-4 py-4">
          <div>
            <h2 className="text-sm font-semibold text-zinc-100">Analytics</h2>
            <p className="mt-0.5 text-[11px] text-zinc-500">Living mix and wealth share</p>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={() => setLeftPanel(null)}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-zinc-400 transition-colors duration-200 hover:bg-zinc-800 hover:text-zinc-100"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="flex-1 space-y-5 overflow-y-auto px-4 py-4">
          {totalCount === 0 ? (
            <p className="py-8 text-center text-sm text-zinc-500">No agents left alive.</p>
          ) : (
            <>
              <p className="rounded-lg border border-zinc-800 bg-zinc-950/50 px-3 py-2 text-xs leading-relaxed text-zinc-300">
                Population leader:{" "}
                <span className="font-semibold" style={{ color: AGENT_THEME[leaderCount.type].color }}>
                  {AGENT_THEME[leaderCount.type].label}
                </span>{" "}
                ({leaderCount.count}) — Wealth leader:{" "}
                <span className="font-semibold" style={{ color: AGENT_THEME[leaderWealth.type].color }}>
                  {AGENT_THEME[leaderWealth.type].label}
                </span>{" "}
                ({leaderWealth.wealthPct.toFixed(0)}% of {totalWealth.toFixed(0)})
              </p>

              <section>
                <h3 className="mb-3 text-[10px] font-medium tracking-wider text-zinc-500 uppercase">
                  Living population
                </h3>
                <ul className="space-y-2.5">
                  {byType.map((row) => {
                    const theme = AGENT_THEME[row.type];
                    return (
                      <li key={`pop-${row.type}`}>
                        <div className="mb-1 flex items-center justify-between gap-2 text-xs">
                          <span className="truncate text-zinc-300">{theme.label}</span>
                          <span className="font-mono text-zinc-400 tabular-nums">
                            {row.count} ({row.countPct.toFixed(0)}%)
                          </span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
                          <div
                            className="h-full rounded-full transition-[width] duration-300"
                            style={{
                              width: `${Math.max(row.countPct, row.count > 0 ? 2 : 0)}%`,
                              backgroundColor: theme.color,
                            }}
                          />
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </section>

              <section>
                <h3 className="mb-3 text-[10px] font-medium tracking-wider text-zinc-500 uppercase">
                  Wealth share
                </h3>
                <div className="mb-3 flex h-3 overflow-hidden rounded-full bg-zinc-800">
                  {byType.map((row) =>
                    row.wealthPct <= 0 ? null : (
                      <div
                        key={`pie-${row.type}`}
                        title={`${AGENT_THEME[row.type].label}: ${row.wealthPct.toFixed(1)}%`}
                        style={{
                          width: `${row.wealthPct}%`,
                          backgroundColor: AGENT_THEME[row.type].color,
                        }}
                      />
                    ),
                  )}
                </div>
                <ul className="space-y-2.5">
                  {byType.map((row) => {
                    const theme = AGENT_THEME[row.type];
                    return (
                      <li key={`wealth-${row.type}`}>
                        <div className="mb-1 flex items-center justify-between gap-2 text-xs">
                          <span className="truncate text-zinc-300">{theme.label}</span>
                          <span className="font-mono text-zinc-400 tabular-nums">
                            {row.wealth.toFixed(0)} ({row.wealthPct.toFixed(0)}%)
                          </span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
                          <div
                            className="h-full rounded-full transition-[width] duration-300"
                            style={{
                              width: `${Math.max(row.wealthPct, row.wealth > 0 ? 2 : 0)}%`,
                              backgroundColor: theme.color,
                            }}
                          />
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </section>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}
