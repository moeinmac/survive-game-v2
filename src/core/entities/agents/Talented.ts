import { BaseAgent, type WorldContext } from "../BaseAgent";
import type { AgentState, EncounterAction, Position } from "../../types";

export class TalentedGrudger extends BaseAgent {
  constructor(id: string, initialPosition: Position) {
    super(id, "TALENTED_GRUDGER", initialPosition, 12, 100, 3, 0.4, 40);
  }

  public act(context: WorldContext): void {
    const SEEK_COST = 0.25;

    const perfectResources = context.visibleResources.filter((r) => r.value >= 3);

    if (perfectResources.length > 0) {
      let target = perfectResources[0];
      let minDistance = Infinity;

      for (const res of perfectResources) {
        const dist = Math.abs(res.position.x - this.state.position.x) + Math.abs(res.position.y - this.state.position.y);
        if (dist < minDistance) {
          minDistance = dist;
          target = res;
        }
      }

      const moveX = Math.sign(target.position.x - this.state.position.x);
      const moveY = Math.sign(target.position.y - this.state.position.y);

      this.moveTo({ x: this.state.position.x + moveX, y: this.state.position.y + moveY }, SEEK_COST);
      return;
    }

    return;
  }

  public getEncounterAction(opponentState: AgentState): EncounterAction {
    const pastEncounters = this.state.memory[opponentState.id];

    if (!pastEncounters || pastEncounters.length === 0) return "COOPERATE";

    const hasBetrayedMe = pastEncounters.some((enc) => enc.opponentAction === "DEFECT");

    if (hasBetrayedMe) return "DEFECT";

    return "COOPERATE";
  }
}
