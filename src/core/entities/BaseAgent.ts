import type { AgentState, Position, EncounterAction, AgentType } from "../types";

export interface WorldContext {
  tick: number;
  visibleResources: any[];
  visibleAgents: AgentState[];
  societalTrust: number;
}

export abstract class BaseAgent {
  public state: AgentState;

  constructor(
    id: string,
    type: AgentType,
    initialPosition: Position,
    initialWealth: number,
    maxAge: number,
    vision: number,
    baseMetabolism: number,
    defense: number,
  ) {
    this.state = {
      id,
      type,
      position: initialPosition,
      wealth: initialWealth,
      age: 0,
      maxAge,
      isDead: false,
      vision,
      baseMetabolism,
      defense,
      burden: 0,
      memory: {},
    };
  }

  public updateLifeCycle(): void {
    if (this.state.isDead) return;

    this.state.age += 1;

    if (this.state.age >= this.state.maxAge) {
      this.die();
      return;
    }

    this.state.burden = Math.floor(this.state.wealth / 10) * 0.1;
    const currentMetabolism = this.state.baseMetabolism * (1 + this.state.burden);

    this.state.wealth -= currentMetabolism;

    if (this.state.wealth <= 0) this.die();
  }

  public memorizeEncounter(tick: number, opponentId: string, opponentAction: EncounterAction, myAction: EncounterAction, profit: number): void {
    if (!this.state.memory[opponentId]) {
      this.state.memory[opponentId] = [];
    }

    this.state.memory[opponentId].push({
      tick,
      opponentId,
      opponentAction,
      myAction,
      profit,
    });
  }

  public moveTo(newPosition: Position, cost: number): void {
    this.state.position = newPosition;
    this.state.wealth -= cost;
  }

  protected die(): void {
    this.state.isDead = true;
  }

  public abstract act(context: WorldContext): void;

  public abstract getEncounterAction(opponentState: AgentState): EncounterAction;
}
