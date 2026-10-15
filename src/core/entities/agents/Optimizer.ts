import type { AgentState, EncounterAction, Position } from "../../types";
import { BaseAgent, type WorldContext } from "../BaseAgent";
import { shortId } from "../../mechanics/events";

import { AGENT_BASE_STATS, AGENT_THRESHOLDS, GLOBAL_MECHANICS } from "../../constants/config";

const { baseMetabolism, defense, initialWealth, vision } = AGENT_BASE_STATS.OPTIMIZER_DETECTIVE;
const { calculationTaxPerItem, overloadItemCount, minRoi } = AGENT_THRESHOLDS.OPTIMIZER_DETECTIVE;

export class OptimizerDetective extends BaseAgent {
  constructor(id: string, initialPosition: Position) {
    super(id, "OPTIMIZER_DETECTIVE", initialPosition, initialWealth, vision, baseMetabolism, defense);
  }

  public act(context: WorldContext): void {
    if (context.visibleResources.length === 0) return;

    const calculationTax = context.visibleResources.length * calculationTaxPerItem;
    this.state.wealth -= calculationTax;

    if (context.visibleResources.length > overloadItemCount) {
      context.emitEvent(
        "OPTIMIZER_OVERLOAD",
        `${shortId(this.state.id)} froze and couldn't decide.`,
      );
      return;
    }

    let bestTarget = null;
    let maxROI = -Infinity;

    for (const res of context.visibleResources) {
      const distance = Math.abs(res.position.x - this.state.position.x) + Math.abs(res.position.y - this.state.position.y);
      const estimatedCost = distance * GLOBAL_MECHANICS.seekCost;
      const roi = res.value - estimatedCost;

      if (roi > maxROI) {
        maxROI = roi;
        bestTarget = res;
      }
    }

    if (bestTarget && maxROI > minRoi) {
      const moveX = Math.sign(bestTarget.position.x - this.state.position.x);
      const moveY = Math.sign(bestTarget.position.y - this.state.position.y);
      this.moveTo({ x: this.state.position.x + moveX, y: this.state.position.y + moveY }, GLOBAL_MECHANICS.seekCost);
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
