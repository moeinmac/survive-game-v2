import { BaseAgent } from "../entities/BaseAgent";
import type { EncounterRecord, GameState } from "../types";

export class EncounterManager {
  public static resolve(agentA: BaseAgent, agentB: BaseAgent, gameState: GameState): void {
    if (agentA.state.isDead || agentB.state.isDead) return;

    const actionA = agentA.getEncounterAction(agentB.state);
    const actionB = agentB.getEncounterAction(agentA.state);

    let profitA = 0;
    let profitB = 0;

    if (agentA.state.type === "ARISTOCRAT_VIP" && agentB.state.type === "ARISTOCRAT_VIP") {
      profitA = 5;
      profitB = 5;
    } else if (actionA === "IGNORE" || actionB === "IGNORE") {
      if (agentA.state.type === "ARISTOCRAT_VIP" && actionA === "IGNORE") {
        profitA = 1;
        profitB = -1;
      } else if (agentB.state.type === "ARISTOCRAT_VIP" && actionB === "IGNORE") {
        profitB = 1;
        profitA = -1;
      } else {
        profitA = 0;
        profitB = 0;
      }
    } else if (agentA.state.type === "ROBBER_OPPORTUNIST" || agentB.state.type === "ROBBER_OPPORTUNIST") {
      const isARobber = agentA.state.type === "ROBBER_OPPORTUNIST";

      const victim = isARobber ? agentB : agentA;

      const defenseRoll = Math.random() * 100;
      const isSuccessfulRobbery = defenseRoll > victim.state.defense;

      if (isSuccessfulRobbery) {
        const loot = Math.floor(victim.state.wealth / 2);
        if (isARobber) {
          profitA = loot;
          profitB = -loot;
        } else {
          profitB = loot;
          profitA = -loot;
        }

        gameState.societalTrust = Math.max(0, gameState.societalTrust - 5);
      } else {
        if (isARobber) profitA = -3;
        else profitB = -3;
      }
    } else {
      if (actionA === "COOPERATE" && actionB === "COOPERATE") {
        profitA = 2;
        profitB = 2;
        gameState.societalTrust = Math.min(100, gameState.societalTrust + 1);
      } else if (actionA === "DEFECT" && actionB === "COOPERATE") {
        profitA = 4;
        profitB = -2;
        gameState.societalTrust = Math.max(0, gameState.societalTrust - 2);
      } else if (actionA === "COOPERATE" && actionB === "DEFECT") {
        profitA = -2;
        profitB = 4;
        gameState.societalTrust = Math.max(0, gameState.societalTrust - 2);
      } else if (actionA === "DEFECT" && actionB === "DEFECT") {
        profitA = -1;
        profitB = -1;
        gameState.societalTrust = Math.max(0, gameState.societalTrust - 3);
      }
    }

    agentA.state.wealth += profitA;
    agentB.state.wealth += profitB;

    agentA.memorizeEncounter(gameState.tick, agentB.state.id, actionB, actionA, profitA);
    agentB.memorizeEncounter(gameState.tick, agentA.state.id, actionA, actionB, profitB);

    if (agentA.state.type === "HARDWORKER_COPYCAT" && agentB.state.type === "HARDWORKER_COPYCAT") this.syncWorkerMemories(agentA, agentB);
  }

  private static syncWorkerMemories(agentA: BaseAgent, agentB: BaseAgent): void {
    const gossipA = agentA.state.recentGossip;
    const gossipB = agentB.state.recentGossip;

    gossipB.forEach((record) => {
      if (record.opponentId !== agentA.state.id) EncounterManager.injectGossipIntoMemory(agentA, record);
    });

    gossipA.forEach((record) => {
      if (record.opponentId !== agentB.state.id) EncounterManager.injectGossipIntoMemory(agentB, record);
    });
  }

  private static injectGossipIntoMemory(agent: BaseAgent, record: EncounterRecord): void {
    const targetId = record.opponentId;
    if (!agent.state.memory[targetId]) agent.state.memory[targetId] = [];

    const alreadyKnows = agent.state.memory[targetId].some((r) => r.tick === record.tick);

    if (!alreadyKnows) {
      agent.state.memory[targetId].push(record);
      agent.state.memory[targetId].sort((a, b) => a.tick - b.tick);

      if (agent.state.memory[targetId].length > 5) agent.state.memory[targetId].shift();
    }
  }
}
