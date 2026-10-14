import type { GameEvent, GameEventKind, GameState } from "../types";
import { MAX_GAME_EVENTS } from "../types";

let eventSeq = 0;

export function shortId(id: string): string {
  const parts = id.split("-");
  if (parts.length >= 2) return `${parts[0]}-${parts[parts.length - 1]}`;
  return id.length > 18 ? `${id.slice(0, 16)}…` : id;
}

export function pushGameEvent(
  gameState: GameState,
  kind: GameEventKind,
  message: string,
  actorId?: string,
  targetId?: string,
): void {
  const event: GameEvent = {
    id: `evt-${gameState.tick}-${++eventSeq}`,
    tick: gameState.tick,
    kind,
    message,
    actorId,
    targetId,
  };

  gameState.events.unshift(event);
  if (gameState.events.length > MAX_GAME_EVENTS) {
    gameState.events.length = MAX_GAME_EVENTS;
  }
}
