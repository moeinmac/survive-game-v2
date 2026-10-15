import { useEffect } from "react";
import { useGameStore } from "../../../store/useGameStore";
import { useEngineLoop } from "../../hooks/useEngineLoop";
import { WorldMap } from "../map/world-map";
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
      <div className="game-backdrop flex h-screen w-screen items-center justify-center font-sans font-bold text-slate-300">
        Loading Engine…
      </div>
    );
  }

  return (
    <div className="game-backdrop relative h-screen w-screen overflow-hidden font-sans text-slate-100">
      <WorldMap />
      <GameHud />
      <SettingsPanel />
      <AnalyticsPanel />
      <InspectPanel />
    </div>
  );
}
