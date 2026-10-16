import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  HeartHandshake,
  Minus,
  Play,
  Plus,
  SlidersHorizontal,
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
import { useCopy } from "../../../i18n/useLangStore";
import { useAudioStore } from "../../audio/useAudioStore";
import { CREATING_PATH } from "../../onboarding/steps";
import { LanguageSwitch } from "../language-switch";
import { AGENT_THEME } from "../../constants/theme";
import {
  allocatePopulation,
  CUSTOM_WORLD,
  CUSTOM_WORLD_ID,
  defaultCustomCounts,
  POPULATION_DEFAULT,
  POPULATION_MAX,
  POPULATION_MIN,
  POPULATION_STEP,
  rankedCountMix,
  rankedShares,
  sumAgentCounts,
  withAgentCount,
  WORLD_PRESETS,
  type WorldChoice,
  type WorldChoiceId,
  type WorldPreset,
} from "../../data/world-presets";

const WORLD_ICONS: Record<WorldChoiceId, LucideIcon> = {
  gotham: Building2,
  cutthroat: TrendingUp,
  welfare: HeartHandshake,
  "class-war": Swords,
  custom: SlidersHorizontal,
};

const CHOICE_IDS: readonly WorldChoiceId[] = [
  ...WORLD_PRESETS.map((preset) => preset.id),
  CUSTOM_WORLD_ID,
];

export interface WorldSelectorProps {
  onInitialize?: (counts: AgentCounts, world: WorldChoice, population: number) => void;
}

export function WorldSelector({ onInitialize }: WorldSelectorProps) {
  const initGame = useGameStore((state) => state.initGame);
  const cutAll = useAudioStore((state) => state.cutAll);
  const playImpact = useAudioStore((state) => state.playImpact);
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const copy = useCopy();

  const [selectedId, setSelectedId] = useState<WorldChoiceId>("gotham");
  const [population, setPopulation] = useState(POPULATION_DEFAULT);
  const [customCounts, setCustomCounts] = useState<AgentCounts>(defaultCustomCounts);
  const [handingOff, setHandingOff] = useState(false);
  const cardRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const isCustom = selectedId === CUSTOM_WORLD_ID;
  const selectedPreset =
    WORLD_PRESETS.find((preset) => preset.id === selectedId) ?? WORLD_PRESETS[0];
  const selected: WorldChoice = isCustom ? CUSTOM_WORLD : selectedPreset;
  const worldText = copy.worlds.choices[selected.id];
  const customTotal = sumAgentCounts(customCounts);
  const counts = isCustom ? customCounts : allocatePopulation(selectedPreset.distribution, population);
  const populationTotal = isCustom ? customTotal : population;
  const canStart = populationTotal > 0;

  const startWorld = () => {
    if (!canStart || handingOff) return;
    if (onInitialize) {
      onInitialize(counts, selected, populationTotal);
      return;
    }
    setHandingOff(true);
    cutAll();
    playImpact();
    initGame(DEFAULT_BOARD_WIDTH, DEFAULT_BOARD_HEIGHT, counts);
    navigate(CREATING_PATH);
  };

  const moveSelection = (fromIndex: number, direction: 1 | -1) => {
    const next = (fromIndex + direction + CHOICE_IDS.length) % CHOICE_IDS.length;
    setSelectedId(CHOICE_IDS[next]);
    cardRefs.current[next]?.focus();
  };

  const setCustomCount = (type: AgentType, raw: number) => {
    setCustomCounts((current) => withAgentCount(current, type, raw));
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
              <div className="flex items-center justify-between gap-3">
                <p className="kicker font-mono text-[11px] font-medium text-zinc-500">
                  {copy.worlds.kicker}
                </p>
                <LanguageSwitch />
              </div>
              <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-zinc-50 sm:text-5xl">
                {copy.worlds.title}
              </h1>
              <p className="mt-3 text-base leading-relaxed text-zinc-300">{copy.worlds.lead}</p>
            </div>
            <AgentLegend />
          </header>

          <div
            role="radiogroup"
            aria-label={copy.worlds.presetsAria}
            className="mt-6 grid grid-cols-1 gap-4 pb-3 md:grid-cols-2"
          >
            {WORLD_PRESETS.map((preset, index) => (
              <WorldCard
                key={preset.id}
                world={preset}
                index={index}
                selected={preset.id === selected.id}
                shares={presetShares(preset, population)}
                reduceMotion={Boolean(reduceMotion)}
                buttonRef={(node) => {
                  cardRefs.current[index] = node;
                }}
                onSelect={() => {
                  setSelectedId(preset.id);
                  cardRefs.current[index]?.scrollIntoView({ block: "nearest" });
                }}
                onKeyNavigate={(direction) => moveSelection(index, direction)}
              />
            ))}
            <WorldCard
              world={CUSTOM_WORLD}
              index={WORLD_PRESETS.length}
              selected={isCustom}
              shares={rankedCountMix(customCounts)}
              wide
              reduceMotion={Boolean(reduceMotion)}
              buttonRef={(node) => {
                cardRefs.current[WORLD_PRESETS.length] = node;
              }}
              onSelect={() => {
                setSelectedId(CUSTOM_WORLD_ID);
                cardRefs.current[WORLD_PRESETS.length]?.scrollIntoView({ block: "nearest" });
              }}
              onKeyNavigate={(direction) => moveSelection(WORLD_PRESETS.length, direction)}
            />
          </div>
        </div>
      </div>

      <footer className="relative z-20 shrink-0 border-t border-white/10 bg-zinc-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:px-6 md:flex-row md:items-end md:px-8">
          {isCustom ? (
            <CustomPopulation
              counts={customCounts}
              total={customTotal}
              accent={selected.accent}
              onChange={setCustomCount}
            />
          ) : (
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-3">
                <label htmlFor="world-population" className="text-sm font-semibold text-zinc-100">
                  {copy.worlds.totalPopulation}
                </label>
                <p className="font-mono text-sm text-zinc-400" aria-live="polite">
                  <span className="text-2xl font-medium text-zinc-50 tabular-nums">{population}</span>
                  <span className="ms-2 hidden sm:inline">{copy.worlds.intoWorld(worldText.name)}</span>
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
                aria-label={copy.worlds.totalPopulation}
                dir="ltr"
                className="mt-3 h-1.5 w-full cursor-pointer appearance-none rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-zinc-100 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-zinc-50 [&::-webkit-slider-thumb]:shadow-[0_0_12px_rgba(255,255,255,0.55)] [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-zinc-50"
                style={{
                  background: `linear-gradient(to right, ${selected.accent} 0%, ${selected.accent} ${populationRatio * 100}%, rgb(39 39 42) ${populationRatio * 100}%, rgb(39 39 42) 100%)`,
                }}
              />
              <div className="mt-1.5 flex justify-between font-mono text-[11px] text-zinc-500">
                <span>{POPULATION_MIN}</span>
                <span className="sm:hidden">{worldText.name}</span>
                <span>{POPULATION_MAX}</span>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={startWorld}
            disabled={!canStart || handingOff}
            className="inline-flex h-12 w-full shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full px-6 text-sm font-extrabold tracking-wide text-zinc-950 transition duration-200 hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-100 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:brightness-100 disabled:active:scale-100 md:w-auto"
            style={{
              backgroundColor: selected.accent,
              boxShadow: canStart ? `0 0 28px ${selected.accent}66` : undefined,
            }}
          >
            <Play className="h-4 w-4 fill-current" aria-hidden />
            {copy.worlds.initialize}
          </button>
        </div>
      </footer>
    </div>
  );
}

function AgentLegend() {
  const copy = useCopy();
  return (
    <ul className="flex max-w-md flex-wrap gap-2" aria-label={copy.worlds.agentTypes}>
      {AGENT_TYPES.map((type) => {
        const theme = AGENT_THEME[type];
        const Icon = theme.Icon;
        return (
          <li
            key={type}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-semibold text-zinc-200"
          >
            <Icon className="h-3.5 w-3.5" style={{ color: theme.color }} aria-hidden />
            {copy.archetypes[type].short}
          </li>
        );
      })}
    </ul>
  );
}

interface MixShare {
  type: AgentType;
  percent: number;
  count: number;
}

function presetShares(preset: WorldPreset, population: number): MixShare[] {
  const counts = allocatePopulation(preset.distribution, population);
  return rankedShares(preset.distribution).map((share) => ({
    type: share.type,
    percent: share.percent,
    count: counts[share.type],
  }));
}

function formatPercent(percent: number): string {
  const nearest = Math.round(percent);
  if (Math.abs(percent - nearest) < 0.05) return `${nearest}`;
  return percent.toFixed(1);
}

function WorldCard({
  world,
  index,
  selected,
  shares,
  wide = false,
  reduceMotion,
  buttonRef,
  onSelect,
  onKeyNavigate,
}: {
  world: WorldChoice;
  index: number;
  selected: boolean;
  shares: readonly MixShare[];
  wide?: boolean;
  reduceMotion: boolean;
  buttonRef: (node: HTMLButtonElement | null) => void;
  onSelect: () => void;
  onKeyNavigate: (direction: 1 | -1) => void;
}) {
  const copy = useCopy();
  const text = copy.worlds.choices[world.id];
  const Icon = WORLD_ICONS[world.id];
  const leader = shares[0];
  const runnerUp = shares[1];
  const uniqueLeader =
    leader != null && (runnerUp == null || leader.percent - runnerUp.percent >= 0.5);
  const balanced =
    leader != null &&
    shares.length > 1 &&
    shares.every((share) => Math.abs(share.percent - leader.percent) < 0.5);
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
      className={`group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border bg-zinc-900/55 p-4 text-start shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl transition duration-200 hover:z-10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-100 ${
        wide ? "md:col-span-2" : "hover:scale-105"
      } ${selected ? "border-transparent" : "border-white/10 hover:border-white/25"}`}
      style={
        selected
          ? {
              borderColor: world.accent,
              boxShadow: `inset 0 1px 0 rgba(255,255,255,0.08), 0 0 0 1px ${world.accent}, 0 0 36px ${world.accent}44`,
            }
          : undefined
      }
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-24 opacity-80"
        aria-hidden
        style={{
          background: `linear-gradient(180deg, ${world.accent}33, transparent)`,
        }}
      />

      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className="kicker font-mono text-[11px] font-medium text-zinc-400">
            {code} · {text.epithet}
          </p>
          <h2 className="mt-1.5 text-2xl font-extrabold tracking-tight text-zinc-50">{text.name}</h2>
        </div>
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-zinc-950/50"
          style={{ color: world.accent }}
        >
          <Icon className="h-5 w-5" aria-hidden />
        </span>
      </div>

      <p className="relative mt-3 text-sm leading-relaxed text-zinc-300">{text.description}</p>

      <div className="relative mt-auto pt-4">
        <div className="mb-2 flex items-center justify-between gap-2">
          <p className="kicker text-[10px] font-semibold text-zinc-500">
            {copy.worlds.populationLabel}
          </p>
          {uniqueLeader && leader ? (
            <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-200">
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: AGENT_THEME[leader.type].color }}
                aria-hidden
              />
              {copy.worlds.ledBy(copy.archetypes[leader.type].short)}
            </p>
          ) : shares.length === 0 || balanced ? (
            <p className="text-xs font-semibold text-zinc-400">
              {shares.length === 0 ? copy.worlds.noAgentsYet : copy.worlds.balancedMix}
            </p>
          ) : null}
        </div>

        <div
          className="flex h-2.5 w-full overflow-hidden rounded-full bg-zinc-800"
          role="img"
          aria-label={
            shares.length === 0
              ? copy.worlds.noAgents
              : copy.worlds.shareAria(
                  shares
                    .map(
                      (share) =>
                        `${copy.archetypes[share.type].short} ${formatPercent(share.percent)}%`,
                    )
                    .join(", "),
                )
          }
        >
          {shares.map((share) => (
            <div
              key={share.type}
              className="h-full"
              style={{
                width: `${share.percent}%`,
                backgroundColor: AGENT_THEME[share.type].color,
              }}
              title={`${copy.archetypes[share.type].label}: ${formatPercent(share.percent)}%`}
            />
          ))}
        </div>

        <ul className="mt-3 flex flex-wrap gap-1.5">
          {shares.map((share) => {
            const theme = AGENT_THEME[share.type];
            const ShareIcon = theme.Icon;
            return (
              <li
                key={share.type}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-zinc-950/60 px-2 py-1 text-[11px] font-semibold text-zinc-200"
              >
                <ShareIcon className="h-3 w-3" style={{ color: theme.color }} aria-hidden />
                <span>{copy.archetypes[share.type].short}</span>
                <span className="font-mono text-zinc-400 tabular-nums">
                  {formatPercent(share.percent)}% · {share.count}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </motion.button>
  );
}

function CustomPopulation({
  counts,
  total,
  accent,
  onChange,
}: {
  counts: AgentCounts;
  total: number;
  accent: string;
  onChange: (type: AgentType, value: number) => void;
}) {
  const atCap = total >= POPULATION_MAX;
  const copy = useCopy();

  return (
    <div className="min-w-0 flex-1">
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-sm font-semibold text-zinc-100">{copy.worlds.eachStrategy}</p>
        <p className="font-mono text-sm text-zinc-400" aria-live="polite">
          <span className="text-2xl font-medium text-zinc-50 tabular-nums">{total}</span>
          <span className="ms-1.5 text-zinc-500">/ {POPULATION_MAX}</span>
        </p>
      </div>
      <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">
        {AGENT_TYPES.map((type) => {
          const theme = AGENT_THEME[type];
          const Icon = theme.Icon;
          const count = counts[type] ?? 0;
          const label = copy.archetypes[type].short;
          return (
            <li
              key={type}
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-zinc-950/50 px-2 py-1.5"
            >
              <Icon className="h-3.5 w-3.5 shrink-0" style={{ color: theme.color }} aria-hidden />
              <span className="min-w-0 flex-1 truncate text-xs font-semibold text-zinc-200">{label}</span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  aria-label={copy.worlds.removeOne(label)}
                  disabled={count <= 0}
                  onClick={() => onChange(type, count - 1)}
                  className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg border border-white/10 text-zinc-200 transition duration-200 hover:border-white/25 hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-100 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <Minus className="h-3.5 w-3.5" aria-hidden />
                </button>
                <input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  max={POPULATION_MAX}
                  value={count}
                  aria-label={copy.worlds.countOf(label)}
                  onChange={(event) => {
                    const parsed = Number.parseInt(event.target.value, 10);
                    onChange(type, Number.isNaN(parsed) ? 0 : parsed);
                  }}
                  className="w-12 [appearance:textfield] rounded-lg border border-white/10 bg-zinc-950 px-1 py-1 text-center font-mono text-xs text-zinc-50 tabular-nums outline-none focus-visible:border-transparent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-100 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  style={{ caretColor: accent }}
                />
                <button
                  type="button"
                  aria-label={copy.worlds.addOne(label)}
                  disabled={atCap}
                  onClick={() => onChange(type, count + 1)}
                  className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg border border-white/10 text-zinc-200 transition duration-200 hover:border-white/25 hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-100 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <Plus className="h-3.5 w-3.5" aria-hidden />
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
