export interface Position {
  x: number;
  y: number;
}

export type Season = "NORMAL" | "BOOM" | "BUST";

export type EncounterAction = "COOPERATE" | "DEFECT" | "IGNORE";

export type AgentType =
  | "CONTENTED_ALTRUIST"
  | "HARDWORKER_COPYCAT"
  | "HOARDER_CAUTIOUS"
  | "OPTIMIZER_DETECTIVE"
  | "ROBBER_OPPORTUNIST"
  | "ARISTOCRAT_VIP"
  | "TALENTED_GRUDGER"
  | "SCAVENGER_VULTURE";

export type GameEventKind =
  | "COOKIE_SPAWN"
  | "COOKIE_PICKUP"
  | "DEATH"
  | "ROBBERY_SUCCESS"
  | "ROBBERY_FAIL"
  | "COOPERATE"
  | "BETRAY"
  | "FIGHT"
  | "VIP_TAX"
  | "VIP_CLUB"
  | "SCAVENGE"
  | "OPTIMIZER_OVERLOAD"
  | "HOARDER_STUCK";

export interface GameEvent {
  id: string;
  tick: number;
  kind: GameEventKind;
  message: string;
  actorId?: string;
  targetId?: string;
}

export interface EncounterRecord {
  tick: number;
  opponentId: string;
  opponentAction: EncounterAction;
  myAction: EncounterAction;
  profit: number;
}

export interface AgentState {
  id: string;
  type: AgentType;
  position: Position;

  wealth: number;
  age: number;
  maxAge: number;
  isDead: boolean;

  vision: number;
  baseMetabolism: number;
  defense: number;
  recentGossip: EncounterRecord[];
  burden: number;
  memory: Record<string, EncounterRecord[]>;
}

export interface Resource {
  id: string;
  position: Position;
  value: number;
  spawnTick: number;
  expiresTick: number;
}

export interface GameState {
  tick: number;
  season: Season;
  boardWidth: number;
  boardHeight: number;
  agents: AgentState[];
  resources: Resource[];
  societalTrust: number;
  events: GameEvent[];
}

export const MAX_GAME_EVENTS = 80;

export const AGENT_TYPES: AgentType[] = [
  "HARDWORKER_COPYCAT",
  "CONTENTED_ALTRUIST",
  "HOARDER_CAUTIOUS",
  "TALENTED_GRUDGER",
  "ARISTOCRAT_VIP",
  "SCAVENGER_VULTURE",
  "OPTIMIZER_DETECTIVE",
  "ROBBER_OPPORTUNIST",
];
