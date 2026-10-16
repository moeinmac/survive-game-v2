import type { AgentType, EncounterAction, GameEventKind, Season } from "../core/types";
import type { WorldChoiceId } from "../ui/data/world-presets";

export type Lang = "en" | "fa";

export interface StoryBeat {
  title: string;
  body: string;
}

export interface ArchetypeCopy {
  /** Full name shown on the archetype chapter. */
  name: string;
  epithet: string;
  /** Compact name in the hero roster. */
  roster: string;
  /** Name used in the simulation chrome. */
  label: string;
  /** Chip label where space is tight. */
  short: string;
  body: string;
  beats: readonly StoryBeat[];
}

export interface WorldCopy {
  name: string;
  epithet: string;
  description: string;
}

export interface Dictionary {
  brand: string;
  hero: {
    navLabel: string;
    kicker: string;
    title: string;
    titleEmphasis: string;
    lead: string;
    start: string;
    continue: string;
  };
  onboarding: {
    navLabel: string;
    chapters: string;
    previous: string;
    next: string;
    chooseWorld: string;
    chapterOf: (current: number, total: number) => string;
    chapterAria: (index: number) => string;
  };
  environment: {
    kicker: string;
    title: string;
    lead: string;
    panels: readonly { kicker: string; title: string; body: string }[];
  };
  archetypes: Record<AgentType, ArchetypeCopy>;
  personOf: (index: number, total: number, epithet: string) => string;
  worlds: {
    kicker: string;
    title: string;
    lead: string;
    presetsAria: string;
    population: string;
    totalPopulation: string;
    initialize: string;
    agentTypes: string;
    populationLabel: string;
    noAgentsYet: string;
    balancedMix: string;
    noAgents: string;
    eachStrategy: string;
    intoWorld: (name: string) => string;
    ledBy: (name: string) => string;
    shareAria: (parts: string) => string;
    removeOne: (label: string) => string;
    addOne: (label: string) => string;
    countOf: (label: string) => string;
    choices: Record<WorldChoiceId, WorldCopy>;
  };
  hud: {
    pause: string;
    start: string;
    tick: string;
    trust: string;
    population: string;
    cookies: string;
    settings: string;
    analytics: string;
    seasons: Record<Season, string>;
  };
  map: {
    dragToPan: string;
    zoomIn: string;
    zoomOut: string;
  };
  settings: {
    title: string;
    subtitle: string;
    close: string;
    season: string;
    countPerType: string;
    total: (count: number) => string;
    scatter: (count: number) => string;
    apply: string;
  };
  analytics: {
    title: string;
    subtitle: string;
    close: string;
    noneAlive: string;
    populationLeader: string;
    wealthLeader: string;
    leaderJoin: string;
    wealthShareOf: (percent: string, total: string) => string;
    livingPopulation: string;
    wealthShare: string;
  };
  log: {
    title: string;
    subtitle: string;
    close: string;
    empty: string;
    kinds: Record<GameEventKind, string>;
  };
  inspect: {
    close: string;
    stats: string;
    wealth: string;
    metabolism: string;
    burden: string;
    gossip: string;
    noEncounters: string;
    me: (action: string) => string;
    them: (action: string) => string;
    actions: Record<EncounterAction, string>;
  };
  language: string;
}
