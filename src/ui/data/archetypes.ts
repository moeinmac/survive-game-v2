import type { AgentType } from "../../core/types";

export interface ArchetypeProfile {
  id: AgentType;
  name: string;
  epithet: string;
  body: string;
  /** Public URL under `/public`, e.g. `/assets/optimizer.svg`. */
  illustration?: string;
}

export const ARCHETYPES: readonly ArchetypeProfile[] = [
  {
    id: "HARDWORKER_COPYCAT",
    name: "The Hard Worker",
    epithet: "Copycat",
    body: "We all know that one colleague who gives 100% and starts every relationship with pure good intentions. They are fair and treat you exactly how you treat them. If you help them, they are your best friend. But if you betray them once? They will never let you step on them again. They are the backbone of a healthy society.",
    illustration: "/assets/hard-worker.svg",
  },
  {
    id: "CONTENTED_ALTRUIST",
    name: "The Contented",
    epithet: "Altruist",
    body: "Think of that incredibly kind soul in your life who is always giving and never asking for anything in return. They are happy with the little they have and never chase luxury. Sadly, in a harsh world, they are often taken advantage of. They miss out on opportunities because their heart is too pure for a ruthless market.",
    illustration: "/assets/contented.svg",
  },
  {
    id: "TALENTED_GRUDGER",
    name: "The Talented",
    epithet: "Grudger",
    body: "You probably know a brilliant, highly intelligent perfectionist who refuses to settle for less. They have incredibly high standards. They will welcome you warmly, but their pride is fragile. Make one mistake, betray them just once, and they will cut you out of their life forever. They hold grudges until the end of time.",
    illustration: "/assets/talented.svg",
  },
  {
    id: "OPTIMIZER_DETECTIVE",
    name: "The Optimizer",
    epithet: "Detective",
    body: "The purely logical friend who measures the ROI (Return on Investment) of every relationship. They don't act on emotion; they test you. They will push your boundaries just to see how you react. If you show strength, they respect you and cooperate. If you show weakness, they will use you as a stepping stone to climb higher.",
    illustration: "/assets/optimizer.svg",
  },
  {
    id: "ARISTOCRAT_VIP",
    name: "The Aristocrat",
    epithet: "Rich Kid VIP",
    body: "Born on third base but acting like they hit a triple. We’ve all seen people who inherited their wealth or status and never had to work a day in their lives. They don't mingle with the regular crowd; they just live in their exclusive bubbles, collecting rent and watching the world struggle from their penthouses.",
    illustration: "/assets/aristocrat.svg",
  },
  {
    id: "ROBBER_OPPORTUNIST",
    name: "The Robber",
    epithet: "Opportunist",
    body: "Thieves are rarely born evil; they are often products of a broken system. Desperation and harsh environments push them to take what isn't theirs just to survive. However, once survival is guaranteed, desperation can easily turn into greed, making them hunt the wealthiest targets. They are the chaotic symptom of inequality.",
    illustration: "/assets/robber.svg",
  },
];
