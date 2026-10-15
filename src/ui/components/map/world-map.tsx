import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Minus, Move, Plus } from "lucide-react";
import { useGameStore } from "../../../store/useGameStore";
import { CELL_SIZE } from "../../constants/theme";
import { useBumpTicks } from "../../hooks/useFloatingEvents";
import { AgentNode } from "./agent-node";
import { FloatingEventsLayer } from "./floating-events-layer";
import { ResourceNode } from "./resource-node";

const ZOOM_STEP = 1.28;
const MAX_ZOOM_MULT = 4;

function coverScale(viewW: number, viewH: number, mapW: number, mapH: number) {
  if (viewW <= 0 || viewH <= 0 || mapW <= 0 || mapH <= 0) return 1;
  return Math.max(viewW / mapW, viewH / mapH);
}

function clampOffset(
  offset: { x: number; y: number },
  scale: number,
  viewW: number,
  viewH: number,
  mapW: number,
  mapH: number,
) {
  const scaledW = mapW * scale;
  const scaledH = mapH * scale;

  // Keep the board covering the viewport — no empty gutters around the map.
  const minX = Math.min(0, viewW - scaledW);
  const maxX = Math.max(0, viewW - scaledW);
  const minY = Math.min(0, viewH - scaledH);
  const maxY = Math.max(0, viewH - scaledH);

  return {
    x: Math.min(maxX, Math.max(minX, offset.x)),
    y: Math.min(maxY, Math.max(minY, offset.y)),
  };
}

export function WorldMap() {
  const boardWidth = useGameStore((s) => s.gameState?.boardWidth ?? 100);
  const boardHeight = useGameStore((s) => s.gameState?.boardHeight ?? 70);
  const agents = useGameStore((s) => s.gameState?.agents);
  const resources = useGameStore((s) => s.gameState?.resources);
  const selectedAgentId = useGameStore((s) => s.selectedAgentId);
  const selectAgent = useGameStore((s) => s.selectAgent);
  const bumpTicks = useBumpTicks();

  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [minScale, setMinScale] = useState(1);
  const [viewSize, setViewSize] = useState({ w: 0, h: 0 });
  const [smoothZoom, setSmoothZoom] = useState(true);

  const isDragging = useRef(false);
  const didDrag = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const viewportRef = useRef<HTMLDivElement>(null);
  const scaleRef = useRef(scale);
  const offsetRef = useRef(offset);

  useEffect(() => {
    scaleRef.current = scale;
    offsetRef.current = offset;
  }, [scale, offset]);

  const mapWidth = boardWidth * CELL_SIZE;
  const mapHeight = boardHeight * CELL_SIZE;

  const fitToViewport = useCallback(
    (viewW: number, viewH: number, resetZoom: boolean) => {
      const nextMin = coverScale(viewW, viewH, mapWidth, mapHeight);
      setMinScale(nextMin);

      const currentScale = scaleRef.current;
      const nextScale = resetZoom
        ? nextMin
        : Math.max(nextMin, Math.min(nextMin * MAX_ZOOM_MULT, currentScale));

      const nextOffset = clampOffset(
        resetZoom
          ? {
              x: (viewW - mapWidth * nextScale) / 2,
              y: (viewH - mapHeight * nextScale) / 2,
            }
          : offsetRef.current,
        nextScale,
        viewW,
        viewH,
        mapWidth,
        mapHeight,
      );

      setSmoothZoom(false);
      setScale(nextScale);
      setOffset(nextOffset);
      requestAnimationFrame(() => setSmoothZoom(true));
    },
    [mapWidth, mapHeight],
  );

  useLayoutEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    let first = true;
    const apply = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      setViewSize({ w, h });
      fitToViewport(w, h, first);
      first = false;
    };

    apply();

    const observer = new ResizeObserver(apply);
    observer.observe(el);
    return () => observer.disconnect();
  }, [fitToViewport]);

  const zoomTowardCenter = useCallback(
    (direction: 1 | -1) => {
      const viewW = viewSize.w;
      const viewH = viewSize.h;
      if (viewW <= 0 || viewH <= 0) return;

      const current = scaleRef.current;
      const maxScale = minScale * MAX_ZOOM_MULT;
      const nextScale = Math.min(
        maxScale,
        Math.max(minScale, direction === 1 ? current * ZOOM_STEP : current / ZOOM_STEP),
      );

      if (Math.abs(nextScale - current) < 0.001) return;

      const cx = viewW / 2;
      const cy = viewH / 2;
      const ratio = nextScale / current;
      const currentOffset = offsetRef.current;
      const nextOffset = clampOffset(
        {
          x: cx - (cx - currentOffset.x) * ratio,
          y: cy - (cy - currentOffset.y) * ratio,
        },
        nextScale,
        viewW,
        viewH,
        mapWidth,
        mapHeight,
      );

      setSmoothZoom(true);
      setScale(nextScale);
      setOffset(nextOffset);
    },
    [viewSize, minScale, mapWidth, mapHeight],
  );

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    isDragging.current = true;
    didDrag.current = false;
    setSmoothZoom(false);
    dragStart.current = { x: e.clientX - offset.x, y: e.clientY - offset.y };
  };

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging.current) return;
      didDrag.current = true;
      const next = clampOffset(
        {
          x: e.clientX - dragStart.current.x,
          y: e.clientY - dragStart.current.y,
        },
        scaleRef.current,
        viewSize.w,
        viewSize.h,
        mapWidth,
        mapHeight,
      );
      setOffset(next);
    },
    [viewSize, mapWidth, mapHeight],
  );

  const handleMouseUp = () => {
    isDragging.current = false;
    setSmoothZoom(true);
  };

  const handleBackgroundClick = () => {
    if (didDrag.current) return;
    selectAgent(null);
  };

  // Block trackpad/mouse-wheel zoom — zoom is button-only.
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const blockWheel = (e: WheelEvent) => e.preventDefault();
    el.addEventListener("wheel", blockWheel, { passive: false });
    return () => el.removeEventListener("wheel", blockWheel);
  }, []);

  if (!agents || !resources) {
    return (
      <div className="game-backdrop flex h-full w-full items-center justify-center font-semibold text-slate-400">
        Map not loaded…
      </div>
    );
  }

  const zoomPercent = Math.round((scale / Math.max(minScale, 0.0001)) * 100);

  return (
    <div
      ref={viewportRef}
      className="game-backdrop relative h-full w-full cursor-grab select-none overflow-hidden active:cursor-grabbing"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onClick={handleBackgroundClick}
    >
      <div
        className={`absolute origin-top-left ${
          smoothZoom ? "transition-transform duration-300 ease-out" : ""
        }`}
        style={{
          transform: `translate3d(${offset.x}px, ${offset.y}px, 0) scale(${scale})`,
          width: mapWidth,
          height: mapHeight,
        }}
      >
        <div
          className="blueprint-grid absolute inset-0 rounded-3xl"
          style={{ backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px` }}
        />

        {resources.map((res) => (
          <ResourceNode
            key={res.id}
            id={res.id}
            x={res.position.x}
            y={res.position.y}
            value={res.value}
          />
        ))}

        {agents.map((agent) =>
          agent.isDead ? null : (
            <AgentNode
              key={agent.id}
              id={agent.id}
              type={agent.type}
              x={agent.position.x}
              y={agent.position.y}
              wealth={agent.wealth}
              isSelected={agent.id === selectedAgentId}
              bumpTick={bumpTicks.get(agent.id)}
              onSelect={selectAgent}
            />
          ),
        )}

        <FloatingEventsLayer />
      </div>

      <div className="absolute bottom-4 left-4 z-40 flex items-center gap-2">
        <div className="glass-panel pointer-events-none flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold text-slate-300">
          <Move className="h-3.5 w-3.5" />
          Drag to pan
        </div>

        <div className="glass-panel flex items-center gap-1 rounded-full p-1 shadow-lg shadow-black/30">
          <button
            type="button"
            aria-label="Zoom out"
            onClick={(e) => {
              e.stopPropagation();
              zoomTowardCenter(-1);
            }}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-slate-300 transition duration-200 hover:bg-white/10 hover:text-white active:scale-90"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="min-w-12 text-center text-xs font-bold text-slate-300 tabular-nums">
            {zoomPercent}%
          </span>
          <button
            type="button"
            aria-label="Zoom in"
            onClick={(e) => {
              e.stopPropagation();
              zoomTowardCenter(1);
            }}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-slate-300 transition duration-200 hover:bg-white/10 hover:text-white active:scale-90"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
