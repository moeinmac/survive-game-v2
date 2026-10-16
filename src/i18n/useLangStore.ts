import { create } from "zustand";
import { persist } from "zustand/middleware";
import { en } from "./en";
import { fa } from "./fa";
import type { Dictionary, Lang } from "./types";

const STORAGE_KEY = "survive-lang";

const dictionaries: Record<Lang, Dictionary> = { en, fa };

function readStoredLang(): Lang {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return "en";
    const parsed = JSON.parse(raw) as { state?: { lang?: Lang } };
    return parsed.state?.lang === "fa" ? "fa" : "en";
  } catch {
    return "en";
  }
}

function directionFor(lang: Lang): "rtl" | "ltr" {
  if (lang !== "fa") return "ltr";
  // The play board is laid out left-to-right. Persian only changes the labels.
  if (window.location.pathname === "/play") return "ltr";
  return "rtl";
}

export function applyLang(lang: Lang): void {
  const root = document.documentElement;
  root.lang = lang;
  root.dir = directionFor(lang);
}

interface LangState {
  lang: Lang;
  setLang: (lang: Lang) => void;
}

const initialLang = readStoredLang();
applyLang(initialLang);

export const useLangStore = create<LangState>()(
  persist(
    (set) => ({
      lang: initialLang,
      setLang: (lang) => {
        applyLang(lang);
        set({ lang });
      },
    }),
    {
      name: STORAGE_KEY,
      onRehydrateStorage: () => (state) => {
        if (state) applyLang(state.lang);
      },
    },
  ),
);

export function useCopy(): Dictionary {
  const lang = useLangStore((state) => state.lang);
  return dictionaries[lang];
}
