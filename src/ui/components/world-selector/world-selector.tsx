import { useRef, useState } from "react";
import {
  Building2,
  HeartHandshake,
  Play,
  Swords,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import type { AgentType } from "../../../core/types";
import { AGENT_TYPES } from "../../../core/types";
import {
  DEFAULT_BOARD_HEIGHT,
  DEFAULT_BOARD_WIDTH,
  useGameStore,
  type AgentCounts,
} from "../../../store/useGameStore";
import { AGENT_THEME } from "../../constants/theme";
import {
  allocatePopulation,
  POPULATION_DEFAULT,
  POPULATION_MAX,
  POPULATION_MIN,
  POPULATION_STEP,
  rankedShares,
  WORLD_PRESETS,
  type WorldPreset,
  type WorldPresetId,
} from "../../data/world-presets";

const AGENT_SHORT_LABEL: Record<AgentType, string> = {
  HARDWORKER_COPYCAT: "HardWorker",
  CONTENTED_ALTRUIST: "Contented",
  TALENTED_GRUDGER: "Grudger",
  OPTIMIZER_DETECTIVE: "Optimizer",
  ARISTOCRAT_VIP: "VIP",
  ROBBER_OPPORTUNIST: "Robber",
};

const WORLD_ICONS: Record<WorldPresetId, LucideIcon> = {
  gotham: Building2,
  cutthroat: TrendingUp,
  welfare: HeartHandshake,
  "class-war": Swords,
};

export interface WorldSelectorProps {
  onInitialize?: (counts: AgentCounts, preset: WorldPreset, population: number) => void;
}

export function WorldSelector({ onInitialize }: WorldSelectorProps) {
  const initGame = useGameStore((state) => state.initGame);
  const togglePlay = useGameStore((state) => state.togglePlay);
  const reduceMotion = useReducedMotion();

  const [selectedId, setSelectedId] = useState<WorldPresetId>("gotham");
  const [population, setPopulation] = useState(POPULATION_DEFAULT);
  const cardRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const selected = WORLD_PRESETS.find((preset) => preset.id === selectedId) ?? WORLD_PRESETS[0];
  const counts = allocatePopulation(selected.distribution, population);

  const startWorld = () => {
    if (onInitialize) {
      onInitialize(counts, selected, population);
      return;
    }
    initGame(DEFAULT_BOARD_WIDTH, DEFAULT_BOARD_HEIGHT, counts);
    togglePlay();
  };

  const moveSelection = (fromIndex: number, direction: 1 | -1) => {
    const next = (fromIndex + direction + WORLD_PRESETS.length) % WORLD_PRESETS.length;
    setSelectedId(WORLD_PRESETS[next].id);
    cardRefs.current[next]?.focus();
  };

  const populationRatio = (population - POPULATION_MIN) / (POPULATION_MAX - POPULATION_MIN);

  return (
    <div className="relative flex h-dvh flex-col overflow-hidden bg-zinc-950 text-zinc-100">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div
          className="absolute -top-40 left-1/2 h-[560px] w-[880px] -translate-x-1/2 rounded-full opacity-25 blur-3xl transition-colors duration-300"
          style={{ backgroundColor: selected.accent }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.05),transparent_55%)]" />
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
            maskImage: "radial-gradient(ellipse at center, black 20%, transparent 75%)",
          }}
        />
      </div>

      <div className="relative min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <header className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-xl">
              <p className="font-mono text-[11px] font-medium tracking-[0.28em] text-zinc-500 uppercase">
                New simulation
              </p>
              <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-zinc-50 sm:text-5xl">
                Choose a world
              </h1>
              <p className="mt-3 text-base leading-relaxed text-zinc-300">
                Four opening societies. The mix of strategies decides who eats, who hoards, and who gets robbed.
              </p>
            </div>
            <AgentLegend />
          </header>

          <div
            role="radiogroup"
            aria-label="World presets"
            className="mt-6 grid grid-cols-1 gap-4 pb-3 md:grid-cols-2"
          >
            {WORLD_PRESETS.map((preset, index) => (
              <WorldCard
                key={preset.id}
                preset={preset}
                index={index}
                selected={preset.id === selected.id}
                counts={allocatePopulation(preset.distribution, population)}
                reduceMotion={Boolean(reduceMotion)}
                buttonRef={(node) => {
                  cardRefs.current[index] = node;
                }}
                onSelect={() => setSelectedId(preset.id)}
                onKeyNavigate={(direction) => moveSelection(index, direction)}
              />
            ))}
          </div>
        </div>
      </div>

      <footer className="relative z-20 shrink-0 border-t border-white/10 bg-zinc-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:px-8">
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline justify-between gap-3">
              <label htmlFor="world-population" className="text-sm font-semibold text-zinc-100">
                Total population
              </label>
              <p className="font-mono text-sm text-zinc-400" aria-live="polite">
                <span className="text-2xl font-medium text-zinc-50 tabular-nums">{population}</span>
                <span className="ml-2 hidden sm:inline">into {selected.name}</span>
              </p>
            </div>
            <input
              id="world-population"
              type="range"
              min={POPULATION_MIN}
              max={POPULATION_MAX}
              step={POPULATION_STEP}
              value={population}
              onChange={(event) => setPopulation(Number(event.target.value))}
              aria-valuemin={POPULATION_MIN}
              aria-valuemax={POPULATION_MAX}
              aria-valuenow={population}
              aria-label="Total population"
              className="mt-3 h-1.5 w-full cursor-pointer appearance-none rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-zinc-100 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-zinc-50 [&::-webkit-slider-thumb]:shadow-[0_0_12px_rgba(255,255,255,0.55)] [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-zinc-50"
              style={{
                background: `linear-gradient(to right, ${selected.accent} 0%, ${selected.accent} ${populationRatio * 100}%, rgb(39 39 42) ${populationRatio * 100}%, rgb(39 39 42) 100%)`,
              }}
            />
            <div className="mt-1.5 flex justify-between font-mono text-[11px] text-zinc-500">
              <span>{POPULATION_MIN}</span>
              <span className="sm:hidden">{selected.name}</span>
              <span>{POPULATION_MAX}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={startWorld}
            className="inline-flex h-12 w-full shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full px-6 text-sm font-extrabold tracking-wide text-zinc-950 transition duration-200 hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-100 active:scale-[0.98] lg:w-auto"
            style={{
              backgroundColor: selected.accent,
              boxShadow: `0 0 28px ${selected.accent}66`,
            }}
          >
            <Play className="h-4 w-4 fill-current" aria-hidden />
            Initialize World
          </button>
        </div>
      </footer>
    </div>
  );
}

function AgentLegend() {
  return (
    <ul className="flex max-w-md flex-wrap gap-2" aria-label="Agent types">
      {AGENT_TYPES.map((type) => {
        const theme = AGENT_THEME[type];
        const Icon = theme.Icon;
        return (
          <li
            key={type}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-semibold text-zinc-200"
          >
            <Icon className="h-3.5 w-3.5" style={{ color: theme.color }} aria-hidden />
            {AGENT_SHORT_LABEL[type]}
          </li>
        );
      })}
    </ul>
  );
}

function WorldCard({
  preset,
  index,
  selected,
  counts,
  reduceMotion,
  buttonRef,
  onSelect,
  onKeyNavigate,
}: {
  preset: WorldPreset;
  index: number;
  selected: boolean;
  counts: AgentCounts;
  reduceMotion: boolean;
  buttonRef: (node: HTMLButtonElement | null) => void;
  onSelect: () => void;
  onKeyNavigate: (direction: 1 | -1) => void;
}) {
  const Icon = WORLD_ICONS[preset.id];
  const shares = rankedShares(preset.distribution);
  const leader = shares[0];
  const code = String(index + 1).padStart(2, "0");

  return (
    <motion.button
      ref={buttonRef}
      type="button"
      role="radio"
      aria-checked={selected}
      tabIndex={selected ? 0 : -1}
      onClick={onSelect}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight" || event.key === "ArrowDown") {
          event.preventDefault();
          onKeyNavigate(1);
        } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
          event.preventDefault();
          onKeyNavigate(-1);
        }
      }}
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: "easeOut", delay: reduceMotion ? 0 : index * 0.05 }}
      className={`group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border bg-zinc-900/55 p-4 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl transition duration-200 hover:z-10 hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-100 ${
        selected ? "border-transparent" : "border-white/10 hover:border-white/25"
      }`}
      style={
        selected
          ? {
              borderColor: preset.accent,
              boxShadow: `inset 0 1px 0 rgba(255,255,255,0.08), 0 0 0 1px ${preset.accent}, 0 0 36px ${preset.accent}44`,
            }
          : undefined
      }
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-24 opacity-80"
        aria-hidden
        style={{
          background: `linear-gradient(180deg, ${preset.accent}33, transparent)`,
        }}
      />

      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[11px] font-medium tracking-[0.22em] text-zinc-400 uppercase">
            {code} · {preset.epithet}
          </p>
          <h2 className="mt-1.5 text-2xl font-extrabold tracking-tight text-zinc-50">{preset.name}</h2>
        </div>
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-zinc-950/50"
          style={{ color: preset.accent }}
        >
          <Icon className="h-5 w-5" aria-hidden />
        </span>
      </div>

      <p className="relative mt-3 text-sm leading-relaxed text-zinc-300">{preset.description}</p>

      <div className="relative mt-auto pt-4">
        <div className="mb-2 flex items-center justify-between gap-2">
          <p className="text-[10px] font-semibold tracking-[0.18em] text-zinc-500 uppercase">
            Population
          </p>
          {leader ? (
            <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-200">
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: AGENT_THEME[leader.type].color }}
                aria-hidden
              />
              Led by {AGENT_SHORT_LABEL[leader.type]}
            </p>
          ) : null}
        </div>

        <div
          className="flex h-2.5 w-full overflow-hidden rounded-full bg-zinc-800"
          role="img"
          aria-label={shares
            .map((share) => `${AGENT_SHORT_LABEL[share.type]} ${share.percent}%`)
            .join(", ")}
        >
          {shares.map((share) => (
            <div
              key={share.type}
              className="h-full"
              style={{
                width: `${share.percent}%`,
                backgroundColor: AGENT_THEME[share.type].color,
              }}
              title={`${AGENT_THEME[share.type].label}: ${share.percent}%`}
            />
          ))}
        </div>

        <ul className="mt-3 flex flex-wrap gap-1.5">
          {shares.map((share) => {
            const theme = AGENT_THEME[share.type];
            const Icon = theme.Icon;
            return (
              <li
                key={share.type}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-zinc-950/60 px-2 py-1 text-[11px] font-semibold text-zinc-200"
              >
                <Icon className="h-3 w-3" style={{ color: theme.color }} aria-hidden />
                <span>{AGENT_SHORT_LABEL[share.type]}</span>
                <span className="font-mono text-zinc-400 tabular-nums">
                  {share.percent}% · {counts[share.type]}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </motion.button>
  );
}
