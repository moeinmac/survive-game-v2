import { BaseAgent, type WorldContext } from "../BaseAgent";
import type { AgentState, EncounterAction, Position } from "../../types";

export class HardWorkerCopycat extends BaseAgent {
  private currentDirection: { dx: number; dy: number };

  constructor(id: string, initialPosition: Position) {
    super(id, "HARDWORKER_COPYCAT", initialPosition, 12, 120, 1, 0.3, 60);

    const directions = [
      { dx: 0, dy: 1 },
      { dx: 1, dy: 0 },
      { dx: 0, dy: -1 },
      { dx: -1, dy: 0 },
    ];

    this.currentDirection = directions[Math.floor(Math.random() * directions.length)];
  }

  public act(context: WorldContext): void {
    const SEEK_COST = 0.25;

    if (context.visibleResources.length > 0) {
      const target = context.visibleResources[0];
      this.currentDirection = {
        dx: Math.sign(target.position.x - this.state.position.x),
        dy: Math.sign(target.position.y - this.state.position.y),
      };

      this.moveTo({ x: this.state.position.x + this.currentDirection.dx, y: this.state.position.y + this.currentDirection.dy }, SEEK_COST);
      return;
    }

    const nextX = this.state.position.x + this.currentDirection.dx;
    const nextY = this.state.position.y + this.currentDirection.dy;

    this.moveTo({ x: nextX, y: nextY }, SEEK_COST);
  }

  public getEncounterAction(opponentState: AgentState): EncounterAction {
    const pastEncounters = this.state.memory[opponentState.id];
    if (!pastEncounters || pastEncounters.length === 0) return "COOPERATE";
    const lastEncounter = pastEncounters[pastEncounters.length - 1];
    if (lastEncounter.opponentAction === "DEFECT") return "DEFECT";
    return "COOPERATE";
  }
}
