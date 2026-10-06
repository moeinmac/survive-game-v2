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
      className="pointer-events-none absolute z-0 flex select-none items-center justify-center"
      style={{
        transform: `translate3d(${px}px, ${py}px, 0)`,
        width: CELL_SIZE,
        height: CELL_SIZE,
      }}
    >
      <div className="relative flex items-center justify-center">
        <Cookie className="h-3.5 w-3.5 text-amber-400" strokeWidth={2} />
        <span className="absolute -right-1 -bottom-1 rounded-sm border border-amber-500/30 bg-zinc-950/80 px-1 font-mono text-[9px] font-bold text-amber-300">
          {value}
        </span>
      </div>
    </div>
  );
});
