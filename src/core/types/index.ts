export interface Position {
  x: number;
  y: number;
}

export type Season = "NORMAL" | "BOOM" | "BUST";

export type EncounterAction = "COOPERATE" | "DEFECT" | "IGNORE";

export type AgentType =
  | "CONTENTED_ALTRUIST"
  | "HARDWORKER_COPYCAT"
  | "OPTIMIZER_DETECTIVE"
  | "ROBBER_OPPORTUNIST"
  | "ARISTOCRAT_VIP"
  | "TALENTED_GRUDGER";

export type GameEventKind =
  | "COOKIE_SPAWN"
  | "COOKIE_PICKUP"
  | "DEATH"
  | "ROBBERY_SUCCESS"
  | "ROBBERY_FAIL"
  | "COOPERATE"
  | "BETRAY"
  | "FIGHT"
  | "VIP_CLUB"
  | "OPTIMIZER_OVERLOAD";

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
  "TALENTED_GRUDGER",
  "ARISTOCRAT_VIP",
  "OPTIMIZER_DETECTIVE",
  "ROBBER_OPPORTUNIST",
];
