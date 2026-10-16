import type { AgentType } from "../../core/types";

export interface ArchetypeProfile {
  id: AgentType;
  /** Public URL under `/public`, e.g. `/assets/optimizer.svg`. */
  illustration?: string;
}

export const ARCHETYPES: readonly ArchetypeProfile[] = [
  { id: "HARDWORKER_COPYCAT", illustration: "/assets/hard-worker.svg" },
  { id: "CONTENTED_ALTRUIST", illustration: "/assets/contented.svg" },
  { id: "TALENTED_GRUDGER", illustration: "/assets/talented.svg" },
  { id: "OPTIMIZER_DETECTIVE", illustration: "/assets/optimizer.svg" },
  { id: "ARISTOCRAT_VIP", illustration: "/assets/aristocrat.svg" },
  { id: "ROBBER_OPPORTUNIST", illustration: "/assets/robber.svg" },
];
