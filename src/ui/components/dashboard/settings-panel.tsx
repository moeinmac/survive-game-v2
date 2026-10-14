import { useState } from "react";
import { Cookie, RotateCcw, X } from "lucide-react";
import type { AgentType, Season } from "../../../core/types";
import { AGENT_TYPES } from "../../../core/types";
import {
  SCATTER_COOKIE_COUNT,
  useGameStore,
  type AgentCounts,
} from "../../../store/useGameStore";
import { AGENT_THEME, seasonChipClass } from "../../constants/theme";

const SEASONS: Season[] = ["NORMAL", "BOOM", "BUST"];

function SettingsPanelBody() {
  const preferredSeason = useGameStore((s) => s.preferredSeason);
  const storeCounts = useGameStore((s) => s.agentCounts);
  const setLeftPanel = useGameStore((s) => s.setLeftPanel);
  const setSeason = useGameStore((s) => s.setSeason);
  const scatterCookies = useGameStore((s) => s.scatterCookies);
  const reinitGame = useGameStore((s) => s.reinitGame);

  const [draftSeason, setDraftSeason] = useState<Season>(preferredSeason);
  const [draftCounts, setDraftCounts] = useState<AgentCounts>(() => ({ ...storeCounts }));

  const totalAgents = AGENT_TYPES.reduce((sum, type) => sum + (draftCounts[type] ?? 0), 0);

  const updateCount = (type: AgentType, raw: string) => {
    const value = Math.max(0, Math.min(200, Number.parseInt(raw, 10) || 0));
    setDraftCounts((prev) => ({ ...prev, [type]: value }));
  };

  return (
    <div className="glass-panel m-4 flex h-[calc(100%-2rem)] flex-col overflow-hidden rounded-2xl shadow-2xl shadow-black/50">
      <header className="flex items-center justify-between border-b border-zinc-800 px-4 py-4">
        <div>
          <h2 className="text-sm font-semibold text-zinc-100">تنظیمات بازی</h2>
          <p className="mt-0.5 text-[11px] text-zinc-500">فصل، جمعیت، کوکی</p>
        </div>
        <button
          type="button"
          aria-label="بستن"
          onClick={() => setLeftPanel(null)}
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-zinc-400 transition-colors duration-200 hover:bg-zinc-800 hover:text-zinc-100"
        >
          <X className="h-4 w-4" />
        </button>
      </header>

      <div className="flex-1 space-y-5 overflow-y-auto px-4 py-4">
        <section>
          <h3 className="mb-2 text-[10px] font-medium tracking-wider text-zinc-500 uppercase">
            فصل
          </h3>
          <div className="flex gap-2">
            {SEASONS.map((season) => (
              <button
                key={season}
                type="button"
                onClick={() => {
                  setDraftSeason(season);
                  setSeason(season);
                }}
                className={`cursor-pointer rounded-lg border px-3 py-1.5 text-xs font-bold transition-colors duration-200 ${
                  draftSeason === season
                    ? seasonChipClass(season)
                    : "border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300"
                }`}
              >
                {season}
              </button>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-[10px] font-medium tracking-wider text-zinc-500 uppercase">
              تعداد هر نوع
            </h3>
            <span className="font-mono text-[11px] text-zinc-400">جمع: {totalAgents}</span>
          </div>
          <ul className="space-y-2">
            {AGENT_TYPES.map((type) => {
              const theme = AGENT_THEME[type];
              const Icon = theme.Icon;
              return (
                <li
                  key={type}
                  className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-950/40 px-2 py-1.5"
                >
                  <Icon className="h-4 w-4 shrink-0" style={{ color: theme.color }} />
                  <span className="min-w-0 flex-1 truncate text-xs text-zinc-300">{theme.label}</span>
                  <input
                    type="number"
                    min={0}
                    max={200}
                    value={draftCounts[type]}
                    onChange={(e) => updateCount(type, e.target.value)}
                    className="w-16 rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1 text-left font-mono text-xs text-zinc-100 outline-none focus:border-cyan-600"
                  />
                </li>
              );
            })}
          </ul>
        </section>

        <section className="space-y-2">
          <button
            type="button"
            onClick={() => scatterCookies(SCATTER_COOKIE_COUNT)}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-amber-500/40 bg-amber-500/15 px-3 py-2.5 text-sm font-semibold text-amber-200 transition-colors duration-200 hover:bg-amber-500/25"
          >
            <Cookie className="h-4 w-4" />
            پخش {SCATTER_COOKIE_COUNT} کوکی روی زمین
          </button>

          <button
            type="button"
            onClick={() => reinitGame({ counts: draftCounts, season: draftSeason })}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-cyan-500/40 bg-cyan-500/15 px-3 py-2.5 text-sm font-semibold text-cyan-200 transition-colors duration-200 hover:bg-cyan-500/25"
          >
            <RotateCcw className="h-4 w-4" />
            اعمال و شروع مجدد
          </button>
        </section>
      </div>
    </div>
  );
}

export function SettingsPanel() {
  const open = useGameStore((s) => s.leftPanel === "settings");

  return (
    <aside
      dir="rtl"
      className={`absolute inset-y-0 left-0 z-50 flex w-[min(100vw,380px)] flex-col transition-transform duration-300 ease-out ${
        open ? "translate-x-0" : "pointer-events-none -translate-x-full"
      }`}
      aria-hidden={!open}
    >
      {open ? <SettingsPanelBody /> : null}
    </aside>
  );
}
