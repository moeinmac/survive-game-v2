import { memo, type CSSProperties } from "react";
import type { AgentType } from "../../../core/types";
import { AGENT_THEME, CELL_SIZE, type AgentShape } from "../../constants/theme";

interface AgentNodeProps {
  id: string;
  type: AgentType;
  x: number;
  y: number;
  wealth: number;
  isSelected: boolean;
  bumpTick?: number;
  onSelect: (id: string) => void;
}

const BODY_SIZE = 22;

const SHAPE_STYLE: Record<AgentShape, CSSProperties> = {
  circle: { borderRadius: "9999px" },
  squircle: { borderRadius: "34%" },
  diamond: { borderRadius: "22%", transform: "rotate(45deg) scale(0.86)" },
  hex: { clipPath: "polygon(25% 4%, 75% 4%, 100% 50%, 75% 96%, 25% 96%, 0% 50%)" },
  pill: { borderRadius: "9999px", height: BODY_SIZE * 0.78, marginTop: BODY_SIZE * 0.11 },
  blob: { borderRadius: "62% 38% 54% 46% / 48% 58% 42% 52%" },
};

function wealthBarColor(wealth: number): string {
  if (wealth < 4) return "#fb7185";
  if (wealth < 10) return "#fcd34d";
  return "#4ade80";
}

export const AgentNode = memo(function AgentNode({
  id,
  type,
  x,
  y,
  wealth,
  isSelected,
  bumpTick,
  onSelect,
}: AgentNodeProps) {
  const theme = AGENT_THEME[type];
  const px = x * CELL_SIZE;
  const py = y * CELL_SIZE;
  const wealthPercent = Math.min(100, Math.max(10, (wealth / 30) * 100));
  const isHungry = wealth < 4;
  const eyeSize = isHungry ? 2.5 : 3.5;

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={theme.label}
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
      className={`absolute cursor-pointer select-none ${isSelected ? "z-30" : "z-[25]"}`}
      style={{
        transform: `translate3d(${px}px, ${py}px, 0)`,
        transition: "transform 400ms ease-out",
        width: CELL_SIZE,
        height: CELL_SIZE,
        willChange: "transform",
      }}
    >
      <div
        className={`relative flex h-full w-full flex-col items-center transition-transform duration-200 ease-out ${
          isSelected ? "scale-125" : "hover:scale-110"
        }`}
      >
        <div
          key={bumpTick ?? 0}
          className={`relative mt-0.5 ${bumpTick !== undefined ? "agent-bump" : ""}`}
          style={{ width: BODY_SIZE, height: BODY_SIZE }}
        >
          <div
            className="absolute -bottom-0.5 left-1/2 h-1.5 w-5 -translate-x-1/2 rounded-full bg-black/35"
            aria-hidden
          />

          {isSelected ? (
            <div
              className="absolute -inset-1 rounded-full ring-2 ring-white/90"
              aria-hidden
            />
          ) : null}

          <div
            className="absolute inset-0"
            style={{
              width: BODY_SIZE,
              height: BODY_SIZE,
              backgroundColor: theme.fill,
              ...SHAPE_STYLE[theme.shape],
            }}
          />

          <div
            className="absolute inset-0 flex items-center justify-center gap-[4px]"
            style={{ paddingBottom: isHungry ? 0 : 2 }}
            aria-hidden
          >
            {[0, 1].map((eye) => (
              <span
                key={eye}
                className="rounded-full bg-slate-900"
                style={{
                  width: eyeSize,
                  height: isHungry ? eyeSize : eyeSize + 1,
                }}
              />
            ))}
          </div>
        </div>

        <div className="mt-auto mb-px h-[5px] w-[22px] overflow-hidden rounded-full bg-slate-950/70">
          <div
            className="h-full rounded-full transition-[width,background-color] duration-300"
            style={{
              width: `${wealthPercent}%`,
              backgroundColor: wealthBarColor(wealth),
            }}
          />
        </div>
      </div>
    </div>
  );
});
