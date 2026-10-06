import { useEffect } from "react";
import { useGameStore } from "../../../store/useGameStore";
import { useEngineLoop } from "../../hooks/useEngineLoop";
import { WorldMap } from "../map/world-map";
import { GameHud } from "./game-hud";
import { InspectPanel } from "./inspect-panel";

export default function GameDashboard() {
  useEngineLoop();

  const initGame = useGameStore((s) => s.initGame);
  const hasGame = useGameStore((s) => s.gameState !== null);

  useEffect(() => {
    // Wide board that fills the viewport; slower, readable population density.
    initGame(100, 70, 280);
  }, [initGame]);

  if (!hasGame) {
    return <div className="flex h-screen w-screen items-center justify-center bg-zinc-950 font-sans text-zinc-300">Loading Engine…</div>;
  }

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-zinc-950 font-sans text-zinc-100">
      <WorldMap />
      <GameHud />
      <InspectPanel />
    </div>
  );
}
