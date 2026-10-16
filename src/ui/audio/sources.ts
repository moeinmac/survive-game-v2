import type { AgentType } from "../../core/types";

export const SOUND_SRC: {
  agents: Record<AgentType, string>;
  hype: string;
  intro: string;
  initImpact: string;
} = {
  agents: {
    HARDWORKER_COPYCAT: "/sounds/hard-worker.mp3",
    CONTENTED_ALTRUIST: "/sounds/contented.mp3",
    TALENTED_GRUDGER: "/sounds/talented.mp3",
    OPTIMIZER_DETECTIVE: "/sounds/optimizer.mp3",
    ARISTOCRAT_VIP: "/sounds/aristocrat.mp3",
    ROBBER_OPPORTUNIST: "/sounds/robber.mp3",
  },
  hype: "/sounds/hype.mp3",
  intro: "/sounds/intro.mp3",
  initImpact: "/sounds/init-impact.mp3",
};
