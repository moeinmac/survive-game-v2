import { useEffect } from "react";
import { useGameStore } from "../../../store/useGameStore";
import { useEngineLoop } from "../../hooks/useEngineLoop";
import { WorldMap } from "../map/world-map";
import { ActivityLogPanel } from "./activity-log-panel";
import { AnalyticsPanel } from "./analytics-panel";
import { GameHud } from "./game-hud";
import { InspectPanel } from "./inspect-panel";
import { SettingsPanel } from "./settings-panel";

export default function GameDashboard() {
  useEngineLoop();

  const initGame = useGameStore((s) => s.initGame);
  const hasGame = useGameStore((s) => s.gameState !== null);

  useEffect(() => {
    initGame();
  }, [initGame]);

  if (!hasGame) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-zinc-950 font-sans text-zinc-300">
        Loading Engine…
      </div>
    );
  }

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-zinc-950 font-sans text-zinc-100">
      <WorldMap />
      <GameHud />
      <ActivityLogPanel />
      <SettingsPanel />
      <AnalyticsPanel />
      <InspectPanel />
    </div>
  );
}
