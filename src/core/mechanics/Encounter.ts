import { BaseAgent } from "../entities/BaseAgent";
import type { EncounterRecord, GameState } from "../types";
import { pushGameEvent, shortId } from "./events";

import { ENCOUNTER_PAYOFFS } from "../constants/config";

export class EncounterManager {
  public static resolve(agentA: BaseAgent, agentB: BaseAgent, gameState: GameState): void {
    if (agentA.state.isDead || agentB.state.isDead) return;

    const actionA = agentA.getEncounterAction(agentB.state);
    const actionB = agentB.getEncounterAction(agentA.state);

    let profitA = 0;
    let profitB = 0;

    const idA = shortId(agentA.state.id);
    const idB = shortId(agentB.state.id);

    if (agentA.state.type === "ARISTOCRAT_VIP" && agentB.state.type === "ARISTOCRAT_VIP") {
      profitA = ENCOUNTER_PAYOFFS.vipClubReward;
      profitB = ENCOUNTER_PAYOFFS.vipClubReward;
      pushGameEvent(gameState, "VIP_CLUB", `${idA} and ${idB} collected rent at the VIP club.`, agentA.state.id, agentB.state.id);
    } else if (actionA === "IGNORE" || actionB === "IGNORE") {
    } else if (agentA.state.type === "ROBBER_OPPORTUNIST" || agentB.state.type === "ROBBER_OPPORTUNIST") {
      const isARobber = agentA.state.type === "ROBBER_OPPORTUNIST";
      const robber = isARobber ? agentA : agentB;
      const victim = isARobber ? agentB : agentA;
      const robberId = shortId(robber.state.id);
      const victimId = shortId(victim.state.id);

      const defenseRoll = Math.random() * 100;
      const isSuccessfulRobbery = defenseRoll > victim.state.defense;

      if (isSuccessfulRobbery) {
        const loot = Math.floor(victim.state.wealth / ENCOUNTER_PAYOFFS.robberyLootFraction);
        if (isARobber) {
          profitA = loot;
          profitB = -loot;
        } else {
          profitB = loot;
          profitA = -loot;
        }

        gameState.societalTrust = Math.max(0, gameState.societalTrust + ENCOUNTER_PAYOFFS.robberyTrustPenalty);
        pushGameEvent(gameState, "ROBBERY_SUCCESS", `${robberId} robbed ${victimId} (+${loot}).`, robber.state.id, victim.state.id);
      } else {
        if (isARobber) profitA = -ENCOUNTER_PAYOFFS.robberyFailPenalty;
        else profitB = -ENCOUNTER_PAYOFFS.robberyFailPenalty;

        pushGameEvent(gameState, "ROBBERY_FAIL", `${robberId} failed to rob ${victimId} and got beaten.`, robber.state.id, victim.state.id);
      }
    } else {
      if (actionA === "COOPERATE" && actionB === "COOPERATE") {
        profitA = ENCOUNTER_PAYOFFS.cooperateReward;
        profitB = ENCOUNTER_PAYOFFS.cooperateReward;
        gameState.societalTrust = Math.min(100, gameState.societalTrust + ENCOUNTER_PAYOFFS.trustChangeCC);
        pushGameEvent(gameState, "COOPERATE", `${idA} and ${idB} cooperated.`, agentA.state.id, agentB.state.id);
      } else if (actionA === "DEFECT" && actionB === "COOPERATE") {
        profitA = ENCOUNTER_PAYOFFS.defectWinnerReward;
        profitB = ENCOUNTER_PAYOFFS.defectLoserPenalty;
        gameState.societalTrust = Math.max(0, gameState.societalTrust + ENCOUNTER_PAYOFFS.trustChangeDC);
        pushGameEvent(gameState, "BETRAY", `${idA} betrayed ${idB}.`, agentA.state.id, agentB.state.id);
      } else if (actionA === "COOPERATE" && actionB === "DEFECT") {
        profitA = ENCOUNTER_PAYOFFS.defectLoserPenalty;
        profitB = ENCOUNTER_PAYOFFS.defectWinnerReward;
        gameState.societalTrust = Math.max(0, gameState.societalTrust - 2);
        pushGameEvent(gameState, "BETRAY", `${idB} betrayed ${idA}.`, agentB.state.id, agentA.state.id);
      } else if (actionA === "DEFECT" && actionB === "DEFECT") {
        profitA = ENCOUNTER_PAYOFFS.mutualDefectPenalty;
        profitB = ENCOUNTER_PAYOFFS.mutualDefectPenalty;
        gameState.societalTrust = Math.max(0, gameState.societalTrust + ENCOUNTER_PAYOFFS.trustChangeDD);
        pushGameEvent(gameState, "FIGHT", `${idA} and ${idB} fought.`, agentA.state.id, agentB.state.id);
      }
    }

    agentA.state.wealth += profitA;
    agentB.state.wealth += profitB;

    agentA.memorizeEncounter(gameState.tick, agentB.state.id, actionB, actionA, profitA);
    agentB.memorizeEncounter(gameState.tick, agentA.state.id, actionA, actionB, profitB);

    if (agentA.state.type === "HARDWORKER_COPYCAT" && agentB.state.type === "HARDWORKER_COPYCAT") {
      this.syncWorkerMemories(agentA, agentB);
    }
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
