import { BaseAgent, type WorldContext } from "../BaseAgent";
import type { AgentState, EncounterAction, Position } from "../../types";

export class ScavengerVulture extends BaseAgent {
  constructor(id: string, initialPosition: Position) {
    super(id, "SCAVENGER_VULTURE", initialPosition, 8, 120, 5, 0.3, 20);
  }

  public act(context: WorldContext): void {
    const SEEK_COST = 0.25;

    const dyingAgents = context.visibleAgents.filter((agent) => agent.wealth < 5 || agent.maxAge - agent.age < 5);

    if (dyingAgents.length > 0) {
      let target = dyingAgents[0];
      for (const agent of dyingAgents) if (agent.wealth < target.wealth) target = agent;

      const moveX = Math.sign(target.position.x - this.state.position.x);
      const moveY = Math.sign(target.position.y - this.state.position.y);

      this.moveTo({ x: this.state.position.x + moveX, y: this.state.position.y + moveY }, SEEK_COST);
      return;
    }

    if (Math.random() < 0.3) {
      const randomDir = [1, -1, 0];
      const rx = randomDir[Math.floor(Math.random() * randomDir.length)];
      const ry = randomDir[Math.floor(Math.random() * randomDir.length)];

      if (rx !== 0 || ry !== 0) this.moveTo({ x: this.state.position.x + rx, y: this.state.position.y + ry }, SEEK_COST);
    }
  }

  public getEncounterAction(opponentState: AgentState): EncounterAction {
    if (opponentState.wealth < 5) return "DEFECT";
    return "IGNORE";
  }
}
