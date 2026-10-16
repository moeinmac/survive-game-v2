import { useEffect } from "react";
import type { Howl } from "howler";
import { useLocation } from "react-router-dom";
import useSound from "use-sound";
import { AGENT_TYPES, type AgentType } from "../../core/types";
import { SOUND_SRC } from "./sources";
import { BGM_VOLUME, syncBgm, useAudioStore, type BgmId } from "./useAudioStore";

function Bed({ id, src }: { id: BgmId; src: string }) {
  const [play, { stop, sound }] = useSound(src, {
    loop: true,
    volume: BGM_VOLUME,
    interrupt: true,
  });
  const registerBed = useAudioStore((state) => state.registerBed);

  useEffect(() => {
    registerBed(id, { play, stop, sound: sound as Howl | null });
  }, [id, play, stop, sound, registerBed]);

  return null;
}

function Impact() {
  const [play, { stop, sound }] = useSound(SOUND_SRC.initImpact, {
    volume: 1,
    interrupt: true,
  });
  const registerImpact = useAudioStore((state) => state.registerImpact);

  useEffect(() => {
    registerImpact({ play, stop, sound: sound as Howl | null });
  }, [play, stop, sound, registerImpact]);

  return null;
}

/** Mounted once above the routes so a bed can outlive the screen that started it. */
export function AudioEngine() {
  const { pathname } = useLocation();

  useEffect(() => {
    syncBgm(pathname);
  }, [pathname]);

  return (
    <>
      {AGENT_TYPES.map((id: AgentType) => (
        <Bed key={id} id={id} src={SOUND_SRC.agents[id]} />
      ))}
      <Bed id="hype" src={SOUND_SRC.hype} />
      <Bed id="intro" src={SOUND_SRC.intro} />
      <Impact />
    </>
  );
}
