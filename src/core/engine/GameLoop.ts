import type { BaseAgent, WorldContext } from "../entities/BaseAgent";
import { EncounterManager } from "../mechanics/Encounter";
import { pushGameEvent, shortId } from "../mechanics/events";
import type { GameState, Resource, Season } from "../types";

import { ENVIRONMENT_CONFIG } from "../constants/config";

const SPAWN_ATTEMPTS: Record<Season, number> = {
  BUST: 1,
  NORMAL: 3,
  BOOM: 6,
};

export class GameEngine {
  public gameState: GameState;
  private agents: BaseAgent[];

  constructor(boardWidth: number, boardHeight: number, season: Season = "NORMAL") {
    this.gameState = {
      tick: 0,
      season,
      societalTrust: 100,
      boardWidth,
      boardHeight,
      agents: [],
      resources: [],
      events: [],
    };
    this.agents = [];
  }

  public addAgent(agent: BaseAgent) {
    this.agents.push(agent);
    this.gameState.agents.push(agent.state);
  }

  public setSeason(season: Season): void {
    this.gameState.season = season;
  }

  public seedCookies(count: number): void {
    this.addCookies(count, false);
  }

  public scatterCookies(count: number): void {
    this.addCookies(count, true);
  }

  public tick(): void {
    this.gameState.tick++;

    this.gameState.resources = this.gameState.resources.filter((r) => r.expiresTick > this.gameState.tick);

    for (const agent of this.agents) {
      if (agent.state.isDead) continue;

      const wasAlive = !agent.state.isDead;
      const context = this.buildContextForAgent(agent);

      agent.act(context);

      agent.updateLifeCycle();

      if (wasAlive && agent.state.isDead) {
        pushGameEvent(
          this.gameState,
          "DEATH",
          `${shortId(agent.state.id)} از بین رفت.`,
          agent.state.id,
        );
      }

      if (!agent.state.isDead) {
        this.checkResourcePickup(agent);
        this.enforceBoundaries(agent);
      }
    }

    this.resolveCollisions();
    this.spawnResources();
  }

  private addCookies(count: number, announce: boolean): void {
    let spawned = 0;
    for (let i = 0; i < count; i++) {
      this.gameState.resources.push(this.createCookie());
      spawned++;
    }
    if (announce && spawned > 0) {
      pushGameEvent(this.gameState, "COOKIE_SPAWN", `${spawned} کوکی روی زمین پخش شد.`);
    }
  }

  private createCookie(): Resource {
    return {
      id: `res-${this.gameState.tick}-${Math.random().toString(36).slice(2, 9)}`,
      position: {
        x: Math.floor(Math.random() * this.gameState.boardWidth),
        y: Math.floor(Math.random() * this.gameState.boardHeight),
      },
      value:
        Math.floor(Math.random() * ENVIRONMENT_CONFIG.resourceMaxValue) +
        ENVIRONMENT_CONFIG.resourceMinValue,
      spawnTick: this.gameState.tick,
      expiresTick: this.gameState.tick + ENVIRONMENT_CONFIG.resourceLifetimeTicks,
    };
  }

  private buildContextForAgent(agent: BaseAgent): WorldContext {
    const vision = agent.state.vision;

    const visibleResources = this.gameState.resources.filter(
      (r) =>
        Math.abs(r.position.x - agent.state.position.x) + Math.abs(r.position.y - agent.state.position.y) <=
        vision,
    );

    const visibleAgents = this.gameState.agents.filter(
      (a) =>
        a.id !== agent.state.id &&
        !a.isDead &&
        Math.abs(a.position.x - agent.state.position.x) + Math.abs(a.position.y - agent.state.position.y) <=
          vision,
    );

    return {
      tick: this.gameState.tick,
      societalTrust: this.gameState.societalTrust,
      visibleResources,
      visibleAgents,
      emitEvent: (kind, message, targetId) => {
        pushGameEvent(this.gameState, kind, message, agent.state.id, targetId);
      },
    };
  }

  private resolveCollisions(): void {
    const livingAgents = this.agents.filter((a) => !a.state.isDead);

    for (let i = 0; i < livingAgents.length; i++) {
      for (let j = i + 1; j < livingAgents.length; j++) {
        const a = livingAgents[i];
        const b = livingAgents[j];

        const distance =
          Math.abs(a.state.position.x - b.state.position.x) + Math.abs(a.state.position.y - b.state.position.y);

        if (distance <= 1) {
          EncounterManager.resolve(a, b, this.gameState);
          this.knockback(a, b);
        }
      }
    }
  }

  private checkResourcePickup(agent: BaseAgent): void {
    const pos = agent.state.position;
    const resourceIndex = this.gameState.resources.findIndex(
      (r) => r.position.x === pos.x && r.position.y === pos.y,
    );

    if (resourceIndex !== -1) {
      const resource = this.gameState.resources[resourceIndex];
      agent.state.wealth += resource.value;
      this.gameState.resources.splice(resourceIndex, 1);
      pushGameEvent(
        this.gameState,
        "COOKIE_PICKUP",
        `${shortId(agent.state.id)} یک کوکی (ارزش ${resource.value}) برداشت.`,
        agent.state.id,
      );
    }
  }

  private knockback(agentA: BaseAgent, agentB: BaseAgent): void {
    const posA = agentA.state.position;
    const posB = agentB.state.position;
    let dx = Math.sign(posB.x - posA.x);
    const dy = Math.sign(posB.y - posA.y);

    if (dx === 0 && dy === 0) dx = 1;

    posA.x -= dx;
    posA.y -= dy;
    posB.x += dx;
    posB.y += dy;
    this.enforceBoundaries(agentA);
    this.enforceBoundaries(agentB);

    if (this.manhattan(agentA, agentB) > 1) return;

    this.stepApart(agentA, -dx, -dy);
    if (this.manhattan(agentA, agentB) > 1) return;
    this.stepApart(agentB, dx, dy);
  }

  private stepApart(agent: BaseAgent, dx: number, dy: number): void {
    agent.state.position.x += dx;
    agent.state.position.y += dy;
    this.enforceBoundaries(agent);
  }

  private manhattan(agentA: BaseAgent, agentB: BaseAgent): number {
    return (
      Math.abs(agentA.state.position.x - agentB.state.position.x) +
      Math.abs(agentA.state.position.y - agentB.state.position.y)
    );
  }

  private enforceBoundaries(agent: BaseAgent): void {
    agent.state.position.x = Math.max(0, Math.min(agent.state.position.x, this.gameState.boardWidth - 1));
    agent.state.position.y = Math.max(0, Math.min(agent.state.position.y, this.gameState.boardHeight - 1));
  }

  private spawnResources(): void {
    const spawnRateSeasonMap: Record<Season, number> = {
      BOOM: ENVIRONMENT_CONFIG.spawnRateBoom,
      BUST: ENVIRONMENT_CONFIG.spawnRateBust,
      NORMAL: ENVIRONMENT_CONFIG.spawnRateNormal,
    };

    const spawnRate = spawnRateSeasonMap[this.gameState.season];
    const attempts = SPAWN_ATTEMPTS[this.gameState.season];
    let spawned = 0;

    for (let i = 0; i < attempts; i++) {
      if (Math.random() < spawnRate) {
        this.gameState.resources.push(this.createCookie());
        spawned++;
      }
    }

    if (spawned > 0) {
      pushGameEvent(
        this.gameState,
        "COOKIE_SPAWN",
        spawned === 1 ? `یک کوکی تازه روی زمین ظاهر شد.` : `${spawned} کوکی تازه روی زمین ظاهر شد.`,
      );
    }
  }
}
