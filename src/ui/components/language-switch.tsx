import { useLangStore } from "../../i18n/useLangStore";
import type { Lang } from "../../i18n/types";

const OPTIONS: readonly { id: Lang; label: string }[] = [
  { id: "en", label: "EN" },
  { id: "fa", label: "فا" },
];

export function LanguageSwitch({ tone = "dark" }: { tone?: "dark" | "glass" }) {
  const lang = useLangStore((state) => state.lang);
  const setLang = useLangStore((state) => state.setLang);
  const shell =
    tone === "glass"
      ? "border-white/10 bg-white/5"
      : "border-white/15 bg-black/30";

  return (
    <div
      role="group"
      aria-label={lang === "fa" ? "زبان" : "Language"}
      className={`flex items-center rounded-full border p-0.5 text-[11px] font-semibold tracking-wide ${shell}`}
    >
      {OPTIONS.map((option) => {
        const active = lang === option.id;
        return (
          <button
            key={option.id}
            type="button"
            aria-pressed={active}
            onClick={() => setLang(option.id)}
            className={`cursor-pointer rounded-full px-2.5 py-1 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#CA8A04] ${
              active ? "bg-[#CA8A04] text-[#0C0A09]" : "text-zinc-300 hover:text-white"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
