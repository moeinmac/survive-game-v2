import { useCopy } from "../../../i18n/useLangStore";

export function EnvironmentStep() {
  const story = useCopy().environment;

  return (
    <div>
      <p className="kicker text-xs font-medium text-zinc-400">{story.kicker}</p>
      <h1 className="mt-4 max-w-3xl font-display text-5xl leading-[0.95] font-medium tracking-[-0.03em] text-zinc-50 sm:text-6xl">
        {story.title}
      </h1>
      <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300">{story.lead}</p>

      <div className="mt-12 grid gap-5 lg:grid-cols-3">
        {story.panels.map((panel) => (
          <article
            key={panel.title}
            className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl"
          >
            <p className="kicker text-[11px] font-medium text-zinc-500">{panel.kicker}</p>
            <h2 className="mt-3 font-display text-3xl leading-tight font-medium text-zinc-50">
              {panel.title}
            </h2>
            <p className="mt-4 text-base leading-7 text-zinc-300">{panel.body}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
