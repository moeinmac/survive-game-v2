import type { AgentState, EncounterAction, Position } from "../../types";
import { BaseAgent, type WorldContext } from "../BaseAgent";

import { AGENT_BASE_STATS, AGENT_THRESHOLDS, GLOBAL_MECHANICS } from "../../constants/config";

const { baseMetabolism, defense, initialWealth, maxAge, vision } = AGENT_BASE_STATS.SCAVENGER_VULTURE;
const { dyingWealthThreshold, dyingAgeRemaining, randomMoveChance } = AGENT_THRESHOLDS.SCAVENGER_VULTURE;

export class ScavengerVulture extends BaseAgent {
  constructor(id: string, initialPosition: Position) {
    super(id, "SCAVENGER_VULTURE", initialPosition, initialWealth, maxAge, vision, baseMetabolism, defense);
  }

  public act(context: WorldContext): void {
    const dyingAgents = context.visibleAgents.filter((agent) => agent.wealth < dyingWealthThreshold || agent.maxAge - agent.age < dyingAgeRemaining);

    if (dyingAgents.length > 0) {
      let target = dyingAgents[0];
      for (const agent of dyingAgents) if (agent.wealth < target.wealth) target = agent;

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

  public getEncounterAction(opponentState: AgentState): EncounterAction {
    if (opponentState.wealth < 5) return "DEFECT";
    return "IGNORE";
  }
}
