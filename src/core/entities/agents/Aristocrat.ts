import { BaseAgent, type WorldContext } from "../BaseAgent";
import type { AgentState, EncounterAction, Position } from "../../types";

export class AristocratVip extends BaseAgent {
  constructor(id: string, initialPosition: Position) {
    super(id, "ARISTOCRAT_VIP", initialPosition, 40, 150, 0, 0.6, 90);
  }

  public act(_: WorldContext): void {
    const SEEK_COST = 0.25;

    if (Math.random() < 0.1) this.state.wealth += 4;

    if (Math.random() < 0.2) {
      const randomDir = [1, -1, 0];
      const rx = randomDir[Math.floor(Math.random() * randomDir.length)];
      const ry = randomDir[Math.floor(Math.random() * randomDir.length)];
      if (rx !== 0 || ry !== 0) this.moveTo({ x: this.state.position.x + rx, y: this.state.position.y + ry }, SEEK_COST);
    }

    return;
  }

  public getEncounterAction(opponentState: AgentState): EncounterAction {
    if (opponentState.type === "ARISTOCRAT_VIP") return "COOPERATE";

    return "IGNORE";
  }
}
