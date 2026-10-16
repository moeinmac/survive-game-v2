import { motion, useReducedMotion } from "motion/react";
import { useCopy } from "../../../i18n/useLangStore";
import { LanguageSwitch } from "../language-switch";
import { ARCHETYPES } from "../../data/archetypes";

const REVEAL = {
  duration: 0.7,
  ease: "easeOut" as const,
};

export interface LandingPageProps {
  onStart: () => void;
  onContinue: () => void;
  showContinue: boolean;
}

export function LandingPage({ onStart, onContinue, showContinue }: LandingPageProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const copy = useCopy();

  return (
    <div className="relative h-dvh overflow-hidden bg-[#07080d] font-editorial text-zinc-100">
      <Atmosphere reduceMotion={reduceMotion} />

      <div className="relative flex h-full flex-col">
        <div className="px-4 pt-4 sm:px-6">
          <nav
            aria-label={copy.hero.navLabel}
            className="mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-full border border-white/10 bg-black/45 px-4 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl"
          >
            <p className="shrink-0 font-display text-sm whitespace-nowrap text-zinc-100 sm:text-base">
              {copy.brand}
            </p>
            <div className="flex items-center gap-2">
              <LanguageSwitch />
              {showContinue ? (
                <button
                  type="button"
                  onClick={onContinue}
                  className="cursor-pointer rounded-full border border-white/15 px-3 py-1.5 text-xs font-medium tracking-wide text-zinc-200 transition-colors duration-200 hover:border-white/40 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-100 sm:px-4 sm:text-sm"
                >
                  {copy.hero.continue}
                </button>
              ) : null}
              <button
                type="button"
                onClick={onStart}
                className="cursor-pointer rounded-full bg-[#CA8A04] px-3 py-1.5 text-xs font-semibold tracking-wide text-[#0C0A09] transition-colors duration-200 hover:bg-[#EAB308] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#CA8A04] sm:px-4 sm:text-sm"
              >
                {copy.hero.start}
              </button>
            </div>
          </nav>
        </div>

        <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-end px-4 pt-16 pb-16 sm:px-6 sm:pb-24">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={REVEAL}
          >
            <p className="kicker text-xs font-medium text-zinc-400">
              {copy.hero.kicker}
            </p>
            <h1 className="mt-6 max-w-5xl font-display text-[clamp(3.25rem,9vw,8rem)] leading-[0.9] font-medium tracking-[-0.04em] text-zinc-50">
              {copy.hero.title}
              <span className="block italic">{copy.hero.titleEmphasis}</span>
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-zinc-300 sm:text-xl">
              {copy.hero.lead}
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onStart}
                className="cursor-pointer rounded-full bg-[#CA8A04] px-8 py-4 text-sm font-semibold tracking-wide text-[#0C0A09] shadow-[0_0_40px_rgba(202,138,4,0.45)] transition-colors duration-200 hover:bg-[#EAB308] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#CA8A04]"
              >
                {copy.hero.start}
              </button>
              {showContinue ? (
                <button
                  type="button"
                  onClick={onContinue}
                  className="cursor-pointer rounded-full border border-white/15 px-8 py-4 text-sm font-medium tracking-wide text-zinc-100 transition-colors duration-200 hover:border-white/40 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-zinc-100"
                >
                  {copy.hero.continue}
                </button>
              ) : null}
            </div>
            <p className="mt-12 text-sm tracking-wide text-zinc-400">
              {ARCHETYPES.map((profile) => copy.archetypes[profile.id].roster).join("  ·  ")}
            </p>
          </motion.div>
        </main>
      </div>
    </div>
  );
}

function Atmosphere({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <motion.div
        className="absolute -top-24 left-[8%] h-[28rem] w-[28rem] rounded-full bg-[#7C6CFF]/25 blur-3xl"
        animate={reduceMotion ? undefined : { x: [0, 36, 0], y: [0, 20, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-[38%] -right-16 h-[26rem] w-[26rem] rounded-full bg-[#18D6C6]/15 blur-3xl"
        animate={reduceMotion ? undefined : { x: [0, -28, 0], y: [0, 32, 0] }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 left-[30%] h-[22rem] w-[22rem] rounded-full bg-[#CA8A04]/10 blur-3xl"
        animate={reduceMotion ? undefined : { y: [0, -24, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.05),transparent_52%)]" />
    </div>
  );
}
