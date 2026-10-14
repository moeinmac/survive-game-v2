import { memo } from "react";
import { Cookie } from "lucide-react";
import { CELL_SIZE } from "../../constants/theme";

interface ResourceNodeProps {
  id: string;
  x: number;
  y: number;
  value: number;
}

export const ResourceNode = memo(function ResourceNode({
  x,
  y,
  value,
}: ResourceNodeProps) {
  const px = x * CELL_SIZE;
  const py = y * CELL_SIZE;

  return (
    <div
      className="pointer-events-none absolute z-20 flex select-none items-center justify-center"
      style={{
        transform: `translate3d(${px}px, ${py}px, 0)`,
        width: CELL_SIZE,
        height: CELL_SIZE,
      }}
    >
      <div className="cookie-pulse relative flex h-7 w-7 items-center justify-center rounded-full border border-amber-400/50 bg-amber-500/20 shadow-[0_0_12px_rgba(251,191,36,0.45)]">
        <Cookie className="h-4 w-4 text-amber-300" strokeWidth={2.25} />
        <span className="absolute -right-1 -bottom-1 rounded border border-amber-400/50 bg-zinc-950 px-1 font-mono text-[9px] font-bold text-amber-200">
          {value}
        </span>
      </div>
    </div>
  );
});
