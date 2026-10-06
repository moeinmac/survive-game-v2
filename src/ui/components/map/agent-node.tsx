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
        isSelected ? "z-30" : "z-10 hover:brightness-110"
      }`}
      style={{
        transform: `translate3d(${px}px, ${py}px, 0)${isSelected ? " scale(1.15)" : ""}`,
        width: CELL_SIZE,
        height: CELL_SIZE,
        willChange: "transform",
      }}
    >
      <div className="mb-0.5 h-1 w-full overflow-hidden rounded-full border border-zinc-700/50 bg-zinc-800">
        <div
          className={`h-full transition-[width] duration-150 ${
            wealth < 4 ? "bg-red-500" : "bg-emerald-400"
          }`}
          style={{ width: `${wealthPercent}%` }}
        />
      </div>

      <div
        className={`flex h-[calc(100%-6px)] w-full items-center justify-center rounded-md border bg-zinc-900/90 shadow-md ${
          isSelected ? "ring-2 ring-white/80" : ""
        }`}
        style={{
          borderColor: theme.color,
          boxShadow: `0 0 10px ${theme.color}40`,
        }}
      >
        <Icon className="h-3.5 w-3.5" style={{ color: theme.color }} strokeWidth={2.25} />
      </div>
    </div>
  );
});
