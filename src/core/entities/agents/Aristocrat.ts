import { AGENT_BASE_STATS, AGENT_THRESHOLDS, GLOBAL_MECHANICS } from "../../constants/config";
import type { AgentState, EncounterAction, Position } from "../../types";
import { BaseAgent, type WorldContext } from "../BaseAgent";

const { baseMetabolism, defense, initialWealth, vision } = AGENT_BASE_STATS.ARISTOCRAT_VIP;
const { rentChance, rentAmount, randomMoveChance } = AGENT_THRESHOLDS.ARISTOCRAT_VIP;

export class AristocratVip extends BaseAgent {
  constructor(id: string, initialPosition: Position) {
    super(id, "ARISTOCRAT_VIP", initialPosition, initialWealth, vision, baseMetabolism, defense);
  }

  public act(context: WorldContext): void {
    void context;
    if (Math.random() < rentChance) this.state.wealth += rentAmount;

    if (Math.random() < randomMoveChance) {
      const randomDir = [1, -1, 0];
      const rx = randomDir[Math.floor(Math.random() * randomDir.length)];
      const ry = randomDir[Math.floor(Math.random() * randomDir.length)];
      if (rx !== 0 || ry !== 0) this.moveTo({ x: this.state.position.x + rx, y: this.state.position.y + ry }, GLOBAL_MECHANICS.seekCost);
    }

    return;
  }

  public getEncounterAction(opponentState: AgentState): EncounterAction {
    if (opponentState.type === "ARISTOCRAT_VIP") return "COOPERATE";

    return "IGNORE";
  }
}
