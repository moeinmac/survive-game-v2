import { AGENT_BASE_STATS, AGENT_THRESHOLDS, GLOBAL_MECHANICS } from "../../constants/config";
import type { AgentState, EncounterAction, Position } from "../../types";
import { BaseAgent, type WorldContext } from "../BaseAgent";

const { baseMetabolism, defense, initialWealth, maxAge, vision } = AGENT_BASE_STATS.CONTENTED_ALTRUIST;
const { depressionTrustLevel, wealthSatisfaction } = AGENT_THRESHOLDS.CONTENTED_ALTRUIST;

export class ContentedAltruist extends BaseAgent {
  constructor(id: string, initialPosition: Position) {
    super(id, "CONTENTED_ALTRUIST", initialPosition, initialWealth, maxAge, vision, baseMetabolism, defense);
  }

  public act(context: WorldContext): void {
    if (context.societalTrust < depressionTrustLevel) return;

    if (this.state.wealth > wealthSatisfaction) return;

    if (context.visibleAgents.length > 0) {
      let dx = 0;
      let dy = 0;

      context.visibleAgents.forEach((agent) => {
        dx += this.state.position.x - agent.position.x;
        dy += this.state.position.y - agent.position.y;
      });

      const moveX = dx === 0 ? 0 : Math.sign(dx);
      const moveY = dy === 0 ? 0 : Math.sign(dy);

      if (moveX !== 0 || moveY !== 0) {
        this.moveTo({ x: this.state.position.x + moveX, y: this.state.position.y + moveY }, GLOBAL_MECHANICS.seekCost);
        return;
      }
    }

    if (context.visibleResources.length > 0) {
      const target = context.visibleResources[0];
      const moveX = Math.sign(target.position.x - this.state.position.x);
      const moveY = Math.sign(target.position.y - this.state.position.y);

      this.moveTo({ x: this.state.position.x + moveX, y: this.state.position.y + moveY }, GLOBAL_MECHANICS.seekCost);
      return;
    }

    const randomDir = [1, -1, 0];
    const rx = randomDir[Math.floor(Math.random() * randomDir.length)];
    const ry = randomDir[Math.floor(Math.random() * randomDir.length)];
    if (rx !== 0 || ry !== 0) this.moveTo({ x: this.state.position.x + rx, y: this.state.position.y + ry }, GLOBAL_MECHANICS.seekCost);
  }

  public getEncounterAction(opponent: AgentState): EncounterAction {
    void opponent;
    return "COOPERATE";
  }
}
