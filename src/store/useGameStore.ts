import { create } from "zustand";
import { GameEngine } from "../core/engine/GameLoop";
import type { AgentType, GameEvent, GameState, Resource, Season } from "../core/types";
import { AGENT_TYPES } from "../core/types";

import { HardWorkerCopycat } from "../core/entities/agents/HardWorker";
import { ContentedAltruist } from "../core/entities/agents/Contented";
import { HoarderCautious } from "../core/entities/agents/Hoarder";
import { TalentedGrudger } from "../core/entities/agents/Talented";
import { AristocratVip } from "../core/entities/agents/Aristocrat";
import { ScavengerVulture } from "../core/entities/agents/Scavenger";
import { OptimizerDetective } from "../core/entities/agents/Optimizer";
import { RobberOpportunist } from "../core/entities/agents/Robber";
import type { BaseAgent } from "../core/entities/BaseAgent";
import type { Position } from "../core/types";

/** One simulation tick per second — slow enough to follow agent movement. */
export const TICK_INTERVAL_MS = 1000;

export const DEFAULT_BOARD_WIDTH = 100;
export const DEFAULT_BOARD_HEIGHT = 70;
export const DEFAULT_SEED_COOKIES = 60;
export const SCATTER_COOKIE_COUNT = 40;

export type LeftPanel = null | "log" | "settings" | "analytics";

export type AgentCounts = Record<AgentType, number>;

export const DEFAULT_AGENT_COUNTS: AgentCounts = {
  HARDWORKER_COPYCAT: 30,
  CONTENTED_ALTRUIST: 30,
  HOARDER_CAUTIOUS: 30,
  TALENTED_GRUDGER: 30,
  ARISTOCRAT_VIP: 30,
  SCAVENGER_VULTURE: 30,
  OPTIMIZER_DETECTIVE: 30,
  ROBBER_OPPORTUNIST: 30,
};

type AgentCtor = new (id: string, pos: Position) => BaseAgent;

const AGENT_CLASS_BY_TYPE: Record<AgentType, AgentCtor> = {
  HARDWORKER_COPYCAT: HardWorkerCopycat,
  CONTENTED_ALTRUIST: ContentedAltruist,
  HOARDER_CAUTIOUS: HoarderCautious,
  TALENTED_GRUDGER: TalentedGrudger,
  ARISTOCRAT_VIP: AristocratVip,
  SCAVENGER_VULTURE: ScavengerVulture,
  OPTIMIZER_DETECTIVE: OptimizerDetective,
  ROBBER_OPPORTUNIST: RobberOpportunist,
};

function snapshotResource(resource: Resource): Resource {
  return {
    ...resource,
    position: { ...resource.position },
  };
}

function snapshotGameState(state: GameState): GameState {
  return {
    ...state,
    agents: state.agents.map((agent) => ({
      ...agent,
      position: { ...agent.position },
      recentGossip: agent.recentGossip.map((record) => ({ ...record })),
      memory: { ...agent.memory },
    })),
    resources: state.resources.map(snapshotResource),
    events: state.events.map((e: GameEvent) => ({ ...e })),
  };
}

function populateEngine(
  engine: GameEngine,
  width: number,
  height: number,
  counts: AgentCounts,
): void {
  let index = 0;
  for (const type of AGENT_TYPES) {
    const AgentClass = AGENT_CLASS_BY_TYPE[type];
    const count = Math.max(0, Math.floor(counts[type] ?? 0));
    for (let i = 0; i < count; i++) {
      const randomPos = {
        x: Math.floor(Math.random() * width),
        y: Math.floor(Math.random() * height),
      };
      engine.addAgent(new AgentClass(`${AgentClass.name}-${index}`, randomPos));
      index++;
    }
  }
  engine.seedCookies(DEFAULT_SEED_COOKIES);
}

export interface ReinitOptions {
  boardWidth?: number;
  boardHeight?: number;
  counts: AgentCounts;
  season: Season;
}

interface GameStoreState {
  engine: GameEngine | null;
  gameState: GameState | null;
  isRunning: boolean;
  lastTickTime: number;
  selectedAgentId: string | null;
  leftPanel: LeftPanel;
  agentCounts: AgentCounts;
  preferredSeason: Season;

  initGame: (width?: number, height?: number, counts?: AgentCounts, season?: Season) => void;
  reinitGame: (options: ReinitOptions) => void;
  togglePlay: () => void;
  selectAgent: (id: string | null) => void;
  setLeftPanel: (panel: LeftPanel) => void;
  setSeason: (season: Season) => void;
  scatterCookies: (count?: number) => void;
  gameLoopStep: (timestamp: number) => void;
}

export const useGameStore = create<GameStoreState>((set, get) => ({
  engine: null,
  gameState: null,
  isRunning: false,
  lastTickTime: 0,
  selectedAgentId: null,
  leftPanel: null,
  agentCounts: { ...DEFAULT_AGENT_COUNTS },
  preferredSeason: "NORMAL",

  initGame: (
    width = DEFAULT_BOARD_WIDTH,
    height = DEFAULT_BOARD_HEIGHT,
    counts = DEFAULT_AGENT_COUNTS,
    season = "NORMAL",
  ) => {
    const engine = new GameEngine(width, height, season);
    populateEngine(engine, width, height, counts);

    set({
      engine,
      gameState: snapshotGameState(engine.gameState),
      isRunning: false,
      lastTickTime: 0,
      selectedAgentId: null,
      agentCounts: { ...counts },
      preferredSeason: season,
    });
  },

  reinitGame: ({ boardWidth, boardHeight, counts, season }) => {
    const width = boardWidth ?? get().gameState?.boardWidth ?? DEFAULT_BOARD_WIDTH;
    const height = boardHeight ?? get().gameState?.boardHeight ?? DEFAULT_BOARD_HEIGHT;
    get().initGame(width, height, counts, season);
  },

  togglePlay: () => set((state) => ({ isRunning: !state.isRunning })),

  selectAgent: (id) => set({ selectedAgentId: id }),

  setLeftPanel: (panel) => {
    if (panel === null) {
      set({ leftPanel: null });
      return;
    }
    set((state) => ({
      leftPanel: state.leftPanel === panel ? null : panel,
    }));
  },

  setSeason: (season) => {
    const { engine } = get();
    if (!engine) return;
    engine.setSeason(season);
    set({
      preferredSeason: season,
      gameState: snapshotGameState(engine.gameState),
    });
  },

  scatterCookies: (count = SCATTER_COOKIE_COUNT) => {
    const { engine } = get();
    if (!engine) return;
    engine.scatterCookies(count);
    set({ gameState: snapshotGameState(engine.gameState) });
  },

  gameLoopStep: (timestamp) => {
    const { engine, isRunning, lastTickTime } = get();

    if (!engine || !isRunning) return;

    if (timestamp - lastTickTime >= TICK_INTERVAL_MS) {
      engine.tick();

      set({
        gameState: snapshotGameState(engine.gameState),
        lastTickTime: timestamp,
      });
    }
  },
}));
