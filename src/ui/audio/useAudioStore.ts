import type { Howl } from "howler";
import { create } from "zustand";
import { AGENT_TYPES, type AgentType } from "../../core/types";
import { HYPE_PATH, WORLD_PATH } from "../onboarding/steps";

export type BgmId = AgentType | "hype" | "intro";

export const BGM_VOLUME = 0.6;
export const FADE_MS = 450;

export interface SoundControls {
  play: () => void;
  stop: () => void;
  sound: Howl | null;
}

interface AudioState {
  activeBgm: BgmId | null;
  desired: BgmId | null;
  beds: Partial<Record<BgmId, SoundControls>>;
  impact: SoundControls | null;
  registerBed: (id: BgmId, controls: SoundControls) => void;
  registerImpact: (controls: SoundControls) => void;
  crossfadeTo: (id: BgmId) => void;
  fadeOut: () => void;
  cutAll: () => void;
  playImpact: () => void;
}

function fadeOutBed(controls: SoundControls | undefined): void {
  if (!controls) return;
  const howl = controls.sound;
  if (!howl || !howl.playing()) {
    controls.stop();
    return;
  }
  howl.off("fade");
  const from = howl.volume() || BGM_VOLUME;
  howl.fade(from, 0, FADE_MS);
  howl.once("fade", () => {
    howl.stop();
    howl.volume(from);
  });
}

function playBed(controls: SoundControls): void {
  const howl = controls.sound;
  if (howl) {
    howl.off("fade");
    howl.volume(BGM_VOLUME);
  }
  controls.play();
}

export function bgmForPath(pathname: string): BgmId | null {
  const match = /^\/onboarding\/archetypes\/([^/]+)$/.exec(pathname);
  if (match && (AGENT_TYPES as readonly string[]).includes(match[1])) {
    return match[1] as AgentType;
  }
  if (pathname === "/" || pathname === "/onboarding/environment") return "intro";
  if (pathname === HYPE_PATH || pathname === WORLD_PATH) return "hype";
  return null;
}

/** Start, crossfade, or fade the bed for a route. Safe to call from a click. */
export function syncBgm(pathname: string): void {
  const id = bgmForPath(pathname);
  const store = useAudioStore.getState();
  if (id) store.crossfadeTo(id);
  else store.fadeOut();
}

export const useAudioStore = create<AudioState>((set, get) => ({
  activeBgm: null,
  desired: null,
  beds: {},
  impact: null,

  registerBed: (id, controls) => {
    set((state) => ({ beds: { ...state.beds, [id]: controls } }));
    const { desired, activeBgm } = get();
    if (desired !== id) return;
    if (activeBgm === id && controls.sound?.playing()) return;
    get().crossfadeTo(id);
  },

  registerImpact: (controls) => set({ impact: controls }),

  crossfadeTo: (id) => {
    const { activeBgm, beds } = get();
    const next = beds[id];
    if (activeBgm === id && next?.sound?.playing()) {
      set({ desired: id });
      return;
    }
    set({ desired: id });
    if (!next) return;
    if (activeBgm && activeBgm !== id) fadeOutBed(beds[activeBgm]);
    playBed(next);
    set({ activeBgm: id });
  },

  fadeOut: () => {
    const { activeBgm, beds } = get();
    if (activeBgm) fadeOutBed(beds[activeBgm]);
    set({ activeBgm: null, desired: null });
  },

  cutAll: () => {
    const { beds } = get();
    for (const controls of Object.values(beds)) {
      if (!controls) continue;
      controls.sound?.off("fade");
      controls.stop();
    }
    set({ activeBgm: null, desired: null });
  },

  playImpact: () => {
    const { impact } = get();
    if (!impact) return;
    impact.stop();
    impact.play();
  },
}));
