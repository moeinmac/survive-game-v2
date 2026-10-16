import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import { useCopy } from "../../../i18n/useLangStore";
import { useGameStore } from "../../../store/useGameStore";
import { WORLD_PATH } from "../../onboarding/steps";

export const CREATION_MS = 2000;

export function WorldCreationLoader() {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion() ?? false;
  const copy = useCopy();
  const hasGame = useGameStore((state) => state.gameState !== null);

  useEffect(() => {
    if (!hasGame) return;
    const timer = window.setTimeout(() => {
      const { isRunning, togglePlay } = useGameStore.getState();
      if (!isRunning) togglePlay();
      navigate("/play", { replace: true });
    }, CREATION_MS);
    return () => window.clearTimeout(timer);
  }, [hasGame, navigate]);

  if (!hasGame) return <Navigate to={WORLD_PATH} replace />;

  return (
    <div className="relative flex h-dvh items-center justify-center overflow-hidden bg-[#07080d] font-editorial text-zinc-100">
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(202,138,4,0.32) 1px, transparent 1px), linear-gradient(to bottom, rgba(202,138,4,0.32) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage: "radial-gradient(ellipse at center, black 10%, transparent 68%)",
        }}
        initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.15 }}
        animate={reduceMotion ? { opacity: 0.85 } : { opacity: 1, scale: 1.5 }}
        transition={{ duration: CREATION_MS / 1000, ease: [0.22, 1, 0.36, 1] }}
      />

      <motion.div
        aria-hidden
        className="pointer-events-none absolute h-56 w-56 rounded-full bg-[#CA8A04]/45 blur-3xl"
        initial={{ scale: 0.2, opacity: 0.15 }}
        animate={reduceMotion ? { opacity: 0.7, scale: 1 } : { scale: 2.4, opacity: 0.9 }}
        transition={{ duration: CREATION_MS / 1000, ease: "easeOut" }}
      />

      <motion.div
        aria-hidden
        className="pointer-events-none absolute start-0 end-0 h-px bg-gradient-to-r from-transparent via-white to-transparent shadow-[0_0_18px_rgba(255,255,255,0.8)]"
        initial={{ top: "0%", opacity: 0.8 }}
        animate={reduceMotion ? { opacity: [0.3, 0.8, 0.3] } : { top: ["0%", "100%"] }}
        transition={{ duration: CREATION_MS / 1000, ease: "linear" }}
      />

      <p
        role="status"
        aria-live="polite"
        className="relative z-10 px-6 text-center font-display text-3xl font-medium tracking-tight text-zinc-50 sm:text-5xl"
      >
        {copy.creating.status}
      </p>
    </div>
  );
}
