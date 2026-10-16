import { useLayoutEffect } from "react";
import { Navigate, Route, Routes, useNavigate, useParams } from "react-router-dom";
import type { AgentType } from "./core/types";
import { useGameStore } from "./store/useGameStore";
import { AudioEngine } from "./ui/audio/AudioEngine";
import { syncBgm } from "./ui/audio/useAudioStore";
import GameDashboard from "./ui/components/dashboard/game-dashboard";
import { LandingPage } from "./ui/components/landing/landing-page";
import { ArchetypeStep } from "./ui/components/onboarding/archetype-step";
import { EnvironmentStep } from "./ui/components/onboarding/environment-step";
import { HypeScreen } from "./ui/components/onboarding/hype-screen";
import { OnboardingGate, OnboardingShell } from "./ui/components/onboarding/onboarding-shell";
import { WorldCreationLoader } from "./ui/components/onboarding/world-creation-loader";
import { WorldSelector } from "./ui/components/world-selector/world-selector";
import { ARCHETYPES } from "./ui/data/archetypes";
import { applyLang, useLangStore } from "./i18n/useLangStore";
import { readOnboardingIndex, useOnboardingProgress, OnboardingProgressProvider } from "./ui/hooks/useOnboardingProgress";
import {
  CREATING_PATH,
  ENVIRONMENT_STEP_ID,
  HYPE_PATH,
  HYPE_STEP_ID,
  JOURNEY,
  journeyIndexForId,
} from "./ui/onboarding/steps";

function HeroRoute() {
  const navigate = useNavigate();
  const { furthestIndex, reach } = useOnboardingProgress();
  const savedIndex = Math.max(furthestIndex, readOnboardingIndex());
  const environmentIndex = journeyIndexForId(ENVIRONMENT_STEP_ID);
  const hypeIndex = journeyIndexForId(HYPE_STEP_ID);
  const continueIndex = savedIndex >= hypeIndex ? hypeIndex : savedIndex;

  return (
    <LandingPage
      showContinue={savedIndex > 0}
      onStart={() => {
        reach(environmentIndex);
        syncBgm(JOURNEY[environmentIndex].path);
        navigate(JOURNEY[environmentIndex].path);
      }}
      onContinue={() => {
        syncBgm(JOURNEY[continueIndex].path);
        navigate(JOURNEY[continueIndex].path);
      }}
    />
  );
}

function ArchetypeRoute() {
  const { id = "" } = useParams();
  const { furthestIndex } = useOnboardingProgress();
  const profile = ARCHETYPES.find((entry) => entry.id === id);
  if (!profile) {
    return <Navigate to={JOURNEY[furthestIndex].path} replace />;
  }

  return (
    <OnboardingGate index={journeyIndexForId(profile.id)}>
      <ArchetypeStep agentId={profile.id as AgentType} />
    </OnboardingGate>
  );
}

function WorldRoute() {
  return (
    <OnboardingGate index={journeyIndexForId("world")}>
      <WorldSelector />
    </OnboardingGate>
  );
}

function HypeRoute() {
  return (
    <OnboardingGate index={journeyIndexForId(HYPE_STEP_ID)}>
      <HypeScreen />
    </OnboardingGate>
  );
}

function PlayRoute() {
  const hasGame = useGameStore((state) => state.gameState !== null);

  useLayoutEffect(() => {
    applyLang(useLangStore.getState().lang);
    return () => applyLang(useLangStore.getState().lang);
  }, []);

  if (!hasGame) return <Navigate to="/world-selection" replace />;
  return <GameDashboard />;
}

function App() {
  return (
    <OnboardingProgressProvider>
      <AudioEngine />
      <Routes>
        <Route path="/" element={<HeroRoute />} />
        <Route element={<OnboardingShell />}>
          <Route
            path="/onboarding/environment"
            element={
              <OnboardingGate index={journeyIndexForId(ENVIRONMENT_STEP_ID)}>
                <EnvironmentStep />
              </OnboardingGate>
            }
          />
          <Route path="/onboarding/archetypes/:id" element={<ArchetypeRoute />} />
        </Route>
        <Route path={HYPE_PATH} element={<HypeRoute />} />
        <Route path="/world-selection" element={<WorldRoute />} />
        <Route path={CREATING_PATH} element={<WorldCreationLoader />} />
        <Route path="/play" element={<PlayRoute />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </OnboardingProgressProvider>
  );
}

export default App;
