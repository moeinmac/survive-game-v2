import { useGameStore } from "../../../store/useGameStore";
import { useEngineLoop } from "../../hooks/useEngineLoop";
import { WorldSelector } from "../world-selector/world-selector";
import { WorldMap } from "../map/world-map";
import { AnalyticsPanel } from "./analytics-panel";
import { GameHud } from "./game-hud";
import { InspectPanel } from "./inspect-panel";
import { SettingsPanel } from "./settings-panel";

export default function GameDashboard() {
  useEngineLoop();

  const hasGame = useGameStore((s) => s.gameState !== null);

  if (!hasGame) {
    return <WorldSelector />;
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
