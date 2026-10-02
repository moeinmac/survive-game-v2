import type { BaseAgent, WorldContext } from "../entities/BaseAgent";
import { EncounterManager } from "../mechanics/Encounter";
import type { GameState } from "../types";

export class GameEngine {
  public gameState: GameState;
  private agents: BaseAgent[];

  constructor(boardWidth: number, boardHeight: number) {
    this.gameState = {
      tick: 0,
      season: "NORMAL",
      societalTrust: 100,
      boardWidth,
      boardHeight,
      agents: [],
      resources: [],
    };
    this.agents = [];
  }

  public addAgent(agent: BaseAgent) {
    this.agents.push(agent);
    this.gameState.agents.push(agent.state);
  }

  public tick(): void {
    this.gameState.tick++;

    this.gameState.resources = this.gameState.resources.filter((r) => r.expiresTick > this.gameState.tick);

    for (const agent of this.agents) {
      if (agent.state.isDead) continue;

      const context = this.buildContextForAgent(agent);

      agent.act(context);

      agent.updateLifeCycle();

      this.checkResourcePickup(agent);

      this.enforceBoundaries(agent);
    }

    this.resolveCollisions();

    this.spawnResources();
  }

  private buildContextForAgent(agent: BaseAgent): WorldContext {
    const vision = agent.state.vision;

    const visibleResources = this.gameState.resources.filter(
      (r) => Math.abs(r.position.x - agent.state.position.x) + Math.abs(r.position.y - agent.state.position.y) <= vision,
    );

    const visibleAgents = this.gameState.agents.filter(
      (a) =>
        a.id !== agent.state.id &&
        !a.isDead &&
        Math.abs(a.position.x - agent.state.position.x) + Math.abs(a.position.y - agent.state.position.y) <= vision,
    );

    return {
      tick: this.gameState.tick,
      societalTrust: this.gameState.societalTrust,
      visibleResources,
      visibleAgents,
    };
  }

  private resolveCollisions(): void {
    const livingAgents = this.agents.filter((a) => !a.state.isDead);

    for (let i = 0; i < livingAgents.length; i++) {
      for (let j = i + 1; j < livingAgents.length; j++) {
        const a = livingAgents[i];
        const b = livingAgents[j];

        const distance = Math.abs(a.state.position.x - b.state.position.x) + Math.abs(a.state.position.y - b.state.position.y);

        if (distance <= 1) EncounterManager.resolve(a, b, this.gameState);
      }
    }
  }

  private checkResourcePickup(agent: BaseAgent): void {
    const pos = agent.state.position;
    const resourceIndex = this.gameState.resources.findIndex((r) => r.position.x === pos.x && r.position.y === pos.y);

    if (resourceIndex !== -1) {
      const resource = this.gameState.resources[resourceIndex];
      agent.state.wealth += resource.value;
      this.gameState.resources.splice(resourceIndex, 1);
    }
  }

  private enforceBoundaries(agent: BaseAgent): void {
    agent.state.position.x = Math.max(0, Math.min(agent.state.position.x, this.gameState.boardWidth - 1));
    agent.state.position.y = Math.max(0, Math.min(agent.state.position.y, this.gameState.boardHeight - 1));
  }

  private spawnResources(): void {
    const spawnRate = this.gameState.season === "BOOM" ? 0.3 : this.gameState.season === "BUST" ? 0.02 : 0.1;

    if (Math.random() < spawnRate) {
      this.gameState.resources.push({
        id: `res-${this.gameState.tick}-${Math.random()}`,
        position: {
          x: Math.floor(Math.random() * this.gameState.boardWidth),
          y: Math.floor(Math.random() * this.gameState.boardHeight),
        },
        value: Math.floor(Math.random() * 4) + 1,
        spawnTick: this.gameState.tick,
        expiresTick: this.gameState.tick + 40,
      });
    }
  }
}
