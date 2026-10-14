import { AGENT_BASE_STATS, AGENT_THRESHOLDS, GLOBAL_MECHANICS } from "../../constants/config";
import type { AgentState, EncounterAction, Position } from "../../types";
import { BaseAgent, type WorldContext } from "../BaseAgent";
import { shortId } from "../../mechanics/events";

const { baseMetabolism, defense, initialWealth, maxAge, vision } = AGENT_BASE_STATS.HOARDER_CAUTIOUS;
const { stuckBurdenLevel, stuckChance, minResourceValue, randomMoveChance } = AGENT_THRESHOLDS.HOARDER_CAUTIOUS;

export class HoarderCautious extends BaseAgent {
  constructor(id: string, initialPosition: Position) {
    super(id, "HOARDER_CAUTIOUS", initialPosition, initialWealth, maxAge, vision, baseMetabolism, defense);
  }

  public act(context: WorldContext): void {
    const currentSeekCost = GLOBAL_MECHANICS.seekCost * (1 + this.state.burden);

    if (this.state.burden > stuckBurdenLevel && Math.random() < stuckChance) {
      context.emitEvent("HOARDER_STUCK", `${shortId(this.state.id)} از سنگینی بار گیر کرد.`);
      return;
    }

    const highValueResources = context.visibleResources.filter((r) => r.value >= minResourceValue);

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

    if (Math.random() < randomMoveChance) {
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
