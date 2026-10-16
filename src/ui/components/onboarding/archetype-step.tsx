import type { AgentType } from "../../../core/types";
import { useCopy } from "../../../i18n/useLangStore";
import { AGENT_THEME } from "../../constants/theme";
import { ARCHETYPES } from "../../data/archetypes";

export function ArchetypeStep({ agentId }: { agentId: AgentType }) {
  const copy = useCopy();
  const profile = ARCHETYPES.find((entry) => entry.id === agentId);
  if (!profile) return null;

  const text = copy.archetypes[profile.id];
  const color = AGENT_THEME[profile.id].color;
  const agentNumber = ARCHETYPES.findIndex((entry) => entry.id === agentId) + 1;

  return (
    <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
      <div
        className="flex h-[min(18rem,36svh)] items-center justify-center overflow-hidden rounded-3xl border border-white/10 lg:h-[32rem]"
        style={{
          backgroundImage: `radial-gradient(ellipse at 50% 18%, ${color}66, transparent 58%)`,
          backgroundColor: "#27272a",
        }}
      >
        {profile.illustration ? (
          <img
            src={profile.illustration}
            alt={text.name}
            className="h-full w-full object-contain p-6 sm:p-8"
          />
        ) : null}
      </div>

      <div>
        <p className="kicker text-xs font-medium text-zinc-400">
          {copy.personOf(agentNumber, ARCHETYPES.length, text.epithet)}
        </p>
        <h1 className="mt-4 font-display text-5xl leading-none font-medium text-zinc-50 sm:text-6xl">
          {text.name}
        </h1>
        <div className="mt-6 h-px w-16" style={{ backgroundColor: color }} aria-hidden />
        <p className="mt-6 text-base leading-8 text-zinc-300 sm:text-lg">{text.body}</p>

        <ol className="mt-8 space-y-6">
          {text.beats.map((beat, beatIndex) => (
            <li key={beat.title}>
              <p className="text-[11px] font-medium text-zinc-400" style={{ color }}>
                {String(beatIndex + 1).padStart(2, "0")}
              </p>
              <h2 className="mt-1 font-display text-2xl font-medium text-zinc-50">{beat.title}</h2>
              <p className="mt-2 text-base leading-7 text-zinc-300">{beat.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
