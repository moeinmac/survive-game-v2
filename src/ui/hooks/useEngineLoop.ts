import { useEffect, useRef } from "react";
import { useGameStore } from "../../store/useGameStore";

export const useEngineLoop = () => {
  const isRunning = useGameStore((state) => state.isRunning);
  const gameLoopStep = useGameStore((state) => state.gameLoopStep);
  const requestRef = useRef<number>(null);

  useEffect(() => {
    const animate = (timestamp: DOMHighResTimeStamp) => {
      if (isRunning) gameLoopStep(timestamp);
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isRunning, gameLoopStep]);
};
