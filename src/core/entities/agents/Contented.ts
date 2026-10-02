import { BaseAgent, type WorldContext } from "../BaseAgent";
import type { AgentState, EncounterAction, Position } from "../../types";

export class ContentedAltruist extends BaseAgent {
  constructor(id: string, initialPosition: Position) {
    super(id, "CONTENTED_ALTRUIST", initialPosition, 10, 100, 2, 0.3, 20);
  }

  public act(context: WorldContext): void {
    const SEEK_COST = 0.25;

    if (context.societalTrust < 30) return;

    if (this.state.wealth > 15) return;

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
        this.moveTo({ x: this.state.position.x + moveX, y: this.state.position.y + moveY }, SEEK_COST);
        return;
      }
    }

    if (context.visibleResources.length > 0) {
      const target = context.visibleResources[0];
      const moveX = Math.sign(target.position.x - this.state.position.x);
      const moveY = Math.sign(target.position.y - this.state.position.y);

      this.moveTo({ x: this.state.position.x + moveX, y: this.state.position.y + moveY }, SEEK_COST);
      return;
    }

    const randomDir = [1, -1, 0];
    const rx = randomDir[Math.floor(Math.random() * randomDir.length)];
    const ry = randomDir[Math.floor(Math.random() * randomDir.length)];
    if (rx !== 0 || ry !== 0) this.moveTo({ x: this.state.position.x + rx, y: this.state.position.y + ry }, SEEK_COST);
  }

  public getEncounterAction(_: AgentState): EncounterAction {
    return "COOPERATE";
  }
}
