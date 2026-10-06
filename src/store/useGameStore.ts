import { create } from "zustand";
import { GameEngine } from "../core/engine/GameLoop";
import type { AgentState, GameState, Resource } from "../core/types";

import { HardWorkerCopycat } from "../core/entities/agents/HardWorker";
import { ContentedAltruist } from "../core/entities/agents/Contented";
import { HoarderCautious } from "../core/entities/agents/Hoarder";
import { TalentedGrudger } from "../core/entities/agents/Talented";
import { AristocratVip } from "../core/entities/agents/Aristocrat";
import { ScavengerVulture } from "../core/entities/agents/Scavenger";
import { OptimizerDetective } from "../core/entities/agents/Optimizer";
import { RobberOpportunist } from "../core/entities/agents/Robber";

/** One simulation tick per second — slow enough to follow agent movement. */
export const TICK_INTERVAL_MS = 1000;

function snapshotAgent(agent: AgentState): AgentState {
  return {
    ...agent,
    position: { ...agent.position },
    recentGossip: agent.recentGossip.map((record) => ({ ...record })),
    memory: { ...agent.memory },
  };
}

function snapshotResource(resource: Resource): Resource {
  return {
    ...resource,
    position: { ...resource.position },
  };
}

function snapshotGameState(state: GameState): GameState {
  return {
    ...state,
    agents: state.agents.map(snapshotAgent),
    resources: state.resources.map(snapshotResource),
  };
}

interface GameStoreState {
  engine: GameEngine | null;
  gameState: GameState | null;
  isRunning: boolean;
  lastTickTime: number;
  selectedAgentId: string | null;

  initGame: (width: number, height: number, populationCount: number) => void;
  togglePlay: () => void;
  selectAgent: (id: string | null) => void;
  gameLoopStep: (timestamp: number) => void;
}

export const useGameStore = create<GameStoreState>((set, get) => ({
  engine: null,
  gameState: null,
  isRunning: false,
  lastTickTime: 0,
  selectedAgentId: null,

  initGame: (width, height, populationCount) => {
    const engine = new GameEngine(width, height);

    const agentTypes = [
      HardWorkerCopycat,
      ContentedAltruist,
      HoarderCautious,
      TalentedGrudger,
      AristocratVip,
      ScavengerVulture,
      OptimizerDetective,
      RobberOpportunist,
    ];

    for (let i = 0; i < populationCount; i++) {
      const AgentClass = agentTypes[i % agentTypes.length];
      const randomPos = {
        x: Math.floor(Math.random() * width),
        y: Math.floor(Math.random() * height),
      };

      const agentId = `${AgentClass.name}-${i}`;
      engine.addAgent(new AgentClass(agentId, randomPos));
    }

    set({
      engine,
      gameState: snapshotGameState(engine.gameState),
      isRunning: false,
      lastTickTime: 0,
      selectedAgentId: null,
    });
  },

  togglePlay: () => set((state) => ({ isRunning: !state.isRunning })),

  selectAgent: (id) => set({ selectedAgentId: id }),

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
