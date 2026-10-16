import { useRef, type ReactNode } from "react";
import { Link, Navigate, useLocation, useNavigate, useOutlet } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCopy, useLangStore } from "../../../i18n/useLangStore";
import { syncBgm } from "../../audio/useAudioStore";
import { LanguageSwitch } from "../language-switch";
import { readOnboardingIndex, useOnboardingProgress } from "../../hooks/useOnboardingProgress";
import {
  HERO_STEP_ID,
  JOURNEY,
  NARRATIVE_CHAPTER_COUNT,
  journeyIndexForPath,
} from "../../onboarding/steps";

const REVEAL = { duration: 0.35, ease: "easeOut" as const };

export function OnboardingShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const outlet = useOutlet();
  const reduceMotion = useReducedMotion() ?? false;
  const { furthestIndex, reach } = useOnboardingProgress();
  const copy = useCopy();
  const lang = useLangStore((state) => state.lang);

  const index = journeyIndexForPath(location.pathname);
  const previousIndexRef = useRef(index);
  const directionRef = useRef(1);

  if (index !== previousIndexRef.current && index >= 0) {
    directionRef.current = index > previousIndexRef.current ? 1 : -1;
    previousIndexRef.current = index;
  }

  const direction = directionRef.current;
  const chapter = index >= 0 ? index + 1 : 1;
  const inNarrative = index > 0 && index < NARRATIVE_CHAPTER_COUNT;
  const previous = index > 0 ? JOURNEY[index - 1] : null;
  const next = index >= 0 && index < JOURNEY.length - 1 ? JOURNEY[index + 1] : null;
  const slideAxis = lang === "fa" ? -1 : 1;

  const goPrevious = () => {
    if (!previous) return;
    syncBgm(previous.path);
    if (previous.id === HERO_STEP_ID) {
      navigate("/", { state: { review: true } });
      return;
    }
    navigate(previous.path);
  };

  const goNext = () => {
    if (!next) return;
    reach(index + 1);
    syncBgm(next.path);
    navigate(next.path);
  };

  const jumpTo = (stepIndex: number) => {
    if (stepIndex > furthestIndex || stepIndex === index) return;
    const step = JOURNEY[stepIndex];
    syncBgm(step.path);
    if (step.id === HERO_STEP_ID) {
      navigate("/", { state: { review: true } });
      return;
    }
    navigate(step.path);
  };

  return (
    <div className="relative flex h-dvh flex-col overflow-hidden bg-[#07080d] font-editorial text-zinc-100">
      <Atmosphere reduceMotion={reduceMotion} />

      <div className="relative z-30 shrink-0 px-4 pt-4 sm:px-6">
        <nav
          aria-label={copy.onboarding.navLabel}
          className="mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-full border border-white/10 bg-black/45 px-4 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl"
        >
          <Link
            to="/"
            state={{ review: true }}
            onClick={() => syncBgm("/")}
            className="shrink-0 cursor-pointer font-display text-sm whitespace-nowrap text-zinc-100 transition-colors duration-200 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-100 sm:text-base"
          >
            {copy.brand}
          </Link>
          <div className="flex items-center gap-3">
            {inNarrative ? (
              <p className="kicker text-xs text-zinc-400">
                {copy.onboarding.chapterOf(chapter, NARRATIVE_CHAPTER_COUNT)}
              </p>
            ) : null}
            <LanguageSwitch />
          </div>
        </nav>
      </div>

      <div className="relative min-h-0 flex-1 overflow-y-auto">
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.div
            key={location.pathname}
            custom={direction * slideAxis}
            variants={reduceMotion ? fadeVariants : slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={reduceMotion ? { duration: 0 } : REVEAL}
            className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10"
          >
            {outlet}
          </motion.div>
        </AnimatePresence>
      </div>

      {inNarrative ? (
        <footer className="relative z-30 shrink-0 border-t border-white/10 bg-black/50 backdrop-blur-xl">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:px-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <p className="text-sm tracking-wide text-zinc-300">
                {copy.onboarding.chapterOf(chapter, NARRATIVE_CHAPTER_COUNT)}
              </p>
              <ol className="flex items-center gap-1.5" aria-label={copy.onboarding.chapters}>
                {JOURNEY.slice(0, NARRATIVE_CHAPTER_COUNT).map((step, stepIndex) => {
                  const opened = stepIndex <= furthestIndex;
                  const current = stepIndex === index;
                  return (
                    <li key={step.id}>
                      <button
                        type="button"
                        aria-label={copy.onboarding.chapterAria(stepIndex + 1)}
                        aria-current={current ? "step" : undefined}
                        disabled={!opened || current}
                        onClick={() => jumpTo(stepIndex)}
                        className={`group inline-flex h-8 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#CA8A04] disabled:cursor-default ${
                          current ? "w-8" : "w-6"
                        } ${opened && !current ? "cursor-pointer" : ""}`}
                      >
                        <span
                          className={`h-1.5 rounded-full transition-colors duration-200 ${
                            current
                              ? "w-6 bg-[#CA8A04]"
                              : opened
                                ? "w-1.5 bg-zinc-300 group-hover:bg-white"
                                : "w-1.5 bg-white/20"
                          }`}
                        />
                      </button>
                    </li>
                  );
                })}
              </ol>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={goPrevious}
                className="cursor-pointer rounded-full border border-white/15 px-5 py-3 text-sm font-medium tracking-wide text-zinc-200 transition-colors duration-200 hover:border-white/40 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-100"
              >
                {copy.onboarding.previous}
              </button>
              <button
                type="button"
                onClick={goNext}
                className="cursor-pointer rounded-full bg-[#CA8A04] px-6 py-3 text-sm font-semibold tracking-wide text-[#0C0A09] shadow-[0_0_32px_rgba(202,138,4,0.45)] transition-colors duration-200 hover:bg-[#EAB308] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#CA8A04]"
              >
                {copy.onboarding.next}
              </button>
            </div>
          </div>
        </footer>
      ) : null}
    </div>
  );
}

const slideVariants = {
  enter: (direction: number) => ({ opacity: 0, x: direction * 36 }),
  center: { opacity: 1, x: 0 },
  exit: (direction: number) => ({ opacity: 0, x: direction * -36 }),
};

const fadeVariants = {
  enter: { opacity: 0 },
  center: { opacity: 1 },
  exit: { opacity: 0 },
};

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

export function OnboardingGate({ index, children }: { index: number; children: ReactNode }) {
  const { furthestIndex } = useOnboardingProgress();
  const allowed = Math.max(furthestIndex, readOnboardingIndex());

  if (index > allowed) {
    return <Navigate to={JOURNEY[allowed]?.path ?? "/"} replace />;
  }

  return children;
}
