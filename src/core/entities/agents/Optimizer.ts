import { BaseAgent, type WorldContext } from "../BaseAgent";
import type { AgentState, EncounterAction, Position } from "../../types";

export class OptimizerDetective extends BaseAgent {
  constructor(id: string, initialPosition: Position) {
    super(id, "OPTIMIZER_DETECTIVE", initialPosition, 15, 150, 5, 0.15, 50);
  }

  public act(context: WorldContext): void {
    const SEEK_COST = 0.25;

    if (context.visibleResources.length === 0) return;

    const calculationTax = context.visibleResources.length * 0.02;
    this.state.wealth -= calculationTax;

    if (context.visibleResources.length > 8) return;

    let bestTarget = null;
    let maxROI = -Infinity;

    for (const res of context.visibleResources) {
      const distance = Math.abs(res.position.x - this.state.position.x) + Math.abs(res.position.y - this.state.position.y);
      const estimatedCost = distance * SEEK_COST;
      const roi = res.value - estimatedCost;

      if (roi > maxROI) {
        maxROI = roi;
        bestTarget = res;
      }
    }

    if (bestTarget && maxROI > 0.5) {
      const moveX = Math.sign(bestTarget.position.x - this.state.position.x);
      const moveY = Math.sign(bestTarget.position.y - this.state.position.y);
      this.moveTo({ x: this.state.position.x + moveX, y: this.state.position.y + moveY }, SEEK_COST);
    }
  }

  public getEncounterAction(opponentState: AgentState): EncounterAction {
    const pastEncounters = this.state.memory[opponentState.id] || [];

    if (pastEncounters.length === 0) return "COOPERATE";
    if (pastEncounters.length === 1) return "DEFECT";
    if (pastEncounters.length === 2) return "COOPERATE";

    const opponentRetaliated = pastEncounters.some((enc, index) => index > 0 && enc.opponentAction === "DEFECT");

    if (opponentRetaliated) return "COOPERATE";
    else return "DEFECT";
  }
}
