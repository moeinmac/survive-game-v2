import { BaseAgent, type WorldContext } from "../BaseAgent";
import type { AgentState, EncounterAction, Position } from "../../types";

export class HoarderCautious extends BaseAgent {
  constructor(id: string, initialPosition: Position) {
    super(id, "HOARDER_CAUTIOUS", initialPosition, 20, 150, 4, 0.2, 40);
  }

  public act(context: WorldContext): void {
    const SEEK_COST = 0.25;
    const currentSeekCost = SEEK_COST * (1 + this.state.burden);

    if (this.state.burden > 0.3 && Math.random() < 0.5) return;

    const highValueResources = context.visibleResources.filter((r) => r.value >= 3);

    if (highValueResources.length > 0) {
      let target = highValueResources[0];
      let minDistance = Infinity;

      for (const res of highValueResources) {
        const dist = Math.abs(res.position.x - this.state.position.x) + Math.abs(res.position.y - this.state.position.y);
        if (dist < minDistance) {
          minDistance = dist;
          target = res;
        }
      }

      const moveX = Math.sign(target.position.x - this.state.position.x);
      const moveY = Math.sign(target.position.y - this.state.position.y);

      this.moveTo({ x: this.state.position.x + moveX, y: this.state.position.y + moveY }, currentSeekCost);
      return;
    }

    if (Math.random() < 0.2) {
      const randomDir = [1, -1, 0];
      const rx = randomDir[Math.floor(Math.random() * randomDir.length)];
      const ry = randomDir[Math.floor(Math.random() * randomDir.length)];
      if (rx !== 0 || ry !== 0) this.moveTo({ x: this.state.position.x + rx, y: this.state.position.y + ry }, currentSeekCost);
    }
  }

  public getEncounterAction(opponentState: AgentState): EncounterAction {
    if (this.state.wealth <= opponentState.wealth) return "COOPERATE";
    return "DEFECT";
  }
}
