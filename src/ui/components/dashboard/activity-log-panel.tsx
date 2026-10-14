import { X } from "lucide-react";
import type { GameEventKind } from "../../../core/types";
import { useGameStore } from "../../../store/useGameStore";

const KIND_STYLE: Record<GameEventKind, string> = {
  COOKIE_SPAWN: "bg-amber-500/20 text-amber-300 border-amber-500/40",
  COOKIE_PICKUP: "bg-amber-500/15 text-amber-200 border-amber-500/30",
  DEATH: "bg-zinc-500/20 text-zinc-300 border-zinc-500/40",
  ROBBERY_SUCCESS: "bg-red-500/20 text-red-300 border-red-500/40",
  ROBBERY_FAIL: "bg-orange-500/20 text-orange-300 border-orange-500/40",
  COOPERATE: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
  BETRAY: "bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/40",
  FIGHT: "bg-rose-500/20 text-rose-300 border-rose-500/40",
  VIP_CLUB: "bg-yellow-500/25 text-yellow-100 border-yellow-400/50",
  OPTIMIZER_OVERLOAD: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
};

const KIND_LABEL: Record<GameEventKind, string> = {
  COOKIE_SPAWN: "کوکی",
  COOKIE_PICKUP: "برداشت",
  DEATH: "مرگ",
  ROBBERY_SUCCESS: "دزدی",
  ROBBERY_FAIL: "شکست دزدی",
  COOPERATE: "همکاری",
  BETRAY: "خیانت",
  FIGHT: "جنگ",
  VIP_CLUB: "باشگاه VIP",
  OPTIMIZER_OVERLOAD: "هنگ",
};

export function ActivityLogPanel() {
  const open = useGameStore((s) => s.leftPanel === "log");
  const setLeftPanel = useGameStore((s) => s.setLeftPanel);
  const events = useGameStore((s) => s.gameState?.events ?? []);

  return (
    <aside
      dir="rtl"
      className={`absolute inset-y-0 left-0 z-50 flex w-[min(100vw,380px)] flex-col transition-transform duration-300 ease-out ${
        open ? "translate-x-0" : "pointer-events-none -translate-x-full"
      }`}
      aria-hidden={!open}
    >
      <div className="glass-panel m-4 flex h-[calc(100%-2rem)] flex-col overflow-hidden rounded-2xl shadow-2xl shadow-black/50">
        <header className="flex items-center justify-between border-b border-zinc-800 px-4 py-4">
          <div>
            <h2 className="text-sm font-semibold text-zinc-100">لاگ رویدادها</h2>
            <p className="mt-0.5 text-[11px] text-zinc-500">مغز جامعه — زنده</p>
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

        <div className="flex-1 overflow-y-auto px-3 py-3">
          {events.length === 0 ? (
            <p className="px-2 py-8 text-center text-sm text-zinc-500">
              هنوز رویدادی ثبت نشده — بازی را شروع کنید
            </p>
          ) : (
            <ul className="flex flex-col gap-2">
              {events.map((event) => (
                <li
                  key={event.id}
                  className="rounded-xl border border-zinc-800 bg-zinc-950/50 px-3 py-2.5"
                >
                  <div className="mb-1.5 flex items-center justify-between gap-2">
                    <span
                      className={`rounded border px-1.5 py-0.5 text-[10px] font-semibold ${KIND_STYLE[event.kind]}`}
                    >
                      {KIND_LABEL[event.kind]}
                    </span>
                    <span className="font-mono text-[10px] text-zinc-500">t{event.tick}</span>
                  </div>
                  <p className="text-sm leading-relaxed text-zinc-200">{event.message}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </aside>
  );
}
