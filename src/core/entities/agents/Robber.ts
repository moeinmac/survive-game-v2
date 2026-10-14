import type { AgentState, EncounterAction, Position } from "../../types";
import { BaseAgent, type WorldContext } from "../BaseAgent";

import { AGENT_BASE_STATS, AGENT_THRESHOLDS, GLOBAL_MECHANICS } from "../../constants/config";

const { baseMetabolism, defense, initialWealth, maxAge, vision } = AGENT_BASE_STATS.ROBBER_OPPORTUNIST;
const { randomMoveChance, greedWealthThreshold } = AGENT_THRESHOLDS.ROBBER_OPPORTUNIST;

export class RobberOpportunist extends BaseAgent {
  constructor(id: string, initialPosition: Position) {
    super(id, "ROBBER_OPPORTUNIST", initialPosition, initialWealth, maxAge, vision, baseMetabolism, defense);
  }

  public act(context: WorldContext): void {
    const potentialTargets = context.visibleAgents.filter((agent) => agent.type !== "ROBBER_OPPORTUNIST" && !agent.isDead);

    if (potentialTargets.length > 0) {
      let target = potentialTargets[0];

      if (this.state.wealth > greedWealthThreshold) {
        for (const agent of potentialTargets) if (agent.wealth > target.wealth) target = agent;
      } else {
        let minDistance = Infinity;
        for (const agent of potentialTargets) {
          const dist = Math.abs(agent.position.x - this.state.position.x) + Math.abs(agent.position.y - this.state.position.y);
          if (dist < minDistance) {
            minDistance = dist;
            target = agent;
          }
        }
      }

      const moveX = Math.sign(target.position.x - this.state.position.x);
      const moveY = Math.sign(target.position.y - this.state.position.y);

      this.moveTo({ x: this.state.position.x + moveX, y: this.state.position.y + moveY }, GLOBAL_MECHANICS.seekCost);
      return;
    }

    if (Math.random() < randomMoveChance) {
      const randomDir = [1, -1, 0];
      const rx = randomDir[Math.floor(Math.random() * randomDir.length)];
      const ry = randomDir[Math.floor(Math.random() * randomDir.length)];

      if (rx !== 0 || ry !== 0) this.moveTo({ x: this.state.position.x + rx, y: this.state.position.y + ry }, GLOBAL_MECHANICS.seekCost);
    }
  }

  public getEncounterAction(opponent: AgentState): EncounterAction {
    void opponent;
    return "DEFECT";
  }
}
