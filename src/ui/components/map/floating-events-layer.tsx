import { memo } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useFloatingEvents, type Floater } from "../../hooks/useFloatingEvents";

const FloaterBubble = memo(function FloaterBubble({
  floater,
  reduceMotion,
}: {
  floater: Floater;
  reduceMotion: boolean;
}) {
  return (
    <div
      className="absolute top-0 left-0"
      style={{ transform: `translate3d(${floater.x}px, ${floater.y}px, 0)` }}
    >
      <motion.div
        className={`-translate-x-1/2 -translate-y-full whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] leading-none font-extrabold tabular-nums shadow-lg shadow-black/30 ${floater.tone}`}
        initial={{ opacity: 0, y: 0, scale: 0.6 }}
        animate={{
          opacity: [0, 1, 1, 0],
          y: reduceMotion ? 0 : [0, -14, -26, -36],
          scale: reduceMotion ? 1 : [0.6, 1.1, 1, 1],
          x: floater.shake && !reduceMotion ? [0, -4, 4, -3, 3, 0] : 0,
        }}
        exit={{ opacity: 0, transition: { duration: 0.1 } }}
        transition={{
          duration: 1.1,
          ease: "easeOut",
          times: [0, 0.2, 0.6, 1],
          x: { duration: 0.4, ease: "easeInOut" },
        }}
      >
        {floater.label}
      </motion.div>
    </div>
  );
});

export function FloatingEventsLayer() {
  const floaters = useFloatingEvents();
  const reduceMotion = useReducedMotion() ?? false;

  return (
    <div className="pointer-events-none absolute inset-0 z-40" aria-hidden>
      <AnimatePresence>
        {floaters.map((floater) => (
          <FloaterBubble key={floater.id} floater={floater} reduceMotion={reduceMotion} />
        ))}
      </AnimatePresence>
    </div>
  );
}
