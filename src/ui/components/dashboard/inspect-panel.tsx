import { useEffect } from "react";
import { X } from "lucide-react";
import type { EncounterAction, EncounterRecord } from "../../../core/types";
import { useGameStore } from "../../../store/useGameStore";
import { AGENT_THEME } from "../../constants/theme";

function actionBadge(action: EncounterAction) {
  if (action === "COOPERATE") {
    return "bg-emerald-500/20 text-emerald-400 border-emerald-500/40";
  }
  if (action === "DEFECT") {
    return "bg-red-500/20 text-red-400 border-red-500/40";
  }
  return "bg-zinc-500/20 text-zinc-400 border-zinc-500/40";
}

function GossipRow({ record }: { record: EncounterRecord }) {
  const profitPositive = record.profit >= 0;

  return (
    <li className="rounded-lg border border-zinc-800 bg-zinc-950/60 px-3 py-2">
      <div className="flex items-center justify-between gap-2">
        <span className="truncate font-mono text-[11px] text-zinc-300">
          {record.opponentId}
        </span>
        <span className="font-mono text-[10px] text-zinc-500">t{record.tick}</span>
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        <span
          className={`rounded border px-1.5 py-0.5 text-[10px] font-semibold ${actionBadge(record.myAction)}`}
        >
          Me: {record.myAction}
        </span>
        <span
          className={`rounded border px-1.5 py-0.5 text-[10px] font-semibold ${actionBadge(record.opponentAction)}`}
        >
          Them: {record.opponentAction}
        </span>
        <span
          className={`ml-auto font-mono text-xs font-bold tabular-nums ${
            profitPositive ? "text-emerald-400" : "text-red-400"
          }`}
        >
          {profitPositive ? "+" : ""}
          {record.profit.toFixed(1)}
        </span>
      </div>
    </li>
  );
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-zinc-800/80 py-2 last:border-b-0">
      <span className="text-xs tracking-wide text-zinc-400 uppercase">{label}</span>
      <span className="font-mono text-sm font-semibold text-zinc-100 tabular-nums">
        {value}
      </span>
    </div>
  );
}

export function InspectPanel() {
  const selectedAgentId = useGameStore((s) => s.selectedAgentId);
  const selectAgent = useGameStore((s) => s.selectAgent);
  const agent = useGameStore((s) =>
    selectedAgentId
      ? (s.gameState?.agents.find((a) => a.id === selectedAgentId) ?? null)
      : null,
  );

  const isOpen = Boolean(selectedAgentId && agent && !agent.isDead);

  useEffect(() => {
    if (!selectedAgentId) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") selectAgent(null);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedAgentId, selectAgent]);

  useEffect(() => {
    if (selectedAgentId && (!agent || agent.isDead)) {
      selectAgent(null);
    }
  }, [selectedAgentId, agent, selectAgent]);

  const theme = agent ? AGENT_THEME[agent.type] : null;
  const metabolism = agent
    ? agent.baseMetabolism * (1 + agent.burden)
    : 0;
  const gossip = agent?.recentGossip.slice(-5).reverse() ?? [];

  return (
    <aside
      className={`absolute inset-y-0 right-0 z-50 flex w-[min(100vw,360px)] flex-col transition-transform duration-300 ease-out ${
        isOpen ? "translate-x-0" : "pointer-events-none translate-x-full"
      }`}
      aria-hidden={!isOpen}
    >
      <div className="glass-panel m-4 flex h-[calc(100%-2rem)] flex-col overflow-hidden rounded-2xl shadow-2xl shadow-black/50">
        {agent && theme ? (
          <>
            <header className="flex items-start gap-3 border-b border-zinc-800 px-4 py-4">
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${theme.badgeBg}`}
                style={{ boxShadow: `0 0 18px ${theme.color}33` }}
              >
                <theme.Icon className="h-5 w-5" style={{ color: theme.color }} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-zinc-100">
                  {theme.label}
                </p>
                <p className="mt-0.5 truncate font-mono text-[11px] text-zinc-500">
                  {agent.id}
                </p>
              </div>
              <button
                type="button"
                onClick={() => selectAgent(null)}
                aria-label="Close inspect panel"
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-zinc-400 transition-colors duration-200 hover:bg-zinc-800 hover:text-zinc-100"
              >
                <X className="h-4 w-4" />
              </button>
            </header>

            <section className="border-b border-zinc-800 px-4 py-3">
              <h3 className="mb-1 text-[10px] font-medium tracking-wider text-zinc-500 uppercase">
                Stats
              </h3>
              <StatRow label="Wealth" value={agent.wealth.toFixed(1)} />
              <StatRow label="Metabolism" value={metabolism.toFixed(2)} />
              <StatRow label="Burden" value={agent.burden.toFixed(2)} />
            </section>

            <section className="flex min-h-0 flex-1 flex-col px-4 py-3">
              <h3 className="mb-2 text-[10px] font-medium tracking-wider text-zinc-500 uppercase">
                Recent Gossip / Memory
              </h3>
              {gossip.length === 0 ? (
                <p className="text-xs text-zinc-500">No encounters recorded yet.</p>
              ) : (
                <ul className="flex flex-1 flex-col gap-2 overflow-y-auto pr-1">
                  {gossip.map((record, index) => (
                    <GossipRow
                      key={`${record.tick}-${record.opponentId}-${index}`}
                      record={record}
                    />
                  ))}
                </ul>
              )}
            </section>
          </>
        ) : null}
      </div>
    </aside>
  );
}
