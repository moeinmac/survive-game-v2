import { ARCHETYPES } from "../data/archetypes";

export const HERO_STEP_ID = "hero";
export const ENVIRONMENT_STEP_ID = "environment";
export const WORLD_STEP_ID = "world";

export interface JourneyStep {
  id: string;
  path: string;
}

/** Hero, the world, six agents, then the world picker. */
export const JOURNEY: readonly JourneyStep[] = [
  { id: HERO_STEP_ID, path: "/" },
  { id: ENVIRONMENT_STEP_ID, path: "/onboarding/environment" },
  ...ARCHETYPES.map((profile) => ({
    id: profile.id,
    path: `/onboarding/archetypes/${profile.id}`,
  })),
  { id: WORLD_STEP_ID, path: "/world-selection" },
];

/** Hero through the last agent. World selection comes after these chapters. */
export const NARRATIVE_CHAPTER_COUNT = JOURNEY.findIndex((step) => step.id === WORLD_STEP_ID);

export function journeyIndexForPath(pathname: string): number {
  return JOURNEY.findIndex((step) => step.path === pathname);
}

export function journeyIndexForId(id: string): number {
  return JOURNEY.findIndex((step) => step.id === id);
}
