import { useEffect, useRef, useState, type CSSProperties, type RefObject } from "react";
import { X } from "lucide-react";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "motion/react";
import { AGENT_THEME } from "../../constants/theme";
import { ARCHETYPES, type ArchetypeProfile } from "../../data/archetypes";

const PHILOSOPHY_LEAD = "This is not just a game; it's a reflection of us.";
const PHILOSOPHY_BODY =
  "We built a world where resources are scarce and survival depends on interaction. Will kindness prevail, or will greed consume everything? Here, every handshake is a risk, and every betrayal has a ripple effect. Watch as trust builds civilizations or tears them apart.";

const REVEAL = {
  duration: 0.7,
  ease: "easeOut" as const,
};

export interface LandingPageProps {
  onEnter: () => void;
}

export function LandingPage({ onEnter }: LandingPageProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const scrollerRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [activeId, setActiveId] = useState<string | null>(null);

  const active = ARCHETYPES.find((profile) => profile.id === activeId) ?? null;

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller || !active) return;
    const previous = scroller.style.overflow;
    scroller.style.overflow = "hidden";
    scroller.inert = true;
    return () => {
      scroller.style.overflow = previous;
      scroller.inert = false;
    };
  }, [active]);

  useEffect(() => {
    if (!active) return;
    const trigger = triggerRefs.current[active.id];
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveId(null);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      trigger?.focus();
    };
  }, [active]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });
  };

  return (
    <div className="relative h-dvh bg-[#07080d] font-editorial text-zinc-100">
      <Atmosphere reduceMotion={reduceMotion} />

      <LayoutGroup>
        <div ref={scrollerRef} className="relative h-full overflow-y-auto">
          <ExhibitionNav onEnter={onEnter} onJump={scrollTo} />

          <main>
            <Hero onEnter={onEnter} reduceMotion={reduceMotion} />
            <Philosophy reduceMotion={reduceMotion} />
            <ArchetypeGrid
              activeId={activeId}
              reduceMotion={reduceMotion}
              triggerRefs={triggerRefs}
              onOpen={setActiveId}
            />
            <Closing onEnter={onEnter} reduceMotion={reduceMotion} />
          </main>
        </div>
        <AnimatePresence>
          {active ? (
            <ProfileOverlay
              key={active.id}
              profile={active}
              reduceMotion={reduceMotion}
              closeRef={closeRef}
              onClose={() => setActiveId(null)}
            />
          ) : null}
        </AnimatePresence>
      </LayoutGroup>
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

function ExhibitionNav({
  onEnter,
  onJump,
}: {
  onEnter: () => void;
  onJump: (id: string) => void;
}) {
  return (
    <div className="sticky top-0 z-30 px-4 pt-4 sm:px-6">
      <nav
        aria-label="Exhibition"
        className="mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-full border border-white/10 bg-black/45 px-4 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl"
      >
        <p className="shrink-0 font-display text-sm tracking-wide whitespace-nowrap text-zinc-100 sm:text-base">
          The Mirror
        </p>
        <div className="flex items-center gap-1 sm:gap-2">
          <NavLink label="Philosophy" onClick={() => onJump("philosophy")} />
          <NavLink label="Archetypes" onClick={() => onJump("archetypes")} />
          <button
            type="button"
            onClick={onEnter}
            className="cursor-pointer rounded-full bg-[#CA8A04] px-3 py-1.5 text-xs font-semibold tracking-wide text-[#0C0A09] transition-colors duration-200 hover:bg-[#EAB308] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#CA8A04] sm:px-4 sm:text-sm"
          >
            Enter
          </button>
        </div>
      </nav>
    </div>
  );
}

function NavLink({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="cursor-pointer rounded-full px-2.5 py-1.5 text-xs text-zinc-300 transition-colors duration-200 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-100 sm:px-3 sm:text-sm"
    >
      {label}
    </button>
  );
}

function Hero({ onEnter, reduceMotion }: { onEnter: () => void; reduceMotion: boolean }) {
  return (
    <section className="mx-auto -mt-20 flex min-h-dvh max-w-6xl flex-col justify-end px-4 pt-28 pb-16 sm:px-6 sm:pb-24">
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={REVEAL}
      >
        <p className="text-xs font-medium tracking-[0.32em] text-zinc-400 uppercase">
          A sociological exhibition
        </p>
        <h1 className="mt-6 max-w-5xl font-display text-[clamp(3.25rem,9vw,8rem)] leading-[0.9] font-medium tracking-[-0.04em] text-zinc-50">
          The Mirror
          <span className="block italic">of Society</span>
        </h1>
        <p className="mt-8 max-w-xl text-lg leading-relaxed text-zinc-300 sm:text-xl">
          A sociological sandbox. 6 personalities. Limited resources. Who will survive when trust is
          tested?
        </p>
        <div className="mt-10">
          <EnterButton onEnter={onEnter} />
        </div>
        <p className="mt-12 text-sm tracking-wide text-zinc-400">
          {ARCHETYPES.map((profile) => profile.name.replace(/^The /, "")).join("  ·  ")}
        </p>
      </motion.div>
    </section>
  );
}

function Philosophy({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <section id="philosophy" className="scroll-mt-24 border-t border-white/10">
      <motion.div
        className="mx-auto grid max-w-6xl gap-10 px-4 py-24 sm:px-6 lg:grid-cols-12 lg:py-32"
        initial={reduceMotion ? false : { opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={REVEAL}
      >
        <div className="lg:col-span-4">
          <p className="text-xs font-medium tracking-[0.28em] text-zinc-500 uppercase">01</p>
          <h2 className="mt-3 font-display text-4xl leading-tight font-medium text-zinc-50 sm:text-5xl">
            The Philosophy
          </h2>
        </div>
        <div className="lg:col-span-8">
          <p className="font-display text-3xl leading-snug font-medium text-zinc-50 sm:text-5xl sm:leading-tight">
            {PHILOSOPHY_LEAD}
          </p>
          <p className="mt-8 max-w-2xl text-lg leading-8 text-zinc-300">{PHILOSOPHY_BODY}</p>
        </div>
      </motion.div>
    </section>
  );
}

function ArchetypeGrid({
  activeId,
  reduceMotion,
  triggerRefs,
  onOpen,
}: {
  activeId: string | null;
  reduceMotion: boolean;
  triggerRefs: RefObject<Record<string, HTMLButtonElement | null>>;
  onOpen: (id: string) => void;
}) {
  return (
    <section id="archetypes" className="scroll-mt-24 border-t border-white/10">
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:py-32">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={REVEAL}
        >
          <p className="text-xs font-medium tracking-[0.28em] text-zinc-500 uppercase">
            02 · The Society Encyclopedia
          </p>
          <h2 className="mt-3 max-w-xl font-display text-4xl leading-tight font-medium text-zinc-50 sm:text-5xl">
            The Society
          </h2>
          <p className="mt-4 max-w-lg text-lg leading-relaxed text-zinc-300">
            Six personalities. Choose one, and read how they meet other people.
          </p>
        </motion.div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {ARCHETYPES.map((profile, index) => (
            <ArchetypeCard
              key={profile.id}
              profile={profile}
              index={index}
              hiddenPortrait={activeId === profile.id}
              reduceMotion={reduceMotion}
              buttonRef={(node) => {
                triggerRefs.current[profile.id] = node;
              }}
              onOpen={() => onOpen(profile.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ArchetypeCard({
  profile,
  index,
  hiddenPortrait,
  reduceMotion,
  buttonRef,
  onOpen,
}: {
  profile: ArchetypeProfile;
  index: number;
  hiddenPortrait: boolean;
  reduceMotion: boolean;
  buttonRef: (node: HTMLButtonElement | null) => void;
  onOpen: () => void;
}) {
  const color = AGENT_THEME[profile.id].color;
  const code = String(index + 1).padStart(2, "0");

  return (
    <motion.button
      ref={buttonRef}
      type="button"
      onClick={onOpen}
      aria-haspopup="dialog"
      aria-expanded={hiddenPortrait}
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ ...REVEAL, delay: reduceMotion ? 0 : (index % 3) * 0.06 }}
      style={{ "--glow": `${color}66` } as CSSProperties}
      className="group flex cursor-pointer flex-col rounded-3xl border border-white/10 bg-white/[0.06] p-3 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl transition-[border-color,box-shadow] duration-200 hover:border-white/30 hover:shadow-[0_0_42px_var(--glow)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-100"
    >
      <div className="relative h-64 w-full">
        {hiddenPortrait ? (
          <div className="h-full w-full rounded-xl bg-zinc-900" aria-hidden />
        ) : (
          <Portrait
            layoutId={reduceMotion ? undefined : `portrait-${profile.id}`}
            color={color}
            illustration={profile.illustration}
            reduceMotion={reduceMotion}
            className="h-64"
          />
        )}
      </div>
      <div className="flex flex-1 flex-col px-2 pt-4 pb-2">
        <p className="text-[11px] font-medium tracking-[0.22em] text-zinc-500 uppercase">
          {code} · {profile.epithet}
        </p>
        <h3 className="mt-2 font-display text-3xl leading-none font-medium text-zinc-50">
          {profile.name}
        </h3>
        <span className="mt-5 text-xs font-medium tracking-[0.2em] text-zinc-400 uppercase transition-colors duration-200 group-hover:text-zinc-100">
          Open profile
        </span>
      </div>
    </motion.button>
  );
}

function Portrait({
  layoutId,
  color,
  illustration,
  reduceMotion,
  className,
}: {
  layoutId?: string;
  color: string;
  illustration?: string;
  reduceMotion: boolean;
  className: string;
}) {
  return (
    <motion.div
      layoutId={layoutId}
      className={`flex w-full items-center justify-center overflow-hidden rounded-xl bg-zinc-800 text-center text-xs font-medium tracking-[0.2em] text-zinc-400 uppercase ${className}`}
      style={{
        backgroundImage: `radial-gradient(ellipse at 50% 18%, ${color}66, transparent 58%)`,
      }}
      transition={
        reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 260, damping: 32 }
      }
    >
      {illustration ? (
        <img
          src={illustration}
          alt=""
          className="h-full w-full object-contain p-6"
        />
      ) : (
        "Illustration Placeholder"
      )}
    </motion.div>
  );
}

function ProfileOverlay({
  profile,
  reduceMotion,
  closeRef,
  onClose,
}: {
  profile: ArchetypeProfile;
  reduceMotion: boolean;
  closeRef: RefObject<HTMLButtonElement | null>;
  onClose: () => void;
}) {
  const color = AGENT_THEME[profile.id].color;

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-labelledby="archetype-profile-title"
      className="fixed inset-0 z-50 flex items-end justify-center p-3 sm:items-center sm:p-6"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 1 }}
    >
      <motion.div
        aria-hidden
        className="absolute inset-0 cursor-pointer bg-black/75 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.25 }}
        onClick={onClose}
      />
      <div className="relative grid max-h-[min(880px,calc(100dvh-1.5rem))] w-full max-w-5xl overflow-y-auto rounded-3xl border border-white/15 bg-zinc-950/85 shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl lg:grid-cols-2 lg:overflow-hidden">
        <Portrait
          layoutId={reduceMotion ? undefined : `portrait-${profile.id}`}
          color={color}
          illustration={profile.illustration}
          reduceMotion={reduceMotion}
          className="h-72 lg:h-full lg:min-h-[36rem]"
        />
        <div className="flex flex-col px-5 py-6 sm:px-8 sm:py-8">
          <div className="flex items-start justify-between gap-4">
            <p className="text-xs font-medium tracking-[0.24em] text-zinc-400 uppercase">
              {profile.epithet}
            </p>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 text-xs font-medium tracking-wide text-zinc-200 transition-colors duration-200 hover:border-white/40 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-100"
            >
              <X className="h-3.5 w-3.5" aria-hidden />
              Close
            </button>
          </div>
          <h2
            id="archetype-profile-title"
            className="mt-6 font-display text-4xl leading-none font-medium text-zinc-50 sm:text-5xl"
          >
            {profile.name}
          </h2>
          <div
            className="mt-6 h-px w-16"
            style={{ backgroundColor: color }}
            aria-hidden
          />
          <p className="mt-6 text-base leading-8 text-zinc-300 sm:text-lg">{profile.body}</p>
        </div>
      </div>
    </motion.div>
  );
}

function Closing({ onEnter, reduceMotion }: { onEnter: () => void; reduceMotion: boolean }) {
  return (
    <section className="border-t border-white/10">
      <motion.div
        className="mx-auto flex max-w-6xl flex-col items-start px-4 py-24 sm:px-6 lg:py-32"
        initial={reduceMotion ? false : { opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={REVEAL}
      >
        <p className="text-xs font-medium tracking-[0.28em] text-zinc-500 uppercase">03</p>
        <h2 className="mt-3 max-w-3xl font-display text-5xl leading-[0.95] font-medium tracking-[-0.03em] text-zinc-50 sm:text-7xl">
          Step inside the mirror.
        </h2>
        <p className="mt-6 max-w-md text-lg leading-relaxed text-zinc-300">
          Six personalities. One closed world. See who remains when trust runs out.
        </p>
        <div className="mt-10">
          <EnterButton onEnter={onEnter} />
        </div>
      </motion.div>
    </section>
  );
}

function EnterButton({ onEnter }: { onEnter: () => void }) {
  return (
    <button
      type="button"
      onClick={onEnter}
      className="cursor-pointer rounded-full bg-[#CA8A04] px-8 py-4 text-sm font-semibold tracking-wide text-[#0C0A09] shadow-[0_0_40px_rgba(202,138,4,0.45)] transition-colors duration-200 hover:bg-[#EAB308] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#CA8A04]"
    >
      Enter the Simulation
    </button>
  );
}
