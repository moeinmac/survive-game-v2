import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";
import { JOURNEY } from "../onboarding/steps";

const STORAGE_KEY = "survive.onboarding.v1";

interface StoredProgress {
  furthestIndex: number;
}

function clampIndex(index: number): number {
  if (!Number.isFinite(index)) return 0;
  return Math.max(0, Math.min(JOURNEY.length - 1, Math.floor(index)));
}

export function readOnboardingIndex(): number {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return 0;
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || !("furthestIndex" in parsed)) return 0;
    const index = (parsed as StoredProgress).furthestIndex;
    return typeof index === "number" ? clampIndex(index) : 0;
  } catch {
    return 0;
  }
}

function writeFurthest(furthestIndex: number): void {
  const payload: StoredProgress = { furthestIndex };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

interface OnboardingProgressValue {
  furthestIndex: number;
  /** Raise the saved chapter. Never moves backward. */
  reach: (index: number) => void;
}

const OnboardingProgressContext = createContext<OnboardingProgressValue | null>(null);

export function OnboardingProgressProvider({ children }: { children: ReactNode }) {
  const [furthestIndex, setFurthestIndex] = useState(readOnboardingIndex);
  const furthestRef = useRef(furthestIndex);

  const reach = useCallback((index: number) => {
    const next = Math.max(furthestRef.current, clampIndex(index));
    furthestRef.current = next;
    writeFurthest(next);
    setFurthestIndex(next);
  }, []);

  const value = useMemo(() => ({ furthestIndex, reach }), [furthestIndex, reach]);

  return (
    <OnboardingProgressContext.Provider value={value}>{children}</OnboardingProgressContext.Provider>
  );
}

export function useOnboardingProgress(): OnboardingProgressValue {
  const value = useContext(OnboardingProgressContext);
  if (!value) {
    throw new Error("useOnboardingProgress must be used within OnboardingProgressProvider");
  }
  return value;
}
