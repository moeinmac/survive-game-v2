import { useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import { useCopy } from "../../../i18n/useLangStore";
import { syncBgm } from "../../audio/useAudioStore";
import { useOnboardingProgress } from "../../hooks/useOnboardingProgress";
import {
  HYPE_STEP_ID,
  JOURNEY,
  WORLD_PATH,
  WORLD_STEP_ID,
  journeyIndexForId,
} from "../../onboarding/steps";
import { LanguageSwitch } from "../language-switch";

const EASE = [0.22, 1, 0.36, 1] as const;

export function HypeScreen() {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion() ?? false;
  const copy = useCopy();
  const { reach } = useOnboardingProgress();
  const hypeIndex = journeyIndexForId(HYPE_STEP_ID);
  const previous = JOURNEY[hypeIndex - 1];
  const worldIndex = journeyIndexForId(WORLD_STEP_ID);

  const goWorld = () => {
    reach(worldIndex);
    syncBgm(WORLD_PATH);
    navigate(WORLD_PATH);
  };

  const goBack = () => {
    if (!previous) return;
    syncBgm(previous.path);
    navigate(previous.path);
  };

  const reveal = (index: number) => ({
    initial: reduceMotion ? { opacity: 0 } : { opacity: 0, y: 28 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: reduceMotion ? 0.2 : 0.75,
      delay: reduceMotion ? 0 : 0.12 + index * 0.22,
      ease: EASE,
    },
  });

  return (
    <div className="relative flex h-dvh flex-col overflow-hidden bg-[#07080d] font-editorial text-zinc-100">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-[36rem] w-[36rem] rounded-full bg-[#CA8A04]/20 blur-3xl" />
        </div>
        <div className="absolute -top-24 start-[12%] h-80 w-80 rounded-full bg-[#7C6CFF]/20 blur-3xl" />
        <div className="absolute bottom-0 end-[8%] h-72 w-72 rounded-full bg-[#F60609]/10 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.14]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(to bottom, rgba(255,255,255,0.45) 0px, rgba(255,255,255,0.45) 1px, transparent 1px, transparent 4px)",
          }}
        />
        <motion.div
          className="absolute start-0 end-0 h-px bg-gradient-to-r from-transparent via-[#CA8A04] to-transparent shadow-[0_0_24px_#CA8A04]"
          initial={{ top: "18%", opacity: 0.4 }}
          animate={
            reduceMotion
              ? { opacity: [0.25, 0.7, 0.25] }
              : { top: ["14%", "82%"], opacity: [0.2, 0.9, 0.2] }
          }
          transition={
            reduceMotion
              ? { duration: 2.8, repeat: Infinity, ease: "easeInOut" }
              : { duration: 4.2, repeat: Infinity, ease: "easeInOut" }
          }
        />
      </div>

      <header className="relative z-10 flex items-center justify-between gap-3 px-4 pt-4 sm:px-6">
        <p className="kicker text-xs text-[#EAB308]">{copy.hype.kicker}</p>
        <LanguageSwitch />
      </header>

      <main className="relative z-10 flex min-h-0 flex-1 flex-col items-center justify-center px-6 text-center">
        <motion.h1
          {...reveal(0)}
          className="max-w-4xl font-display text-4xl leading-tight font-medium text-zinc-50 sm:text-6xl sm:leading-[1.15]"
        >
          {copy.hype.line1}
        </motion.h1>
        <motion.p
          {...reveal(1)}
          className="mt-6 max-w-2xl text-base leading-8 text-zinc-300 sm:text-lg"
        >
          {copy.hype.line2}
        </motion.p>
      </main>

      <footer className="relative z-10 flex items-center justify-between gap-3 px-4 pb-6 sm:px-6">
        <button
          type="button"
          onClick={goBack}
          className="cursor-pointer rounded-full border border-white/15 px-5 py-3 text-sm font-medium tracking-wide text-zinc-200 transition-colors duration-200 hover:border-white/40 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-100"
        >
          {copy.onboarding.previous}
        </button>
        <motion.button
          {...reveal(2)}
          type="button"
          onClick={goWorld}
          className="cursor-pointer rounded-full bg-[#CA8A04] px-6 py-3 text-sm font-semibold tracking-wide text-[#0C0A09] shadow-[0_0_32px_rgba(202,138,4,0.45)] transition-colors duration-200 hover:bg-[#EAB308] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#CA8A04]"
        >
          {copy.hype.cta}
        </motion.button>
      </footer>
    </div>
  );
}
