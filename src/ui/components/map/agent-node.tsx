import { memo } from "react";
import type { AgentType } from "../../../core/types";
import { AGENT_THEME, CELL_SIZE } from "../../constants/theme";

interface AgentNodeProps {
  id: string;
  type: AgentType;
  x: number;
  y: number;
  wealth: number;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export const AgentNode = memo(function AgentNode({
  id,
  type,
  x,
  y,
  wealth,
  isSelected,
  onSelect,
}: AgentNodeProps) {
  const theme = AGENT_THEME[type];
  const px = x * CELL_SIZE;
  const py = y * CELL_SIZE;
  const wealthPercent = Math.min(100, Math.max(8, (wealth / 30) * 100));
  const Icon = theme.Icon;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(id);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.stopPropagation();
          onSelect(id);
        }
      }}
      className={`absolute cursor-pointer select-none ${
        isSelected ? "z-30" : "z-[25] hover:brightness-110"
      }`}
      style={{
        transform: `translate3d(${px}px, ${py}px, 0)${isSelected ? " scale(1.18)" : ""}`,
        width: CELL_SIZE,
        height: CELL_SIZE,
        willChange: "transform",
      }}
    >
      <div className="mb-0.5 h-1.5 w-full overflow-hidden rounded-full border border-zinc-700/60 bg-zinc-900">
        <div
          className={`h-full transition-[width] duration-150 ${
            wealth < 4 ? "bg-red-500" : "bg-emerald-400"
          }`}
          style={{ width: `${wealthPercent}%` }}
        />
      </div>

      <div
        className={`flex h-[calc(100%-8px)] w-full items-center justify-center rounded-lg border bg-zinc-950/95 ${
          isSelected ? "ring-2 ring-white/90" : ""
        }`}
        style={{
          borderColor: theme.color,
          boxShadow: `0 0 14px ${theme.color}55`,
        }}
      >
        <Icon className="h-4 w-4" style={{ color: theme.color }} strokeWidth={2.4} />
      </div>
    </div>
  );
});
