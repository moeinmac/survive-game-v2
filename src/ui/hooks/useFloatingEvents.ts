import { useEffect, useMemo, useRef, useState } from "react";
import { ENCOUNTER_PAYOFFS } from "../../core/constants/config";
import type { AgentState, GameEvent, GameEventKind, GameState } from "../../core/types";
import { useGameStore } from "../../store/useGameStore";
import { CELL_SIZE, FLOAT_STYLE } from "../constants/theme";

export interface Floater {
  id: string;
  /** Board-space pixel coordinates (cell center). */
  x: number;
  y: number;
  label: string;
  tone: string;
  shake: boolean;
}

const FLOATER_TTL_MS = 1200;
const MAX_FLOATERS = 40;

const BUMP_KINDS: ReadonlySet<GameEventKind> = new Set([
  "COOPERATE",
  "BETRAY",
  "FIGHT",
  "ROBBERY_SUCCESS",
  "ROBBERY_FAIL",
  "VIP_CLUB",
  "COOKIE_PICKUP",
]);

function formatAmount(value: number): string {
  const rounded = Math.round(value * 10) / 10;
  return `${rounded > 0 ? "+" : ""}${rounded}`;
}

function center(agent: AgentState) {
  return {
    x: agent.position.x * CELL_SIZE + CELL_SIZE / 2,
    y: agent.position.y * CELL_SIZE,
  };
}

function midpoint(a: AgentState, b: AgentState | undefined) {
  const pa = center(a);
  if (!b) return pa;
  const pb = center(b);
  return { x: (pa.x + pb.x) / 2, y: (pa.y + pb.y) / 2 };
}

function parseNumber(message: string, pattern: RegExp): number | null {
  const match = message.match(pattern);
  if (!match) return null;
  const value = Number(match[1]);
  return Number.isFinite(value) ? value : null;
}

function floatersForEvent(event: GameEvent, byId: Map<string, AgentState>): Floater[] {
  const style = FLOAT_STYLE[event.kind];
  if (!style || !event.actorId) return [];

  const actor = byId.get(event.actorId);
  if (!actor) return [];
  const target = event.targetId ? byId.get(event.targetId) : undefined;

  const make = (
    suffix: string,
    pos: { x: number; y: number },
    label: string,
    overrides?: Partial<Pick<Floater, "tone" | "shake">>,
  ): Floater => ({
    id: `${event.id}-${suffix}`,
    x: pos.x,
    y: pos.y,
    label,
    tone: overrides?.tone ?? style.tone,
    shake: overrides?.shake ?? Boolean(style.shake),
  });

  switch (event.kind) {
    case "COOPERATE":
      return [
        make("m", midpoint(actor, target), `${style.emoji} ${formatAmount(ENCOUNTER_PAYOFFS.cooperateReward)}`),
      ];
    case "VIP_CLUB":
      return [
        make("m", midpoint(actor, target), `${style.emoji} ${formatAmount(ENCOUNTER_PAYOFFS.vipClubReward)}`),
      ];
    case "FIGHT":
      return [
        make("m", midpoint(actor, target), `${style.emoji} ${formatAmount(ENCOUNTER_PAYOFFS.mutualDefectPenalty)}`),
      ];
    case "BETRAY": {
      const out = [
        make("a", center(actor), `${style.emoji} ${formatAmount(ENCOUNTER_PAYOFFS.defectWinnerReward)}`),
      ];
      if (target) {
        out.push(
          make("t", center(target), `💔 ${formatAmount(ENCOUNTER_PAYOFFS.defectLoserPenalty)}`, {
            shake: true,
          }),
        );
      }
      return out;
    }
    case "ROBBERY_SUCCESS": {
      const loot = parseNumber(event.message, /\(\+([\d.]+)\)/);
      const out = [
        make("a", center(actor), loot === null ? "💰" : `💰 ${formatAmount(loot)}`, {
          tone: "bg-amber-300 text-amber-950",
          shake: false,
        }),
      ];
      if (target) {
        out.push(make("t", center(target), loot === null ? style.emoji : `${style.emoji} ${formatAmount(-loot)}`));
      }
      return out;
    }
    case "ROBBERY_FAIL":
      return [make("t", target ? center(target) : center(actor), style.emoji)];
    case "COOKIE_PICKUP": {
      const value = parseNumber(event.message, /worth\s*([\d.]+)/);
      return [make("a", center(actor), value === null ? style.emoji : `${style.emoji} ${formatAmount(value)}`)];
    }
    default:
      return [make("a", center(actor), style.emoji)];
  }
}

/** Turns newly-arrived game events into short-lived on-map floaters. */
export function useFloatingEvents(): Floater[] {
  const [floaters, setFloaters] = useState<Floater[]>([]);
  const timers = useRef(new Set<ReturnType<typeof setTimeout>>());

  useEffect(() => {
    let seenIds = new Set(useGameStore.getState().gameState?.events.map((e) => e.id) ?? []);
    const pending = timers.current;

    const ingest = (state: GameState | null) => {
      if (!state) return;
      const fresh = state.events.filter((e) => !seenIds.has(e.id));
      seenIds = new Set(state.events.map((e) => e.id));
      if (fresh.length === 0) return;

      const byId = new Map(state.agents.map((a) => [a.id, a]));
      const created = fresh.flatMap((e) => floatersForEvent(e, byId)).slice(0, MAX_FLOATERS);
      if (created.length === 0) return;

      setFloaters((prev) => [...created, ...prev].slice(0, MAX_FLOATERS));

      const createdIds = new Set(created.map((f) => f.id));
      const timer = setTimeout(() => {
        pending.delete(timer);
        setFloaters((prev) => prev.filter((f) => !createdIds.has(f.id)));
      }, FLOATER_TTL_MS);
      pending.add(timer);
    };

    const unsubscribe = useGameStore.subscribe((s, prev) => {
      if (s.gameState !== prev.gameState) ingest(s.gameState);
    });

    return () => {
      unsubscribe();
      for (const timer of pending) clearTimeout(timer);
      pending.clear();
    };
  }, []);

  return floaters;
}

/** Latest tick each agent took part in an interaction; used as a key to replay the bump animation. */
export function useBumpTicks(): Map<string, number> {
  const events = useGameStore((s) => s.gameState?.events);

  return useMemo(() => {
    const ticks = new Map<string, number>();
    if (!events) return ticks;
    for (const event of events) {
      if (!BUMP_KINDS.has(event.kind)) continue;
      for (const id of [event.actorId, event.targetId]) {
        if (id && !ticks.has(id)) ticks.set(id, event.tick);
      }
    }
    return ticks;
  }, [events]);
}
